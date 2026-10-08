import { BookOpen } from "lucide-react"

/**
 * Reusable EmptyState component for friendly learning guidance when content is empty or awaiting activity.
 */
export function EmptyState({
  title = "No activity yet",
  description = "Start exploring learning paths or practice in the labs to track your progress.",
  icon: Icon = BookOpen,
  action = null,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-200 bg-white/60 ${className}`.trim()}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3 shadow-2xs">
        <Icon className="h-6 w-6 stroke-[1.8]" />
      </div>

      <h3 className="text-base font-semibold text-slate-800 leading-tight">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
