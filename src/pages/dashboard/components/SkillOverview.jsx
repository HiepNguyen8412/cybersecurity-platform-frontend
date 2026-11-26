import { Link } from "react-router-dom"
import { Layers, ArrowRight } from "lucide-react"
import { Card } from "../../../components/common"
import SkillProgressItem from "./SkillProgressItem"

/**
 * SkillOverview
 * Tổng hợp tiến độ năng lực chuyên môn theo từng lĩnh vực an ninh mạng.
 */
export function SkillOverview({ skills = [], className = "" }) {
  return (
    <Card
      variant="default"
      className={`bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] ${className}`.trim()}
    >
      <div className="space-y-4">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#EFEDE7] dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
              <Layers className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
                Hồ sơ năng lực cốt lõi
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Mức độ thành thạo qua các chuyên đề phòng thủ an ninh mạng
              </p>
            </div>
          </div>

          <Link
            to="/progress"
            className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-0.5 transition-colors shrink-0"
          >
            <span>Chi tiết</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        {/* Danh sách kỹ năng */}
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

        {/* Chú thích phương pháp đo */}
        <div className="pt-2 border-t border-[#EFEDE7] dark:border-white/[0.06] text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          Tổng hợp từ kết quả hoàn thành học phần, bài kiểm tra kiến thức và phòng Lab thực nghiệm.
        </div>
      </div>
    </Card>
  )
}

export default SkillOverview
