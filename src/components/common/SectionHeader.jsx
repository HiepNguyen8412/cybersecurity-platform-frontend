/**
 * Reusable SectionHeader component for inner card and section groupings.
 * Aligned with Editorial Light & Deep Obsidian Dark.
 */
export function SectionHeader({
  title,
  description = null,
  actions = null,
  badge = null,
  className = "",
}) {
  return (
    <div
      className={`mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`.trim()}
    >
      <div className="flex flex-col space-y-0.5">
        <div className="flex items-center gap-2">
          <h2 className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
            {title}
          </h2>
          {badge}
        </div>

        {description && (
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-normal">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  )
}

export default SectionHeader
