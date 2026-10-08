import { Flame, Compass } from "lucide-react"

/**
 * DashboardHeader Component
 * 
 * Displays the welcoming greeting:
 * "Good morning, {learnerName} 👋"
 * "Continue your cybersecurity journey."
 * 
 * Safely reads the learner name from authenticated user state or falls back to "Learner".
 */
export function DashboardHeader({
  userName = "Learner",
  streakDays = 7,
  activePathTitle = "Security Analyst",
  className = "",
}) {
  // Gracefully resolve name: never display empty or undefined
  const displayName = (userName && userName.trim()) || "Learner"

  return (
    <header
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 ${className}`.trim()}
      aria-label="Dashboard Welcome"
    >
      {/* Left: Greeting & Mission Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Good morning, {displayName} <span className="inline-block animate-wiggle select-none" aria-hidden="true">👋</span>
          </h1>
          <span className="font-mono-tech text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            CLEARANCE: LVL-4
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
          Operational Security Dashboard • Active Cyber Defense Track
        </p>
      </div>

      {/* Right: Quick Context Badges */}
      <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
        {/* Streak Pill */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs font-semibold select-none shadow-2xs font-mono-tech"
          title={`${streakDays} consecutive days active on CyberPath`}
          aria-label={`${streakDays} days learning streak`}
        >
          <Flame className="h-4 w-4 text-amber-500 fill-amber-500" aria-hidden="true" />
          <span>{streakDays}-DAY STREAK</span>
        </div>

        {/* Active Path Pill */}
        <div
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200/90 text-blue-800 text-xs font-medium select-none shadow-2xs font-mono-tech"
          title={`Enrolled in ${activePathTitle} path`}
          aria-label={`Current path: ${activePathTitle}`}
        >
          <Compass className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          <span className="font-bold text-blue-900 truncate max-w-[170px] uppercase">{activePathTitle}</span>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader

