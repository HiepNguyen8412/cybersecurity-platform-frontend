import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import useLayout from "../../hooks/useLayout"
import useAuth from "../../hooks/useAuth"
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Breadcrumb,
} from "../common"
import ThemeToggle from "./ThemeToggle"

/**
 * Topbar for authenticated application.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function Navbar() {
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    openMobileMenu,
    pageTitle,
    breadcrumbs: customBreadcrumbs,
  } = useLayout()

  const { user, logout } = useAuth()
  const displayName = user?.fullName || user?.name || "Học viên"
  const displayEmail = user?.email || "student@cyberpath.edu.vn"
  const displayRole = user?.role || "Security Analyst"

  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  // Dynamic friendly breadcrumbs mapping for current route
  const getBreadcrumbs = () => {
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs
    }

    const path = location.pathname
    switch (path) {
      case "/dashboard":
        return [
          { label: "Trung tâm", href: "/dashboard" },
          { label: "Bàn điều khiển" },
        ]
      case "/learning":
        return [
          { label: "Đào tạo", href: "/learning" },
          { label: "Khóa học & Module" },
        ]
      case "/learning-paths":
        return [
          { label: "Đào tạo", href: "/learning-paths" },
          { label: "Lộ trình chuyên môn" },
        ]
      case "/labs":
        return [
          { label: "Thực hành", href: "/labs" },
          { label: "Phòng Lab & CTF" },
        ]
      case "/progress":
        return [
          { label: "Năng lực", href: "/progress" },
          { label: "Thống kê kỹ năng" },
        ]
      case "/achievements":
        return [
          { label: "Năng lực", href: "/achievements" },
          { label: "Huy hiệu & Chứng chỉ" },
        ]
      case "/profile":
        return [
          { label: "Tài khoản", href: "/profile" },
          { label: "Hồ sơ bảo mật" },
        ]
      case "/settings":
        return [
          { label: "Tài khoản", href: "/settings" },
          { label: "Cấu hình hệ thống" },
        ]
      default:
        return [
          { label: "Nền tảng", href: "/dashboard" },
          { label: pageTitle || "Tổng quan" },
        ]
    }
  }

  const breadcrumbItems = getBreadcrumbs()

  const sampleNotifications = [
    {
      id: 1,
      title: "Lab thực chiến mới",
      desc: "SQL Injection: Filter Evasion đã được mở trên hệ thống.",
      time: "10 phút trước",
      unread: true,
    },
    {
      id: 2,
      title: "Huy hiệu mới",
      desc: "Bạn đã đạt danh hiệu 'Packet Inspector' xuất sắc.",
      time: "2 giờ trước",
      unread: true,
    },
    {
      id: 3,
      title: "Nhắc nhở chuỗi học tập",
      desc: "Hoàn thành 1 bài tập hôm nay để duy trì chuỗi 7 ngày.",
      time: "1 ngày trước",
      unread: false,
    },
  ]

  return (
    <header
      className={`
        fixed top-0 right-0 left-0 z-30 h-16 bg-white/95 dark:bg-[#121824]/95 cyberpunk:bg-[#040d1a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#222d42] cyberpunk:border-cyan-500/50 text-slate-900 dark:text-white cyberpunk:text-cyan-50 transition-all duration-200 ease-in-out
        ${isSidebarCollapsed ? "md:left-[72px]" : "md:left-60"}
      `.trim()}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile hamburger + Desktop toggle + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={openMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cyberpunk:hover:bg-cyan-950/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Mở menu điều hướng"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="hidden md:flex p-2 text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cyberpunk:hover:bg-cyan-950/60 rounded-lg transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            aria-label={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>

          <div className="flex items-center min-w-0 overflow-hidden">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md mx-3 hidden sm:block">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm kỹ thuật MITRE, mã CVE, bài lab..."
              className="w-full rounded-xl border border-slate-200/90 dark:border-slate-700/80 cyberpunk:border-cyan-500/40 bg-slate-50/70 dark:bg-slate-800/90 cyberpunk:bg-[#071329] py-1.5 pl-9 pr-9 text-xs sm:text-sm text-slate-900 dark:text-white cyberpunk:text-cyan-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 cyberpunk:placeholder:text-cyan-500/60 outline-none transition duration-150 focus:border-blue-600 dark:focus:border-cyan-400 cyberpunk:focus:border-cyan-400 focus:bg-white dark:focus:bg-slate-800 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cyberpunk:hover:text-cyan-300 cursor-pointer transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Security Status + Notifications & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/90 dark:bg-emerald-950/60 cyberpunk:bg-[#042f2e] border border-emerald-200/80 dark:border-emerald-800/60 cyberpunk:border-emerald-500/60 text-emerald-800 dark:text-emerald-300 cyberpunk:text-emerald-300 text-[11px] font-mono-tech">
            <span className="cyber-pulse-dot text-emerald-500" />
            <span className="font-semibold">DEFENSE: ACTIVE</span>
          </div>

          <ThemeToggle />

          {/* Notifications Dropdown */}
          <Dropdown
            align="right"
            width="w-80 sm:w-88"
            trigger={({ isOpen }) => (
              <button
                type="button"
                className={`relative p-2 rounded-lg text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cyberpunk:hover:bg-cyan-950/60 transition-colors cursor-pointer ${
                  isOpen ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : ""
                }`}
                aria-label="Xem thông báo"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-cyan-400" />
                </span>
              </button>
            )}
          >
            {({ close }) => (
              <div className="bg-white dark:bg-slate-900 cyberpunk:bg-[#060e1d] text-slate-900 dark:text-white border border-slate-200 dark:border-[#222d42] cyberpunk:border-cyan-500/50 rounded-xl overflow-hidden shadow-xl">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Thông báo</span>
                    <Badge variant="primary" size="sm">
                      2 mới
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
                  >
                    Đã đọc hết
                  </button>
                </div>

                <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        notif.unread ? "bg-blue-50/40 dark:bg-blue-950/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 leading-normal">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 block py-1"
                  >
                    Xem tất cả thông báo
                  </Link>
                </div>
              </div>
            )}
          </Dropdown>

          {/* User Profile Dropdown */}
          <Dropdown
            align="right"
            width="w-56"
            trigger={({ isOpen }) => (
              <button
                type="button"
                className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cyberpunk:hover:bg-cyan-950/60 transition-colors cursor-pointer select-none ${
                  isOpen ? "bg-slate-100 dark:bg-slate-800" : ""
                }`}
                aria-label="Mở menu người dùng"
              >
                <Avatar name={displayName} size="sm" status="online" />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {displayRole}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" />
              </button>
            )}
          >
            {({ close }) => (
              <div className="bg-white dark:bg-slate-900 cyberpunk:bg-[#060e1d] text-slate-900 dark:text-white border border-slate-200 dark:border-[#222d42] cyberpunk:border-cyan-500/50 rounded-xl overflow-hidden shadow-xl">
                <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{displayName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {displayEmail}
                  </p>
                  <div className="mt-2">
                    <Badge variant="primary" size="sm">
                      {displayRole}
                    </Badge>
                  </div>
                </div>

                <div className="py-1">
                  <DropdownItem icon={<User className="h-4 w-4" />} onClick={() => { close(); navigate("/profile"); }}>
                    Hồ sơ cá nhân
                  </DropdownItem>
                  <DropdownItem icon={<Settings className="h-4 w-4" />} onClick={() => { close(); navigate("/settings"); }}>
                    Cài đặt bảo mật
                  </DropdownItem>
                </div>

                <DropdownDivider />

                <div className="py-1">
                  <DropdownItem
                    icon={<LogOut className="h-4 w-4 text-rose-500" />}
                    onClick={() => { close(); logout(); }}
                    className="text-rose-600 dark:text-rose-400"
                  >
                    Đăng xuất
                  </DropdownItem>
                </div>
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  )
}

export default Navbar
