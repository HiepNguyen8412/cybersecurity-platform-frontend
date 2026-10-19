import { useState } from "react"
import { createPortal } from "react-dom"
import { useSearchParams } from "react-router-dom"
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
  AlertTriangle,
  BookOpen,
  Code2,
  ShieldAlert,
  ShieldCheck,
  Flame,
  FileText,
  Compass,
} from "lucide-react"
import useLearningStore from "../../../stores/useLearningStore"
import useNotificationStore from "../../../stores/useNotificationStore"

// Curated Patched Secure Code Implementations for Deep Learning
const SECURE_CODE_MAPPING = {
  s1: `// Hardened CORS Implementation (Strict Whitelist + Origin Vary Header):
const ALLOWED_ORIGINS = new Set([
  'https://bank.com',
  'https://app.bank.com'
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin');
  }
  next();
});`,
  s2: `-- Hardened SQL Defense: Parameterized Prepared Statements
-- User input bound strictly as parameters, never parsed into SQL AST:
PREPARE stmt FROM 
  'SELECT id, email, role FROM system_users 
   WHERE department = ? AND created_by = ? AND status = ?';
EXECUTE stmt USING @dept, @username, @status;
DEALLOCATE PREPARE stmt;`,
  s3: `// Hardened Client-Side Rendering with DOMPurify & TextContent:
import DOMPurify from 'dompurify';

const params = new URLSearchParams(window.location.search);
const redirectTarget = params.get('next');

// SAFE SINK: Using textContent eliminates HTML parser execution entirely
const statusEl = document.getElementById('status-container');
statusEl.textContent = redirectTarget || 'Dashboard Ready';
// If HTML formatting is mandatory, sanitize strictly with DOMPurify:
// statusEl.innerHTML = DOMPurify.sanitize(redirectTarget);`,
}

// Interactive Attack Chain Stages
const ATTACK_CHAIN_STAGES = [
  {
    step: "01",
    phase: "RECON & MAPPING",
    title: "Thu thập & Nhận diện bề mặt tấn công",
    desc: "Adversary thăm dò máy chủ, kiểm tra response headers, endpoint phản hồi và version framework qua nmap & curl.",
    telemetry: "HTTP/1.1 200 OK | Server: nginx/1.22 | Access-Control-Allow-Origin: *",
  },
  {
    step: "02",
    phase: "FILTER EVASION",
    title: "Vượt qua bộ lọc WAF & Regex",
    desc: "Kỹ thuật payload obfuscation, hex-encoding, inline comment hoặc origin reflection để qua mặt rule WAF.",
    telemetry: "WAF Rule ID 942100: BYPASSED via Nested Token Comment /**/",
  },
  {
    step: "03",
    phase: "EXECUTION SINK",
    title: "Kích hoạt lỗ hổng tại điểm thực thi",
    desc: "Payload chạm vào sink nguy hiểm (Database Query, eval, innerHTML, Metadata endpoint) và thực thi đặc quyền.",
    telemetry: "DB Query Log: [ALERT] Syntax alteration triggered by unescaped input token",
  },
  {
    step: "04",
    phase: "REMEDIATION & MITIGATION",
    title: "Vá nóng kiến trúc & Giám sát SOC",
    desc: "Triển khai prepared statements, strict allowlist, token validation và cập nhật rule cảnh báo SIEM/Suricata.",
    telemetry: "Patch Status: Parameterized Binding Enforced (Zero injection surface)",
  },
]

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

  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get("tab") || "theory"
  const [activeTab, setActiveTab] = useState(initialTab) // "theory" | "code" | "quiz"
  const [selectedChainStep, setSelectedChainStep] = useState(0)
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  if (!activeLessonModal) return null

  const { course, lesson, lessonIndex } = activeLessonModal
  const totalLessons = course.syllabus.length
  const isDone = (completedLessons[course.id] || []).includes(lesson.id)

  const securePatchCode =
    SECURE_CODE_MAPPING[lesson.id] ||
    `// Hardened Security Standard Implementation:
// 1. Strict Server-Side Type Validation & Schema Enforcement
// 2. Least-Privilege Execution Environment
// 3. Cryptographic Token Binding & Audit Telemetry Logging
const secureResult = await enforceSecurityGuardrail(userInput, {
  sanitize: true,
  requireAuth: true,
  logContext: { lesson: "${lesson.id}", mitre: "${lesson.mitre}" }
});`

  const handleCopyPayload = () => {
    if (!lesson.payloadExample) return
    navigator.clipboard.writeText(lesson.payloadExample)
    setCopiedPayload(true)
    useNotificationStore.getState().info("Đã Sao Chép Payload", "Đã sao chép payload khai thác vào clipboard.")
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
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* ====================================================================
            1. CYBER MISSION CONSOLE HEADER
           ==================================================================== */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {course.code} &bull; BÀI HỌC {String(lessonIndex + 1).padStart(2, "0")}/{String(totalLessons).padStart(2, "0")}
            </span>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/50 hidden sm:inline-block">
              {course.track}
            </span>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>CVSS {course.cvssBase}</span>
            </span>

            {isDone && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ĐÃ HOÀN THÀNH</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLesson(course.id, lesson.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isDone ? "Đã Hoàn Thành" : "Đánh Dấu Xong"}</span>
            </button>

            <button
              onClick={closeLessonModal}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Đóng Mission Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ====================================================================
            2. HERO BRIEFING STRIP
           ==================================================================== */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800/80 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug">
              {lesson.title}
            </h2>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Thời lượng ước tính: {lesson.duration}</span>
            </div>
          </div>

          {/* Tactical Metadata Badges */}
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Mục tiêu: {lesson.objective}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-900/40">
              MITRE: {lesson.mitre}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-900/40">
              Vulnerability: {lesson.cve}
            </span>
          </div>
        </div>

        {/* ====================================================================
            3. TAB NAVIGATION BAR
           ==================================================================== */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/50 gap-2">
          {[
            { id: "theory", label: "Kiến Thức & Luồng Tấn Công", icon: BookOpen },
            { id: "code", label: "So Sánh Code (Lỗi vs Đã Vá)", icon: Code2 },
            { id: "quiz", label: "Trắc Nghiệm Tác Chiến (+50 XP)", icon: FileText },
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
          
          {/* TAB 1: THEORY & INTERACTIVE ATTACK CHAIN */}
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

              {/* Interactive 4-Stage Attack Chain Visualizer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Mô Phỏng Chuỗi Khai Thác Đa Tầng (Threat Vector Chain)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Bấm vào từng bước để phân tích gói tin
                  </span>
                </div>

                {/* 4 Clickable Step Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {ATTACK_CHAIN_STAGES.map((st, idx) => {
                    const isSelected = selectedChainStep === idx
                    return (
                      <button
                        key={st.step}
                        type="button"
                        onClick={() => setSelectedChainStep(idx)}
                        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/30 shadow-md shadow-cyan-950/40 text-white"
                            : "bg-slate-950/80 hover:bg-slate-900/90 border-slate-800 text-slate-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                          }`}>
                            GIAI ĐOẠN {st.step}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-cyan-400">
                            {st.phase}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                          {st.title}
                        </h4>
                      </button>
                    )
                  })}
                </div>

                {/* Selected Stage Detail Inspector */}
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-cyan-400 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>PHÂN TÍCH TÁC CHIẾN GIAI ĐOẠN {ATTACK_CHAIN_STAGES[selectedChainStep].step}: {ATTACK_CHAIN_STAGES[selectedChainStep].title}</span>
                    </span>
                    <span className="text-[10px] text-slate-500">KIỂM TOÁN GÓI TIN TELEMETRY</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {ATTACK_CHAIN_STAGES[selectedChainStep].desc}
                  </p>
                  <div className="p-2.5 rounded-lg bg-black/80 border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    <code>{ATTACK_CHAIN_STAGES[selectedChainStep].telemetry}</code>
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

          {/* TAB 2: SIDE-BY-SIDE VULNERABLE VS HARDENED CODE DIFF */}
          {activeTab === "code" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Đối Chiếu Mã Nguồn: Đoạn Code Lỗi vs Bản Vá Phòng Thủ
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  Phân tích chuẩn OWASP & NIST
                </span>
              </div>

              {/* Side-by-Side Dual Editor Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Pane: Vulnerable Code */}
                <div className="rounded-xl border border-rose-500/30 bg-slate-950 overflow-hidden flex flex-col shadow-inner">
                  <div className="px-3.5 py-2.5 bg-rose-950/40 border-b border-rose-800/40 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>VULNERABLE IMPLEMENTATION (CODE LỖI)</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200">
                      ĐIỂM YẾU DỄ KHAI THÁC
                    </span>
                  </div>

                  <div className="p-4 font-mono text-xs text-rose-300/90 overflow-x-auto flex-1 leading-relaxed whitespace-pre">
                    <code>{lesson.codeSnippet}</code>
                  </div>

                  <div className="p-2.5 bg-rose-950/20 border-t border-rose-900/30 text-[11px] font-sans text-rose-300">
                    <strong>Điểm yếu:</strong> Thiếu cơ chế sanitization và cho phép dữ liệu thô từ request trực tiếp chi phối luồng thực thi.
                  </div>
                </div>

                {/* Right Pane: Hardened Secure Patch */}
                <div className="rounded-xl border border-emerald-500/30 bg-slate-950 overflow-hidden flex flex-col shadow-inner">
                  <div className="px-3.5 py-2.5 bg-emerald-950/40 border-b border-emerald-800/40 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>HARDENED DEFENSE (BẢN VÁ AN TOÀN)</span>
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200">
                      CHUẨN AN TOÀN OWASP
                    </span>
                  </div>

                  <div className="p-4 font-mono text-xs text-emerald-300/90 overflow-x-auto flex-1 leading-relaxed whitespace-pre">
                    <code>{securePatchCode}</code>
                  </div>

                  <div className="p-2.5 bg-emerald-950/20 border-t border-emerald-900/30 text-[11px] font-sans text-emerald-300">
                    <strong>Khắc phục:</strong> Ràng buộc kiểu dữ liệu, tách biệt cấu trúc lệnh và dữ liệu người dùng, kích hoạt telemetry cảnh báo.
                  </div>
                </div>
              </div>

              {/* Weaponized Payload Snippet Box */}
              {lesson.payloadExample && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Payload Khai Thác Thao Trường (Weaponized Test Vector)</span>
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
                          <span>Sao chép Payload</span>
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
                      <FileText className="w-4 h-4" />
                      <span>Thử Thách Đánh Giá Chiến Thuật</span>
                    </span>

                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>+50 XP</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {lesson.quiz.question}
                  </h3>

                  <div className="space-y-2.5 pt-1">
                    {lesson.quiz.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx
                      const isCorrect = idx === lesson.quiz.correct

                      let style = "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300"
                      if (quizSubmitted) {
                        if (isCorrect) {
                          style = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold"
                        } else if (isSelected) {
                          style = "bg-rose-950/40 border-rose-500 text-rose-200"
                        } else {
                          style = "bg-slate-950/40 border-slate-850 text-slate-500 opacity-60"
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
