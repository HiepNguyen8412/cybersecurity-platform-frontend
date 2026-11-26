import { Link } from "react-router-dom"
import {
  FileText,
  CheckCircle2,
  FlaskConical,
  Award,
  Flame,
  Compass,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"
import { Card, Badge } from "../../../components/common"

const activityIconMap = {
  CheckCircle2,
  FlaskConical,
  Award,
  Flame,
  Compass,
  ShieldCheck,
}

const activityIconTheme = {
  course:
    "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/12 dark:text-emerald-400 dark:border-emerald-500/25",
  lab: "bg-blue-50 text-[#1D4ED8] border border-blue-200/80 dark:bg-blue-500/12 dark:text-[#38BDF8] dark:border-blue-500/25",
  quiz: "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-500/12 dark:text-amber-400 dark:border-amber-500/25",
  achievement:
    "bg-[#F3F1EC] text-[#1D4ED8] border border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#93C5FD] dark:border-white/[0.08]",
  path: "bg-sky-50 text-sky-700 border border-sky-200/80 dark:bg-sky-500/12 dark:text-sky-300 dark:border-sky-500/25",
}

/**
 * RecentActivity
 * Dòng thời gian ghi nhận các cột mốc học tập và thực nghiệm gần nhất.
 */
export function RecentActivity({ activities = [], className = "" }) {
  return (
    <Card
      variant="default"
      className={`bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] ${className}`.trim()}
    >
      <div className="space-y-4">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#EFEDE7] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F1EC] text-[#475569] border border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.08]">
              <FileText className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
                Nhật ký hoạt động gần đây
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Các cột mốc học phần và kết quả thực nghiệm mới nhất
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-0.5 transition-colors shrink-0"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {/* Danh sách dòng thời gian */}
        {activities.length > 0 ? (
          <div className="relative space-y-3.5 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E5E2DC] dark:before:bg-white/[0.08]">
            {activities.map((item) => {
              const IconComponent = activityIconMap[item.iconName] || CheckCircle2
              const themeClass = activityIconTheme[item.type] || activityIconTheme.course

              return (
                <div key={item.id} className="relative flex items-start gap-3 group">
                  <div
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${themeClass}`}
                  >
                    <IconComponent className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight truncate group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap shrink-0 font-mono-tech">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5 leading-snug line-clamp-1">
                      {item.description}
                    </p>

                    {item.badgeText && (
                      <div className="mt-1.5">
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
        ) : (
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] py-4 text-center">
            Chưa có hoạt động nào được ghi nhận gần đây.
          </p>
        )}
      </div>
    </Card>
  )
}

export default RecentActivity
