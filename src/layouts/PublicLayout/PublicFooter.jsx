import { Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white transition-colors">
      {/* Top Footer Main Columns - Fine-tuned Compact Layout */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Col 1 & 2: Platform Identity, Mission & Live Telemetry */}
          <div className="lg:col-span-2 space-y-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg group"
              title="CyberPath — Home"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
                <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
              </div>
              <span className="text-base font-black tracking-tight text-slate-900 leading-none">
                Cyber<span className="text-blue-600">Path</span>
              </span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Hands-on cybersecurity range and real-time sandbox training. Practice threat hunting, exploit reverse-engineering, and incident hotpatching directly in your browser.
            </p>

            {/* Live Operational Status Pill */}
            <div className="pt-0.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-mono-tech text-slate-600 select-none cursor-default">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="font-medium">All systems operational &bull; 99.98% SLA</span>
              </div>
            </div>
          </div>

          {/* Col 3: Platform Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono-tech cursor-default">
              Platform
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/labs" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Interactive Cloud Labs
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Structured Learning Paths
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Curriculum & Modules
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Analyst Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Drill Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono-tech cursor-default">
              Lab Drills
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/labs" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Web Exploit Defense
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Memory Forensics (RAM)
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Network PCAP Traffic
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-slate-500 hover:text-blue-600 transition-colors">
                  AWS IAM Privilege Escalation
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Suricata IDS Hunting
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono-tech cursor-default">
              Security & Trust
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/pricing" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Academic Grants
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Documentation & Guides
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Vulnerability Disclosure
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-slate-100 bg-slate-50/60 py-3">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 cursor-default select-none text-[11px]">
            <span>&copy; {currentYear} CyberPath Security Inc.</span>
            <span className="text-slate-300">&bull;</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono-tech text-slate-400 cursor-default select-none">
            <span>REGION: AP-SOUTHEAST // US-EAST</span>
            <span className="text-slate-300">&bull;</span>
            <span>TLS 1.3 ENFORCED</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
