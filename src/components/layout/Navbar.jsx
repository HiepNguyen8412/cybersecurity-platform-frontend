import { useState, useRef, useEffect } from "react"
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
  RiShieldCheckLine,
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

const INITIAL_NOTIFICATIONS = [
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
    desc: "Bạn đã đủ điều kiện xét duyệt chứng chỉ Phân tích SOC Cấp độ 1.",
    time: "2 giờ trước",
    unread: true,
  },
  {
    id: 3,
    title: "Nhắc nhở chuỗi học tập",
    desc: "Hoàn thành 1 bài thực hành hôm nay để duy trì tiến độ nghiên cứu.",
    time: "1 ngày trước",
    unread: false,
  },
]

const QUICK_SEARCH_DESTINATIONS = [
  { label: "AI Research Workbench (Phân tích CVE / AST)", path: "/workbench", keywords: "ai workbench ast cwe cve tls" },
  { label: "Phòng Lab thực chiến", path: "/labs", keywords: "lab sandbox sql xss mitre ctf" },
  { label: "Giáo trình bài giảng", path: "/learning", keywords: "khoa hoc giao trinh owasp" },
  { label: "Lộ trình chuyên môn", path: "/learning-paths", keywords: "lo trinh soc red blue" },
  { label: "Xác thực Chứng chỉ", path: "/verify", keywords: "xac thuc chung chi sha256 verify" },
  { label: "Thống kê năng lực", path: "/progress", keywords: "tien do nang luc thong ke" },
]

