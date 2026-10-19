import { Flame, Compass } from "lucide-react"
import { CountUp } from "../../../components/common"

/**
 * DashboardHeader Component
 * 
 * High-contrast, theme-aware greeting & mission clearance banner.
 * Crisp visibility across Light, Stealth Dark, and Tactical Cyber Range.
 */
export function DashboardHeader({
  userName = "Chuyên viên SOC",
  streakDays = 7,
  activePathTitle = "Security Analyst",
  className = "",
}) {
  const displayName = (userName && userName.trim()) || "Chuyên viên SOC"

  return (
    <header
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 ${className}`.trim()}
      aria-label="Dashboard Welcome"
    >
      {/* Left: Greeting & Mission Subtitle */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
            Chào buổi sáng, {displayName} <span className="inline-block animate-wiggle select-none" aria-hidden="true">⚡</span>
          </h1>
          <span className="font-mono-tech text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/50 shadow-2xs">
            TRUY CẬP: LVL-4 // SOC READY
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80 font-normal leading-relaxed">
          Trung Tâm Tác Chiến An Ninh Mạng • Lộ Trình Phòng Thủ Chủ Động & Ứng Cứu Sự Cố
        </p>
      </div>

      {/* Right: Quick Context Badges */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
        {/* Streak Pill */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 dark:bg-amber-950/50 dark:border-amber-700/60 dark:text-amber-200 cyberpunk:bg-amber-950/40 cyberpunk:border-amber-500/50 cyberpunk:text-amber-300 text-xs font-semibold select-none shadow-2xs font-mono-tech"
          title={`$<CountUp end={streakDays} duration={1400} /> ngày trực chiến phòng thủ liên tục`}
          aria-label={`$<CountUp end={streakDays} duration={1400} /> ngày trực chiến`}
        >
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500" aria-hidden="true" />
          <span><CountUp end={streakDays} duration={1400} /> NGÀY TRỰC CHIẾN</span>
        </div>

        {/* Active Path Pill */}
        <div
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200/90 text-blue-800 dark:bg-blue-950/50 dark:border-blue-700/60 dark:text-blue-200 cyberpunk:bg-cyan-950/50 cyberpunk:border-cyan-500/50 cyberpunk:text-cyan-200 text-xs font-medium select-none shadow-2xs font-mono-tech"
          title={`Đang tham gia lộ trình ${activePathTitle}`}
          aria-label={`Lộ trình hiện tại: ${activePathTitle}`}
        >
          <Compass className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 cyberpunk:text-cyan-400" aria-hidden="true" />
          <span className="font-bold text-blue-950 dark:text-blue-100 cyberpunk:text-cyan-100 truncate max-w-[170px] uppercase">{activePathTitle}</span>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
