import { Link } from "react-router-dom"
import { ArrowRight, Clock, Target, PlayCircle, FileText, CheckCircle2 } from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../../components/common"

/**
 * NextStepCard Component
 * 
 * The primary focal section of the Dashboard.
 * Visually communicates: "This is what you should do next."
 * Balanced in weight: clear, prominent, elegant, not overly heavy.
 */
export function NextStepCard({
  nextStep = {},
  className = "",
}) {
  const {
    type = "Hands-on Lab",
    courseTitle = "Web Security Fundamentals",
    lessonTitle = "SQL Injection: Filter Evasion & Parameterization",
    description = "Learn how attackers bypass naive keyword filters and practice implementing hardened parameterized prepared statements in real-world application code.",
    progress = 65,
    currentTopic = "Lesson 4 of 6: Parameterized Query Construction",
    estimatedTime = "15 mins remaining",
    primaryAction = { label: "Continue Lab", path: "/labs" },
    secondaryAction = { label: "View Lesson Notes", path: "/learning" },
  } = nextStep

  return (
    <section aria-labelledby="next-step-heading" className={className}>
      <Card
        variant="focal"
        className="relative overflow-hidden border-blue-200/90 shadow-md transition-all hover:shadow-lg border-l-4 border-l-blue-600 bg-gradient-to-r from-white via-white to-blue-50/40 p-5 sm:p-6"
      >
        <div className="flex flex-col space-y-4">
          {/* Top Row: Mission Status + MITRE Tag + Remaining Time */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider font-mono-tech select-none shadow-2xs">
                <Target className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>MISSION DISPATCH</span>
              </span>

              <Badge variant="cyber" size="sm">
                {type}
              </Badge>

              <span className="hidden sm:inline-flex items-center text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                MITRE: T1190
              </span>
            </div>

            {estimatedTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-slate-500">
                <Clock className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                <span>{estimatedTime}</span>
              </span>
            )}
          </div>

          {/* Core Content: Context & Main Action Title */}
          <div className="space-y-1.5">
            {courseTitle && (
              <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
                {courseTitle}
              </p>
            )}

            <h2
              id="next-step-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600"
            >
              {lessonTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Progress Container */}
          <div className="rounded-xl bg-slate-50/90 border border-slate-200/70 p-3 sm:p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <PlayCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
                <span>{currentTopic}</span>
              </span>
              <span className="text-blue-600 font-bold tabular-nums">
                <CountUp end={progress} suffix="% Completed" />
              </span>
            </div>

            <ProgressBar
              value={progress}
              max={100}
              variant="primary"
              size="sm"
              label={`Lesson progress: ${progress}%`}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Next up: Parameterized Query Verification</span>
              <span className="text-emerald-700 font-medium hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                <span>3 of 6 tasks validated</span>
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-slate-500">
              Pick up right where you left off. No setup required.
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
              {secondaryAction?.label && (
                <Link to={secondaryAction.path || "/learning"}>
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<FileText className="h-3.5 w-3.5 text-slate-400" />}
                  >
                    {secondaryAction.label}
                  </Button>
                </Link>
              )}

              <Link to={primaryAction?.path || "/labs"}>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {primaryAction?.label || "Continue"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default NextStepCard

