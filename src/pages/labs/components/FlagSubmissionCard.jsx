import { useState } from "react"
import { Flag, Send, CheckCircle2, Zap } from "lucide-react"
import useLabStore from "../../../stores/useLabStore"
import useNotificationStore from "../../../stores/useNotificationStore"

export function FlagSubmissionCard({ lab }) {
  const [flagText, setFlagText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitFlag, completedLabs } = useLabStore()
  const { success, error } = useNotificationStore()

  const isCompleted = completedLabs.includes(lab.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!flagText.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      const res = submitFlag(lab.id, flagText)
      if (res.success) {
        success("Chúc mừng!", res.message)
        setFlagText("")
      } else {
        error("Xác thực thất bại", res.message)
      }
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-sm font-semibold text-white">
          <Flag className="w-4 h-4 text-cyan-400" />
          <span>Nộp Flag Xác Thực</span>
        </div>
        {isCompleted ? (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã hoàn thành</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>+{lab.points || 400} XP</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={flagText}
            onChange={(e) => setFlagText(e.target.value)}
            disabled={isCompleted || isSubmitting}
            placeholder={isCompleted ? "Bài lab đã được giải thành công!" : "FLAG{...}"}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isCompleted || isSubmitting || !flagText.trim()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-950/40 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="animate-spin text-sm">↻</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Gửi Flag</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FlagSubmissionCard
