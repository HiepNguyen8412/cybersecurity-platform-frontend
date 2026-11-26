import { ProgressBar, Badge, CountUp } from "../../../components/common"

function getLevelVariant(level) {
  const key = String(level || "").toLowerCase()
  if (key.includes("nâng cao") || key.includes("chuyên gia") || key === "advanced") {
    return "success"
  }
  if (key.includes("thành thạo") || key === "proficient") {
    return "info"
  }
  if (key.includes("trung cấp") || key === "intermediate") {
    return "primary"
  }
  return "secondary"
}

/**
 * SkillProgressItem
 * Thanh tiến độ hiển thị mức độ thành thạo một kỹ năng chuyên môn.
 */
export function SkillProgressItem({
  name,
  progress,
  level = "Trung cấp",
  variant = "primary",
  category = "",
  className = "",
}) {
  return (
    <div className={`space-y-1.5 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
            {name}
          </span>
          {level && (
            <Badge variant={getLevelVariant(level)} size="sm">
              {level}
            </Badge>
          )}
        </div>

        <span className="text-xs font-bold font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] tabular-nums shrink-0">
          <CountUp key={`skill-${name}-${progress}`} end={progress} suffix="%" duration={900} />
        </span>
      </div>

      <ProgressBar
        value={progress}
        max={100}
        variant={variant}
        size="sm"
        label={`Mức độ thành thạo ${name}: ${progress}%`}
        className="[&_[role=progressbar]]:bg-[#ECE9E2] dark:[&_[role=progressbar]]:bg-white/[0.08] [&>div:first-child]:sr-only"
      />

      {category && (
        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          Nhóm chuyên môn: {category}
        </p>
      )}
    </div>
  )
}

export default SkillProgressItem
