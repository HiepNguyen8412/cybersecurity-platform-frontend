/**
 * Reusable Divider component for separating content sections.
 */
export function Divider({
  orientation = "horizontal",
  label = null,
  className = "",
  ...props
}) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block h-auto self-stretch w-px bg-slate-200 mx-2 ${className}`.trim()}
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`relative flex items-center w-full my-4 ${className}`.trim()}
        {...props}
      >
        <div className="grow border-t border-slate-200" />
        <span className="mx-3 shrink-0 text-xs font-medium text-slate-400 uppercase tracking-wider bg-transparent">
          {label}
        </span>
        <div className="grow border-t border-slate-200" />
      </div>
    )
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={`border-0 border-t border-slate-200 my-4 w-full ${className}`.trim()}
      {...props}
    />
  )
}

export default Divider
