import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  RiMenuLine,
  RiCloseLine,
  RiSearchLine,
  RiNotification3Line,
  RiSideBarLine,
  RiUser3Line,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiArrowDownSLine,
} from "@remixicon/react"
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
 * Upgraded with @remixicon/react icons and Obsidian Titanium aesthetic.
 */
export function Navbar() {
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    openMobileMenu,
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
          { label: "Nền tảng", href: "/dashboard" },
          { label: "Trung tâm điều hành" },
        ]
      case "/learning":
        return [
          { label: "Học tập", href: "/learning" },
          { label: "Giáo trình bài giảng" },
        ]
      case "/learning-paths":
        return [
          { label: "Học tập", href: "/learning" },
          { label: "Lộ trình chuyên môn" },
        ]
      case "/labs":
        return [
          { label: "Thực hành", href: "/labs" },
          { label: "Phòng Lab thực chiến" },
        ]
      case "/progress":
        return [
          { label: "Hồ sơ", href: "/progress" },
          { label: "Thống kê năng lực" },
        ]
      case "/achievements":
        return [
          { label: "Hồ sơ", href: "/progress" },
          { label: "Huy hiệu & Chứng chỉ" },
        ]
      case "/profile":
        return [
          { label: "Tài khoản", href: "/profile" },
          { label: "Hồ sơ cá nhân" },
        ]
      case "/settings":
        return [
          { label: "Hệ thống", href: "/settings" },
          { label: "Cài đặt & Bảo mật" },
        ]
      case "/admin":
      case "/admin/dashboard":
        return [
          { label: "SOC Admin", href: "/admin" },
          { label: "Trung tâm chỉ huy" },
        ]
      case "/admin/users":
        return [
          { label: "SOC Admin", href: "/admin" },
          { label: "Quản lý người dùng" },
        ]
      case "/admin/labs":
        return [
          { label: "SOC Admin", href: "/admin" },
          { label: "Quản trị phòng Lab" },
        ]
      case "/admin/courses":
        return [
          { label: "SOC Admin", href: "/admin" },
          { label: "Quản trị khóa học" },
        ]
      case "/admin/audit-logs":
        return [
          { label: "SOC Admin", href: "/admin" },
          { label: "Nhật ký kiểm toán" },
        ]
      case "/admin/settings":
        return [
          { label: "SOC Admin", href: "/admin" },
          { label: "Cấu hình hệ thống" },
        ]
      default:
        return [
          { label: "CyberPath", href: "/dashboard" },
          { label: "Tổng quan" },
        ]
    }
  }

  const breadcrumbItems = getBreadcrumbs()

  const sampleNotifications = [
    {
      id: 1,
      title: "Phát hiện tấn công mô phỏng",
      desc: "Hệ thống IDS vừa ghi nhận 3 cảnh báo SQL Injection tại phòng Lab #02.",
      time: "5 phút trước",
      unread: true,
    },
    {
      id: 2,
      title: "Chứng chỉ mới khả dụng",
      desc: "Bạn đã đủ điều kiện nhận chứng chỉ SOC Level 1 Analyst.",
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
        fixed top-0 right-0 left-0 z-30 h-16 bg-white/85 dark:bg-[#08090d]/85 cyberpunk:bg-[#051726]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] cyberpunk:border-cyan-500/40 text-slate-900 dark:text-white cyberpunk:text-cyan-50 transition-all duration-200 ease-in-out select-none
        ${isSidebarCollapsed ? "md:left-[72px]" : "md:left-60"}
      `.trim()}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile hamburger + Desktop toggle + Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={openMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
            aria-label="Mở menu điều hướng"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="hidden md:flex p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            aria-label={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            <RiSideBarLine className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center min-w-0 overflow-hidden">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md mx-3 hidden sm:block">
          <div className="relative flex items-center w-full">
            <RiSearchLine className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm kỹ thuật MITRE, mã CVE, bài lab..."
              className="w-full rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.04] py-1.5 pl-10 pr-9 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition duration-150 focus:border-indigo-500/70 dark:focus:border-indigo-400/60 focus:bg-white dark:focus:bg-[#0d1017] shadow-2xs font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                aria-label="Xóa tìm kiếm"
              >
                <RiCloseLine className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Security Status + Notifications & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-medium shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>PHÒNG THỦ: ĐANG BẬT</span>
          </div>

          <ThemeToggle />

          {/* Notifications Dropdown */}
          <Dropdown
            align="right"
            width="w-80 sm:w-88"
            trigger={({ isOpen }) => (
              <button
                type="button"
                className={`relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer ${
                  isOpen ? "bg-slate-100 dark:bg-white/[0.06] text-slate-900 dark:text-white" : ""
                }`}
                aria-label="Xem thông báo"
              >
                <RiNotification3Line className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                </span>
              </button>
            )}
          >
            {({ close }) => (
              <div className="bg-white dark:bg-[#0e121a] text-slate-900 dark:text-white border border-slate-200/90 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">Thông báo</span>
                    <Badge variant="primary" size="sm">
                      2 mới
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    Đã đọc hết
                  </button>
                </div>

                <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/[0.04]">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        notif.unread ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 border-t border-slate-100 dark:border-white/[0.06] text-center">
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline block py-0.5"
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
                className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer select-none ${
                  isOpen ? "bg-slate-100 dark:bg-white/[0.06]" : ""
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
                <RiArrowDownSLine className="h-4 w-4 text-slate-400 hidden sm:inline-block" />
              </button>
            )}
          >
            {({ close }) => (
              <div className="bg-white dark:bg-[#0e121a] text-slate-900 dark:text-white border border-slate-200/90 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
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
                  <DropdownItem icon={<RiUser3Line className="h-4 w-4" />} onClick={() => { close(); navigate("/profile"); }}>
                    Hồ sơ cá nhân
                  </DropdownItem>
                  <DropdownItem icon={<RiSettings4Line className="h-4 w-4" />} onClick={() => { close(); navigate("/settings"); }}>
                    Cài đặt bảo mật
                  </DropdownItem>
                </div>

                <DropdownDivider />

                <div className="py-1">
                  <DropdownItem
                    danger
                    icon={<RiLogoutBoxRLine className="h-4 w-4 text-rose-500" />}
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
