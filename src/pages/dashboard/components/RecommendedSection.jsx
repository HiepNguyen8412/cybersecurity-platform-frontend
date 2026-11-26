import { useState } from "react"
import { Link } from "react-router-dom"
import { Compass, ChevronRight } from "lucide-react"
import RecommendedCard from "./RecommendedCard"

function isCourseItem(item) {
  if (item?.typeKey === "course") return true
  const raw = String(item?.type || "").toLowerCase()
  return raw.includes("khóa học") || raw.includes("học phần") || raw === "course"
}

function isLabItem(item) {
  if (item?.typeKey === "lab") return true
  const raw = String(item?.type || "").toLowerCase()
  return raw.includes("lab") || raw.includes("thực hành")
}

/**
 * RecommendedSection
 * Danh sách học phần và phòng thí nghiệm đề xuất kèm bộ lọc phân loại.
 */
export function RecommendedSection({ items = [], className = "" }) {
  const [filter, setFilter] = useState("all")

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    if (filter === "courses") return isCourseItem(item)
    if (filter === "labs") return isLabItem(item)
    return true
  })

  return (
    <section aria-labelledby="recommended-heading" className={`space-y-3.5 ${className}`.trim()}>
      {/* Tiêu đề & Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
            <Compass className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="recommended-heading"
              className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight"
            >
              Học phần &amp; phòng thí nghiệm đề xuất
            </h2>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              Nội dung chuyên môn và bài thực nghiệm phù hợp với năng lực hiện tại
            </p>
          </div>
        </div>

        {/* Nhóm nút lọc phân loại + Link thư viện */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div
            role="group"
            aria-label="Lọc nội dung đề xuất"
            className="inline-flex p-0.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs"
          >
            {[
              { id: "all", label: "Tất cả" },
              { id: "courses", label: "Khóa học" },
              { id: "labs", label: "Phòng Lab" },
            ].map((tab) => {
              const active = filter === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={active}
                  className={`
                    px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap
                    ${
                      active
                        ? "bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs font-semibold"
                        : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                    }
                  `.trim()}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <Link
            to="/learning"
            className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline hidden sm:inline-flex items-center gap-0.5 ml-1 transition-colors"
          >
            <span>Toàn bộ thư viện</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Lưới thẻ nội dung đề xuất */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => (
            <RecommendedCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] p-6 text-center space-y-2">
          <p className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
            Chưa có nội dung phù hợp trong bộ lọc hiện tại.
          </p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
          >
            Hiển thị lại tất cả đề xuất
          </button>
        </div>
      )}
    </section>
  )
}

export default RecommendedSection
