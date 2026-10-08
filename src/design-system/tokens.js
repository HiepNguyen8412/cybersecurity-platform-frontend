/**
 * Centralized Design System Tokens (JavaScript definitions)
 * For programmatic access, styling utilities, and documentation.
 */

export const colors = {
  canvas: 'var(--bg-canvas)',
  surface: 'var(--bg-surface)',
  surfaceHover: 'var(--bg-surface-hover)',
  surfaceActive: 'var(--bg-surface-active)',
  surfaceMuted: 'var(--bg-muted)',

  borderSubtle: 'var(--border-subtle)',
  borderDefault: 'var(--border-default)',
  borderStrong: 'var(--border-strong)',
  borderFocus: 'var(--border-focus)',

  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  textDisabled: 'var(--text-disabled)',
  textInverse: 'var(--text-inverse)',

  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
  },

  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
  },

  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },

  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
}

export const typography = {
  fontSans: "var(--font-sans)",
  fontHeading: "var(--font-heading)",
  hierarchy: {
    display: "text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900",
    pageTitle: "text-2xl font-bold tracking-tight text-slate-900",
    sectionTitle: "text-lg font-semibold tracking-tight text-slate-800",
    cardTitle: "text-base font-semibold text-slate-900",
    body: "text-sm text-slate-600 leading-relaxed",
    small: "text-xs text-slate-500",
    caption: "text-[11px] font-semibold uppercase tracking-wider text-slate-400",
    label: "text-sm font-medium text-slate-700",
  },
}

export const spacing = {
  1: "0.25rem", // 4px
  2: "0.5rem",  // 8px
  3: "0.75rem", // 12px
  4: "1rem",    // 16px
  5: "1.25rem", // 20px
  6: "1.5rem",  // 24px
  8: "2rem",    // 32px
  10: "2.5rem", // 40px
  12: "3rem",   // 48px
  16: "4rem",   // 64px
}

export const radii = {
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  '2xl': "var(--radius-2xl)",
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
  '2xl': "1536px",
}

export const layout = {
  topbarHeight: "64px",
  sidebarWidth: "240px",
  containerMaxWidth: "1240px",
  spacingPage: "24px",
  spacingSection: "24px",
  spacingCardGap: "18px",
}
