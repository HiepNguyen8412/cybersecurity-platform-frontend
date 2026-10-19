import { useState } from "react"
import {
  UserCheck,
  Search,
  Filter,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Mail,
  Award,
  MoreVertical,
  X,
  Save,
  Download,
} from "lucide-react"
import AdminHeader from "./components/AdminHeader"
import { Card, Badge, Button, Input, Modal } from "../../components/common"
import { ADMIN_USERS } from "./data/adminMockData"
import useNotificationStore from "../../stores/useNotificationStore"

export default function AdminUsers() {
  const [users, setUsers] = useState(ADMIN_USERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal States
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    role: "Learner",
  })

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.ipAddress.includes(searchQuery)

    const matchRole = roleFilter === "all" || u.role === roleFilter
    const matchStatus = statusFilter === "all" || u.status === statusFilter

    return matchSearch && matchRole && matchStatus
  })

  // Handle Edit Save
  const handleSaveEdit = (e) => {
    e.preventDefault()
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
    )
    setIsEditModalOpen(false)
    useNotificationStore.getState().success(
      "Cập Nhật Hồ Sơ Thành Công",
      `Đã lưu thông tin phân quyền và trạng thái cho ${selectedUser.name}.`
    )
  }

  // Handle Create User
  const handleCreateUser = (e) => {
    e.preventDefault()
    if (!newUserData.name || !newUserData.email) return

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserData.name,
      email: newUserData.email,
      role: newUserData.role,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      xp: 0,
      labsCompleted: 0,
      lastActive: "Chưa đăng nhập",
      registeredDate: "19/10/2026",
      ipAddress: "127.0.0.1",
      twoFactorEnabled: false,
    }

    setUsers([newUser, ...users])
    setIsCreateModalOpen(false)
    setNewUserData({ name: "", email: "", role: "Learner" })
    useNotificationStore.getState().success(
      "Tạo Tài Khoản Thành Công",
      `Đã cấp quyền ${newUser.role} cho email ${newUser.email}.`
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
      nextStatus === "suspended" ? "Đã Khóa Tài Khoản" : "Đã Kích Hoạt Tài Khoản",
      `Tài khoản của ${u.name} hiện đang ở trạng thái: ${nextStatus.toUpperCase()}.`
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in-up">
      {/* Header */}
      <AdminHeader
        title="Quản Lý Người Dùng & Chuyên Viên SOC"
        subtitle="Quản lý thư mục học viên, phân bổ cấp bậc vai trò, giám sát xác thực 2FA và kiểm soát truy cập"
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<UserPlus className="h-3.5 w-3.5" />}
          >
            Thêm Chuyên Viên Mới
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
              placeholder="Tìm kiếm theo tên, email hoặc địa chỉ IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-600 dark:focus:border-cyan-400 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="Super Admin">Quản Trị Viên Cấp Cao (Super Admin)</option>
              <option value="SOC Lead">Trưởng Nhóm SOC (SOC Lead)</option>
              <option value="Security Analyst">Chuyên Viên SOC (Security Analyst)</option>
              <option value="Instructor">Giảng Viên (Instructor)</option>
              <option value="Learner">Học Viên (Learner)</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="suspended">Đã tạm khóa</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Data Table */}
      <Card className="border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">CHUYÊN VIÊN</th>
                <th className="py-3 px-4">VAI TRÒ (ROLE)</th>
                <th className="py-3 px-4">TRẠNG THÁI</th>
                <th className="py-3 px-4">THÀNH TÍCH (XP/LABS)</th>
                <th className="py-3 px-4">BẢO MẬT 2FA</th>
                <th className="py-3 px-4">IP TRUY CẬP</th>
                <th className="py-3 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* User info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">
                    <span className={`
                      inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase
                      ${
                        u.role === "Super Admin"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                          : u.role === "SOC Lead"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                          : u.role === "Security Analyst"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      }
                    `}>
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {u.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Hoạt động</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Tạm khóa</span>
                      </span>
                    )}
                  </td>

                  {/* XP & Labs */}
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {u.xp.toLocaleString()} XP
                    </div>
                    <div className="text-slate-400">
                      {u.labsCompleted} labs hoàn thành
                    </div>
                  </td>

                  {/* 2FA */}
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {u.twoFactorEnabled ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Đã bật TOTP</span>
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1">
                        <span>Chưa bật</span>
                      </span>
                    )}
                  </td>

                  {/* IP */}
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {u.ipAddress}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(u)
                          setIsEditModalOpen(true)
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors border border-blue-200 dark:border-blue-900/60"
                      >
                        Sửa quyền
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                          u.status === "active"
                            ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border-rose-200 dark:border-rose-900/60"
                            : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/60"
                        }`}
                      >
                        {u.status === "active" ? "Khóa" : "Mở"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Role Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Chỉnh Sửa Quyền & Trạng Thái
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  disabled
                  value={selectedUser.email}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Cấp bậc vai trò (Role)
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Super Admin">Super Admin (Toàn quyền hệ thống)</option>
                  <option value="SOC Lead">SOC Lead (Trưởng ca trực chiến)</option>
                  <option value="Security Analyst">Security Analyst (Chuyên viên phòng thủ)</option>
                  <option value="Instructor">Instructor (Giảng viên / Soạn lab)</option>
                  <option value="Learner">Learner (Học viên tiêu chuẩn)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Trạng thái tài khoản
                </label>
                <select
                  value={selectedUser.status}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, status: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="active">Hoạt động bình thường</option>
                  <option value="suspended">Tạm khóa (Cách ly bảo mật)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button variant="primary" size="sm" type="submit" leftIcon={<Save className="h-3.5 w-3.5" />}>
                  Lưu thay đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Thêm Chuyên Viên / Học Viên Mới
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Tuấn Anh"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Địa chỉ email
                </label>
                <input
                  type="email"
                  required
                  placeholder="tuananh@cyberpath.edu.vn"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Cấp bậc vai trò
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Learner">Learner (Học viên)</option>
                  <option value="Security Analyst">Security Analyst (Chuyên viên SOC)</option>
                  <option value="SOC Lead">SOC Lead (Trưởng ca)</option>
                  <option value="Instructor">Instructor (Giảng viên)</option>
                  <option value="Super Admin">Super Admin (Quản trị viên)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button variant="primary" size="sm" type="submit" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>
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
