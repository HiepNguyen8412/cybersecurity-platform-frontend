import { useState } from "react"
import {
  Clock,
  Server,
  Terminal,
  CheckCircle2,
} from "lucide-react"
import { Card, CountUp } from "../../components/common"
import { LabTerminalModal } from "./components/LabTerminalModal"
import { LabFilterBar } from "./components/LabFilterBar"
import { FlagSubmissionCard } from "./components/FlagSubmissionCard"
import useLabStore from "../../stores/useLabStore"
import useNotificationStore from "../../stores/useNotificationStore"

const LAB_DATA = [
  {
    id: "lab-01",
    category: "web",
    title: "SQL Injection: Evasion Filter & Tham Số Hóa Truy Vấn",
    difficulty: "Intermediate",
    duration: "35 phút",
    mitre: "T1190",
    points: 450,
    tags: ["CWE-89", "OWASP Top 10", "Prepared Statements"],
    description: "Bypass bộ lọc từ khóa bằng mã hóa hex và inline comments, sau đó triển khai Prepared Statements để vá triệt để lỗ hổng trên database thật.",
    targetIp: "10.10.14.89",
    targetPort: "8080",
    flag: "FLAG{SQLi_P4TCH3D_V2}",
  },
  {
    id: "lab-02",
    category: "web",
    title: "Tấn Công XSS DOM-Based & Bypass Chính Sách CSP",
    difficulty: "Novice",
    duration: "25 phút",
    mitre: "T1059.007",
    points: 300,
    tags: ["CWE-79", "DOM XSS", "Content Security Policy"],
    description: "Kiểm toán điểm sink phản chiếu dữ liệu client-side, xây dựng payload bypass bộ lọc để đánh cắp cookie phiên giả lập và cấu hình header CSP an toàn.",
    targetIp: "10.10.14.92",
    targetPort: "3000",
    flag: "FLAG{XSS_DOM_BYP4SS}",
  },
  {
    id: "lab-03",
    category: "web",
    title: "Thao Túng JWT Token & Tấn Công Thuật Toán Nhầm Lẫn",
    difficulty: "Advanced",
    duration: "45 phút",
    mitre: "T1556",
    points: 600,
    tags: ["JWT", "RSA-to-HMAC", "Bypass Xác Thực"],
    description: "Khai thác lỗi nhầm lẫn thuật toán RSA bất đối xứng sang HMAC đối xứng trong REST API để giả mạo token quản trị viên hệ thống.",
    targetIp: "10.10.14.95",
    targetPort: "5000",
    flag: "FLAG{JWT_HM4C_F0RG3D}",
  },
  {
    id: "lab-04",
    category: "soc",
    title: "Ứng Cứu Sự Cố: Điều Tra Pháp Chứng Bộ Nhớ Với Volatility",
    difficulty: "Intermediate",
    duration: "50 phút",
    mitre: "T1055",
    points: 500,
    tags: ["Dump RAM", "Volatility 3", "DLL Injection"],
    description: "Phân tích file dump RAM máy tính để truy tìm DLL độc hại được tiêm vào tiến trình, tách cây tiến trình ẩn và chặn kênh beacon C2.",
    targetIp: "10.10.14.101",
    targetPort: "SSH-22",
    flag: "FLAG{V0L4T1L1TY_M3M_C2}",
  },
  {
    id: "lab-05",
    category: "soc",
    title: "Xây Dựng Quy Tắc Suricata & Nhận Diện Lưu Lượng C2",
    difficulty: "Novice",
    duration: "30 phút",
    mitre: "T1071",
    points: 350,
    tags: ["IDS/IPS", "Pháp Chứng PCAP", "Snort/Suricata"],
    description: "Viết quy tắc chữ ký phát hiện lưu lượng outbound bất thường và kênh truyền dữ liệu ngầm DNS Tunneling trong file pcap mạng.",
    targetIp: "10.10.14.105",
    targetPort: "Console",
    flag: "FLAG{SURIC4T4_C2_RUL3}",
  },
  {
    id: "lab-06",
    category: "network",
    title: "Phân Tích Gói Tin Mạng & Phòng Thủ Tấn Công Đầu Độc ARP",
    difficulty: "Intermediate",
    duration: "40 phút",
    mitre: "T1557.002",
    points: 400,
    tags: ["Wireshark", "ARP Spoofing", "Dynamic ARP Inspection"],
    description: "Bắt và phân tích gói tin trong mạng LAN chuyển mạch, phát hiện gói ARP Reply giả mạo và cấu hình cơ chế DAI trên Switch để ngăn chặn tấn công MITM.",
    targetIp: "10.10.14.110",
    targetPort: "Ethernet",
    flag: "FLAG{4RP_SP00F_D3T3CT}",
  },
  {
    id: "lab-07",
    category: "cloud",
    title: "Leo Thang Đặc Quyền AWS IAM & Khai Thác Cloud Metadata",
    difficulty: "Advanced",
    duration: "55 phút",
    mitre: "T1078.004",
    points: 650,
    tags: ["AWS STS", "Metadata IMDSv2", "Kiểm Toán Quyền IAM"],
    description: "Khai thác lỗ hổng SSRF trên máy ảo EC2 để thu hoạch credentials tạm thời từ IMDS và pivot leo thang lên quyền Administrator.",
    targetIp: "10.10.14.120",
    targetPort: "8000",
    flag: "FLAG{CL0UD_IAM_PR1V3SC}",
  },
  {
    id: "lab-08",
    category: "network",
    title: "Bắt Tay TLS 1.3 & Kiểm Toán Bộ Thuật Toán Mật Mã",
    difficulty: "Intermediate",
    duration: "35 phút",
    mitre: "T1573",
    points: 450,
    tags: ["TLS 1.3", "Diffie-Hellman", "OpenSSL s_client"],
    description: "Kiểm tra tính năng Forward Secrecy của cipher suites, phân tích các extension trong Server Hello và vá các lỗi hạ cấp giao thức cũ.",
    targetIp: "10.10.14.125",
    targetPort: "443",
    flag: "FLAG{TLS_13_F0RW4RD_S3C}",
  },
]

