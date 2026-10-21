import { Link, useLocation } from "react-router-dom"
import {
  ShieldCheck,
  LayoutDashboard,
  UserCheck,
  FlaskConical,
  BookOpen,
  FileText,
  Settings,
} from "lucide-react"

export function AdminHeader({ title = "Trung Tâm Điều Hành SOC", subtitle = "Quản trị nền tảng & Giám sát hạ tầng tác chiến", actions = null }) {
  const location = useLocation()

  const navTabs = [
    { label: "Tổng Quan Control Center", path: "/admin", icon: LayoutDashboard },
    { label: "Quản Lý Người Dùng", path: "/admin/users", icon: UserCheck },
    { label: "Quản Trị Phòng Lab", path: "/admin/labs", icon: FlaskConical },
    { label: "Quản Trị Khóa Học", path: "/admin/courses", icon: BookOpen },
    { label: "Nhật Ký Kiểm Toán", path: "/admin/audit-logs", icon: FileText },
    { label: "Cấu Hình Hệ Thống", path: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="space-y-4 pb-2 border-b border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/40">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wider font-mono shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>SOC ADMIN CLEARANCE // LVL-5</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HẠ TẦNG TRỰC CHIẾN ONLINE</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300/80">
            {subtitle}
          </p>
        </div>

        {/* Action button if provided */}
        {actions && (
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path || (tab.path === "/admin" && location.pathname === "/admin/dashboard")
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm dark:bg-cyan-600 dark:text-slate-950 cyberpunk:bg-cyan-500 cyberpunk:text-slate-950 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 cyberpunk:text-cyan-300/80 cyberpunk:hover:text-cyan-100 cyberpunk:hover:bg-cyan-950/40"
                }
              `}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default AdminHeader
