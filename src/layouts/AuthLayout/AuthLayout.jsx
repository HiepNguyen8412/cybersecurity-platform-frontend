import { Link } from "react-router-dom"
import { ShieldCheck, FlaskConical, Sparkles, Award, Star } from "lucide-react"
import { Badge } from "../../components/common"

/**
 * Polished, modern EdTech AuthLayout.
 * Desktop: Left authentication form, Right subtle product/learning visual area.
 * Smaller screens: Single-column centered form focusing entirely on authentication.
 */
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* ====================================================================
          LEFT: Authentication Form Area
         ==================================================================== */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-white z-10 min-h-screen">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-0.5"
            title="CyberPath Platform"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xs">
              <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
                CyberPath
              </span>
              <span className="text-[11px] font-medium text-slate-500 leading-tight">
                Learning Platform
              </span>
            </div>
          </Link>

          <Badge variant="secondary" size="sm">
            EdTech Platform
          </Badge>
        </div>

        {/* Central Auth Form Container */}
        <div className="w-full max-w-[420px] mx-auto my-auto py-8 sm:py-12">
          {children}
        </div>

        {/* Auth Footer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} CyberPath, Inc.</span>
          <div className="flex items-center gap-3">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>&middot;</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          RIGHT: Subtle Product / Learning Visual Area (Desktop Only)
         ==================================================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-slate-100/60 p-12 xl:p-16 flex-col justify-between relative overflow-hidden border-l border-slate-200/80">
        {/* Subtle Decorative Geometric Circles */}
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-100/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Pitch */}
        <div className="relative z-10 max-w-lg space-y-3">
          <Badge variant="primary" size="md" dot>
            Interactive Cybersecurity Education
          </Badge>

          <h1 className="text-2xl xl:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Master cybersecurity through hands-on practice, not just theory.
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Practice in isolated browser sandboxes, follow guided career paths, and receive real-time hints from your contextual AI mentor.
          </p>
        </div>

        {/* Center: 3 Subtle Learning Preview Cards */}
        <div className="relative z-10 max-w-lg space-y-3.5 my-8">
          {/* 1. Hands-on Sandboxes */}
          <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs flex items-start gap-3.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-xs font-bold text-slate-900 leading-tight">
                  Simulated Defense Sandboxes
                </h2>
                <Badge variant="success" size="sm">Zero Setup</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Safely investigate SQL injections, XSS vulnerabilities, and firewall configs directly in your browser.
              </p>
            </div>
          </div>

          {/* 2. Contextual AI Mentor */}
          <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs flex items-start gap-3.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-xs font-bold text-slate-900 leading-tight">
                  Contextual AI Mentor
                </h2>
                <Badge variant="primary" size="sm">Learning Assistant</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Stuck on a lab step? Request concept simplifications, guiding hints, or mistake breakdowns instantly.
              </p>
            </div>
          </div>

          {/* 3. Verifiable Career Progress */}
          <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-xs flex items-start gap-3.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-xs font-bold text-slate-900 leading-tight">
                  Structured Career Progression
                </h2>
                <Badge variant="purple" size="sm">Industry Aligned</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Earn verifiable milestone badges and progress systematically from apprentice to security professional.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof / Learner Testimonial */}
        <div className="relative z-10 max-w-lg p-4 rounded-xl bg-white/60 border border-slate-200/60 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">
              Trusted by 15,000+ Learners
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">
              From security beginners to SOC tier-1 analysts.
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-amber-500">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 ml-1">4.9/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout