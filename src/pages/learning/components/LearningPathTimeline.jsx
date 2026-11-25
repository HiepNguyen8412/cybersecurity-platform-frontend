import { CheckCircle2, ShieldCheck, Lock, Compass } from "lucide-react"

const DEFAULT_STAGES = [
  {
    id: "s1",
    title: "Nền Tảng Mạng, TCP/IP & Hệ Thống Linux",
    status: "completed",
    labs: 4,
    desc: "Kiến trúc TCP/IP, dòng lệnh Linux, tự động hóa Bash và mật mã học cơ bản.",
  },
  {
    id: "s2",
    title: "Khai Thác & Phòng Thủ Ứng Dụng Web (OWASP Top 10)",
    status: "in-progress",
    labs: 6,
    desc: "Phân tích AST SQLi, DOM XSS, SSRF, kiểm toán API và tham số hóa truy vấn.",
  },
  {
    id: "s3",
    title: "Vận Hành SOC & Săn Lùng Mối Đe Dọa (Threat Hunting)",
    status: "locked",
    labs: 5,
    desc: "Phân tích nhật ký SIEM, luật Suricata/Sigma, pháp chứng RAM và MITRE ATT&CK.",
  },
  {
    id: "s4",
    title: "Bảo Mật Đám Mây & Kiến Trúc Zero-Trust",
    status: "locked",
    labs: 4,
    desc: "Kiểm toán IAM, gia cố cụm Kubernetes và bảo vệ pipeline DevSecOps.",
  },
]

export function LearningPathTimeline({ path, onSelectStage }) {
  const stages = path?.stages || DEFAULT_STAGES
  const activeStageIndex = stages.findIndex(
    (s) => s.status === "in-progress" || s.status === "current"
  )
  const currentStageNum = activeStageIndex >= 0 ? activeStageIndex + 1 : 1

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#E5E2DC] dark:border-white/[0.08]">
        <div>
          <span className="text-[10px] font-mono-tech font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block mb-1">
            § TIẾN TRÌNH LỘ TRÌNH HỌC THUẬT
          </span>
          <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" />
            <span>{path?.title || "Lộ Trình Chuyên Gia An Ninh Mạng"}</span>
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono-tech mt-1">
            {stages.length} chặng đào tạo lũy tiến từ lý thuyết nền tảng đến bảo vệ Capstone
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-tech font-semibold bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25 whitespace-nowrap">
          <Compass className="w-3.5 h-3.5" />
          <span>Chặng {String(currentStageNum).padStart(2, "0")} Đang Mở</span>
        </span>
      </div>

      <div className="relative pl-7 sm:pl-9 space-y-5 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-[#D0CCC3] dark:before:bg-white/[0.12]">
        {stages.map((st, idx) => {
          const isDone = st.status === "completed"
          const isCurrent = st.status === "in-progress" || st.status === "current"
          const stageTitle = st.title || st.name
          const labsCount = st.labs || st.modulesCount || 4
          const interactiveProps = onSelectStage
            ? {
                role: "button",
                tabIndex: 0,
                onClick: () => onSelectStage(st),
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onSelectStage(st)
                  }
                },
              }
            : {}

          return (
            <div
              key={st.id || st.number || idx}
              {...interactiveProps}
              className={`relative group ${onSelectStage ? "cursor-pointer" : ""}`}
            >
              {/* Node Indicator */}
              <div
                className={`absolute -left-7 sm:-left-9 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors border ${
                  isDone
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : isCurrent
                    ? "bg-[#1D4ED8] dark:bg-[#3B82F6] border-[#1D4ED8] dark:border-[#3B82F6] text-white ring-4 ring-blue-500/15"
                    : "bg-white dark:bg-[#121722] text-[#64748B] dark:text-[#94A3B8] border-[#D0CCC3] dark:border-white/[0.15]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                )}
              </div>

              {/* Stage Card */}
              <div
                className={`p-4 rounded-xl border transition-colors ${
                  isCurrent
                    ? "bg-white dark:bg-[#121722] border-[#1D4ED8] dark:border-[#3B82F6] shadow-xs"
                    : isDone
                    ? "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]"
                    : "bg-[#F3F1EC]/70 dark:bg-[#161C2A]/50 border-[#E5E2DC] dark:border-white/[0.06] opacity-75"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5 gap-2 flex-wrap">
                  <span
                    className={
                      isCurrent
                        ? "text-[#1D4ED8] dark:text-[#38BDF8] font-semibold"
                        : isDone
                        ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                    }
                  >
                    Chặng {String(idx + 1).padStart(2, "0")} · {labsCount} Bài Lab Thực Nghiệm
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-semibold border whitespace-nowrap ${
                      isDone
                        ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                        : isCurrent
                        ? "bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border-blue-200 dark:border-blue-500/25"
                        : "bg-white dark:bg-[#121722] text-[#64748B] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08]"
                    }`}
                  >
                    {isDone ? "ĐÃ HOÀN THÀNH" : isCurrent ? "ĐANG HỌC" : "CHƯA MỞ KHÓA"}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors">
                  {stageTitle}
                </h4>

                {st.desc && (
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 font-sans leading-relaxed">
                    {st.desc}
                  </p>
                )}

                {st.skills && st.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2.5">
                    {st.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]"
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
