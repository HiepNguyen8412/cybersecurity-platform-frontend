import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

/**
 * Reusable Button component for CyberPath v2 ("Academic Research Atelier").
 * States: default, hover, active, focus-visible, disabled, loading.
 */
const Button = forwardRef(function Button(
  {
    children,
    type = "button",
    variant = "primary",
    size = "md",
    isLoading = false,
    loadingText,
    disabled = false,
    fullWidth = false,
    leftIcon = null,
    rightIcon = null,
    className = "",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading

  const baseStyles =
    "group inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F6] dark:focus-visible:ring-offset-[#0B0E14] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:transform-none disabled:hover:shadow-none"

  const variantStyles = {
    primary:
      "cyber-btn-primary btn-cyber-interactive font-semibold focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6]",
    secondary:
      "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#ECE9E2] dark:hover:bg-[#1B2335] active:scale-[0.99] border border-[#E5E2DC] dark:border-white/[0.09] hover:border-[#D0CCC3] dark:hover:border-white/[0.16] focus-visible:ring-slate-400",
    outline:
      "bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.09] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A] active:scale-[0.99] shadow-2xs focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6]",
    ghost:
      "bg-transparent text-[#475569] dark:text-[#94A3B8] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] active:scale-[0.99] border border-transparent focus-visible:ring-slate-400",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-2xs border border-rose-700/20 focus-visible:ring-rose-600",
    subtle:
      "bg-blue-50/90 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] hover:bg-blue-100/80 dark:hover:bg-blue-500/20 active:scale-[0.99] border border-blue-200/80 dark:border-blue-500/25 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6]",
    tech:
      "font-mono-tech bg-[#0F172A] dark:bg-[#161C2A] text-[#F1F5F9] hover:bg-[#1E293B] dark:hover:bg-[#1B2335] border border-[#0F172A] dark:border-white/[0.12] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6]/60 shadow-2xs tracking-tight focus-visible:ring-[#1D4ED8]",
  }

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
    md: "text-sm px-3.5 py-2 gap-2 h-9",
    lg: "text-base px-5 py-2.5 gap-2.5 h-11",
    icon: "p-2 h-9 w-9 justify-center",
    iconSm: "p-1.5 h-7 w-7 justify-center",
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span className="inline-flex shrink-0 transition-transform duration-150">
              {leftIcon}
            </span>
          )}
          <span>{children}</span>
          {rightIcon && (
            <span className="inline-flex shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
              {rightIcon}
            </span>
          )}
        </>
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button
