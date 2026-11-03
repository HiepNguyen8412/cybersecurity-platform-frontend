import { memo } from "react"
import { useLocation } from "react-router-dom"

/**
 * PageLoadingFallback
 * 
 * Bespoke, Human-Grade Skeleton Fallback for React Suspense transitions.
 * Eliminates AI clichés (no neon rainbow lasers, no spinning radars, no fake telemetry).
 * Mirrors exact layout proportions to achieve Zero-Layout-Shift (ZLS).
 */
export const PageLoadingFallback = memo(function PageLoadingFallback({ type }) {
  const location = useLocation()
  const isDashboardRoute =
    type === "dashboard" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/progress") ||
    location.pathname.startsWith("/settings")

  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-start relative overflow-hidden animate-in fade-in duration-150">
      {/* 1. Hairline Top Loading Indicator (Minimalist & Calm, 1.5px) */}
      <div className="fixed top-0 left-0 right-0 h-[1.5px] z-50 overflow-hidden pointer-events-none bg-transparent">
        <div className="h-full w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500 animate-[shimmer_1.2s_cubic-bezier(0.4,0,0.2,1)_infinite] opacity-90" />
      </div>

      {isDashboardRoute ? (
        /* Authenticated Platform / Dashboard Skeleton (Container matches AppLayout) */
        <div className="w-full space-y-6">
          {/* Header Bar Skeleton */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200/60 dark:border-white/[0.06]">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded-md bg-slate-200/70 dark:bg-white/[0.04] animate-pulse" />
              <div className="h-6 w-48 rounded-lg bg-slate-200/90 dark:bg-white/[0.07] animate-pulse" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-slate-100 dark:bg-white/[0.04] animate-pulse" />
          </div>

          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="h-28 rounded-2xl bg-white/50 dark:bg-[#0d111a] border border-slate-200/70 dark:border-white/[0.05] p-5 space-y-3"
              >
                <div className="h-3 w-20 rounded bg-slate-200/70 dark:bg-white/[0.04] animate-pulse" />
                <div className="h-6 w-28 rounded bg-slate-200/90 dark:bg-white/[0.08] animate-pulse" />
              </div>
            ))}
          </div>

          {/* Large Main View Skeleton (Table / Chart) */}
          <div className="h-72 rounded-2xl bg-white/50 dark:bg-[#0d111a] border border-slate-200/70 dark:border-white/[0.05] p-6 space-y-4">
            <div className="h-4 w-36 rounded bg-slate-200/70 dark:bg-white/[0.05] animate-pulse mb-6" />
            <div className="space-y-3">
              <div className="h-10 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] animate-pulse" />
              <div className="h-10 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] animate-pulse" />
              <div className="h-10 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        /* Public / Marketing Route Skeleton (Container matches PublicLayout max-w-7xl) */
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Subtle Top Status Indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/[0.05]">
            <div className="h-3 w-28 rounded bg-slate-200/70 dark:bg-white/[0.04] animate-pulse" />
            <div className="h-3 w-16 rounded bg-slate-200/50 dark:bg-white/[0.03] animate-pulse" />
          </div>

          {/* Hero Banner Skeleton */}
          <div className="h-60 sm:h-72 rounded-3xl bg-slate-100/60 dark:bg-[#0d111a] border border-slate-200/70 dark:border-white/[0.05] p-8 flex flex-col justify-center items-center text-center space-y-4">
            <div className="h-3 w-36 rounded-full bg-slate-200/70 dark:bg-white/[0.05] animate-pulse" />
            <div className="h-8 sm:h-10 w-3/4 max-w-md rounded-xl bg-slate-200/90 dark:bg-white/[0.08] animate-pulse" />
            <div className="h-3.5 w-2/3 max-w-sm rounded-md bg-slate-200/50 dark:bg-white/[0.04] animate-pulse" />
            <div className="pt-2 flex gap-3">
              <div className="h-9 w-28 rounded-xl bg-slate-200/90 dark:bg-white/[0.07] animate-pulse" />
              <div className="h-9 w-24 rounded-xl bg-slate-200/50 dark:bg-white/[0.04] animate-pulse" />
            </div>
          </div>

          {/* 3 Showcase Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-64 rounded-2xl bg-white/50 dark:bg-[#0d111a] border border-slate-200/70 dark:border-white/[0.05] p-5 space-y-4"
              >
                <div className="h-32 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200/70 dark:bg-white/[0.06] animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-slate-200/50 dark:bg-white/[0.04] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export default PageLoadingFallback
