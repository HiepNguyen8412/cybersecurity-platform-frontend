import { Outlet } from "react-router-dom"
import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import useLayout from "../../hooks/useLayout"

/**
 * Persistent AppLayout for the authenticated cybersecurity learning platform.
 * Supports both React Router <Outlet /> for nested layout routes and {children} wrapper usage.
 * Dynamically responds to expanded and collapsed sidebar states.
 */
export function AppLayout({ children, maxWidth = "max-w-[1240px]", className = "" }) {
  const { isSidebarCollapsed } = useLayout()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 1. Sidebar (Fixed left: expanded 240px / collapsed 72px) */}
      <Sidebar />

      {/* 2. Topbar (Fixed top, left-offset responds to sidebar width) */}
      <Navbar />

      {/* 3. Main Scrollable Content */}
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
          {children || <Outlet />}
        </div>
      </main>
    </div>
  )
}

export default AppLayout
