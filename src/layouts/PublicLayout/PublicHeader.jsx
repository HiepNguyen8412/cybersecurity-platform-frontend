import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  RiShieldFlashFill,
  RiBookOpenLine,
  RiTerminalBoxLine,
  RiRouteLine,
  RiPriceTag3Line,
  RiDashboard3Line,
  RiUser3Line,
  RiLogoutBoxRLine,
  RiArrowDownSLine,
  RiLoginCircleLine,
  RiFlashlightLine,
  RiMenuLine,
  RiCloseLine,
} from "@remixicon/react"
import useAuth from "../../hooks/useAuth"
import { Avatar, Dropdown, DropdownItem, DropdownDivider } from "../../components/common"
import { ThemeToggle } from "../../components/layout/ThemeToggle"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    { label: "Khóa học", to: "/learning", icon: RiBookOpenLine },
    { label: "Phòng Lab", to: "/labs", icon: RiTerminalBoxLine },
    { label: "Lộ trình", to: "/learning-paths", icon: RiRouteLine },
    { label: "Bảng giá", to: "/pricing", icon: RiPriceTag3Line },
  ]

  const displayName = user?.fullName || user?.name || "Học viên"

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#080b14]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/[0.08] transition-colors select-none">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between z-10">
        {/* Logo & Platform Name */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl group"
            title="CyberPath — Trang chủ"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform duration-200">
              <RiShieldFlashFill className="h-5 w-5 text-white" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#080b14]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Cyber<span className="text-blue-600 dark:text-sky-400">Path</span>
              </span>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
                SEC-OPS RANGE
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation */}
        <nav
          aria-label="Public Navigation"
          className="hidden md:flex items-center gap-1"
        >
          {navLinks.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-sky-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] font-medium"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Right Desktop Auth Actions + Theme Toggle */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Visual Theme Selector */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold rounded-lg px-3.5 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-sky-400 hover:bg-blue-100/80 dark:hover:bg-blue-500/20 transition-all border border-blue-200/60 dark:border-blue-500/20"
              >
                <RiDashboard3Line className="h-4 w-4" />
                <span>Bảng Điều Khiển</span>
              </Link>

              <Dropdown
                align="right"
                width="w-56"
                trigger={({ isOpen }) => (
                  <button
                    type="button"
                    className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer ${
                      isOpen ? "bg-slate-100 dark:bg-white/[0.06]" : ""
                    }`}
                    aria-label="User menu"
                  >
                    <Avatar name={displayName} size="sm" status="online" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden lg:inline-block max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <RiArrowDownSLine className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              >
                {({ close }) => (
                  <div className="bg-white dark:bg-[#0f1422] text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-white/[0.08] shadow-xl overflow-hidden">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.06]">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <DropdownItem
                        icon={<RiDashboard3Line className="h-4 w-4" />}
                        onClick={() => {
                          close()
                          navigate("/dashboard")
                        }}
                      >
                        Bảng điều khiển
                      </DropdownItem>
                      <DropdownItem
                        icon={<RiUser3Line className="h-4 w-4" />}
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
                        icon={<RiLogoutBoxRLine className="h-4 w-4" />}
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
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium rounded-lg px-3.5 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
              >
                <RiLoginCircleLine className="h-4 w-4 text-slate-400" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white shadow-xs hover:shadow-sm hover:shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <RiFlashlightLine className="h-3.5 w-3.5" />
                <span>Bắt đầu ngay</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button + Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <RiCloseLine className="h-5 w-5" /> : <RiMenuLine className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10192e] px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-2 py-1">
                <Avatar name={displayName} size="sm" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</span>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 dark:bg-indigo-600 cyberpunk:bg-emerald-500 text-white cyberpunk:text-slate-950 shadow-md shadow-indigo-600/25"
              >
                Bảng điều khiển
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                Hồ sơ cá nhân
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false)
                  await logout()
                }}
                className="w-full text-center py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] rounded-xl transition-all shadow-xs"
              >
                <RiLoginCircleLine className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                <span>Đăng Nhập</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-600/25"
              >
                Bắt đầu ngay
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default PublicHeader
