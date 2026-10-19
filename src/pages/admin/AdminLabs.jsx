import { useState } from "react"
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle2,
  Server,
  Award,
  Layers,
  X,
  Save,
  Check,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Badge, Button } from "../../components/common"
import { ADMIN_LABS_CATALOG } from "./data/adminMockData"
import useNotificationStore from "../../stores/useNotificationStore"

export default function AdminLabs() {
  const [labs, setLabs] = useState(ADMIN_LABS_CATALOG)
  const [searchQuery, setSearchQuery] = useState("")
  const [trackFilter, setTrackFilter] = useState("all")
  const [visibleFlags, setVisibleFlags] = useState({})

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLab, setEditingLab] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    track: "Web Application Defense",
    difficulty: "Trung Cấp",
    points: 400,
    containerImage: "cyberpath/defense-lab:latest",
    memoryLimit: "512 MB",
    cpuLimit: "0.5 vCPU",
    flagSecret: "FLAG{DEFAULT_FLAG_VALUE}",
    status: "published",
  })

  const toggleFlagVisibility = (id) => {
    setVisibleFlags((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredLabs = labs.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.containerImage.toLowerCase().includes(searchQuery.toLowerCase())
    const matchTrack = trackFilter === "all" || l.track === trackFilter
    return matchSearch && matchTrack
  })

  const handleOpenEdit = (lab) => {
    setEditingLab(lab)
    setFormData({ ...lab })
    setIsModalOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingLab(null)
    setFormData({
      title: "",
      track: "Web Application Defense",
      difficulty: "Trung Cấp",
      points: 400,
      containerImage: "cyberpath/defense-lab:latest",
      memoryLimit: "512 MB",
      cpuLimit: "0.5 vCPU",
      flagSecret: "FLAG{SAMPLE_CHALLENGE_FLAG}",
      status: "published",
    })
    setIsModalOpen(true)
  }

  const handleSaveLab = (e) => {
    e.preventDefault()
    if (!formData.title) return

    if (editingLab) {
      setLabs((prev) =>
        prev.map((l) => (l.id === editingLab.id ? { ...l, ...formData } : l))
      )
      useNotificationStore.getState().success(
        "Cập Nhật Phòng Lab Thành Công",
        `Đã cập nhật cấu hình và Flag cho bài ${formData.title}.`
      )
    } else {
      const newLab = {
        ...formData,
        id: `lab-${Date.now().toString().slice(-4)}`,
        completionsCount: 0,
        rating: 5.0,
      }
      setLabs([newLab, ...labs])
      useNotificationStore.getState().success(
        "Tạo Phòng Lab Mới Thành Công",
        `Phòng lab ${newLab.title} đã được đưa lên hệ thống Sandbox.`
      )
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <AdminHeader
        title="Quản Trị Phòng Lab Thực Chiến & Thử Thách CTF"
        subtitle="Quản lý cấu hình container cô lập, thiết lập Flag nghiệm thu, phân bổ tài nguyên và kiểm soát xuất bản"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Thêm Phòng Lab Mới
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <Card className="p-4 border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài lab theo tiêu đề hoặc Docker Image..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả chuyên đề</option>
              <option value="Web Application Defense">Phòng Thủ Ứng Dụng Web (Web Defense)</option>
              <option value="SOC & SIEM Operations">Vận Hành SOC & Giám Sát SIEM</option>
              <option value="Network Forensics">Điều Tra Sự Cố Mạng (Network Forensics)</option>
              <option value="Cloud Security & Infrastructure">Bảo Mật Đám Mây (Cloud Security)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Labs Data Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">PHÒNG LAB & CHUYÊN ĐỀ</th>
                <th className="py-3 px-4">ĐỘ KHÓ</th>
                <th className="py-3 px-4">ĐIỂM XP</th>
                <th className="py-3 px-4">ẢNH CONTAINER DOCKER</th>
                <th className="py-3 px-4">TÀI NGUYÊN CẤP PHÁT</th>
                <th className="py-3 px-4">FLAG XÁC THỰC</th>
                <th className="py-3 px-4">TRẠNG THÁI</th>
                <th className="py-3 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLabs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Title & Track */}
                  <td className="py-3.5 px-4 max-w-[240px]">
                    <div className="font-bold text-slate-900 dark:text-white leading-snug">
                      {l.title}
                    </div>
                    <div className="text-[11px] text-blue-600 dark:text-cyan-400 font-medium">
                      {l.track}
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="py-3 px-4">
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono
                      ${
                        l.difficulty === "Chuyên Gia"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                          : l.difficulty === "Nâng Cao"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                          : l.difficulty === "Trung Cấp"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                      }
                    `}>
                      {l.difficulty}
                    </span>
                  </td>

                  {/* Points */}
                  <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                    +{l.points} XP
                  </td>

                  {/* Docker Image */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Server className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{l.containerImage}</span>
                    </div>
                  </td>

                  {/* Resource Limits */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {l.cpuLimit} &bull; {l.memoryLimit}
                  </td>

                  {/* Flag Secret */}
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-700 dark:text-slate-300 font-bold">
                        {visibleFlags[l.id] ? l.flagSecret : "FLAG{••••••••••••••••}"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFlagVisibility(l.id)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={visibleFlags[l.id] ? "Ẩn Flag" : "Hiện Flag bí mật"}
                      >
                        {visibleFlags[l.id] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {l.status === "published" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Đã Phát Hành</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold font-mono">
                        <span>Bản Nháp</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(l)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors border border-blue-200 dark:border-blue-900/60 cursor-pointer"
                    >
                      Cấu hình
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Lab Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingLab ? "Cấu Hình Phòng Lab & Flag" : "Thêm Phòng Lab Mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLab} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Tên tiêu đề bài Lab
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Server-Side Template Injection (SSTI) Remote Code Execution"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Chuyên đề (Track)
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

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Độ khó
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
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
                  Docker Container Image Tag
                </label>
                <input
                  type="text"
                  required
                  value={formData.containerImage}
                  onChange={(e) => setFormData({ ...formData, containerImage: e.target.value })}
                  placeholder="cyberpath/ssti-node-hardened:v1.0"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Giới hạn RAM
                  </label>
                  <input
                    type="text"
                    value={formData.memoryLimit}
                    onChange={(e) => setFormData({ ...formData, memoryLimit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Điểm XP Thưởng
                  </label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Flag Bí Mật (Nghiệm Thu Thử Thách)
                </label>
                <input
                  type="text"
                  required
                  value={formData.flagSecret}
                  onChange={(e) => setFormData({ ...formData, flagSecret: e.target.value })}
                  placeholder="FLAG{...}"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Trạng thái xuất bản
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="published">Xuất bản trực tiếp (Published)</option>
                  <option value="draft">Bản nháp nội bộ (Draft)</option>
                </select>
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
                  {editingLab ? "Lưu Cấu Hình" : "Tạo Phòng Lab"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
