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
      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-mono shadow-xs"
      title={`Chuyển giao diện (Hiện tại: ${theme.toUpperCase()})`}
      aria-label="Toggle visual theme"
    >
      {isLight ? (
        <>
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline-block font-semibold">Light</span>
        </>
      ) : isCyber ? (
        <>
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline-block font-semibold text-emerald-400">Cyber</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline-block font-semibold">Dark</span>
        </>
      )}
    </button>
  )
}

export default ThemeToggle
