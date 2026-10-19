import { useState } from "react"
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Edit2,
  X,
  Save,
  ShieldAlert,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Badge, Button } from "../../components/common"
import { ADMIN_COURSES_CATALOG } from "./data/adminMockData"
import useNotificationStore from "../../stores/useNotificationStore"

export default function AdminCourses() {
  const [courses, setCourses] = useState(ADMIN_COURSES_CATALOG)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    track: "Web Application Defense",
    level: "Trung Cấp",
    cvssBase: "7.5 HIGH",
    status: "published",
    lessonsCount: 6,
  })

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.track.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenEdit = (c) => {
    setSelectedCourse(c)
    setFormData({ ...c })
    setIsModalOpen(true)
  }

  const handleOpenCreate = () => {
    setSelectedCourse(null)
    setFormData({
      code: "SEC-305",
      title: "",
      track: "Web Application Defense",
      level: "Trung Cấp",
      cvssBase: "8.0 HIGH",
      status: "published",
      lessonsCount: 6,
    })
    setIsModalOpen(true)
  }

  const handleSaveCourse = (e) => {
    e.preventDefault()
    if (!formData.title) return

    if (selectedCourse) {
      setCourses((prev) =>
        prev.map((c) => (c.id === selectedCourse.id ? { ...c, ...formData } : c))
      )
      useNotificationStore.getState().success(
        "Cập Nhật Khóa Học Thành Công",
        `Đã lưu các thay đổi cho khóa ${formData.title}.`
      )
    } else {
      const newCourse = {
        ...formData,
        id: `course-${Date.now().toString().slice(-4)}`,
        enrolledCount: 0,
        updatedAt: "19/10/2026",
      }
      setCourses([newCourse, ...courses])
      useNotificationStore.getState().success(
        "Thêm Khóa Học Thành Công",
        `Khóa học mới ${newCourse.title} đã được khởi tạo.`
      )
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <AdminHeader
        title="Quản Trị Khóa Học & Giáo Trình Tác Chiến"
        subtitle="Quản lý chuyên mục đào tạo, cấu trúc bài học, điểm CVSS tương ứng và số lượng học viên ghi danh"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Thêm Khóa Học Mới
          </Button>
        }
      />

      {/* Search */}
      <Card className="p-4 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã khóa học, tên hoặc chuyên đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((c) => (
          <Card key={c.id} className="p-5 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
                    {c.code}
                  </span>
                  <Badge variant="cyber" size="sm">
                    {c.level}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {c.track}
                </p>
              </div>

              <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 shrink-0">
                CVSS {c.cvssBase}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 text-center font-mono text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">BÀI HỌC</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{c.lessonsCount} Bài</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">HỌC VIÊN</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{c.enrolledCount}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">CẬP NHẬT</div>
                <div className="font-bold text-slate-800 dark:text-slate-200">{c.updatedAt}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="h-3 w-3" />
                <span>Xuất bản trực tiếp</span>
              </span>

              <button
                type="button"
                onClick={() => handleOpenEdit(c)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors border border-blue-200 dark:border-blue-900/60 cursor-pointer"
              >
                Chỉnh sửa giáo trình
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Edit / Create Course */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedCourse ? "Chỉnh Sửa Khóa Học" : "Thêm Khóa Học Mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Mã khóa học
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Cấp độ (Level)
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Nhập Môn">Nhập Môn</option>
                    <option value="Trung Cấp">Trung Cấp</option>
                    <option value="Nâng Cao">Nâng Cao</option>
                    <option value="Chuyên Gia">Chuyên Gia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Tên khóa học
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Kỹ thuật phân tích mã độc nâng cao"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Chuyên đề đào tạo
                </label>
                <select
                  value={formData.track}
                  onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Web Application Defense">Web Application Defense</option>
                  <option value="SOC & SIEM Operations">SOC & SIEM Operations</option>
                  <option value="Network Forensics">Network Forensics</option>
                  <option value="Cloud Security & Infrastructure">Cloud Security & Infrastructure</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Điểm CVSS cơ sở
                  </label>
                  <input
                    type="text"
                    value={formData.cvssBase}
                    onChange={(e) => setFormData({ ...formData, cvssBase: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Số lượng bài học
                  </label>
                  <input
                    type="number"
                    value={formData.lessonsCount}
                    onChange={(e) => setFormData({ ...formData, lessonsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button variant="primary" size="sm" type="submit" leftIcon={<Save className="h-3.5 w-3.5" />}>
                  Lưu Khóa Học
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
