import { useState, useEffect, useMemo, useContext } from "react"
import {
  Clock,
  Server,
  Terminal,
  CheckCircle2,
  FlaskConical,
  Trophy,
  RotateCcw,
  Users,
} from "lucide-react"
import { CountUp } from "../../components/common"
import { LabFilterBar } from "./components/LabFilterBar"
import { FlagSubmissionCard } from "./components/FlagSubmissionCard"
import { LeaderboardPanel } from "./components/LeaderboardPanel"
import useLabStore from "../../stores/useLabStore"
import useNotificationStore from "../../stores/useNotificationStore"
import challengeService from "../../services/challengeService"
import AuthContext from "../../context/AuthContext"

const LAB_DATA = [
  {
    id: "lab-01",
    category: "web",
    title: "SQL Injection: Evasion Filter & Tham Số Hóa Truy Vấn",
    difficulty: "Intermediate",
    duration: "35 phút",
    durationMinutes: 35,
    mitre: "T1190",
    points: 450,
    tags: ["CWE-89", "OWASP A03", "Prepared Statements"],
    description:
      "Vượt bộ lọc từ khóa bằng mã hóa hex và comment nội tuyến, sau đó triển khai Prepared Statements để vá triệt để lỗ hổng trên cơ sở dữ liệu thật.",
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
    durationMinutes: 25,
    mitre: "T1059.007",
    points: 300,
    tags: ["CWE-79", "DOM XSS", "Content Security Policy"],
    description:
      "Kiểm toán điểm sink phản chiếu dữ liệu phía trình khách, xây dựng payload vượt bộ lọc và cấu hình header CSP strict-dynamic an toàn.",
    targetIp: "10.10.14.92",
    targetPort: "3000",
    flag: "FLAG{XSS_DOM_BYP4SS}",
  },
  {
    id: "lab-03",
    category: "web",
    title: "Thao Túng JWT Token & Tấn Công Nhầm Lẫn Thuật Toán",
    difficulty: "Advanced",
    duration: "45 phút",
    durationMinutes: 45,
    mitre: "T1556",
    points: 600,
    tags: ["CWE-347", "JWT", "RSA-to-HMAC"],
    description:
      "Khai thác lỗi nhầm lẫn thuật toán RSA bất đối xứng sang HMAC đối xứng trong REST API để giả mạo token quản trị viên hệ thống.",
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
    durationMinutes: 50,
    mitre: "T1055",
    points: 500,
    tags: ["Dump RAM", "Volatility 3", "DLL Injection"],
    description:
      "Phân tích tệp dump RAM để truy tìm DLL độc hại tiêm vào tiến trình hệ thống, tách cây tiến trình ẩn và cô lập kênh beacon C2.",
    targetIp: "10.10.14.101",
    targetPort: "22",
    flag: "FLAG{V0L4T1L1TY_M3M_C2}",
  },
  {
    id: "lab-05",
    category: "soc",
    title: "Xây Dựng Quy Tắc Suricata & Nhận Diện Lưu Lượng C2",
    difficulty: "Novice",
    duration: "30 phút",
    durationMinutes: 30,
    mitre: "T1071",
    points: 350,
    tags: ["IDS/IPS", "Pháp chứng PCAP", "Suricata"],
    description:
      "Viết quy tắc chữ ký phát hiện lưu lượng outbound bất thường và kênh truyền dữ liệu ngầm DNS Tunneling trong tệp bắt gói tin PCAP.",
    targetIp: "10.10.14.105",
    targetPort: "443",
    flag: "FLAG{SURIC4T4_C2_RUL3}",
  },
  {
    id: "lab-06",
    category: "network",
    title: "Phân Tích Gói Tin Mạng & Phòng Thủ Tấn Công Đầu Độc ARP",
    difficulty: "Intermediate",
    duration: "40 phút",
    durationMinutes: 40,
    mitre: "T1557.002",
    points: 400,
    tags: ["Wireshark", "ARP Spoofing", "Dynamic ARP Inspection"],
    description:
      "Phân tích lưu lượng mạng LAN chuyển mạch, phát hiện gói ARP Reply giả mạo và cấu hình cơ chế DAI trên Switch để ngăn chặn MITM.",
    targetIp: "10.10.14.110",
    targetPort: "80",
    flag: "FLAG{4RP_SP00F_D3T3CT}",
  },
  {
    id: "lab-07",
    category: "cloud",
    title: "Leo Thang Đặc Quyền AWS IAM & Khai Thác Cloud Metadata",
    difficulty: "Advanced",
    duration: "55 phút",
    durationMinutes: 55,
    mitre: "T1078.004",
    points: 650,
    tags: ["AWS STS", "IMDSv2", "Kiểm toán IAM"],
    description:
      "Khai thác lỗ hổng SSRF trên máy ảo EC2 để thu hoạch chứng chỉ phiên tạm thời từ IMDS và kiểm toán chính sách leo thang quyền IAM.",
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
    durationMinutes: 35,
    mitre: "T1573",
    points: 450,
    tags: ["RFC 8446", "TLS 1.3", "OpenSSL"],
    description:
      "Kiểm tra tính năng Hoàn hảo Bảo mật Chuyển tiếp (PFS) của cipher suite, phân tích extension ServerHello và loại bỏ hạ cấp giao thức cũ.",
    targetIp: "10.10.14.125",
    targetPort: "443",
    flag: "FLAG{TLS_13_F0RW4RD_S3C}",
  },
]

