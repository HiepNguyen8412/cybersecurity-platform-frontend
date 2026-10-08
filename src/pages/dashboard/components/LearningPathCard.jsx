import { useState } from "react"
import { Link } from "react-router-dom"
import { Compass, ArrowRight, Layers, FlaskConical, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../../components/common"

/**
 * LearningPathCard Component
 * 
 * Displays the user's active learning path with progress and stage breakdown.
 * Also supports browsing/switching other mock paths:
 * - Security Analyst (default current)
 * - Web Penetration Testing
 * - SOC Operations
 * - Cryptography
 */
export function LearningPathCard({
  paths = [],
  className = "",
}) {
  // Find current path or fallback to first
  const defaultPath = paths.find((p) => p.isCurrent) || paths[0] || {}
  const [selectedPathId, setSelectedPathId] = useState(defaultPath.id)

  const activePath = paths.find((p) => p.id === selectedPathId) || defaultPath

  return (
    <Card variant="default" className={`overflow-hidden border-slate-200/90 shadow-2xs ${className}`.trim()}>
      <div className="space-y-4">
        {/* Section Header with Path Selection Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <Compass className="h-4.5 w-4.5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Current Learning Path
              </h2>
              <p className="text-[11px] text-slate-500">
                Structured career curriculum & milestones
              </p>
            </div>
          </div>

          <Link
            to="/learning-paths"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Browse all paths</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Path Switching Pills (Supports other mock paths) */}
        {paths.length > 1 && (
          <div
            role="tablist"
            aria-label="Available Learning Paths"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          >
            {paths.map((p) => {
              const isSelected = p.id === activePath.id
              const isEnrolled = p.isCurrent

              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedPathId(p.id)}
                  className={`
                    px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer select-none
                    ${
                      isSelected
                        ? "bg-slate-900 text-white font-semibold shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                    }
                  `.trim()}
                >
                  <span className="flex items-center gap-1.5">
                    {p.title}
                    {isEnrolled && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-blue-400" : "bg-blue-600"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Active Path Hero Card Content */}
        <div className="rounded-xl border border-blue-100/80 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/50 p-4 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {activePath.title}
                </h3>
                {activePath.isCurrent ? (
                  <Badge variant="primary" size="sm" dot>
                    Active Path
                  </Badge>
                ) : (
                  <Badge variant="outline" size="sm">
                    Alternative Path
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                {activePath.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 tabular-nums">
                <CountUp end={activePath.progress || 0} suffix="%" />
              </span>
              <p className="text-[10px] text-slate-400 font-medium">Path Completion</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <ProgressBar
              value={activePath.progress || 0}
              max={100}
              variant="primary"
              size="md"
              label={`${activePath.title} overall progress`}
            />

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="font-semibold text-slate-700">
                {activePath.currentStage}
              </span>
              <span>
                {activePath.completedStages || 0} of {activePath.totalStages || 5} stages passed
              </span>
            </div>
          </div>

          {/* Path Metadata Specs */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-center sm:text-left">
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-slate-600">
              <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{activePath.modulesCount || 14} Modules</span>
            </div>
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-slate-600">
              <FlaskConical className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{activePath.labsCount || 22} Labs</span>
            </div>
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{activePath.estimatedHours || "18h left"}</span>
            </div>
          </div>

          {/* Stages Visual Step Indicator */}
          {activePath.stages && activePath.stages.length > 0 && (
            <div className="pt-1">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Curriculum Stages
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5">
                {activePath.stages.map((stage) => {
                  const isDone = stage.status === "completed"
                  const isCurrent = stage.status === "in-progress"

                  return (
                    <div
                      key={stage.id}
                      className={`
                        p-2 rounded-lg border text-left transition-all
                        ${
                          isDone
                            ? "bg-emerald-50/70 border-emerald-200/70 text-emerald-900"
                            : isCurrent
                            ? "bg-blue-50/90 border-blue-200 text-blue-900 shadow-2xs"
                            : "bg-white border-slate-200/70 text-slate-500"
                        }
                      `.trim()}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                        <span>STAGE {stage.id}</span>
                        {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />}
                        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" aria-hidden="true" />}
                      </div>
                      <p className="text-[11px] font-medium leading-tight line-clamp-2">
                        {stage.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              Certifies you for Junior & Mid-level SOC Analyst roles.
            </span>

            <Link to={activePath.ctaPath || "/learning-paths"} className="ml-auto">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {activePath.ctaLabel || "Continue Path"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default LearningPathCard

