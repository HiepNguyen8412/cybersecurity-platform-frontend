import { create } from "zustand"

/**
 * useThemeStore
 * Manages active application visual theme (dark, light, cyberpunk) and applies classes to document.
 */
export const useThemeStore = create((set, get) => ({
  theme: localStorage.getItem("cyber_theme") || "dark",

  initTheme: () => {
    const saved = localStorage.getItem("cyber_theme") || "dark"
    get().setTheme(saved)
  },

  setTheme: (newTheme) => {
    localStorage.setItem("cyber_theme", newTheme)
    const root = document.documentElement

    // Clean old theme classes
    root.classList.remove("light", "dark", "cyberpunk")

    if (newTheme === "light") {
      root.classList.add("light")
      root.style.colorScheme = "light"
    } else if (newTheme === "cyberpunk") {
      root.classList.add("dark", "cyberpunk")
      root.style.colorScheme = "dark"
    } else {
      root.classList.add("dark")
      root.style.colorScheme = "dark"
    }

    set({ theme: newTheme })
  },

  toggleTheme: () => {
    const current = get().theme
    const nextTheme = current === "dark" ? "light" : current === "light" ? "cyberpunk" : "dark"
    get().setTheme(nextTheme)
  },
}))

export default useThemeStore
