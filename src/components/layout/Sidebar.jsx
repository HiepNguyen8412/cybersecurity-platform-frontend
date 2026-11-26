import { NavLink, Link } from "react-router-dom"
import {
  RiDashboard3Line,
  RiBookOpenLine,
  RiCompassDiscoverLine,
  RiTerminalBoxLine,
  RiCpuLine,
  RiVerifiedBadgeLine,
  RiShieldCheckLine,
  RiUserSettingsLine,
  RiServerLine,
  RiFolderShield2Line,
  RiFileHistoryLine,
  RiSettings4Line,
  RiLineChartLine,
  RiMedalLine,
  RiUser3Line,
  RiEqualizer3Line,
  RiArrowRightSLine,
  RiCloseLine,
} from "@remixicon/react"
import useLayout from "../../hooks/useLayout"
import useAuth from "../../hooks/useAuth"
import { Avatar } from "../common"

const ROLE_LABELS = {
  ADMIN: "Quản trị viên SOC",
  SUPER_ADMIN: "Quản trị viên SOC",
  ADMINISTRATOR: "Quản trị viên SOC",
  ROLE_ADMIN: "Quản trị viên SOC",
  ROLE_SUPER_ADMIN: "Quản trị viên SOC",
  INSTRUCTOR: "Giảng viên Nghiên cứu",
  ROLE_INSTRUCTOR: "Giảng viên Nghiên cứu",
  MENTOR: "Giảng viên Nghiên cứu",
  USER: "Học viên Nghiên cứu",
  ROLE_USER: "Học viên Nghiên cứu",
  STUDENT: "Học viên Nghiên cứu",
  ROLE_STUDENT: "Học viên Nghiên cứu",
  LEARNER: "Học viên Nghiên cứu",
  ROLE_LEARNER: "Học viên Nghiên cứu",
  "SECURITY ANALYST": "Chuyên viên An ninh mạng",
  SECURITY_ANALYST: "Chuyên viên An ninh mạng",
  ANALYST: "Chuyên viên An ninh mạng",
}

function formatRoleLabel(role, roles) {
  if (Array.isArray(roles)) {
    const normalizedRoles = roles.map((item) => String(item).trim().toUpperCase())
    if (
      normalizedRoles.some((item) =>
        ["ADMIN", "SUPER_ADMIN", "ADMINISTRATOR", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"].includes(item)
      )
    ) {
      return "Quản trị viên SOC"
    }
    for (const item of normalizedRoles) {
      if (ROLE_LABELS[item]) return ROLE_LABELS[item]
    }
  }
  if (!role) return "Học viên An ninh mạng"
  const normalized = String(role).trim().toUpperCase()
  return ROLE_LABELS[normalized] || "Học viên An ninh mạng"
}

const NAVIGATION_GROUPS = [
  {
    group: "HỌC TẬP & NGHIÊN CỨU",
    items: [
      { label: "Trung tâm điều hành", icon: RiDashboard3Line, path: "/dashboard" },
      { label: "Giáo trình bài giảng", icon: RiBookOpenLine, path: "/learning" },
      { label: "Lộ trình chuyên môn", icon: RiCompassDiscoverLine, path: "/learning-paths" },
      { label: "Phòng Lab thực chiến", icon: RiTerminalBoxLine, path: "/labs" },
      { label: "AI Research Workbench", icon: RiCpuLine, path: "/workbench" },
      { label: "Xác thực Chứng chỉ", icon: RiVerifiedBadgeLine, path: "/verify" },
    ],
  },
  {
    group: "QUẢN TRỊ HỆ THỐNG (SOC)",
    items: [
      { label: "Trung tâm chỉ huy", icon: RiShieldCheckLine, path: "/admin" },
      { label: "Quản lý người dùng", icon: RiUserSettingsLine, path: "/admin/users" },
      { label: "Quản trị phòng Lab", icon: RiServerLine, path: "/admin/labs" },
      { label: "Quản trị khóa học", icon: RiFolderShield2Line, path: "/admin/courses" },
      { label: "Nhật ký kiểm toán", icon: RiFileHistoryLine, path: "/admin/audit-logs" },
      { label: "Cấu hình quản trị", icon: RiSettings4Line, path: "/admin/settings" },
    ],
  },
  {
    group: "TIẾN ĐỘ & NĂNG LỰC",
    items: [
      { label: "Thống kê năng lực", icon: RiLineChartLine, path: "/progress" },
      { label: "Huy hiệu & Chứng chỉ", icon: RiMedalLine, path: "/achievements" },
    ],
  },
  {
    group: "TÀI KHOẢN & CẤU HÌNH",
    items: [
      { label: "Hồ sơ cá nhân", icon: RiUser3Line, path: "/profile" },
      { label: "Cài đặt hệ thống", icon: RiEqualizer3Line, path: "/settings" },
    ],
  },
]

/**
 * Academic Research Atelier Sidebar.
 * Supports Editorial Light & Deep Obsidian Dark with expanded (240px) / collapsed (72px) desktop states
 * and an accessible mobile drawer.
 */
export function Sidebar() {
  const {
    isSidebarCollapsed,
    isMobileMenuOpen,
    closeMobileMenu,
  } = useLayout()

  const { user } = useAuth()
  const displayName = user?.fullName || user?.name || "Học viên"
  const displayRole = formatRoleLabel(user?.role, user?.roles)

  const renderSidebarContent = (isCollapsed) => (
    <div className="flex h-full flex-col bg-white dark:bg-[#0E131D] border-r border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] transition-colors select-none">
      {/* Đầu trang Thương hiệu */}
      <div
        className={`flex h-16 items-center border-b border-[#E5E2DC] dark:border-white/[0.08] ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6] rounded-lg group min-w-0"
          onClick={closeMobileMenu}
          title="CyberPath — Học viện An ninh mạng"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8] dark:bg-[#2563EB] text-white border border-[#1E40AF]/20 dark:border-white/[0.12] transition-colors group-hover:bg-[#1E40AF] dark:group-hover:bg-[#3B82F6]">
            <RiShieldCheckLine className="h-5 w-5" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-serif-editorial text-lg font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-none">
                Cyber<span className="text-[#1D4ED8] dark:text-[#38BDF8]">Path</span>
              </span>
              <span className="text-[9.5px] font-mono-tech font-medium tracking-[0.14em] text-[#64748B] dark:text-[#94A3B8] uppercase leading-none mt-1 truncate">
                HỌC VIỆN AN NINH MẠNG
              </span>
            </div>
          )}
        </Link>

        {/* Nút đóng menu trên thiết bị di động */}
        {!isCollapsed && (
          <div className="flex items-center md:hidden shrink-0">
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
              aria-label="Đóng menu điều hướng"
            >
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Danh mục điều hướng */}
      <nav
        aria-label="Điều hướng nền tảng"
        className={`flex-1 overflow-y-auto py-4 space-y-4 ${
          isCollapsed ? "px-2" : "px-3"
        }`}
      >
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            {isCollapsed ? (
              <div className="my-2 border-t border-[#EFEDE7] dark:border-white/[0.06]" />
            ) : (
              <p className="px-3 pb-1 text-[10px] font-mono-tech font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#64748B]">
                {group.group}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin" || item.path === "/dashboard" || item.path === "/verify"}
                    onClick={closeMobileMenu}
                    title={item.label}
                    aria-label={item.label}
                    className={({ isActive }) => `
                      group relative flex items-center rounded-xl text-xs transition-colors duration-150
                      ${
                        isCollapsed
                          ? "justify-center p-2"
                          : "gap-3 px-3 py-2"
                      }
                      ${
                        isActive
                          ? "bg-[#1D4ED8]/[0.08] dark:bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#F1F5F9] font-semibold border border-[#1D4ED8]/20 dark:border-[#3B82F6]/30"
                          : "text-[#475569] dark:text-[#94A3B8] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] border border-transparent font-medium"
                      }
                    `.trim()}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[#1D4ED8] dark:bg-[#38BDF8]"
                            aria-hidden="true"
                          />
                        )}

                        <span
                          className={`
                            flex items-center justify-center rounded-lg transition-colors duration-150 shrink-0
                            ${isCollapsed ? "w-9 h-9" : "w-7.5 h-7.5"}
                            ${
                              isActive
                                ? "bg-white dark:bg-[#121722] border border-[#1D4ED8]/25 dark:border-[#3B82F6]/40 text-[#1D4ED8] dark:text-[#38BDF8]"
                                : "bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.07] text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] group-hover:bg-white dark:group-hover:bg-[#1B2335]"
                            }
                          `.trim()}
                        >
                          <Icon className="w-4 h-4" />
                        </span>

                        {!isCollapsed && (
                          <span className="truncate leading-none tracking-tight">{item.label}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Thẻ trạng thái môi trường cô lập (tĩnh, sạch sẽ) */}
      {!isCollapsed && (
        <div className="mx-3 mb-2 p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[10px] space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[#475569] dark:text-[#94A3B8] font-semibold uppercase tracking-wider">
              <RiShieldCheckLine className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>THAO TRƯỜNG LAB</span>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              SẴN SÀNG
            </span>
          </div>
          <div className="text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between pt-1 border-t border-[#EFEDE7] dark:border-white/[0.06]">
            <span>Cô lập Container</span>
            <span className="text-[#1D4ED8] dark:text-[#93C5FD] font-semibold">NIST / OWASP</span>
          </div>
        </div>
      )}

      {/* Tóm tắt tài khoản người dùng */}
      <div className={`border-t border-[#E5E2DC] dark:border-white/[0.08] ${isCollapsed ? "p-2" : "p-3"}`}>
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className={`flex items-center rounded-xl hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors group cursor-pointer ${
            isCollapsed ? "justify-center p-2" : "justify-between p-2"
          }`}
          title={`${displayName} (${displayRole}) — Xem hồ sơ`}
        >
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5 min-w-0"}`}>
            <Avatar name={displayName} size="sm" status="online" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight truncate group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight truncate">
                  {displayRole}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <RiArrowRightSLine className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0F172A] dark:group-hover:text-[#F1F5F9] shrink-0 transition-transform group-hover:translate-x-0.5" />
          )}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Thanh bên Desktop cố định bên trái (240px mở rộng / 72px thu gọn) */}
      <aside
        aria-label="Thanh bên điều hướng nền tảng"
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? "w-[72px]" : "w-60"
        }`}
      >
        {renderSidebarContent(isSidebarCollapsed)}
      </aside>

      {/* Ngăn kéo điều hướng trên thiết bị di động */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu điều hướng di động"
          className="fixed inset-0 z-50 md:hidden"
        >
          <div
            className="fixed inset-0 bg-[#0F172A]/50 dark:bg-black/75 backdrop-blur-xs transition-opacity"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
