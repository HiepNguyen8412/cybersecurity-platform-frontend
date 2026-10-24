import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  ShieldCheck,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  BookOpen,
  FlaskConical,
  Compass,
  Shield,
  LogIn,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { Avatar, Dropdown, DropdownItem, DropdownDivider } from "../../components/common"
import { ThemeToggle } from "../../components/layout/ThemeToggle"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    { label: "Khóa học", to: "/learning" },
    { label: "Phòng Lab", to: "/labs" },
    { label: "Lộ trình", to: "/learning-paths" },
    { label: "Bảng giá", to: "/pricing" },
  ]

  const displayName = user?.fullName || user?.name || "Learner"

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0a0c10]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-colors overflow-hidden">
      {/* YewSafe-Inspired Top Subtle Cyan Horizon Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/8 to-transparent pointer-events-none" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between z-10">
        {/* Logo & Live Status */}
        <div className="flex items-center gap-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg group"
            title="CyberPath — Home"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-300 ring-2 ring-white dark:ring-[#0a0c10] animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Cyber<span className="text-cyan-400">Path</span>
              </span>
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">
                SEC-OPS RANGE
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation - Segmented Cyber Pill HUD */}
        <nav
          aria-label="Public Navigation"
          className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-full shadow-2xs"
        >
          {navLinks.map((link) => {
            const IconComponent =
              link.label === "Courses"
                ? BookOpen
                : link.label === "Labs"
                ? FlaskConical
                : link.label === "Paths"
                ? Compass
                : Shield

            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 select-none group ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-bold shadow-xs border border-cyan-200/80 dark:border-cyan-500/40"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold hover:bg-white/60 dark:hover:bg-slate-800/60"
                  }`
                }
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Right Desktop Auth Actions + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Visual Theme Selector */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3.5 py-2 bg-blue-50 dark:bg-cyan-950/40 text-blue-700 dark:text-cyan-300 hover:bg-blue-100 dark:hover:bg-cyan-900/40 transition-colors shadow-2xs border border-blue-200/60 dark:border-cyan-500/40"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Bảng Điều Khiển</span>
              </Link>

              <Dropdown
                align="right"
                width="w-56"
                trigger={({ isOpen }) => (
                  <button
                    type="button"
                    className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none ${
                      isOpen ? "bg-slate-100 dark:bg-slate-800" : ""
                    }`}
                    aria-label="User menu"
                  >
                    <Avatar name={displayName} size="sm" status="online" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden lg:inline-block max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                )}
              >
                {({ close }) => (
                  <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <DropdownItem
                        icon={<LayoutDashboard className="h-4 w-4" />}
                        onClick={() => {
                          close()
                          navigate("/dashboard")
                        }}
                      >
                        Dashboard
                      </DropdownItem>
                      <DropdownItem
                        icon={<User className="h-4 w-4" />}
                        onClick={() => {
                          close()
                          navigate("/profile")
                        }}
                      >
                        My Profile
                      </DropdownItem>
                    </div>
                    <DropdownDivider />
                    <div className="py-1">
                      <DropdownItem
                        danger
                        icon={<LogOut className="h-4 w-4" />}
                        onClick={async () => {
                          close()
                          await logout()
                        }}
                      >
                        Log out
                      </DropdownItem>
                    </div>
                  </div>
                )}
              </Dropdown>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold rounded-xl px-4 py-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/40 transition-all cursor-pointer shadow-2xs"
              >
                <LogIn className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                <span>Đăng nhập</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold rounded-xl px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-400/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
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
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
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
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false)
                  await logout()
                }}
                className="w-full text-center py-2 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-xs"
              >
                <LogIn className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                <span>Đăng Nhập</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export default PublicHeader
