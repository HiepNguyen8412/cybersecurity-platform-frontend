import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Check,
  X,
  Building2,
  ChevronRight,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"

export function Pricing() {
  const { isAuthenticated } = useAuth()
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const plans = [
    {
      id: "community",
      name: "Community",
      badge: "Free Forever",
      description: "Essential hands-on drills for curious learners and aspiring security analysts.",
      monthlyPrice: 0,
      annualPrice: 0,
      period: "forever",
      popular: false,
      ctaText: isAuthenticated ? "Current Active Tier" : "Start Free Sandbox",
      ctaTo: isAuthenticated ? "/dashboard" : "/register",
      ctaVariant: "secondary",
      features: [
        { text: "15 Introductory Cloud Sandboxes", included: true },
        { text: "Core Linux & Web Security Drills", included: true },
        { text: "Standard Web-SSH Terminal Access", included: true },
        { text: "Community Support on Discord", included: true },
        { text: "Basic MITRE ATT&CK Mapping", included: true },
        { text: "Advanced CVE Exploit Scenarios", included: false },
        { text: "AI Sentinel Drill Guidance", included: false },
        { text: "Verified Completion Certificates", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro Specialist",
      badge: "Most Popular",
      description: "Full access to our entire cyber range, advanced threat vectors, and AI guidance.",
      monthlyPrice: 24,
      annualPrice: 19,
      period: "per month",
      popular: true,
      ctaText: isAuthenticated ? "Upgrade to Pro" : "Deploy Pro Sandbox",
      ctaTo: isAuthenticated ? "/dashboard" : "/register",
      ctaVariant: "primary",
      features: [
        { text: "All 120+ Sandboxed Cloud Labs", included: true },
        { text: "Full MITRE ATT&CK & OWASP Matrix", included: true },
        { text: "High-Speed Dedicated Sandbox VMs", included: true },
        { text: "AI Sentinel Real-Time Drill Guidance", included: true },
        { text: "Advanced Memory Forensics & Reverse Eng", included: true },
        { text: "Official Verifiable Skill Certificates", included: true },
        { text: "Zero-Day & Emerging CVE Drills", included: true },
        { text: "Enterprise Multi-Seat Administration", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise SOC",
      badge: "Custom Range",
      description: "Isolated cyber range environments for corporate defense teams and universities.",
      monthlyPrice: 79,
      annualPrice: 65,
      period: "per seat/month",
      popular: false,
      ctaText: "Contact Range Specialist",
      ctaTo: "/register",
      ctaVariant: "secondary",
      features: [
        { text: "Everything in Pro Specialist", included: true },
        { text: "Private Air-Gapped Cyber Ranges", included: true },
        { text: "Custom Enterprise Threat Emulations", included: true },
        { text: "SOC Team Skill Matrix & SLA Analytics", included: true },
        { text: "SSO / SAML 2.0 / Okta Integration", included: true },
        { text: "LMS / SCORM Exportable Reports", included: true },
        { text: "Dedicated Technical Range Master", included: true },
        { text: "Custom Red vs Blue Live Drills", included: true },
      ],
    },
  ]

  const comparisonFeatures = [
    {
      category: "Range Infrastructure & Sandboxing",
      items: [
        { name: "Browser-Native Linux Cloud Sandboxes", community: "15 Labs", pro: "All 120+ Labs", enterprise: "Unlimited + Custom" },
        { name: "Max Concurrent Active VMs", community: "1 Sandbox", pro: "3 Sandboxes", enterprise: "Dedicated Cluster" },
        { name: "Sandbox Cold Boot Time", community: "< 6 seconds", pro: "< 2.5 seconds", enterprise: "Instant Warm-Pool" },
        { name: "Web-SSH Session Duration", community: "60 mins / lab", pro: "Unlimited", enterprise: "Customizable SLA" },
      ],
    },
    {
      category: "Curriculum & Threat Vectors",
      items: [
        { name: "MITRE ATT&CK Framework Mapping", community: "Foundational (8)", pro: "Complete (120+)", enterprise: "Custom Adversaries" },
        { name: "Memory & Kernel Forensics (Volatility)", community: false, pro: true, enterprise: true },
        { name: "Cloud IAM & Container Breakouts", community: false, pro: true, enterprise: true },
        { name: "New Monthly Lab Releases", community: "Quarterly", pro: "Bi-Weekly", enterprise: "Priority 0-Day Releases" },
      ],
    },
    {
      category: "Mentorship & AI Telemetry",
      items: [
        { name: "AI Sentinel Tactical Hint System", community: false, pro: "Unlimited Queries", enterprise: "Team Tuned Model" },
        { name: "Dynamic Solution Diff Checker", community: "Standard", pro: "Real-time AST Check", enterprise: "Custom Evaluation Scripts" },
        { name: "Digital Verifiable Badges & Certificates", community: false, pro: true, enterprise: "White-labeled Org Badges" },
      ],
    },
  ]

  const faqs = [
    {
      q: "Do I need to install VirtualBox, VMware, or Kali Linux locally?",
      a: "No! All labs run in completely isolated cloud sandboxes streamed directly to your web browser via secure Web-SSH. You don't need powerful hardware, virtualization software, or ISO downloads.",
    },
    {
      q: "Can I cancel or change my plan anytime?",
      a: "Yes, you have full control. You can cancel your subscription with a single click inside your account settings at any moment. You will retain access until the end of your billing cycle.",
    },
    {
      q: "Are the lab completion certificates recognized by industry employers?",
      a: "Yes. Our skill badges and certificates map directly to recognized industry frameworks including the MITRE ATT&CK Matrix, NIST NICE, and OWASP Top 10, complete with cryptographic verification IDs.",
    },
    {
      q: "Do you offer university, student, or non-profit discounts?",
      a: "Yes! We provide a 30% educational discount for active students, professors, and non-profit defense organizations. Simply sign up with your .edu domain or contact our support team.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfer invoicing for Enterprise annual commitments.",
    },
  ]

  return (
    <div className="min-h-screen pt-10 sm:pt-14 pb-10 sm:pb-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* ====================================================================
            1. HERO TITLE & BILLING TOGGLE
           ==================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-mono-tech shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Predictable Pricing • Zero Hidden Infrastructure Costs
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Invest in Real Defense Mastery. <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              No Gimmicks, Just Cloud Sandboxes.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Choose the plan that suits your operational trajectory. Practice genuine adversary emulation drills with zero local configuration.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span
              className={`text-sm font-semibold select-none ${
                !isAnnual ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
              className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 transition-colors duration-200 ease-in-out focus-ring data-[checked=true]:bg-blue-600"
              data-checked={isAnnual}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-semibold select-none ${
                  isAnnual ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Annual Billing
              </span>
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-tight">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            2. THREE PRICING CARDS
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.id}
                className={`cyber-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500/80 ring-2 ring-blue-500/20 shadow-xl bg-white hover:-translate-y-1"
                    : "border-slate-200/90 bg-white/90 hover:border-slate-300 hover:-translate-y-0.5"
                }`}
              >
                {/* Popular Ribbon Tag */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-[11px] font-mono-tech font-bold uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                      {!plan.popular && (
                        <span className="text-[11px] font-mono-tech font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 min-h-[40px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5 font-mono-tech">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900">
                        ${price}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500">
                        {plan.id === "community" ? "" : isAnnual ? "/mo (annual)" : "/month"}
                      </span>
                    </div>
                    {isAnnual && plan.annualPrice > 0 && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                        Billed annually (${plan.annualPrice * 12}/year)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono-tech">
                      Included Capabilities:
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm">
                      {plan.features.map((feat) => (
                        <li
                          key={feat.text}
                          className={`flex items-start gap-2.5 ${
                            feat.included ? "text-slate-700" : "text-slate-400 opacity-60"
                          }`}
                        >
                          {feat.included ? (
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <span className={feat.included ? "font-medium" : "line-through"}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call-to-Action Button */}
                <div className="pt-8">
                  <Link
                    to={plan.ctaTo}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.popular
                        ? "cyber-btn-primary btn-cyber-interactive shadow-lg shadow-blue-500/25"
                        : "btn-cyber-interactive bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* ====================================================================
            3. ENTERPRISE & COMPLIANCE TRUST BANNER
           ==================================================================== */}
        <div className="rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Are you an Educational Institution or Government Agency?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                We offer pooled academic licensing, student grant vouchers, and air-gapped on-premise deployments.
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="btn-cyber-interactive px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-blue-600 hover:border-blue-400 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Inquire for Academic Pricing
          </Link>
        </div>

        {/* ====================================================================
            4. DETAILED FEATURE COMPARISON TABLE
           ==================================================================== */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Compare Platform Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A comprehensive technical breakdown across all tier tiers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-mono-tech">
                    <th className="py-4 px-6 font-bold w-1/2">Technical Feature</th>
                    <th className="py-4 px-4 font-bold text-center w-1/6">Community</th>
                    <th className="py-4 px-4 font-bold text-center text-blue-600 w-1/6">Pro Operator</th>
                    <th className="py-4 px-4 font-bold text-center w-1/6">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonFeatures.map((section) => (
                    <tr key={section.category} className="contents">
                      <tr className="bg-slate-100/60 font-semibold font-mono-tech text-xs text-slate-800">
                        <td colSpan={4} className="py-2.5 px-6">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-6 text-slate-700 font-medium">{row.name}</td>
                          <td className="py-3.5 px-4 text-center text-slate-600 font-mono-tech">
                            {typeof row.community === "boolean" ? (
                              row.community ? (
                                <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 mx-auto" />
                              )
                            ) : (
                              row.community
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-900 font-semibold font-mono-tech bg-blue-50/30">
                            {typeof row.pro === "boolean" ? (
                              row.pro ? (
                                <Check className="h-4 w-4 text-blue-600 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 mx-auto" />
                              )
                            ) : (
                              row.pro
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-600 font-mono-tech">
                            {typeof row.enterprise === "boolean" ? (
                              row.enterprise ? (
                                <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 mx-auto" />
                              )
                            ) : (
                              row.enterprise
                            )}
                          </td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ====================================================================
            5. FREQUENTLY ASKED QUESTIONS ACCORDION
           ==================================================================== */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear answers regarding cloud sandboxes, payment methods, and lab accreditation.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ====================================================================
            6. BOTTOM CALL-TO-ACTION (EYE-FRIENDLY CYBER DECK)
           ==================================================================== */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to elevate your threat analysis skills?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Join thousands of analysts mastering real vulnerability mitigation. Begin with the free community tier today.
            </p>
            <div className="pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="cyber-btn-primary btn-cyber-interactive inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 cursor-pointer"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Create Free Account"}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
