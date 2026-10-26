import { Link, useNavigate } from "react-router-dom"
import {
  RiRadarLine,
  RiSearchEyeLine,
  RiBookOpenLine,
  RiTerminalBoxLine,
  RiRouteLine,
  RiHome4Line,
  RiArrowLeftLine,
} from "@remixicon/react"

/**
 * NotFound (404 Page)
 * Sleek, high-aesthetic cybersecurity-themed 404 page with Remix Icon vessels,
 * actionable navigation routes, and clear messaging for lost users.
 */
export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background Matrix / Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.15) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Ambient Radial Lights */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-gradient-to-r from-indigo-600/15 via-indigo-600/10 to-blue-500/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Radar Icon & 404 Visual Vessel */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-950/40 relative ring-1 ring-white/10">
            <RiRadarLine className="w-12 h-12 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 ring-2 ring-slate-900" />
            </span>
          </div>
        </div>

        {/* 404 Code & Explanation */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-widest shadow-2xs">
            <RiSearchEyeLine className="w-4 h-4" />
            <span>ERR_TARGET_NOT_FOUND // 404</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tọa Độ Không Tồn Tại
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            Đường dẫn hoặc tài nguyên bạn đang truy vấn không nằm trong bản đồ phòng thủ CyberPath hoặc đã được chuyển dời.
          </p>
        </div>

        {/* Quick Navigation Cards with Sculpted Vessels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
          <Link
            to="/learning"
            className="group p-4 rounded-2xl bg-white dark:bg-[#0d1322]/80 border border-slate-200/90 dark:border-white/[0.08] hover:border-cyan-500/50 transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-2.5 transition-transform group-hover:scale-110">
              <RiBookOpenLine className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white block mb-1">
              Khóa Học
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Giáo trình bảo mật & bài giảng chuyên sâu
            </p>
          </Link>

          <Link
            to="/labs"
            className="group p-4 rounded-2xl bg-white dark:bg-[#0d1322]/80 border border-slate-200/90 dark:border-white/[0.08] hover:border-blue-500/50 transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-2.5 transition-transform group-hover:scale-110">
              <RiTerminalBoxLine className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white block mb-1">
              Phòng Lab
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Môi trường tấn công & phòng thủ thực tế
            </p>
          </Link>

          <Link
            to="/learning-paths"
            className="group p-4 rounded-2xl bg-white dark:bg-[#0d1322]/80 border border-slate-200/90 dark:border-white/[0.08] hover:border-indigo-500/50 transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 mb-2.5 transition-transform group-hover:scale-110">
              <RiRouteLine className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white block mb-1">
              Lộ Trình
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Định hướng nghề nghiệp Pentester & SOC
            </p>
          </Link>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 ring-1 ring-white/20 transition-all hover:scale-105 active:scale-95"
          >
            <RiHome4Line className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-200 font-medium text-xs transition-colors cursor-pointer"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            <span>Quay Lại Trang Trước</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
