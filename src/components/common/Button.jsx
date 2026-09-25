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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"

  // Variant definitions
  const variantStyles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow focus-visible:ring-blue-600 border border-transparent",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400 border border-slate-200",
    outline:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 shadow-xs focus-visible:ring-blue-600",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400 border border-transparent",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm hover:shadow focus-visible:ring-rose-600 border border-transparent",
    subtle:
      "bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 focus-visible:ring-blue-500 border border-blue-100",
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
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button
