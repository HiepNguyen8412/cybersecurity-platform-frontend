import { Link } from "react-router-dom"
import {
  FileText,
  CheckCircle2,
  FlaskConical,
  Award,
  Flame,
  Compass,
  ArrowRight,
} from "lucide-react"
import { Card, Badge } from "../../../components/common"

const activityIconMap = {
  CheckCircle2,
  FlaskConical,
  Award,
  Flame,
  Compass,
}

const activityIconTheme = {
  course: "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/60 cyberpunk:bg-emerald-950/60 cyberpunk:text-emerald-300 cyberpunk:border-emerald-500/40",
  lab: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/60 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/40",
  quiz: "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/60 cyberpunk:bg-amber-950/60 cyberpunk:text-amber-300 cyberpunk:border-amber-500/40",
  achievement: "bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/60 cyberpunk:bg-purple-950/60 cyberpunk:text-purple-300 cyberpunk:border-purple-500/40",
  path: "bg-sky-50 text-sky-600 border border-sky-100 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/60 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/40",
}

/**
 * RecentActivity Component
 * 
 * Chronological timeline of latest security defense milestones.
 * High-contrast, theme-aware text & visual hierarchy.
 */
export function RecentActivity({ activities = [], className = "" }) {
  return (
    <Card variant="default" className={`cyber-card ${className}`.trim()}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 cyberpunk:border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/40">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-100 tracking-tight leading-tight">
                Nhật Ký Tác Chiến // TELEMETRY LOGS
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80">
                Các mốc phòng thủ và kết quả kiểm thử thực địa gần nhất
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 cyberpunk:text-cyan-300 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {/* Timeline Activities List */}
        <div className="relative space-y-3.5 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 cyberpunk:before:bg-cyan-500/30">
          {activities.map((item) => {
            const IconComponent = activityIconMap[item.iconName] || CheckCircle2
            const themeClass = activityIconTheme[item.type] || activityIconTheme.course

            return (
              <div key={item.id} className="relative flex items-start gap-3 pl-0 group">
                {/* Node icon badge */}
                <div
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-2xs ${themeClass}`}
                >
                  <IconComponent className="h-3.5 w-3.5" aria-hidden="true" />
                </div>

                {/* Content details */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-100 leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/70 whitespace-nowrap shrink-0 font-mono-tech">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-slate-300 mt-0.5 leading-snug line-clamp-1">
                    {item.description}
                  </p>

                  {item.badgeText && (
                    <div className="mt-1">
                      <Badge variant={item.badgeVariant || "secondary"} size="sm">
                        {item.badgeText}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

export default RecentActivity
