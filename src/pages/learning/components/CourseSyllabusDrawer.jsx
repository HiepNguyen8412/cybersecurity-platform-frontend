import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import {
  X,
  CheckCircle2,
  Clock,
  Play,
  Award,
  Terminal,
  ArrowRight,
  Lock,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  RotateCcw,
} from "lucide-react"
import useLearningStore from "../../../stores/useLearningStore"
import useNotificationStore from "../../../stores/useNotificationStore"

const COURSE_CAPSTONES = {
  "mod-web201":
    "Đồ án Capstone Web: Thực hiện kiểm thử xâm nhập đa tầng trên kiến trúc Microservices — khai thác SSRF truy xuất Cloud Metadata, vượt qua kiểm soát CORS/WAF và đề xuất bản vá triệt để ở tầng mã nguồn.",
  "mod-soc101":
    "Đồ án Capstone SOC: Điều tra chiến dịch xâm nhập APT — tương quan nhật ký Windows Event/Sysmon, viết luật phát hiện Sigma và xây dựng playbook cô lập máy trạm tự động.",
  "mod-net301":
    "Đồ án Capstone Pháp chứng Mạng: Giải mã tệp PCAP chứa lưu lượng C2, nhận diện kênh rò rỉ dữ liệu DNS Tunneling và thiết lập luật Suricata IDS chặn đứng lưu lượng bất thường.",
  "mod-net101":
    "Đồ án Capstone Pháp chứng Mạng: Giải mã tệp PCAP chứa lưu lượng C2, nhận diện kênh rò rỉ dữ liệu DNS Tunneling và thiết lập luật Suricata IDS chặn đứng lưu lượng bất thường.",
  "mod-cld401":
    "Đồ án Capstone Cloud & Kubernetes: Phân tích đường dẫn leo thang đặc quyền IAM, kiểm toán Pod Security Standards và thiết lập chính sách phòng thủ Kubernetes Zero-Trust.",
  "mod-cloud201":
    "Đồ án Capstone Cloud & Kubernetes: Phân tích đường dẫn leo thang đặc quyền IAM, kiểm toán Pod Security Standards và thiết lập chính sách phòng thủ Kubernetes Zero-Trust.",
  "mod-rev501":
    "Đồ án Capstone Nhị phân: Dịch ngược tệp thực thi ELF trong Ghidra, tính toán offset ghi đè stack vượt qua bảo vệ DEP/ASLR và đề xuất cờ biên dịch gia cố hệ thống.",
  "mod-pwn301":
    "Đồ án Capstone Nhị phân: Dịch ngược tệp thực thi ELF trong Ghidra, tính toán offset ghi đè stack vượt qua bảo vệ DEP/ASLR và đề xuất cờ biên dịch gia cố hệ thống.",
  "mod-sec101":
    "Đồ án Capstone Mật mã & PKI: Kiểm toán cấu hình AES-256-GCM, phân tích lộ trình bắt tay TLS 1.3 (RFC 8446) đảm bảo Forward Secrecy và thiết lập hàm băm mật khẩu Argon2id.",
  "mod-crypto101":
    "Đồ án Capstone Mật mã & PKI: Kiểm toán cấu hình AES-256-GCM, phân tích lộ trình bắt tay TLS 1.3 (RFC 8446) đảm bảo Forward Secrecy và thiết lập hàm băm mật khẩu Argon2id.",
}

const RUBRIC_CRITERIA = [
  {
    key: "reconScore",
    id: "capstone-recon-score",
    label: "1. Trinh sát & Phân tích Bề mặt (Reconnaissance)",
    desc: "Thu thập thông tin mục tiêu, xác định dịch vụ, phiên bản và ranh giới tin cậy",
    max: 20,
    defaultVal: 18,
  },
  {
    key: "exploitScore",
    id: "capstone-exploit-score",
    label: "2. Khai thác & Chứng minh Tác động (Exploitation)",
    desc: "Tái hiện chuỗi lỗ hổng chính xác và trích xuất bằng chứng kỹ thuật",
    max: 35,
    defaultVal: 31,
  },
  {
    key: "remediationScore",
    id: "capstone-remediation-score",
    label: "3. Bản vá An toàn & Gia cố (Remediation)",
    desc: "Triển khai bản vá mã nguồn chuẩn OWASP/NIST và siết chặt cấu hình phòng thủ",
    max: 30,
    defaultVal: 27,
  },
  {
    key: "reportScore",
    id: "capstone-report-score",
    label: "4. Báo cáo Kỹ thuật & Khuyến nghị (Reporting)",
    desc: "Tài liệu hóa bằng chứng tái lập, ánh xạ CWE/MITRE và lộ trình khắc phục",
    max: 15,
    defaultVal: 14,
  },
]

