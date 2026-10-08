import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Award,
  CheckCircle2,
  Lock,
  Download,
  ExternalLink,
  Sparkles,
  FileCheck,
  Check,
  Copy,
} from "lucide-react"
import { Card, Button, ProgressBar, CountUp } from "../../components/common"

const BADGES = [
  {
    id: "b1",
    title: "Web Injection Slayer",
    category: "offensive",
    level: "Tier-2",
    unlocked: true,
    earnedDate: "Oct 04, 2026",
    description: "Successfully exploited and remediated 10 advanced SQLi & XSS vulnerable web applications.",
    xp: "+500 XP",
    iconColor: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "b2",
    title: "Packet Whisperer",
    category: "forensics",
    level: "Tier-2",
    unlocked: true,
    earnedDate: "Oct 01, 2026",
    description: "Reconstructed exfiltrated payload data from live raw PCAP streams using Wireshark & Tshark.",
    xp: "+450 XP",
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    id: "b3",
    title: "SIEM Sentinel",
    category: "defensive",
    level: "Tier-1",
    unlocked: true,
    earnedDate: "Sep 25, 2026",
    description: "Authored 15 custom detection correlation rules in Elastic SIEM to trap lateral movement.",
    xp: "+400 XP",
    iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
  {
    id: "b4",
    title: "Cryptographic Master",
    category: "defensive",
    level: "Tier-2",
    unlocked: true,
    earnedDate: "Sep 18, 2026",
    description: "Mastered public key infrastructure, TLS 1.3 handshakes, and broken algorithm confusion vectors.",
    xp: "+600 XP",
    iconColor: "text-cyan-600 bg-cyan-50 border-cyan-200",
  },
  {
    id: "b5",
    title: "Cloud IAM Auditor",
    category: "offensive",
    level: "Tier-3",
    unlocked: false,
    progress: 45,
    description: "Identify and exploit 5 AWS PassRole and AssumeRole privilege escalation paths.",
    xp: "+800 XP",
    iconColor: "text-slate-400 bg-slate-100 border-slate-200",
  },
  {
    id: "b6",
    title: "Binary Overlord",
    category: "reverse",
    level: "Tier-3",
    unlocked: false,
    progress: 20,
    description: "Construct an authenticated Return-Oriented Programming (ROP) chain to defeat ASLR on x86_64.",
    xp: "+1,000 XP",
    iconColor: "text-slate-400 bg-slate-100 border-slate-200",
  },
]

const CERTIFICATES = [
  {
    id: "cert-01",
    title: "Junior SOC Analyst Practitioner (Tier-1)",
    issuedDate: "October 01, 2026",
    credentialId: "CP-SOC-2026-9921",
    accreditation: "Aligned with NIST NICE Framework & CompTIA CySA+",
    skills: ["SIEM Triaging", "Sysmon Event Logs", "Suricata IDS", "Incident Handling"],
    hash: "0x8f2a...c31b",
  },
  {
    id: "cert-02",
    title: "Certified Web Application Defender",
    issuedDate: "September 15, 2026",
    credentialId: "CP-WEB-2026-4402",
    accreditation: "Aligned with OWASP Top 10 & CWE Enterprise Controls",
    skills: ["SQLi Parameterization", "CSP Implementation", "JWT Hardening", "CORS Auditing"],
    hash: "0x4e19...7a9d",
  },
]

export function Achievements() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [copiedId, setCopiedId] = useState(null)

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredBadges = BADGES.filter((b) => {
    if (activeCategory === "all") return true
    if (activeCategory === "unlocked") return b.unlocked
    if (activeCategory === "locked") return !b.unlocked
    return b.category === activeCategory
  })

  return (
    <div className="space-y-10 pb-16 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER BANNER
         ==================================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white uppercase tracking-wider shadow-2xs">
                ACCREDITATIONS & CREDENTIALS
              </span>
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                2 VERIFIED DIPLOMAS
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trophy Vault & Verified Certifications
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Cryptographically verifiable certificates and practical challenge badges earned through hands-on virtual lab demonstrations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[110px]">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Badges Unlocked</span>
              <span className="text-lg font-mono-tech font-extrabold text-blue-600">
                <CountUp end={4} /> / 6
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[110px]">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Diplomas</span>
              <span className="text-lg font-mono-tech font-extrabold text-emerald-600">
                <CountUp end={2} suffix=" Official" />
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center min-w-[110px] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono-tech text-slate-400 uppercase block font-bold">Leaderboard</span>
              <span className="text-lg font-mono-tech font-extrabold text-amber-600">
                Top <CountUp end={5} suffix="%" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. VERIFIED CERTIFICATES SHOWCASE (OFFICIAL CREDENTIALS)
         ==================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              Verified Industry Diplomas
            </h2>
            <p className="text-xs text-slate-500">
              Cryptographically signed credentials suitable for LinkedIn & employer verification.
            </p>
          </div>
          <span className="text-xs font-mono-tech text-slate-400">
            HASH VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CERTIFICATES.map((cert) => (
            <Card
              key={cert.id}
              className="p-6 border-slate-200/90 shadow-sm relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/20 group hover:shadow-md transition-all"
            >
              {/* Top certificate border accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="font-mono-tech text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      OFFICIAL DIPLOMA
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug pt-1">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-mono-tech">
                  {cert.accreditation}
                </p>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono-tech border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* ID & Verification Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-mono-tech text-[11px] text-slate-500">
                    <span>ID: {cert.credentialId}</span>
                    <button
                      onClick={() => handleCopy(cert.id, cert.credentialId)}
                      className="hover:text-blue-600 cursor-pointer p-0.5"
                      title="Copy Credential ID"
                    >
                      {copiedId === cert.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                    >
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ====================================================================
          3. SKILL TROPHY BADGES GALLERY
         ==================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Tactical Mastery Badges
            </h2>
            <p className="text-xs text-slate-500">
              Earned by mastering hands-on attack and defense objectives in the Cyber Range.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {["all", "unlocked", "locked"].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono-tech uppercase font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <Card
              key={badge.id}
              className={`p-5 border-slate-200/90 transition-all duration-300 relative ${
                badge.unlocked
                  ? "hover:shadow-md bg-white"
                  : "bg-slate-50/70 opacity-80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center font-bold shadow-2xs ${badge.iconColor}`}
                  >
                    {badge.unlocked ? (
                      <Award className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {badge.level}
                    </span>
                    <span className="font-mono-tech text-xs font-bold text-blue-600">
                      {badge.xp}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono-tech">
                  {badge.unlocked ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      UNLOCKED &bull; {badge.earnedDate}
                    </span>
                  ) : (
                    <div className="w-full space-y-1.5">
                      <div className="flex justify-between text-slate-500">
                        <span>LOCKED PROGRESS</span>
                        <span>{badge.progress}%</span>
                      </div>
                      <ProgressBar value={badge.progress} max={100} size="sm" variant="neutral" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ====================================================================
          4. BOTTOM CALL TO ACTION
         ==================================================================== */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">
            Ready to claim your next cybersecurity credential?
          </h3>
          <p className="text-xs text-slate-300">
            Launch the live cyber range to complete remaining objectives for the Cloud IAM Auditor badge.
          </p>
        </div>

        <Link to="/labs" className="shrink-0">
          <Button
            variant="primary"
            size="md"
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            Launch Cyber Range
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Achievements
