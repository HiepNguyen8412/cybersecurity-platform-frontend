import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Search,
  X,
  Save,
  RefreshCw,
  Layers,
  ClipboardCheck,
  ExternalLink,
  BookOpen,
  FileCheck2,
  Trash2,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Badge, Button } from "../../components/common"
import {
  ADMIN_COURSES_CATALOG,
  ADMIN_CAPSTONE_SUBMISSIONS,
} from "./data/adminMockData"
import courseService from "../../services/courseService"
import api, { parseApiError } from "../../services/api"
import useNotificationStore from "../../stores/useNotificationStore"

const TRACK_OPTIONS = [
  "Phòng thủ Ứng dụng Web",
  "Vận hành SOC & Giám sát SIEM",
  "Điều tra Mạng & Gói tin",
  "Bảo mật Đám mây & Hạ tầng",
]

const LEVEL_TO_BACKEND = {
  "Cơ bản": "BEGINNER",
  "Trung cấp": "MEDIUM",
  "Nâng cao": "HARD",
  "Chuyên gia": "HARD",
}

function mapDifficultyToLevel(difficulty) {
  switch (String(difficulty || "").toUpperCase()) {
    case "BEGINNER":
    case "EASY":
      return "Cơ bản"
    case "HARD":
    case "ADVANCED":
      return "Nâng cao"
    case "EXPERT":
      return "Chuyên gia"
    default:
      return "Trung cấp"
  }
}

function mapDifficultyToCvss(difficulty) {
  switch (String(difficulty || "").toUpperCase()) {
    case "HARD":
    case "ADVANCED":
      return "9.0 NGHIÊM TRỌNG"
    case "BEGINNER":
    case "EASY":
      return "5.4 TRUNG BÌNH"
    default:
      return "7.5 CAO"
  }
}

function mapDifficultyToTrack(difficulty) {
  switch (String(difficulty || "").toUpperCase()) {
    case "BEGINNER":
      return "Phòng thủ Ứng dụng Web"
    case "HARD":
      return "Bảo mật Đám mây & Hạ tầng"
    default:
      return "Vận hành SOC & Giám sát SIEM"
  }
}

const mapBackendCourse = (c) => ({
  id: c.id,
  isBackendRecord: true,
  code: c.slug ? c.slug.toUpperCase().slice(0, 8) : `KH-${c.id}`,
  title: c.title,
  slug: c.slug || `khoa-hoc-${c.id}`,
  description: c.description || "Giáo trình an toàn thông tin chuyên sâu theo chuẩn NIST NICE.",
  track: mapDifficultyToTrack(c.difficulty),
  level: mapDifficultyToLevel(c.difficulty),
  difficulty: c.difficulty || "MEDIUM",
  cvssBase: mapDifficultyToCvss(c.difficulty),
  status: c.published ? "published" : "draft",
  lessonsCount: 6,
  enrolledCount: 24,
  updatedAt: new Date().toLocaleDateString("vi-VN"),
  modules: [],
})

