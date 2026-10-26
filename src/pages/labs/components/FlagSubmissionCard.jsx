import { useState } from "react"
import {
  RiFlag2Fill,
  RiCheckDoubleLine,
  RiSendPlane2Fill,
  RiAwardFill,
  RiSparklingFill,
} from "@remixicon/react"
import confetti from "canvas-confetti"
import useLabStore from "../../../stores/useLabStore"
import useNotificationStore from "../../../stores/useNotificationStore"
import challengeService from "../../../services/challengeService"

/**
 * Fires a high-tech cybersecurity celebratory particle burst (Cobalt, Cyan, Mint, Gold)
 */
function triggerCyberConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#38bdf8", "#3b82f6", "#10b981", "#a855f7", "#fbbf24"],
      disableForReducedMotion: true,
    })
  } catch {
    // Graceful fallback
  }
}

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
            triggerCyberConfetti()
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
        triggerCyberConfetti()
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
    <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] cyberpunk:border-cyan-500/40 bg-slate-50/80 dark:bg-[#0c121e]/80 cyberpunk:bg-[#050c1b] backdrop-blur-md shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-100 uppercase tracking-wider font-mono">
          <div className="w-6 h-6 rounded-md bg-blue-500/15 dark:bg-cyan-500/15 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-cyan-400">
            <RiFlag2Fill className="w-3.5 h-3.5" />
          </div>
          <span>Xác Thực Chiến Tích // FLAG</span>
        </div>
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
            <RiCheckDoubleLine className="w-3.5 h-3.5 text-emerald-500" />
            <span>Đã chiếm cờ</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 font-mono shadow-2xs">
            <RiAwardFill className="w-3.5 h-3.5 text-amber-500" />
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
            placeholder={isCompleted ? "Bài lab đã được giải quyết thành công!" : "FLAG{ctf_defense_token_...}"}
            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#070b14] cyberpunk:bg-[#030712] border border-slate-300 dark:border-white/[0.1] cyberpunk:border-cyan-500/40 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 font-mono disabled:opacity-50 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isCompleted || isSubmitting || !flagText.trim()}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 cyberpunk:bg-emerald-500 cyberpunk:hover:bg-emerald-400 text-white cyberpunk:text-slate-950 font-bold text-xs shadow-md shadow-indigo-600/20 dark:shadow-indigo-950/40 cyberpunk:shadow-emerald-500/30 ring-1 ring-white/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-98"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="animate-spin text-sm">↻</span>
              <span>Đang kiểm tra chữ ký...</span>
            </span>
          ) : (
            <>
              <RiSendPlane2Fill className="w-3.5 h-3.5" />
              <span>Gửi Chuỗi Flag Kiểm Tra</span>
              <RiSparklingFill className="w-3.5 h-3.5 text-cyan-200 ml-0.5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default FlagSubmissionCard
