import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Shield, Target } from "lucide-react"

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
        <div className="bg-slate-900 border border-cyan-500/40 p-2.5 rounded-xl shadow-xl text-xs font-mono">
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
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Ma Trận MITRE ATT&CK
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Phân tích năng lực phòng thủ & tấn công
            </p>
          </div>
        </div>

        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <Target className="w-3 h-3" />
          <span>Tier: Advanced</span>
        </span>
      </div>

      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 9 }}
              stroke="#334155"
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

      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-800/80 text-center font-mono text-[11px]">
        <div>
          <span className="text-slate-500 block">Cao nhất</span>
          <span className="text-emerald-400 font-bold">Execution (90%)</span>
        </div>
        <div>
          <span className="text-slate-500 block">Trung bình</span>
          <span className="text-cyan-400 font-bold">75.0%</span>
        </div>
        <div>
          <span className="text-slate-500 block">Cần bổ trợ</span>
          <span className="text-amber-400 font-bold">Exfil (60%)</span>
        </div>
      </div>
    </div>
  )
}

export default MitreRadarChart
