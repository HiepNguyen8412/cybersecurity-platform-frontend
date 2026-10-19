import { Link } from "react-router-dom"
import { BookOpen, FlaskConical, Clock, ArrowRight, CheckCircle2 } from "lucide-react"
import { Badge, Button } from "../../../components/common"

// Difficulty badge variants
const difficultyVariants = {
  Beginner: "success",
  Intermediate: "primary",
  Advanced: "purple",
}

/**
 * RecommendedCard Component
 * 
 * High-contrast card with crisp text for all 3 themes.
 */
export function RecommendedCard({ item, className = "" }) {
  const {
    title,
    description,
    type = "Course",
    difficulty = "Beginner",
    duration = "45 mins",
    progress = 0,
    status = "Not Started",
    ctaLabel = "Bắt đầu",
    path = "/learning",
  } = item

  const isLab = type.toLowerCase() === "lab"
  const isStarted = progress > 0
  const isCompleted = status.toLowerCase() === "completed"

  return (
    <div
      className={`
        group relative flex flex-col justify-between p-4.5 rounded-2xl cyber-card
        ${className}
      `.trim()}
    >
      <div className="space-y-2.5">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`
                flex h-6 w-6 shrink-0 items-center justify-center rounded-md
                ${
                  isLab
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 cyberpunk:bg-emerald-950/60 cyberpunk:text-emerald-300"
                    : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300"
                }
              `}
              aria-hidden="true"
            >
              {isLab ? <FlaskConical className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
            </span>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80 font-mono-tech">
              {type}
            </span>
          </div>

          <Badge variant={difficultyVariants[difficulty] || "primary"} size="sm">
            {difficulty}
          </Badge>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-snug group-hover:text-blue-600 dark:group-hover:text-cyan-400 cyberpunk:group-hover:text-cyan-300 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-slate-300 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Metadata & CTA */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 cyberpunk:border-cyan-500/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80 font-mono-tech">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>{duration}</span>
          {isStarted && (
            <span className="text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 font-semibold ml-1">
              • {progress}%
            </span>
          )}
          {isCompleted && (
            <span className="text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 font-semibold ml-1 flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> Hoàn thành
            </span>
          )}
        </div>

        <Link to={path}>
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
