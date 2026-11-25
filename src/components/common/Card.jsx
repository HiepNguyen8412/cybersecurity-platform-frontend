/**
 * Reusable Card component and subcomponents.
 * Refined for Editorial Light and Deep Obsidian Dark with 1px hairline borders.
 */
export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  as: Component = "div",
  ...props
}) {
  const variantStyles = {
    default: "cyber-card",
    flat: "bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.09] shadow-2xs",
    interactive:
      "cyber-card hover:border-[#1D4ED8]/50 dark:hover:border-[#3B82F6]/50 transition-all duration-200 cursor-pointer",
    focal: "cyber-card-focal",
    subtle:
      "bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]",
    terminal: "cyber-terminal text-[#F1F5F9]",
  }

  const paddingStyles = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  return (
    <Component
      className={`rounded-xl overflow-hidden ${variantStyles[variant] || variantStyles.default} ${paddingStyles[padding] || ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = "", as: Component = "h3", ...props }) {
  return (
    <Component
      className={`text-base font-semibold leading-tight text-[#0F172A] dark:text-[#F1F5F9] tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p
      className={`text-sm text-[#475569] dark:text-[#94A3B8] leading-normal ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div
      className={`text-sm text-[#475569] dark:text-[#94A3B8] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`mt-4 pt-4 border-t border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-between text-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
