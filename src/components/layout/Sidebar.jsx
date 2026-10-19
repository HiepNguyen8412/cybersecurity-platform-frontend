import { NavLink, Link } from "react-router-dom"
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FlaskConical,
  TrendingUp,
  Award,
  User,
  Settings,
  ShieldCheck,
  ChevronRight,
  X,
  UserCheck,
  FileText,
} from "lucide-react"
import useLayout from "../../hooks/useLayout"
import useAuth from "../../hooks/useAuth"
import { Avatar } from "../common"

/**
 * Friendly, human, modern EdTech Sidebar.
 * Supports expanded (240px) and collapsed (72px) desktop states, plus full mobile drawer.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function Sidebar() {
  const {
    isSidebarCollapsed,
    isMobileMenuOpen,
    closeMobileMenu,
  } = useLayout()

  const { user } = useAuth()
  const displayName = user?.fullName || user?.name || "Học viên"
  const displayRole = user?.role || "Security Analyst"

  // Navigation structure: LEARN, PROGRESS, ADMIN, ACCOUNT
  const navigationGroups = [
    {
      group: "HỌC TẬP & RÈN LUYỆN",
      items: [
        { label: "Trung tâm điều hành", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Giáo trình bài giảng", icon: BookOpen, path: "/learning" },
        { label: "Lộ trình chuyên môn", icon: Compass, path: "/learning-paths" },
        { label: "Phòng Lab thực chiến", icon: FlaskConical, path: "/labs" },
      ],
    },
    {
      group: "QUẢN TRỊ VIÊN // SOC ADMIN",
      items: [
        { label: "Trung tâm chỉ huy", icon: ShieldCheck, path: "/admin" },
        { label: "Quản lý người dùng", icon: UserCheck, path: "/admin/users" },
        { label: "Quản trị phòng Lab", icon: FlaskConical, path: "/admin/labs" },
        { label: "Quản trị khóa học", icon: BookOpen, path: "/admin/courses" },
        { label: "Nhật ký kiểm toán", icon: FileText, path: "/admin/audit-logs" },
      ],
    },
    {
      group: "TIẾN ĐỘ & NĂNG LỰC",
      items: [
        { label: "Thống kê năng lực", icon: TrendingUp, path: "/progress" },
        { label: "Huy hiệu & Chứng chỉ", icon: Award, path: "/achievements" },
      ],
    },
    {
      group: "TÀI KHOẢN & CẤU HÌNH",
      items: [
        { label: "Hồ sơ cá nhân", icon: User, path: "/profile" },
        { label: "Cài đặt hệ thống", icon: Settings, path: "/settings" },
      ],
    },
  ]

  const renderSidebarContent = (isCollapsed) => (
    <div className="flex h-full flex-col bg-white dark:bg-[#121824] cyberpunk:bg-[#040d1a] border-r border-slate-200/80 dark:border-[#222d42] cyberpunk:border-cyan-500/50 text-slate-900 dark:text-white cyberpunk:text-cyan-50 transition-colors">
      {/* Brand Header */}
      <div
        className={`flex h-16 items-center border-b border-slate-200/80 dark:border-[#222d42] cyberpunk:border-cyan-500/50 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          onClick={closeMobileMenu}
          title="CyberPath - Trang chủ"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 cyberpunk:from-cyan-500 cyberpunk:to-blue-600 text-white shadow-2xs cyberpunk:shadow-sm">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
                CyberPath
              </span>
              <span className="text-[11px] font-mono-tech text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400 leading-tight">
                SEC-OPS RANGE
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        {!isCollapsed && (
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav
        aria-label="Điều hướng nền tảng"
        className={`flex-1 overflow-y-auto py-4 space-y-4 ${
          isCollapsed ? "px-2" : "px-3.5"
        }`}
      >
        {navigationGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {isCollapsed ? (
              <div className="my-2 border-t border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/20" />
            ) : (
              <p className="px-2.5 pb-1 text-[10px] font-mono-tech font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400 select-none">
                {group.group}
              </p>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    title={item.label}
                    aria-label={item.label}
                    className={({ isActive }) => `
                      group relative flex items-center rounded-xl text-sm font-medium transition-all duration-150 select-none
                      ${
                        isCollapsed
                          ? "justify-center px-0 py-2.5"
                          : "gap-3 px-3 py-2"
                      }
                      ${
                        isActive
                          ? "bg-blue-50/90 dark:bg-blue-950/60 cyberpunk:bg-cyan-950/70 text-blue-700 dark:text-blue-300 cyberpunk:text-cyan-300 font-semibold border border-blue-200/70 dark:border-blue-800/80 cyberpunk:border-cyan-500/60 shadow-2xs cyberpunk:shadow-sm"
                          : "text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200/80 hover:bg-slate-100/70 dark:hover:bg-slate-800/80 cyberpunk:hover:bg-cyan-950/40 hover:text-slate-900 dark:hover:text-white cyberpunk:hover:text-cyan-100 border border-transparent"
                      }
                    `.trim()}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Subtle active left indicator */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400 cyberpunk:bg-cyan-400 shadow-sm shadow-blue-500/50 cyberpunk:shadow-[0_0_8px_#22d3ee]"
                            aria-hidden="true"
                          />
                        )}

                        <Icon
                          className={`shrink-0 transition-colors ${
                            isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5"
                          } ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400 cyberpunk:text-cyan-400 stroke-[2.2]"
                              : "text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-500/70 group-hover:text-slate-700 dark:group-hover:text-slate-200 cyberpunk:group-hover:text-cyan-300 stroke-[1.8]"
                          }`}
                        />

                        {!isCollapsed && (
                          <span className="truncate leading-none">{item.label}</span>
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

      {/* Cyber Sandbox Telemetry Widget (Desktop expanded only) */}
      {!isCollapsed && (
        <div className="mx-3.5 mb-2 p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/80 cyberpunk:bg-[#071329] border border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/40 font-mono-tech text-[10px] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400 font-bold uppercase tracking-wider">LAB SANDBOX</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SẴN SÀNG
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200 flex items-center justify-between pt-0.5">
            <span>NODE: #412</span>
            <span>PING: 18ms</span>
            <span className="text-blue-600 dark:text-blue-400 cyberpunk:text-cyan-300 font-bold">CÔ LẬP</span>
          </div>
        </div>
      )}

      {/* Bottom User Profile Summary */}
      <div className={`border-t border-slate-200/80 dark:border-[#222d42] cyberpunk:border-cyan-500/50 ${isCollapsed ? "p-2" : "p-3"}`}>
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className={`flex items-center rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 cyberpunk:hover:bg-cyan-950/50 transition-colors group cursor-pointer ${
            isCollapsed ? "justify-center p-2" : "justify-between p-2"
          }`}
          title={`${displayName} (${displayRole}) - Xem hồ sơ`}
        >
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5 min-w-0"}`}>
            <Avatar name={displayName} size="sm" status="online" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 cyberpunk:text-cyan-50 leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 cyberpunk:group-hover:text-cyan-300 transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/90 leading-tight truncate">
                  {displayRole}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 cyberpunk:group-hover:text-cyan-300 shrink-0" />
          )}
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Fixed Left: width 240px expanded / 72px collapsed) */}
      <aside
        aria-label="Platform Sidebar"
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-200 ease-in-out ${
          isSidebarCollapsed ? "w-[72px]" : "w-60"
        }`}
      >
        {renderSidebarContent(isSidebarCollapsed)}
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
