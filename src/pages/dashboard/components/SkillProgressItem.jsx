import { ProgressBar, Badge, CountUp } from "../../../components/common"

// Level badge styles
const levelBadgeVariants = {
  Novice: "secondary",
  Intermediate: "primary",
  Proficient: "info",
  Advanced: "success",
}

/**
 * SkillProgressItem Component
 * 
 * Accessible, clean progress bar item for an individual cybersecurity skill domain.
 */
export function SkillProgressItem({
  name,
  progress,
  level = "Intermediate",
  variant = "primary",
  category = "",
  className = "",
}) {
  return (
    <div className={`space-y-1.5 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-slate-800 truncate">
            {name}
          </span>
          {level && (
            <Badge variant={levelBadgeVariants[level] || "secondary"} size="sm">
              {level}
            </Badge>
          )}
        </div>

        <span className="text-xs font-extrabold font-mono-tech text-blue-600 tabular-nums shrink-0">
          <CountUp end={progress} suffix="%" />
        </span>
      </div>

      <ProgressBar
        value={progress}
        max={100}
        variant={variant}
        size="sm"
        label={`${name} proficiency: ${progress}%`}
      />

      {category && (
        <p className="text-[10px] text-slate-400 font-medium">
          Domain: {category}
        </p>
      )}
    </div>
  )
}

export default SkillProgressItem
