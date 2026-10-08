import { Link } from "react-router-dom"
import {
  History,
  CheckCircle2,
  FlaskConical,
  Award,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react"
import { Card, Badge } from "../../../components/common"

// Map icon string names to Lucide icons
const activityIconMap = {
  CheckCircle2,
  FlaskConical,
  Award,
  Sparkles,
  Compass,
}

// Icon container styling by activity type
const activityIconTheme = {
  course: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  lab: "bg-blue-50 text-blue-600 border border-blue-100",
  quiz: "bg-amber-50 text-amber-600 border border-amber-100",
  achievement: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  path: "bg-sky-50 text-sky-600 border border-sky-100",
}

/**
 * RecentActivity Component
 * 
 * Lightweight, chronological timeline of the user's latest learning accomplishments.
 */
export function RecentActivity({ activities = [], className = "" }) {
  return (
    <Card variant="default" className={`border-slate-200/90 shadow-2xs ${className}`.trim()}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200/70">
              <History className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Recent Activity
              </h2>
              <p className="text-[11px] text-slate-500">
                Your latest learning milestones & lab submissions
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>History</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {/* Timeline Activities List */}
        <div className="relative space-y-3.5 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
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
                    <p className="text-xs font-semibold text-slate-900 leading-tight truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
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

