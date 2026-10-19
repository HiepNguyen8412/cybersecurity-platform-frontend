/**
 * Reusable Card component and subcomponents.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
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
    flat: "bg-white/95 dark:bg-slate-900 cyberpunk:bg-[#060e1d] border border-slate-200/90 dark:border-slate-800 cyberpunk:border-cyan-500/40 shadow-2xs",
    interactive:
      "cyber-card hover:border-blue-400 dark:hover:border-blue-400 cyberpunk:hover:border-cyan-400 hover:shadow-lg hover:shadow-blue-500/5 cyberpunk:hover:shadow-md transition-all duration-200 cursor-pointer",
    focal: "cyber-card-focal",
    subtle: "bg-slate-50/70 dark:bg-slate-900/70 cyberpunk:bg-[#071329] border border-slate-200/60 dark:border-slate-800 cyberpunk:border-cyan-500/30",
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
      className={`text-base font-semibold leading-tight text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardDescription({ children, className = "", ...props }) {
  return (
    <p className={`text-sm text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/90 leading-normal ${className}`.trim()} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`text-sm text-slate-600 dark:text-slate-200 cyberpunk:text-cyan-100 ${className}`.trim()} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div
      className={`mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/30 flex items-center justify-between text-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
