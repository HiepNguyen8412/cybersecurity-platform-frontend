import { Link } from "react-router-dom"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { Card } from "../../../components/common"
import SkillProgressItem from "./SkillProgressItem"

/**
 * SkillOverview Component
 * 
 * Compact, accessible skill overview card.
 * Displays 4 domains:
 * - Network Security — 68%
 * - Web Security — 45%
 * - Linux Basics — 82%
 * - Cryptography — 30%
 */
export function SkillOverview({ skills = [], className = "" }) {
  return (
    <Card variant="default" className={`border-slate-200/90 shadow-2xs ${className}`.trim()}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
                Skill Progress
              </h2>
              <p className="text-[11px] text-slate-500">
                Mastery levels across core defense disciplines
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5 transition-colors"
          >
            <span>View all</span>
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
        <div className="pt-1 text-[11px] text-slate-400 text-center sm:text-left">
          Skills automatically recalculate after each completed quiz and lab sandbox.
        </div>
      </div>
    </Card>
  )
}

export default SkillOverview
