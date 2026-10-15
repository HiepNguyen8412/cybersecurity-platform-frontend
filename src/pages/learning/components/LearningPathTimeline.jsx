import { CheckCircle2, ShieldCheck, Lock, Target } from "lucide-react"

export function LearningPathTimeline({ path, onSelectStage }) {
  const stages = path?.stages || [
    {
      id: "s1",
      title: "Security Fundamentals & Linux",
      status: "completed",
      labs: 4,
      desc: "Networking, Linux CLI, Bash scripting & basic cryptography",
    },
    {
      id: "s2",
      title: "Offensive Tactics & Web Attacks",
      status: "in-progress",
      labs: 6,
      desc: "OWASP Top 10, SQLi, XSS, SSRF, Burp Suite & API auditing",
    },
    {
      id: "s3",
      title: "SOC Operations & Threat Hunting",
      status: "locked",
      labs: 5,
      desc: "SIEM log analysis, Suricata, Memory forensics & MITRE mapping",
    },
    {
      id: "s4",
      title: "Cloud Defense & Architecture",
      status: "locked",
      labs: 4,
      desc: "AWS/GCP security, Kubernetes hardening, DevSecOps pipelines",
    },
  ]

  return (
    <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md backdrop-blur-md">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            <span>Lộ Trình Tác Chiến: {path?.title || "Cybersecurity Specialist"}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            4 Chặng đường từ nền tảng đến chuyên gia thực chiến Cyber Range
          </p>
        </div>

        <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
          <Target className="w-3.5 h-3.5" />
          <span>Stage 02 Active</span>
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {stages.map((st, idx) => {
          const isDone = st.status === "completed"
          const isCurrent = st.status === "in-progress" || st.status === "current"
          const stageTitle = st.title || st.name
          const labsCount = st.labs || st.modulesCount || 4

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
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : isCurrent ? (
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
              </div>

              {/* Content box */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-cyan-50/40 dark:bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-950/20"
                    : isDone
                    ? "bg-slate-50/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800"
                    : "bg-slate-50/40 dark:bg-slate-950/30 border-slate-200/80 dark:border-slate-800/60 opacity-65"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className={isCurrent ? "text-cyan-700 dark:text-cyan-400 font-bold" : isDone ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-500"}>
                    Chặng {idx + 1} &bull; {labsCount} Bài Lab Thực Hành
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isDone
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        : isCurrent
                        ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isDone ? "ĐÃ ĐẠT" : isCurrent ? "ĐANG HỌC" : "ĐANG KHÓA"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {stageTitle}
                </h4>
                
                {st.skills && st.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {st.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPathTimeline
