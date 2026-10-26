import { RiRadarLine } from "@remixicon/react"

/**
 * Ultra-Sleek, Minimalist Page Loading Fallback (Linear / Vercel style)
 * Replaces chunky bouncing graphics with a silky top laser progress line
 * and non-intrusive, zero-shift content skeleton placeholders.
 */
export function PageLoadingFallback() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-start relative overflow-hidden py-4 px-2 sm:px-4 animate-in fade-in duration-200">
      {/* 1. Ultra-Fine Top Gradient Laser Bar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 overflow-hidden pointer-events-none">
        <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 animate-[shimmer_1.5s_infinite] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
      </div>

      {/* 2. Minimalist Breadcrumb & Title Shimmer Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/60 dark:border-white/[0.06]">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-slate-200/70 dark:bg-white/[0.05] animate-pulse" />
          <div className="h-6 w-56 rounded-lg bg-slate-200/90 dark:bg-white/[0.08] animate-pulse" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] text-[11px] font-mono text-slate-400">
          <RiRadarLine className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
          <span>Đang đồng bộ...</span>
        </div>
      </div>

      {/* 3. Sleek Non-Intrusive Shimmer Grid (Zero Layout Shift) */}
      <div className="mt-6 space-y-5">
        {/* Top 3 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 rounded-2xl bg-white dark:bg-[#0f121a] border border-slate-200/80 dark:border-white/[0.06] p-4 space-y-3 shadow-xs">
            <div className="h-3 w-20 rounded bg-slate-200/80 dark:bg-white/[0.06] animate-pulse" />
            <div className="h-7 w-28 rounded bg-slate-200/90 dark:bg-white/[0.09] animate-pulse" />
          </div>
          <div className="h-28 rounded-2xl bg-white dark:bg-[#0f121a] border border-slate-200/80 dark:border-white/[0.06] p-4 space-y-3 shadow-xs">
            <div className="h-3 w-24 rounded bg-slate-200/80 dark:bg-white/[0.06] animate-pulse" />
            <div className="h-7 w-32 rounded bg-slate-200/90 dark:bg-white/[0.09] animate-pulse" />
          </div>
          <div className="h-28 rounded-2xl bg-white dark:bg-[#0f121a] border border-slate-200/80 dark:border-white/[0.06] p-4 space-y-3 shadow-xs">
            <div className="h-3 w-20 rounded bg-slate-200/80 dark:bg-white/[0.06] animate-pulse" />
            <div className="h-7 w-24 rounded bg-slate-200/90 dark:bg-white/[0.09] animate-pulse" />
          </div>
        </div>

        {/* Main Content Area Skeleton */}
        <div className="h-72 rounded-2xl bg-white dark:bg-[#0f121a] border border-slate-200/80 dark:border-white/[0.06] p-6 shadow-xs relative overflow-hidden">
          <div className="h-4 w-40 rounded bg-slate-200/80 dark:bg-white/[0.06] mb-6 animate-pulse" />
          <div className="space-y-3">
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] animate-pulse" />
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] animate-pulse" />
            <div className="h-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageLoadingFallback
