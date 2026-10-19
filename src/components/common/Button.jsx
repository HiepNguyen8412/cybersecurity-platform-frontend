import { forwardRef } from "react"
import { Loader2 } from "lucide-react"

/**
 * Reusable Button component with multiple variants, sizes, and states.
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

  // Base styles: semantic typography, transition, focus ring, interactive states
  const baseStyles =
    "group inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:transform-none disabled:hover:shadow-none"

  // Variant definitions
  const variantStyles = {
    primary:
      "cyber-btn-primary btn-cyber-interactive font-semibold focus-visible:ring-blue-600 rounded-xl",
    secondary:
      "bg-slate-100/90 dark:bg-slate-800/90 cyberpunk:bg-[#071329] text-slate-800 dark:text-slate-200 cyberpunk:text-cyan-200 hover:bg-slate-200 dark:hover:bg-slate-700 cyberpunk:hover:bg-[#0a1e3f] active:bg-slate-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-slate-400 border border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/30 rounded-xl",
    outline:
      "bg-white dark:bg-slate-800/90 cyberpunk:bg-[#071329] backdrop-blur-xs text-slate-800 dark:text-slate-100 cyberpunk:text-cyan-300 border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 hover:border-blue-500 dark:hover:border-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 hover:bg-blue-50/50 dark:hover:bg-slate-700/60 cyberpunk:hover:bg-[#0a1e3f] hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-500/10 active:bg-slate-100 shadow-2xs focus-visible:ring-blue-600 rounded-xl",
    ghost:
      "bg-transparent text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 cyberpunk:hover:bg-[#071329] hover:text-slate-900 dark:hover:text-white cyberpunk:hover:text-cyan-200 hover:-translate-y-0.5 active:bg-slate-200 focus-visible:ring-slate-400 border border-transparent rounded-xl",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm hover:shadow-md hover:shadow-rose-500/25 hover:-translate-y-0.5 focus-visible:ring-rose-600 border border-transparent rounded-xl",
    subtle:
      "bg-blue-50/80 dark:bg-blue-950/40 cyberpunk:bg-[#08284d]/60 text-blue-700 dark:text-blue-300 cyberpunk:text-cyan-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-800 dark:hover:text-blue-200 hover:-translate-y-0.5 active:bg-blue-200 focus-visible:ring-blue-500 border border-blue-200/60 dark:border-blue-800/40 cyberpunk:border-cyan-500/40 rounded-xl",
    tech:
      "font-mono-tech bg-slate-900 dark:bg-slate-950 cyberpunk:bg-[#030712] text-white hover:bg-slate-800 hover:border-blue-500/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 border border-slate-700/80 cyberpunk:border-cyan-500/50 shadow-sm rounded-xl tracking-tight",
  }

  // Size definitions
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
            <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:scale-110">
              {leftIcon}
            </span>
          )}
          <span>{children}</span>
          {rightIcon && (
            <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
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
