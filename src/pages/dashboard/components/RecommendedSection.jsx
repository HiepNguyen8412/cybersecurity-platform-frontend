import { useState } from "react"
import { Link } from "react-router-dom"
import { Compass, ChevronRight } from "lucide-react"
import RecommendedCard from "./RecommendedCard"

/**
 * RecommendedSection Component
 * 
 * Container for recommended defense courses, labs, and sandboxes.
 * Distinct theme support with high-contrast text and crisp filter pills.
 */
export function RecommendedSection({
  items = [],
  className = "",
}) {
  const [filter, setFilter] = useState("all")

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    if (filter === "courses") return item.type.toLowerCase() === "course"
    if (filter === "labs") return item.type.toLowerCase() === "lab"
    return true
  })

  return (
    <section aria-labelledby="recommended-heading" className={`space-y-3.5 ${className}`.trim()}>
      {/* Header with Title & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/60 cyberpunk:bg-cyan-950/60 cyberpunk:text-cyan-300 cyberpunk:border-cyan-500/50">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="recommended-heading"
              className="text-base font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-100 tracking-tight leading-tight"
            >
              Nội Dung Huấn Luyện Đề Xuất // TACTICAL LABS
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80">
              Khóa học thực chiến và phòng thí nghiệm giả lập tình huống phòng thủ
            </p>
          </div>
        </div>

        {/* Filter Pills + Link to catalog */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 cyberpunk:bg-cyan-950/40 cyberpunk:border-cyan-500/40 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`
                px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer
                ${
                  filter === "all"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-700 dark:text-white cyberpunk:bg-cyan-500/20 cyberpunk:text-cyan-200 cyberpunk:border cyberpunk:border-cyan-400/60"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cyberpunk:text-cyan-300/70 cyberpunk:hover:text-cyan-100"
                }
              `}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilter("courses")}
              className={`
                px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer
                ${
                  filter === "courses"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-700 dark:text-white cyberpunk:bg-cyan-500/20 cyberpunk:text-cyan-200 cyberpunk:border cyberpunk:border-cyan-400/60"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cyberpunk:text-cyan-300/70 cyberpunk:hover:text-cyan-100"
                }
              `}
            >
              Khóa học
            </button>
            <button
              type="button"
              onClick={() => setFilter("labs")}
              className={`
                px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer
                ${
                  filter === "labs"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold dark:bg-slate-700 dark:text-white cyberpunk:bg-cyan-500/20 cyberpunk:text-cyan-200 cyberpunk:border cyberpunk:border-cyan-400/60"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cyberpunk:text-cyan-300/70 cyberpunk:hover:text-cyan-100"
                }
              `}
            >
              Phòng Lab
            </button>
          </div>

          <Link
            to="/learning"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 cyberpunk:text-cyan-300 cyberpunk:hover:text-cyan-200 hidden sm:inline-flex items-center gap-0.5 ml-2 transition-colors"
          >
            <span>Toàn bộ thư viện</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Grid of Recommended Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredItems.map((item) => (
          <RecommendedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default RecommendedSection
