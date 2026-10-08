/**
 * Reusable SectionHeader component for inner card and section groupings.
 */
export function SectionHeader({
  title,
  description = null,
  actions = null,
  badge = null,
  className = "",
}) {
  return (
    <div className={`mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${className}`.trim()}>
      <div className="flex flex-col space-y-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-800 tracking-tight">
            {title}
          </h2>
          {badge}
        </div>

        {description && (
          <p className="text-xs text-slate-500 leading-normal">
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
