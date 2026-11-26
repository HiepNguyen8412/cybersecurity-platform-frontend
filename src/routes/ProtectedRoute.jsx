import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ShieldCheck, Loader2 } from "lucide-react"

/**
 * Route guard for authenticated learning workspace.
 * - Prevents flash of protected content during session initialization.
 * - Redirects unauthenticated users to /login preserving the attempted URL in location state.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  // 1. Đang kiểm tra phiên làm việc -> Hiển thị trạng thái tải tĩnh gọn, rõ nét
  if (isInitializing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] flex flex-col items-center justify-center p-4 antialiased transition-colors"
      >
        <div className="fixed top-0 left-0 right-0 h-[1.5px] bg-[#1D4ED8] dark:bg-[#3B82F6] opacity-85" aria-hidden="true" />
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D4ED8] dark:bg-[#2563EB] text-white border border-[#1E40AF]/20 dark:border-white/[0.12] shadow-sm">
            <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
            <Loader2 className="h-4 w-4 animate-spin text-[#1D4ED8] dark:text-[#3B82F6]" aria-hidden="true" />
            <span>Đang xác thực phiên làm việc...</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. Chưa đăng nhập -> Chuyển hướng về trang đăng nhập và lưu đường dẫn trước đó
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Đã xác thực -> Hiển thị không gian làm việc
  return children || <Outlet />
}

export default ProtectedRoute
