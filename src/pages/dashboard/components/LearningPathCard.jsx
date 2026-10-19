import { useState } from "react"
import { Link } from "react-router-dom"
import { Compass, ArrowRight, Layers, FlaskConical, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../../components/common"

/**
 * LearningPathCard Component
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function LearningPathCard({
  paths = [],
  className = "",
}) {
  const defaultPath = paths.find((p) => p.isCurrent) || paths[0] || {}
  const [selectedPathId, setSelectedPathId] = useState(defaultPath.id)

  const activePath = paths.find((p) => p.id === selectedPathId) || defaultPath

  return (
    <Card variant="default" className={`overflow-hidden border-slate-200/90 dark:border-slate-800 cyberpunk:border-cyan-500/50 shadow-2xs ${className}`.trim()}>
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/30">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 cyberpunk:bg-cyan-950/80 text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 border border-blue-100 dark:border-blue-800/60 cyberpunk:border-cyan-500/50">
              <Compass className="h-4.5 w-4.5 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight leading-tight">
                Lộ trình Chuyên môn Hiện tại
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80">
                Khung đào tạo chuẩn hóa cho các vị trí tác chiến an ninh
              </p>
            </div>
          </div>

          <Link
            to="/learning-paths"
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Duyệt tất cả lộ trình</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Path Switching Pills */}
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
                        ? "bg-slate-900 dark:bg-slate-100 cyberpunk:bg-cyan-500 text-white dark:text-slate-900 cyberpunk:text-slate-950 font-bold shadow-xs cyberpunk:shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 cyberpunk:bg-[#071329] text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200 border border-slate-200/70 dark:border-slate-700 cyberpunk:border-cyan-500/40 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }
                  `.trim()}
                >
                  <span className="flex items-center gap-1.5">
                    {p.title}
                    {isEnrolled && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected ? "bg-blue-400 dark:bg-blue-600 cyberpunk:bg-slate-950" : "bg-blue-600 dark:bg-cyan-400"
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
        <div className="rounded-xl border border-blue-100/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/50 dark:from-slate-800/80 dark:via-slate-800/80 dark:to-slate-900 cyberpunk:from-[#060e1d] cyberpunk:via-[#071329] cyberpunk:to-[#091a38] p-4 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight">
                  {activePath.title}
                </h3>
                {activePath.isCurrent ? (
                  <Badge variant="primary" size="sm" dot>
                    Đang theo học
                  </Badge>
                ) : (
                  <Badge variant="outline" size="sm">
                    Lộ trình gợi ý
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-200 cyberpunk:text-cyan-100 leading-relaxed max-w-2xl">
                {activePath.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 tabular-nums">
                <CountUp end={activePath.progress || 0} suffix="%" />
              </span>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/80 font-medium">Hoàn tất lộ trình</p>
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

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200 font-medium">
              <span className="font-semibold text-slate-700 dark:text-white cyberpunk:text-cyan-100">
                {activePath.currentStage}
              </span>
              <span>
                {activePath.completedStages || 0} / {activePath.totalStages || 5} giai đoạn hoàn tất
              </span>
            </div>
          </div>

          {/* Path Metadata Specs */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 cyberpunk:border-cyan-500/30 text-center sm:text-left">
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200">
              <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{activePath.modulesCount || 14} Modules</span>
            </div>
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200">
              <FlaskConical className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{activePath.labsCount || 22} Bài Lab</span>
            </div>
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <span>{activePath.estimatedHours || "Còn ~18h"}</span>
            </div>
          </div>

          {/* Stages Visual Step Indicator */}
          {activePath.stages && activePath.stages.length > 0 && (
            <div className="pt-1">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400 uppercase tracking-wider mb-2">
                Các giai đoạn đào tạo
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
                            ? "bg-emerald-50/70 dark:bg-emerald-950/40 cyberpunk:bg-emerald-950/60 border-emerald-200/70 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 cyberpunk:text-emerald-300"
                            : isCurrent
                            ? "bg-blue-50/90 dark:bg-blue-950/60 cyberpunk:bg-cyan-950/80 border-blue-200 dark:border-blue-700 cyberpunk:border-cyan-500/70 text-blue-900 dark:text-blue-100 cyberpunk:text-cyan-100 shadow-2xs cyberpunk:shadow-sm"
                            : "bg-white dark:bg-slate-900 cyberpunk:bg-[#060e1d] border-slate-200/70 dark:border-slate-800 cyberpunk:border-cyan-500/30 text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80"
                        }
                      `.trim()}
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
                        <span>STAGE {stage.id}</span>
                        {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />}
                        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />}
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
            <span className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/90 hidden sm:inline-block">
              Định hướng đạt chuẩn vị trí Junior & Mid-level SOC Analyst.
            </span>

            <Link to={activePath.ctaPath || "/learning-paths"} className="ml-auto">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                {activePath.ctaLabel || "Tiếp tục lộ trình"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default LearningPathCard
