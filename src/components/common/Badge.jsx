/**
 * Reusable Badge component for statuses, tags, counts, and academic markers.
 * Refined for Editorial Light and Deep Obsidian Dark with 1px hairline borders.
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
    primary:
      "bg-blue-50 text-[#1D4ED8] border-blue-200/80 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25",
    secondary:
      "bg-[#F3F1EC] text-[#475569] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.09]",
    success:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25",
    warning:
      "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/25",
    error:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/12 dark:text-rose-300 dark:border-rose-500/25",
    danger:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/12 dark:text-rose-300 dark:border-rose-500/25",
    info:
      "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-500/12 dark:text-sky-300 dark:border-sky-500/25",
    purple:
      "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-500/12 dark:text-indigo-300 dark:border-indigo-500/25",
    outline:
      "bg-white text-[#475569] border-[#E5E2DC] dark:bg-transparent dark:text-[#94A3B8] dark:border-white/[0.12]",
    cyber:
      "font-mono-tech bg-blue-50/90 text-[#1D4ED8] border-blue-200/80 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25 font-semibold tracking-tight",
    live:
      "font-mono-tech bg-emerald-50/90 text-emerald-800 border-emerald-200/80 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25 font-semibold tracking-tight",
    alert:
      "font-mono-tech bg-rose-50/90 text-rose-700 border-rose-200/80 dark:bg-rose-500/12 dark:text-rose-300 dark:border-rose-500/25 font-semibold tracking-tight",
  }

  const dotColors = {
    primary: "bg-[#1D4ED8] dark:bg-[#3B82F6]",
    secondary: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-500",
    danger: "bg-rose-500",
    info: "bg-sky-500",
    purple: "bg-indigo-500",
    outline: "bg-slate-400",
    cyber: "bg-[#1D4ED8] dark:bg-[#3B82F6]",
    live: "bg-emerald-500",
    alert: "bg-rose-500",
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
