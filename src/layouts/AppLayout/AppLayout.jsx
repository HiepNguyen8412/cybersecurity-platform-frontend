import { lazy, Suspense } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import useLayout from "../../hooks/useLayout"
import PageLoadingFallback from "../../components/common/PageLoadingFallback"

// Lazy-loaded modal to avoid loading sandbox terminal dependencies until needed
const LabTerminalModal = lazy(() =>
  import("../../pages/labs/components/LabTerminalModal").then((module) => ({
    default: module.LabTerminalModal,
  }))
)

/**
 * Persistent AppLayout for the authenticated cybersecurity platform.
 * Keeps Sidebar & Navbar permanently mounted to eliminate layout flickering.
 * Houses a localized Suspense boundary so only the inner content updates smoothly.
 */
export function AppLayout({ children, maxWidth = "max-w-[1240px]", className = "" }) {
  const { isSidebarCollapsed } = useLayout()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08090d] text-slate-900 dark:text-[#e2e8f0] flex flex-col antialiased relative overflow-x-hidden selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Subtle Ambient Spatial Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-indigo-500/[0.04] via-blue-500/[0.02] to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      
      {/* 1. Sidebar (Fixed left: expanded 240px / collapsed 72px) - NEVER unmounts */}
      <Sidebar />

      {/* 2. Topbar (Fixed top, left-offset responds to sidebar width) - NEVER unmounts */}
      <Navbar />

      {/* 3. Main Scrollable Content with Localized Suspense Boundary */}
      <main
        className={`
          flex-1 pt-16 min-w-0 transition-all duration-200 ease-in-out
          ${isSidebarCollapsed ? "md:ml-[72px]" : "md:ml-60"}
        `.trim()}
      >
        <div
          className={`
            w-full ${maxWidth} mx-auto
            p-4 sm:p-6 space-y-6
            min-h-[calc(100vh-4rem)]
            ${className}
          `.trim()}
        >
          <Suspense fallback={<PageLoadingFallback />}>
            {children || <Outlet />}
          </Suspense>
        </div>
      </main>

      {/* 4. Global Interactive Cyber Range Sandbox Terminal Modal */}
      <Suspense fallback={null}>
        <LabTerminalModal />
      </Suspense>
    </div>
  )
}

export default AppLayout
