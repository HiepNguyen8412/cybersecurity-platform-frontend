/**
 * Reusable Badge component for statuses, tags, counts, and indicators.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function Badge({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  icon = null,
  className = "",
  ...props
}) {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/50",
    secondary: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 cyberpunk:bg-[#0d1e3d] cyberpunk:text-cyan-300/90 cyberpunk:border-cyan-500/30",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 cyberpunk:bg-emerald-950/60 cyberpunk:text-emerald-300 cyberpunk:border-emerald-500/50",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60 cyberpunk:bg-amber-950/60 cyberpunk:text-amber-300 cyberpunk:border-amber-500/50",
    error: "bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60 cyberpunk:bg-rose-950/60 cyberpunk:text-rose-300 cyberpunk:border-rose-500/50",
    info: "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/50",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60 cyberpunk:bg-purple-950/60 cyberpunk:text-purple-300 cyberpunk:border-purple-500/50",
    outline: "bg-white text-slate-700 border-slate-300 dark:bg-transparent dark:text-slate-300 dark:border-slate-700 cyberpunk:bg-transparent cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/40",
    cyber: "font-mono-tech bg-blue-50/90 text-blue-700 border-blue-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60 cyberpunk:bg-cyan-950/80 cyberpunk:text-cyan-200 cyberpunk:border-cyan-400 shadow-2xs font-semibold tracking-tight",
    live: "font-mono-tech bg-emerald-50/90 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 cyberpunk:bg-emerald-950/80 cyberpunk:text-emerald-200 cyberpunk:border-emerald-400 shadow-2xs font-semibold tracking-tight",
    alert: "font-mono-tech bg-rose-50/90 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60 cyberpunk:bg-rose-950/80 cyberpunk:text-rose-200 cyberpunk:border-rose-400 shadow-2xs font-semibold tracking-tight",
  }

  const dotColors = {
    primary: "bg-blue-500",
    secondary: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    info: "bg-sky-500",
    purple: "bg-purple-500",
    outline: "bg-slate-400",
    cyber: "bg-cyan-400",
    live: "bg-emerald-400",
    alert: "bg-rose-400",
  }

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium gap-1",
    md: "text-xs px-2.5 py-1 font-medium gap-1.5",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border leading-none font-medium select-none ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`.trim()}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[variant] || dotColors.primary}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export default Badge
