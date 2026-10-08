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

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    { label: "Courses", to: "/learning" },
    { label: "Labs", to: "/labs" },
    { label: "Paths", to: "/learning-paths" },
    { label: "Pricing", to: "/pricing" },
  ]

  const displayName = user?.fullName || user?.name || "Learner"

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo & Live Status */}
        <div className="flex items-center gap-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg group"
            title="CyberPath — Home"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Cyber<span className="text-blue-600">Path</span>
              </span>
              <span className="text-[10px] font-mono-tech uppercase tracking-widest text-slate-400 mt-0.5">
                SEC-OPS RANGE
              </span>
            </div>
          </Link>
        </div>

        {/* Center Desktop Navigation - Segmented Cyber Pill HUD */}
        <nav
          aria-label="Public Navigation"
          className="hidden md:flex items-center gap-1 p-1 bg-slate-100/80 backdrop-blur-md border border-slate-200/90 rounded-full shadow-2xs"
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
                  `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 select-none ${
                    isActive
                      ? "bg-white text-blue-600 font-bold shadow-xs border border-blue-200/80"
                      : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/60"
                  }`
                }
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Right Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors shadow-2xs"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Dropdown
                align="right"
                width="w-56"
                trigger={({ isOpen }) => (
                  <button
                    type="button"
                    className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none ${
                      isOpen ? "bg-slate-100" : ""
                    }`}
                    aria-label="User menu"
                  >
                    <Avatar name={displayName} size="sm" status="online" />
                    <span className="text-xs font-semibold text-slate-800 hidden lg:inline-block max-w-[120px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                )}
              >
                {({ close }) => (
                  <div>
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
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
                className="group inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-4 py-2 text-white bg-slate-900 border border-slate-700/80 hover:border-sky-400/70 hover:bg-slate-800 shadow-md shadow-slate-950/20 hover:shadow-sky-500/15 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
              >
                <LogIn className="h-4 w-4 text-sky-400 group-hover:text-white transition-colors" />
                <span>Log in</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold rounded-xl px-4 py-2 cyber-btn-primary hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shadow-sm"
              >
                <span>Get started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-2 py-1">
                <Avatar name={displayName} size="sm" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate">{user?.email}</span>
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
                className="w-full text-center py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                My Profile
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false)
                  await logout()
                }}
                className="w-full text-center py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-slate-900 border border-slate-700/80 hover:border-sky-400/70 hover:bg-slate-800 rounded-xl transition-all shadow-md active:scale-[0.99]"
              >
                <LogIn className="h-4 w-4 text-sky-400" />
                <span>Log in</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs active:scale-[0.99]"
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
