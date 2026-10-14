import { CheckCircle2, ShieldCheck, Lock, Sparkles } from "lucide-react"

export function LearningPathTimeline({ path, onSelectStage }) {
  const stages = path?.stages || [
    {
      id: "s1",
      name: "Security Fundamentals & Linux",
      status: "completed",
      modulesCount: 4,
      desc: "Networking, Linux CLI, Bash scripting & basic cryptography",
    },
    {
      id: "s2",
      name: "Offensive Tactics & Web Attacks",
      status: "current",
      modulesCount: 6,
      desc: "OWASP Top 10, SQLi, XSS, SSRF, Burp Suite & API auditing",
    },
    {
      id: "s3",
      name: "SOC Operations & Threat Hunting",
      status: "upcoming",
      modulesCount: 5,
      desc: "SIEM log analysis, Suricata, Memory forensics & MITRE mapping",
    },
    {
      id: "s4",
      name: "Cloud Defense & Architecture",
      status: "upcoming",
      modulesCount: 4,
      desc: "AWS/GCP security, Kubernetes hardening, DevSecOps pipelines",
    },
  ]

  return (
    <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>Lộ Trình Phát Triển Kỹ Năng: {path?.title || "Cybersecurity Specialist"}</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            4 Chặng đường từ nền tảng đến chuyên gia thực chiến
          </p>
        </div>

        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 2 in progress</span>
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {stages.map((st, idx) => {
          const isDone = st.status === "completed"
          const isCurrent = st.status === "current"

          return (
            <div
              key={st.id || idx}
              onClick={() => onSelectStage && onSelectStage(st)}
              className="relative group cursor-pointer"
            >
              {/* Dot icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                    : isCurrent
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40 ring-4 ring-cyan-500/20 animate-pulse"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : isCurrent ? (
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-950" />
                ) : (
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
              </div>

              {/* Content box */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/40"
                    : isDone
                    ? "bg-slate-950/60 border-slate-800"
                    : "bg-slate-950/30 border-slate-800/60 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={isCurrent ? "text-cyan-400 font-bold" : isDone ? "text-emerald-400 font-bold" : "text-slate-500"}>
                    Chặng {idx + 1} &bull; {st.modulesCount} Khóa học
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDone
                        ? "bg-emerald-500/10 text-emerald-400"
                        : isCurrent
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isDone ? "Đã Đạt" : isCurrent ? "Đang Học" : "Sắp Tới"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {st.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPathTimeline
