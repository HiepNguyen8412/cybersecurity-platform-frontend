import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Shield, UserCheck } from "lucide-react"
import { CountUp } from "../../../components/common"

const DEFAULT_MITRE_DATA = [
  { domain: "Reconnaissance", score: 85, fullMark: 100 },
  { domain: "Initial Access", score: 72, fullMark: 100 },
  { domain: "Execution", score: 90, fullMark: 100 },
  { domain: "Persistence", score: 65, fullMark: 100 },
  { domain: "Defense Evasion", score: 78, fullMark: 100 },
  { domain: "Exfiltration", score: 60, fullMark: 100 },
]

export function MitreRadarChart({ data = DEFAULT_MITRE_DATA }) {
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-slate-900 dark:bg-black cyberpunk:bg-[#02050f] border border-cyan-500/50 p-2.5 rounded-xl shadow-xl text-xs font-mono text-white">
          <p className="font-bold text-cyan-400">{item.domain}</p>
          <p className="text-white mt-1">
            Độ thành thạo: <span className="text-emerald-400 font-bold">{item.score}%</span>
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
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-wide">
              Ma Trận MITRE ATT&CK
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80 font-mono">
              Phân tích năng lực phòng thủ & phát hiện xâm nhập
            </p>
          </div>
        </div>

        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-mono">
          <UserCheck className="w-3 h-3" />
          <span>Tier: Advanced</span>
        </span>
      </div>

      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#475569" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 9 }}
              stroke="#475569"
            />
            <Tooltip content={customTooltip} />
            <Radar
              name="MITRE Score"
              dataKey="score"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/30 text-center font-mono text-[11px]">
        <div>
          <span className="text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80 block">Cao nhất</span>
          <span className="text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 font-bold inline-flex items-center gap-0.5 justify-center">
            Execution (<CountUp end={90} suffix="%" duration={1600} />)
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80 block">Trung bình</span>
          <span className="text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 font-bold inline-flex items-center justify-center">
            <CountUp end={75} decimals={1} suffix="%" duration={1800} />
          </span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80 block">Cần bổ trợ</span>
          <span className="text-amber-600 dark:text-amber-400 cyberpunk:text-amber-300 font-bold inline-flex items-center gap-0.5 justify-center">
            Exfil (<CountUp end={60} suffix="%" duration={1500} />)
          </span>
        </div>
      </div>
    </div>
  )
}

export default MitreRadarChart
