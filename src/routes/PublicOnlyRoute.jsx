import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { sanitizeReturnUrl } from "../utils/validators"
import { ShieldCheck, Loader2 } from "lucide-react"

/**
 * Route wrapper for public auth pages (login, register, forgot-password).
 * If the user is already authenticated, redirects them to their destination or /dashboard.
 */
export function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

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
            <span>Checking authentication...</span>
          </div>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    const destination = sanitizeReturnUrl(location.state?.from?.pathname, "/dashboard")
    return <Navigate to={destination} replace />
  }

  return children || <Outlet />
}

export default PublicOnlyRoute
