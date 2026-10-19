import { ShieldCheck } from "lucide-react"

/**
 * High-Tech Cyber Loading Skeleton Fallback for React Suspense / Lazy Loading
 * Adaptive across Light, Dark, and Cyber Range themes.
 */
export function PageLoadingFallback() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col justify-start items-center relative overflow-hidden py-10 px-4 sm:px-6 animate-fade-in bg-transparent">
      {/* Top Laser Progress Bar */}
      <div className="cyber-top-loader-bar" aria-hidden="true">
        <div className="cyber-top-loader-laser" />
      </div>

      {/* Central Security Node Handshake Badge */}
      <div className="my-8 flex flex-col items-center space-y-3 z-10">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-cyan-600 text-white shadow-lg shadow-blue-500/25 animate-float">
          <ShieldCheck className="h-7 w-7 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-white dark:ring-slate-900 animate-ping" />
        </div>

        <div className="flex flex-col items-center text-center space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
            <span className="font-mono-tech text-xs font-bold text-blue-900 dark:text-white cyberpunk:text-cyan-300 tracking-wider uppercase">
              KHỞI TẠO MÔI TRƯỜNG TÁC CHIẾN
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80 font-mono-tech">
            Đang đồng bộ hóa sandbox và tài nguyên bảo mật...
          </p>
        </div>
      </div>

      {/* Responsive Skeleton Mock Grid */}
      <div className="w-full max-w-[1240px] space-y-6">
        {/* Skeleton Header Card */}
        <div className="w-full h-28 cyber-card cyber-skeleton rounded-2xl p-6" />

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 cyber-card cyber-skeleton rounded-2xl" />
          <div className="h-48 cyber-card cyber-skeleton rounded-2xl" />
          <div className="h-48 cyber-card cyber-skeleton rounded-2xl" />
        </div>

        {/* Skeleton Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-64 cyber-card cyber-skeleton rounded-2xl" />
          <div className="lg:col-span-4 h-64 cyber-card cyber-skeleton rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default PageLoadingFallback
