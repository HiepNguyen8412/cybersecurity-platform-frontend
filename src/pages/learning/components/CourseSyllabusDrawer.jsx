import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
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
  Sparkles,
  Loader2,
  ExternalLink,
} from "lucide-react"
import useLearningStore from "../../../stores/useLearningStore"
import useNotificationStore from "../../../stores/useNotificationStore"

const COURSE_CAPSTONES = {
  "mod-web201": "Capstone Web: Khai thác liên hoàn Red Team - Đột nhập hạ tầng Microservices, trích xuất token IAM từ Cloud Metadata và bypass WAF để chiếm cờ root.",
  "mod-soc101": "Capstone SOC: Ứng phó sự cố APT thực tế - Phân tích tệp dump bộ nhớ RAM bằng Volatility, truy vết NTLM relay và tự động hóa Playbook SOAR cách ly mạng.",
  "mod-net101": "Capstone Network: Điều tra forensics mạng cấp doanh nghiệp - Trích xuất tệp nhị phân độc hại từ file PCAP 500MB và vô hiệu hóa kênh điều khiển ngầm DNS Exfiltration.",
  "mod-cloud201": "Capstone Cloud: Kubernetes Penetration & Hardening - Thực hiện container breakout từ pod hạn chế, leo thang quyền Cluster-Admin và vá triệt để bằng OPA Gatekeeper.",
  "mod-pwn301": "Capstone PWN: Xây dựng ROP Chain đa tầng - Bẻ gãy ASLR/DEP trên file thực thi Linux x86_64 stripped và thực thi shellcode giành quyền root.",
  "mod-crypto101": "Capstone Cryptography: Phá vỡ hạ tầng khóa PKI - Khai thác CBC Padding Oracle, khôi phục khóa RSA bằng Wiener Attack và phân tích bắt tay TLS 1.3.",
}

