import { useState, useRef, useId } from "react"
import { Link } from "react-router-dom"
import {
  UserCheck,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ArrowRight,
  X,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import aiService from "../../services/aiService"

const STATIC_ACTION_LIBRARY = {
  defense: {
    title: "NGUYÊN LÝ PHÒNG THỦ CHUYÊN SÂU",
    text: "Áp dụng cơ chế Defense-in-Depth: Tuyệt đối không tin tưởng dữ liệu đầu vào từ client. Tách biệt cấu trúc lệnh thực thi và dữ liệu bằng Prepared Statements / Parameter Binding và xác thực Whitelist nghiêm ngặt.",
    code: "stmt = db.prepare('SELECT * FROM users WHERE id = ?');\nstmt.execute([userId]);",
  },
  vector: {
    title: "CHUỖI TẤN CÔNG THỰC CHIẾN (TTPs)",
    text: "Kẻ tấn công khai thác điểm ghép chuỗi hoặc giải mã không an toàn để thay đổi luồng thực thi logic (AST Injection / SSRF / Token Forgery), qua mặt kiểm tra xác thực hoặc trích xuất dữ liệu nhạy cảm.",
    code: "GET /api/user?id=1%27%20UNION%20SELECT%20username,password_hash%20FROM%20users--",
  },
  remediation: {
    title: "QUY CHUẨN KHẮC PHỤC OWASP ASVS",
    text: "1. Chuẩn hóa Parameterized Queries / ORM an toàn.\n2. Xác thực đầu vào theo Whitelist Schema ở tầng máy chủ.\n3. Mã hóa đầu ra (Contextual Output Encoding) trước khi hiển thị.",
    code: "// Hardened Input Sanitization\nconst cleanInput = validator.escape(userInput.trim());",
  },
  pitfall: {
    title: "CẠM BẪY CẤU HÌNH PHỔ BIẾN",
    text: "Chỉ dùng Blacklist Filter (xóa từ khóa như 'SELECT', 'UNION', '<script>') rất dễ bị vượt qua bằng kỹ thuật lồng từ khóa (SELSELECTECT), mã hóa kép hoặc comment nội tuyến (UN/**/ION).",
    code: "// LỖI: str.replace('SELECT', '') => bypass bằng 'SELSELECTECT'",
  },
}

function buildStaticMentorFallback(actionId, topic, customQuery) {
  if (actionId !== "custom" && STATIC_ACTION_LIBRARY[actionId]) {
    const preset = STATIC_ACTION_LIBRARY[actionId]
    return {
      title: `${preset.title} · ${topic}`,
      text: preset.text,
      code: preset.code,
      recommendations: [],
      mode: "static",
    }
  }

  const q = String(customQuery || "").trim()
  const lower = `${q} ${topic}`.toLowerCase()

  if (/sql|union|sqli|query|db/.test(lower)) {
    return {
      title: "TRA CỨU PHÒNG THỦ SQL INJECTION",
      text: `Đối với truy vấn "${q}" trong chủ đề ${topic}: Bắt buộc sử dụng PreparedStatement / Parameterized Binding cho giá trị và Whitelist ánh xạ cứng cho tên cột / ORDER BY.`,
      code: "PreparedStatement ps = conn.prepareStatement(\"SELECT id, role FROM users WHERE id = ?\");\nps.setLong(1, userId);",
      recommendations: ["Bật kiểm tra phân quyền ở tầng truy cập dữ liệu (BOLA/IDOR check)."],
      mode: "static",
    }
  }

  if (/xss|dom|script|csp|html/.test(lower)) {
    return {
      title: "TRA CỨU PHÒNG THỦ XSS & CSP",
      text: `Đối với "${q}": Tránh gán dữ liệu vào innerHTML hoặc dangerouslySetInnerHTML. Sử dụng textContent kết hợp Content-Security-Policy (CSP) không cho phép unsafe-inline.`,
      code: "element.textContent = untrustedInput;",
      recommendations: ["Thiết lập Cookie HttpOnly để giảm thiểu rủi ro đánh cắp phiên khi xảy ra XSS."],
      mode: "static",
    }
  }

  if (/jwt|oauth|auth|csrf|session|token/.test(lower)) {
    return {
      title: "TRA CỨU XÁC THỰC & QUẢN LÝ PHIÊN",
      text: `Đối với "${q}": Khóa chặt thuật toán xác minh chữ ký JWT (từ chối alg=none), dùng Cookie HttpOnly + Secure + SameSite=Lax và bảo vệ Endpoint thay đổi trạng thái bằng Anti-CSRF Token.`,
      code: "Cookie: session=opaque; HttpOnly; Secure; SameSite=Lax",
      recommendations: ["Xoay vòng Refresh Token (Rotation) và thu hồi khi phát hiện tái sử dụng."],
      mode: "static",
    }
  }

  return {
    title: "TÀI LIỆU THAM KHẢO CHIẾN THUẬT",
    text: `Hướng dẫn phòng thủ cho "${q}" (${topic}): Áp dụng nguyên tắc Đặc quyền Tối thiểu (Least Privilege), kiểm tra đầu vào theo Whitelist tại ranh giới tin cậy và lưu nhật ký kiểm toán chống chối bỏ.`,
    code: null,
    recommendations: ["Chuyển tới AI Workbench để phân tích chuyên sâu với mã nguồn hoặc log thực tế."],
    mode: "static",
  }
}

function classifyMentorError(errorMsg) {
  const msg = String(errorMsg || "").toLowerCase()
  if (
    msg.includes("prompt injection") ||
    msg.includes("injection attempt") ||
    msg.includes("security compliance") ||
    msg.includes("rejected") ||
    msg.includes("không có quyền")
  ) {
    return {
      kind: "PROMPT_INJECTION",
      message:
        "Bộ lọc Prompt Injection đã chặn yêu cầu (400/403) do phát hiện mẫu chỉ thị vượt rào. Vui lòng điều chỉnh câu hỏi học thuật hợp lệ.",
    }
  }
  if (
    msg.includes("quá nhiều yêu cầu") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("tần suất")
  ) {
    return {
      kind: "QUOTA_EXCEEDED",
      message:
        "Đã chạm ngưỡng giới hạn lượt suy luận AI (429). Đang hiển thị tài liệu tham khảo tĩnh thay thế.",
    }
  }
  return { kind: "FALLBACK" }
}

/**
 * Tactical Security Intelligence & Academic Mentor
 *
 * Kết nối trực tiếp tới aiService (exploit-hint / chat) khi đã đăng nhập,
 * đồng thời cung cấp bộ Tài liệu Tham khảo Tĩnh thông minh khi ở chế độ Khách hoặc ngoại tuyến.
 */
export function ContextualAIMentor({
  topic = "Khái niệm hiện tại",
  contextDescription = "Tình báo thực địa & hướng dẫn khắc phục lỗ hổng bảo mật trực tiếp theo chuẩn OWASP / MITRE ATT&CK.",
  suggestedActions = [
    { label: "Nguyên lý phòng thủ", icon: ShieldCheck, id: "defense" },
    { label: "Ghi chú thực địa", icon: FileText, id: "vector" },
    { label: "Khắc phục chuẩn OWASP", icon: CheckCircle2, id: "remediation" },
    { label: "Cạm bẫy cấu hình", icon: AlertTriangle, id: "pitfall" },
  ],
  compact = false,
  className = "",
}) {
  const { isAuthenticated } = useAuth()
  const inputId = useId()

  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [customQuestion, setCustomQuestion] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [responsePanel, setResponsePanel] = useState(null)
  const [guardrailNotice, setGuardrailNotice] = useState(null)

  const requestSeqRef = useRef(0)

  const headerModeIsLive =
    responsePanel ? responsePanel.mode === "live" : isAuthenticated

  const executeMentorQuery = async ({ promptId, actionLabel, queryText, useChatEndpoint }) => {
    const seq = ++requestSeqRef.current
    setSelectedPrompt(promptId)
    setIsExpanded(true)
    setGuardrailNotice(null)

    if (!isAuthenticated) {
      setResponsePanel(buildStaticMentorFallback(promptId, topic, queryText))
      return
    }

    setIsLoading(true)
    try {
      const result = useChatEndpoint
        ? await aiService.chat(
            `Ngữ cảnh học phần: ${topic}. ${contextDescription}\nCâu hỏi nghiên cứu: ${queryText}`,
            "GEMINI_3_8_HIGH"
          )
        : await aiService.getExploitHint(
            `[${actionLabel}] Chủ đề: ${topic}. Hãy phân tích ngắn gọn, súc tích theo chuẩn OWASP/MITRE ATT&CK.`,
            contextDescription
          )

      if (requestSeqRef.current !== seq) return

      if (result?.success && result.data) {
        const data = result.data
        setResponsePanel({
          title: data.title || actionLabel || "PHÂN TÍCH TỪ LIVE AI",
          text: data.analysisResult || "",
          recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
          keyFindings: Array.isArray(data.keyFindings) ? data.keyFindings : [],
          provider: data.provider,
          processingTimeMs: data.processingTimeMs,
          code: null,
          mode: "live",
        })
      } else {
        const classified = classifyMentorError(result?.error)
        if (classified.kind === "PROMPT_INJECTION") {
          setGuardrailNotice({ kind: "PROMPT_INJECTION", message: classified.message })
          setResponsePanel(null)
        } else {
          if (classified.kind === "QUOTA_EXCEEDED") {
            setGuardrailNotice({ kind: "QUOTA_EXCEEDED", message: classified.message })
          }
          setResponsePanel(buildStaticMentorFallback(promptId, topic, queryText))
        }
      }
    } finally {
      if (requestSeqRef.current === seq) {
        setIsLoading(false)
      }
    }
  }

  const handleActionClick = (action) => {
    executeMentorQuery({
      promptId: action.id,
      actionLabel: action.label,
      queryText: action.label,
      useChatEndpoint: false,
    })
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const trimmed = customQuestion.trim()
    if (!trimmed) return
    executeMentorQuery({
      promptId: "custom",
      actionLabel: "TRA CỨU NGỮ CẢNH",
      queryText: trimmed,
      useChatEndpoint: true,
    })
  }

  return (
    <div
      className={`
        rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08]
        bg-white dark:bg-[#121722]
        ${compact ? "p-3 sm:p-3.5" : "p-4 sm:p-5"} shadow-xs
        transition-colors duration-200 text-[#0F172A] dark:text-[#F1F5F9]
        ${className}
      `.trim()}
    >
      {/* Header: Editorial Intelligence branding */}
      <div className="flex items-start justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8] dark:bg-[#2563EB] text-white border border-[#1E40AF]/20 dark:border-white/[0.12]">
            <UserCheck className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F1F5F9]">
                SỔ TAY TÁC CHIẾN // SOC INTEL
              </h3>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                  headerModeIsLive
                    ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/25"
                    : "text-[#475569] dark:text-[#94A3B8] bg-[#F3F1EC] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.09]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    headerModeIsLive ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {headerModeIsLive ? "Live AI" : "Tài liệu Tham khảo Tĩnh"}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium truncate mt-0.5">
              Chủ đề:{" "}
              <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{topic}</span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-3.5">
        {contextDescription}
      </p>

      {/* Action Chips */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {suggestedActions.map((action) => {
          const Icon = action.icon || ShieldCheck
          const isCurrent = selectedPrompt === action.id

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer border select-none
                ${
                  isCurrent
                    ? "bg-[#1D4ED8]/10 dark:bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#38BDF8] border-[#1D4ED8]/40 dark:border-[#3B82F6]/50 font-semibold"
                    : "bg-[#FAF9F6] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6]"
                }
              `.trim()}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span className="truncate">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Expanded Knowledge Panel */}
      {isExpanded && (
        <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8] flex items-center gap-1.5 min-w-0 truncate">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {isLoading
                  ? "ĐANG TRUY VẤN AI SECURITY ROUTER..."
                  : responsePanel?.title || "CẢNH BÁO BẢO MẬT"}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer shrink-0"
              aria-label="Đóng"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {guardrailNotice && (
            <div
              className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
                guardrailNotice.kind === "PROMPT_INJECTION"
                  ? "bg-rose-50 dark:bg-rose-500/12 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200"
                  : "bg-amber-50 dark:bg-amber-500/12 border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200"
              }`}
            >
              {guardrailNotice.kind === "PROMPT_INJECTION" ? (
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              )}
              <span>{guardrailNotice.message}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs text-[#475569] dark:text-[#94A3B8]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>Đang tổng hợp hướng dẫn theo ngữ cảnh...</span>
            </div>
          ) : (
            responsePanel && (
              <>
                <p className="text-xs text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed whitespace-pre-line">
                  {responsePanel.text}
                </p>

                {Array.isArray(responsePanel.keyFindings) &&
                  responsePanel.keyFindings.length > 0 && (
                    <ul className="space-y-1 pl-4 list-disc text-[11px] text-[#475569] dark:text-[#94A3B8]">
                      {responsePanel.keyFindings.slice(0, 3).map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  )}

                {Array.isArray(responsePanel.recommendations) &&
                  responsePanel.recommendations.length > 0 && (
                    <div className="pt-1 border-t border-[#EFEDE7] dark:border-white/[0.06] space-y-1">
                      {responsePanel.recommendations.slice(0, 2).map((rec, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-300"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}

                {responsePanel.code && (
                  <div className="p-2.5 rounded-lg bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] font-mono-tech text-[11px] overflow-x-auto text-slate-100">
                    <pre className="m-0">{responsePanel.code}</pre>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between gap-2 text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
                  <span>
                    {responsePanel.mode === "live"
                      ? `${responsePanel.provider || "AI_ROUTER"} · ${responsePanel.processingTimeMs ?? 0} ms`
                      : "Nguồn: Tài liệu Tham khảo Tĩnh"}
                  </span>
                  <Link
                    to="/workbench"
                    className="inline-flex items-center gap-1 font-sans text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                  >
                    <span>Mở AI Workbench</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </>
            )
          )}
        </div>
      )}

      {/* Quick Search Input */}
      <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
        <input
          id={inputId}
          name="mentorQuery"
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Tra cứu mã lỗi, kỹ thuật bypass, rule..."
          aria-label="Tra cứu nhanh tình báo bảo mật"
          className="flex-1 rounded-xl border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#0B0E14] px-3 py-1.5 text-xs text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-[#1D4ED8] dark:bg-[#2563EB] hover:bg-[#1E40AF] dark:hover:bg-[#3B82F6] disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer select-none shrink-0"
        >
          Tra cứu
        </button>
      </form>
    </div>
  )
}

export default ContextualAIMentor
