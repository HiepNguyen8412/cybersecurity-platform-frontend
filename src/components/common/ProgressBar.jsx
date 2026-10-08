/**
 * Reusable ProgressBar component with variants, labels, and accessible ARIA attributes.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  variant = "primary",
  size = "md",
  showValue = false,
  label = null,
  animated = false,
  className = "",
  ...props
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100)

  const variantStyles = {
    primary: "bg-blue-600",
    success: "bg-emerald-600",
    warning: "bg-amber-500",
    error: "bg-rose-600",
    indigo: "bg-indigo-600",
  }

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${className}`.trim()} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-700">
          {label && <span>{label}</span>}
          {showValue && <span className="text-slate-500 tabular-nums">{percentage}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Progress"}
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            variantStyles[variant] || variantStyles.primary
          } ${animated ? "animate-pulse" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
