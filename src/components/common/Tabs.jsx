/**
 * Reusable accessible Tabs component with Editorial Light & Deep Obsidian Dark support.
 */
export function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "underline",
  className = "",
}) {
  const variantContainerStyles = {
    underline: "border-b border-[#E5E2DC] dark:border-white/[0.08] gap-6",
    pills: "gap-2",
    segmented:
      "bg-[#F3F1EC] dark:bg-[#161C2A] p-1 rounded-xl gap-1 border border-[#E5E2DC] dark:border-white/[0.08] inline-flex",
  }

  const getItemStyles = (isActive, isDisabled, currentVariant) => {
    if (isDisabled) {
      return "opacity-40 cursor-not-allowed text-[#94A3B8] dark:text-[#64748B]"
    }

    if (currentVariant === "segmented") {
      return isActive
        ? "bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC]/60 dark:border-white/[0.08] font-semibold"
        : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-white/60 dark:hover:bg-white/[0.04] border border-transparent"
    }

    if (currentVariant === "pills") {
      return isActive
        ? "bg-[#1D4ED8] dark:bg-[#2563EB] text-white font-semibold shadow-2xs"
        : "text-[#475569] dark:text-[#94A3B8] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
    }

    // Kiểu gạch chân mặc định
    return isActive
      ? "text-[#1D4ED8] dark:text-[#38BDF8] border-b-2 border-[#1D4ED8] dark:border-[#38BDF8] font-semibold rounded-none"
      : "text-[#64748B] dark:text-[#94A3B8] border-b-2 border-transparent hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:border-[#D0CCC3] dark:hover:border-white/[0.2] rounded-none"
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
              inline-flex items-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap
              ${variant === "underline" ? "rounded-t-lg" : "rounded-lg"}
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6]
              ${getItemStyles(isActive, isDisabled, variant)}
            `.trim()}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.5 text-[10px] font-mono-tech rounded-full font-semibold ${
                  isActive && variant === "pills"
                    ? "bg-white/20 text-white"
                    : "bg-[#ECE9E2] dark:bg-[#1B2335] text-[#475569] dark:text-[#94A3B8]"
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
