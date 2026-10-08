import { useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Terminal, 
  CreditCard, 
  Mail, 
  Compass, 
  MessageSquare
} from "lucide-react"

/**
 * QuickHelpModal
 * Interactive assistance dialog triggered by the floating '?' button on public pages.
 * Provides immediate answers, navigational shortcuts, and support channels.
 */
export default function QuickHelpModal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const quickFaqs = [
    {
      q: "Do I need to install any software or VMs?",
      a: "No! All labs run in isolated browser containers with interactive terminals, Wireshark packet capture, and code editors directly in your web browser.",
    },
    {
      q: "Can I start learning for free?",
      a: "Yes. Our Community tier includes 25+ essential foundational labs, MITRE ATT&CK mappings, and core courses with zero credit card required.",
    },
    {
      q: "Where can I view all pricing options?",
      a: "Visit our dedicated Pricing page to compare Free, Pro ($29/mo), and Enterprise plans.",
      linkTo: "/pricing",
      linkText: "View Pricing →",
    },
  ]

  const quickLinks = [
    {
      label: "Hands-on Labs",
      desc: "120+ active practice environments",
      to: "/labs",
      icon: Terminal,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Learning Paths",
      desc: "Structured career roadmaps",
      to: "/learning-paths",
      icon: Compass,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      label: "Courses Catalog",
      desc: "Browse offensive & defensive training",
      to: "/courses",
      icon: BookOpen,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
    {
      label: "Pricing & FAQs",
      desc: "Billing tiers and enterprise custom plans",
      to: "/pricing",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-lg font-bold text-slate-900 leading-tight">
                Help & Quick Center
              </h2>
              <p className="text-xs text-slate-500">
                Frequently asked questions & platform navigation
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close help modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          {/* Section 1: Quick Navigation Shortcuts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-tech">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start gap-3 group cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-xs sm:text-sm">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Section 2: Frequently Asked Questions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-tech">
              Common Questions
            </h3>
            <div className="space-y-3">
              {quickFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-xs"
                >
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-blue-600 font-mono-tech">Q:</span> {faq.q}
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-4">
                    {faq.a}
                  </p>
                  {faq.linkTo && (
                    <div className="pl-4 pt-1">
                      <Link
                        to={faq.linkTo}
                        onClick={onClose}
                        className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {faq.linkText}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Contact & Support */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                Still need help?
              </div>
              <div className="text-[11px] text-blue-800/80">
                Our cybersecurity mentorship & engineering team is ready to assist.
              </div>
            </div>
            <a
              href="mailto:support@cyberpath.io"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono-tech px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-slate-600">Range Services: 100% Operational</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close ESC
          </button>
        </div>
      </div>
    </div>
  )
}
