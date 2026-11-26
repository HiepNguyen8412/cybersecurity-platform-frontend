import { useMemo } from "react"
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
import useThemeStore from "../../../stores/useThemeStore"
import { mockWeeklyActivity } from "../../../data/dashboardMockData"

function renderWeeklyTooltip({ active, payload, label, isDark }) {
  if (!active || !payload || !payload.length) return null
  const row = payload[0].payload
  return (
    <div
      className={`p-3 rounded-xl border text-xs font-mono-tech shadow-lg ${
        isDark
          ? "bg-[#121722] border-white/[0.14] text-[#F1F5F9]"
          : "bg-white border-[#E5E2DC] text-[#0F172A]"
      }`}
    >
      <p className="font-semibold mb-1">{label}</p>
      <p className={isDark ? "text-[#38BDF8]" : "text-[#1D4ED8]"}>
        Thời lượng: <span className="font-bold">{payload[0].value} giờ</span>
      </p>
      <p className="text-emerald-700 dark:text-emerald-400 mt-0.5">
        Phòng Lab hoàn thành: <span className="font-bold">{row.labs} bài</span>
      </p>
    </div>
  )
}

/**
 * ActivityHeatmapChart
 * Biểu đồ nhịp độ thực hành và nghiên cứu trong tuần.
 * Hiệu chỉnh màu sắc chuẩn xác cho Editorial Light và Deep Obsidian Dark.
 */
export function ActivityHeatmapChart({
  data = mockWeeklyActivity,
  streakDays = 7,
  weeklyGoalHours = 20,
  className = "",
}) {
  const theme = useThemeStore((state) => state.theme)
  const isDark = theme === "dark"

  const chartData = data && data.length > 0 ? data : mockWeeklyActivity

  const summary = useMemo(() => {
    const totalHours = chartData.reduce((sum, item) => sum + (Number(item.hours) || 0), 0)
    const totalLabs = chartData.reduce((sum, item) => sum + (Number(item.labs) || 0), 0)
    const goalPercent = weeklyGoalHours > 0 ? Math.round((totalHours / weeklyGoalHours) * 100) : 0
    return {
      totalHours: Number(totalHours.toFixed(1)),
      totalLabs,
      goalPercent,
    }
  }, [chartData, weeklyGoalHours])

  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#E5E2DC"
  const axisTickFill = isDark ? "#94A3B8" : "#475569"
  const yAxisTickFill = "#64748B"
  const strokeColor = isDark ? "#38BDF8" : "#1D4ED8"
  const gradientColor = isDark ? "#3B82F6" : "#1D4ED8"

  return (
    <div
      className={`p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-xs flex flex-col justify-between ${className}`.trim()}
    >
      {/* Tiêu đề khối biểu đồ */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08] shrink-0">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
              Nhịp độ nghiên cứu trong tuần
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech mt-0.5">
              Tổng {summary.totalHours} giờ thực hành và {summary.totalLabs} bài Lab hoàn thành
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50/90 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/25 font-mono-tech shrink-0">
          <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>Chuỗi {streakDays} ngày</span>
        </span>
      </div>

      {/* Biểu đồ miền Recharts */}
      <div className="w-full h-64 mt-1" aria-label="Biểu đồ thời lượng nghiên cứu theo ngày trong tuần">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="researchActivityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColor} stopOpacity={isDark ? 0.3 : 0.22} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: axisTickFill, fontSize: 11, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: yAxisTickFill, fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={(props) => renderWeeklyTooltip({ ...props, isDark })} />
            <Area
              type="monotone"
              dataKey="hours"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#researchActivityGradient)"
              activeDot={{ r: 4, fill: strokeColor, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chân trang tóm tắt mục tiêu tuần */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
        <span>
          Mục tiêu tuần: {weeklyGoalHours} giờ (Đạt {summary.goalPercent}%)
        </span>
        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
          {summary.goalPercent >= 100 ? "Vượt chỉ tiêu tuần" : "Đang duy trì nhịp độ"}
        </span>
      </div>
    </div>
  )
}

export default ActivityHeatmapChart