const CATEGORIES = [
  { id: "all", label: "Tất cả Labs" },
  { id: "web", label: "Khai Thác Web" },
  { id: "soc", label: "SOC & Pháp Chứng" },
  { id: "network", label: "Phòng Thủ Mạng" },
  { id: "cloud", label: "Bảo Mật Đám Mây" },
]

const DIFFICULTIES = ["all", "Novice", "Intermediate", "Advanced"]

export function Labs() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { startLab, isRunning, activeLab, openTerminal, completedLabs, userPoints } = useLabStore()
  const { info } = useNotificationStore()

  const handleLaunchLab = (lab) => {
    if (activeLab?.id === lab.id && isRunning) {
      openTerminal()
      info("Truy cập Terminal", `Mở phiên dòng lệnh đang chạy: ${lab.title}`)
    } else {
      startLab(lab)
      info("Khởi tạo Lab", `Đã kết nối sandbox môi trường: ${lab.title}`)
    }
  }

  const filteredLabs = LAB_DATA.filter((lab) => {
    const matchesCategory = selectedCategory === "all" || lab.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || lab.difficulty === selectedDifficulty
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lab.mitre.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-12 space-y-8 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER & LIVE RANGE TELEMETRY
         ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CYBER RANGE // K8S INTERACTIVE SANDBOX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
            Hands-On Security Laboratories
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 cyberpunk:text-cyan-300/80 max-w-2xl leading-relaxed">
            Thực hành tấn công và phòng thủ trên môi trường ảo hóa thực chiến. Khởi chạy sandbox container, kiểm thử khai thác và nộp Flag xác thực.
          </p>
        </div>

        {/* Live Range Status & User Score Box */}
        <div className="flex items-center gap-4">
          {/* Active Lab Quick Access button if running */}
          {isRunning && activeLab && (
            <button
              onClick={openTerminal}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer animate-pulse"
            >
              <Terminal className="w-4 h-4" />
              <span>Terminal Đang Chạy ({activeLab.title.substring(0, 18)}...)</span>
            </button>
          )}

          <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/40 bg-white dark:bg-slate-900/90 cyberpunk:bg-[#071022] font-mono text-xs shadow-2xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SANDBOX: READY</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Điểm cá nhân: <span className="text-amber-400 font-bold">{userPoints} XP</span> ({completedLabs.length} Hoàn thành)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. FILTER & SEARCH CONTROLS
         ==================================================================== */}
      <LabFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        categories={CATEGORIES.map((c) => ({
          ...c,
          count: c.id === "all" ? LAB_DATA.length : LAB_DATA.filter((l) => l.category === c.id).length,
        }))}
        difficulties={DIFFICULTIES}
      />

      {/* ====================================================================
          3. LABS GRID (Bespoke Cards)
         ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => {
          const isCompleted = completedLabs.includes(lab.id)
          const isCurrentActive = activeLab?.id === lab.id && isRunning

          return (
            <Card
              key={lab.id}
              variant="default"
              className={`p-6 rounded-2xl flex flex-col justify-between border transition-all duration-300 relative group ${
                isCurrentActive
                  ? "border-cyan-500 bg-white dark:bg-slate-900/90 cyberpunk:bg-[#071022] shadow-xl shadow-cyan-950/20 border-cyan-500/70 shadow-md"
                  : isCompleted
                  ? "border-emerald-300 dark:border-emerald-500/40 bg-white dark:bg-slate-900/60 cyberpunk:bg-[#071022]"
                  : "cyber-card hover:border-blue-400 dark:hover:border-slate-700 cyberpunk:hover:border-cyan-400"
              }`}
            >
              <div className="space-y-3.5">
                {/* Card Meta Row */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    MITRE: {lab.mitre}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã giải</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      +<CountUp end={lab.points} duration={3500} suffix=" XP" />
                    </span>
                  )}
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 cyberpunk:text-slate-300 mt-2 leading-relaxed line-clamp-3">
                    {lab.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lab.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 cyberpunk:bg-[#0d1e3d] text-slate-700 dark:text-slate-300 cyberpunk:text-cyan-300 border border-slate-200 dark:border-slate-700/50 cyberpunk:border-cyan-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Flag Submission Card embedded if expanded or active */}
                <div className="pt-2">
                  <FlagSubmissionCard lab={lab} />
                </div>
              </div>

              {/* Bottom Row */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/20 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>{lab.duration}</span>
                  <span>&bull;</span>
                  <span className="font-semibold text-slate-300">{lab.difficulty}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleLaunchLab(lab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
                    isCurrentActive
                      ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold animate-pulse"
                      : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 cyberpunk:bg-cyan-500/20 cyberpunk:text-cyan-200 cyberpunk:border-cyan-400/50 border border-transparent"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isCurrentActive ? "Open CLI" : "Launch Lab"}</span>
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Sandbox Terminal Modal is mounted globally in AppLayout */}
    </div>
  )
}

export default Labs
