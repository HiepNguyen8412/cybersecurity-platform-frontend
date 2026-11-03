import { Link, useLocation } from "react-router-dom"
import {
  RiShieldCheckLine,
  RiDashboard3Line,
  RiUserSettingsLine,
  RiCpuLine,
  RiFolderShield2Line,
  RiFileHistoryLine,
  RiEqualizer3Line,
} from "@remixicon/react"

export function AdminHeader({ title = "Trung Tâm Điều Hành SOC", subtitle = "Quản trị nền tảng & Giám sát hạ tầng tác chiến", actions = null }) {
  const location = useLocation()

  const navTabs = [
    { label: "Tổng quan Control Center", path: "/admin", icon: RiDashboard3Line },
    { label: "Quản lý người dùng", path: "/admin/users", icon: RiUserSettingsLine },
    { label: "Quản trị phòng Lab", path: "/admin/labs", icon: RiCpuLine },
    { label: "Quản trị khóa học", path: "/admin/courses", icon: RiFolderShield2Line },
    { label: "Nhật ký kiểm toán", path: "/admin/audit-logs", icon: RiFileHistoryLine },
    { label: "Cấu hình hệ thống", path: "/admin/settings", icon: RiEqualizer3Line },
  ]

  return (
    <div className="space-y-4 pb-3 border-b border-slate-200/90 dark:border-white/[0.08] cyberpunk:border-cyan-500/40 select-none">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider font-mono-tech shadow-2xs">
              <RiShieldCheckLine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>SOC ADMIN CLEARANCE // LVL-5</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold font-mono-tech">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = location.pathname === tab.path || (tab.path === "/admin" && location.pathname === "/admin/dashboard")
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs dark:bg-indigo-600 dark:text-white cyberpunk:bg-cyan-500 cyberpunk:text-slate-950 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.06] cyberpunk:text-cyan-300/80 cyberpunk:hover:text-cyan-100 cyberpunk:hover:bg-cyan-950/40"
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