export function CourseSyllabusDrawer({ course, isOpen, onClose }) {
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
    submitCapstoneProject,
    claimOfficialCertificate,
    fetchCertificateForCourse,
  } = useLearningStore()

  const [activeTab, setActiveTab] = useState("syllabus") // "syllabus" | "rubric" | "cert"
  const [showCertClaimed, setShowCertClaimed] = useState(false)

  useEffect(() => {
    if (course?.backendId) {
      fetchQuizSummary(course.id, course.backendId)
      fetchCertificateForCourse(course.id, course.backendId)
    }
  }, [course, fetchQuizSummary, fetchCertificateForCourse])

  if (!isOpen || !course) return null

  const courseCompletedList = completedLessons[course.id] || []
  const completedCount = courseCompletedList.length
  const totalCount = course.syllabus?.length || 0
  const progressPercent = getCourseProgress(course.id)
  const isCapstoneDone = !!capstoneCompleted[course.id]
  const courseSubmission = capstoneSubmissions[course.id]
  const courseQuizSummary = quizSummaries[course.id]
  const courseCertificate = certificates[course.id]

  const handleLessonSelect = (lessonId) => {
    onClose()
    openLessonModal(course.id, lessonId)
  }

  const handleContinueStudy = () => {
    onClose()
    openLessonModal(course.id)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-cyan-500/20 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {course.code || "COURSE"}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
                {course.track || "Security Specialization"}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white leading-snug">
            {course.title}
          </h2>

          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-mono">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{course.duration}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center space-x-1 text-amber-400">
              <Award className="w-3.5 h-3.5" />
              <span>{course.cert || "Security Specialist"}</span>
            </span>
          </div>

          {/* Progress bar with Server Sync Telemetry */}
          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <div className="text-slate-400 flex items-center gap-1.5">
                <span>Tiến độ thực chiến:</span>
                {syncStatus === "syncing" && (
                  <span className="text-[10px] text-cyan-400 animate-pulse font-normal">
                    (Đang lưu máy chủ...)
                  </span>
                )}
                {syncStatus === "synced" && (
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Đã lưu máy chủ</span>
                  </span>
                )}
                {syncStatus === "error" && (
                  <button
                    type="button"
                    onClick={() => retrySync(course.id)}
                    title={syncError || "Lỗi kết nối máy chủ - Bấm để đồng bộ lại"}
                    className="text-[10px] text-rose-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3 text-rose-400" />
                    <span>Lỗi đồng bộ (Thử lại)</span>
                  </button>
                )}
              </div>
              <span className="text-cyan-400 font-bold">{progressPercent}% ({completedCount}/{totalCount} bài)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-800/60 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("syllabus")}
              className={`pb-1.5 px-2 font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "syllabus"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Bài Học ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rubric")}
              className={`pb-1.5 px-2 font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "rubric"
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Mục Tiêu & Rubric
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cert")}
              className={`pb-1.5 px-2 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === "cert"
                  ? "border-amber-400 text-amber-300"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Chứng Chỉ</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            TAB CONTENT
           ==================================================================== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin">
          {/* TAB 1: SYLLABUS LESSONS */}
          {activeTab === "syllabus" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Giáo trình bài giảng & Phòng Lab ({totalCount} Bài Học)
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  Mở bài theo thứ tự tiên quyết
                </span>
              </div>

              {course.syllabus?.map((lesson, idx) => {
                const isCompleted = courseCompletedList.includes(lesson.id)
                const isUnlocked = isLessonUnlocked(course.id, idx)
                const prevLesson = idx > 0 ? course.syllabus[idx - 1] : null

                return (
                  <div
                    key={lesson.id || idx}
                    className={`p-3.5 rounded-xl border transition-all flex items-start space-x-3 group relative ${
                      isCompleted
                        ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50"
                        : isUnlocked
                        ? "bg-slate-950/50 border-cyan-500/40 hover:bg-slate-800/40"
                        : "bg-slate-950/30 border-slate-800/60 opacity-60"
                    }`}
                  >
                    {/* Toggle Completion Button or Lock Icon */}
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleLesson(course.id, lesson.id)
                        }}
                        title={isCompleted ? "Đánh dấu chưa hoàn thành" : "Đánh dấu đã hoàn thành"}
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500 text-slate-950"
                            : "border border-slate-600 text-transparent hover:border-cyan-400 hover:text-cyan-400"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <div
                        className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-500"
                        title={`Yêu cầu hoàn thành: ${prevLesson?.title}`}
                      >
                        <Lock className="w-3 h-3" />
                      </div>
                    )}

                    {/* Lesson Info Clickable */}
                    <div
                      onClick={() => {
                        if (isUnlocked) {
                          handleLessonSelect(lesson.id)
                        } else {
                          useNotificationStore.getState().warning(
                            "Bài Học Đang Bị Khóa (Prerequisite Required)",
                            `Bạn cần hoàn thành bài học trước: "${prevLesson?.title || 'Bài trước'}" để mở khóa bài học này.`
                          )
                        }
                      }}
                      className={`flex-1 min-w-0 ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span className="text-cyan-400/90 font-bold">Bài {String(idx + 1).padStart(2, "0")}</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{lesson.duration}</span>
                        </span>
                      </div>
                      <h4 className={`text-sm font-semibold leading-snug transition-colors ${
                        isCompleted
                          ? "text-slate-300 line-through opacity-75"
                          : isUnlocked
                          ? "text-white group-hover:text-cyan-400"
                          : "text-slate-400"
                      }`}>
                        {lesson.title}
                      </h4>
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        {lesson.mitre && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800/80 text-amber-300 border border-slate-700">
                            {lesson.mitre.split(" - ")[0]}
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-900/40">
                            Yêu Cầu Bài {idx}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Open icon arrow */}
                    {isUnlocked ? (
                      <button
                        onClick={() => handleLessonSelect(lesson.id)}
                        className="p-1 rounded text-slate-500 group-hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Mở bài học"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB 2: OUTCOMES & LAB RUBRICS */}
          {activeTab === "rubric" && (
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              {/* Learning Outcomes */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-mono font-bold text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mục Tiêu Năng Lực Đầu Ra (NIST NICE Standards)</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  <li>Nhận diện chuẩn xác cơ chế kích hoạt lỗ hổng theo ma trận MITRE ATT&CK.</li>
                  <li>Phân tích và trích xuất bằng chứng khai thác (artifacts) từ hệ thống giám sát.</li>
                  <li>Viết mã nguồn vá lỗi an toàn (Remediation) và áp dụng cấu hình Hardening.</li>
                  <li>Soạn thảo tài liệu báo cáo kỹ thuật và kiểm thử xâm nhập chuẩn nghiệp vụ.</li>
                </ul>
              </div>

              {/* Lab Evaluation Rubric */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between font-mono font-bold text-amber-300">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Rubric Chấm Điểm Phòng Lab Thực Chiến</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Thang 100 Điểm</span>
                </div>

                <div className="space-y-2 font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">1. Trinh Sát & Phân Tích Bề Mặt (Recon)</div>
                      <div className="text-[11px] text-slate-400 font-sans">Thu thập thông tin mục tiêu, nhận diện version, port</div>
                    </div>
                    <span className="font-bold text-cyan-400">20%</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">2. Khai Thác & Vượt Rào (Exploitation)</div>
                      <div className="text-[11px] text-slate-400 font-sans">Chiếm quyền thực thi và trích xuất Flag nghiệm thu</div>
                    </div>
                    <span className="font-bold text-amber-400">35%</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">3. Bản Vá An Toàn (Remediation)</div>
                      <div className="text-[11px] text-slate-400 font-sans">Triển khai code vá lỗi và siết chặt rule phòng thủ</div>
                    </div>
                    <span className="font-bold text-emerald-400">30%</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">4. Báo Cáo Kỹ Thuật (Reporting)</div>
                      <div className="text-[11px] text-slate-400 font-sans">Tài liệu hóa quy trình và đề xuất kiến trúc lâu dài</div>
                    </div>
                    <span className="font-bold text-blue-400">15%</span>
                  </div>
                </div>
              </div>

              {/* Capstone Project Card for this Track */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between font-mono font-bold text-cyan-400">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Đồ Án Tốt Nghiệp Capstone Cuối Lộ Trình</span>
                  </div>
                  {isCapstoneDone ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ĐÃ VƯỢT QUA
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      CHỜ NGHIỆM THU
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {COURSE_CAPSTONES[course.id] || "Diễn tập đa tầng giả lập một cuộc tấn công mạng thực tế. Học viên hoàn thành toàn bộ chuỗi tấn công (Kill Chain) kết hợp cấu hình hệ thống phòng thủ."}
                </p>

                {completedCount === totalCount && totalCount > 0 ? (
                  !isCapstoneDone ? (
                    <button
                      type="button"
                      disabled={isSubmittingCapstone}
                      onClick={async () => {
                        try {
                          await submitCapstoneProject(course.id, course.backendId || course.id)
                        } catch {
                          // toast shown
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {isSubmittingCapstone ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang Thẩm Định Rubric NIST...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck2 className="w-4 h-4" />
                          <span>Nộp Báo Cáo & Thẩm Định Capstone</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>
                        {courseSubmission
                          ? `Đồ án đạt ${courseSubmission.totalScore}/100 theo Rubric NIST NICE (${courseSubmission.status}).`
                          : "Đồ án đã được thẩm định ĐẠT theo Rubric NIST NICE."}
                      </span>
                    </div>
                  )
                ) : (
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono text-center">
                    🔒 Cần hoàn thành toàn bộ {totalCount} bài học trước khi mở khóa thẩm định Capstone.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATE CONDITIONS */}
          {activeTab === "cert" && (
            <div className="space-y-4 text-xs animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 font-mono font-bold text-amber-400">
                  <Award className="w-5 h-5" />
                  <span className="text-sm">Chứng Chỉ Số Xác Thực Bằng Mã Băm PGP</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">
                  Chứng chỉ số của nền tảng được mã hóa và xác thực chữ ký số công khai, có mã tra cứu chính quy đính kèm hồ sơ năng lực của học viên.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Điều Kiện Đạt Chuẩn Cấp Chứng Chỉ:
                </div>

                <div className="space-y-2">
                  {/* Condition 1 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      {completedCount === totalCount && totalCount > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      )}
                      <span>1. Hoàn thành 100% bài giảng ({completedCount}/{totalCount} bài)</span>
                    </div>
                    <span className={completedCount === totalCount && totalCount > 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {completedCount === totalCount && totalCount > 0 ? "ĐẠT (DATABASE)" : "CHƯA ĐẠT"}
                    </span>
                  </div>

                  {/* Condition 2 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      {courseQuizSummary?.meetsRequirement ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                      )}
                      <span>
                        2. Điểm trắc nghiệm ({courseQuizSummary ? `${courseQuizSummary.averageScore}%` : ">= 80%"})
                      </span>
                    </div>
                    <span className={courseQuizSummary?.meetsRequirement ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                      {courseQuizSummary
                        ? courseQuizSummary.meetsRequirement
                          ? `ĐẠT (${courseQuizSummary.averageScore}%)`
                          : `CHƯA ĐẠT (${courseQuizSummary.averageScore}%)`
                        : "KIỂM TRA SERVER"}
                    </span>
                  </div>

                  {/* Condition 3 */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 text-slate-300">
                      {isCapstoneDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-500" />
                      )}
                      <span>3. Đồ án Capstone Tác Chiến</span>
                    </div>
                    <span className={isCapstoneDone ? "text-emerald-400 font-bold" : "text-slate-500"}>
                      {isCapstoneDone ? "ĐÃ NGHIỆM THU" : "CHƯA NỘP"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {courseCertificate ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center font-mono text-emerald-300 text-xs font-bold">
                    ✓ Chứng chỉ số đã được cấp chính thức trên hệ thống
                  </div>
                ) : canClaimCertificate(course.id) ? (
                  <button
                    type="button"
                    disabled={isClaimingCert}
                    onClick={async () => {
                      try {
                        await claimOfficialCertificate(course.id, course.backendId || course.id)
                        setShowCertClaimed(true)
                      } catch {
                        // error shown
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {isClaimingCert ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang Ký Số PGP & Tạo Chứng Chỉ...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span>Yêu Cầu Xuất Chứng Chỉ Số PGP Ngay</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center font-mono text-[11px] text-slate-400">
                    🔒 Cần hoàn thành 100% bài học, trắc nghiệm &gt;= 80% và nghiệm thu Đồ án Capstone để mở khóa cấp chứng chỉ.
                  </div>
                )}
              </div>

              {/* Certificate Verification Display */}
              {(courseCertificate || showCertClaimed) && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 font-mono text-xs space-y-2.5 animate-in zoom-in-95">
                  <div className="font-bold flex items-center justify-between text-amber-300">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>CHỨNG CHỈ SỐ ĐÃ ĐƯỢC KÝ XÁC THỰC</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      VERIFIED ON REGISTRY
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-black/60 border border-amber-500/30 text-[10px] break-all select-all text-amber-300/90 space-y-1">
                    <div>MÃ: {courseCertificate?.certificateCode || `CERT-CYBER-2026-${course.code || "SEC"}-9812A`}</div>
                    <div>SHA256: {courseCertificate?.sha256Hash || "7e2d9a1c5b8823f990141eabf80b2401f89921c4e7"}</div>
                    <div className="text-[9px] text-amber-400/80 font-mono whitespace-pre-line mt-1 max-h-24 overflow-y-auto">
                      {courseCertificate?.pgpSignature || "-----BEGIN PGP SIGNATURE-----\nwsBzBAEBCAAGBQJk...\n-----END PGP SIGNATURE-----"}
                    </div>
                  </div>
                  <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                    Chứng nhận hoàn thành chuyên đề <strong>{courseCertificate?.courseTitle || course.title}</strong> cho học viên <strong>{courseCertificate?.recipientName || "Học Viên"}</strong>.
                  </p>
                  {courseCertificate?.certificateCode && (
                    <a
                      href={`/api/certificates/verify/${courseCertificate.certificateCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Tra cứu xác thực công khai (API Registry)</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/70 space-y-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                onClose()
                launchLessonLab(course.labId)
              }}
              className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors cursor-pointer border border-slate-700"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bật Sandbox</span>
            </button>

            <button
              onClick={handleContinueStudy}
              className="flex-2 flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Tiếp Tục Học Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}

export default CourseSyllabusDrawer
