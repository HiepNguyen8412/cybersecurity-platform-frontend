import { Link } from "react-router-dom"
import { ArrowRight, Clock, Compass, PlayCircle, FileText, CheckCircle2 } from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../../components/common"

/**
 * NextStepCard
 * Khối trọng tâm điều hướng bước học tập hoặc phòng Lab tiếp theo.
 */
export function NextStepCard({ nextStep = {}, className = "" }) {
  const {
    type = "Phòng Lab Thực Hành",
    mitreCode = "MITRE ATT&CK · T1190",
    cweCode = "CWE-89",
    courseTitle = "Nền Tảng An Ninh Ứng Dụng Web",
    lessonTitle = "SQL Injection: Vượt Bộ Lọc & Tham Số Hóa Truy Vấn",
    description = "Phân tích cơ chế vượt qua bộ lọc từ khóa và thực hành triển khai Prepared Statements chuẩn hóa trên mã nguồn thực tế.",
    progress = 65,
    currentTopic = "Bài 4/6: Xây dựng truy vấn tham số hóa",
    nextObjectiveLabel = "Mục tiêu kế tiếp: Kiểm chứng truy vấn tham số hóa",
    completedObjectives = 3,
    totalObjectives = 6,
    estimatedTime = "Còn khoảng 15 phút",
    primaryAction = { label: "Tiếp tục thực hành Lab", path: "/labs" },
    secondaryAction = { label: "Xem ghi chú học phần", path: "/learning" },
  } = nextStep

  return (
    <section aria-labelledby="next-step-heading" className={className}>
      <Card
        variant="focal"
        padding="none"
        className="relative overflow-hidden border border-[#E5E2DC] dark:border-white/[0.09] border-l-[3px] border-l-[#1D4ED8] dark:border-l-[#3B82F6] bg-white dark:bg-[#121722] p-5 sm:p-6 shadow-sm"
      >
        <div className="flex flex-col space-y-4">
          {/* Hàng trên: Trạng thái đề xuất + Mã chuẩn kỹ thuật + Thời lượng */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1D4ED8] dark:bg-[#2563EB] text-white text-[11px] font-semibold uppercase tracking-wider font-mono-tech select-none">
                <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Bước tiếp theo đề xuất</span>
              </span>

              <Badge variant="primary" size="sm">
                {type}
              </Badge>

              {mitreCode && (
                <span className="hidden sm:inline-flex items-center text-[11px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                  {mitreCode}
                </span>
              )}

              {cweCode && (
                <span className="hidden md:inline-flex items-center text-[11px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                  {cweCode}
                </span>
              )}
            </div>

            {estimatedTime && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                <Clock className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" aria-hidden="true" />
                <span>{estimatedTime}</span>
              </span>
            )}
          </div>

          {/* Nội dung chính */}
          <div className="space-y-1.5">
            {courseTitle && (
              <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8] tracking-wide uppercase font-mono-tech">
                {courseTitle}
              </p>
            )}

            <h2
              id="next-step-heading"
              className="font-serif-editorial text-xl sm:text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-snug"
            >
              {lessonTitle}
            </h2>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Khối tiến độ nội tuyến */}
          <div className="rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.07] p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs font-medium">
              <span className="text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-1.5 min-w-0">
                <PlayCircle className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" aria-hidden="true" />
                <span className="truncate">{currentTopic}</span>
              </span>
              <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold font-mono-tech tabular-nums shrink-0">
                <CountUp key={`next-step-${progress}`} end={progress} suffix="% hoàn tất" duration={900} />
              </span>
            </div>

            <ProgressBar
              value={progress}
              max={100}
              variant="primary"
              size="sm"
              label={`Tiến độ bài học: ${progress}%`}
              className="[&_[role=progressbar]]:bg-[#ECE9E2] dark:[&_[role=progressbar]]:bg-white/[0.08] [&>div:first-child]:sr-only"
            />

            <div className="flex items-center justify-between gap-2 text-[11px] text-[#64748B] dark:text-[#94A3B8] pt-0.5 flex-wrap">
              <span>{nextObjectiveLabel}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1 font-mono-tech">
                <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>
                  {completedObjectives} / {totalObjectives} mục tiêu hoàn thành
                </span>
              </span>
            </div>
          </div>

          {/* Chân trang & Nút hành động */}
          <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Tiếp tục trực tiếp tại vị trí đã lưu gần nhất mà không cần khởi tạo lại môi trường.
            </p>

            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
              {secondaryAction?.label && (
                <Link to={secondaryAction.path || "/learning"}>
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<FileText className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8]" />}
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
                  {primaryAction?.label || "Tiếp tục thực hành"}
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