function isSafeHttpUrl(url) {
  if (!url || typeof url !== "string") return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

function formatDateTime(value) {
  if (!value) return "Chưa có dữ liệu"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString("vi-VN")
}

function getCapstoneStatusMeta(status) {
  switch (String(status || "").toUpperCase()) {
    case "PASSED":
      return { label: "Đạt chuẩn NIST", variant: "success", dot: "bg-emerald-500" }
    case "REJECTED":
      return { label: "Cần bổ sung", variant: "danger", dot: "bg-rose-500" }
    default:
      return { label: "Chờ thẩm định", variant: "warning", dot: "bg-amber-500" }
  }
}

const EMPTY_COURSE_FORM = {
  code: "SEC-305",
  slug: "",
  title: "",
  description: "",
  track: "Phòng thủ Ứng dụng Web",
  level: "Trung cấp",
  cvssBase: "7.5 CAO",
  status: "published",
  lessonsCount: 6,
}

export function AdminCourses() {
  const [activeTab, setActiveTab] = useState("courses")

  // Danh sách khóa học & học phần
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLiveCourses, setIsLiveCourses] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  // Modal tạo / chỉnh sửa khóa học
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [savingCourse, setSavingCourse] = useState(false)
  const [formData, setFormData] = useState(EMPTY_COURSE_FORM)

  // Ngăn kéo quản lý học phần (Modules Drawer)
  const [modulesCourse, setModulesCourse] = useState(null)
  const [courseModules, setCourseModules] = useState([])
  const [loadingModules, setLoadingModules] = useState(false)
  const [savingModule, setSavingModule] = useState(false)
  const [newModuleForm, setNewModuleForm] = useState({
    title: "",
    description: "",
    position: 1,
  })

  // Hàng đợi thẩm định Đồ án Capstone (NIST Rubric Review)
  const [capstoneQueue, setCapstoneQueue] = useState(ADMIN_CAPSTONE_SUBMISSIONS)
  const [capstoneSearch, setCapstoneSearch] = useState("")
  const [capstoneStatusFilter, setCapstoneStatusFilter] = useState("all")
  const [activeSubmission, setActiveSubmission] = useState(null)
  const [evaluatingCapstone, setEvaluatingCapstone] = useState(false)
  const [rubricForm, setRubricForm] = useState({
    submissionId: "",
    rubricReconScore: 16,
    rubricExploitScore: 28,
    rubricRemediationScore: 24,
    rubricReportScore: 12,
    feedback: "",
  })

  const fetchCoursesCatalog = useCallback(async () => {
    const res = await courseService.getCourses()
    if (res.success && res.data) {
      const items = Array.isArray(res.data) ? res.data : res.data.content || []
      if (items.length > 0) {
        return { items: items.map(mapBackendCourse), isLive: true }
      }
    }
    return { items: ADMIN_COURSES_CATALOG, isLive: false }
  }, [])

  const loadCourses = useCallback(async () => {
    setLoading(true)
    try {
      const { items, isLive } = await fetchCoursesCatalog()
      setCourses(items)
      setIsLiveCourses(isLive)
    } catch {
      setCourses(ADMIN_COURSES_CATALOG)
      setIsLiveCourses(false)
    } finally {
      setLoading(false)
    }
  }, [fetchCoursesCatalog])

  useEffect(() => {
    let ignore = false
    async function initCourses() {
      try {
        const { items, isLive } = await fetchCoursesCatalog()
        if (!ignore) {
          setCourses(items)
          setIsLiveCourses(isLive)
        }
      } catch {
        if (!ignore) {
          setCourses(ADMIN_COURSES_CATALOG)
          setIsLiveCourses(false)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    initCourses()
    return () => {
      ignore = true
    }
  }, [fetchCoursesCatalog])

  const filteredCourses = courses.filter((c) => {
    const query = searchQuery.trim().toLowerCase()
    const matchSearch =
      !query ||
      c.title.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query) ||
      c.track.toLowerCase().includes(query)
    const matchLevel = levelFilter === "all" || c.level === levelFilter
    return matchSearch && matchLevel
  })

  const filteredCapstones = capstoneQueue.filter((sub) => {
    const query = capstoneSearch.trim().toLowerCase()
    const matchSearch =
      !query ||
      String(sub.id).includes(query) ||
      (sub.learnerName || sub.username || "").toLowerCase().includes(query) ||
      (sub.courseTitle || "").toLowerCase().includes(query)
    const matchStatus =
      capstoneStatusFilter === "all" || sub.status === capstoneStatusFilter
    return matchSearch && matchStatus
  })

  const pendingCapstoneCount = capstoneQueue.filter((s) => s.status === "SUBMITTED").length
  const passedCapstoneCount = capstoneQueue.filter((s) => s.status === "PASSED").length
  const rejectedCapstoneCount = capstoneQueue.filter((s) => s.status === "REJECTED").length

  const handleOpenEditCourse = (course) => {
    setSelectedCourse(course)
    setFormData({
      code: course.code || "",
      slug: course.slug || "",
      title: course.title || "",
      description: course.description || "",
      track: course.track || TRACK_OPTIONS[0],
      level: course.level || "Trung cấp",
      cvssBase: course.cvssBase || "7.5 CAO",
      status: course.status || "published",
      lessonsCount: course.lessonsCount || 6,
    })
    setIsCourseModalOpen(true)
  }

  const handleOpenCreateCourse = () => {
    setSelectedCourse(null)
    setFormData({ ...EMPTY_COURSE_FORM })
    setIsCourseModalOpen(true)
  }

  const handleSaveCourse = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    setSavingCourse(true)

    const generatedSlug =
      formData.slug.trim() ||
      formData.code.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      `khoa-hoc-${Date.now().toString().slice(-4)}`
    const backendDifficulty = LEVEL_TO_BACKEND[formData.level] || "MEDIUM"

    try {
      if (selectedCourse?.isBackendRecord && isLiveCourses) {
        const res = await api.put(`/courses/${selectedCourse.id}`, {
          title: formData.title.trim(),
          slug: generatedSlug,
          description: formData.description.trim() || selectedCourse.description,
          difficulty: backendDifficulty,
          published: formData.status === "published",
        })
        if (res.data) {
          setCourses((prev) =>
            prev.map((c) =>
              c.id === selectedCourse.id
                ? {
                    ...c,
                    ...formData,
                    slug: res.data.slug || generatedSlug,
                    updatedAt: new Date().toLocaleDateString("vi-VN"),
                  }
                : c
            )
          )
          useNotificationStore.getState().success(
            "Đã cập nhật khóa học lên máy chủ",
            `Thông tin giáo trình "${formData.title}" đã được đồng bộ.`
          )
          setIsCourseModalOpen(false)
          return
        }
      }

      if (!selectedCourse && isLiveCourses) {
        const res = await api.post("/courses", {
          title: formData.title.trim(),
          slug: generatedSlug,
          description: formData.description.trim() || `Giáo trình chuyên đề ${formData.track}`,
          difficulty: backendDifficulty,
          published: formData.status === "published",
        })
        if (res.data) {
          await loadCourses()
          useNotificationStore.getState().success(
            "Đã tạo khóa học mới trên máy chủ",
            `Khóa học "${formData.title}" đã được khởi tạo.`
          )
          setIsCourseModalOpen(false)
          return
        }
      }
    } catch {
      // Fallback sang cập nhật cục bộ nếu ngoại tuyến hoặc không đủ quyền backend
    } finally {
      setSavingCourse(false)
    }

    if (selectedCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, ...formData, updatedAt: new Date().toLocaleDateString("vi-VN") }
            : c
        )
      )
      useNotificationStore.getState().success(
        "Cập nhật khóa học thành công",
        `Đã lưu thay đổi cho khóa học "${formData.title}".`
      )
    } else {
      const newCourse = {
        ...formData,
        id: `course-${Date.now().toString().slice(-4)}`,
        slug: generatedSlug,
        enrolledCount: 0,
        updatedAt: new Date().toLocaleDateString("vi-VN"),
        modules: [],
      }
      setCourses((prev) => [newCourse, ...prev])
      useNotificationStore.getState().success(
        "Thêm khóa học mới thành công",
        `Khóa học "${newCourse.title}" đã được thêm vào danh mục.`
      )
    }
    setIsCourseModalOpen(false)
  }

  // Mở ngăn kéo quản lý Học phần (Modules)
  const handleOpenModulesDrawer = async (course) => {
    setModulesCourse(course)
    setLoadingModules(true)
    setNewModuleForm({
      title: "",
      description: "",
      position: (course.modules?.length || 0) + 1,
    })

    if (course.isBackendRecord && typeof course.id === "number") {
      try {
        const res = await courseService.getModulesByCourseId(course.id)
        if (res.success && Array.isArray(res.data)) {
          setCourseModules(res.data)
          setNewModuleForm({
            title: "",
            description: "",
            position: res.data.length + 1,
          })
          setLoadingModules(false)
          return
        }
      } catch {
        // Fallback xuống danh sách học phần cục bộ
      }
    }

    const fallbackList = course.modules || []
    setCourseModules(fallbackList)
    setNewModuleForm({
      title: "",
      description: "",
      position: fallbackList.length + 1,
    })
    setLoadingModules(false)
  }

  const handleAddModule = async (e) => {
    e.preventDefault()
    if (!modulesCourse || !newModuleForm.title.trim()) return
    setSavingModule(true)

    const payload = {
      title: newModuleForm.title.trim(),
      description: newModuleForm.description.trim() || "Nội dung chuyên đề và bài tập thực hành.",
      position: Math.max(1, Number(newModuleForm.position) || courseModules.length + 1),
    }

    try {
      if (modulesCourse.isBackendRecord && typeof modulesCourse.id === "number" && isLiveCourses) {
        const res = await api.post(`/courses/${modulesCourse.id}/modules`, payload)
        if (res.data) {
          const updated = [...courseModules, res.data].sort((a, b) => a.position - b.position)
          setCourseModules(updated)
          setNewModuleForm({ title: "", description: "", position: updated.length + 1 })
          useNotificationStore.getState().success(
            "Đã thêm học phần mới",
            `Học phần "${payload.title}" đã được lưu vào khóa học.`
          )
          return
        }
      }
    } catch {
      // Fallback sang cục bộ
    } finally {
      setSavingModule(false)
    }

    const localMod = {
      id: Date.now(),
      courseId: modulesCourse.id,
      ...payload,
    }
    const nextModules = [...courseModules, localMod].sort((a, b) => a.position - b.position)
    setCourseModules(nextModules)
    setCourses((prev) =>
      prev.map((c) => (c.id === modulesCourse.id ? { ...c, modules: nextModules } : c))
    )
    setNewModuleForm({ title: "", description: "", position: nextModules.length + 1 })
    useNotificationStore.getState().success(
      "Đã thêm học phần mới",
      `Học phần "${localMod.title}" đã được ghi nhận trong giáo trình.`
    )
  }

  const handleDeleteModule = async (mod) => {
    try {
      if (modulesCourse?.isBackendRecord && typeof mod.id === "number" && isLiveCourses) {
        await api.delete(`/modules/${mod.id}`)
      }
    } catch {
      // Vẫn xóa khỏi danh sách hiển thị nếu chế độ mẫu
    }
    const nextModules = courseModules.filter((m) => m.id !== mod.id)
    setCourseModules(nextModules)
    if (modulesCourse) {
      setCourses((prev) =>
        prev.map((c) => (c.id === modulesCourse.id ? { ...c, modules: nextModules } : c))
      )
    }
    useNotificationStore.getState().warning(
      "Đã gỡ học phần",
      `Học phần "${mod.title}" đã được xóa khỏi cấu trúc khóa học.`
    )
  }

  // Mở ngăn kéo thẩm định Capstone NIST Rubric
  const handleOpenCapstoneReview = (submission = null) => {
    if (submission) {
      setActiveSubmission(submission)
      setRubricForm({
        submissionId: String(submission.id),
        rubricReconScore: submission.rubricReconScore ?? 16,
        rubricExploitScore: submission.rubricExploitScore ?? 28,
        rubricRemediationScore: submission.rubricRemediationScore ?? 24,
        rubricReportScore: submission.rubricReportScore ?? 12,
        feedback: submission.feedback || "",
      })
    } else {
      const manualStub = {
        id: "",
        courseTitle: "Thẩm định trực tiếp theo Mã hồ sơ máy chủ",
        learnerName: "Học viên nộp trên hệ thống",
        username: "submission-direct",
        solutionUrl: "",
        reportContent:
          "Nhập chính xác Mã hồ sơ (Submission ID) từ cơ sở dữ liệu máy chủ để gửi kết quả chấm điểm NIST NICE Rubric qua API POST /api/courses/capstone/{submissionId}/evaluate.",
        status: "SUBMITTED",
        isManualLookup: true,
      }
      setActiveSubmission(manualStub)
      setRubricForm({
        submissionId: "",
        rubricReconScore: 18,
        rubricExploitScore: 30,
        rubricRemediationScore: 26,
        rubricReportScore: 13,
        feedback: "",
      })
    }
  }

  const calculatedTotalScore =
    Number(rubricForm.rubricReconScore || 0) +
    Number(rubricForm.rubricExploitScore || 0) +
    Number(rubricForm.rubricRemediationScore || 0) +
    Number(rubricForm.rubricReportScore || 0)

  const isPassingScore = calculatedTotalScore >= 80

  const handleInsertFeedbackTemplate = () => {
    const template = isPassingScore
      ? `Hồ sơ đồ án đạt chuẩn Rubric NIST NICE (${calculatedTotalScore}/100 điểm). Phân tích bề mặt tấn công đầy đủ, bằng chứng khai thác có kiểm soát và đề xuất vá lỗi khả thi.`
      : `Hồ sơ hiện đạt ${calculatedTotalScore}/100 điểm (yêu cầu tối thiểu 80/100). Vui lòng bổ sung chi tiết phân tích nguyên nhân gốc rễ và bằng chứng kiểm thử hồi quy sau khi vá lỗi.`
    setRubricForm((prev) => ({ ...prev, feedback: template }))
  }

  const handleSubmitCapstoneEvaluation = async (e) => {
    e.preventDefault()
    const targetId = String(rubricForm.submissionId || activeSubmission?.id || "").trim()
    if (!targetId) {
      useNotificationStore.getState().warning(
        "Thiếu mã hồ sơ Capstone",
        "Vui lòng nhập Mã hồ sơ (Submission ID) hợp lệ trước khi gửi đánh giá."
      )
      return
    }

    const payload = {
      rubricReconScore: Math.min(20, Math.max(0, Number(rubricForm.rubricReconScore) || 0)),
      rubricExploitScore: Math.min(35, Math.max(0, Number(rubricForm.rubricExploitScore) || 0)),
      rubricRemediationScore: Math.min(30, Math.max(0, Number(rubricForm.rubricRemediationScore) || 0)),
      rubricReportScore: Math.min(15, Math.max(0, Number(rubricForm.rubricReportScore) || 0)),
      feedback:
        rubricForm.feedback.trim() ||
        (isPassingScore
          ? `Đạt chuẩn NIST NICE (${calculatedTotalScore}/100 điểm).`
          : `Chưa đạt ngưỡng chuẩn (${calculatedTotalScore}/100 điểm). Cần bổ sung tài liệu khắc phục.`),
    }

    setEvaluatingCapstone(true)
    try {
      const response = await api.post(`/courses/capstone/${targetId}/evaluate`, payload)
      const evaluated = response.data
      setCapstoneQueue((prev) => {
        const exists = prev.some((item) => String(item.id) === String(evaluated.id))
        if (exists) {
          return prev.map((item) =>
            String(item.id) === String(evaluated.id)
              ? { ...item, ...evaluated, isMockSample: false }
              : item
          )
        }
        return [{ ...evaluated, isMockSample: false }, ...prev]
      })
      useNotificationStore.getState().success(
        "Đã ghi nhận thẩm định NIST Rubric",
        `Hồ sơ #${evaluated.id} đạt ${evaluated.totalScore}/100 điểm (${
          evaluated.status === "PASSED" ? "ĐẠT CHUẨN" : "CẦN BỔ SUNG"
        }).`
      )
      setActiveSubmission(null)
    } catch (err) {
      const httpStatus = err?.response?.status
      if (httpStatus === 401 || httpStatus === 403 || httpStatus === 400) {
        useNotificationStore.getState().error(
          "Không thể lưu kết quả thẩm định",
          parseApiError(err)
        )
        return
      }

      if (activeSubmission?.isManualLookup && httpStatus === 404) {
        useNotificationStore.getState().error(
          "Không tìm thấy hồ sơ trên máy chủ",
          `Mã hồ sơ Capstone #${targetId} chưa tồn tại trong cơ sở dữ liệu.`
        )
        return
      }

      // Fallback mượt mà cho hàng đợi mẫu khi máy chủ ngoại tuyến
      const nextStatus = calculatedTotalScore >= 80 ? "PASSED" : "REJECTED"
      const nowIso = new Date().toISOString()
      setCapstoneQueue((prev) =>
        prev.map((item) =>
          String(item.id) === String(targetId)
            ? {
                ...item,
                ...payload,
                totalScore: calculatedTotalScore,
                status: nextStatus,
                evaluatedAt: nowIso,
              }
            : item
        )
      )
      useNotificationStore.getState().success(
        "Đã thẩm định trên hàng đợi mẫu ngoại tuyến",
        `Hồ sơ #${targetId} ghi nhận ${calculatedTotalScore}/100 điểm (${
          nextStatus === "PASSED" ? "Đạt chuẩn" : "Cần bổ sung"
        }).`
      )
      setActiveSubmission(null)
    } finally {
      setEvaluatingCapstone(false)
    }
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <AdminHeader
        title="Quản trị Khóa học, Học phần & Thẩm định Capstone"
        subtitle="Quản lý danh mục giáo trình, cấu trúc học phần chuyên đề và chấm điểm đồ án Capstone theo khung chuẩn NIST NICE."
        statusLabel={isLiveCourses ? "ĐỒNG BỘ GIÁO TRÌNH TRỰC TIẾP" : "GIÁO TRÌNH MẪU NGOẠI TUYẾN"}
        statusTone={isLiveCourses ? "operational" : "sample"}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={loadCourses}
              disabled={loading}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Làm mới
            </Button>
            {activeTab === "courses" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateCourse}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Thêm khóa học mới
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenCapstoneReview(null)}
                leftIcon={<ClipboardCheck className="h-3.5 w-3.5" />}
              >
                Thẩm định theo Mã hồ sơ
              </Button>
            )}
          </div>
        }
      />

      {/* Thanh chuyển đổi 2 phân khu: Khóa học & Học phần / Thẩm định Capstone */}
      <div
        role="tablist"
        aria-label="Phân khu quản trị đào tạo"
        className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "courses"}
          onClick={() => setActiveTab("courses")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === "courses"
              ? "bg-[#FFFFFF] dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC] dark:border-white/[0.08] font-semibold"
              : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-transparent"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Khóa học & Học phần ({courses.length})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "capstone"}
          onClick={() => setActiveTab("capstone")}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === "capstone"
              ? "bg-[#FFFFFF] dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC] dark:border-white/[0.08] font-semibold"
              : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-transparent"
          }`}
        >
          <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Thẩm định Đồ án Capstone (NIST Rubric)</span>
          {pendingCapstoneCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-tech font-semibold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
              {pendingCapstoneCount}
            </span>
          )}
        </button>
      </div>

      {/* ====================================================================
          TAB 1: QUẢN TRỊ KHÓA HỌC & HỌC PHẦN (MODULES)
         ==================================================================== */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden="true" />
                <input
                  id="admin-courses-search"
                  name="adminCoursesSearch"
                  type="text"
                  aria-label="Tìm kiếm khóa học theo mã, tiêu đề hoặc chuyên đề"
                  placeholder="Tìm kiếm theo mã khóa học, tiêu đề hoặc chuyên đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <select
                id="admin-courses-level-filter"
                name="adminCoursesLevelFilter"
                aria-label="Lọc khóa học theo cấp độ"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="Cơ bản">Cơ bản</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Nâng cao">Nâng cao</option>
                <option value="Chuyên gia">Chuyên gia</option>
              </select>
            </div>
          </Card>

          <Card variant="flat" padding="none" className="bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] font-mono-tech text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Mã & Giáo trình</th>
                    <th className="py-3 px-4">Chuyên đề</th>
                    <th className="py-3 px-4">Cấp độ</th>
                    <th className="py-3 px-4">Tham chiếu CVSS</th>
                    <th className="py-3 px-4">Bài học / Học viên</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
                  {filteredCourses.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
                            {c.code}
                          </span>
                          <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] truncate">
                            {c.slug}
                          </span>
                        </div>
                        <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                          {c.title}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                        {c.track}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="primary" size="sm">
                          {c.level}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 font-mono-tech text-[11px] font-medium text-rose-700 dark:text-rose-300 whitespace-nowrap">
                        CVSS {c.cvssBase}
                      </td>

                      <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                        <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                          {c.lessonsCount} bài học
                        </div>
                        <div className="text-[10px] text-[#64748B]">
                          {c.enrolledCount} học viên ghi danh
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {c.status === "published" ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            <span>Đã xuất bản</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                            <span>Bản nháp</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenModulesDrawer(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#0F172A] dark:text-[#F1F5F9] bg-[#F3F1EC] dark:bg-[#161C2A] hover:bg-[#ECE9E2] dark:hover:bg-[#1B2335] border border-[#E5E2DC] dark:border-white/[0.08] transition-colors cursor-pointer"
                          >
                            <Layers className="h-3 w-3" aria-hidden="true" />
                            <span>Học phần</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourse(c)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-500/12 border border-blue-200 dark:border-blue-500/25 transition-colors cursor-pointer"
                          >
                            Chỉnh sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                        Không có khóa học nào khớp với tiêu chí tìm kiếm.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ====================================================================
          TAB 2: THẨM ĐỊNH ĐỒ ÁN CAPSTONE (NIST RUBRIC REVIEW)
         ==================================================================== */}
      {activeTab === "capstone" && (
        <div className="space-y-4">
          {/* Tóm tắt hàng đợi thẩm định */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
              <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
                Tổng hồ sơ Capstone
              </div>
              <div className="mt-1 text-2xl font-bold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9]">
                {capstoneQueue.length}
              </div>
            </Card>
            <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
              <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
                Đang chờ chấm điểm
              </div>
              <div className="mt-1 text-2xl font-bold font-mono-tech text-amber-700 dark:text-amber-400">
                {pendingCapstoneCount}
              </div>
            </Card>
            <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
              <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
                Đạt chuẩn (&ge; 80 điểm)
              </div>
              <div className="mt-1 text-2xl font-bold font-mono-tech text-emerald-700 dark:text-emerald-400">
                {passedCapstoneCount}
              </div>
            </Card>
            <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
              <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
                Yêu cầu bổ sung
              </div>
              <div className="mt-1 text-2xl font-bold font-mono-tech text-rose-600 dark:text-rose-400">
                {rejectedCapstoneCount}
              </div>
            </Card>
          </div>

          {/* Thanh lọc hàng đợi Capstone */}
          <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden="true" />
                <input
                  id="capstone-search"
                  name="capstoneSearch"
                  type="text"
                  aria-label="Tìm hồ sơ Capstone theo mã, học viên hoặc khóa học"
                  placeholder="Tìm kiếm theo mã hồ sơ, tên học viên hoặc khóa học..."
                  value={capstoneSearch}
                  onChange={(e) => setCapstoneSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <select
                id="capstone-status-filter"
                name="capstoneStatusFilter"
                aria-label="Lọc hồ sơ Capstone theo trạng thái"
                value={capstoneStatusFilter}
                onChange={(e) => setCapstoneStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="SUBMITTED">Chờ thẩm định</option>
                <option value="PASSED">Đạt chuẩn NIST</option>
                <option value="REJECTED">Cần bổ sung</option>
              </select>
            </div>
          </Card>

          {/* Bảng hàng đợi thẩm định Đồ án Capstone */}
          <Card variant="flat" padding="none" className="bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] font-mono-tech text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Mã & Học viên</th>
                    <th className="py-3 px-4">Khóa học Capstone</th>
                    <th className="py-3 px-4">Hồ sơ đính kèm</th>
                    <th className="py-3 px-4">Điểm Rubric (100)</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
                  {filteredCapstones.map((sub) => {
                    const meta = getCapstoneStatusMeta(sub.status)
                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/60 transition-colors"
                      >
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                              #{sub.id}
                            </span>
                            <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                              {sub.learnerName || sub.username}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                            Nộp lúc: {formatDateTime(sub.submittedAt)}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-[240px]">
                          <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9] truncate" title={sub.courseTitle}>
                            {sub.courseTitle}
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-1">
                            {sub.reportContent}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isSafeHttpUrl(sub.solutionUrl) ? (
                            <a
                              href={sub.solutionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                            >
                              <span>Kho báo cáo</span>
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-[#64748B]">Báo cáo nội tuyến</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono-tech text-[11px] whitespace-nowrap">
                          <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                            {sub.totalScore ?? 0} / 100 điểm
                          </div>
                          <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                            TS:{sub.rubricReconScore ?? 0}/20 &middot; KT:{sub.rubricExploitScore ?? 0}/35 &middot; Vá:{sub.rubricRemediationScore ?? 0}/30 &middot; BC:{sub.rubricReportScore ?? 0}/15
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge variant={meta.variant} size="sm" dot>
                            {meta.label}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenCapstoneReview(sub)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-500/12 border border-blue-200 dark:border-blue-500/25 transition-colors cursor-pointer"
                          >
                            <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Thẩm định Rubric</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {filteredCapstones.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                        Không có hồ sơ Capstone nào khớp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ====================================================================
          MODAL: TẠO / CHỈNH SỬA KHÓA HỌC
         ==================================================================== */}
      {isCourseModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#121722] rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08] p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
              <h3
                id="course-modal-title"
                className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
              >
                {selectedCourse ? "Chỉnh sửa Khóa học" : "Thêm Khóa học mới"}
              </h3>
              <button
                type="button"
                aria-label="Đóng hộp thoại khóa học"
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="course-form-code"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Mã khóa học
                  </label>
                  <input
                    id="course-form-code"
                    name="courseCode"
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="course-form-level"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Cấp độ đào tạo
                  </label>
                  <select
                    id="course-form-level"
                    name="courseLevel"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung cấp">Trung cấp</option>
                    <option value="Nâng cao">Nâng cao</option>
                    <option value="Chuyên gia">Chuyên gia</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="course-form-title"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Tên khóa học
                </label>
                <input
                  id="course-form-title"
                  name="courseTitle"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Kỹ thuật phân tích mã độc nâng cao"
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="course-form-track"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Chuyên đề đào tạo
                </label>
                <select
                  id="course-form-track"
                  name="courseTrack"
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                >
                  {TRACK_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="course-form-description"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Tóm tắt mục tiêu học thuật
                </label>
                <textarea
                  id="course-form-description"
                  name="courseDescription"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả trọng tâm kiến thức, chuẩn tham chiếu và năng lực đầu ra..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="course-form-cvss"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Điểm CVSS tham chiếu
                  </label>
                  <input
                    id="course-form-cvss"
                    name="courseCvss"
                    type="text"
                    value={formData.cvssBase}
                    onChange={(e) => setFormData({ ...formData, cvssBase: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="course-form-lessons"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Số bài học
                  </label>
                  <input
                    id="course-form-lessons"
                    name="courseLessonsCount"
                    type="number"
                    min={1}
                    value={formData.lessonsCount}
                    onChange={(e) => setFormData({ ...formData, lessonsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="course-form-status"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Trạng thái
                  </label>
                  <select
                    id="course-form-status"
                    name="courseStatus"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  >
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E2DC] dark:border-white/[0.08]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={savingCourse}
                  leftIcon={<Save className="h-3.5 w-3.5" />}
                >
                  Lưu khóa học
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          DRAWER: QUẢN LÝ HỌC PHẦN (MODULES) CỦA KHÓA HỌC
         ==================================================================== */}
      {modulesCourse && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modules-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-xl h-full bg-[#FFFFFF] dark:bg-[#121722] border-l border-[#E5E2DC] dark:border-white/[0.08] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-[#E5E2DC] dark:border-white/[0.08] flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] font-mono-tech uppercase text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                  Cấu trúc học phần &middot; {modulesCourse.code}
                </div>
                <h3
                  id="modules-drawer-title"
                  className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5"
                >
                  {modulesCourse.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Đóng ngăn kéo học phần"
                onClick={() => setModulesCourse(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Danh sách học phần */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Danh sách học phần hiện có ({courseModules.length})
                  </span>
                  {loadingModules && (
                    <span className="font-mono-tech text-[11px] text-[#64748B]">
                      Đang tải dữ liệu...
                    </span>
                  )}
                </div>

                {courseModules.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-3.5 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech font-semibold bg-[#FFFFFF] dark:bg-[#121722] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
                          Chương {mod.position}
                        </span>
                        <h4 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                          {mod.title}
                        </h4>
                      </div>
                      {mod.description && (
                        <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                          {mod.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteModule(mod)}
                      aria-label={`Gỡ học phần ${mod.title}`}
                      className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/12 shrink-0 cursor-pointer"
                      title="Gỡ học phần"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}

                {!loadingModules && courseModules.length === 0 && (
                  <div className="p-6 text-center rounded-xl border border-dashed border-[#D0CCC3] dark:border-white/[0.12] text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Chưa có học phần nào được khởi tạo cho khóa học này.
                  </div>
                )}
              </div>

              {/* Biểu mẫu thêm học phần */}
              <form
                onSubmit={handleAddModule}
                className="p-4 rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3 text-xs"
              >
                <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  Bổ sung học phần mới
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="module-form-position"
                      className="block text-[#475569] dark:text-[#94A3B8] font-medium mb-1"
                    >
                      Thứ tự
                    </label>
                    <input
                      id="module-form-position"
                      name="modulePosition"
                      type="number"
                      min={1}
                      required
                      value={newModuleForm.position}
                      onChange={(e) =>
                        setNewModuleForm({ ...newModuleForm, position: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="module-form-title"
                      className="block text-[#475569] dark:text-[#94A3B8] font-medium mb-1"
                    >
                      Tiêu đề học phần
                    </label>
                    <input
                      id="module-form-title"
                      name="moduleTitle"
                      type="text"
                      required
                      placeholder="Ví dụ: Kiểm soát truy cập theo vai trò & Chống leo thang"
                      value={newModuleForm.title}
                      onChange={(e) =>
                        setNewModuleForm({ ...newModuleForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="module-form-description"
                    className="block text-[#475569] dark:text-[#94A3B8] font-medium mb-1"
                  >
                    Mô tả nội dung
                  </label>
                  <textarea
                    id="module-form-description"
                    name="moduleDescription"
                    rows={2}
                    placeholder="Tóm tắt kiến thức trọng tâm và bài lab liên kết..."
                    value={newModuleForm.description}
                    onChange={(e) =>
                      setNewModuleForm({ ...newModuleForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    isLoading={savingModule}
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                  >
                    Thêm học phần
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          DRAWER: THẨM ĐỊNH ĐỒ ÁN CAPSTONE (NIST NICE RUBRIC)
         ==================================================================== */}
      {activeSubmission && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="capstone-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl h-full bg-[#FFFFFF] dark:bg-[#121722] border-l border-[#E5E2DC] dark:border-white/[0.08] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-[#E5E2DC] dark:border-white/[0.08] flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono-tech text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
                    HỘI ĐỒNG THẨM ĐỊNH NIST NICE
                  </span>
                  {!activeSubmission.isManualLookup && (
                    <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Hồ sơ #{activeSubmission.id}
                    </span>
                  )}
                </div>
                <h3
                  id="capstone-drawer-title"
                  className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
                >
                  {activeSubmission.courseTitle}
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Học viên: <strong className="text-[#0F172A] dark:text-[#F1F5F9]">{activeSubmission.learnerName || activeSubmission.username}</strong>
                  {activeSubmission.submittedAt && ` · Nộp lúc ${formatDateTime(activeSubmission.submittedAt)}`}
                </p>
              </div>
              <button
                type="button"
                aria-label="Đóng ngăn kéo thẩm định Capstone"
                onClick={() => setActiveSubmission(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form
              onSubmit={handleSubmitCapstoneEvaluation}
              className="flex-1 overflow-y-auto p-5 space-y-5 text-xs"
            >
              {/* Nội dung hồ sơ học viên nộp */}
              <div className="p-4 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Báo cáo kỹ thuật của học viên
                  </span>
                  {isSafeHttpUrl(activeSubmission.solutionUrl) && (
                    <a
                      href={activeSubmission.solutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                    >
                      <span>Mở kho mã nguồn / bằng chứng</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {activeSubmission.reportContent}
                </pre>
              </div>

              {/* Nhập mã hồ sơ nếu thẩm định trực tiếp */}
              {activeSubmission.isManualLookup && (
                <div>
                  <label
                    htmlFor="capstone-submission-id"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Mã hồ sơ trên máy chủ (Submission ID)
                  </label>
                  <input
                    id="capstone-submission-id"
                    name="capstoneSubmissionId"
                    type="number"
                    min={1}
                    required
                    placeholder="Ví dụ: 1"
                    value={rubricForm.submissionId}
                    onChange={(e) =>
                      setRubricForm({ ...rubricForm, submissionId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
              )}

              {/* 4 Tiêu chí NIST NICE Rubric (Tổng 100 điểm) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#E5E2DC] dark:border-white/[0.08]">
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Bảng điểm NIST NICE Rubric (Ngưỡng đạt: &ge; 80/100)
                  </span>
                  <Badge variant={isPassingScore ? "success" : "danger"} size="sm" dot>
                    {calculatedTotalScore} / 100 &middot; {isPassingScore ? "Đạt chuẩn" : "Chưa đạt"}
                  </Badge>
                </div>

                {/* 1. Trinh sát (0 - 20) */}
                <div className="p-3.5 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="capstone-recon-input"
                      className="font-medium text-[#0F172A] dark:text-[#F1F5F9]"
                    >
                      1. Trinh sát & Lập bản đồ bề mặt (Tối đa 20)
                    </label>
                    <input
                      id="capstone-recon-input"
                      name="rubricReconScore"
                      type="number"
                      min={0}
                      max={20}
                      required
                      value={rubricForm.rubricReconScore}
                      onChange={(e) =>
                        setRubricForm({
                          ...rubricForm,
                          rubricReconScore: Math.min(20, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      className="w-20 px-2.5 py-1 rounded-lg text-right font-mono-tech font-semibold bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                    />
                  </div>
                  <input
                    id="capstone-recon-range"
                    name="rubricReconScoreRange"
                    type="range"
                    min={0}
                    max={20}
                    aria-label="Thanh trượt điểm Trinh sát"
                    value={rubricForm.rubricReconScore}
                    onChange={(e) =>
                      setRubricForm({ ...rubricForm, rubricReconScore: Number(e.target.value) })
                    }
                    className="w-full accent-[#1D4ED8] dark:accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                {/* 2. Khai thác (0 - 35) */}
                <div className="p-3.5 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="capstone-exploit-input"
                      className="font-medium text-[#0F172A] dark:text-[#F1F5F9]"
                    >
                      2. Phân tích & Khai thác lỗ hổng (Tối đa 35)
                    </label>
                    <input
                      id="capstone-exploit-input"
                      name="rubricExploitScore"
                      type="number"
                      min={0}
                      max={35}
                      required
                      value={rubricForm.rubricExploitScore}
                      onChange={(e) =>
                        setRubricForm({
                          ...rubricForm,
                          rubricExploitScore: Math.min(35, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      className="w-20 px-2.5 py-1 rounded-lg text-right font-mono-tech font-semibold bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                    />
                  </div>
                  <input
                    id="capstone-exploit-range"
                    name="rubricExploitScoreRange"
                    type="range"
                    min={0}
                    max={35}
                    aria-label="Thanh trượt điểm Khai thác lỗ hổng"
                    value={rubricForm.rubricExploitScore}
                    onChange={(e) =>
                      setRubricForm({ ...rubricForm, rubricExploitScore: Number(e.target.value) })
                    }
                    className="w-full accent-[#1D4ED8] dark:accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                {/* 3. Vá lỗi & Gia cố (0 - 30) */}
                <div className="p-3.5 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="capstone-remediation-input"
                      className="font-medium text-[#0F172A] dark:text-[#F1F5F9]"
                    >
                      3. Vá lỗi & Gia cố kiến trúc (Tối đa 30)
                    </label>
                    <input
                      id="capstone-remediation-input"
                      name="rubricRemediationScore"
                      type="number"
                      min={0}
                      max={30}
                      required
                      value={rubricForm.rubricRemediationScore}
                      onChange={(e) =>
                        setRubricForm({
                          ...rubricForm,
                          rubricRemediationScore: Math.min(30, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      className="w-20 px-2.5 py-1 rounded-lg text-right font-mono-tech font-semibold bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                    />
                  </div>
                  <input
                    id="capstone-remediation-range"
                    name="rubricRemediationScoreRange"
                    type="range"
                    min={0}
                    max={30}
                    aria-label="Thanh trượt điểm Vá lỗi và Gia cố"
                    value={rubricForm.rubricRemediationScore}
                    onChange={(e) =>
                      setRubricForm({ ...rubricForm, rubricRemediationScore: Number(e.target.value) })
                    }
                    className="w-full accent-[#1D4ED8] dark:accent-[#3B82F6] cursor-pointer"
                  />
                </div>

                {/* 4. Báo cáo kỹ thuật (0 - 15) */}
                <div className="p-3.5 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="capstone-report-input"
                      className="font-medium text-[#0F172A] dark:text-[#F1F5F9]"
                    >
                      4. Chất lượng báo cáo & Bằng chứng (Tối đa 15)
                    </label>
                    <input
                      id="capstone-report-input"
                      name="rubricReportScore"
                      type="number"
                      min={0}
                      max={15}
                      required
                      value={rubricForm.rubricReportScore}
                      onChange={(e) =>
                        setRubricForm({
                          ...rubricForm,
                          rubricReportScore: Math.min(15, Math.max(0, Number(e.target.value) || 0)),
                        })
                      }
                      className="w-20 px-2.5 py-1 rounded-lg text-right font-mono-tech font-semibold bg-[#FFFFFF] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9]"
                    />
                  </div>
                  <input
                    id="capstone-report-range"
                    name="rubricReportScoreRange"
                    type="range"
                    min={0}
                    max={15}
                    aria-label="Thanh trượt điểm Báo cáo kỹ thuật"
                    value={rubricForm.rubricReportScore}
                    onChange={(e) =>
                      setRubricForm({ ...rubricForm, rubricReportScore: Number(e.target.value) })
                    }
                    className="w-full accent-[#1D4ED8] dark:accent-[#3B82F6] cursor-pointer"
                  />
                </div>
              </div>

              {/* Nhận xét thẩm định */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="capstone-feedback"
                    className="font-medium text-[#0F172A] dark:text-[#F1F5F9]"
                  >
                    Nhận xét của Hội đồng thẩm định
                  </label>
                  <button
                    type="button"
                    onClick={handleInsertFeedbackTemplate}
                    className="text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    Chèn nhận xét chuẩn theo điểm
                  </button>
                </div>
                <textarea
                  id="capstone-feedback"
                  name="capstoneFeedback"
                  rows={3}
                  value={rubricForm.feedback}
                  onChange={(e) => setRubricForm({ ...rubricForm, feedback: e.target.value })}
                  placeholder="Ghi nhận điểm mạnh, lỗ hổng cần bổ sung bằng chứng hoặc khuyến nghị phòng thủ..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E2DC] dark:border-white/[0.08]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setActiveSubmission(null)}
                >
                  Đóng
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={evaluatingCapstone}
                  leftIcon={<ClipboardCheck className="h-3.5 w-3.5" />}
                >
                  Xác nhận thẩm định ({calculatedTotalScore}/100)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCourses
