import { useState } from "react"
import { UserCheck, BookOpen, FileText, CheckCircle2, AlertTriangle, ShieldCheck, X } from "lucide-react"

/**
 * Tactical Security Intelligence & Field Advisory
 * 
 * Replaces generic AI chatbot hype with authentic SOC defense intelligence,
 * threat vector analysis, and concrete remediation patterns.
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
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [customQuestion, setCustomQuestion] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const sampleResponses = {
    defense: {
      title: "NGUYÊN LÝ PHÒNG THỦ CHUYÊN SÂU",
      text: "Áp dụng cơ chế Defense-in-Depth: Tuyệt đối không tin tưởng dữ liệu đầu vào từ client. Sử dụng cơ chế Parameterized Queries & Prepared Statements để tách biệt hoàn toàn giữa cấu trúc lệnh thực thi và dữ liệu người dùng.",
      code: "stmt = db.prepare('SELECT * FROM users WHERE id = ?');\nstmt.execute([userId]);",
    },
    vector: {
      title: "CHUỖI TẤN CÔNG THỰC CHIẾN (TTPs)",
      text: "Kẻ tấn công lợi dụng chuỗi nối chuỗi không an toàn để chèn ký tự đặc biệt (' OR 1=1 --) nhằm thay đổi cây cú pháp phân tích SQL Parser, bỏ qua kiểm tra mật khẩu và trích xuất dữ liệu nhạy cảm.",
      code: "GET /api/user?id=1%27%20UNION%20SELECT%20username,password_hash%20FROM%20users--",
    },
    remediation: {
      title: "QUY CHUẨN KHẮC PHỤC OWASP TOP 10",
      text: "1. Sử dụng ORM hoặc Prepared Statements chuẩn hóa.\n2. Thực hiện whitelist validation trên các trường bắt buộc.\n3. Mã hóa đầu ra (Output Encoding) theo ngữ cảnh trước khi render lên DOM.",
      code: "// Hardened Input Sanitization\nconst cleanInput = validator.escape(userInput.trim());",
    },
    pitfall: {
      title: "CẠM BẪY BẢO MẬT PHỔ BIẾN",
      text: "Chỉ sử dụng Blacklist Filter (loại bỏ từ khóa như 'SELECT', 'UNION') là sai lầm nguy hiểm. Kẻ tấn công có thể dễ dàng vượt qua bằng kỹ thuật lồng từ khóa (UN/**/ION) hoặc alternate character encodings.",
      code: "// LỖI: str.replace('SELECT', '') => bypass bằng 'SELSELECTECT'",
    },
  }

  const handleActionClick = (actionId) => {
    setSelectedPrompt(actionId)
    setIsExpanded(true)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customQuestion.trim()) return
    setSelectedPrompt("custom")
    setIsExpanded(true)
  }

  return (
    <div
      className={`
        rounded-2xl border border-blue-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/50
        bg-white dark:bg-[#111827] cyberpunk:bg-[#060e1d]
        ${compact ? "p-3 sm:p-3.5" : "p-4 sm:p-5"} shadow-xs cyberpunk:shadow-sm
        transition-all duration-200 text-slate-900 dark:text-white cyberpunk:text-cyan-50
        ${className}
      `.trim()}
    >
      {/* Header: Tactical Intelligence branding */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500 cyberpunk:bg-cyan-500 text-white cyberpunk:text-slate-950 shadow-xs cyberpunk:shadow-sm">
            <UserCheck className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white cyberpunk:text-cyan-50">
                SỔ TAY TÁC CHIẾN // SOC INTEL
              </h3>
              <span className="text-[10px] font-mono-tech font-bold text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 cyberpunk:bg-[#042f2e] border border-emerald-200 dark:border-emerald-800 cyberpunk:border-emerald-500/60 px-1.5 py-0.2 rounded">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/90 font-medium">
              Chủ đề: <span className="font-semibold text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100">{topic}</span>
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200/90 leading-relaxed mb-3.5">
        {contextDescription}
      </p>

      {/* Action Chips */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {suggestedActions.map((action) => {
          const Icon = action.icon
          const isCurrent = selectedPrompt === action.id

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer border select-none
                ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-950/70 cyberpunk:bg-cyan-950/80 text-blue-700 dark:text-blue-300 cyberpunk:text-cyan-300 border-blue-300 dark:border-blue-700 cyberpunk:border-cyan-400 font-semibold shadow-2xs cyberpunk:shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800/80 cyberpunk:bg-[#071329] text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-200 border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/30 hover:border-blue-300 dark:hover:border-slate-600 cyberpunk:hover:border-cyan-400"
                }
              `.trim()}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400 cyberpunk:text-cyan-400" />
              <span className="truncate">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Expanded Knowledge Panel */}
      {isExpanded && selectedPrompt && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 cyberpunk:bg-[#071329] border border-blue-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/50 space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tech font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400 cyberpunk:text-cyan-300 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {sampleResponses[selectedPrompt]?.title || "TRA CỨU CHIẾN THUẬT"}
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100 leading-relaxed whitespace-pre-line">
            {sampleResponses[selectedPrompt]?.text ||
              `Hướng dẫn phòng thủ cho yêu cầu "${customQuestion}": Áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege) và kiểm tra toàn vẹn chữ ký dữ liệu.`}
          </p>

          {sampleResponses[selectedPrompt]?.code && (
            <div className="p-2.5 rounded-lg bg-slate-900 text-slate-100 dark:bg-black cyberpunk:bg-[#02050f] border border-slate-800 cyberpunk:border-cyan-500/40 font-mono text-[11px] overflow-x-auto text-emerald-400 dark:text-emerald-300 cyberpunk:text-cyan-300">
              <pre className="m-0">{sampleResponses[selectedPrompt].code}</pre>
            </div>
          )}
        </div>
      )}

      {/* Quick Search Input */}
      <form onSubmit={handleCustomSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Tra cứu mã lỗi, kỹ thuật bypass, rule..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 bg-slate-50 dark:bg-slate-800/90 cyberpunk:bg-[#071329] px-3 py-1.5 text-xs text-slate-900 dark:text-white cyberpunk:text-cyan-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 cyberpunk:placeholder:text-cyan-500/60 outline-none focus:border-blue-600 dark:focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-xl bg-blue-600 dark:bg-blue-500 cyberpunk:bg-cyan-500 hover:bg-blue-700 cyberpunk:hover:bg-cyan-400 text-white cyberpunk:text-slate-950 text-xs font-semibold transition cursor-pointer select-none"
        >
          Tra cứu
        </button>
      </form>
    </div>
  )
}

export default ContextualAIMentor
