import { Link } from "react-router-dom"
import { ShieldCheck, Lock, Activity } from "lucide-react"

/**
 * Centered, Color-Harmonized Cybersecurity AuthLayout.
 * - Single-column centered layout aligned with the CyberPath visual language (Slate-50 canvas, Blue & Indigo accents).
 * - Eliminates harsh black-and-white contrast for comfortable visual ergonomics.
 * - Retains subtle cybersecurity elements (soft grid matrix, telemetry indicators, security badges).
 */
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-100/80 text-slate-900 flex flex-col justify-between relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* ====================================================================
          BACKGROUND CYBERSECURITY MOTIF (SOFT & EYE-FRIENDLY)
         ==================================================================== */}
      {/* 1. Soft Cyber Dot Matrix Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(rgba(37, 99, 235, 0.12) 1.2px, transparent 1.2px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* 2. Soft Ambient Radial Glows */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-b from-blue-200/25 via-indigo-100/15 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[350px] bg-gradient-to-tr from-cyan-100/20 via-blue-100/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-0 w-[400px] h-[350px] bg-gradient-to-tl from-indigo-100/20 via-blue-100/10 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. Subtle Cyber Telemetry Corner Accents (Desktop only) */}
      <div className="hidden lg:flex fixed top-5 left-6 items-center gap-2 text-[11px] font-mono text-slate-400 pointer-events-none select-none">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span>NODE // 10.240.0.1</span>
        <span className="text-slate-300">&bull;</span>
        <span>ZONE: DEFENSE_RANGE</span>
      </div>

      <div className="hidden lg:flex fixed top-5 right-6 items-center gap-2 text-[11px] font-mono text-slate-400 pointer-events-none select-none">
        <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
        <span className="text-emerald-600 font-semibold">GATEWAY ACTIVE</span>
        <span className="text-slate-300">&bull;</span>
        <span>ZERO-TRUST ENFORCED</span>
      </div>

      {/* ====================================================================
          TOP BRAND HEADER (CENTERED)
         ==================================================================== */}
      <header className="relative z-10 pt-8 sm:pt-10 pb-4 flex flex-col items-center justify-center text-center px-4">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1"
          title="CyberPath Platform"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
              CyberPath
            </span>
            <span className="text-xs font-medium text-slate-500 leading-tight">
              Security Learning Platform
            </span>
          </div>
        </Link>

        {/* Security Badge Pill */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/90 shadow-xs backdrop-blur-md text-[11px] font-mono text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-700 font-semibold">256-BIT TLS ENCRYPTED</span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-slate-500">ISOLATED SANDBOX</span>
        </div>
      </header>

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
          <span className="hover:text-blue-600 transition-colors cursor-pointer">
            Privacy Policy
          </span>
          <span>&middot;</span>
          <span className="hover:text-blue-600 transition-colors cursor-pointer">
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