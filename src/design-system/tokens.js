/**
 * Centralized Design System Tokens (JavaScript definitions)
 * CyberPath v2 ("Academic Research Atelier") — Editorial Light & Deep Obsidian Dark.
 */

export const themes = {
  light: {
    canvas: "#FAF9F6",
    surface: "#FFFFFF",
    subtle: "#F3F1EC",
    muted: "#ECE9E2",
    borderSubtle: "#EFEDE7",
    borderDefault: "#E5E2DC",
    borderStrong: "#D0CCC3",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#64748B",
    primary500: "#2563EB",
    primary600: "#1D4ED8",
  },
  dark: {
    canvas: "#0B0E14",
    surface: "#121722",
    subtle: "#161C2A",
    muted: "#1B2335",
    borderSubtle: "rgba(255, 255, 255, 0.06)",
    borderDefault: "rgba(255, 255, 255, 0.09)",
    borderStrong: "rgba(255, 255, 255, 0.16)",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    primary500: "#3B82F6",
    primary600: "#2563EB",
  },
}

export const colors = {
  canvas: "var(--bg-canvas)",
  surface: "var(--bg-surface)",
  surfaceHover: "var(--bg-surface-hover)",
  surfaceActive: "var(--bg-surface-active)",
  surfaceSubtle: "var(--bg-subtle)",
  surfaceMuted: "var(--bg-muted)",

  borderSubtle: "var(--border-subtle)",
  borderDefault: "var(--border-default)",
  borderStrong: "var(--border-strong)",
  borderFocus: "var(--border-focus)",

  textPrimary: "var(--text-primary)",
  textSecondary: "var(--text-secondary)",
  textMuted: "var(--text-muted)",
  textDisabled: "var(--text-disabled)",
  textInverse: "var(--text-inverse)",

  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    500: "#2563EB",
    600: "#1D4ED8",
    700: "#1E40AF",
    800: "#1E3A8A",
  },

  indigo: {
    50: "#EEF2FF",
    100: "#E0E7FF",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
  },

  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
  },

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },

  danger: {
    50: "#FFF1F2",
    100: "#FFE4E6",
    500: "#F43F5E",
    600: "#E11D48",
    700: "#BE123C",
  },

  info: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
  },
}

export const typography = {
  fontSerif: "var(--font-serif)",
  fontHeading: "var(--font-heading)",
  fontSans: "var(--font-sans)",
  fontMono: "var(--font-mono)",
  hierarchy: {
    display:
      "font-serif-editorial text-3xl sm:text-5xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]",
    editorialTitle:
      "font-serif-editorial text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]",
    pageTitle:
      "text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]",
    sectionTitle:
      "text-lg font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]",
    cardTitle:
      "text-base font-semibold text-[#0F172A] dark:text-[#F1F5F9]",
    body:
      "text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed",
    small:
      "text-xs text-[#64748B] dark:text-[#94A3B8]",
    caption:
      "font-mono-tech text-[11px] font-medium uppercase tracking-wider text-[#64748B]",
    label:
      "text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]",
  },
}

export const spacing = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
}

export const radii = {
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  full: "var(--radius-full)",
}

export const shadows = {
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)",
  xl: "var(--shadow-xl)",
  dropdown: "var(--shadow-dropdown)",
  modal: "var(--shadow-modal)",
}

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

export const layout = {
  topbarHeight: "64px",
  sidebarWidth: "240px",
  containerMaxWidth: "1240px",
  spacingPage: "24px",
  spacingSection: "24px",
  spacingCardGap: "18px",
}
