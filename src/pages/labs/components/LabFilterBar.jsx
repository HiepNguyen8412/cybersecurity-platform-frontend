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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              <span>{cat.label}</span>
              {cat.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? "bg-slate-950/20 text-slate-950" : "bg-slate-700 text-slate-300"
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
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff === "all" ? "Mọi độ khó" : diff}
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
            placeholder="Tìm lab, MITRE T-code..."
            className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  )
}

export default LabFilterBar
