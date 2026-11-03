import { useState, lazy, Suspense } from "react"
import { Outlet } from "react-router-dom"
import PublicHeader from "./PublicHeader"
import PublicFooter from "./PublicFooter"
import QuickHelpModal from "../../components/common/QuickHelpModal"
import PageLoadingFallback from "../../components/common/PageLoadingFallback"
import CyberBackground from "../../components/common/CyberBackground"

// Lazy-loaded modal to avoid loading sandbox terminal dependencies on landing pages
const LabTerminalModal = lazy(() =>
  import("../../pages/labs/components/LabTerminalModal").then((module) => ({
    default: module.LabTerminalModal,
  }))
)

/**
 * PublicLayout for unauthenticated marketing and informational pages.
 * Keeps Header & Footer permanently mounted with localized Suspense boundary for child routes.
 */
export function PublicLayout({ children }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="min-h-screen text-slate-900 dark:text-[#e2e8f0] cyberpunk:text-[#f0fdfa] flex flex-col antialiased selection:bg-indigo-500/20 selection:text-indigo-400 relative overflow-x-hidden">
      {/* Global Cybersecurity Ambient Backdrop (Grid, Aurora Glow & Telemetry) */}
      <CyberBackground />
      
      {/* 1. Sticky Public Header - NEVER unmounts on route transitions */}
      <PublicHeader />

      {/* 2. Main Public Page Content with Localized Suspense */}
      <main className="flex-1 w-full relative z-10 route-fade-enter">
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
      <Suspense fallback={null}>
        <LabTerminalModal />
      </Suspense>
    </div>
  )
}

export default PublicLayout
