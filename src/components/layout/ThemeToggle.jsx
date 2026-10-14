import { Moon, Sun, Sparkles } from "lucide-react"
import useThemeStore from "../../stores/useThemeStore"

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  const isLight = theme === "light"
  const isCyber = theme === "cyberpunk"

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-mono"
      title={`Chuyển giao diện (Hiện tại: ${theme.toUpperCase()})`}
      aria-label="Toggle visual theme"
    >
      {isLight ? (
        <>
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline-block">Light</span>
        </>
      ) : isCyber ? (
        <>
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          <span className="hidden sm:inline-block">Cyber</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline-block">Dark</span>
        </>
      )}
    </button>
  )
}

export default ThemeToggle
