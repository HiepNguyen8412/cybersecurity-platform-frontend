/**
 * Reusable accessible Tabs component.
 */
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "underline",
  className = "",
}) {
  const variantContainerStyles = {
    underline: "border-b border-slate-200 gap-6",
    pills: "gap-2",
    segmented: "bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/60 inline-flex",
  }

  const getItemStyles = (isActive, isDisabled, variant) => {
    if (isDisabled) {
      return "opacity-40 cursor-not-allowed text-slate-400"
    }

    if (variant === "segmented") {
      return isActive
        ? "bg-white text-slate-900 shadow-xs font-semibold"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
    }

    if (variant === "pills") {
      return isActive
        ? "bg-blue-600 text-white font-semibold shadow-xs"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }

    // Default underline
    return isActive
      ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
      : "text-slate-500 border-b-2 border-transparent hover:text-slate-800 hover:border-slate-300"
  }

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`flex items-center select-none overflow-x-auto ${
        variantContainerStyles[variant] || variantContainerStyles.underline
      } ${className}`.trim()}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const isDisabled = Boolean(tab.disabled)

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            disabled={isDisabled}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => {
              if (!isDisabled) onChange?.(tab.id)
            }}
            className={`
              inline-flex items-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer rounded-lg
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600
              ${getItemStyles(isActive, isDisabled, variant)}
            `.trim()}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
                  isActive && variant === "pills"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-200/80 text-slate-700"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs
