import { useState, Suspense } from "react"
import { Outlet } from "react-router-dom"
import PublicHeader from "./PublicHeader"
import PublicFooter from "./PublicFooter"
import QuickHelpModal from "../../components/common/QuickHelpModal"
import { LabTerminalModal } from "../../pages/labs/components/LabTerminalModal"
import PageLoadingFallback from "../../components/common/PageLoadingFallback"

/**
 * PublicLayout for unauthenticated marketing and informational pages.
 * Keeps Header & Footer permanently mounted with localized Suspense boundary for child routes.
 */
export function PublicLayout({ children }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#08090d] cyberpunk:bg-[#020d18] text-slate-900 dark:text-[#e2e8f0] cyberpunk:text-[#f0fdfa] flex flex-col antialiased selection:bg-indigo-500/20 selection:text-indigo-400 relative overflow-x-hidden">
      {/* Subtle Ambient Spatial Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-indigo-500/[0.04] via-blue-500/[0.02] to-transparent cyberpunk:from-cyan-500/[0.08] cyberpunk:via-teal-500/[0.03] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      
      {/* 1. Sticky Public Header - NEVER unmounts on route transitions */}
      <PublicHeader />

      {/* 2. Main Public Page Content with Localized Suspense */}
      <main className="flex-1 w-full">
        <Suspense fallback={<PageLoadingFallback />}>
          {children || <Outlet />}
        </Suspense>
      </main>

      {/* 3. Minimalist Footer */}
      <PublicFooter />

      {/* Floating Interactive Help Button */}
      <button
        type="button"
        onClick={() => setIsHelpOpen(true)}
        title="Need help? Click for Quick Guide & FAQs"
        aria-label="Need help? Click for Quick Guide & FAQs"
        className="fixed bottom-5 right-5 z-40 h-10 w-10 rounded-full bg-slate-900 dark:bg-[#121622] text-white flex items-center justify-center font-bold text-sm shadow-lg hover:bg-slate-800 dark:hover:bg-[#1a2030] transition-all hover:scale-105 active:scale-95 cursor-pointer border border-slate-700/80 dark:border-white/[0.1] group"
      >
        <span className="group-hover:rotate-12 transition-transform">?</span>
      </button>

      {/* Interactive Quick Help & Support Modal */}
      <QuickHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Global Interactive Cyber Range Sandbox Terminal Modal */}
      <LabTerminalModal />
    </div>
  )
}

export default PublicLayout
