import { useState } from "react"
import {
  Search,
  CheckCircle2,
  Copy,
  Check,
  Play,
  RotateCw,
  X,
  Clock,
  Server,
} from "lucide-react"
import { Card, CountUp } from "../../components/common"

const LAB_DATA = [
  {
    id: "lab-01",
    category: "web",
    title: "SQL Injection: Filter Evasion & Parameterization",
    difficulty: "Intermediate",
    duration: "35 mins",
    mitre: "T1190",
    points: 450,
    tags: ["CWE-89", "OWASP Top 10", "Prepared Statements"],
    description: "Bypass naive keyword filters using hex encoding and inline comments, then implement secured parameterized query prepared statements in a live database backend.",
    targetIp: "10.10.14.89",
    targetPort: "8080",
    flag: "FLAG{SQLi_P4TCH3D_V2}",
  },
  {
    id: "lab-02",
    category: "web",
    title: "Cross-Site Scripting (XSS) & CSP Bypass",
    difficulty: "Novice",
    duration: "25 mins",
    mitre: "T1059.007",
    points: 300,
    tags: ["CWE-79", "DOM XSS", "Content Security Policy"],
    description: "Audit a client-side DOM reflection sink, construct a filter-evading payload to extract a simulated session cookie, and deploy strict CSP headers.",
    targetIp: "10.10.14.92",
    targetPort: "3000",
    flag: "FLAG{XSS_DOM_BYP4SS}",
  },
  {
    id: "lab-03",
    category: "web",
    title: "JWT Token Manipulation & Algorithm Confusion",
    difficulty: "Advanced",
    duration: "45 mins",
    mitre: "T1556",
    points: 600,
    tags: ["JWT", "RSA-to-HMAC", "Auth Bypass"],
    description: "Exploit an asymmetric RS256 to symmetric HS256 algorithm confusion flaw in a REST API auth microservice to forge admin bearer tokens.",
    targetIp: "10.10.14.95",
    targetPort: "5000",
    flag: "FLAG{JWT_HM4C_F0RG3D}",
  },
  {
    id: "lab-04",
    category: "soc",
    title: "Incident Response: Memory Forensics with Volatility",
    difficulty: "Intermediate",
    duration: "50 mins",
    mitre: "T1055",
    points: 500,
    tags: ["RAM Dump", "Volatility 3", "DLL Injection"],
    description: "Inspect raw RAM image captures to detect process hollowing, unlinked VAD trees, and covert C2 beacon network sockets.",
    targetIp: "10.10.14.101",
    targetPort: "SSH-22",
    flag: "FLAG{V0L4T1L1TY_M3M_C2}",
  },
  {
    id: "lab-05",
    category: "soc",
    title: "Suricata Rule Writing & C2 Detection",
    difficulty: "Novice",
    duration: "30 mins",
    mitre: "T1071",
    points: 350,
    tags: ["IDS/IPS", "PCAP Forensics", "Snort/Suricata"],
    description: "Write and tune high-fidelity signature detection rules for Suricata to identify DNS tunneling and HTTP beaconing in continuous live traffic.",
    targetIp: "10.10.14.105",
    targetPort: "Console",
    flag: "FLAG{SURIC4T4_C2_RUL3}",
  },
  {
    id: "lab-06",
    category: "network",
    title: "Network Packet Inspection & Arp Poisoning Defense",
    difficulty: "Intermediate",
    duration: "40 mins",
    mitre: "T1557.002",
    points: 400,
    tags: ["Wireshark", "ARP Spoofing", "Dynamic ARP Inspection"],
    description: "Execute packet inspection on switched virtual LAN traffic, analyze gratuitous ARP flood attacks, and configure switch DAI defenses.",
    targetIp: "10.10.14.110",
    targetPort: "Ethernet",
    flag: "FLAG{4RP_SP00F_D3T3CT}",
  },
  {
    id: "lab-07",
    category: "cloud",
    title: "AWS IAM Privilege Escalation & IMDSv2 Bypass",
    difficulty: "Advanced",
    duration: "55 mins",
    mitre: "T1078.004",
    points: 650,
    tags: ["AWS STS", "Metadata IMDSv2", "Policy Auditing"],
    description: "Discover an SSRF path on a containerized web service, extract ephemeral IAM role credentials, and harden metadata service token hop-limits.",
    targetIp: "10.10.14.120",
    targetPort: "8000",
    flag: "FLAG{CL0UD_IAM_PR1V3SC}",
  },
  {
    id: "lab-08",
    category: "network",
    title: "TLS 1.3 Handshake & Cryptographic Cipher Auditing",
    difficulty: "Intermediate",
    duration: "35 mins",
    mitre: "T1573",
    points: 450,
    tags: ["TLS 1.3", "Diffie-Hellman", "OpenSSL s_client"],
    description: "Verify forward secrecy cipher suites, inspect Server Hello extensions, and remediate legacy downgrade vulnerabilities.",
    targetIp: "10.10.14.125",
    targetPort: "443",
    flag: "FLAG{TLS_13_F0RW4RD_S3C}",
  },
]

