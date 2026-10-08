import { useState } from "react"
import {
  Shield,
  Key,
  Terminal,
  Copy,
  Check,
  Globe,
  GitBranch,
  Mail,
  MapPin,
  Lock,
  Flame,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { Card, Badge, Button } from "../../components/common"

export function Profile() {
  const { user } = useAuth()
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const learnerName = user?.fullName || user?.name || "Hiệp Nguyễn"
  const learnerEmail = user?.email || "hiep.nguyen@cyberpath.edu"
  const pgpKey = "9B82 E01A 4F78 D23B C901  55A1 8E32 7A4D 2209 11BC"

  const handleCopyKey = () => {
    navigator.clipboard.writeText(pgpKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://cyberpath.io/p/${learnerName.toLowerCase().replace(/\s+/g, ".")}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="space-y-8 pb-16 animate-fade-in-up">
      {/* ====================================================================
          1. DOSSIER IDENTITY BANNER
         ==================================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Cyber Halo Ring */}
            <div className="relative">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-md border-2 border-white">
                {learnerName.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Online & Operational">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {learnerName}
                </h1>
                <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  CLEARANCE: TIER-2 SPECIALIST
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-mono-tech flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {learnerEmail}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  Hanoi SOC Node
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  7-Day Streak
                </span>
              </p>

              <p className="text-xs text-slate-500 max-w-xl pt-0.5">
                Cybersecurity Apprentice specializing in Web Application Penetration Testing, defensive SIEM correlation rules, and enterprise incident response.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex sm:flex-col gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            >
              {copiedLink ? "Link Copied!" : "Share Dossier"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Shield className="h-3.5 w-3.5" />}
            >
              Verified CV
            </Button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. TWO-COLUMN DETAILS: SKILLS & CRYPTOGRAPHIC PGP FINGERPRINT
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: VERIFIED SKILLS & CTF RECORD (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Verified Tactical Competencies
              </h2>
              <span className="text-xs font-mono-tech text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PROCTORED
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { name: "Web Application Pentesting (OWASP Top 10)", level: "Advanced", pct: 92 },
                { name: "SIEM Logstash & Sysmon Hunting", level: "Proficient", pct: 82 },
                { name: "Network Packet Forensics & Wireshark", level: "Proficient", pct: 75 },
                { name: "Applied Cryptography & SSL/TLS Analysis", level: "Proficient", pct: 70 },
                { name: "Cloud Infrastructure & AWS IAM Auditing", level: "Developing", pct: 48 },
              ].map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-800">{skill.name}</span>
                    <span className="font-mono-tech text-blue-600 font-bold">{skill.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* RANGE STATS & COMMUNITY HANDLE */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-600" />
              External Platform Identifiers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <GitBranch className="h-5 w-5 text-slate-700" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">GitHub</span>
                    <span className="text-[11px] text-slate-500 font-mono">@hiepnguyen8412</span>
                  </div>
                </div>
                <Badge variant="success" size="sm">Connected</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Hack The Box</span>
                    <span className="text-[11px] text-slate-500 font-mono">Rank: Pro Hacker</span>
                  </div>
                </div>
                <Badge variant="primary" size="sm">Linked</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: PGP PUBLIC KEY FINGERPRINT & SECURITY CONTROLS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* PGP KEY CARD */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900">
                  PGP Public Fingerprint
                </h3>
              </div>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                RSA 4096-BIT
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Used for cryptographic signing of verified lab completions and encrypted report deliveries:
            </p>

            <div className="rounded-xl bg-slate-900 p-3.5 font-mono text-[11px] text-emerald-400 break-all space-y-2 border border-slate-800 shadow-inner">
              <div>{pgpKey}</div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyKey}
              leftIcon={copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              className="w-full justify-center"
            >
              {copiedKey ? "Fingerprint Copied!" : "Copy PGP Fingerprint"}
            </Button>
          </Card>

          {/* ACTIVE CLEARANCE CERTIFICATION */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-blue-300">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>SECURITY AUDIT: CURRENT</span>
            </div>

            <h4 className="text-sm font-bold text-white">
              Two-Factor Authentication: FIDO2 Hardware Key
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your platform account is protected with hardware-enforced WebAuthn authentication. Session expiration is enforced every 8 hours.
            </p>

            <div className="pt-1">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-1 rounded inline-block">
                LAST AUDITED: TODAY 08:30 UTC
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
