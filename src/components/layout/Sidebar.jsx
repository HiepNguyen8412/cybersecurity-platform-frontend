import { NavLink, Link } from "react-router-dom"
import {
  RiDashboard3Line,
  RiBookOpenLine,
  RiCompassDiscoverLine,
  RiTerminalBoxLine,
  RiShieldFlashFill,
  RiUserSettingsLine,
  RiCpuLine,
  RiFolderShield2Line,
  RiFileHistoryLine,
  RiLineChartLine,
  RiMedalLine,
  RiUser3Line,
  RiEqualizer3Line,
  RiRadarLine,
  RiArrowRightSLine,
  RiCloseLine,
} from "@remixicon/react"
import useLayout from "../../hooks/useLayout"
import useAuth from "../../hooks/useAuth"
import { Avatar } from "../common"

/**
 * Premium Bespoke Cybersecurity Platform Sidebar.
 * - Powered by @remixicon/react tailored security iconography.
 * - Sculpted "Icon Vessels" with dynamic multi-layer glass borders and jewel gradients.
 * - Clean, non-generic typography with high-contrast tactical telemetry.
 * - Supports expanded (240px) & collapsed (72px) desktop states + responsive mobile drawer.
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

  // Navigation structure: LEARN, PROGRESS, ADMIN, ACCOUNT with Remix Icons
  const navigationGroups = [
    {
      group: "HỌC TẬP & RÈN LUYỆN",
      items: [
        { label: "Trung tâm điều hành", icon: RiDashboard3Line, path: "/dashboard" },
        { label: "Giáo trình bài giảng", icon: RiBookOpenLine, path: "/learning" },
        { label: "Lộ trình chuyên môn", icon: RiCompassDiscoverLine, path: "/learning-paths" },
        { label: "Phòng Lab thực chiến", icon: RiTerminalBoxLine, path: "/labs" },
      ],
    },
    {
      group: "QUẢN TRỊ VIÊN // SOC ADMIN",
      items: [
        { label: "Trung tâm chỉ huy", icon: RiShieldFlashFill, path: "/admin" },
        { label: "Quản lý người dùng", icon: RiUserSettingsLine, path: "/admin/users" },
        { label: "Quản trị phòng Lab", icon: RiCpuLine, path: "/admin/labs" },
        { label: "Quản trị khóa học", icon: RiFolderShield2Line, path: "/admin/courses" },
        { label: "Nhật ký kiểm toán", icon: RiFileHistoryLine, path: "/admin/audit-logs" },
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

  const renderSidebarContent = (isCollapsed) => (
    <div className="flex h-full flex-col bg-white dark:bg-[#0c1019] cyberpunk:bg-[#051726] border-r border-slate-200/90 dark:border-white/[0.08] cyberpunk:border-cyan-500/40 text-slate-900 dark:text-white cyberpunk:text-cyan-50 transition-colors select-none">
      {/* Brand Header */}
      <div
        className={`flex h-16 items-center border-b border-slate-200/90 dark:border-white/[0.08] cyberpunk:border-cyan-500/40 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"
        }`}
      >
        <Link
          to="/"
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl group"
          onClick={closeMobileMenu}
          title="CyberPath - Trang chủ"
        >
          {/* Custom Sculpted Shield Vessel */}
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-600 cyberpunk:bg-blue-600 text-white cyberpunk:text-white shadow-md shadow-indigo-600/30 dark:shadow-indigo-950/50 cyberpunk:shadow-blue-500/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
            <RiShieldFlashFill className="h-5.5 w-5.5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 ring-2 ring-white dark:ring-[#090a0f]" />
            </span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white cyberpunk:text-white leading-tight">
                Cyber<span className="text-indigo-600 dark:text-indigo-400 cyberpunk:text-cyan-400">Path</span>
              </span>
              <span className="text-[10px] font-mono-tech tracking-widest text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/90 uppercase leading-tight mt-0.5">
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
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav
        aria-label="Điều hướng nền tảng"
        className={`flex-1 overflow-y-auto py-4 space-y-4 ${
          isCollapsed ? "px-2" : "px-3"
        }`}
      >
        {navigationGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {isCollapsed ? (
              <div className="my-2 border-t border-slate-100 dark:border-white/[0.06] cyberpunk:border-cyan-500/20" />
            ) : (
              <p className="px-3 pb-1 text-[10px] font-mono-tech font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400/80">
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
                    end={item.path === "/admin" || item.path === "/dashboard"}
                    onClick={closeMobileMenu}
                    title={item.label}
                    aria-label={item.label}
                    className={({ isActive }) => `
                      group relative flex items-center rounded-xl text-xs font-medium transition-all duration-200
                      ${
                        isCollapsed
                          ? "justify-center p-2"
                          : "gap-3 px-3 py-2"
                      }
                      ${
                        isActive
                          ? "bg-blue-50/80 dark:bg-blue-950/40 cyberpunk:bg-cyan-950/50 text-blue-700 dark:text-white cyberpunk:text-cyan-200 font-semibold border border-blue-200/80 dark:border-blue-500/30 cyberpunk:border-cyan-500/50 shadow-xs"
                          : "text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200/90 hover:bg-slate-100/70 dark:hover:bg-white/[0.04] cyberpunk:hover:bg-cyan-950/30 hover:text-slate-900 dark:hover:text-white border border-transparent"
                      }
                    `.trim()}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active vertical accent bar */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                            aria-hidden="true"
                          />
                        )}

                        {/* Sculpted Icon Vessel */}
                        <span
                          className={`
                            flex items-center justify-center rounded-lg transition-all duration-200 shrink-0
                            ${isCollapsed ? "w-9 h-9" : "w-7.5 h-7.5"}
                            ${
                              isActive
                                ? "bg-indigo-50 dark:bg-indigo-950/60 cyberpunk:bg-emerald-950/60 border border-indigo-200 dark:border-indigo-700/50 cyberpunk:border-emerald-500/40 text-indigo-600 dark:text-indigo-400 cyberpunk:text-emerald-300 shadow-2xs"
                                : "bg-slate-100/80 dark:bg-white/[0.04] cyberpunk:bg-emerald-950/20 border border-slate-200/60 dark:border-white/5 cyberpunk:border-emerald-500/20 text-slate-500 dark:text-slate-400 cyberpunk:text-emerald-400/80 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 group-hover:bg-indigo-50/70 dark:group-hover:bg-white/[0.08] group-hover:border-indigo-200/70 dark:group-hover:border-white/10"
                            }
                          `.trim()}
                        >
                          <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
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

      {/* Cyber Sandbox Telemetry Widget (Desktop expanded only) */}
      {!isCollapsed && (
        <div className="mx-3 mb-2 p-2.5 rounded-xl bg-slate-50/90 dark:bg-[#111726] cyberpunk:bg-[#07243c] border border-slate-200/90 dark:border-white/[0.08] cyberpunk:border-cyan-400/50 font-mono-tech text-[10px] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400 font-bold uppercase tracking-wider">
              <RiRadarLine className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span>SANDBOX OPS</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-200 flex items-center justify-between pt-0.5 border-t border-slate-200/60 dark:border-white/5">
            <span>NODE: #412</span>
            <span>PING: 18ms</span>
            <span className="text-blue-600 dark:text-cyan-400 font-bold">ISOLATED</span>
          </div>
        </div>
      )}

      {/* Bottom User Profile Summary */}
      <div className={`border-t border-slate-200/90 dark:border-white/[0.08] cyberpunk:border-cyan-500/40 ${isCollapsed ? "p-2" : "p-3"}`}>
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className={`flex items-center rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/[0.05] cyberpunk:hover:bg-cyan-950/40 transition-colors group cursor-pointer ${
            isCollapsed ? "justify-center p-2" : "justify-between p-2"
          }`}
          title={`${displayName} (${displayRole}) - Xem hồ sơ`}
        >
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5 min-w-0"}`}>
            <Avatar name={displayName} size="sm" status="online" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 cyberpunk:text-cyan-50 leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/90 leading-tight truncate">
                  {displayRole}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <RiArrowRightSLine className="h-4 w-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 cyberpunk:group-hover:text-cyan-300 shrink-0 transition-transform group-hover:translate-x-0.5" />
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
