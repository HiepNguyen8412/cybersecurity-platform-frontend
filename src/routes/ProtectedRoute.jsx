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

  // 1. Session check in progress -> Show clean, non-flashing loading state
  if (isInitializing) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 antialiased"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md animate-pulse">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>Verifying session...</span>
          </div>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated -> Redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 3. Authenticated -> Render protected layout and pages
  return children || <Outlet />
}

export default ProtectedRoute
