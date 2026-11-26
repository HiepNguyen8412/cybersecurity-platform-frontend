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
  const safeMax = max > 0 ? max : 100
  const percentage = Math.min(Math.max(Math.round((value / safeMax) * 100), 0), 100)

  const variantStyles = {
    primary: "bg-[#1D4ED8] dark:bg-[#3B82F6]",
    success: "bg-emerald-600 dark:bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-rose-600 dark:bg-rose-500",
    indigo: "bg-indigo-600 dark:bg-indigo-500",
    neutral: "bg-[#64748B] dark:bg-[#94A3B8]",
  }

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${className}`.trim()} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9]">
          {label && <span>{label}</span>}
          {showValue && (
            <span className="font-mono-tech text-[#475569] dark:text-[#94A3B8] tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || "Tiến độ hoàn thành"}
        className={`w-full bg-[#ECE9E2] dark:bg-[#161C2A] rounded-full overflow-hidden ${sizeStyles[size] || sizeStyles.md}`}
      >
        <div
          className={`h-full rounded-full ease-out ${
            animated ? "transition-all duration-500" : "transition-all duration-300"
          } ${variantStyles[variant] || variantStyles.primary}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
