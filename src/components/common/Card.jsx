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
    default: "bg-white border border-slate-200/80 shadow-sm",
    flat: "bg-white border border-slate-200",
    interactive:
      "bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer",
    subtle: "bg-slate-50/80 border border-slate-200/60",
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
