import { ProgressBar, Badge, CountUp } from "../../../components/common"

const levelBadgeVariants = {
  Novice: "secondary",
  Intermediate: "primary",
  Proficient: "info",
  Advanced: "success",
}

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
          <span className="text-xs font-semibold text-slate-800 dark:text-white cyberpunk:text-cyan-50 truncate">
            {name}
          </span>
          {level && (
            <Badge variant={levelBadgeVariants[level] || "secondary"} size="sm">
              {level}
            </Badge>
          )}
        </div>

        <span className="text-xs font-extrabold font-mono-tech text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 tabular-nums shrink-0">
          <CountUp end={progress} suffix="%" duration={2000} />
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
        <p className="text-[10px] text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/80 font-medium">
          Lĩnh vực: {category}
        </p>
      )}
    </div>
  )
}

export default SkillProgressItem
