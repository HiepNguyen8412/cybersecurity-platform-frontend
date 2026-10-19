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
    iconBg: "bg-blue-50 dark:bg-blue-950/70 cyberpunk:bg-cyan-950/80 text-blue-600 dark:text-blue-400 cyberpunk:text-cyan-400 border border-blue-100 dark:border-blue-800/60 cyberpunk:border-cyan-500/50",
    textValue: "text-slate-900 dark:text-white cyberpunk:text-cyan-50",
    progressVariant: "primary",
  },
  indigo: {
    iconBg: "bg-indigo-50 dark:bg-indigo-950/70 cyberpunk:bg-cyan-950/80 text-indigo-600 dark:text-indigo-400 cyberpunk:text-cyan-300 border border-indigo-100 dark:border-indigo-800/60 cyberpunk:border-cyan-500/50",
    textValue: "text-slate-900 dark:text-white cyberpunk:text-cyan-50",
    progressVariant: "indigo",
  },
  success: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950/70 cyberpunk:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 border border-emerald-100 dark:border-emerald-800/60 cyberpunk:border-emerald-500/50",
    textValue: "text-slate-900 dark:text-white cyberpunk:text-cyan-50",
    progressVariant: "success",
  },
  warning: {
    iconBg: "bg-amber-50 dark:bg-amber-950/70 cyberpunk:bg-amber-950/80 text-amber-600 dark:text-amber-400 cyberpunk:text-amber-300 border border-amber-100 dark:border-amber-800/60 cyberpunk:border-amber-500/50",
    textValue: "text-slate-900 dark:text-white cyberpunk:text-cyan-50",
    progressVariant: "warning",
  },
}

/**
 * StatCard Component
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
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
      className={`border-slate-200/90 dark:border-slate-700 cyberpunk:border-cyan-500/40 shadow-2xs hover:border-blue-400 dark:hover:border-blue-400 cyberpunk:hover:border-cyan-400 transition-all ${className}`.trim()}
    >
      <div className="flex flex-col space-y-2.5">
        {/* Top: Icon + Trend or Subtitle */}
        <div className="flex items-center justify-between gap-2">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} shadow-2xs`}>
            <IconComponent className="h-4.5 w-4.5 stroke-[2]" aria-hidden="true" />
          </div>

          {trend && (
            <span className="font-mono-tech text-[10px] font-bold text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300 bg-slate-100/90 dark:bg-slate-800 cyberpunk:bg-cyan-950/70 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40">
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
              <span className="text-sm font-bold font-mono-tech text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300">
                {suffix}
              </span>
            )}
          </div>

          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100 tracking-tight">
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
              <p className="text-[11px] text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/80 truncate">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/80 truncate">
              {subtitle}
            </p>
          )
        )}
      </div>
    </Card>
  )
}

export default StatCard
