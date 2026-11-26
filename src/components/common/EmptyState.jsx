import { BookOpen } from "lucide-react"

/**
 * Reusable EmptyState component for clear academic guidance when content is empty or awaiting activity.
 */
export function EmptyState({
  title = "Chưa có hoạt động nào",
  description = "Hãy bắt đầu khám phá lộ trình học tập hoặc thực hành trong phòng Lab để theo dõi tiến độ của bạn.",
  icon: Icon = BookOpen,
  action = null,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-[#D0CCC3] dark:border-white/[0.12] bg-[#FAF9F6]/80 dark:bg-[#121722]/70 ${className}`.trim()}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EFF6FF] dark:bg-[#3B82F6]/12 border border-[#BFDBFE]/80 dark:border-[#3B82F6]/25 text-[#1D4ED8] dark:text-[#38BDF8] mb-3">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </div>

      <h3 className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
