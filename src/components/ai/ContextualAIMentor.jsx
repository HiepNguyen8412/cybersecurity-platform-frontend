import { useState } from "react"
import { Terminal, ShieldAlert, MessageSquare, ChevronRight, HelpCircle, Lightbulb, BookOpen, AlertCircle, X } from "lucide-react"

/**
 * Contextual Tactical Security Advisor
 * 
 * Appears contextually inside learning workflows (Lessons, Quizzes, Lab Workspaces, Explanations).
 * Focused on defensive tactics, exploit triage, and secure architecture:
 * - "Explain simply"
 * - "Give me an example"
 * - "Give me a hint"
 * - "Explain my mistake"
 * - "Tactical Query"
 */
export function ContextualAIMentor({
  topic = "Current Concept",
  contextDescription = "Cần hỗ trợ phân tích chiến thuật an ninh mạng? Chọn câu hỏi gợi ý bên dưới hoặc tra cứu trực tiếp.",
  suggestedActions = [
    { label: "Giải thích đơn giản", icon: Lightbulb, id: "simple" },
    { label: "Ví dụ thực chiến", icon: BookOpen, id: "example" },
    { label: "Gợi ý chiến thuật", icon: HelpCircle, id: "hint" },
    { label: "Lỗi thường gặp", icon: AlertCircle, id: "mistake" },
  ],
  compact = false,
  className = "",
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [customQuestion, setCustomQuestion] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  // Contextual simulated responses for visual demonstration
  const sampleResponses = {
    simple: {
      title: "Giải Thích Cốt Lõi Chiến Thuật",
      text: "Hãy hình dung cơ chế này giống như một trạm kiểm soát an ninh nghiêm ngặt: thay vì chỉ tin tưởng thông tin người tới khai báo, hệ thống phải đối chiếu chữ ký số và phân quyền độc lập trước khi mở khóa tài nguyên.",
    },
    example: {
      title: "Kịch Bản Khai Thác Thực Tế",
      text: "Trong một form đăng nhập, nếu người dùng nhập 'admin' --' vào ô tài khoản, câu lệnh SQL chưa được tham số hóa sẽ coi hai dấu gạch ngang là ghi chú, bỏ qua hoàn toàn bước kiểm tra mật khẩu.",
    },
    hint: {
      title: "Gợi Ý Phân Tích Phòng Thủ",
      text: "Hãy xem xét kỹ vị trí thực thi mã. Dữ liệu đầu vào có được xác thực và lọc tại server-side hay chỉ đang phụ thuộc vào kiểm tra tại trình duyệt client?",
    },
    mistake: {
      title: "Cạm Bẫy Bảo Mật Phổ Biến",
      text: "Sai lầm thường gặp nhất là chỉ dùng Blacklist để chặn từ khóa nguy hiểm. Kẻ tấn công có thể dễ dàng dùng kỹ thuật nested comments (e.g. UN/**/ION) hoặc alternate encodings để vượt qua.",
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
        rounded-2xl border border-blue-100 dark:border-slate-800 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900/90 dark:via-slate-900/90 dark:to-slate-950 p-4 sm:p-5
        shadow-sm transition-all duration-200 text-slate-900 dark:text-white
        ${className}
      `.trim()}
    >
      {/* Header: Tactical Advisor branding and current context */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Cố Vấn Tác Chiến An Ninh</span>
              <span className="text-[10px] font-mono font-semibold text-blue-700 dark:text-cyan-400 bg-blue-100/70 dark:bg-cyan-950/60 border border-blue-200/60 dark:border-cyan-800/40 px-1.5 py-0.2 rounded-full">
                SOC FIELD GUIDE
              </span>
            </div>
          </div>
        </div>

        {topic && (
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
            Chuyên đề: <span className="font-semibold text-slate-700 dark:text-slate-200">{topic}</span>
          </span>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3.5 leading-relaxed">
          {contextDescription}
        </p>
      )}

      {/* Contextual Action Chips */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
        {suggestedActions.map((action) => {
          const Icon = action.icon
          const isSelected = selectedPrompt === action.id && isExpanded

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action.id)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer select-none
                ${
                  isSelected
                    ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-xs"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-cyan-500/50 hover:bg-blue-50/50 dark:hover:bg-slate-700"
                }
              `}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Contextual Mentor Response Card */}
      {isExpanded && selectedPrompt && (
        <div className="mb-3.5 rounded-xl border border-blue-200/80 dark:border-cyan-500/30 bg-white dark:bg-slate-950 p-4 text-xs shadow-xs animate-in fade-in zoom-in-95 duration-150 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 dark:text-cyan-400 flex items-center gap-1.5 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
              {selectedPrompt === "custom"
                ? `Phân tích yêu cầu: "${customQuestion}"`
                : sampleResponses[selectedPrompt]?.title}
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              aria-label="Đóng phản hồi"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
            {selectedPrompt === "custom"
              ? "Theo nguyên tắc Defense-in-Depth của NIST, giải pháp phòng thủ tối ưu đòi hỏi kết hợp đồng thời Prepared Statements, phân quyền tối thiểu (Least Privilege) và cơ chế logging Suricata/SIEM để ngăn ngừa hoàn toàn nguy cơ leo thang đặc quyền."
              : sampleResponses[selectedPrompt]?.text}
          </p>
        </div>
      )}

      {/* Ask Input */}
      <form onSubmit={handleCustomSubmit} className="relative flex items-center">
        <MessageSquare className="absolute left-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          placeholder="Đặt câu hỏi phân tích chiến thuật về bước này..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 py-2 pl-9 pr-24 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-cyan-950"
        />
        <button
          type="submit"
          className="absolute right-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold transition cursor-pointer inline-flex items-center gap-1 shadow-xs"
        >
          <span>Tra cứu</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </form>
    </div>
  )
}

export default ContextualAIMentor
