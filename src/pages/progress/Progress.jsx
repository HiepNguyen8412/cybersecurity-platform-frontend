import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Shield,
  Target,
  Calendar,
  Zap,
  ArrowRight,
  Flame,
  ChevronRight,
} from "lucide-react"
import { Card, Button, CountUp } from "../../components/common"

const DOMAIN_MASTERY = [
  { id: "web", name: "Web Application Security (OWASP Top 10)", score: 84, level: "Advanced", color: "bg-blue-600", labsDone: 14, totalLabs: 16 },
  { id: "soc", name: "Defensive SOC, SIEM & Threat Hunting", score: 72, level: "Proficient", color: "bg-emerald-600", labsDone: 9, totalLabs: 12 },
  { id: "net", name: "Network Packet Forensics & Protocols", score: 68, level: "Proficient", color: "bg-cyan-600", labsDone: 8, totalLabs: 12 },
  { id: "cloud", name: "Cloud Infrastructure & IAM Defense", score: 45, level: "Developing", color: "bg-indigo-600", labsDone: 4, totalLabs: 10 },
  { id: "rev", name: "Binary Exploitation & Reverse Engineering", score: 28, level: "Novice", color: "bg-amber-600", labsDone: 2, totalLabs: 8 },
]

const RECENT_FLAGS = [
  { id: "f1", title: "SQLi Filter Evasion & Parameterization", cve: "CWE-89", date: "Today, 14:22", xp: "+450 XP", flag: "FLAG{SQLi_P4TCH3D_V2}" },
  { id: "f2", title: "Cross-Site Scripting (XSS) DOM Sink Bypass", cve: "CWE-79", date: "Yesterday, 21:05", xp: "+300 XP", flag: "FLAG{XSS_DOM_BYP4SS}" },
  { id: "f3", title: "Suricata IDS Rule Validation for Cobalt Strike", cve: "T1071", date: "Oct 06, 18:40", xp: "+400 XP", flag: "FLAG{IDS_RULES_ENGAGED}" },
  { id: "f4", title: "JWT RS256 to HS256 Algorithm Confusion", cve: "T1556", date: "Oct 04, 11:15", xp: "+600 XP", flag: "FLAG{JWT_ALG_NONE_FORGED}" },
  { id: "f5", title: "Wireshark DNS Exfiltration PCAP Reconstruction", cve: "T1048", date: "Oct 02, 16:30", xp: "+500 XP", flag: "FLAG{PCAP_DNS_STREAM_REC}" },
]

// Mock 28-day study activity matrix
const ACTIVITY_DAYS = Array.from({ length: 28 }, (_, i) => {
  const intensity = (i * 7 + 3) % 5 // 0 to 4
  return { day: i + 1, level: intensity }
})

