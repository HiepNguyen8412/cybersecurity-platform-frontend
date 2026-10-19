/**
 * Reusable PageHeader component for consistent top-of-page titles, descriptions, and action buttons.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function PageHeader({
  title,
  description,
  breadcrumbs = null,
  actions = null,
  badge = null,
  icon = null,
  className = "",
}) {
  return (
    <div className={`mb-6 sm:mb-8 flex flex-col space-y-3 ${className}`.trim()}>
      {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 cyberpunk:bg-cyan-950/70 text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 border border-blue-100 dark:border-blue-800/60 cyberpunk:border-cyan-500/50 shrink-0 mt-0.5 shadow-2xs cyberpunk:shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              {icon}
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
                {title}
              </h1>
              {badge}
            </div>

            {description && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/90 leading-relaxed max-w-3xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