const BACKEND_SLUG_META = {
  "classic-sql-injection": {
    mitre: "T1190",
    tags: ["CWE-89", "SQL Injection", "OWASP A03"],
    duration: "25 phút",
    durationMinutes: 25,
    targetIp: "10.10.14.11",
    targetPort: "8080",
  },
  "reflected-xss-search": {
    mitre: "T1059.007",
    tags: ["CWE-79", "Reflected XSS", "DOM"],
    duration: "20 phút",
    durationMinutes: 20,
    targetIp: "10.10.14.12",
    targetPort: "3000",
  },
  "idor-profile-leak": {
    mitre: "T1078",
    tags: ["CWE-639", "IDOR / BOLA", "REST API"],
    duration: "35 phút",
    durationMinutes: 35,
    targetIp: "10.10.14.15",
    targetPort: "8000",
  },
  "rsa-weak-key": {
    mitre: "T1600",
    tags: ["RSA", "Fermat Factorization", "Mật mã học"],
    duration: "40 phút",
    durationMinutes: 40,
    targetIp: "10.10.14.22",
    targetPort: "443",
  },
  "buffer-overflow-101": {
    mitre: "T1203",
    tags: ["CWE-121", "Stack Overflow", "x86/EIP"],
    duration: "50 phút",
    durationMinutes: 50,
    targetIp: "10.10.14.31",
    targetPort: "9001",
  },
}

const CATEGORY_CATALOG = [
  { id: "all", label: "Tất cả" },
  { id: "web", label: "Khai thác Web" },
  { id: "soc", label: "SOC & Pháp chứng" },
  { id: "network", label: "Phòng thủ Mạng" },
  { id: "cloud", label: "Bảo mật Đám mây" },
  { id: "crypto", label: "Mật mã học" },
  { id: "pwn", label: "Nhị phân (PWN)" },
]

const DIFFICULTIES = ["all", "Novice", "Intermediate", "Advanced"]

const DIFFICULTY_LABELS = {
  Novice: "Cơ bản",
  Intermediate: "Trung cấp",
  Advanced: "Nâng cao",
}

function normalizeDifficulty(raw) {
  const upper = String(raw || "").toUpperCase()
  if (upper === "EASY" || upper === "BEGINNER" || upper === "NOVICE") return "Novice"
  if (upper === "HARD" || upper === "ADVANCED") return "Advanced"
  return "Intermediate"
}

