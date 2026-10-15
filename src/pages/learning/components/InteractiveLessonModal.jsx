import { useState } from "react"
import { createPortal } from "react-dom"
import {
  X,
  CheckCircle2,
  Clock,
  Terminal,
  Shield,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Code2,
  Target,
  Sparkles,
} from "lucide-react"
import useLearningStore from "../../../stores/useLearningStore"
import useNotificationStore from "../../../stores/useNotificationStore"

export function InteractiveLessonModal() {
  const {
    activeLessonModal,
    closeLessonModal,
    nextLesson,
    prevLesson,
    toggleLesson,
    completedLessons,
    launchLessonLab,
  } = useLearningStore()

  const [activeTab, setActiveTab] = useState("theory") // "theory" | "code" | "quiz"
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  if (!activeLessonModal) return null

  const { course, lesson, lessonIndex } = activeLessonModal
  const totalLessons = course.syllabus.length
  const isDone = (completedLessons[course.id] || []).includes(lesson.id)

  const handleCopyPayload = () => {
    if (!lesson.payloadExample) return
    navigator.clipboard.writeText(lesson.payloadExample)
    setCopiedPayload(true)
    useNotificationStore.getState().info("Payload Copied", "Đã sao chép payload khai thác vào clipboard.")
    setTimeout(() => setCopiedPayload(false), 2000)
  }

  const handleQuizSubmit = (optIndex) => {
    setSelectedOption(optIndex)
    setQuizSubmitted(true)
    if (optIndex === lesson.quiz?.correct) {
      useNotificationStore.getState().success(
        "Chính xác! Tactical Analysis Đạt Chuẩn",
        "+50 XP Thưởng Kiểm Tra Kỹ Năng"
      )
    }
  }

  const handleResetQuiz = () => {
    setSelectedOption(null)
    setQuizSubmitted(false)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-cyan-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-slate-100">
        
        {/* ====================================================================
            1. CYBER MISSION CONSOLE HEADER
           ==================================================================== */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {course.code} &bull; LESSON {String(lessonIndex + 1).padStart(2, "0")}/{String(totalLessons).padStart(2, "0")}
            </span>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50 hidden sm:inline-block">
              {course.track}
            </span>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>CVSS {course.cvssBase}</span>
            </span>

            {isDone && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>COMPLETED</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLesson(course.id, lesson.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isDone
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? "text-emerald-400" : "text-slate-400"}`} />
              <span className="hidden sm:inline">{isDone ? "Đã Hoàn Thành" : "Đánh Dấu Xong"}</span>
            </button>

            <button
              onClick={closeLessonModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ====================================================================
            2. TACTICAL BRIEFING HUD SUBHEADER
           ==================================================================== */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/30 border-b border-slate-800/80 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-cyan-400">#</span>
              <span>{lesson.title}</span>
            </h2>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Thời lượng ước tính: {lesson.duration}</span>
            </div>
          </div>

          {/* Tactical Metadata Badges */}
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              🎯 Mục tiêu: {lesson.objective}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-900/40">
              🛡️ MITRE: {lesson.mitre}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-900/40">
              ⚠️ Vulnerability: {lesson.cve}
            </span>
          </div>
        </div>

        {/* ====================================================================
            3. TAB NAVIGATION BAR
           ==================================================================== */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/50 gap-2">
          {[
            { id: "theory", label: "Kiến Thức & Cơ Chế Khai Thác", icon: BookOpen },
            { id: "code", label: "Mã Độc / Payload & Phân Tích Code", icon: Code2 },
            { id: "quiz", label: "Tactical Quiz & Thử Thách", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "border-cyan-400 text-cyan-400 bg-cyan-950/20"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* ====================================================================
            4. DYNAMIC TAB CONTENT VIEWPORT
           ==================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-thin">
          
          {/* TAB 1: THEORY & EXPLOIT MECHANICS */}
          {activeTab === "theory" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Tổng Quan Kịch Bản An Ninh Mạng (Mission Context)</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {lesson.theory}
                </p>
              </div>

              {/* Step-by-Step Tactical Steps */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Quy Trình Triển Khai Thực Chiến (Tactical Execution Steps)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      BƯỚC 01: RECON
                    </span>
                    <h4 className="text-xs font-bold text-white">Thu thập & Thăm dò mục tiêu</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Phát hiện công nghệ, banner grabbing, endpoint reflection, và phân tích cấu trúc HTTP header hoặc event log.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                      BƯỚC 02: INJECTION
                    </span>
                    <h4 className="text-xs font-bold text-white">Gia công & Bắn Payload</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Lách bộ lọc WAF/Regex bằng kỹ thuật encode hoặc inline comment, sau đó kích hoạt sink khai thác an toàn.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                      BƯỚC 03: DEFENSE
                    </span>
                    <h4 className="text-xs font-bold text-white">Vá lỗi & Triển khai giám sát</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Cấu hình Prepared Statements, Trusted Types, IMDSv2 token hoặc viết luật Suricata cảnh báo real-time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Cyber Range Sandbox Trigger Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                    <Terminal className="w-4 h-4" />
                    <span>MÁY ẢO THỰC HÀNH TƯƠNG TÁC (ISOLATED SANDBOX)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Khởi động phiên Kali Linux Terminal có sẵn mục tiêu giả lập để trực tiếp chạy thử các lệnh trong bài giảng.
                  </p>
                </div>

                <button
                  onClick={() => launchLessonLab(course.labId)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Bật Sandbox CLI</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CODE AUDIT & WEAPONIZED PAYLOAD */}
          {activeTab === "code" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Mã Nguồn Minh Họa ({lesson.codeLanguage?.toUpperCase() || "CODE"})</span>
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400/80">
                    Audit & Exploit Analysis
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                  <pre className="leading-relaxed whitespace-pre font-mono">
                    {lesson.codeSnippet}
                  </pre>
                </div>
              </div>

              {/* Weaponized Payload Snippet Box */}
              {lesson.payloadExample && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Weaponized Payload / Command Line Snippet</span>
                    </span>

                    <button
                      onClick={handleCopyPayload}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã copy!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Payload</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-black/70 border border-slate-800 font-mono text-xs text-amber-300 break-all select-all">
                    <code>{lesson.payloadExample}</code>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TACTICAL QUIZ & KNOWLEDGE CHECK */}
          {activeTab === "quiz" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {lesson.quiz ? (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Thử Thách Đánh Giá Chiến Thuật</span>
                    </span>
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>+50 XP</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white leading-relaxed">
                    {lesson.quiz.question}
                  </h3>

                  <div className="space-y-2">
                    {lesson.quiz.options.map((opt, idx) => {
                      const isCorrect = idx === lesson.quiz.correct
                      const isSelected = selectedOption === idx

                      let style = "bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-850"
                      if (quizSubmitted) {
                        if (isCorrect) {
                          style = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold"
                        } else if (isSelected) {
                          style = "bg-rose-950/40 border-rose-500 text-rose-200"
                        } else {
                          style = "bg-slate-900/50 border-slate-850 text-slate-500 opacity-60"
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizSubmit(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 cursor-pointer ${style}`}
                        >
                          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 border border-slate-700 text-slate-400 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      )
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center gap-2 font-bold font-mono">
                        {selectedOption === lesson.quiz.correct ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">CHÍNH XÁC! PHÂN TÍCH TÁC CHIẾN CHUẨN XÁC</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span className="text-rose-400">CHƯA ĐÚNG - HÃY ĐỌC LẠI PHÂN TÍCH DƯỚI ĐÂY</span>
                          </>
                        )}
                      </div>

                      <p className="text-slate-300 leading-relaxed font-sans">
                        {lesson.quiz.explanation}
                      </p>

                      <button
                        onClick={handleResetQuiz}
                        className="text-xs text-cyan-400 hover:underline font-mono pt-1 cursor-pointer block"
                      >
                        Thử lại câu hỏi
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 font-mono text-xs">
                  Không có câu hỏi trắc nghiệm cho bài này. Hãy chuyển sang phần thực hành Sandbox!
                </div>
              )}
            </div>
          )}

        </div>

        {/* ====================================================================
            5. CONSOLE FOOTER CONTROLS
           ==================================================================== */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={prevLesson}
              disabled={lessonIndex === 0}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bài Trước</span>
            </button>

            <span className="text-xs font-mono text-slate-400 hidden sm:inline px-2">
              {lessonIndex + 1} / {totalLessons}
            </span>

            <button
              onClick={nextLesson}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <span>{lessonIndex < totalLessons - 1 ? "Bài Tiếp Theo" : "Hoàn Tất Khóa"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={closeLessonModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Đóng Console
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default InteractiveLessonModal
