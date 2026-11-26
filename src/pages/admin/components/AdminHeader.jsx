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

export function AdminHeader({
  title = "Trung tâm Điều hành SOC",
  subtitle = "Quản trị nền tảng đào tạo và giám sát hạ tầng an ninh mạng",
  actions = null,
  statusLabel = "HẠ TẦNG ĐANG VẬN HÀNH",
  statusTone = "operational",
}) {
  const location = useLocation()

  const navTabs = [
    { label: "Tổng quan điều hành", path: "/admin", icon: RiDashboard3Line },
    { label: "Quản lý người dùng", path: "/admin/users", icon: RiUserSettingsLine },
    { label: "Quản trị phòng Lab", path: "/admin/labs", icon: RiCpuLine },
    { label: "Quản trị khóa học", path: "/admin/courses", icon: RiFolderShield2Line },
    { label: "Nhật ký kiểm toán", path: "/admin/audit-logs", icon: RiFileHistoryLine },
    { label: "Cấu hình hệ thống", path: "/admin/settings", icon: RiEqualizer3Line },
  ]

  const statusStyles = {
    operational:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-300 dark:border-emerald-500/25",
    degraded:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/12 dark:text-amber-300 dark:border-amber-500/25",
    sample:
      "bg-[#F3F1EC] text-[#475569] border-[#E5E2DC] dark:bg-[#161C2A] dark:text-[#94A3B8] dark:border-white/[0.08]",
  }

  const dotStyles = {
    operational: "bg-emerald-500",
    degraded: "bg-amber-500",
    sample: "bg-slate-400 dark:bg-slate-500",
  }

  return (
    <header className="space-y-4 pb-4 border-b border-[#E5E2DC] dark:border-white/[0.08]">
      {/* Hàng tiêu đề & phân loại quản trị */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] text-[10px] font-semibold uppercase tracking-wider font-mono-tech">
              <RiShieldCheckLine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>QUẢN TRỊ HỆ THỐNG // SOC ADMIN</span>
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-semibold uppercase tracking-wider font-mono-tech ${statusStyles[statusTone] || statusStyles.operational}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[statusTone] || dotStyles.operational}`}
                aria-hidden="true"
              />
              <span>{statusLabel}</span>
            </span>
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Khu vực nút hành động */}
        {actions && (
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-end shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Thanh điều hướng phân hệ quản trị */}
      <nav
        aria-label="Điều hướng phân hệ quản trị SOC"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5"
      >
        {navTabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            location.pathname === tab.path ||
            (tab.path === "/admin" && location.pathname === "/admin/dashboard")
          return (
            <Link
              key={tab.path}
              to={tab.path}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer border ${
                isActive
                  ? "bg-[#1D4ED8] text-white border-[#1D4ED8] dark:bg-[#3B82F6] dark:text-white dark:border-[#3B82F6] font-semibold shadow-2xs"
                  : "bg-transparent text-[#475569] border-transparent hover:text-[#0F172A] hover:bg-[#F3F1EC] hover:border-[#E5E2DC] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] dark:hover:bg-[#161C2A] dark:hover:border-white/[0.08]"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

export default AdminHeader