function mapChallengeToLab(ch, idx) {
  const matched = LAB_DATA.find(
    (item) => item.id === ch.slug || item.title?.toLowerCase() === ch.title?.toLowerCase()
  )
  if (matched) {
    return {
      ...matched,
      backendId: ch.id,
      points: ch.points || matched.points,
      solvesCount: typeof ch.solvesCount === "number" ? ch.solvesCount : undefined,
      solved: Boolean(ch.solved),
      hintsCount: typeof ch.hintsCount === "number" ? ch.hintsCount : undefined,
    }
  }

  const slugMeta = BACKEND_SLUG_META[ch.slug]
  const fallback = LAB_DATA[idx % LAB_DATA.length]
  const category = String(ch.category || fallback.category).toLowerCase()

  return {
    id: ch.slug || `lab-${ch.id}`,
    backendId: ch.id,
    title: ch.title || fallback.title,
    category,
    difficulty: normalizeDifficulty(ch.difficulty),
    duration: slugMeta?.duration || fallback.duration,
    durationMinutes: slugMeta?.durationMinutes || fallback.durationMinutes,
    mitre: slugMeta?.mitre || fallback.mitre,
    points: ch.points || 400,
    tags: slugMeta?.tags || [category.toUpperCase(), "CTF"],
    description: ch.description || fallback.description,
    targetIp: slugMeta?.targetIp || fallback.targetIp,
    targetPort: slugMeta?.targetPort || fallback.targetPort,
    solvesCount: typeof ch.solvesCount === "number" ? ch.solvesCount : undefined,
    solved: Boolean(ch.solved),
    hintsCount: typeof ch.hintsCount === "number" ? ch.hintsCount : undefined,
  }
}

