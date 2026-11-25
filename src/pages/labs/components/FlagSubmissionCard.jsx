import { useState } from "react"
import { Flag, CheckCircle2, Send, Award, AlertCircle, Loader2 } from "lucide-react"
import useLabStore from "../../../stores/useLabStore"
import useNotificationStore from "../../../stores/useNotificationStore"
import challengeService from "../../../services/challengeService"

export function FlagSubmissionCard({ lab }) {
  const [flagText, setFlagText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const { submitFlag, recordServerSolve, completedLabs } = useLabStore()
  const { success, error } = useNotificationStore()

  const isCompleted = completedLabs.includes(lab.id)
  const inputId = `flag-input-${lab.id}`
  const inputName = `flag_${String(lab.id).replace(/[^a-zA-Z0-9_-]/g, "_")}`

  const handleLocalFallback = (cleanFlag, wasBackendFallback) => {
    const localRes = submitFlag(lab.id, cleanFlag, lab)
    if (localRes.success) {
      const text = wasBackendFallback
        ? `${localRes.message} (Kiểm chứng cục bộ — đăng nhập để đồng bộ Bảng Xếp Hạng)`
        : localRes.message
      setFeedback({ type: "success", text })
      success("Xác thực Flag thành công", localRes.message)
      setFlagText("")
    } else {
      setFeedback({ type: "error", text: localRes.message })
      error("Flag không hợp lệ", localRes.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanFlag = flagText.trim()
    if (!cleanFlag || isSubmitting || isCompleted) return

    setIsSubmitting(true)
    setFeedback(null)

    try {
      if (lab.backendId) {
        const apiRes = await challengeService.submitFlag(lab.backendId, cleanFlag)

        if (apiRes?.success && apiRes.data) {
          if (apiRes.data.correct) {
            const earnedPoints = apiRes.data.alreadySolved
              ? 0
              : (apiRes.data.awardedPoints ?? lab.points ?? 0)
            recordServerSolve(lab.id, earnedPoints)

            const serverMsg = apiRes.data.alreadySolved
              ? "Thử thách này đã được xác nhận hoàn thành trên máy chủ."
              : apiRes.data.firstBlood
              ? `First Blood — Bạn là người giải đầu tiên! (+${earnedPoints} XP)`
              : `Xác thực Flag thành công trên máy chủ (+${earnedPoints} XP).`

            setFeedback({ type: "success", text: serverMsg })
            success("Xác thực Flag thành công", serverMsg)
            setFlagText("")
            return
          }

          const wrongMsg =
            "Flag chưa chính xác. Hãy kiểm tra lại kết quả khai thác trong Terminal."
          setFeedback({ type: "error", text: wrongMsg })
          error("Flag không hợp lệ", wrongMsg)
          return
        }

        if (apiRes?.status === 429) {
          const rateMsg =
            apiRes.error || "Bạn đang gửi cờ quá nhanh. Vui lòng thử lại sau giây lát."
          setFeedback({ type: "error", text: rateMsg })
          error("Giới hạn tần suất", rateMsg)
          return
        }

        // Auth required (401/403) or backend unavailable -> seamless local fallback
        handleLocalFallback(cleanFlag, true)
        return
      }

      handleLocalFallback(cleanFlag, false)
    } catch {
      handleLocalFallback(cleanFlag, Boolean(lab.backendId))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-3.5 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14]/80">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 text-[11px] font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider cursor-pointer"
        >
          <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-500/12 border border-blue-200/80 dark:border-blue-500/25 flex items-center justify-center text-[#1D4ED8] dark:text-[#38BDF8]">
            <Flag className="w-3.5 h-3.5" />
          </span>
          <span>Nộp Flag xác thực</span>
        </label>

        {isCompleted ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>Đã hoàn thành</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono-tech font-semibold text-[#475569] dark:text-[#94A3B8] bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] whitespace-nowrap shrink-0">
            <Award className="w-3 h-3 text-[#1D4ED8] dark:text-[#38BDF8]" />
            <span>+{lab.points || 400} XP</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <input
          id={inputId}
          name={inputName}
          type="text"
          value={flagText}
          onChange={(e) => {
            setFlagText(e.target.value)
            if (feedback) setFeedback(null)
          }}
          disabled={isCompleted || isSubmitting}
          placeholder={
            isCompleted
              ? "Thử thách đã được xác nhận hoàn thành"
              : "Nhập chuỗi FLAG{...}"
          }
          aria-label={`Nhập chuỗi Flag cho ${lab.title}`}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] text-xs font-mono-tech text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isCompleted || isSubmitting || !flagText.trim()}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white font-semibold text-xs transition-colors disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Đang thẩm định Flag...</span>
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Flag đã được xác nhận</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Kiểm Tra & Nộp Flag</span>
            </>
          )}
        </button>
      </form>

      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg text-[11px] leading-relaxed border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
              : "bg-rose-50 dark:bg-rose-500/12 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/25"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  )
}

export default FlagSubmissionCard
