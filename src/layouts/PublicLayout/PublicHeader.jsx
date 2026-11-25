import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  ShieldCheck,
  BookOpen,
  Compass,
  FlaskConical,
  Cpu,
  BadgeCheck,
  CreditCard,
  LayoutDashboard,
  User,
  LogOut,
  LogIn,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { Avatar, Dropdown, DropdownItem, DropdownDivider } from "../../components/common"
import { ThemeToggle } from "../../components/layout/ThemeToggle"

const NAV_LINKS = [
  { label: "Khóa học", to: "/learning", icon: BookOpen },
  { label: "Lộ trình", to: "/learning-paths", icon: Compass },
  { label: "Phòng Lab", to: "/labs", icon: FlaskConical },
  { label: "AI Workbench", to: "/workbench", icon: Cpu },
  { label: "Xác thực", to: "/verify", icon: BadgeCheck },
  { label: "Bảng giá", to: "/pricing", icon: CreditCard },
]

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen])

  const displayName = user?.fullName || user?.name || "Học viên"

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/90 dark:bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#E5E2DC] dark:border-white/[0.08] transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Biểu trưng Học viện CyberPath */}
        <Link
          to="/"
          className="flex items-center gap-2.5 min-w-0 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6] rounded-lg group"
          title="CyberPath — Học viện An ninh mạng"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1D4ED8] dark:bg-[#2563EB] text-white border border-[#1E40AF]/20 dark:border-white/[0.12] transition-colors group-hover:bg-[#1E40AF] dark:group-hover:bg-[#3B82F6]">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif-editorial text-xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-none">
              Cyber<span className="text-[#1D4ED8] dark:text-[#38BDF8]">Path</span>
            </span>
            <span className="hidden sm:block text-[9.5px] font-mono-tech font-medium tracking-[0.14em] uppercase text-[#64748B] dark:text-[#94A3B8] mt-1 leading-none">
              HỌC VIỆN AN NINH MẠNG
            </span>
          </div>
        </Link>

        {/* Điều hướng chính trên màn hình lớn */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_LINKS.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors duration-150 ${
                    isActive
                      ? "bg-[#1D4ED8]/[0.08] dark:bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#38BDF8] font-semibold border border-[#1D4ED8]/20 dark:border-[#3B82F6]/30"
                      : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border border-transparent font-medium"
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5 shrink-0 opacity-85" strokeWidth={1.75} />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Khu vực chuyển giao diện & tài khoản trên màn hình lớn */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold rounded-lg px-3 py-1.5 bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.75} />
                <span>Bảng điều khiển</span>
              </Link>

              <Dropdown
                align="right"
                width="w-56"
                trigger={({ isOpen }) => (
                  <button
                    type="button"
                    className={`flex items-center gap-2 p-1.5 rounded-lg border border-transparent hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer ${
                      isOpen ? "bg-[#F3F1EC] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]" : ""
                    }`}
                    aria-label="Menu tài khoản"
                  >
                    <Avatar name={displayName} size="sm" status="online" />
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] hidden xl:inline-block max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" strokeWidth={1.75} />
                  </button>
                )}
              >
                {({ close }) => (
                  <div className="text-[#0F172A] dark:text-[#F1F5F9]">
                    <div className="px-3 py-2 border-b border-[#E5E2DC] dark:border-white/[0.08]">
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                        {displayName}
                      </p>
                      {user?.email && (
                        <p className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <div className="py-1">
                      <DropdownItem
                        icon={<LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />}
                        onClick={() => {
                          close()
                          navigate("/dashboard")
                        }}
                      >
                        Bảng điều khiển
                      </DropdownItem>
                      <DropdownItem
                        icon={<User className="h-4 w-4" strokeWidth={1.75} />}
                        onClick={() => {
                          close()
                          navigate("/profile")
                        }}
                      >
                        Hồ sơ cá nhân
                      </DropdownItem>
                    </div>
                    <DropdownDivider />
                    <div className="py-1">
                      <DropdownItem
                        danger
                        icon={<LogOut className="h-4 w-4" strokeWidth={1.75} />}
                        onClick={async () => {
                          close()
                          await logout()
                        }}
                      >
                        Đăng xuất
                      </DropdownItem>
                    </div>
                  </div>
                )}
              </Dropdown>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 text-[13px] font-medium rounded-lg px-3 py-1.5 text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold rounded-lg px-4 py-2 bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white shadow-xs active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Bắt đầu học</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </Link>
            </div>
          )}
        </div>

        {/* Nút điều khiển trên thiết bị di động & máy tính bảng */}
        <div className="flex items-center gap-2 shrink-0 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border border-transparent hover:border-[#E5E2DC] dark:hover:border-white/[0.08] transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-public-nav"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      {/* Ngăn kéo điều hướng trên thiết bị di động (vùng chạm >= 44px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-public-nav"
          className="lg:hidden border-t border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0B0E14] px-4 pt-3 pb-6 space-y-4 shadow-md"
        >
          <nav aria-label="Điều hướng di động" className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-[#1D4ED8]/[0.08] dark:bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#38BDF8] font-semibold border border-[#1D4ED8]/20 dark:border-[#3B82F6]/30"
                        : "text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border border-transparent font-medium"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.75} />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center gap-3 px-2 py-1.5">
                <Avatar name={displayName} size="sm" status="online" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                    {displayName}
                  </span>
                  {user?.email && (
                    <span className="text-xs font-mono-tech text-[#64748B] dark:text-[#94A3B8] truncate">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
                <span>Bảng điều khiển</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] rounded-lg transition-colors"
              >
                <User className="h-4 w-4" strokeWidth={1.75} />
                <span>Hồ sơ cá nhân</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false)
                  await logout()
                }}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.75} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08] flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] rounded-lg transition-colors"
              >
                <LogIn className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.75} />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white transition-colors"
              >
                <span>Bắt đầu học</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default PublicHeader
