import { useMemo } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Shield, Award } from "lucide-react"
import { CountUp } from "../../../components/common"
import useThemeStore from "../../../stores/useThemeStore"
import { mockMitreRadarData } from "../../../data/dashboardMockData"

function renderMitreTooltip({ active, payload, isDark }) {
  if (!active || !payload || !payload.length) return null
  const item = payload[0].payload
  return (
    <div
      className={`p-3 rounded-xl border text-xs font-mono-tech shadow-lg ${
        isDark
          ? "bg-[#121722] border-white/[0.14] text-[#F1F5F9]"
          : "bg-white border-[#E5E2DC] text-[#0F172A]"
      }`}
    >
      <p className={`font-semibold ${isDark ? "text-[#38BDF8]" : "text-[#1D4ED8]"}`}>
        {item.fullLabel || item.domain}
      </p>
      <p className={`mt-1 ${isDark ? "text-[#94A3B8]" : "text-[#475569]"}`}>
        Mức thành thạo:{" "}
        <span className={`font-bold ${isDark ? "text-[#F1F5F9]" : "text-[#0F172A]"}`}>
          {item.score}%
        </span>
      </p>
    </div>
  )
}

/**
 * MitreRadarChart
 * Biểu đồ radar đánh giá năng lực phòng thủ theo khung phân loại MITRE ATT&CK.
 * Hiệu chỉnh tương phản cho cả Editorial Light và Deep Obsidian Dark.
 */
export function MitreRadarChart({ data = mockMitreRadarData, className = "" }) {
  const theme = useThemeStore((state) => state.theme)
  const isDark = theme === "dark"

  const chartData = data && data.length > 0 ? data : mockMitreRadarData

  const summary = useMemo(() => {
    const highest = chartData.reduce((best, cur) => (cur.score > best.score ? cur : best), chartData[0])
    const lowest = chartData.reduce((min, cur) => (cur.score < min.score ? cur : min), chartData[0])
    const average =
      chartData.reduce((sum, cur) => sum + (Number(cur.score) || 0), 0) / chartData.length

    const tierLabel =
      average >= 80 ? "Chuyên sâu" : average >= 60 ? "Trung cao cấp" : "Nền tảng"

    return { highest, lowest, average: Number(average.toFixed(1)), tierLabel }
  }, [chartData])

  const gridColor = isDark ? "rgba(255, 255, 255, 0.12)" : "#E5E2DC"
  const angleTickFill = isDark ? "#94A3B8" : "#475569"
  const radiusTickFill = "#64748B"
  const radarStroke = isDark ? "#38BDF8" : "#1D4ED8"
  const radarFill = isDark ? "#3B82F6" : "#1D4ED8"

  return (
    <div
      className={`p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-xs flex flex-col justify-between ${className}`.trim()}
    >
      {/* Tiêu đề khối biểu đồ */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#38BDF8] border border-blue-200/80 dark:border-blue-500/25 shrink-0">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
              Phân bổ năng lực MITRE ATT&amp;CK
            </h3>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech mt-0.5">
              Đánh giá năng lực phát hiện và phòng thủ theo chiến thuật
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F3F1EC] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech shrink-0">
          <Award className="w-3 h-3 text-[#1D4ED8] dark:text-[#38BDF8]" aria-hidden="true" />
          <span>{summary.tierLabel}</span>
        </span>
      </div>

      {/* Vùng đồ thị Recharts */}
      <div className="w-full h-64 mt-1" aria-label="Biểu đồ radar năng lực theo khung MITRE ATT&CK">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid stroke={gridColor} strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{
                fill: angleTickFill,
                fontSize: 11,
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{
                fill: radiusTickFill,
                fontSize: 9,
                fontFamily: "var(--font-mono)",
              }}
              stroke={gridColor}
            />
            <Tooltip content={(props) => renderMitreTooltip({ ...props, isDark })} />
            <Radar
              name="Chỉ số MITRE ATT&CK"
              dataKey="score"
              stroke={radarStroke}
              strokeWidth={2}
              fill={radarFill}
              fillOpacity={isDark ? 0.24 : 0.16}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Chân trang tổng kết chỉ số */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] text-center font-mono-tech text-[11px]">
        <div>
          <span className="text-[#64748B] dark:text-[#94A3B8] block">Điểm mạnh</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold inline-flex items-center gap-0.5 justify-center">
            {summary.highest.domain} (<CountUp key={`hi-${summary.highest.score}`} end={summary.highest.score} suffix="%" duration={900} />)
          </span>
        </div>
        <div>
          <span className="text-[#64748B] dark:text-[#94A3B8] block">Trung bình</span>
          <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold inline-flex items-center justify-center">
            <CountUp key={`avg-${summary.average}`} end={summary.average} decimals={1} suffix="%" duration={900} />
          </span>
        </div>
        <div>
          <span className="text-[#64748B] dark:text-[#94A3B8] block">Cần củng cố</span>
          <span className="text-amber-700 dark:text-amber-400 font-semibold inline-flex items-center gap-0.5 justify-center">
            {summary.lowest.domain} (<CountUp key={`lo-${summary.lowest.score}`} end={summary.lowest.score} suffix="%" duration={900} />)
          </span>
        </div>
      </div>
    </div>
  )
}

export default MitreRadarChart
