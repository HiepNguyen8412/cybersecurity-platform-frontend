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
  HelpCircle,
  Check,
  AlertTriangle,
  RotateCcw,
  Play,
  Crosshair,
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

  return (
    <div className="space-y-10 pb-10 sm:pb-12 animate-fade-in-up">
      {/* ====================================================================
          1. ACADEMY MISSION CONTROL HUD (HERO BANNER - CYBER RANGE THEME)
         ==================================================================== */}
      <section className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden text-white">
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
                <span>6 LIVE TACTICAL MODULES ONLINE</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400 hidden sm:inline-block">
                MITRE ATT&CK & NIST SP 800-181 COMPLIANT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Giáo Trình Thực Chiến An Ninh Mạng & Phân Tích Khai Thác
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Mỗi bài học được thiết kế chuẩn thao trường (Cyber Range) với kịch bản mã độc thực tế, payload khai thác chi tiết, phân tích code và máy ảo sandbox tương tác độc lập.
            </p>
          </div>

          {/* Quick HUD Metrics Card */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl backdrop-blur-md shrink-0 min-w-[280px]">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Active Learners</span>
              <span className="text-lg font-mono font-extrabold text-cyan-400">
                <CountUp end={14820} duration={200} />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Labs Mapped</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400">
                <CountUp end={68} duration={200} suffix=" VMs" />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Total Academy XP</span>
              <span className="text-lg font-mono font-extrabold text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{userXp} XP</span>
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">Active Season</span>
              <span className="text-lg font-mono font-extrabold text-indigo-400">Tier-2 Range</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. FILTER & SEARCH CONTROL MATRIX
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
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id
                    ? "bg-slate-950/30 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400"
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-900/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 placeholder:text-slate-500 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">ĐỘ KHÓ:</span>
            {["all", "novice", "intermediate", "specialist"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-semibold transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-slate-100 text-slate-950 shadow-sm"
                    : "bg-slate-900/70 text-slate-400 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {diff}
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
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>GIÁO TRÌNH TÁC CHIẾN ({filteredModules.length} MODULES)</span>
            </h2>
            <span className="text-[11px] text-cyan-400 font-mono">
              BẤM VÀO BÀI HỌC ĐỂ MỞ MISSION CONSOLE
            </span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
              <HelpCircle className="h-10 w-10 text-slate-500 mx-auto" />
              <p className="text-sm font-medium text-slate-300">Không tìm thấy module phù hợp với bộ lọc hiện tại.</p>
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
                  className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800/90 hover:border-cyan-500/40 shadow-xl transition-all duration-300 relative overflow-hidden group space-y-4"
                >
                  {/* Subtle top indicator for enrolled courses */}
                  {isEnrolled && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500" />
                  )}

                  <div className="space-y-4">
                    {/* Header Row: Code + Track + Difficulty + CVSS */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {mod.code}
                        </span>

                        <Badge
                          variant={
                            mod.difficulty === "Novice"
                              ? "success"
                              : mod.difficulty === "Intermediate"
                              ? "primary"
                              : "warning"
                          }
                          size="sm"
                        >
                          {mod.difficulty}
                        </Badge>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {mod.cert}
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 border border-amber-900/30 hidden sm:inline-block">
                          MITRE: {mod.mitre}
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/40">
                          CVSS {mod.cvssBase}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Clock className="h-3.5 w-3.5" />
                          {mod.duration}
                        </span>
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Layers className="h-3.5 w-3.5 text-slate-500" />
                          {mod.lessonsCount} Lessons
                        </span>
                      </div>
                    </div>

                    {/* Title & Technical Description */}
                    <div className="space-y-1.5">
                      <h3
                        onClick={() => openLessonModal(mod.id)}
                        className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {mod.description}
                      </p>
                    </div>

                    {/* Progress Bar (Dynamic from Store) */}
                    {isEnrolled && (
                      <div className="rounded-2xl bg-slate-950 p-3.5 border border-slate-800/90 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-300 font-mono">TIẾN ĐỘ HOÀN THÀNH</span>
                          <span className="text-cyan-400 font-mono">{progress}% ({completedList.length}/{mod.syllabus.length} bài)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Bar & Accordion Trigger */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-800">
                      <button
                        onClick={() => toggleSyllabus(mod.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer self-start sm:self-auto font-mono"
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
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer border border-slate-700"
                        >
                          Syllabus Drawer
                        </button>

                        <button
                          onClick={() => launchLessonLab(mod.labId)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-cyan-500/30"
                        >
                          <Terminal className="h-3.5 w-3.5" />
                          <span>Sandbox Lab</span>
                        </button>

                        <button
                          onClick={() => openLessonModal(mod.id)}
                          className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
                        >
                          <Play className="h-3.5 w-3.5 fill-slate-950" />
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

                    {/* Expandable Syllabus Accordion (with Clickable Lessons!) */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-fade-in-up">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                          <span>DANH SÁCH BÀI GIẢNG & PHÂN TÍCH THỰC CHIẾN</span>
                          <span className="text-cyan-400">Click để mở bài học</span>
                        </div>

                        <div className="space-y-1.5">
                          {mod.syllabus.map((lesson, idx) => {
                            const isLessonDone = completedList.includes(lesson.id)

                            return (
                              <div
                                key={lesson.id}
                                className={`p-3 rounded-xl flex items-center justify-between text-xs transition-all group ${
                                  isLessonDone
                                    ? "bg-emerald-950/20 border border-emerald-500/30 text-slate-200"
                                    : "bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-slate-200"
                                }`}
                              >
                                {/* Left: Toggle Checkbox + Title */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleLesson(mod.id, lesson.id)
                                    }}
                                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                      isLessonDone
                                        ? "bg-emerald-500 text-slate-950"
                                        : "border border-slate-600 hover:border-cyan-400 text-transparent hover:text-cyan-400"
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
                                      <span className="font-mono text-[10px] text-cyan-400/80 font-bold">
                                        Bài {String(idx + 1).padStart(2, "0")}
                                      </span>
                                      <span className={`font-medium truncate ${isLessonDone ? "line-through text-slate-400" : "group-hover:text-cyan-400"}`}>
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
                                    className="p-1 rounded text-slate-500 group-hover:text-cyan-400 transition-colors cursor-pointer"
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
        </div>

        {/* RIGHT COLUMN: INTERACTIVE DAILY THREAT DRILL & CERTIFICATION ROADMAP (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ====================================================================
              WIDGET 1: INTERACTIVE DAILY THREAT DRILL (GAMIFIED PROTOCOL CHALLENGE)
             ==================================================================== */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-xl relative overflow-hidden text-white space-y-3">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 uppercase tracking-wider">
                DAILY SOC THREAT DRILL
              </span>
              <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                +150 XP
              </span>
            </div>

            <h3 className="text-sm font-bold text-white">
              Phát Hiện Vector Tấn Công Trong HTTP Request Này
            </h3>
            
            <p className="text-xs text-slate-400">
              Cụm WAF Reverse Proxy vừa chặn request bất thường gửi tới endpoint nội bộ:
            </p>

            {/* Code / Telemetry Log Snippet */}
            <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto space-y-1 shadow-inner border border-slate-800">
              <div className="text-emerald-400 font-bold">
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
                          ? "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold"
                          : isSelected
                          ? "bg-rose-950/40 border-rose-500 text-rose-200"
                          : "bg-slate-950/40 border-slate-850 text-slate-500 opacity-60"
                        : "bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300 hover:border-cyan-500/40"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Drill Result Explanation */}
            {drillSubmitted && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-2 animate-fade-in-up">
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  {drillAnswer === 0 ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400">Chính xác! +150 XP đã cộng vào hồ sơ</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                      <span className="text-amber-400">Phân tích chiến thuật bổ sung</span>
                    </>
                  )}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Địa chỉ IP <code className="font-mono text-cyan-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">169.254.169.254</code> là địa chỉ link-local của AWS/Azure Instance Metadata Service (IMDS). Kẻ tấn công lợi dụng lỗ hổng SSRF để đánh cắp IAM Temporary Session Keys.
                </p>
                <button
                  onClick={handleDrillReset}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline pt-1 cursor-pointer font-mono"
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
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-white">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Mức Độ Chuẩn Bị Chứng Chỉ Quốc Tế
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Các bài học được chuẩn hóa theo format đề thi offensive & defensive thực chiến:
            </p>

            <div className="space-y-3">
              {[
                { name: "CompTIA Security+ (SY0-701)", readiness: 85, color: "bg-cyan-500" },
                { name: "Certified Ethical Hacker (CEH v12)", readiness: 65, color: "bg-blue-500" },
                { name: "OffSec Certified Professional (OSCP)", readiness: 40, color: "bg-amber-500" },
                { name: "Certified Cloud Security (CCSP)", readiness: 25, color: "bg-indigo-500" },
              ].map((cert, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 truncate max-w-[200px]">{cert.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      <CountUp end={cert.readiness} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cert.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cert.readiness}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/learning-paths" className="w-full block">
                <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors cursor-pointer border border-slate-700">
                  Khám Phá Lộ Trình Sự Nghiệp &rarr;
                </button>
              </Link>
            </div>
          </div>

          {/* ====================================================================
              WIDGET 3: LIVE TERMINAL LAB SHORTCUT
             ==================================================================== */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-xl space-y-3 border border-blue-500/30">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 font-bold">
              <Terminal className="h-4 w-4" />
              <span>TERMINAL SANDBOX STANDBY</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Mỗi bài giảng liên kết trực tiếp với máy ảo Linux container có sẵn bộ công cụ pentest & phân tích gói tin.
            </p>
            <Link to="/labs" className="inline-block w-full">
              <button
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Khởi Động Cyber Range Labs
              </button>
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
