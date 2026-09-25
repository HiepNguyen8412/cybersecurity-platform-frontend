import Navbar from "../../components/layout/Navbar"
import Sidebar from "../../components/layout/Sidebar"
import { LayoutProvider } from "../../context/LayoutContext"

/**
 * Shell component for AppLayout
 */
function AppLayoutShell({ children, maxWidth = "max-w-[1240px]", className = "" }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* 1. Sidebar (Fixed left, width 240px) */}
      <Sidebar />

      {/* 2. Topbar (Fixed top, left-offset on md+) */}
      <Navbar />

      {/* 3. Main Scrollable Content */}
      <main className="flex-1 pt-16 md:ml-60 transition-all duration-200 ease-in-out">
        <div
          className={`
            w-full ${maxWidth} mx-auto
            p-6 space-y-6
            min-h-[calc(100vh-4rem)]
            ${className}
          `.trim()}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

/**
 * Reusable AppLayout for the authenticated cybersecurity learning platform.
 * Provides the connected Sidebar + Topbar + Content shell with 24px padding & section spacing.
 */
export function AppLayout({ children, maxWidth = "max-w-[1240px]", className = "" }) {
  return (
    <LayoutProvider>
      <AppLayoutShell maxWidth={maxWidth} className={className}>
        {children}
      </AppLayoutShell>
    </LayoutProvider>
  )
}

export default AppLayout