export function Progress() {
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_MASTERY[0])

  return (
    <div className="space-y-8 pb-16 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER TELEMETRY STRIP
         ==================================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-br from-white via-blue-50/30 to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white uppercase tracking-wider shadow-2xs">
                TELEMETRY & MASTERY
              </span>
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                RANK: SPECIALIST TIER-2
              </span>
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                7-DAY STREAK
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Skill Mastery Matrix & Learning Telemetry
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Real-time audit of your offensive and defensive competencies, validated lab achievements, and persistent curriculum progress.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[100px]">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Total XP</span>
              <span className="text-lg font-mono-tech font-extrabold text-blue-600">
                <CountUp end={8450} />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[100px]">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Flags Solved</span>
              <span className="text-lg font-mono-tech font-extrabold text-emerald-600">
                <CountUp end={38} />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[100px]">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Lab Hours</span>
              <span className="text-lg font-mono-tech font-extrabold text-indigo-600">
                <CountUp end={142} suffix="h" />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[100px]">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Completion</span>
              <span className="text-lg font-mono-tech font-extrabold text-amber-600">
                <CountUp end={64} suffix="%" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. TWO-COLUMN LAYOUT: DOMAIN MASTERY BARS & ACTIVITY MATRIX
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: DOMAIN MASTERY BREAKDOWN (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Security Competency Breakdown
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated based on practical lab execution, quiz accuracy, and CTF flags.
                </p>
              </div>
              <span className="font-mono-tech text-xs text-blue-600 font-bold">
                AVERAGE: 59.4%
              </span>
            </div>

            <div className="space-y-4">
              {DOMAIN_MASTERY.map((domain) => (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedDomain.id === domain.id
                      ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-500/10 shadow-2xs"
                      : "bg-white hover:bg-slate-50/80 border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-800">{domain.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {domain.level}
                      </span>
                      <span className="font-mono-tech font-bold text-slate-900">
                        <CountUp end={domain.score} suffix="%" />
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${domain.color} rounded-full transition-all duration-700`}
                      style={{ width: `${domain.score}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono-tech">
                    <span>Labs Completed: {domain.labsDone} of {domain.totalLabs}</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                      View Drills <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ACTIVITY VELOCITY MATRIX (HEATMAP STYLE) */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Monthly Practice Cadence
                </h3>
                <p className="text-xs text-slate-500">
                  Hands-on hours logged across live virtual machines in the past 28 days.
                </p>
              </div>
              <span className="text-xs font-mono-tech text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE CYCLE
              </span>
            </div>

            {/* Heatmap Grid */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-7 gap-2">
                {ACTIVITY_DAYS.map((d) => {
                  const bgClass =
                    d.level === 0
                      ? "bg-slate-200/80"
                      : d.level === 1
                      ? "bg-blue-200"
                      : d.level === 2
                      ? "bg-blue-400"
                      : d.level === 3
                      ? "bg-blue-600"
                      : "bg-blue-800"

                  return (
                    <div
                      key={d.day}
                      className={`h-7 rounded-md ${bgClass} transition-all hover:scale-110 flex items-center justify-center text-[10px] font-mono font-bold ${
                        d.level >= 2 ? "text-white" : "text-slate-600"
                      }`}
                      title={`Day ${d.day}: Level ${d.level} study intensity`}
                    >
                      {d.day}
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono-tech">
                <span>Less Active</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-slate-200" />
                  <div className="h-3 w-3 rounded bg-blue-200" />
                  <div className="h-3 w-3 rounded bg-blue-400" />
                  <div className="h-3 w-3 rounded bg-blue-600" />
                  <div className="h-3 w-3 rounded bg-blue-800" />
                </div>
                <span>High Velocity</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: RECENT FLAGS & RECOMMENDATIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* RECENT CAPTURED FLAGS TABLE */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Validated Flag Submissions
                </h3>
              </div>
              <span className="font-mono-tech text-xs text-slate-400">
                AUDITED LOGS
              </span>
            </div>

            <div className="space-y-3">
              {RECENT_FLAGS.map((flag) => (
                <div
                  key={flag.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 truncate max-w-[200px]">
                      {flag.title}
                    </span>
                    <span className="font-mono-tech text-emerald-600 font-bold">
                      {flag.xp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-tech">
                    <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                      {flag.cve}
                    </span>
                    <span>{flag.date}</span>
                  </div>

                  <div className="pt-1 font-mono text-[10px] text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded border border-blue-100 truncate">
                    {flag.flag}
                  </div>
                </div>
              ))}
            </div>

            <Link to="/labs" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full justify-center">
                Launch Next Lab Challenge
              </Button>
            </Link>
          </Card>

          {/* RECOMMENDED TARGET FOCUS */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-blue-300">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>AI COPILOT RECOMMENDATION</span>
            </div>

            <h4 className="text-sm font-bold text-white">
              Recommended Focus: Cloud Infrastructure Security
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your Web Application mastery is high (84%), but Cloud IAM privilege escalation is currently at 45%. Completing module <code className="text-blue-300 font-mono font-bold">CLD-401</code> will qualify you for the CCSP range trial.
            </p>

            <Link to="/learning" className="block pt-1">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Go to Module CLD-401
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress
