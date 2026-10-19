import { Moon, Sun, Terminal } from "lucide-react"
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
        px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-2 text-xs font-mono shadow-xs select-none
        ${
          isLight
            ? "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
            : isCyber
            ? "bg-cyan-950/90 hover:bg-cyan-900 border-cyan-500/80 text-cyan-300 shadow-xs border-cyan-500/50"
            : "bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-100"
        }
      `.trim()}
      title={`Chuyển giao diện: Hiện tại là ${isLight ? "LIGHT" : isCyber ? "CYBER RANGE (NEON)" : "DARK (STEALTH)"}`}
      aria-label="Toggle visual theme"
    >
      {isLight ? (
        <>
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">Sáng</span>
        </>
      ) : isCyber ? (
        <>
          <Terminal className="w-4 h-4 text-cyan-300 animate-pulse" />
          <span className="font-bold text-cyan-300 tracking-wider">CYBER</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-white">Tối</span>
        </>
      )}
    </button>
  )
}

export default ThemeToggle
