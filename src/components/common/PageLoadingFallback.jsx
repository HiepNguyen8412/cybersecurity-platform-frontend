import { memo } from "react"
import { useLocation } from "react-router-dom"

/**
 * PageLoadingFallback
 *
 * Calm, zero-layout-shift skeleton fallback for React Suspense route transitions.
 * Uses crisp static surface blocks (bg-[#F3F1EC] / dark:bg-[#161C2A]) and a 1.5px top bar.
 */
export const PageLoadingFallback = memo(function PageLoadingFallback({ type }) {
  const location = useLocation()
  const isDashboardRoute =
    type === "dashboard" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/progress") ||
    location.pathname.startsWith("/achievements") ||
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/settings")

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Đang tải nội dung trang"
      className="w-full min-h-[60vh] flex flex-col justify-start relative overflow-hidden animate-in fade-in duration-150"
    >
      <span className="sr-only">Đang tải nội dung trang...</span>

      {/* Thanh chỉ báo tải sát mép trên 1.5px tinh gọn */}
      <div className="fixed top-0 left-0 right-0 h-[1.5px] z-50 overflow-hidden pointer-events-none bg-transparent">
        <div className="h-full w-full bg-gradient-to-r from-[#1D4ED8] via-[#38BDF8] to-[#1D4ED8] dark:from-[#3B82F6] dark:via-[#38BDF8] dark:to-[#3B82F6] animate-[shimmer_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite] opacity-90" />
      </div>

      {isDashboardRoute ? (
        <div className="w-full space-y-6">
          {/* Khung đầu trang */}
          <div className="flex items-center justify-between pb-5 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A]" />
              <div className="h-6 w-48 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
            </div>
            <div className="h-8 w-24 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
          </div>

          {/* 3 Thẻ chỉ số tổng quan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="h-28 rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 space-y-3"
              >
                <div className="h-3 w-20 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                <div className="h-6 w-28 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
              </div>
            ))}
          </div>

          {/* Khung nội dung chính */}
          <div className="h-72 rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 space-y-4">
            <div className="h-4 w-36 rounded bg-[#F3F1EC] dark:bg-[#161C2A] mb-6" />
            <div className="space-y-3">
              <div className="h-10 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
              <div className="h-10 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
              <div className="h-10 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DC] dark:border-white/[0.08]">
            <div className="h-3 w-28 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
            <div className="h-3 w-16 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
          </div>

          {/* Khung tiêu điểm trang công khai */}
          <div className="h-60 sm:h-72 rounded-3xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-8 flex flex-col justify-center items-center text-center space-y-4">
            <div className="h-3 w-36 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A]" />
            <div className="h-8 sm:h-10 w-3/4 max-w-md rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
            <div className="h-3.5 w-2/3 max-w-sm rounded-md bg-[#F3F1EC] dark:bg-[#161C2A]" />
            <div className="pt-2 flex gap-3">
              <div className="h-9 w-28 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
              <div className="h-9 w-24 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
            </div>
          </div>

          {/* 3 Thẻ nội dung */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-64 rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 space-y-4"
              >
                <div className="h-32 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A]" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                  <div className="h-3 w-1/2 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export default PageLoadingFallback
