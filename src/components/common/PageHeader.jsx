/**
 * Reusable PageHeader component for consistent top-of-page titles, descriptions, and action buttons.
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
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
              {icon}
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                {title}
              </h1>
              {badge}
            </div>

            {description && (
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
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
