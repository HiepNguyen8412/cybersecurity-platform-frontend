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
} from "lucide-react"
import useLayout from "../../hooks/useLayout"
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  Breadcrumb,
} from "../common"

/**
 * Topbar for authenticated application.
 * Simple, clean layout communicating "Where am I?" with breadcrumbs, search, and user tools.
 */
export function Navbar() {
  const {
    openMobileMenu,
    pageTitle,
    breadcrumbs: customBreadcrumbs,
  } = useLayout()

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
          { label: "Learn", href: "/dashboard" },
          { label: "Dashboard" },
        ]
      case "/learning":
        return [
          { label: "Learn", href: "/learning" },
          { label: "Courses & Modules" },
        ]
      case "/learning-paths":
        return [
          { label: "Learn", href: "/learning" },
          { label: "Learning Paths" },
        ]
      case "/labs":
      case "/security-labs":
        return [
          { label: "Learn", href: "/learning" },
          { label: "Hands-on Labs" },
        ]
      case "/progress":
        return [
          { label: "Progress", href: "/progress" },
          { label: "My Progress" },
        ]
      case "/achievements":
        return [
          { label: "Progress", href: "/progress" },
          { label: "Achievements & Badges" },
        ]
      case "/profile":
        return [
          { label: "Account", href: "/profile" },
          { label: "Profile" },
        ]
      case "/settings":
        return [
          { label: "Account", href: "/profile" },
          { label: "Settings" },
        ]
      default:
        return [
          { label: "Platform", href: "/dashboard" },
          { label: pageTitle || "Overview" },
        ]
    }
  }

  const breadcrumbItems = getBreadcrumbs()

  // Sample notifications data for notification popover
  const sampleNotifications = [
    {
      id: 1,
      title: "New Lab Available",
      desc: "SQL Injection: Filter Evasion has been added to Labs.",
      time: "10m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Achievement Unlocked",
      desc: "You earned the 'Packet Inspector' badge.",
      time: "2h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Daily Goal Reminder",
      desc: "Complete 1 practice module to maintain your 3-day streak.",
      time: "1d ago",
      unread: false,
    },
  ]

  return (
    <header className="fixed top-0 right-0 left-0 md:left-60 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-200 ease-in-out">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: Mobile hamburger & Clear Breadcrumb / Page Context ("Where am I?") */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={openMobileMenu}
            className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center min-w-0">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-md mx-3 hidden sm:block">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons, paths, labs..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 pl-9 pr-14 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition duration-150 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="absolute right-2.5 hidden sm:flex items-center pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                  Ctrl K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notifications Dropdown */}
          <Dropdown
            align="right"
            width="w-80 sm:w-88"
            trigger={({ isOpen }) => (
              <button
                type="button"
                className={`relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer ${
                  isOpen ? "bg-slate-100 text-slate-900" : ""
                }`}
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
              </button>
            )}
          >
            {({ close }) => (
              <div>
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">Notifications</span>
                    <Badge variant="primary" size="sm">
                      2 new
                    </Badge>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {sampleNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        notif.unread ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 leading-tight">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                        {notif.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="text-xs font-medium text-slate-600 hover:text-blue-600 block py-1"
                  >
                    View all notifications
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
                className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer select-none ${
                  isOpen ? "bg-slate-100" : ""
                }`}
                aria-label="Open user menu"
              >
                <Avatar name="Alex Morgan" size="sm" status="online" />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    Alex Morgan
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Security Analyst
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:inline-block" />
              </button>
            )}
          >
            {({ close }) => (
              <div>
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">Alex Morgan</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    alex.morgan@cybershield.edu
                  </p>
                  <div className="mt-2">
                    <Badge variant="primary" size="sm">
                      Learner Account
                    </Badge>
                  </div>
                </div>

                <div className="py-1">
                  <DropdownItem
                    icon={<User className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      navigate("/profile")
                    }}
                  >
                    My Profile
                  </DropdownItem>

                  <DropdownItem
                    icon={<Settings className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      navigate("/settings")
                    }}
                  >
                    Account Settings
                  </DropdownItem>
                </div>

                <DropdownDivider />

                <div className="py-1">
                  <DropdownItem
                    danger
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={() => {
                      close()
                      navigate("/login")
                    }}
                  >
                    Log out
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