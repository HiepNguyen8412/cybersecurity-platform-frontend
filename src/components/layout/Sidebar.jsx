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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import useLayout from "../../hooks/useLayout"
import useAuth from "../../hooks/useAuth"
import { Avatar } from "../common"

/**
 * Friendly, human, modern EdTech Sidebar.
 * Supports expanded (240px) and collapsed (72px) desktop states, plus full mobile drawer.
 */
export function Sidebar() {
  const {
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isMobileMenuOpen,
    closeMobileMenu,
  } = useLayout()

  const { user } = useAuth()
  const displayName = user?.name || "Alex Morgan"
  const displayRole = user?.role || "Security Analyst"

  // Navigation structure: LEARN, PROGRESS, ACCOUNT
  const navigationGroups = [
    {
      group: "LEARN",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Learning", icon: BookOpen, path: "/learning" },
        { label: "Learning Paths", icon: Compass, path: "/learning-paths" },
        { label: "Labs", icon: FlaskConical, path: "/labs" },
      ],
    },
    {
      group: "PROGRESS",
      items: [
        { label: "Progress", icon: TrendingUp, path: "/progress" },
        { label: "Achievements", icon: Award, path: "/achievements" },
      ],
    },
    {
      group: "ACCOUNT",
      items: [
        { label: "Profile", icon: User, path: "/profile" },
        { label: "Settings", icon: Settings, path: "/settings" },
      ],
    },
  ]

  const renderSidebarContent = (isCollapsed) => (
    <div className="flex h-full flex-col bg-white border-r border-slate-200/80">
      {/* Brand Header */}
      <div
        className={`flex h-16 items-center border-b border-slate-200/80 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4 sm:px-5"
        }`}
      >
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          onClick={closeMobileMenu}
          title="CyberPath Platform"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xs">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                CyberPath
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-tight">
                Learning Platform
              </span>
            </div>
          )}
        </Link>

        {/* Action button in header */}
        {!isCollapsed && (
          <div className="flex items-center">
            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={closeMobileMenu}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <nav
        aria-label="Application Navigation"
        className={`flex-1 overflow-y-auto py-4 space-y-4 ${
          isCollapsed ? "px-2" : "px-3.5"
        }`}
      >
        {navigationGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            {isCollapsed ? (
              <div className="my-2 border-t border-slate-100" />
            ) : (
              <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none">
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
                      group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150 select-none
                      ${
                        isCollapsed
                          ? "justify-center px-0 py-2.5"
                          : "gap-3 px-2.5 py-2"
                      }
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                      }
                    `.trim()}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Subtle active left indicator */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue-600"
                            aria-hidden="true"
                          />
                        )}

                        <Icon
                          className={`shrink-0 transition-colors ${
                            isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5"
                          } ${
                            isActive
                              ? "text-blue-600 stroke-[2.2]"
                              : "text-slate-400 group-hover:text-slate-700 stroke-[1.8]"
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

      {/* Bottom User Profile Summary */}
      <div className={`border-t border-slate-200/80 ${isCollapsed ? "p-2" : "p-3"}`}>
        <Link
          to="/profile"
          onClick={closeMobileMenu}
          className={`flex items-center rounded-xl hover:bg-slate-100/80 transition-colors group cursor-pointer ${
            isCollapsed ? "justify-center p-2" : "justify-between p-2"
          }`}
          title={`${displayName} (${displayRole}) - View profile`}
        >
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5 min-w-0"}`}>
            <Avatar name={displayName} size="sm" status="online" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight truncate group-hover:text-blue-600 transition-colors">
                  {displayName}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight truncate">
                  {displayRole}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
          )}
        </Link>

        {/* Collapsed desktop expand button */}
        {isCollapsed && (
          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          </div>
        )}
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

      {/* Mobile Drawer (Always full width when opened) */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-0 z-50 md:hidden"
        >
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Offcanvas Drawer Content */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 max-w-[85vw] bg-white shadow-xl transition-transform animate-in slide-in-from-left duration-200 z-10">
            {renderSidebarContent(false)}
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar