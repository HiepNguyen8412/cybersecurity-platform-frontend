/**
 * Reusable Divider component for separating content sections.
 * Aligned with Editorial Light & Deep Obsidian Dark hairline borders.
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
        className={`inline-block h-auto self-stretch w-px bg-[#E5E2DC] dark:bg-white/[0.08] mx-2 ${className}`.trim()}
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
        <div className="grow border-t border-[#E5E2DC] dark:border-white/[0.08]" />
        <span className="mx-3 shrink-0 text-[11px] font-mono-tech font-medium text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider bg-transparent">
          {label}
        </span>
        <div className="grow border-t border-[#E5E2DC] dark:border-white/[0.08]" />
      </div>
    )
  }

  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={`border-0 border-t border-[#E5E2DC] dark:border-white/[0.08] my-4 w-full ${className}`.trim()}
      {...props}
    />
  )
}

export default Divider