/**
 * Topbar for authenticated application.
 * Aligned to CyberPath v2 ("Academic Research Atelier") in Editorial Light & Deep Obsidian Dark.
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
  const displayRole = formatRoleLabel(user?.role, user?.roles)

  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const searchContainerRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const unreadCount = notifications.filter((item) => item.unread).length

  const markAllNotificationsRead = (closeMenu) => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })))
    closeMenu?.()
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const matchingDestinations = normalizedQuery
    ? QUICK_SEARCH_DESTINATIONS.filter(
        (item) =>
          item.label.toLowerCase().includes(normalizedQuery) ||
          item.keywords.includes(normalizedQuery) ||
          item.path.includes(normalizedQuery)
      )
    : []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!normalizedQuery) return
    const targetPath = matchingDestinations[0]?.path || "/labs"
    setIsSearchFocused(false)
    navigate(targetPath)
  }

  const getBreadcrumbs = () => {
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs
    }

    const path = location.pathname
    if (path === "/verify" || path.startsWith("/verify/")) {
      return [
        { label: "Học thuật", href: "/verify" },
        { label: "Xác thực Chứng chỉ" },
      ]
    }

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
      case "/workbench":
        return [
          { label: "Nghiên cứu", href: "/workbench" },
          { label: "AI Research Workbench" },
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
          { label: "Quản trị SOC", href: "/admin" },
          { label: "Trung tâm chỉ huy" },
        ]
      case "/admin/users":
        return [
          { label: "Quản trị SOC", href: "/admin" },
          { label: "Quản lý người dùng" },
        ]
      case "/admin/labs":
        return [
          { label: "Quản trị SOC", href: "/admin" },
          { label: "Quản trị phòng Lab" },
        ]
      case "/admin/courses":
        return [
          { label: "Quản trị SOC", href: "/admin" },
          { label: "Quản trị khóa học" },
        ]
      case "/admin/audit-logs":
        return [
          { label: "Quản trị SOC", href: "/admin" },
          { label: "Nhật ký kiểm toán" },
        ]
      case "/admin/settings":
        return [
          { label: "Quản trị SOC", href: "/admin" },
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

  return (
    <header
      className={`
        fixed top-0 right-0 left-0 z-30 h-16 bg-white/90 dark:bg-[#0E131D]/90 backdrop-blur-md border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] transition-all duration-200 ease-in-out select-none
        ${isSidebarCollapsed ? "md:left-[72px]" : "md:left-60"}
      `.trim()}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-3">
        {/* Trái: Nút mở menu mobile + Thu gọn thanh bên + Đường dẫn phân cấp */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={openMobileMenu}
            className="md:hidden p-2 -ml-1 text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] rounded-xl transition-colors cursor-pointer"
            aria-label="Mở menu điều hướng"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={toggleSidebarCollapse}
            className="hidden md:flex p-2 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] rounded-xl transition-colors cursor-pointer"
            title={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            aria-label={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
          >
            <RiSideBarLine className="h-4.5 w-4.5" />
          </button>

          <div className="flex items-center min-w-0 overflow-hidden">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Giữa: Tìm kiếm toàn cục */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-3 hidden sm:block">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <label htmlFor="app-navbar-search" className="sr-only">
              Tìm kiếm kỹ thuật MITRE, mã CVE, bài lab
            </label>
            <RiSearchLine className="absolute left-3.5 h-4 w-4 text-[#64748B] dark:text-[#94A3B8] pointer-events-none" />
            <input
              id="app-navbar-search"
              name="navbarSearch"
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setIsSearchFocused(true)
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsSearchFocused(false)
                }
              }}
              placeholder="Tìm kiếm kỹ thuật MITRE, mã CVE, bài lab..."
              className="w-full rounded-xl border border-[#E5E2DC] dark:border-white/[0.09] bg-[#F3F1EC]/80 dark:bg-[#161C2A] py-1.5 pl-10 pr-9 text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] outline-none transition duration-150 focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] focus:bg-white dark:focus:bg-[#121722] font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer transition-colors"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <RiCloseLine className="h-4 w-4" />
              </button>
            )}
          </form>

          {isSearchFocused && normalizedQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.09] shadow-lg p-1.5 z-50">
              {matchingDestinations.length > 0 ? (
                matchingDestinations.map((dest) => (
                  <button
                    key={dest.path}
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false)
                      setSearchQuery("")
                      navigate(dest.path)
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
                  >
                    <span className="font-medium truncate">{dest.label}</span>
                    <span className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8] shrink-0 ml-2">
                      {dest.path}
                    </span>
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchFocused(false)
                    navigate("/labs")
                  }}
                  className="w-full px-3 py-2 rounded-lg text-xs text-left text-[#475569] dark:text-[#94A3B8] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
                >
                  Tìm kiếm &ldquo;{searchQuery.trim()}&rdquo; trong Phòng Lab thực chiến
                </button>
              )}
            </div>
          )}
        </div>

        {/* Phải: Trạng thái cô lập + Chuyển giao diện + Thông báo + Menu tài khoản */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/12 border border-emerald-200/80 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono-tech font-medium">
            <RiShieldCheckLine className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>MÔI TRƯỜNG CÔ LẬP: SẴN SÀNG</span>
          </div>

          <ThemeToggle />

          {/* Menu Thông báo */}
          <Dropdown
            align="right"
            width="w-80 sm:w-88"
            trigger={({ isOpen }) => (
              <button
                type="button"
                className={`relative p-2 rounded-xl text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer ${
                  isOpen ? "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9]" : ""
                }`}
                aria-label="Xem thông báo"
              >
                <RiNotification3Line className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#1D4ED8] dark:bg-[#3B82F6] ring-2 ring-white dark:ring-[#0E131D]"
                    aria-hidden="true"
                  />
                )}
              </button>
            )}
          >
            {({ close }) => (
              <div className="text-[#0F172A] dark:text-[#F1F5F9]">
                <div className="px-3 py-2.5 border-b border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                      Thông báo
                    </span>
                    {unreadCount > 0 && (
                      <Badge variant="primary" size="sm">
                        {unreadCount} mới
                      </Badge>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead(close)}
                    className="text-xs text-[#1D4ED8] dark:text-[#38BDF8] hover:underline font-medium cursor-pointer"
                  >
                    Đã đọc hết
                  </button>
                </div>

                <div className="py-1 max-h-72 overflow-y-auto divide-y divide-[#EFEDE7] dark:divide-white/[0.05]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item.id === notif.id ? { ...item, unread: false } : item
                          )
                        )
                      }}
                      className={`px-3 py-2.5 rounded-lg hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer ${
                        notif.unread ? "bg-[#EFF6FF]/60 dark:bg-[#3B82F6]/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 leading-relaxed">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-1 border-t border-[#EFEDE7] dark:border-white/[0.06] text-center">
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline block py-1"
                  >
                    Xem tất cả thông báo
                  </Link>
                </div>
              </div>
            )}
          </Dropdown>

          {/* Menu Tài khoản Người dùng */}
          <Dropdown
            align="right"
            width="w-56"
            trigger={({ isOpen }) => (
              <button
                type="button"
                className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer select-none ${
                  isOpen ? "bg-[#F3F1EC] dark:bg-[#161C2A]" : ""
                }`}
                aria-label="Mở menu người dùng"
              >
                <Avatar name={displayName} size="sm" status="online" />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] leading-tight">
                    {displayRole}
                  </span>
                </div>
                <RiArrowDownSLine className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8] hidden sm:inline-block" />
              </button>
            )}
          >
            {({ close }) => (
              <div className="text-[#0F172A] dark:text-[#F1F5F9]">
                <div className="px-3 py-2.5 border-b border-[#EFEDE7] dark:border-white/[0.06]">
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                    {displayName}
                  </p>
                  <p className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                    {displayEmail}
                  </p>
                  <div className="mt-2">
                    <Badge variant="primary" size="sm">
                      {displayRole}
                    </Badge>
                  </div>
                </div>

                <div className="py-1">
                  <DropdownItem
                    icon={<RiUser3Line className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      navigate("/profile")
                    }}
                  >
                    Hồ sơ cá nhân
                  </DropdownItem>
                  <DropdownItem
                    icon={<RiSettings4Line className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      navigate("/settings")
                    }}
                  >
                    Cài đặt bảo mật
                  </DropdownItem>
                </div>

                <DropdownDivider />

                <div className="py-1">
                  <DropdownItem
                    danger
                    icon={<RiLogoutBoxRLine className="h-4 w-4 text-rose-500" />}
                    onClick={() => {
                      close()
                      logout()
                    }}
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
