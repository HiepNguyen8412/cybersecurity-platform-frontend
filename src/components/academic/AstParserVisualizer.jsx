import { useId, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"

const MODE_CONFIG = {
  sqli: {
    id: "sqli",
    label: "SQL Injection (CWE-89)",
    shortLabel: "SQLi · CWE-89",
    defaultPayload: "' OR 1=1 --",
    inputLabel: "Đầu vào tham số username",
    placeholder: "Nhập chuỗi kiểm thử SQLi...",
    presets: [
      { label: "' OR 1=1 --", value: "' OR 1=1 --", kind: "attack" },
      { label: "' UNION SELECT NULL--", value: "' UNION SELECT NULL--", kind: "attack" },
      { label: "admin'/*", value: "admin'/*", kind: "attack" },
      { label: "nguyen.an", value: "nguyen.an", kind: "benign" },
    ],
  },
  xss: {
    id: "xss",
    label: "DOM XSS (CWE-79)",
    shortLabel: "DOM XSS · CWE-79",
    defaultPayload: '<img src=x onerror="alert(document.cookie)">',
    inputLabel: "Tham số URL ?name= đưa vào DOM",
    placeholder: "Nhập chuỗi kiểm thử DOM XSS...",
    presets: [
      {
        label: '<img src=x onerror="...">',
        value: '<img src=x onerror="alert(document.cookie)">',
        kind: "attack",
      },
      {
        label: '"><script>fetch(...)</script>',
        value: '"><script>fetch("/api/token")</script>',
        kind: "attack",
      },
      {
        label: "<svg onload=alert(1)>",
        value: "<svg onload=alert(1)>",
        kind: "attack",
      },
      {
        label: "Trần Minh Khoa",
        value: "Trần Minh Khoa",
        kind: "benign",
      },
    ],
  },
}

const SQL_KEYWORDS = new Set([
  "OR",
  "AND",
  "UNION",
  "SELECT",
  "FROM",
  "WHERE",
  "DROP",
  "DELETE",
  "INSERT",
  "UPDATE",
  "NULL",
  "SLEEP",
  "EXEC",
  "HAVING",
  "ORDER",
  "BY",
])

function detectInitialMode(payload) {
  const text = (payload || "").toLowerCase()
  if (
    text.includes("<") ||
    text.includes("onerror") ||
    text.includes("onload") ||
    text.includes("javascript:") ||
    text.includes("script")
  ) {
    return "xss"
  }
  return "sqli"
}

function tokenizeSql(input) {
  const source = (input || "").trim()
  if (!source) {
    return {
      isVulnerable: false,
      tokens: [{ text: "<empty>", type: "EMPTY_INPUT", role: "normal" }],
      vulnerableCode: "SELECT id, role FROM users WHERE username = ''",
      vulnerableAst: 'WhereClause(Eq(col:username, LiteralString("")))',
      safeAst: 'PlaceholderBind(?1) -> LiteralLeaf("")',
      summary: "Chuỗi rỗng không chứa siêu ký tự thoát ngữ cảnh câu lệnh SQL.",
    }
  }

  const specs = [
    { regex: /^--/, type: "SQL_LINE_COMMENT", role: "delimiter" },
    { regex: /^\/\*/, type: "SQL_BLOCK_COMMENT", role: "delimiter" },
    { regex: /^\*\//, type: "SQL_COMMENT_END", role: "delimiter" },
    { regex: /^['"]/, type: "STRING_DELIMITER", role: "delimiter" },
    { regex: /^;/, type: "STMT_TERMINATOR", role: "delimiter" },
    { regex: /^=/, type: "COMPARISON_OP", role: "keyword" },
    { regex: /^\s+/, type: "WS", role: "ws" },
    { regex: /^[a-zA-Z_][a-zA-Z0-9_.]*/, type: "WORD", role: "normal" },
    { regex: /^[0-9]+/, type: "NUMERIC_LITERAL", role: "normal" },
    { regex: /^./, type: "SYMBOL", role: "normal" },
  ]

  const tokens = []
  let rest = source
  while (rest.length > 0) {
    let matched = false
    for (const spec of specs) {
      const m = rest.match(spec.regex)
      if (m) {
        const text = m[0]
        if (spec.type !== "WS") {
          if (spec.type === "WORD") {
            const upper = text.toUpperCase()
            if (SQL_KEYWORDS.has(upper)) {
              tokens.push({
                text,
                type: upper === "NULL" ? "NULL_LITERAL" : "SQL_KEYWORD",
                role: "keyword",
              })
            } else {
              tokens.push({ text, type: "IDENTIFIER", role: "normal" })
            }
          } else {
            tokens.push({ text, type: spec.type, role: spec.role })
          }
        }
        rest = rest.slice(text.length)
        matched = true
        break
      }
    }
    if (!matched) break
  }

  const hasDelimiterBreak = tokens.some((t) => t.role === "delimiter")
  const hasSqlKeyword = tokens.some((t) => t.role === "keyword")
  const isVulnerable = hasDelimiterBreak || (hasSqlKeyword && tokens.length > 1)

  const dangerousBranch = tokens
    .filter((t) => t.role !== "normal")
    .map((t) => t.text)
    .slice(0, 5)
    .join(" ")

  return {
    isVulnerable,
    tokens,
    vulnerableCode: `SELECT id, role FROM users WHERE username = '${source}'`,
    vulnerableAst: isVulnerable
      ? `WhereClause(BinaryExpr(Eq(col:username, "..."), InjectedBranch(${dangerousBranch || "SQL_META"})))`
      : `WhereClause(Eq(col:username, LiteralString("${source}")))`,
    safeAst: `PreparedStmt -> PlaceholderBind(?1) -> LiteralLeaf("${source}")`,
    summary: isVulnerable
      ? "Dấu phân tách chuỗi (', --, /*) kết hợp từ khóa SQL phá vỡ ranh giới LiteralString và biến dữ liệu thành nhánh logic trong AST."
      : "Đầu vào không thoát khỏi chuỗi nháy đơn; cây cú pháp giữ nguyên nhánh so sánh đơn.",
  }
}

function tokenizeXss(input) {
  const source = (input || "").trim()
  if (!source) {
    return {
      isVulnerable: false,
      tokens: [{ text: "<empty>", type: "EMPTY_INPUT", role: "normal" }],
      vulnerableCode: 'el.innerHTML = "Xin chào <b></b>";',
      vulnerableAst: 'Element(b) -> TextNode("")',
      safeAst: 'Element(b) -> CharacterData("#text", "")',
      summary: "Chuỗi rỗng chỉ tạo TextNode tĩnh, không kích hoạt bộ phân giải thẻ HTML.",
    }
  }

  const specs = [
    { regex: /^<\/?[a-zA-Z][a-zA-Z0-9-]*/, type: "HTML_TAG_TOKEN", role: "delimiter" },
    { regex: /^\/?>/, type: "TAG_CLOSE", role: "delimiter" },
    { regex: /^["']/, type: "ATTR_QUOTE_BREAK", role: "delimiter" },
    { regex: /^on[a-z]+\s*=/i, type: "EVENT_HANDLER_SINK", role: "keyword" },
    { regex: /^javascript\s*:/i, type: "JS_URI_SCHEME", role: "keyword" },
    { regex: /^(alert|confirm|prompt|eval|fetch|document\.cookie)/i, type: "DOM_JS_CALL", role: "keyword" },
    { regex: /^\s+/, type: "WS", role: "ws" },
    { regex: /^[a-zA-Z0-9_.\-/]+/, type: "ATTR_OR_TEXT", role: "normal" },
    { regex: /^./, type: "PUNCTUATION", role: "normal" },
  ]

  const tokens = []
  let rest = source
  while (rest.length > 0) {
    let matched = false
    for (const spec of specs) {
      const m = rest.match(spec.regex)
      if (m) {
        const text = m[0]
        if (spec.type !== "WS") {
          const isDangerousTag =
            spec.type === "HTML_TAG_TOKEN" &&
            /^<\/?(script|img|svg|iframe|object|body|details)/i.test(text)
          tokens.push({
            text,
            type: isDangerousTag ? "EXECUTABLE_TAG" : spec.type,
            role: isDangerousTag ? "keyword" : spec.role,
          })
        }
        rest = rest.slice(text.length)
        matched = true
        break
      }
    }
    if (!matched) break
  }

  const hasTagOrQuoteBreak = tokens.some((t) => t.role === "delimiter")
  const hasSinkToken = tokens.some((t) => t.role === "keyword")
  const isVulnerable = hasSinkToken || (hasTagOrQuoteBreak && /<|>|"|'/.test(source))

  const mutatedNodes = tokens
    .filter((t) => t.role !== "normal")
    .map((t) => t.text)
    .slice(0, 4)
    .join(" ")

  return {
    isVulnerable,
    tokens,
    vulnerableCode: `document.getElementById('greeting').innerHTML = \`Xin chào <b>\${input}</b>\`;`,
    vulnerableAst: isVulnerable
      ? `DOMMutation(Element(b), InjectedSubtree(${mutatedNodes || "HTML_NODE"}) -> JSSink)`
      : `DOMTree(Element(b) -> TextNode("${source}"))`,
    safeAst: `SafeDOMSink(textContent) -> InertTextNode("${source}")`,
    summary: isVulnerable
      ? "Ký tự mở thẻ (<, >) hoặc thoát thuộc tính (\") chèn nút HTML mới kèm sự kiện thực thi JS (onerror/onload/<script>) vào DOM."
      : "Dữ liệu không chứa thẻ hoặc bộ xử lý sự kiện; tuy nhiên chỉ textContent mới đảm bảo cô lập tuyệt đối.",
  }
}

export function AstParserVisualizer({
  initialPayload = "' OR 1=1 --",
  compact = false,
  className = "",
}) {
  const initialMode = detectInitialMode(initialPayload)
  const [prevInitialPayload, setPrevInitialPayload] = useState(initialPayload)
  const [mode, setMode] = useState(initialMode)
  const [payloads, setPayloads] = useState({
    sqli: initialMode === "sqli" ? initialPayload : MODE_CONFIG.sqli.defaultPayload,
    xss: initialMode === "xss" ? initialPayload : MODE_CONFIG.xss.defaultPayload,
  })

  if (initialPayload !== prevInitialPayload) {
    setPrevInitialPayload(initialPayload)
    const nextMode = detectInitialMode(initialPayload)
    setMode(nextMode)
    setPayloads((prev) => ({
      ...prev,
      [nextMode]: initialPayload || MODE_CONFIG[nextMode].defaultPayload,
    }))
  }

  const uid = useId()
  const inputId = `ast-payload-input-${uid}`
  const activeConfig = MODE_CONFIG[mode]
  const currentPayload = payloads[mode]

  const analysis = useMemo(
    () => (mode === "sqli" ? tokenizeSql(currentPayload) : tokenizeXss(currentPayload)),
    [mode, currentPayload]
  )

  const handlePayloadChange = (nextValue) => {
    setPayloads((prev) => ({
      ...prev,
      [mode]: nextValue,
    }))
  }

  const handleReset = () => {
    setPayloads((prev) => ({
      ...prev,
      [mode]: activeConfig.defaultPayload,
    }))
  }

  return (
    <section
      aria-label="Trình phân tích từ vựng và cây cú pháp AST"
      className={`rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] overflow-hidden shadow-xs ${className}`.trim()}
    >
      {/* Header Bar & Mode Switcher */}
      <div
        className={`${
          compact ? "px-4 py-3" : "px-5 py-3.5"
        } bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Code2
            className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0"
            strokeWidth={1.6}
          />
          <div className="min-w-0">
            <h3 className="font-mono-tech text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight truncate">
              LEXER &amp; AST ISOLATION INSPECTOR
            </h3>
            {!compact && (
              <p className="font-sans text-[11px] text-[#475569] dark:text-[#94A3B8]">
                Quan sát ranh giới phân tách dữ liệu và cấu trúc thực thi trên trình phân tích cú pháp
              </p>
            )}
          </div>
        </div>

        {/* Mode Switcher */}
        <div
          role="tablist"
          aria-label="Chọn loại lỗ hổng phân tích"
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08]"
        >
          {[MODE_CONFIG.sqli, MODE_CONFIG.xss].map((item) => {
            const active = mode === item.id
            const Icon = item.id === "sqli" ? Database : Globe
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(item.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono-tech text-[11px] whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white font-semibold"
                    : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
                <span>{compact ? item.shortLabel : item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className={`${compact ? "p-4 space-y-4" : "p-5 sm:p-6 space-y-5"}`}>
        {/* Payload Input & Status */}
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor={inputId}
              className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] font-medium"
            >
              {activeConfig.inputLabel}
            </label>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-semibold px-2.5 py-1 rounded border whitespace-nowrap ${
                  analysis.isVulnerable
                    ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30"
                    : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                }`}
              >
                {analysis.isVulnerable ? (
                  <>
                    <AlertTriangle className="h-3 w-3 shrink-0" strokeWidth={1.7} />
                    <span>
                      {mode === "sqli" ? "ĐỘT BIẾN AST · CWE-89" : "CHÈN SINK DOM · CWE-79"}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3 shrink-0" strokeWidth={1.7} />
                    <span>DỮ LIỆU THUẦN TÚY</span>
                  </>
                )}
              </span>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2 py-1 rounded border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] font-mono-tech text-[10px] whitespace-nowrap cursor-pointer transition-colors"
                title="Khôi phục mẫu mặc định"
              >
                <RotateCcw className="h-3 w-3 shrink-0" strokeWidth={1.6} />
                <span>Đặt lại</span>
              </button>
            </div>
          </div>

          <input
            id={inputId}
            name={`astPayload_${mode}`}
            type="text"
            value={currentPayload}
            onChange={(e) => handlePayloadChange(e.target.value)}
            placeholder={activeConfig.placeholder}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.1] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] font-mono-tech text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9]"
          />

          {/* Preset Payloads */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mr-1">
              Mẫu thử:
            </span>
            {activeConfig.presets.map((preset) => {
              const selected = currentPayload === preset.value
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handlePayloadChange(preset.value)}
                  className={`font-mono-tech text-[11px] px-2.5 py-1 rounded border whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#1D4ED8]/10 dark:bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#38BDF8] border-[#1D4ED8]/40 dark:border-[#3B82F6]/40 font-semibold"
                      : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Lexical Tokenization Stream */}
        <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-semibold">
              1. Luồng phân tách từ vựng (Lexical Token Stream)
            </span>
            <div className="flex flex-wrap items-center gap-3 font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-xs bg-rose-500" aria-hidden="true" />
                <span>Thoát dấu phân tách</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-xs bg-amber-500" aria-hidden="true" />
                <span>Từ khóa / Sink</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-xs bg-slate-400" aria-hidden="true" />
                <span>Văn bản thường</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.tokens.map((tok, idx) => {
              const roleClass =
                tok.role === "delimiter"
                  ? "bg-rose-50 dark:bg-rose-950/35 border-rose-200 dark:border-rose-500/35 text-rose-800 dark:text-rose-200"
                  : tok.role === "keyword"
                  ? "bg-amber-50 dark:bg-amber-950/35 border-amber-200 dark:border-amber-500/35 text-amber-800 dark:text-amber-200"
                  : "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9]"

              return (
                <div
                  key={`${tok.type}-${idx}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono-tech text-[11px] ${roleClass}`}
                >
                  <span className="font-semibold break-all">{tok.text}</span>
                  <span className="text-[9px] opacity-75">[{tok.type}]</span>
                </div>
              )
            })}
          </div>

          <p className="font-sans text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed pt-1 border-t border-[#E5E2DC] dark:border-white/[0.06]">
            {analysis.summary}
          </p>
        </div>

        {/* Side-by-Side Vulnerable AST vs Safe Isolation Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Vulnerable Card */}
          <div className="p-4 rounded-lg border border-rose-200/90 dark:border-rose-500/30 bg-rose-50/45 dark:bg-rose-950/15 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  {mode === "sqli"
                    ? "Ghép chuỗi thô (Đột biến AST)"
                    : "Gán innerHTML (Đột biến cây DOM)"}
                </span>
                <AlertTriangle
                  className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 shrink-0"
                  strokeWidth={1.7}
                />
              </div>
              <pre className="p-2.5 rounded bg-white/80 dark:bg-[#0B0E14]/90 border border-rose-200/70 dark:border-rose-500/20 font-mono-tech text-[11px] text-[#0F172A] dark:text-[#F1F5F9] whitespace-pre-wrap break-all leading-relaxed">
                {analysis.vulnerableCode}
              </pre>
            </div>
            <div className="font-mono-tech text-[10px] text-rose-700 dark:text-rose-300 pt-2 border-t border-rose-200/60 dark:border-rose-500/20 break-words leading-relaxed">
              <span className="font-semibold">AST: </span>
              {analysis.vulnerableAst}
            </div>
          </div>

          {/* Safe Isolation Card */}
          <div className="p-4 rounded-lg border border-emerald-200/90 dark:border-emerald-500/30 bg-emerald-50/45 dark:bg-emerald-950/15 space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  {mode === "sqli"
                    ? "PreparedStatement (Cô lập AST)"
                    : "textContent (Cô lập TextNode)"}
                </span>
                <ShieldCheck
                  className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                  strokeWidth={1.7}
                />
              </div>
              <pre className="p-2.5 rounded bg-white/80 dark:bg-[#0B0E14]/90 border border-emerald-200/70 dark:border-emerald-500/20 font-mono-tech text-[11px] text-[#0F172A] dark:text-[#F1F5F9] whitespace-pre-wrap break-all leading-relaxed">
                {mode === "sqli"
                  ? 'stmt = conn.prepareStatement("SELECT id, role FROM users WHERE username = ?");\nstmt.setString(1, input);'
                  : "const el = document.getElementById('greeting');\nel.textContent = input; // Không phân giải HTML"}
              </pre>
            </div>
            <div className="font-mono-tech text-[10px] text-emerald-700 dark:text-emerald-300 pt-2 border-t border-emerald-200/60 dark:border-emerald-500/20 break-words leading-relaxed">
              <span className="font-semibold">AST: </span>
              {analysis.safeAst}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AstParserVisualizer
