import { Link } from "react-router-dom"
import { UserCheck, ArrowRight } from "lucide-react"
import { Card } from "../../../components/common"
import SkillProgressItem from "./SkillProgressItem"

/**
 * SkillOverview Component
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function SkillOverview({ skills = [], className = "" }) {
  return (
    <Card variant="default" className={`border-slate-200/90 dark:border-slate-800 cyberpunk:border-cyan-500/50 shadow-2xs ${className}`.trim()}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/30">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/70 cyberpunk:bg-cyan-950/80 text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 border border-blue-100 dark:border-blue-800/60 cyberpunk:border-cyan-500/50">
              <UserCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight leading-tight">
                Tiến độ Năng lực Tác chiến
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80">
                Mức độ thành thạo qua các chuyên đề phòng thủ an ninh mạng
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {/* Skills List */}
        <div className="space-y-3.5">
          {skills.map((skill) => (
            <SkillProgressItem
              key={skill.id || skill.name}
              name={skill.name}
              progress={skill.progress}
              level={skill.level}
              variant={skill.variant}
              category={skill.category}
            />
          ))}
        </div>

        {/* Footnote */}
        <div className="pt-1 text-[11px] text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/80 text-center sm:text-left">
          Được đo kiểm dựa trên tỉ lệ giải quyết thành công các bài Lab thực chiến.
        </div>
      </div>
    </Card>
  )
}

export default SkillOverview
