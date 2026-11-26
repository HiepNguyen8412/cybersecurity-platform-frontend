import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Server,
  X,
  Save,
  RefreshCw,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Button } from "../../components/common"
import { ADMIN_LABS_CATALOG } from "./data/adminMockData"
import challengeService from "../../services/challengeService"
import api from "../../services/api"
import useNotificationStore from "../../stores/useNotificationStore"

const TRACK_OPTIONS = [
  { label: "Phòng thủ Ứng dụng Web", category: "WEB" },
  { label: "Vận hành SOC & Giám sát SIEM", category: "NETWORK" },
  { label: "Điều tra Mạng & Gói tin", category: "FORENSICS" },
  { label: "Bảo mật Đám mây & Hạ tầng", category: "CLOUD" },
  { label: "Mật mã học & Giải mã", category: "CRYPTO" },
  { label: "Khai thác Hệ thống & Mã nhị phân", category: "PWN" },
]

const DIFFICULTY_OPTIONS = [
  { label: "Cơ bản", value: "EASY" },
  { label: "Trung cấp", value: "MEDIUM" },
  { label: "Nâng cao", value: "HARD" },
  { label: "Chuyên gia", value: "HARD" },
]

function mapCategoryToTrack(category) {
  switch (String(category || "").toUpperCase()) {
    case "WEB":
      return "Phòng thủ Ứng dụng Web"
    case "CRYPTO":
      return "Mật mã học & Giải mã"
    case "PWN":
    case "REV":
      return "Khai thác Hệ thống & Mã nhị phân"
    case "FORENSICS":
      return "Điều tra Mạng & Gói tin"
    case "CLOUD":
      return "Bảo mật Đám mây & Hạ tầng"
    default:
      return "Vận hành SOC & Giám sát SIEM"
  }
}

function mapDifficultyLabel(difficulty) {
  switch (String(difficulty || "").toUpperCase()) {
    case "EASY":
    case "BEGINNER":
      return "Cơ bản"
    case "HARD":
      return "Nâng cao"
    case "EXPERT":
      return "Chuyên gia"
    default:
      return "Trung cấp"
  }
}

function getDifficultyBadgeStyle(difficulty) {
  switch (difficulty) {
    case "Chuyên gia":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/12 dark:text-rose-300 dark:border-rose-500/25"
    case "Nâng cao":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/12 dark:text-indigo-300 dark:border-indigo-500/25"
    case "Trung cấp":
      return "bg-blue-50 text-[#1D4ED8] border-blue-200 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25"
    default:
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25"
  }
}

const mapBackendChallenge = (ch) => ({
  id: ch.id,
  isBackendRecord: true,
  title: ch.title,
  slug: ch.slug,
  category: ch.category || "WEB",
  track: mapCategoryToTrack(ch.category),
  difficulty: mapDifficultyLabel(ch.difficulty),
  points: ch.points || 100,
  containerImage: `cyberpath/ctf-${ch.slug || ch.id}:latest`,
  memoryLimit: "512 MB",
  cpuLimit: "0.5 vCPU",
  flagSecret: "FLAG{BẢO_MẬT_TRONG_CSDL}",
  description: ch.description || "Bài thực hành nghiệm thu cờ CTF trên hạ tầng Sandbox cô lập.",
  status: "published",
  instancesActive: ch.solvesCount || 0,
})

const EMPTY_LAB_FORM = {
  title: "",
  track: "Phòng thủ Ứng dụng Web",
  difficulty: "Trung cấp",
  points: 400,
  containerImage: "cyberpath/defense-lab:latest",
  memoryLimit: "512 MB",
  cpuLimit: "0.5 vCPU",
  flagSecret: "FLAG{MAU_THU_THACH_CTF}",
  description: "",
  status: "published",
}

