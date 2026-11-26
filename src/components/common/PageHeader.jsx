/**
 * Reusable PageHeader component for consistent top-of-page titles, descriptions, and action buttons.
 * Aligned with Editorial Light & Deep Obsidian Dark.
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
            <div className="p-2.5 rounded-xl bg-[#EFF6FF] dark:bg-[#3B82F6]/12 text-[#1D4ED8] dark:text-[#38BDF8] border border-[#BFDBFE]/80 dark:border-[#3B82F6]/25 shrink-0 mt-0.5">
              {icon}
            </div>
          )}

          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                {title}
              </h1>
              {badge}
            </div>

            {description && (
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
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
