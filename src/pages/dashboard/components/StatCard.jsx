import { TrendingUp, BookOpen, FlaskConical, Flame, CheckCircle2 } from "lucide-react"
import { Card, ProgressBar, CountUp } from "../../../components/common"

const iconMap = {
  TrendingUp,
  BookOpen,
  FlaskConical,
  Flame,
  CheckCircle2,
}

const variantTheme = {
  primary: {
    iconBg:
      "bg-blue-50 text-[#1D4ED8] border-blue-200/80 dark:bg-blue-500/12 dark:text-[#38BDF8] dark:border-blue-500/25",
    progressVariant: "primary",
  },
  indigo: {
    iconBg:
      "bg-[#F3F1EC] text-[#1D4ED8] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#93C5FD] dark:border-white/[0.08]",
    progressVariant: "indigo",
  },
  success: {
    iconBg:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/12 dark:text-emerald-400 dark:border-emerald-500/25",
    progressVariant: "success",
  },
  warning: {
    iconBg:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/12 dark:text-amber-400 dark:border-amber-500/25",
    progressVariant: "warning",
  },
}

/**
 * StatCard
 * Thẻ chỉ số KPI gọn nhẹ, phân cấp rõ giữa nền Editorial Light và Deep Obsidian Dark.
 */
export function StatCard({
  label,
  value,
  suffix = "",
  subtitle = "",
  icon = "TrendingUp",
  variant = "primary",
  trend = "",
  hasProgressBar = false,
  className = "",
}) {
  const IconComponent = iconMap[icon] || TrendingUp
  const theme = variantTheme[variant] || variantTheme.primary
  const numericValue = Number(value)
  const isNumeric = typeof value === "number" || (!Number.isNaN(numericValue) && value !== "")

  return (
    <Card
      variant="default"
      padding="sm"
      className={`bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8]/40 dark:hover:border-[#3B82F6]/40 transition-colors ${className}`.trim()}
    >
      <div className="flex flex-col space-y-2.5">
        {/* Hàng trên: Biểu tượng + Nhãn xu hướng */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${theme.iconBg}`}>
            <IconComponent className="h-4 w-4 stroke-[1.75]" aria-hidden="true" />
          </div>

          {trend && (
            <span className="font-mono-tech text-[10px] font-medium text-[#475569] dark:text-[#94A3B8] bg-[#F3F1EC] dark:bg-[#161C2A] px-2 py-0.5 rounded-md border border-[#E5E2DC] dark:border-white/[0.08] truncate max-w-[140px]">
              {trend}
            </span>
          )}
        </div>

        {/* Giá trị số + Tiêu đề chỉ số */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono-tech tracking-tight text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">
              {isNumeric ? <CountUp key={`stat-${numericValue}`} end={numericValue} duration={900} /> : value}
            </span>
            {suffix && (
              <span className="text-sm font-semibold font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                {suffix}
              </span>
            )}
          </div>

          <h3 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
            {label}
          </h3>
        </div>

        {/* Thanh tiến độ tùy chọn + Chú thích */}
        {hasProgressBar ? (
          <div className="pt-0.5 space-y-1.5">
            <ProgressBar
              value={numericValue || 0}
              max={100}
              variant={theme.progressVariant}
              size="sm"
              label={`Tiến độ ${label}`}
              className="[&_[role=progressbar]]:bg-[#ECE9E2] dark:[&_[role=progressbar]]:bg-white/[0.08] [&>div:first-child]:sr-only"
            />
            {subtitle && (
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">{subtitle}</p>
            )}
          </div>
        ) : (
          subtitle && (
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">{subtitle}</p>
          )
        )}
      </div>
    </Card>
  )
}

export default StatCard