export function AdminLabs() {
  const [labs, setLabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLiveCatalog, setIsLiveCatalog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [trackFilter, setTrackFilter] = useState("all")
  const [visibleFlags, setVisibleFlags] = useState({})

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLab, setEditingLab] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(EMPTY_LAB_FORM)

  const fetchChallengesCatalog = useCallback(async () => {
    const res = await challengeService.getChallenges()
    if (res.success && res.data) {
      const items = Array.isArray(res.data) ? res.data : res.data.content || []
      if (items.length > 0) {
        return { items: items.map(mapBackendChallenge), isLive: true }
      }
    }
    return { items: ADMIN_LABS_CATALOG, isLive: false }
  }, [])

  const loadChallenges = useCallback(async () => {
    setLoading(true)
    try {
      const { items, isLive } = await fetchChallengesCatalog()
      setLabs(items)
      setIsLiveCatalog(isLive)
    } catch {
      setLabs(ADMIN_LABS_CATALOG)
      setIsLiveCatalog(false)
    } finally {
      setLoading(false)
    }
  }, [fetchChallengesCatalog])

  useEffect(() => {
    let ignore = false
    async function initChallenges() {
      try {
        const { items, isLive } = await fetchChallengesCatalog()
        if (!ignore) {
          setLabs(items)
          setIsLiveCatalog(isLive)
        }
      } catch {
        if (!ignore) {
          setLabs(ADMIN_LABS_CATALOG)
          setIsLiveCatalog(false)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    initChallenges()
    return () => {
      ignore = true
    }
  }, [fetchChallengesCatalog])

  const toggleFlagVisibility = (id) => {
    setVisibleFlags((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredLabs = labs.filter((l) => {
    const query = searchQuery.trim().toLowerCase()
    const matchSearch =
      !query ||
      l.title.toLowerCase().includes(query) ||
      l.containerImage.toLowerCase().includes(query) ||
      l.track.toLowerCase().includes(query)
    const matchTrack = trackFilter === "all" || l.track === trackFilter
    return matchSearch && matchTrack
  })

  const handleOpenEdit = (lab) => {
    setEditingLab(lab)
    setFormData({
      title: lab.title || "",
      track: lab.track || "Phòng thủ Ứng dụng Web",
      difficulty: lab.difficulty || "Trung cấp",
      points: lab.points || 100,
      containerImage: lab.containerImage || "cyberpath/defense-lab:latest",
      memoryLimit: lab.memoryLimit || "512 MB",
      cpuLimit: lab.cpuLimit || "0.5 vCPU",
      flagSecret: lab.isBackendRecord ? "" : lab.flagSecret || "",
      description: lab.description || "",
      status: lab.status || "published",
    })
    setIsModalOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingLab(null)
    setFormData({ ...EMPTY_LAB_FORM })
    setIsModalOpen(true)
  }

  const handleSaveLab = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    setSaving(true)

    const trackMeta = TRACK_OPTIONS.find((t) => t.label === formData.track) || TRACK_OPTIONS[0]
    const diffMeta = DIFFICULTY_OPTIONS.find((d) => d.label === formData.difficulty) || DIFFICULTY_OPTIONS[1]

    try {
      if (editingLab?.isBackendRecord && isLiveCatalog && formData.flagSecret.trim()) {
        const res = await api.put(`/challenges/${editingLab.id}`, {
          title: formData.title.trim(),
          category: trackMeta.category,
          difficulty: diffMeta.value,
          points: Math.max(10, Number(formData.points) || 100),
          description: formData.description.trim() || editingLab.description || formData.title.trim(),
          flag: formData.flagSecret.trim(),
          active: formData.status === "published",
        })
        if (res.data) {
          setLabs((prev) =>
            prev.map((l) =>
              l.id === editingLab.id
                ? { ...l, ...formData, flagSecret: "FLAG{BẢO_MẬT_TRONG_CSDL}" }
                : l
            )
          )
          useNotificationStore.getState().success(
            "Đã đồng bộ phòng Lab lên máy chủ",
            `Cấu hình thử thách "${formData.title}" đã được cập nhật thành công.`
          )
          setIsModalOpen(false)
          return
        }
      }

      if (!editingLab && isLiveCatalog && formData.flagSecret.trim()) {
        const res = await api.post("/challenges", {
          title: formData.title.trim(),
          category: trackMeta.category,
          difficulty: diffMeta.value,
          points: Math.max(10, Number(formData.points) || 100),
          description: formData.description.trim() || `Bài thực hành chuyên sâu: ${formData.title.trim()}`,
          flag: formData.flagSecret.trim(),
        })
        if (res.data) {
          await loadChallenges()
          useNotificationStore.getState().success(
            "Đã tạo phòng Lab mới trên máy chủ",
            `Thử thách "${formData.title}" đã sẵn sàng trên hệ thống.`
          )
          setIsModalOpen(false)
          return
        }
      }
    } catch {
      // Fallback sang cập nhật cục bộ nếu máy chủ từ chối hoặc ngoại tuyến
    } finally {
      setSaving(false)
    }

    if (editingLab) {
      setLabs((prev) =>
        prev.map((l) =>
          l.id === editingLab.id
            ? {
                ...l,
                ...formData,
                flagSecret: formData.flagSecret.trim() || l.flagSecret,
              }
            : l
        )
      )
      useNotificationStore.getState().success(
        "Cập nhật phòng Lab thành công",
        `Đã lưu cấu hình cho bài thực hành "${formData.title}".`
      )
    } else {
      const newLab = {
        ...formData,
        id: `lab-${Date.now().toString().slice(-4)}`,
        category: trackMeta.category,
        completionsCount: 0,
        rating: 5.0,
      }
      setLabs((prev) => [newLab, ...prev])
      useNotificationStore.getState().success(
        "Tạo phòng Lab mới thành công",
        `Bài thực hành "${newLab.title}" đã được thêm vào danh mục.`
      )
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <AdminHeader
        title="Quản trị Phòng Lab & Thử thách CTF"
        subtitle="Quản lý ảnh container cô lập, thiết lập cờ nghiệm thu, định mức tài nguyên và trạng thái xuất bản."
        statusLabel={isLiveCatalog ? "ĐỒNG BỘ DANH MỤC CTF TRỰC TIẾP" : "DANH MỤC MẪU NGOẠI TUYẾN"}
        statusTone={isLiveCatalog ? "operational" : "sample"}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadChallenges}
              disabled={loading}
              leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Làm mới
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Thêm phòng Lab mới
            </Button>
          </div>
        }
      />

      {/* Thanh tìm kiếm & bộ lọc */}
      <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden="true" />
            <input
              id="admin-labs-search"
              name="adminLabsSearch"
              type="text"
              aria-label="Tìm kiếm phòng lab theo tiêu đề hoặc ảnh container"
              placeholder="Tìm kiếm bài lab theo tiêu đề, chuyên đề hoặc ảnh Docker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              id="admin-labs-track-filter"
              name="adminLabsTrackFilter"
              aria-label="Lọc phòng lab theo chuyên đề"
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="all">Tất cả chuyên đề</option>
              {TRACK_OPTIONS.map((t) => (
                <option key={t.label} value={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Bảng danh mục Lab */}
      <Card variant="flat" padding="none" className="bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] font-mono-tech text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Phòng Lab & Chuyên đề</th>
                <th className="py-3 px-4">Độ khó</th>
                <th className="py-3 px-4">Điểm XP</th>
                <th className="py-3 px-4">Ảnh Container</th>
                <th className="py-3 px-4">Định mức</th>
                <th className="py-3 px-4">Cờ xác thực</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
              {filteredLabs.map((l) => (
                <tr
                  key={l.id}
                  className="hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/60 transition-colors"
                >
                  <td className="py-3.5 px-4 max-w-[260px]">
                    <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                      {l.title}
                    </div>
                    <div className="text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] font-medium mt-0.5">
                      {l.track}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold font-mono-tech border ${getDifficultyBadgeStyle(l.difficulty)}`}
                    >
                      {l.difficulty}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                    +{l.points} XP
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8]">
                    <div className="flex items-center gap-1.5">
                      <Server className="h-3.5 w-3.5 text-[#64748B] shrink-0" aria-hidden="true" />
                      <span className="truncate max-w-[180px]" title={l.containerImage}>
                        {l.containerImage}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                    {l.cpuLimit} &middot; {l.memoryLimit}
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech text-[11px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                        {visibleFlags[l.id] ? l.flagSecret : "FLAG{••••••••••••••••}"}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFlagVisibility(l.id)}
                        className="p-1 rounded text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer"
                        aria-label={visibleFlags[l.id] ? "Ẩn cờ xác thực" : "Hiển thị cờ xác thực"}
                        title={visibleFlags[l.id] ? "Ẩn cờ" : "Hiện cờ"}
                      >
                        {visibleFlags[l.id] ? (
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {l.status === "published" ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium font-mono-tech">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span>Đã xuất bản</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium font-mono-tech">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" aria-hidden="true" />
                        <span>Bản nháp</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(l)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-500/12 transition-colors border border-blue-200 dark:border-blue-500/25 cursor-pointer"
                    >
                      Cấu hình
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLabs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                    Không tìm thấy bài Lab nào khớp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Hộp thoại thêm / cấu hình phòng Lab */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lab-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-[#FFFFFF] dark:bg-[#121722] rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08] p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
              <h3
                id="lab-modal-title"
                className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
              >
                {editingLab ? "Cấu hình Phòng Lab & Cờ nghiệm thu" : "Thêm Phòng Lab mới"}
              </h3>
              <button
                type="button"
                aria-label="Đóng hộp thoại cấu hình phòng Lab"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveLab} className="space-y-3.5 text-xs">
              <div>
                <label
                  htmlFor="lab-form-title"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Tiêu đề bài thực hành
                </label>
                <input
                  id="lab-form-title"
                  name="labTitle"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Khai thác lỗ hổng Server-Side Template Injection"
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="lab-form-track"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Chuyên đề đào tạo
                  </label>
                  <select
                    id="lab-form-track"
                    name="labTrack"
                    value={formData.track}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  >
                    {TRACK_OPTIONS.map((t) => (
                      <option key={t.label} value={t.label}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="lab-form-difficulty"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Mức độ khó
                  </label>
                  <select
                    id="lab-form-difficulty"
                    name="labDifficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  >
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <option key={d.label} value={d.label}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="lab-form-image"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Định danh ảnh Docker Container
                </label>
                <input
                  id="lab-form-image"
                  name="labContainerImage"
                  type="text"
                  required
                  value={formData.containerImage}
                  onChange={(e) => setFormData({ ...formData, containerImage: e.target.value })}
                  placeholder="cyberpath/ssti-node-hardened:v1.0"
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="lab-form-memory"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Giới hạn RAM
                  </label>
                  <input
                    id="lab-form-memory"
                    name="labMemoryLimit"
                    type="text"
                    value={formData.memoryLimit}
                    onChange={(e) => setFormData({ ...formData, memoryLimit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lab-form-points"
                    className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                  >
                    Điểm XP thưởng
                  </label>
                  <input
                    id="lab-form-points"
                    name="labPoints"
                    type="number"
                    min={10}
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lab-form-flag"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Cờ nghiệm thu (Flag)
                </label>
                <input
                  id="lab-form-flag"
                  name="labFlagSecret"
                  type="text"
                  required={!editingLab?.isBackendRecord}
                  value={formData.flagSecret}
                  onChange={(e) => setFormData({ ...formData, flagSecret: e.target.value })}
                  placeholder={
                    editingLab?.isBackendRecord
                      ? "Để trống nếu giữ nguyên cờ hiện tại trên CSDL"
                      : "FLAG{...}"
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="lab-form-description"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Mô tả mục tiêu kỹ thuật
                </label>
                <textarea
                  id="lab-form-description"
                  name="labDescription"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tóm tắt phạm vi lỗ hổng, phương pháp kiểm chứng và yêu cầu vá lỗi..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="lab-form-status"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Trạng thái xuất bản
                </label>
                <select
                  id="lab-form-status"
                  name="labStatus"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                >
                  <option value="published">Xuất bản trực tiếp</option>
                  <option value="draft">Bản nháp nội bộ</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E2DC] dark:border-white/[0.08]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  isLoading={saving}
                  leftIcon={<Save className="h-3.5 w-3.5" />}
                >
                  {editingLab ? "Lưu cấu hình" : "Tạo phòng Lab"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLabs
