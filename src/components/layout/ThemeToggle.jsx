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
            ? "bg-blue-950/60 hover:bg-blue-900/70 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            : "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-slate-200 shadow-2xs"
        }
      `.trim()}
      title={`Chuyển giao diện: Hiện tại là ${isLight ? "SÁNG (EDITORIAL LIGHT)" : isCyber ? "CYBER BLUE (TACTICAL SOC)" : "TỐI (OBSIDIAN TITANIUM)"}`}
      aria-label="Chuyển chế độ hiển thị giao diện"
    >
      {isLight ? (
        <>
          <RiSunLine className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-800">Sáng</span>
        </>
      ) : isCyber ? (
        <>
          <RiRadarLine className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-cyan-300 tracking-wider">CYBER BLUE</span>
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

