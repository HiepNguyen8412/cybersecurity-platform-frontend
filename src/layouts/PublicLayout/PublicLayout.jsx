import { Outlet } from "react-router-dom"
import PublicHeader from "./PublicHeader"
import PublicFooter from "./PublicFooter"

/**
 * PublicLayout for unauthenticated marketing and informational pages.
 * Independent from AppLayout (authenticated platform workspace) and AuthLayout.
 */
export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Sticky Public Header */}
      <PublicHeader />

      {/* 2. Main Public Page Content */}
      <main className="flex-1 w-full">
        {children || <Outlet />}
      </main>

      {/* 3. Minimalist Footer */}
      <PublicFooter />

      {/* Floating Help Button (matches Figma bottom right) */}
      <button
        type="button"
        title="Need help?"
        aria-label="Need help?"
        className="fixed bottom-5 right-5 z-40 h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-md hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer"
      >
        ?
      </button>
    </div>
  )
}

export default PublicLayout
