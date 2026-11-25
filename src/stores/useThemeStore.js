import { create } from "zustand"

const THEME_STORAGE_KEY = "cyber_theme"

function normalizeTheme(value) {
  if (value === "dark" || value === "cyberpunk") return "dark"
  return "light"
}

function readStoredTheme() {
  if (typeof window === "undefined") return "light"
  try {
    return normalizeTheme(localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    return "light"
  }
}

/**
 * useThemeStore
 * Manages CyberPath v2's 2-theme system ("light" Editorial Light & "dark" Deep Obsidian Lab Dark).
 * Coerces legacy "cyberpunk" entries to "dark" and defaults first-time visitors to "light".
 */
export const useThemeStore = create((set, get) => ({
  theme: readStoredTheme(),

  initTheme: () => {
    const saved = readStoredTheme()
    get().setTheme(saved)
  },

  setTheme: (newTheme) => {
    const resolvedTheme = normalizeTheme(newTheme)

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme)
      } catch {
        // Ignore storage errors in restricted environments
      }
    }

    if (typeof document !== "undefined") {
      const root = document.documentElement
      root.classList.remove("light", "dark", "cyberpunk")
      root.classList.add(resolvedTheme)
      root.setAttribute("data-theme", resolvedTheme)
      root.style.colorScheme = resolvedTheme

      const themeColorMeta = document.querySelector('meta[name="theme-color"]')
      if (themeColorMeta) {
        themeColorMeta.setAttribute(
          "content",
          resolvedTheme === "dark" ? "#0B0E14" : "#FAF9F6"
        )
      }
    }

    set({ theme: resolvedTheme })
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark"
    get().setTheme(nextTheme)
  },
}))

export default useThemeStore
