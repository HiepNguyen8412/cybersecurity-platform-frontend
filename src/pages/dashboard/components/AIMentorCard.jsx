import { useState } from "react"
import { Link } from "react-router-dom"
import { UserCheck, ArrowRight, BookOpen, FileText, X, Terminal, Search } from "lucide-react"
import { Card, Button } from "../../../components/common"

/**
 * Tactical Security Advisory Card
 * 
 * Contextual security advisory assistant for the Dashboard.
 * Subtle, non-intrusive, integrated directly into the learning flow.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function AIMentorCard({
  guidance = {},
  className = "",
}) {
  const {
    contextTopic = "Bảo mật Web & Phòng thủ Cơ sở dữ liệu",
    recommendationMessage = "Bạn đang đạt tiến độ tốt ở mảng An toàn Ứng dụng Web. Hãy chuyển sang phòng Lab SQL Injection tiếp theo.",
    contextDetail = "Dựa trên kết quả bài kiểm tra Nền tảng An toàn Web, việc thực hành Prepared Statements thực tế sẽ củng cố vững chắc kỹ năng phòng thủ của bạn.",
    suggestedAction = { label: "Vào phòng Lab", path: "/labs" },
  } = guidance

  const [activeMode, setActiveMode] = useState(null) // 'hint' | 'ask' | null
  const [askQuestion, setAskQuestion] = useState("")
  const [submittedAnswer, setSubmittedAnswer] = useState(null)

  const handleHintToggle = () => {
    setActiveMode(activeMode === "hint" ? null : "hint")
    setSubmittedAnswer(null)
  }

  const handleAskToggle = () => {
    setActiveMode(activeMode === "ask" ? null : "ask")
    setSubmittedAnswer(null)
  }

  const handleAskSubmit = (e) => {
    e.preventDefault()
    if (!askQuestion.trim()) return

    setSubmittedAnswer(
      `Phân tích SOC cho "${askQuestion}": Trong cơ chế Prepared Statements, khuôn mẫu câu lệnh SQL được phân tích cú pháp và biên dịch trước bởi Database Driver trước khi gắn giá trị tham số người dùng. Điều này ngăn chặn hoàn toàn việc dữ liệu đầu vào làm biến đổi cấu trúc cây thực thi SQL.`
    )
  }

  return (
    <Card
      variant="default"
      className={`border-blue-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/50 shadow-xs ${className}`.trim()}
    >
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 cyberpunk:from-cyan-500 cyberpunk:to-blue-600 text-white shadow-2xs">
              <UserCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight uppercase">
                  CỐ VẤN TÁC CHIẾN // SOC INTEL
                </h2>
                <span className="font-mono-tech text-[10px] font-bold text-blue-700 dark:text-cyan-400 cyberpunk:text-cyan-300 bg-blue-100/90 dark:bg-cyan-950/60 cyberpunk:bg-cyan-950/80 border border-blue-200 dark:border-cyan-800/40 cyberpunk:border-cyan-500/50 px-1.5 py-0.5 rounded">
                  v2.4 TELEMETRY
                </span>
              </div>
            </div>
          </div>

          {contextTopic && (
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300 truncate max-w-[160px]">
              {contextTopic}
            </span>
          )}
        </div>

        {/* Core Recommendation Message */}
        <div className="space-y-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/80 cyberpunk:bg-[#071329] border border-blue-100/80 dark:border-slate-700 cyberpunk:border-cyan-500/40 p-3">
          <p className="text-xs font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-relaxed">
            &ldquo;{recommendationMessage}&rdquo;
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200/90 leading-normal">
            {contextDetail}
          </p>
        </div>

        {/* Expandable Hint Box */}
        {activeMode === "hint" && (
          <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 cyberpunk:bg-[#1a1505] border border-amber-200 dark:border-amber-800/50 cyberpunk:border-amber-500/50 text-xs text-amber-900 dark:text-amber-200 cyberpunk:text-amber-200 space-y-1 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 cyberpunk:text-amber-300">
                <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                Gợi ý Kỹ thuật Phòng thủ
              </span>
              <button
                type="button"
                onClick={() => setActiveMode(null)}
                className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 p-0.5 cursor-pointer"
                aria-label="Đóng gợi ý"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-200/90 leading-relaxed">
              Khi làm sạch dữ liệu đầu vào, việc lọc Blacklist (ví dụ: xóa từ khóa &quot;UNION&quot; hoặc &quot;SELECT&quot;) rất dễ bị vượt qua bằng kỹ thuật lồng từ khóa hoặc encoding thay thế. Luôn ưu tiên dùng Whitelist Validation và SQL Parameterization.
            </p>
          </div>
        )}

        {/* Expandable Ask Input & Answer */}
        {activeMode === "ask" && (
          <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-slate-900 cyberpunk:bg-[#060e1d] border border-blue-200 dark:border-slate-700 cyberpunk:border-cyan-500/50 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-cyan-300 cyberpunk:text-cyan-300">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
                Tra cứu Sổ tay Phòng thủ
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveMode(null)
                  setSubmittedAnswer(null)
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                aria-label="Đóng tra cứu"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="flex gap-1.5">
              <input
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="Ví dụ: Vì sao Prepared Statements an toàn?"
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 bg-white dark:bg-slate-800 cyberpunk:bg-[#071329] px-2.5 py-1 text-xs text-slate-900 dark:text-white cyberpunk:text-cyan-100 placeholder:text-slate-400 outline-none focus:border-blue-500 dark:focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Tra cứu</span>
              </button>
            </form>

            {submittedAnswer && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100 leading-relaxed bg-slate-50 dark:bg-slate-800/60 cyberpunk:bg-[#071329] p-2.5 rounded-lg">
                {submittedAnswer}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleHintToggle}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none inline-flex items-center gap-1
                ${
                  activeMode === "hint"
                    ? "bg-amber-100 dark:bg-amber-950/60 cyberpunk:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                    : "bg-white dark:bg-slate-800 cyberpunk:bg-[#071329] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/30 text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-200 hover:bg-slate-50 dark:hover:bg-slate-700 cyberpunk:hover:border-cyan-400"
                }
              `}
            >
              <FileText className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>Ghi chú kỹ thuật</span>
            </button>

            <button
              type="button"
              onClick={handleAskToggle}
              className={`
                px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none inline-flex items-center gap-1
                ${
                  activeMode === "ask"
                    ? "bg-blue-100 dark:bg-cyan-950/60 cyberpunk:bg-cyan-950/80 text-blue-800 dark:text-cyan-300 border border-blue-300 dark:border-cyan-700"
                    : "bg-white dark:bg-slate-800 cyberpunk:bg-[#071329] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/30 text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-200 hover:bg-slate-50 dark:hover:bg-slate-700 cyberpunk:hover:border-cyan-400"
                }
              `}
            >
              <BookOpen className="h-3 w-3 text-blue-600 dark:text-cyan-400" aria-hidden="true" />
              <span>Sổ tay tác chiến</span>
            </button>
          </div>

          <Link to={suggestedAction.path || "/labs"}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="h-3 w-3" />}
            >
              {suggestedAction.label || "Vào Lab"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default AIMentorCard
