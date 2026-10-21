import { useState } from "react"
import { Flag, Send, CheckCircle2, Award } from "lucide-react"
import useLabStore from "../../../stores/useLabStore"
import useNotificationStore from "../../../stores/useNotificationStore"
import challengeService from "../../../services/challengeService"

export function FlagSubmissionCard({ lab }) {
  const [flagText, setFlagText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitFlag, completedLabs } = useLabStore()
  const { success, error } = useNotificationStore()

  const isCompleted = completedLabs.includes(lab.id)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!flagText.trim()) return

    setIsSubmitting(true)
    try {
      if (lab.backendId) {
        const apiRes = await challengeService.submitFlag(lab.backendId, flagText.trim())
        if (apiRes.success && apiRes.data) {
          if (apiRes.data.correct) {
            submitFlag(lab.id, flagText)
            success("Chính xác! Cờ đã được xác nhận", apiRes.data.message || "Bạn đã giải thành công thử thách!")
            setFlagText("")
            setIsSubmitting(false)
            return
          } else {
            error("Cờ không hợp lệ", apiRes.data.message || "Flag không chính xác.")
            setIsSubmitting(false)
            return
          }
        }
      }

      // Local fallback
      const res = submitFlag(lab.id, flagText)
      if (res.success) {
        success("Chính xác! Cờ đã được xác nhận", res.message)
        setFlagText("")
      } else {
        error("Cờ không hợp lệ", res.message)
      }
    } catch {
      error("Lỗi xác thực", "Không thể gửi cờ thử thách tới máy chủ.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/30 bg-slate-50/80 dark:bg-slate-900/60 cyberpunk:bg-[#050c1b] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-100 uppercase tracking-wider font-mono">
          <Flag className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>Xác Thực Chiến Tích // FLAG</span>
        </div>
        {isCompleted ? (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã chiếm cờ</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 font-mono">
            <Award className="w-3 h-3 text-cyan-400" />
            <span>+{lab.points || 400} XP</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="relative">
          <input
            type="text"
            value={flagText}
            onChange={(e) => setFlagText(e.target.value)}
            disabled={isCompleted || isSubmitting}
            placeholder={isCompleted ? "Bài lab đã được giải quyết thành công!" : "FLAG{...}"}
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950/80 cyberpunk:bg-[#030712] border border-slate-300 dark:border-slate-700/80 cyberpunk:border-cyan-500/40 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500 font-mono disabled:opacity-50 shadow-2xs"
          />
        </div>

        <button
          type="submit"
          disabled={isCompleted || isSubmitting || !flagText.trim()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="animate-spin text-xs">↻</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Gửi Chuỗi Flag Kiểm Tra</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FlagSubmissionCard
