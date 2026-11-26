import { useState } from "react"
import { Link } from "react-router-dom"
import { Compass, ArrowRight, Layers, FlaskConical, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../../components/common"

/**
 * LearningPathCard
 * Trình bày lộ trình đào tạo chuyên môn theo từng chặng và tiến độ hiện tại.
 */
export function LearningPathCard({ paths = [], className = "" }) {
  const defaultPath = paths.find((p) => p.isCurrent) || paths[0] || {}
  const [selectedPathId, setSelectedPathId] = useState(defaultPath.id)

  const activePath = paths.find((p) => p.id === selectedPathId) || defaultPath

  return (
    <Card
      variant="default"
      className={`overflow-hidden bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] ${className}`.trim()}
    >
      <div className="space-y-4">
        {/* Tiêu đề khối */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#EFEDE7] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#38BDF8] border border-blue-200/80 dark:border-blue-500/25">
              <Compass className="h-4 w-4 stroke-[1.9]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
                Lộ trình chuyên môn hiện tại
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Khung đào tạo chuẩn hóa theo vị trí công việc NIST NICE
              </p>
            </div>
          </div>

          <Link
            to="/learning-paths"
            className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Xem toàn bộ lộ trình</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Bộ chuyển đổi giữa các lộ trình */}
        {paths.length > 1 && (
          <div
            role="tablist"
            aria-label="Danh sách lộ trình đào tạo"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          >
            {paths.map((p) => {
              const isSelected = p.id === activePath.id
              const isEnrolled = Boolean(p.isCurrent)

              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedPathId(p.id)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer select-none border
                    ${
                      isSelected
                        ? "bg-[#0F172A] dark:bg-[#F1F5F9] text-white dark:text-[#0B0E14] border-[#0F172A] dark:border-[#F1F5F9] font-semibold"
                        : "bg-[#FAF9F6] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                    }
                  `.trim()}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{p.title}</span>
                    {isEnrolled && (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isSelected
                            ? "bg-emerald-400 dark:bg-emerald-600"
                            : "bg-[#1D4ED8] dark:bg-[#38BDF8]"
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

        {/* Nội dung lộ trình đang chọn */}
        <div className="rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#161C2A] p-4 space-y-3.5">
          {/* Tên lộ trình & % hoàn thành */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
                  {activePath.title}
                </h3>
                {activePath.isCurrent ? (
                  <Badge variant="primary" size="sm" dot>
                    Đang theo học
                  </Badge>
                ) : (
                  <Badge variant="outline" size="sm">
                    Lộ trình đề xuất
                  </Badge>
                )}
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl">
                {activePath.description}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl sm:text-2xl font-bold font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] tabular-nums">
                <CountUp key={`path-${activePath.id}-${activePath.progress || 0}`} end={activePath.progress || 0} suffix="%" duration={900} />
              </span>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">
                Hoàn tất
              </p>
            </div>
          </div>

          {/* Thanh tiến độ tổng */}
          <div className="space-y-1.5">
            <ProgressBar
              value={activePath.progress || 0}
              max={100}
              variant="primary"
              size="md"
              label={`Tiến độ lộ trình ${activePath.title || ""}`}
              className="[&_[role=progressbar]]:bg-[#ECE9E2] dark:[&_[role=progressbar]]:bg-white/[0.08] [&>div:first-child]:sr-only"
            />

            <div className="flex items-center justify-between gap-2 text-xs text-[#64748B] dark:text-[#94A3B8] font-medium flex-wrap">
              <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                {activePath.currentStage}
              </span>
              <span className="font-mono-tech text-[11px]">
                {activePath.completedStages || 0} / {activePath.totalStages || activePath.stages?.length || 4} chặng hoàn tất
              </span>
            </div>
          </div>

          {/* Thông số cấu trúc lộ trình */}
          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#E5E2DC] dark:border-white/[0.06] text-center sm:text-left font-mono-tech">
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-[#475569] dark:text-[#94A3B8]">
              <Layers className="h-3.5 w-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
              <span>{activePath.modulesCount || 12} học phần</span>
            </div>
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-[#475569] dark:text-[#94A3B8]">
              <FlaskConical className="h-3.5 w-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
              <span>{activePath.labsCount || 20} phòng Lab</span>
            </div>
            <div className="flex items-center sm:justify-start justify-center gap-1.5 text-xs text-[#475569] dark:text-[#94A3B8]">
              <Clock className="h-3.5 w-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
              <span>{activePath.estimatedHours || "18 giờ"}</span>
            </div>
          </div>

          {/* Danh sách chặng đào tạo */}
          {activePath.stages && activePath.stages.length > 0 && (
            <div className="pt-1">
              <p className="text-[11px] font-semibold font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
                Các chặng trong lộ trình
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {activePath.stages.map((stage) => {
                  const isDone = stage.status === "completed"
                  const isCurrent = stage.status === "in-progress"

                  return (
                    <div
                      key={stage.id}
                      className={`
                        p-2.5 rounded-lg border text-left transition-colors
                        ${
                          isDone
                            ? "bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/25 text-emerald-900 dark:text-emerald-200"
                            : isCurrent
                              ? "bg-blue-50/90 dark:bg-blue-500/12 border-blue-200 dark:border-blue-500/30 text-[#0F172A] dark:text-[#F1F5F9]"
                              : "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.06] text-[#64748B] dark:text-[#94A3B8]"
                        }
                      `.trim()}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono-tech font-semibold mb-1">
                        <span>CHẶNG {stage.id}</span>
                        {isDone && (
                          <CheckCircle2
                            className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
                            aria-hidden="true"
                          />
                        )}
                        {isCurrent && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#38BDF8]"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="text-[11px] font-medium leading-snug line-clamp-2">
                        {stage.name}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Nút điều hướng */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] hidden sm:inline-block">
              Định hướng đạt chuẩn năng lực Chuyên viên Phân tích An ninh mạng.
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