export function Labs() {
  const [labs, setLabs] = useState(LAB_DATA)
  const [dataMode, setDataMode] = useState("curated") // "curated" | "live"
  const [activeView, setActiveView] = useState("catalog") // "catalog" | "leaderboard"
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const authCtx = useContext(AuthContext)
  const currentUsername = authCtx?.user?.username || ""

  const {
    startLab,
    isRunning,
    activeLab,
    openTerminal,
    completedLabs,
    userPoints,
    setLabCatalog,
    syncSolvedLabs,
  } = useLabStore()
  const { info } = useNotificationStore()

  useEffect(() => {
    setLabCatalog(LAB_DATA)
  }, [setLabCatalog])

  useEffect(() => {
    let isMounted = true

    async function loadChallenges() {
      try {
        const res = await challengeService.getChallenges()
        if (!isMounted || !res?.success || !res.data) return

        const rawItems = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.content)
          ? res.data.content
          : []

        if (rawItems.length === 0) return

        const liveLabs = rawItems.map(mapChallengeToLab)
        setLabs(liveLabs)
        setDataMode("live")
        setLabCatalog(liveLabs)

        const serverSolvedIds = liveLabs.filter((item) => item.solved).map((item) => item.id)
        if (serverSolvedIds.length > 0) {
          syncSolvedLabs(serverSolvedIds)
        }
      } catch (err) {
        console.warn("Không thể tải danh mục thử thách từ máy chủ:", err)
      }
    }

    loadChallenges()

    return () => {
      isMounted = false
    }
  }, [setLabCatalog, syncSolvedLabs])

  const categoriesWithCounts = useMemo(() => {
    const knownIds = new Set(CATEGORY_CATALOG.map((c) => c.id))
    const dynamicExtras = Array.from(new Set(labs.map((l) => l.category)))
      .filter((cat) => cat && !knownIds.has(cat))
      .map((cat) => ({ id: cat, label: cat.toUpperCase() }))

    return [...CATEGORY_CATALOG, ...dynamicExtras]
      .map((cat) => ({
        ...cat,
        count:
          cat.id === "all"
            ? labs.length
            : labs.filter((lab) => lab.category === cat.id).length,
      }))
      .filter((cat) => cat.id === "all" || cat.count > 0)
  }, [labs])

  const filteredLabs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return labs.filter((lab) => {
      const matchesCategory = selectedCategory === "all" || lab.category === selectedCategory
      const matchesDifficulty =
        selectedDifficulty === "all" || lab.difficulty === selectedDifficulty
      const matchesSearch =
        !query ||
        lab.title.toLowerCase().includes(query) ||
        lab.description.toLowerCase().includes(query) ||
        lab.tags.some((t) => t.toLowerCase().includes(query)) ||
        lab.mitre.toLowerCase().includes(query)
      return matchesCategory && matchesDifficulty && matchesSearch
    })
  }, [labs, selectedCategory, selectedDifficulty, searchQuery])

  const handleLaunchLab = (lab) => {
    if (activeLab?.id === lab.id && isRunning) {
      openTerminal()
      info("Truy cập Terminal", `Mở phiên dòng lệnh đang hoạt động: ${lab.title}`)
    } else {
      startLab(lab)
      info("Khởi tạo Sandbox", `Đã cấp phát container cô lập cho: ${lab.title}`)
    }
  }

  const handleResetFilters = () => {
    setSelectedCategory("all")
    setSelectedDifficulty("all")
    setSearchQuery("")
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-14 space-y-8 animate-fade-in-up">
      {/* ====================================================================
          1. SCHOLARLY HEADER & RANGE TELEMETRY
         ==================================================================== */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] text-[11px] font-mono-tech font-medium uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#38BDF8]" aria-hidden="true" />
            <span>§01 // CYBER RANGE · PHÒNG THÍ NGHIỆM CÔ LẬP</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
            Phòng Thí Nghiệm Thực Chiến
          </h1>

          <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Thực nghiệm phân tích lỗ hổng và phòng thủ hệ thống trên môi trường container cô lập. Khởi chạy Sandbox CLI, đối chiếu kỹ thuật MITRE ATT&CK® và nộp Flag xác thực năng lực.
          </p>
        </div>

        {/* Range Status Telemetry & Active Session Shortcut */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {isRunning && activeLab && (
            <button
              type="button"
              onClick={openTerminal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-xs"
            >
              <Terminal className="w-4 h-4 shrink-0" />
              <span>Mở Terminal ({activeLab.title.slice(0, 18)}...)</span>
            </button>
          )}

          <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] shadow-xs">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#38BDF8] border border-blue-200/80 dark:border-blue-500/25">
              <Server className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
                <span>Hạ tầng Sandbox: Sẵn sàng</span>
              </div>
              <div className="text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8] mt-0.5 tabular-nums">
                Tích lũy:{" "}
                <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                  {userPoints.toLocaleString("vi-VN")} XP
                </span>{" "}
                · {completedLabs.length}/{labs.length} hoàn thành
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          2. SECTION VIEW SWITCHER (CATALOG vs LIVE LEADERBOARD)
         ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Chuyển đổi chế độ xem Phòng thí nghiệm"
          className="inline-flex items-center p-1 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] self-start overflow-x-auto max-w-full"
        >
          <button
            id="tab-labs-catalog"
            type="button"
            role="tab"
            aria-selected={activeView === "catalog"}
            onClick={() => setActiveView("catalog")}
            className={`shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeView === "catalog"
                ? "bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC] dark:border-white/[0.08]"
                : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-transparent"
            }`}
          >
            <FlaskConical
              className={`w-4 h-4 ${
                activeView === "catalog" ? "text-[#1D4ED8] dark:text-[#38BDF8]" : ""
              }`}
            />
            <span>Danh mục Thí nghiệm</span>
            <span className="px-1.5 py-0.5 rounded text-[11px] font-mono-tech tabular-nums bg-[#F3F1EC] dark:bg-[#0B0E14] text-[#475569] dark:text-[#94A3B8]">
              {labs.length}
            </span>
          </button>

          <button
            id="tab-labs-leaderboard"
            type="button"
            role="tab"
            aria-selected={activeView === "leaderboard"}
            onClick={() => setActiveView("leaderboard")}
            className={`shrink-0 whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeView === "leaderboard"
                ? "bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC] dark:border-white/[0.08]"
                : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-transparent"
            }`}
          >
            <Trophy
              className={`w-4 h-4 ${
                activeView === "leaderboard" ? "text-[#1D4ED8] dark:text-[#38BDF8]" : ""
              }`}
            />
            <span>Bảng Xếp Hạng Nghiên Cứu (Live)</span>
          </button>
        </div>

        <div className="text-xs font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
          Nguồn danh mục:{" "}
          <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
            {dataMode === "live" ? "Máy chủ CyberPath API" : "Bộ thí nghiệm chuẩn hóa"}
          </span>
        </div>
      </div>

      {/* ====================================================================
          3. ACTIVE TAB CONTENT
         ==================================================================== */}
      {activeView === "leaderboard" ? (
        <LeaderboardPanel
          userPoints={userPoints}
          completedCount={completedLabs.length}
          currentUsername={currentUsername}
        />
      ) : (
        <div className="space-y-6">
          <LabFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            categories={categoriesWithCounts}
            difficulties={DIFFICULTIES}
          />

          {filteredLabs.length === 0 ? (
            <div className="p-10 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-center space-y-3">
              <p className="font-serif-editorial text-xl font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Không tìm thấy bài thí nghiệm phù hợp
              </p>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] max-w-md mx-auto">
                Thử điều chỉnh từ khóa tìm kiếm, mã MITRE hoặc chọn lại bộ lọc chuyên mục và cấp độ.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại bộ lọc</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredLabs.map((lab, idx) => {
                const isCompleted = completedLabs.includes(lab.id)
                const isCurrentActive = activeLab?.id === lab.id && isRunning
                const difficultyText = DIFFICULTY_LABELS[lab.difficulty] || lab.difficulty

                return (
                  <article
                    key={lab.id}
                    className={`p-5 sm:p-6 rounded-xl flex flex-col justify-between bg-white dark:bg-[#121722] border transition-colors duration-150 group shadow-xs ${
                      isCurrentActive
                        ? "border-[#1D4ED8] dark:border-[#3B82F6]"
                        : isCompleted
                        ? "border-emerald-300 dark:border-emerald-500/35"
                        : "border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#D0CCC3] dark:hover:border-white/[0.16]"
                    }`}
                  >
                    <div className="space-y-3.5">
                      {/* Specimen Top Bar */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EFEDE7] dark:border-white/[0.06]">
                        <span className="text-[11px] font-mono-tech font-medium px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                          SPEC-{String(idx + 1).padStart(2, "0")} · {lab.mitre}
                        </span>

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã giải</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200/80 dark:border-blue-500/25">
                            +<CountUp end={lab.points} start={lab.points} duration={600} suffix=" XP" />
                          </span>
                        )}
                      </div>

                      {/* Title & Scholarly Abstract */}
                      <div>
                        <h3 className="text-base font-semibold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors leading-snug">
                          {lab.title}
                        </h3>
                        <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-2 leading-relaxed line-clamp-3">
                          {lab.description}
                        </p>
                      </div>

                      {/* Endpoint & Solves Telemetry */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
                        <span>
                          Mục tiêu: {lab.targetIp}:{lab.targetPort}
                        </span>
                        {typeof lab.solvesCount === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{lab.solvesCount} lượt giải</span>
                          </span>
                        )}
                      </div>

                      {/* Technical Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {lab.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono-tech font-medium px-2 py-0.5 rounded bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Flag Submission Subcard */}
                      <div className="pt-1">
                        <FlagSubmissionCard lab={lab} />
                      </div>
                    </div>

                    {/* Specimen Card Footer */}
                    <div className="mt-5 pt-3.5 border-t border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8] min-w-0">
                        <Clock className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
                        <span className="whitespace-nowrap">{lab.duration}</span>
                        <span aria-hidden="true">&middot;</span>
                        <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9] whitespace-nowrap">
                          {difficultyText}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLaunchLab(lab)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                          isCurrentActive
                            ? "bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white"
                            : "bg-[#0F172A] hover:bg-[#1D4ED8] dark:bg-[#161C2A] dark:hover:bg-[#3B82F6] text-white border border-transparent dark:border-white/[0.12]"
                        }`}
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        <span>{isCurrentActive ? "Mở Terminal" : "Khởi Chạy Sandbox"}</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Labs
