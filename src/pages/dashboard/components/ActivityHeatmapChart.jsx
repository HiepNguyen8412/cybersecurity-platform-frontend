import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Activity, Flame } from "lucide-react"

const WEEKLY_DATA = [
  { day: "Thứ 2", hours: 2.5, labs: 1 },
  { day: "Thứ 3", hours: 3.8, labs: 2 },
  { day: "Thứ 4", hours: 1.2, labs: 0 },
  { day: "Thứ 5", hours: 4.5, labs: 3 },
  { day: "Thứ 6", hours: 3.0, labs: 1 },
  { day: "Thứ 7", hours: 5.5, labs: 4 },
  { day: "CN", hours: 4.2, labs: 2 },
]

export function ActivityHeatmapChart({ data = WEEKLY_DATA }) {
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 dark:bg-black cyberpunk:bg-[#02050f] border border-emerald-500/50 p-2.5 rounded-xl shadow-xl text-xs font-mono text-white">
          <p className="font-bold text-white mb-1">{label}</p>
          <p className="text-cyan-400">
            Thời lượng: <span className="font-bold">{payload[0].value} giờ</span>
          </p>
          <p className="text-emerald-400">
            Labs giải quyết: <span className="font-bold">{payload[0].payload.labs} bài</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-5 rounded-2xl cyber-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-wide">
              Hoạt Động Huấn Luyện Tuần
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80 font-mono">
              Tổng 24.7 giờ thực hành & 13 bài Lab đã hoàn thành
            </p>
          </div>
        </div>

        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-mono">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>7 Days Streak!</span>
        </span>
      </div>

      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cyberArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" vertical={false} opacity={0.3} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={customTooltip} />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cyberArea)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/30 text-[11px] font-mono text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80">
        <span>Mục tiêu tuần: 20 giờ (Đạt 123%)</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">+18% so với tuần trước</span>
      </div>
    </div>
  )
}

export default ActivityHeatmapChart
