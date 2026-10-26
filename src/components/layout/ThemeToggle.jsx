import { RiSunLine, RiMoonLine, RiRadarLine } from "@remixicon/react"
import useThemeStore from "../../stores/useThemeStore"

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  const isLight = theme === "light"
  const isCyber = theme === "cyberpunk"

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`
        px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-2 text-xs font-mono select-none
        ${
          isLight
            ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800 shadow-2xs"
            : isCyber
            ? "bg-emerald-950/40 hover:bg-emerald-900/50 border-emerald-500/40 text-emerald-300 shadow-2xs"
            : "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-slate-200 shadow-2xs"
        }
      `.trim()}
      title={`Chuyển giao diện: Hiện tại là ${isLight ? "SÁNG (EDITORIAL LIGHT)" : isCyber ? "CYBER RANGE (TACTICAL HUD)" : "TỐI (OBSIDIAN TITANIUM)"}`}
      aria-label="Chuyển chế độ hiển thị giao diện"
    >
      {isLight ? (
        <>
          <RiSunLine className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-800">Sáng</span>
        </>
      ) : isCyber ? (
        <>
          <RiRadarLine className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-emerald-300 tracking-wider">CYBER</span>
        </>
      ) : (
        <>
          <RiMoonLine className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white">Tối</span>
        </>
      )}
    </button>
  )
}

export default ThemeToggle

