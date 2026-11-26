import { useState } from "react"
import {
  Search,
  UserPlus,
  CheckCircle2,
  X,
  Save,
  ShieldAlert,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Button } from "../../components/common"
import { ADMIN_USERS } from "./data/adminMockData"
import useNotificationStore from "../../stores/useNotificationStore"

const ROLE_OPTIONS = [
  "Quản trị viên cấp cao",
  "Trưởng ca SOC",
  "Chuyên viên phân tích",
  "Giảng viên",
  "Học viên",
]

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "CP"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getRoleBadgeStyle(role) {
  switch (role) {
    case "Quản trị viên cấp cao":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/12 dark:text-rose-300 dark:border-rose-500/25"
    case "Trưởng ca SOC":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/12 dark:text-indigo-300 dark:border-indigo-500/25"
    case "Chuyên viên phân tích":
      return "bg-blue-50 text-[#1D4ED8] border-blue-200 dark:bg-blue-500/12 dark:text-[#93C5FD] dark:border-blue-500/25"
    case "Giảng viên":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25"
    default:
      return "bg-[#F3F1EC] text-[#475569] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.08]"
  }
}

export function AdminUsers() {
  const [users, setUsers] = useState(ADMIN_USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "Học viên",
  })

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.trim().toLowerCase()
    const matchSearch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.ipAddress.includes(query)

    const matchRole = roleFilter === "all" || u.role === roleFilter
    const matchStatus = statusFilter === "all" || u.status === statusFilter

    return matchSearch && matchRole && matchStatus
  })

  const totalActive = users.filter((u) => u.status === "active").length
  const totalTwoFactor = users.filter((u) => u.twoFactorEnabled).length
  const totalSuspended = users.filter((u) => u.status === "suspended").length

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!selectedUser?.name?.trim()) return
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
    )
    setIsEditModalOpen(false)
    useNotificationStore.getState().success(
      "Cập nhật hồ sơ thành công",
      `Đã lưu phân quyền và trạng thái tài khoản cho ${selectedUser.name}.`
    )
  }

  const handleCreateUser = (e) => {
    e.preventDefault()
    if (!newUserData.name.trim() || !newUserData.email.trim()) return

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserData.name.trim(),
      email: newUserData.email.trim(),
      role: newUserData.role,
      status: "active",
      xp: 0,
      labsCompleted: 0,
      lastActive: "Chưa đăng nhập",
      registeredDate: new Date().toLocaleDateString("vi-VN"),
      ipAddress: "127.0.0.1",
      twoFactorEnabled: false,
    }

    setUsers((prev) => [newUser, ...prev])
    setIsCreateModalOpen(false)
    setNewUserData({ name: "", email: "", role: "Học viên" })
    useNotificationStore.getState().success(
      "Tạo tài khoản thành công",
      `Đã cấp vai trò ${newUser.role} cho địa chỉ ${newUser.email}.`
    )
  }

  const handleToggleStatus = (u) => {
    const nextStatus = u.status === "active" ? "suspended" : "active"
    setUsers((prev) =>
      prev.map((item) =>
        item.id === u.id ? { ...item, status: nextStatus } : item
      )
    )
    useNotificationStore.getState().warning(
      nextStatus === "suspended" ? "Đã tạm khóa tài khoản" : "Đã kích hoạt lại tài khoản",
      `Tài khoản của ${u.name} hiện ở trạng thái: ${
        nextStatus === "suspended" ? "Tạm khóa" : "Đang hoạt động"
      }.`
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      <AdminHeader
        title="Quản lý Người dùng & Phân quyền SOC"
        subtitle="Danh bạ học viên và chuyên viên an ninh mạng, kiểm soát vai trò truy cập và tình trạng xác thực hai lớp."
        statusLabel="DANH BẠ PHÂN QUYỀN NỘI BỘ"
        statusTone="sample"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<UserPlus className="h-3.5 w-3.5" />}
          >
            Thêm tài khoản mới
          </Button>
        }
      />

      {/* Thống kê tóm tắt danh bạ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
            Tổng tài khoản
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-tech text-[#0F172A] dark:text-[#F1F5F9]">
            {users.length}
          </div>
        </Card>
        <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
            Đang hoạt động
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-tech text-emerald-700 dark:text-emerald-400">
            {totalActive}
          </div>
        </Card>
        <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
            Đã bật 2FA/TOTP
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8]">
            {totalTwoFactor}
          </div>
        </Card>
        <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="text-[11px] font-mono-tech uppercase text-[#64748B] dark:text-[#94A3B8]">
            Đang tạm khóa
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-tech text-rose-600 dark:text-rose-400">
            {totalSuspended}
          </div>
        </Card>
      </div>

      {/* Thanh tìm kiếm & lọc */}
      <Card variant="flat" className="p-4 bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" aria-hidden="true" />
            <input
              id="admin-users-search"
              name="adminUsersSearch"
              type="text"
              aria-label="Tìm kiếm người dùng theo tên, email hoặc địa chỉ IP"
              placeholder="Tìm kiếm theo họ tên, địa chỉ email hoặc IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              id="admin-users-role-filter"
              name="adminUsersRoleFilter"
              aria-label="Lọc theo vai trò"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              id="admin-users-status-filter"
              name="adminUsersStatusFilter"
              aria-label="Lọc theo trạng thái tài khoản"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="suspended">Đã tạm khóa</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bảng dữ liệu người dùng */}
      <Card variant="flat" padding="none" className="bg-[#FFFFFF] dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] font-mono-tech text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Thành viên</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Tiến độ thực hành</th>
                <th className="py-3 px-4">Xác thực 2FA</th>
                <th className="py-3 px-4">Địa chỉ IP</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A]/60 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                        {getInitials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono-tech truncate">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-mono-tech text-[10px] font-semibold border ${getRoleBadgeStyle(u.role)}`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {u.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        <span>Hoạt động</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium"
                        title={u.suspensionReason || "Tài khoản đang bị tạm khóa"}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
                        <span>Tạm khóa</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech text-[11px] whitespace-nowrap">
                    <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                      {u.xp.toLocaleString("vi-VN")} XP
                    </div>
                    <div className="text-[#64748B] dark:text-[#94A3B8]">
                      {u.labsCompleted} bài hoàn thành
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech text-[11px] whitespace-nowrap">
                    {u.twoFactorEnabled ? (
                      <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Đã bật TOTP</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400 inline-flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Chưa bật</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                    <div>{u.ipAddress}</div>
                    <div className="text-[10px] text-[#64748B]">{u.lastActive}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser({ ...u })
                          setIsEditModalOpen(true)
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-500/12 transition-colors border border-blue-200 dark:border-blue-500/25 cursor-pointer"
                      >
                        Phân quyền
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border cursor-pointer ${
                          u.status === "active"
                            ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/12 border-rose-200 dark:border-rose-500/25"
                            : "text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/25"
                        }`}
                      >
                        {u.status === "active" ? "Khóa" : "Mở khóa"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#64748B] dark:text-[#94A3B8]">
                    Không tìm thấy thành viên phù hợp với tiêu chí lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Hộp thoại chỉnh sửa quyền */}
      {isEditModalOpen && selectedUser && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-user-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#121722] rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
              <h3
                id="edit-user-modal-title"
                className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
              >
                Chỉnh sửa quyền & Trạng thái
              </h3>
              <button
                type="button"
                aria-label="Đóng hộp thoại chỉnh sửa"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="edit-user-name"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Họ và tên
                </label>
                <input
                  id="edit-user-name"
                  name="editUserName"
                  type="text"
                  required
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-user-email"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Địa chỉ email
                </label>
                <input
                  id="edit-user-email"
                  name="editUserEmail"
                  type="email"
                  disabled
                  value={selectedUser.email}
                  className="w-full px-3 py-2 rounded-xl bg-[#ECE9E2] dark:bg-[#161C2A]/50 border border-[#E5E2DC] dark:border-white/[0.06] text-[#64748B] dark:text-[#94A3B8] font-mono-tech"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-user-role"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Cấp bậc vai trò
                </label>
                <select
                  id="edit-user-role"
                  name="editUserRole"
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                >
                  <option value="Quản trị viên cấp cao">Quản trị viên cấp cao (Toàn quyền)</option>
                  <option value="Trưởng ca SOC">Trưởng ca SOC (Điều phối trực chiến)</option>
                  <option value="Chuyên viên phân tích">Chuyên viên phân tích (Giám sát & Ứng phó)</option>
                  <option value="Giảng viên">Giảng viên (Biên soạn & Thẩm định)</option>
                  <option value="Học viên">Học viên (Tiêu chuẩn)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-user-status"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Trạng thái tài khoản
                </label>
                <select
                  id="edit-user-status"
                  name="editUserStatus"
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, status: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                >
                  <option value="active">Hoạt động bình thường</option>
                  <option value="suspended">Tạm khóa (Cách ly bảo mật)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E2DC] dark:border-white/[0.08]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  leftIcon={<Save className="h-3.5 w-3.5" />}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hộp thoại tạo người dùng mới */}
      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-user-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-[#FFFFFF] dark:bg-[#121722] rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
              <h3
                id="create-user-modal-title"
                className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9]"
              >
                Thêm chuyên viên / Học viên mới
              </h3>
              <button
                type="button"
                aria-label="Đóng hộp thoại tạo tài khoản"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="create-user-name"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Họ và tên
                </label>
                <input
                  id="create-user-name"
                  name="createUserName"
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Tuấn Anh"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="create-user-email"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Địa chỉ email
                </label>
                <input
                  id="create-user-email"
                  name="createUserEmail"
                  type="email"
                  required
                  placeholder="tuananh@cyberpath.edu.vn"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label
                  htmlFor="create-user-role"
                  className="block text-[#0F172A] dark:text-[#F1F5F9] font-medium mb-1.5"
                >
                  Cấp bậc vai trò
                </label>
                <select
                  id="create-user-role"
                  name="createUserRole"
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E5E2DC] dark:border-white/[0.08]">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  leftIcon={<UserPlus className="h-3.5 w-3.5" />}
                >
                  Tạo tài khoản
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