function DrawerContent({ course, onClose }) {
  const {
    completedLessons,
    toggleLesson,
    openLessonModal,
    launchLessonLab,
    getCourseProgress,
    isLessonUnlocked,
    canClaimCertificate,
    syncStatus,
    syncError,
    retrySync,
    capstoneCompleted,
    capstoneSubmissions,
    quizSummaries,
    certificates,
    isClaimingCert,
    isSubmittingCapstone,
    fetchQuizSummary,
    fetchCapstoneStatus,
    submitCapstoneProject,
    claimOfficialCertificate,
    fetchCertificateForCourse,
  } = useLearningStore()

  const existingSubmission = capstoneSubmissions[course.id]
  const [activeTab, setActiveTab] = useState("syllabus") // "syllabus" | "rubric" | "cert"
  const [isEditingCapstone, setIsEditingCapstone] = useState(!existingSubmission)
  const [reportContent, setReportContent] = useState(
    existingSubmission?.reportContent || ""
  )
  const [solutionUrl, setSolutionUrl] = useState(
    existingSubmission?.solutionUrl || ""
  )
  const [rubricScores, setRubricScores] = useState({
    reconScore: existingSubmission?.rubricReconScore ?? 18,
    exploitScore: existingSubmission?.rubricExploitScore ?? 31,
    remediationScore: existingSubmission?.rubricRemediationScore ?? 27,
    reportScore: existingSubmission?.rubricReportScore ?? 14,
  })
  const [formError, setFormError] = useState("")

  useEffect(() => {
    if (course?.backendId) {
      fetchQuizSummary(course.id, course.backendId)
      fetchCapstoneStatus(course.id, course.backendId)
      fetchCertificateForCourse(course.id, course.backendId)
    }
  }, [course.id, course.backendId, fetchQuizSummary, fetchCapstoneStatus, fetchCertificateForCourse])

  const courseCompletedList = completedLessons[course.id] || []
  const completedCount = courseCompletedList.length
  const totalCount = course.syllabus?.length || 0
  const progressPercent = getCourseProgress(course.id)
  const isCapstoneDone = !!capstoneCompleted[course.id]
  const courseSubmission = capstoneSubmissions[course.id]
  const courseQuizSummary = quizSummaries[course.id]
  const courseCertificate = certificates[course.id]

  const totalRubricScore =
    rubricScores.reconScore +
    rubricScores.exploitScore +
    rubricScores.remediationScore +
    rubricScores.reportScore

  const handleLessonSelect = (lessonId) => {
    onClose()
    openLessonModal(course.id, lessonId)
  }

  const handleContinueStudy = () => {
    onClose()
    openLessonModal(course.id)
  }

  const handleScoreChange = (key, max, rawVal) => {
    const parsed = Number(rawVal)
    const safeVal = Number.isFinite(parsed)
      ? Math.min(max, Math.max(0, Math.round(parsed)))
      : 0
    setRubricScores((prev) => ({ ...prev, [key]: safeVal }))
  }

  const handleCapstoneSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    const trimmed = reportContent.trim()
    if (trimmed.length < 20) {
      setFormError(
        "Vui lòng trình bày báo cáo kỹ thuật tối thiểu 20 ký tự (mô tả lỗ hổng, bằng chứng và phương án khắc phục)."
      )
      return
    }

    try {
      await submitCapstoneProject(course.id, course.backendId || course.id, {
        reportContent: trimmed,
        solutionUrl: solutionUrl.trim(),
        ...rubricScores,
      })
      setIsEditingCapstone(false)
    } catch (err) {
      setFormError(err?.message || "Không thể nộp hồ sơ đồ án. Vui lòng kiểm tra lại.")
    }
  }

  return (
    <div
      className="relative w-full max-w-xl h-full bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] border-l border-[#E5E2DC] dark:border-white/[0.09] shadow-2xl flex flex-col justify-between"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ====================================================================
          DRAWER HEADER (Editorial Light / Deep Obsidian Dark)
         ==================================================================== */}
      <div className="px-6 pt-5 pb-4 border-b border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-tech font-semibold bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25">
              {course.code || "HỌC PHẦN"}
            </span>
            <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
              {course.track || "Chuyên đề An ninh mạng"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng đề cương học phần"
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2
          id="syllabus-drawer-title"
          className="font-serif-editorial text-xl sm:text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-snug tracking-tight"
        >
          {course.title}
        </h2>

        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-[#475569] dark:text-[#94A3B8] mt-2 font-mono-tech">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
            <span>{course.duration}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{course.cert || "Chuẩn nghề nghiệp quốc tế"}</span>
          </span>
          {course.bloomLevel && (
            <>
              <span aria-hidden="true">·</span>
              <span>Bloom: {course.bloomLevel}</span>
            </>
          )}
        </div>

        {/* Progress bar with Server Sync Telemetry */}
        <div className="mt-4 pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06]">
          <div className="flex justify-between items-center text-xs font-mono-tech mb-1.5 gap-2">
            <div className="text-[#475569] dark:text-[#94A3B8] flex items-center gap-1.5 flex-wrap">
              <span>Tiến độ học phần:</span>
              {syncStatus === "syncing" && (
                <span className="text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] font-normal">
                  Đang đồng bộ...
                </span>
              )}
              {syncStatus === "synced" && (
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-normal inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Đã lưu máy chủ</span>
                </span>
              )}
              {syncStatus === "local" && (
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-normal">
                  Lưu cục bộ (Offline)
                </span>
              )}
              {syncStatus === "error" && (
                <button
                  type="button"
                  onClick={() => retrySync(course.id)}
                  title={syncError || "Lỗi kết nối máy chủ - Bấm để đồng bộ lại"}
                  className="text-[11px] text-rose-700 dark:text-rose-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Lỗi đồng bộ (Thử lại)</span>
                </button>
              )}
            </div>
            <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold shrink-0">
              {progressPercent}% ({completedCount}/{totalCount} bài)
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#ECE9E2] dark:bg-[#1B2335] overflow-hidden">
            <div
              className="h-full bg-[#1D4ED8] dark:bg-[#3B82F6] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Danh mục thông tin học phần"
          className="flex items-center gap-4 mt-4 pt-2 border-t border-[#EFEDE7] dark:border-white/[0.06] font-sans text-xs"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "syllabus"}
            onClick={() => setActiveTab("syllabus")}
            className={`pb-2 px-1 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "syllabus"
                ? "border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8]"
                : "border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
            }`}
          >
            Bài Học ({totalCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "rubric"}
            onClick={() => setActiveTab("rubric")}
            className={`pb-2 px-1 font-semibold border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "rubric"
                ? "border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8]"
                : "border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
            }`}
          >
            Đồ Án Capstone &amp; Rubric
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "cert"}
            onClick={() => setActiveTab("cert")}
            className={`pb-2 px-1 font-semibold border-b-2 transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "cert"
                ? "border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8]"
                : "border-transparent text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Chứng Chỉ Số</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          TAB CONTENT VIEWPORT
         ==================================================================== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* TAB 1: SYLLABUS LESSONS */}
        {activeTab === "syllabus" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-[11px] font-mono-tech font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                § Đề cương bài giảng ({totalCount} chuyên đề)
              </h3>
              <span className="text-[11px] font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8]">
                Mở theo thứ tự tiên quyết
              </span>
            </div>

            {course.syllabus?.map((lesson, idx) => {
              const isCompleted = courseCompletedList.includes(lesson.id)
              const isUnlocked = isLessonUnlocked(course.id, idx)
              const prevLesson = idx > 0 ? course.syllabus[idx - 1] : null

              return (
                <div
                  key={lesson.id || idx}
                  className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 group ${
                    isCompleted
                      ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30"
                      : isUnlocked
                      ? "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8]/50 dark:hover:border-[#3B82F6]/50"
                      : "bg-[#F3F1EC] dark:bg-[#161C2A]/60 border-[#E5E2DC] dark:border-white/[0.06] opacity-70"
                  }`}
                >
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLesson(course.id, lesson.id)
                      }}
                      aria-label={
                        isCompleted
                          ? `Đánh dấu chưa hoàn thành ${lesson.title}`
                          : `Đánh dấu đã hoàn thành ${lesson.title}`
                      }
                      title={
                        isCompleted
                          ? "Đánh dấu chưa hoàn thành"
                          : "Đánh dấu đã hoàn thành"
                      }
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : "border border-[#D0CCC3] dark:border-white/[0.2] text-transparent hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8]"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div
                      className="mt-0.5 w-5 h-5 rounded-full bg-[#ECE9E2] dark:bg-[#1B2335] flex items-center justify-center shrink-0 text-[#64748B] dark:text-[#94A3B8]"
                      title={`Yêu cầu hoàn thành: ${prevLesson?.title}`}
                    >
                      <Lock className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    onClick={() => {
                      if (isUnlocked) {
                        handleLessonSelect(lesson.id)
                      } else {
                        useNotificationStore.getState().warning(
                          "Bài Học Đang Bị Khóa (Yêu Cầu Tiên Quyết)",
                          `Bạn cần hoàn thành bài học trước: "${
                            prevLesson?.title || "Bài trước"
                          }" để mở khóa bài học này.`
                        )
                      }
                    }}
                    className={`flex-1 min-w-0 ${
                      isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] mb-1">
                      <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                        Bài {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.duration}</span>
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-semibold leading-snug transition-colors ${
                        isCompleted
                          ? "text-[#475569] dark:text-[#94A3B8] line-through"
                          : isUnlocked
                          ? "text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8]"
                          : "text-[#64748B] dark:text-[#94A3B8]"
                      }`}
                    >
                      {lesson.title}
                    </h4>

                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {lesson.mitre && (
                        <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                          {lesson.mitre.split(" - ")[0]}
                        </span>
                      )}
                      {lesson.rfc && (
                        <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-blue-50/70 dark:bg-blue-500/10 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200/70 dark:border-blue-500/20">
                          {lesson.rfc.split(" · ")[0]}
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/25">
                          Yêu cầu Bài {idx}
                        </span>
                      )}
                    </div>
                  </div>

                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleLessonSelect(lesson.id)}
                      aria-label={`Mở bài học ${lesson.title}`}
                      className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors cursor-pointer"
                      title="Mở bài học"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Lock className="w-4 h-4 text-[#94A3B8] mt-1 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* TAB 2: CAPSTONE DEFENSE FORM & NIST NICE RUBRIC */}
        {activeTab === "rubric" && (
          <div className="space-y-4 text-xs">
            {/* Learning Outcomes */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
              <div className="flex items-center gap-2 font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                <ShieldCheck className="w-4 h-4" />
                <span>§01 Chuẩn Năng Lực Đầu Ra (NIST NICE Framework)</span>
              </div>
              <ul className="space-y-1.5 text-[#475569] dark:text-[#94A3B8] list-disc list-inside leading-relaxed font-sans">
                <li>Nhận diện chuẩn xác cơ chế kích hoạt lỗ hổng theo ma trận MITRE ATT&amp;CK.</li>
                <li>Phân tích và trích xuất bằng chứng khai thác (artifacts) từ hệ thống giám sát.</li>
                <li>Triển khai bản vá mã nguồn an toàn (Remediation) và cấu hình phòng thủ Hardening.</li>
                <li>Soạn thảo hồ sơ bảo vệ kỹ thuật đạt tối thiểu 80/100 điểm theo NIST Rubric.</li>
              </ul>
            </div>

            {/* Capstone Brief & Defense Form */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  <FileCheck2 className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                  <span>§02 Hồ Sơ Bảo Vệ Đồ Án Capstone</span>
                </div>
                {isCapstoneDone ? (
                  <span className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25">
                    ĐẠT CHUẨN NIST
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/25">
                    CHỜ BẢO VỆ
                  </span>
                )}
              </div>

              <p className="text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans text-xs bg-[#F3F1EC] dark:bg-[#161C2A] p-3 rounded-lg border border-[#E5E2DC] dark:border-white/[0.06]">
                {COURSE_CAPSTONES[course.id] ||
                  "Diễn tập đa tầng giả lập một sự cố an ninh mạng thực tế. Học viên hoàn thành chuỗi kiểm thử kết hợp thiết kế bản vá và báo cáo bảo vệ đồ án."}
              </p>

              {/* Show existing submission result card if submitted & not editing */}
              {courseSubmission && !isEditingCapstone && (
                <div className="space-y-3 p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08]">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isCapstoneDone
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      />
                      <span className="font-mono-tech font-bold text-xs text-[#0F172A] dark:text-[#F1F5F9]">
                        Tổng điểm Rubric: {courseSubmission.totalScore}/100 ({courseSubmission.status})
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono-tech px-2 py-0.5 rounded border ${
                        courseSubmission.syncedToBackend
                          ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                          : "bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border-blue-200 dark:border-blue-500/25"
                      }`}
                    >
                      {courseSubmission.syncedToBackend
                        ? "Đã đồng bộ Máy chủ"
                        : "Đã lưu Cục bộ (Offline)"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-tech text-[11px]">
                    <div className="p-2 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
                      <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Recon</span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        {courseSubmission.rubricReconScore ?? rubricScores.reconScore}/20
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
                      <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Exploit</span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        {courseSubmission.rubricExploitScore ?? rubricScores.exploitScore}/35
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
                      <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Remediation</span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        {courseSubmission.rubricRemediationScore ?? rubricScores.remediationScore}/30
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
                      <span className="text-[#64748B] dark:text-[#94A3B8] block text-[10px]">Reporting</span>
                      <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                        {courseSubmission.rubricReportScore ?? rubricScores.reportScore}/15
                      </span>
                    </div>
                  </div>

                  {courseSubmission.feedback && (
                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
                      {courseSubmission.feedback}
                    </p>
                  )}

                  {courseSubmission.solutionUrl && (
                    <div className="text-[11px] font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] truncate">
                      PoC / Repository:{" "}
                      <a
                        href={courseSubmission.solutionUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:opacity-80"
                      >
                        {courseSubmission.solutionUrl}
                      </a>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsEditingCapstone(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Cập nhật &amp; Nộp lại hồ sơ</span>
                  </button>
                </div>
              )}

              {/* Gate check: require 100% lessons completed OR allow viewing rubric */}
              {completedCount === totalCount && totalCount > 0 ? (
                (!courseSubmission || isEditingCapstone) && (
                  <form onSubmit={handleCapstoneSubmit} className="space-y-4">
                    {/* Report Content */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="capstone-report-content"
                        className="block text-[11px] font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
                      >
                        Báo cáo Kỹ thuật Bảo vệ Đồ án *
                      </label>
                      <textarea
                        id="capstone-report-content"
                        name="reportContent"
                        rows={4}
                        required
                        value={reportContent}
                        onChange={(e) => setReportContent(e.target.value)}
                        placeholder="Trình bày tóm tắt bề mặt tấn công, chuỗi khai thác đã tái hiện, mã lỗi CWE/MITRE và phương án vá lỗi kiến trúc..."
                        className="w-full rounded-lg px-3 py-2.5 text-xs font-sans bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#1D4ED8]/15"
                      />
                    </div>

                    {/* Solution URL */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="capstone-solution-url"
                        className="block text-[11px] font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
                      >
                        Liên kết Kho Mã nguồn / Báo cáo PoC
                      </label>
                      <input
                        id="capstone-solution-url"
                        name="solutionUrl"
                        type="url"
                        value={solutionUrl}
                        onChange={(e) => setSolutionUrl(e.target.value)}
                        placeholder="https://github.com/researcher/capstone-defense-report"
                        className="w-full rounded-lg px-3 py-2 text-xs font-mono-tech bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#1D4ED8]/15"
                      />
                    </div>

                    {/* 4 NIST NICE Rubric Sliders */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between font-mono-tech">
                        <span className="text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-wider">
                          Tự Đánh Giá Theo Rubric NIST NICE
                        </span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded border ${
                            totalRubricScore >= 80
                              ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                              : "bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/25"
                          }`}
                        >
                          Tổng: {totalRubricScore}/100 {totalRubricScore >= 80 ? "(Đạt)" : "(Cần >= 80)"}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {RUBRIC_CRITERIA.map((item) => {
                          const val = rubricScores[item.key]
                          return (
                            <div
                              key={item.key}
                              className="p-3 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <label
                                    htmlFor={item.id}
                                    className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] block"
                                  >
                                    {item.label}
                                  </label>
                                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-sans">
                                    {item.desc}
                                  </span>
                                </div>
                                <span className="font-mono-tech font-bold text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
                                  {val}/{item.max}
                                </span>
                              </div>
                              <input
                                id={item.id}
                                name={item.key}
                                type="range"
                                min={0}
                                max={item.max}
                                step={1}
                                value={val}
                                onChange={(e) =>
                                  handleScoreChange(item.key, item.max, e.target.value)
                                }
                                className="w-full accent-[#1D4ED8] dark:accent-[#3B82F6] cursor-pointer"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {formError && (
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      {courseSubmission && (
                        <button
                          type="button"
                          onClick={() => setIsEditingCapstone(false)}
                          className="px-3.5 py-2.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] hover:bg-[#ECE9E2] dark:hover:bg-[#1B2335] text-[#475569] dark:text-[#94A3B8] font-semibold text-xs border border-[#E5E2DC] dark:border-white/[0.08] cursor-pointer"
                        >
                          Hủy
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmittingCapstone}
                        className="flex-1 py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-55"
                      >
                        {isSubmittingCapstone ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Đang Thẩm Định Rubric NIST...</span>
                          </>
                        ) : (
                          <>
                            <FileCheck2 className="w-4 h-4" />
                            <span>Nộp Hồ Sơ Bảo Vệ Capstone</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] text-xs flex items-start gap-2.5">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#64748B] dark:text-[#94A3B8]" />
                    <div className="space-y-1">
                      <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                        Cần hoàn thành toàn bộ {totalCount} bài học để mở khóa biểu mẫu bảo vệ Capstone.
                      </p>
                      <p className="text-[11px]">
                        Hiện tại bạn đã hoàn thành {completedCount}/{totalCount} bài giảng trong học phần.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("syllabus")}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Quay lại danh sách bài học</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFICATE CONDITIONS & PUBLIC REGISTRY PORTAL */}
        {activeTab === "cert" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
              <div className="flex items-center gap-2 font-mono-tech font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                <Award className="w-4 h-4" />
                <span>Chứng Chỉ Số Xác Thực Bằng Mã Băm SHA-256 &amp; PGP</span>
              </div>
              <p className="text-[#475569] dark:text-[#94A3B8] leading-relaxed font-sans">
                Chứng chỉ số của học phần được băm SHA-256 và ký chữ ký số PGP công khai, cho phép đối chiếu trực tiếp tại cổng xác thực chứng chỉ quốc tế.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3 font-mono-tech">
              <div className="text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                Điều Kiện Đạt Chuẩn Cấp Chứng Chỉ
              </div>

              <div className="space-y-2">
                {/* Condition 1 */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                    {completedCount === totalCount && totalCount > 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span>1. Hoàn thành 100% bài giảng ({completedCount}/{totalCount})</span>
                  </div>
                  <span
                    className={`shrink-0 font-semibold ${
                      completedCount === totalCount && totalCount > 0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {completedCount === totalCount && totalCount > 0 ? "ĐẠT" : "CHƯA ĐẠT"}
                  </span>
                </div>

                {/* Condition 2 */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                    {courseQuizSummary?.meetsRequirement ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                    <span>
                      2. Điểm trắc nghiệm ({courseQuizSummary ? `${courseQuizSummary.averageScore}%` : "Tối thiểu 80%"})
                    </span>
                  </div>
                  <span
                    className={`shrink-0 font-semibold ${
                      courseQuizSummary?.meetsRequirement
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                    }`}
                  >
                    {courseQuizSummary
                      ? courseQuizSummary.meetsRequirement
                        ? `ĐẠT (${courseQuizSummary.averageScore}%)`
                        : `CHƯA ĐẠT (${courseQuizSummary.averageScore}%)`
                      : "KIỂM TRA SERVER"}
                  </span>
                </div>

                {/* Condition 3 */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                    {isCapstoneDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] shrink-0" />
                    )}
                    <span>3. Đồ án Capstone (NIST Rubric &gt;= 80)</span>
                  </div>
                  <span
                    className={`shrink-0 font-semibold ${
                      isCapstoneDone
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-[#64748B] dark:text-[#94A3B8]"
                    }`}
                  >
                    {isCapstoneDone ? "ĐÃ NGHIỆM THU" : "CHƯA ĐẠT"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              {courseCertificate ? (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/12 border border-emerald-200 dark:border-emerald-500/25 text-center font-mono-tech text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chứng chỉ số đã được cấp chính thức trên hệ thống</span>
                </div>
              ) : canClaimCertificate(course.id) ? (
                <button
                  type="button"
                  disabled={isClaimingCert}
                  onClick={async () => {
                    try {
                      await claimOfficialCertificate(course.id, course.backendId || course.id)
                    } catch {
                      // error toast already displayed by store
                    }
                  }}
                  className="w-full py-3 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-55"
                >
                  {isClaimingCert ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang Ký Số PGP &amp; Tạo Chứng Chỉ...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Yêu Cầu Xuất Chứng Chỉ Số PGP Ngay</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center font-sans text-xs text-[#475569] dark:text-[#94A3B8] flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    Hoàn thành 100% bài học, trắc nghiệm &gt;= 80% và nghiệm thu Đồ án Capstone để mở khóa cấp chứng chỉ.
                  </span>
                </div>
              )}
            </div>

            {/* Certificate Verification Display with Direct <Link to={`/verify/...`}> */}
            {courseCertificate && (
              <div className="p-4 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.09] space-y-3 shadow-xs">
                <div className="font-mono-tech font-semibold flex items-center justify-between gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                    <span>Văn Bằng Điện Tử Đã Ký Xác Thực</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/25">
                    VERIFIED ON REGISTRY
                  </span>
                </div>

                <p className="text-xs font-sans text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Chứng nhận hoàn thành chuyên đề{" "}
                  <strong className="text-[#0F172A] dark:text-[#F1F5F9]">
                    {courseCertificate.courseTitle || course.title}
                  </strong>{" "}
                  cấp cho nghiên cứu viên{" "}
                  <strong className="text-[#0F172A] dark:text-[#F1F5F9]">
                    {courseCertificate.recipientName || "Học viên CyberPath"}
                  </strong>
                  .
                </p>

                {/* Intentional dark cryptographic block for SHA-256 / PGP */}
                <div className="p-3 rounded-lg bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] font-mono-tech text-[11px] break-all select-all text-slate-200 space-y-1.5">
                  <div>
                    <span className="text-slate-400">SERIAL: </span>
                    <span className="text-sky-300 font-semibold">
                      {courseCertificate.certificateCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">SHA-256: </span>
                    <span className="text-emerald-300">
                      {courseCertificate.sha256Hash}
                    </span>
                  </div>
                  {courseCertificate.pgpSignature && (
                    <div className="text-[10px] text-slate-300 whitespace-pre-line pt-1 border-t border-white/[0.08] max-h-28 overflow-y-auto">
                      {courseCertificate.pgpSignature}
                    </div>
                  )}
                </div>

                {courseCertificate.certificateCode && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <Link
                      to={`/verify/${courseCertificate.certificateCode}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-xs transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở Cổng Xác Thực Chứng Chỉ (/verify)</span>
                    </Link>

                    <Link
                      to="/verify"
                      onClick={onClose}
                      className="text-[11px] font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                    >
                      Tra cứu sổ đăng ký →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====================================================================
          DRAWER FOOTER ACTIONS
         ==================================================================== */}
      <div className="px-6 py-4 border-t border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose()
              launchLessonLab(course.labId)
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs font-medium transition-colors cursor-pointer border border-[#E5E2DC] dark:border-white/[0.08]"
          >
            <Terminal className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
            <span>Mở Sandbox</span>
          </button>

          <button
            type="button"
            onClick={handleContinueStudy}
            className="flex-2 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Tiếp Tục Học Ngay</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function CourseSyllabusDrawer({ course, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !course) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-drawer-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 dark:bg-black/75 backdrop-blur-xs"
    >
      <DrawerContent key={course.id} course={course} onClose={onClose} />
    </div>,
    document.body
  )
}

export default CourseSyllabusDrawer
