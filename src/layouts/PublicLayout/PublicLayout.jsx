import { useState } from "react"
import { Outlet } from "react-router-dom"
import PublicHeader from "./PublicHeader"
import PublicFooter from "./PublicFooter"
import QuickHelpModal from "../../components/common/QuickHelpModal"

/**
 * PublicLayout for unauthenticated marketing and informational pages.
 * Independent from AppLayout (authenticated platform workspace) and AuthLayout.
 */
export function PublicLayout({ children }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="min-h-screen cyber-grid-canvas text-slate-900 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Sticky Public Header */}
      <PublicHeader />

      {/* 2. Main Public Page Content */}
      <main className="flex-1 w-full">
        {children || <Outlet />}
      </main>

      {/* 3. Minimalist Footer */}
      <PublicFooter />

      {/* Floating Interactive Help Button */}
      <button
        type="button"
        onClick={() => setIsHelpOpen(true)}
        title="Need help? Click for Quick Guide & FAQs"
        aria-label="Need help? Click for Quick Guide & FAQs"
        className="fixed bottom-5 right-5 z-40 h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-lg hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-700/80 group"
      >
        <span className="group-hover:rotate-12 transition-transform">?</span>
      </button>

      {/* Interactive Quick Help & Support Modal */}
      <QuickHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  )
}

export default PublicLayout
