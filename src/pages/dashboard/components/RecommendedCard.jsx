import { Link } from "react-router-dom"
import { BookOpen, FlaskConical, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Badge, Button } from "../../../components/common"

function resolveDifficultyMeta(rawDifficulty, rawDifficultyKey) {
  const key = String(rawDifficultyKey || rawDifficulty || "").toLowerCase()
  if (key.includes("cơ bản") || key === "beginner" || key === "easy" || key === "novice") {
    return { variant: "success", label: "Cơ bản" }
  }
  if (
    key.includes("nâng cao") ||
    key.includes("chuyên gia") ||
    key === "advanced" ||
    key === "hard" ||
    key === "specialist"
  ) {
    return { variant: "purple", label: key.includes("chuyên gia") ? "Chuyên gia" : "Nâng cao" }
  }
  return { variant: "primary", label: "Trung cấp" }
}

/**
 * RecommendedCard
 * Thẻ hiển thị từng học phần hoặc phòng thí nghiệm được đề xuất.
 */
export function RecommendedCard({ item, className = "" }) {
  const {
    title,
    description,
    type = "Khóa học",
    typeKey,
    difficulty = "Cơ bản",
    difficultyKey,
    duration = "45 phút",
    progress = 0,
    status = "Chưa bắt đầu",
    ctaLabel = "Bắt đầu",
    path = "/learning",
  } = item

  const isLab =
    typeKey === "lab" ||
    String(type).toLowerCase().includes("lab") ||
    String(type).toLowerCase().includes("thực hành")
  const isStarted = Number(progress) > 0
  const normalizedStatus = String(status).toLowerCase()
  const isCompleted =
    normalizedStatus.includes("hoàn thành") ||
    normalizedStatus.includes("hoàn tất") ||
    normalizedStatus === "completed" ||
    Number(progress) >= 100

  const difficultyMeta = resolveDifficultyMeta(difficulty, difficultyKey)

  return (
    <div
      className={`
        group relative flex flex-col justify-between p-4.5 rounded-xl bg-white dark:bg-[#121722]
        border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8]/45 dark:hover:border-[#3B82F6]/45
        shadow-2xs transition-colors ${className}
      `.trim()}
    >
      <div className="space-y-2.5">
        {/* Hàng nhãn phân loại & độ khó */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`
                flex h-6 w-6 shrink-0 items-center justify-center rounded-md border
                ${
                  isLab
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/12 dark:text-emerald-400 dark:border-emerald-500/25"
                    : "bg-blue-50 text-[#1D4ED8] border-blue-200/80 dark:bg-blue-500/12 dark:text-[#38BDF8] dark:border-blue-500/25"
                }
              `}
              aria-hidden="true"
            >
              {isLab ? <FlaskConical className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] font-mono-tech">
              {type}
            </span>
          </div>

          <Badge variant={difficultyMeta.variant} size="sm">
            {difficultyMeta.label}
          </Badge>
        </div>

        {/* Tiêu đề & Mô tả */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Chân thẻ: Thời lượng & Điều hướng */}
      <div className="mt-3.5 pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] font-mono-tech min-w-0">
          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">{duration}</span>
          {isStarted && !isCompleted && (
            <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold ml-1 shrink-0">
              • {progress}%
            </span>
          )}
          {isCompleted && (
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold ml-1 inline-flex items-center gap-0.5 shrink-0">
              <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Hoàn thành
            </span>
          )}
        </div>

        <Link to={path} className="shrink-0">
          <Button
            variant={isStarted ? "primary" : "outline"}
            size="sm"
            rightIcon={<ArrowRight className="h-3 w-3" />}
          >
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default RecommendedCard
