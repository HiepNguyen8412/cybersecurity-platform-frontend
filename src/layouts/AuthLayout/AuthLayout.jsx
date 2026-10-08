import { Link } from "react-router-dom"
import { Lock } from "lucide-react"
import PublicHeader from "../PublicLayout/PublicHeader"

/**
 * Centered, Color-Harmonized Cybersecurity AuthLayout.
 * - Retains full sticky PublicHeader so navigation is persistent across pages.
 * - Single-column centered layout aligned with the CyberPath visual language.
 * - Retains subtle cybersecurity elements (soft grid matrix, telemetry indicators, security badges).
 */
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen cyber-grid-canvas text-slate-900 flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Persistent Public Header */}
      <PublicHeader />

      {/* ====================================================================
          BACKGROUND CYBERSECURITY MOTIF (SOFT & EYE-FRIENDLY)
         ==================================================================== */}
      {/* Soft Cyber Dot Matrix Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(rgba(37, 99, 235, 0.12) 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Soft Ambient Radial Glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-blue-200/25 via-indigo-100/15 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle Security Badge Pill */}
      <div className="relative z-10 pt-4 flex justify-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200/90 shadow-2xs backdrop-blur-md text-[11px] font-mono-tech text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-700 font-bold">256-BIT TLS ENCRYPTED</span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-slate-500 font-semibold">ISOLATED SANDBOX</span>
        </div>
      </div>

      {/* ====================================================================
          MAIN AUTH CARD (CENTERED IN THE MIDDLE)
         ==================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-[460px] mx-auto">
          {/* Card Container with soft elevation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-8 relative">
            {children}
          </div>

          {/* Under-Card Security Assurance */}
          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400 select-none">
            <Lock className="h-3 w-3 text-slate-400 shrink-0" />
            <span>Zero-Knowledge Session &bull; Anti-Brute Force Active &bull; No Log Retention</span>
          </div>
        </div>
      </main>

      {/* ====================================================================
          FOOTER (CENTERED)
         ==================================================================== */}
      <footer className="relative z-10 py-5 px-4 flex flex-col items-center justify-center gap-2.5 text-xs text-slate-500 text-center border-t border-slate-200/70 bg-white/50 backdrop-blur-xs">
        {/* Compliance Standards Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-500">
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
            MITRE ATT&CK
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
            NIST CSF
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
            OWASP TOP 10
          </span>
          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shadow-2xs">
            ISO 27001
          </span>
        </div>

        {/* Links and Copyright */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-500">
          <span>&copy; {new Date().getFullYear()} CyberPath Security Inc.</span>
          <span>&middot;</span>
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Platform Home
          </Link>
          <span>&middot;</span>
          <span className="text-slate-600">
            Privacy Policy
          </span>
          <span>&middot;</span>
          <span className="text-slate-600">
            Terms of Service
          </span>
          <span>&middot;</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Systems Normal</span>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default AuthLayout