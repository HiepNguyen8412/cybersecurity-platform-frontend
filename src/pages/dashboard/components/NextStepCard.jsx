import { Link } from "react-router-dom"
import { ArrowRight, Clock, Compass, PlayCircle, FileText, CheckCircle2 } from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../../components/common"

/**
 * NextStepCard Component
 * 
 * The primary focal section of the Dashboard.
 * Visually communicates: "This is what you should do next."
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function NextStepCard({
  nextStep = {},
  className = "",
}) {
  const {
    type = "Hands-on Lab",
    courseTitle = "Nền tảng An toàn Phòng thủ Web",
    lessonTitle = "SQL Injection: Filter Evasion & Parameterization",
    description = "Tìm hiểu cách tin tặc vượt qua các bộ lọc blacklist thô sơ và thực hành triển khai Prepared Statements chuẩn hóa trên môi trường code thực tế.",
    progress = 65,
    currentTopic = "Bài thực hành 4/6: Xây dựng truy vấn an toàn",
    estimatedTime = "Còn ~15 phút",
    primaryAction = { label: "Tiếp tục bài Lab", path: "/labs" },
    secondaryAction = { label: "Ghi chú bài giảng", path: "/learning" },
  } = nextStep

  return (
    <section aria-labelledby="next-step-heading" className={className}>
      <Card
        variant="focal"
        className="relative overflow-hidden shadow-md transition-all hover:shadow-lg border-l-4 border-l-blue-600 dark:border-l-blue-400 cyberpunk:border-l-cyan-400 border-blue-200/90 dark:border-slate-700 cyberpunk:border-cyan-500/50 bg-gradient-to-r from-white via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 cyberpunk:from-[#060e1d] cyberpunk:via-[#071329] cyberpunk:to-[#091a38] p-5 sm:p-6"
      >
        <div className="flex flex-col space-y-4">
          {/* Top Row: Mission Status + MITRE Tag + Remaining Time */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 dark:bg-blue-500 cyberpunk:bg-cyan-500 text-white cyberpunk:text-slate-950 text-[11px] font-bold uppercase tracking-wider font-mono-tech select-none shadow-2xs cyberpunk:shadow-sm">
                <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>MISSION DISPATCH</span>
              </span>

              <Badge variant="cyber" size="sm">
                {type}
              </Badge>

              <span className="hidden sm:inline-flex items-center text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 cyberpunk:bg-cyan-950/70 text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300 border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/50">
                MITRE: T1190
              </span>
            </div>

            {estimatedTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300">
                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                <span>{estimatedTime}</span>
              </span>
            )}
          </div>

          {/* Core Content: Context & Main Action Title */}
          <div className="space-y-1.5">
            {courseTitle && (
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/90 tracking-wide uppercase">
                {courseTitle}
              </p>
            )}

            <h2
              id="next-step-heading"
              className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400"
            >
              {lessonTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 cyberpunk:text-cyan-100 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Progress Container */}
          <div className="rounded-xl bg-slate-50/90 dark:bg-slate-800/80 cyberpunk:bg-[#071329] border border-slate-200/70 dark:border-slate-700 cyberpunk:border-cyan-500/40 p-3 sm:p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100 flex items-center gap-1.5">
                <PlayCircle className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400 shrink-0" aria-hidden="true" />
                <span>{currentTopic}</span>
              </span>
              <span className="text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 font-bold tabular-nums">
                <CountUp end={progress} suffix="% Hoàn tất" />
              </span>
            </div>

            <ProgressBar
              value={progress}
              max={100}
              variant="primary"
              size="sm"
              label={`Tiến độ bài học: ${progress}%`}
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300/80 pt-0.5">
              <span>Mục tiêu kế tiếp: Xác thực truy vấn tham số hóa</span>
              <span className="text-emerald-700 dark:text-emerald-400 cyberpunk:text-emerald-300 font-medium hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span>3 / 6 mục tiêu đã vượt qua</span>
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/80">
              Tiếp tục bài học ngay tại vị trí đã dừng. Không cần cấu hình lại.
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
                  {primaryAction.label}
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
