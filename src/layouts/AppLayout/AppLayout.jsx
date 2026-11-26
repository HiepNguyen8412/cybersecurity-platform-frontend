import { lazy, Suspense } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import useLayout from "../../hooks/useLayout"
import PageLoadingFallback from "../../components/common/PageLoadingFallback"
import CyberBackground from "../../components/common/CyberBackground"

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
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] flex flex-col antialiased relative overflow-x-hidden selection:bg-[#1D4ED8]/15 selection:text-[#1D4ED8] dark:selection:bg-[#3B82F6]/25 dark:selection:text-[#38BDF8] transition-colors duration-200">
      {/* Nền học thuật tối giản (Editorial Light / Deep Obsidian Dark) */}
      <CyberBackground />

      {/* 1. Thanh bên cố định (mở rộng 240px / thu gọn 72px) */}
      <Sidebar />

      {/* 2. Thanh điều hướng trên cùng cố định */}
      <Navbar />

      {/* 3. Vùng nội dung chính với ranh giới Suspense cục bộ */}
      <main
        className={`
          flex-1 pt-16 min-w-0 transition-all duration-200 ease-in-out relative z-10
          ${isSidebarCollapsed ? "md:ml-[72px]" : "md:ml-60"}
        `.trim()}
      >
        <div
          className={`
            w-full ${maxWidth} mx-auto
            p-4 sm:p-6 space-y-6
            min-h-[calc(100vh-4rem)]
            route-fade-enter
            ${className}
          `.trim()}
        >
          <Suspense fallback={<PageLoadingFallback />}>
            {children || <Outlet />}
          </Suspense>
        </div>
      </main>

      {/* 4. Cửa sổ Terminal Sandbox tương tác toàn cục */}
      <Suspense fallback={null}>
        <LabTerminalModal />
      </Suspense>
    </div>
  )
}

export default AppLayout
