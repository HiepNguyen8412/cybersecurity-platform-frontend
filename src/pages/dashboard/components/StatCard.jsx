import { TrendingUp, BookOpen, FlaskConical, Flame, CheckCircle2 } from "lucide-react"
import { Card, ProgressBar, CountUp } from "../../../components/common"

// Map icon string names to Lucide icons
const iconMap = {
  TrendingUp,
  BookOpen,
  FlaskConical,
  Flame,
  CheckCircle2,
}

// Visual themes for EdTech stats (soft, friendly, distinct)
const variantTheme = {
  primary: {
    iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    textValue: "text-slate-900",
    progressVariant: "primary",
  },
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    textValue: "text-slate-900",
    progressVariant: "indigo",
  },
  success: {
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    textValue: "text-slate-900",
    progressVariant: "success",
  },
  warning: {
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    textValue: "text-slate-900",
    progressVariant: "warning",
  },
}

/**
 * StatCard Component
 * 
 * Individual statistic card designed for EdTech progress tracking.
 * Compact, lightweight, visually secondary to the primary next step.
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

  return (
    <Card
      variant="default"
      padding="sm"
      className={`border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all ${className}`.trim()}
    >
      <div className="flex flex-col space-y-2.5">
        {/* Top: Icon + Trend or Subtitle */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} shadow-2xs`}>
            <IconComponent className="h-4.5 w-4.5 stroke-[2]" aria-hidden="true" />
          </div>

          {trend && (
            <span className="font-mono-tech text-[10px] font-bold text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded-md border border-slate-200">
              {trend}
            </span>
          )}
        </div>

        {/* Middle: Big Value + Label */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-extrabold font-mono-tech tracking-tight ${theme.textValue} tabular-nums`}>
              {typeof value === "number" || (!isNaN(Number(value)) && value !== "") ? (
                <CountUp end={Number(value)} />
              ) : (
                value
              )}
            </span>
            {suffix && (
              <span className="text-sm font-bold font-mono-tech text-slate-500">
                {suffix}
              </span>
            )}
          </div>

          <h3 className="text-xs font-semibold text-slate-700 tracking-tight">
            {label}
          </h3>
        </div>

        {/* Optional mini progress bar or contextual subtitle */}
        {hasProgressBar ? (
          <div className="pt-0.5 space-y-1">
            <ProgressBar
              value={Number(value) || 0}
              max={100}
              variant={theme.progressVariant}
              size="sm"
              label={`${label} progress`}
            />
            {subtitle && (
              <p className="text-[11px] text-slate-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          subtitle && (
            <p className="text-[11px] text-slate-400 truncate">
              {subtitle}
            </p>
          )
        )}
      </div>
    </Card>
  )
}

export default StatCard

