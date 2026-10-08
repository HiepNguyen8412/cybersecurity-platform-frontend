/**
 * Reusable Card component and subcomponents.
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
    flat: "bg-white/95 border border-slate-200/90 shadow-2xs",
    interactive:
      "cyber-card hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer",
    focal: "cyber-card-focal",
    subtle: "bg-slate-50/70 border border-slate-200/60",
    terminal: "cyber-terminal text-slate-100",
  }

  const paddingStyles = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
  }

  return (
    <Component
      className={`rounded-xl overflow-hidden ${variantStyles[variant] || variantStyles.default} ${paddingStyles[padding]} ${className}`.trim()}
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
      className={`text-base font-semibold leading-tight text-slate-900 tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-slate-500 leading-normal ${className}`.trim()} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`text-sm text-slate-600 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
