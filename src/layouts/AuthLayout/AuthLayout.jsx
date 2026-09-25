import { Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

/**
 * Reusable layout for Authentication pages (Login, Register, Forgot Password).
 * Adheres to the Light, modern EdTech design system tokens.
 */
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 antialiased selection:bg-blue-100 selection:text-blue-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm group-hover:shadow transition-shadow">
              <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                CyberShield
              </span>
              <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase">
                Interactive Academy
              </span>
            </div>
          </Link>
        </div>

        {/* Auth Card Container */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
          {children}
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} CyberShield Academy. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default AuthLayout