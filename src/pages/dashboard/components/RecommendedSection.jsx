import { useState } from "react"
import { Link } from "react-router-dom"
import { Sparkles, ChevronRight } from "lucide-react"
import RecommendedCard from "./RecommendedCard"

/**
 * RecommendedSection Component
 * 
 * Container for recommended courses, labs, and lessons.
 * Includes interactive type filter (All / Courses / Labs).
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
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="recommended-heading"
              className="text-base font-bold text-slate-900 tracking-tight leading-tight"
            >
              Recommended Content
            </h2>
            <p className="text-[11px] text-slate-500">
              Curated hands-on courses and defense sandboxes
            </p>
          </div>
        </div>

        {/* Filter Pills + Link to catalog */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`
                px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer
                ${filter === "all" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}
              `}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("courses")}
              className={`
                px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer
                ${filter === "courses" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}
              `}
            >
              Courses
            </button>
            <button
              type="button"
              onClick={() => setFilter("labs")}
              className={`
                px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer
                ${filter === "labs" ? "bg-white text-slate-900 shadow-2xs font-semibold" : "text-slate-600 hover:text-slate-900"}
              `}
            >
              Labs
            </button>
          </div>

          <Link
            to="/learning"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hidden sm:inline-flex items-center gap-0.5 ml-2 transition-colors"
          >
            <span>All content</span>
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

