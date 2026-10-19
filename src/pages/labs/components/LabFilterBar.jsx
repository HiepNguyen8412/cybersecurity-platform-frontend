import { Search } from "lucide-react"

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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/40 bg-white dark:bg-slate-900/80 cyberpunk:bg-[#071022] shadow-sm backdrop-blur-md">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-2xs font-bold"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 cyberpunk:bg-[#0d1e3d] cyberpunk:hover:bg-[#122850] text-slate-700 dark:text-slate-300 cyberpunk:text-cyan-300/80 border border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/30"
              }`}
            >
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? "bg-white/20 dark:bg-slate-950/20 text-white dark:text-slate-950"
                      : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Right Controls: Search & Difficulty */}
      <div className="flex items-center space-x-3">
        {/* Difficulty Select */}
        <div className="relative">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 cyberpunk:bg-[#030712] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 text-xs text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 cursor-pointer shadow-2xs"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff === "all" ? "Mọi cấp độ" : diff}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:w-60">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài lab, mã MITRE..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 cyberpunk:bg-[#030712] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 text-xs text-slate-900 dark:text-white cyberpunk:text-cyan-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 shadow-2xs"
          />
        </div>
      </div>
    </div>
  )
}

export default LabFilterBar
