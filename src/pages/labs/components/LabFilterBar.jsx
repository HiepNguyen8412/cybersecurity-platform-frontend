import { Search, X } from "lucide-react"

const DIFFICULTY_LABELS = {
  all: "Mọi cấp độ",
  Novice: "Cơ bản",
  Intermediate: "Trung cấp",
  Advanced: "Nâng cao",
}

export function LabFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  categories,
  difficulties,
}) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] shadow-xs">
      {/* Category Filter Pills — single clean horizontal row */}
      <div
        role="group"
        aria-label="Lọc theo chuyên mục thí nghiệm"
        className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                isActive
                  ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6] font-semibold"
                  : "bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border-[#E5E2DC] dark:border-white/[0.08]"
              }`}
            >
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono-tech tabular-nums leading-none ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white dark:bg-[#0B0E14] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.06]"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right Controls: Difficulty Select & Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
        <div className="shrink-0">
          <label htmlFor="lab-difficulty-select" className="sr-only">
            Lọc theo cấp độ khó
          </label>
          <select
            id="lab-difficulty-select"
            name="labDifficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.09] text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {DIFFICULTY_LABELS[diff] || diff}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 sm:w-56 md:w-64">
          <label htmlFor="lab-search-input" className="sr-only">
            Tìm kiếm bài thí nghiệm
          </label>
          <Search
            className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="lab-search-input"
            name="labSearch"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài lab, mã MITRE, CWE..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.09] text-xs text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Xóa từ khóa tìm kiếm"
              title="Xóa từ khóa tìm kiếm"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LabFilterBar
