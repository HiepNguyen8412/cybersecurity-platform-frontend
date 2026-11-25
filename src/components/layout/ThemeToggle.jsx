import { RiSunLine, RiMoonLine } from "@remixicon/react"
import useThemeStore from "../../stores/useThemeStore"

/**
 * ThemeToggle
 * Refined 2-state segmented pill switch between Editorial Light ("Sáng") and Deep Obsidian Dark ("Tối").
 * Compact icon-only labels on narrow mobile (<640px) to prevent header overflow.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()
  const isDark = theme === "dark"

  return (
    <div
      role="group"
      aria-label="Chuyển chế độ giao diện Sáng hoặc Tối"
      className="inline-flex items-center p-0.5 rounded-full bg-[#ECE9E2] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.09] select-none transition-colors duration-200 shrink-0"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={!isDark}
        aria-label="Chế độ Sáng"
        title="Chuyển sang giao diện Sáng (Editorial Light)"
        className={`inline-flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] ${
          !isDark
            ? "bg-white text-[#0F172A] shadow-2xs border border-[#E5E2DC]/80"
            : "text-[#94A3B8] hover:text-[#F1F5F9] border border-transparent"
        }`}
      >
        <RiSunLine
          className={`w-3.5 h-3.5 shrink-0 ${!isDark ? "text-amber-600" : "text-[#64748B]"}`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">Sáng</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={isDark}
        aria-label="Chế độ Tối"
        title="Chuyển sang giao diện Tối (Deep Obsidian)"
        className={`inline-flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] ${
          isDark
            ? "bg-[#121722] text-[#F1F5F9] shadow-2xs border border-white/[0.12]"
            : "text-[#64748B] hover:text-[#0F172A] border border-transparent"
        }`}
      >
        <RiMoonLine
          className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-[#3B82F6]" : "text-[#64748B]"}`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">Tối</span>
      </button>
    </div>
  )
}

export default ThemeToggle