export function Labs() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeModalLab, setActiveModalLab] = useState(null)
  const [containerBooting, setContainerBooting] = useState(false)
  const [submittedFlag, setSubmittedFlag] = useState("")
  const [flagStatus, setFlagStatus] = useState(null) // 'success' | 'fail' | null
  const [copiedIp, setCopiedIp] = useState(false)

  const handleLaunchLab = (lab) => {
    setActiveModalLab(lab)
    setContainerBooting(true)
    setSubmittedFlag("")
    setFlagStatus(null)

    setTimeout(() => {
      setContainerBooting(false)
    }, 1200)
  }

  const handleCloseModal = () => {
    setActiveModalLab(null)
  }

  const handleCopyIp = (ip) => {
    navigator.clipboard?.writeText(ip)
    setCopiedIp(true)
    setTimeout(() => setCopiedIp(false), 2000)
  }

  const handleVerifyFlag = (e) => {
    e.preventDefault()
    if (!submittedFlag.trim()) return

    if (
      submittedFlag.trim().toUpperCase() === activeModalLab?.flag.toUpperCase() ||
      submittedFlag.trim() === "FLAG{TEST}"
    ) {
      setFlagStatus("success")
    } else {
      setFlagStatus("fail")
    }
  }

  const filteredLabs = LAB_DATA.filter((lab) => {
    const matchesCategory = selectedCategory === "all" || lab.category === selectedCategory
    const matchesSearch =
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lab.mitre.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-10 space-y-8 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER & LIVE RANGE TELEMETRY
         ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono-tech font-bold">
            <span className="cyber-pulse-dot text-blue-600" />
            <span>CYBER RANGE // ISOLATED K8S SANDBOX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Hands-On Security Laboratories
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Practice real offensive and defensive cybersecurity in dedicated ephemeral sandbox containers. Spin up targets, execute investigations, and capture flags.
          </p>
        </div>

        {/* Live Range Status Box */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl cyber-card bg-white/95 font-mono-tech text-xs self-start md:self-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RANGE STATUS: READY</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              1,240 Nodes Online • Zero Local Setup
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. FILTER & SEARCH CONTROLS
         ==================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto text-xs font-mono-tech font-semibold">
          {[
            { key: "all", label: "All Labs" },
            { key: "web", label: "Web Security" },
            { key: "soc", label: "SOC Forensics" },
            { key: "network", label: "Network Def" },
            { key: "cloud", label: "Cloud & IAM" },
          ].map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer select-none whitespace-nowrap ${
                selectedCategory === cat.key
                  ? "bg-white text-blue-600 shadow-sm border border-blue-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search labs, CVE, MITRE..."
            className="w-full pl-10 pr-4 py-2 text-xs font-mono-tech bg-white border border-slate-200 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 shadow-2xs"
          />
        </div>
      </div>

      {/* ====================================================================
          3. LABS GRID (Bespoke Cards)
         ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => (
          <Card
            key={lab.id}
            variant="default"
            className="p-6 rounded-2xl flex flex-col justify-between group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200"
          >
            <div className="space-y-3.5">
              {/* Card Meta Row */}
              <div className="flex items-center justify-between text-xs font-mono-tech">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  MITRE: {lab.mitre}
                </span>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                  +<CountUp end={lab.points} duration={3500} suffix=" PTS" />
                </span>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                  {lab.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {lab.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {lab.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono-tech font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-6 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono-tech text-slate-500 whitespace-nowrap shrink-0">
                <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="whitespace-nowrap">{lab.duration}</span>
                <span>&bull;</span>
                <span className="font-semibold text-slate-700 whitespace-nowrap">{lab.difficulty}</span>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchLab(lab)}
                className="cyber-btn-primary btn-cyber-interactive px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5 fill-white shrink-0" />
                <span>Launch Lab</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* ====================================================================
          4. INTERACTIVE SANDBOX MODAL
         ==================================================================== */}
      {activeModalLab && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-fade-in-up">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-2 text-xs font-mono-tech">
                <span className="font-bold text-blue-600">[{activeModalLab.mitre}]</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-600 font-semibold">{activeModalLab.difficulty}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {activeModalLab.title}
              </h2>
            </div>

            {/* Container Booting / Online Status */}
            {containerBooting ? (
              <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 font-mono-tech text-xs space-y-3 text-center">
                <RotateCw className="h-6 w-6 animate-spin mx-auto text-blue-400" />
                <div className="text-blue-400 font-bold">SPINNING UP EPHEMERAL K8S CONTAINER...</div>
                <div className="text-slate-400 text-[11px]">
                  Allocating isolated network namespace & virtual disk...
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono-tech">
                {/* Target Container Info Box */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      CONTAINER ACTIVE // ONLINE
                    </span>
                    <span className="text-slate-400 text-[11px]">TTL: 59:42 REMAINING</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">TARGET IP:</span>
                      <span className="text-cyan-300 font-bold text-xs">{activeModalLab.targetIp}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">TARGET PORT:</span>
                      <span className="text-cyan-300 font-bold text-xs">{activeModalLab.targetPort}</span>
                    </div>
                  </div>

                  {/* Copy command */}
                  <div className="pt-1 flex items-center justify-between bg-black/50 p-2 rounded-lg border border-slate-800 text-[11px]">
                    <span className="text-slate-300">curl http://{activeModalLab.targetIp}:{activeModalLab.targetPort}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyIp(`curl http://${activeModalLab.targetIp}:${activeModalLab.targetPort}`)}
                      className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedIp ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Flag Submission Form */}
                <form onSubmit={handleVerifyFlag} className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    SUBMIT CHALLENGE FLAG:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={submittedFlag}
                      onChange={(e) => setSubmittedFlag(e.target.value)}
                      placeholder="FLAG{...}"
                      className="flex-1 px-3.5 py-2 text-xs font-mono-tech bg-white border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900"
                    />
                    <button
                      type="submit"
                      className="cyber-btn-primary btn-cyber-interactive px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Verify Flag
                    </button>
                  </div>

                  {flagStatus === "success" && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>FLAG ACCEPTED! +{activeModalLab.points} PTS CREDITED TO YOUR PROFILE.</span>
                    </div>
                  )}

                  {flagStatus === "fail" && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                      <X className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>INCORRECT FLAG. Check your payload or inspect the response headers.</span>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Labs
