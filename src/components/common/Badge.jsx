/**
 * Reusable Badge component for statuses, tags, counts, and indicators.
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
    primary: "bg-blue-50 text-blue-700 border-blue-200/60",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/60",
    error: "bg-rose-50 text-rose-700 border-rose-200/60",
    info: "bg-sky-50 text-sky-700 border-sky-200/60",
    purple: "bg-purple-50 text-purple-700 border-purple-200/60",
    outline: "bg-white text-slate-700 border-slate-300",
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
