import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  CheckCircle2,
  Clock,
  Award,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Terminal,
  Flame,
  HelpCircle,
  Check,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"
import { Card, Badge, Button, ProgressBar, CountUp } from "../../components/common"

const COURSE_MODULES = [
  {
    id: "mod-web201",
    code: "WEB-201",
    category: "web",
    title: "Advanced Web Application Penetration Testing & OWASP Top 10",
    difficulty: "Intermediate",
    duration: "18 Hours",
    lessonsCount: 6,
    labsCount: 4,
    enrolledCount: "4,120",
    progress: 65,
    mitre: "T1190 / T1059",
    cert: "CEH / eJPT",
    description:
      "Master exploitation vectors across modern single-page apps and microservices. Dive deep into SQL injection filter evasion, DOM & Reflected XSS, Server-Side Request Forgery (SSRF), and broken object-level authorization (BOLA).",
    labLink: "/labs",
    syllabus: [
      { id: "s1", title: "HTTP Protocol Internals, Header Manipulation & CORS Flaws", duration: "2h 15m", completed: true },
      { id: "s2", title: "SQLi: Hex Encoding, Second-Order Injection & Parameterization", duration: "3h 40m", completed: true },
      { id: "s3", title: "Cross-Site Scripting (XSS): DOM Sinks & Modern CSP Bypasses", duration: "3h 10m", completed: true },
      { id: "s4", title: "Server-Side Request Forgery (SSRF) & Cloud Metadata Extraction", duration: "3h 30m", completed: false },
      { id: "s5", title: "JWT Algorithm Confusion & Insecure Direct Object References (IDOR)", duration: "2h 45m", completed: false },
      { id: "s6", title: "Capstone Lab: Enterprise Web Target Exploitation & Flag Capture", duration: "3h 00m", completed: false },
    ],
  },
  {
    id: "mod-soc101",
    code: "SOC-101",
    category: "defensive",
    title: "SOC Operations, SIEM Threat Hunting & Elastic Logstash",
    difficulty: "Novice",
    duration: "14 Hours",
    lessonsCount: 5,
    labsCount: 3,
    enrolledCount: "5,840",
    progress: 30,
    mitre: "T1078 / T1053",
    cert: "CompTIA Sec+ / CySA+",
    description:
      "Develop Tier-1 & Tier-2 Security Operations Center competencies. Configure SIEM correlation rules in Elastic & Splunk, identify living-off-the-land binaries (LOLBins), and parse Windows Event Logs (Sysmon) for anomalous process spawns.",
    labLink: "/labs",
    syllabus: [
      { id: "s1", title: "SOC Architecture, Triaging Workflows & Severity Matrix", duration: "2h 00m", completed: true },
      { id: "s2", title: "Windows Event Logs: Sysmon Event ID 1, 3, and 10 Analysis", duration: "3h 15m", completed: true },
      { id: "s3", title: "SIEM Threat Hunting Queries: Elastic KQL & Splunk SPL Syntax", duration: "3h 30m", completed: false },
      { id: "s4", title: "Snort & Suricata IDS Rule Authoring for Command-and-Control", duration: "2h 45m", completed: false },
      { id: "s5", title: "Live Incident Simulation: APT Lateral Movement Containment", duration: "2h 30m", completed: false },
    ],
  },
  {
    id: "mod-net301",
    code: "NET-301",
    category: "network",
    title: "Packet Forensics, Wireshark Protocol Analysis & MITM Attacks",
    difficulty: "Intermediate",
    duration: "16 Hours",
    lessonsCount: 5,
    labsCount: 3,
    enrolledCount: "3,410",
    progress: 0,
    mitre: "T1040 / T1557",
    cert: "CompTIA Network+ / CCNA",
    description:
      "Dissect layer-2 through layer-7 network traffic down to raw bytes. Detect ARP poisoning, DNS exfiltration tunnels, and rogue DHCP servers using Wireshark, Tshark, and tcpdump capture filters.",
    labLink: "/labs",
    syllabus: [
      { id: "s1", title: "TCP 3-Way Handshake, Window Scaling & Reset Injection", duration: "2h 30m", completed: false },
      { id: "s2", title: "Wireshark Display Filter Mastery & Stream Reconstruction", duration: "3h 15m", completed: false },
      { id: "s3", title: "ARP Spoofing & SSL/TLS Man-in-the-Middle Inspection", duration: "3h 45m", completed: false },
      { id: "s4", title: "DNS Tunneling Detection & Protocol Anomaly Profiling", duration: "3h 00m", completed: false },
      { id: "s5", title: "Network Forensics PCAP Challenge: Extracting Exfiltrated Credentials", duration: "3h 30m", completed: false },
    ],
  },
  {
    id: "mod-cld401",
    code: "CLD-401",
    category: "cloud",
    title: "Cloud Infrastructure Security & AWS IAM Privilege Escalation",
    difficulty: "Specialist",
    duration: "22 Hours",
    lessonsCount: 6,
    labsCount: 5,
    enrolledCount: "2,290",
    progress: 0,
    mitre: "T1078.004 / T1538",
    cert: "AWS Certified Security / CCSP",
    description:
      "Inspect real misconfigurations across AWS, Azure, and Kubernetes. Learn how attackers leverage PassRole permissions, S3 bucket enumeration, and container escapes to compromise enterprise cloud accounts.",
    labLink: "/labs",
    syllabus: [
      { id: "s1", title: "Cloud Shared Responsibility & IAM Policy Evaluation Logic", duration: "3h 00m", completed: false },
      { id: "s2", title: "AWS IAM 21 Privilege Escalation Attack Vectors Explained", duration: "4h 30m", completed: false },
      { id: "s3", title: "S3 Bucket Auditing, ACL Misconfigurations & Object Encryption", duration: "3h 15m", completed: false },
      { id: "s4", title: "Kubernetes Cluster Hardening: RBAC & Pod Security Standards", duration: "4h 00m", completed: false },
      { id: "s5", title: "Container Breakout: Exploiting Privileged Pods & Docker Socket", duration: "3h 45m", completed: false },
      { id: "s6", title: "Cloud Range Capstone: Lateral Movement from EC2 to Org Root", duration: "3h 30m", completed: false },
    ],
  },
  {
    id: "mod-rev501",
    code: "REV-501",
    category: "reverse",
    title: "Binary Exploitation, x86_64 Stack Overflows & Ghidra",
    difficulty: "Specialist",
    duration: "26 Hours",
    lessonsCount: 6,
    labsCount: 5,
    enrolledCount: "1,870",
    progress: 0,
    mitre: "T1203 / T1055",
    cert: "OSCP / OSED",
    description:
      "Dive into CPU registers, stack frame mechanics, and memory corruption. Dissect compiled C/C++ binaries in Ghidra, craft shellcode payloads, and bypass modern exploit mitigations like ASLR and DEP.",
    labLink: "/labs",
    syllabus: [
      { id: "s1", title: "x86_64 Architecture, Registers & Calling Conventions", duration: "3h 30m", completed: false },
      { id: "s2", title: "Ghidra Decompiler Fundamentals & Static Function Mapping", duration: "4h 00m", completed: false },
      { id: "s3", title: "Classic Stack-Based Buffer Overflow & RIP Control", duration: "4h 30m", completed: false },
      { id: "s4", title: "Writing Custom Linux x86_64 Execve Shellcode", duration: "4h 15m", completed: false },
      { id: "s5", title: "Return-Oriented Programming (ROP) Chains & ASLR Defeats", duration: "5h 00m", completed: false },
      { id: "s6", title: "Binary Target Challenge: Exploit Vulnerable Network Daemon", duration: "4h 45m", completed: false },
    ],
  },
  {
    id: "mod-sec101",
    code: "SEC-101",
    category: "defensive",
    title: "Applied Cryptography, TLS/SSL & Public Key Infrastructure",
    difficulty: "Novice",
    duration: "12 Hours",
    lessonsCount: 4,
    labsCount: 2,
    enrolledCount: "6,920",
    progress: 100,
    mitre: "T1573 / T1557",
    cert: "CompTIA Sec+ / CISSP",
    description:
      "Demystify symmetric vs asymmetric ciphers, hashing algorithms, and digital certificates. Learn how AES-GCM, RSA, and Elliptic Curves protect data in transit and at rest, and audit misconfigured SSL ciphers.",
    labLink: "/labs",
    syllabus: [
      { id: "s1", title: "Symmetric Encryption: Block Ciphers, Modes & AES-GCM", duration: "2h 30m", completed: true },
      { id: "s2", title: "Asymmetric Cryptography: RSA, Diffie-Hellman & ECC", duration: "3h 15m", completed: true },
      { id: "s3", title: "Cryptographic Hashes & Salted HMAC Signatures", duration: "2h 45m", completed: true },
      { id: "s4", title: "PKI, Certificate Authorities & SSL/TLS Handshake Decryption", duration: "3h 30m", completed: true },
    ],
  },
]

const CATEGORIES = [
  { id: "all", label: "All Modules", count: 6 },
  { id: "web", label: "Web Security & OWASP", count: 1 },
  { id: "defensive", label: "SOC & Cryptography", count: 2 },
  { id: "network", label: "Network Forensics", count: 1 },
  { id: "cloud", label: "Cloud & Containers", count: 1 },
  { id: "reverse", label: "Binary & Reverse Eng", count: 1 },
]

export function Learning() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [expandedSyllabus, setExpandedSyllabus] = useState({ "mod-web201": true })
  
  // Interactive Daily Threat Drill State
  const [drillAnswer, setDrillAnswer] = useState(null)
  const [drillSubmitted, setDrillSubmitted] = useState(false)

  const toggleSyllabus = (modId) => {
    setExpandedSyllabus((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }))
  }

  const filteredModules = COURSE_MODULES.filter((mod) => {
    const matchesCategory = activeCategory === "all" || mod.category === activeCategory
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      mod.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.cert.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesDifficulty && matchesSearch
  })

  const handleDrillSubmit = (index) => {
    setDrillAnswer(index)
    setDrillSubmitted(true)
  }

  const handleDrillReset = () => {
    setDrillAnswer(null)
    setDrillSubmitted(false)
  }

  return (
    <div className="space-y-10 pb-10 sm:pb-12 animate-fade-in-up">
      {/* ====================================================================
          1. ACADEMY MISSION CONTROL HUD (HERO BANNER)
         ==================================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-8 overflow-hidden">
        {/* Subtle Decorative Cyber Laser line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />
        
        {/* Soft Cyber Background Watermark */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none select-none">
          <Shield className="w-80 h-80 text-blue-900" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white uppercase tracking-wider shadow-2xs">
                ACADEMY CURRICULUM
              </span>
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>6 LIVE TRACKS OPERATIONAL</span>
              </span>
              <span className="font-mono-tech text-[10px] text-slate-500 hidden sm:inline-block">
                NIST SP 800-181 & MITRE ATT&CK ALIGNED
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Cybersecurity Training Curriculum & Interactive Modules
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Step-by-step modular courses engineered with realistic threat scenarios. Gain hands-on competency in defensive triage, penetration testing, and forensic investigation with dedicated virtual target environments.
            </p>
          </div>

          {/* Quick HUD Metrics Card */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs backdrop-blur-sm shrink-0 min-w-[280px]">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase block">Active Learners</span>
              <span className="text-lg font-mono-tech font-extrabold text-blue-600">
                <CountUp end={14820} />
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase block">Labs Mapped</span>
              <span className="text-lg font-mono-tech font-extrabold text-emerald-600">
                <CountUp end={68} suffix=" Target VMs" />
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase block">Skill Badges</span>
              <span className="text-lg font-mono-tech font-extrabold text-indigo-600">
                <CountUp end={24} suffix=" Accreditations" />
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono-tech font-bold text-slate-400 uppercase block">Current Season</span>
              <span className="text-lg font-mono-tech font-extrabold text-amber-600">Tier-2 Range</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. FILTER & SEARCH CONTROL MATRIX
         ==================================================================== */}
      <div className="space-y-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Difficulty Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search module code (e.g. WEB-201), CVE, OWASP or cert..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500 font-mono-tech hidden sm:inline">DIFFICULTY:</span>
            {["all", "novice", "intermediate", "specialist"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech uppercase font-medium transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. MAIN MODULE LISTING & INTERACTIVE DRILL SIDEBAR
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: MODULE CARDS WITH EXPANDABLE SYLLABUS (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono-tech uppercase tracking-wider text-slate-500">
              AVAILABLE CURRICULUM ({filteredModules.length} MODULES)
            </h2>
            <span className="text-xs text-slate-500 font-mono-tech">
              CLICK MODULE TO VIEW EXPANDED SYLLABUS
            </span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-600">No modules match your current filter parameters.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveCategory("all")
                  setSelectedDifficulty("all")
                  setSearchQuery("")
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredModules.map((mod) => {
              const isExpanded = !!expandedSyllabus[mod.id]
              const isEnrolled = mod.progress > 0

              return (
                <Card
                  key={mod.id}
                  variant={isEnrolled ? "focal" : "default"}
                  className="p-5 sm:p-6 transition-all duration-300 hover:shadow-md border-slate-200/90 relative overflow-hidden group"
                >
                  {/* Subtle top indicator for enrolled courses */}
                  {isEnrolled && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-500" />
                  )}

                  <div className="space-y-4">
                    {/* Header Row: Code + Cert + Difficulty + Duration */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded font-mono-tech text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {mod.code}
                        </span>

                        <Badge
                          variant={
                            mod.difficulty === "Novice"
                              ? "success"
                              : mod.difficulty === "Intermediate"
                              ? "primary"
                              : "warning"
                          }
                          size="sm"
                        >
                          {mod.difficulty}
                        </Badge>

                        <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {mod.cert}
                        </span>

                        <span className="text-[11px] font-mono-tech px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200 hidden sm:inline-block">
                          MITRE: {mod.mitre}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono-tech text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-blue-600" />
                          {mod.duration}
                        </span>
                        <span className="flex items-center gap-1 hidden sm:flex">
                          <Layers className="h-3.5 w-3.5 text-slate-400" />
                          {mod.lessonsCount} Lessons
                        </span>
                      </div>
                    </div>

                    {/* Title & Technical Description */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {mod.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    {/* Progress Bar (if enrolled) */}
                    {isEnrolled && (
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="text-slate-700 font-mono-tech">COURSE PROGRESS</span>
                          <span className="text-blue-600 font-mono-tech">{mod.progress}% COMPLETE</span>
                        </div>
                        <ProgressBar value={mod.progress} max={100} size="sm" variant="primary" />
                      </div>
                    )}

                    {/* Action Bar & Accordion Trigger */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">
                      <button
                        onClick={() => toggleSyllabus(mod.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span>Hide Detailed Syllabus</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span>View Syllabus ({mod.lessonsCount} Lessons & {mod.labsCount} Labs)</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2.5">
                        <Link to={mod.labLink}>
                          <Button variant="outline" size="sm" leftIcon={<Terminal className="h-3.5 w-3.5" />}>
                            Hands-on Lab
                          </Button>
                        </Link>

                        <Button
                          variant="primary"
                          size="sm"
                          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                        >
                          {mod.progress === 100
                            ? "Review Course"
                            : mod.progress > 0
                            ? "Continue Module"
                            : "Enroll Now"}
                        </Button>
                      </div>
                    </div>

                    {/* Expandable Syllabus Drawer */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 animate-fade-in-up">
                        <h4 className="text-[11px] font-mono-tech font-bold uppercase text-slate-500 tracking-wider">
                          SYLLABUS & PRACTICAL LABS
                        </h4>
                        <div className="space-y-1.5">
                          {mod.syllabus.map((lesson, idx) => (
                            <div
                              key={lesson.id}
                              className={`p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                                lesson.completed
                                  ? "bg-emerald-50/60 border border-emerald-100 text-slate-700"
                                  : "bg-slate-50 hover:bg-slate-100/80 border border-slate-100 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono-tech text-[10px] text-slate-400 font-bold w-4">
                                  0{idx + 1}
                                </span>
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                                  </div>
                                )}
                                <span className={`font-medium ${lesson.completed ? "line-through text-slate-500" : ""}`}>
                                  {lesson.title}
                                </span>
                              </div>

                              <span className="font-mono-tech text-[11px] text-slate-400 shrink-0 ml-2">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE DAILY THREAT DRILL & CREDENTIAL ROADMAP (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* ====================================================================
              WIDGET 1: INTERACTIVE DAILY THREAT DRILL (GAMIFIED PROTOCOL CHALLENGE)
             ==================================================================== */}
          <Card className="p-5 border-blue-200/90 shadow-md bg-white relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono-tech text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                DAILY SOC THREAT DRILL
              </span>
              <span className="text-[11px] font-mono-tech text-amber-600 font-bold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-amber-500" />
                +150 XP
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Identify The Attack Vector In This HTTP Request
            </h3>
            
            <p className="text-xs text-slate-500 mb-3">
              A perimeter reverse proxy flagged the following incoming request to an internal enterprise endpoint:
            </p>

            {/* Code / Telemetry Log Snippet */}
            <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto space-y-1 shadow-inner border border-slate-800 mb-4">
              <div className="text-emerald-400 font-bold">
                GET /api/v1/proxy?target=http://169.254.169.254/latest/meta-data/ HTTP/1.1
              </div>
              <div className="text-slate-400">Host: app.enterprise-corp.internal</div>
              <div className="text-slate-400">User-Agent: curl/7.88.1</div>
              <div className="text-slate-400">Authorization: Bearer test_token</div>
            </div>

            {/* Interactive Options */}
            <div className="space-y-2 mb-3">
              {[
                { label: "Server-Side Request Forgery (SSRF) targeting Cloud Metadata", isCorrect: true },
                { label: "Blind Time-Based SQL Injection via Target Parameter", isCorrect: false },
                { label: "Cross-Site Scripting (XSS) via DOM Sink Injection", isCorrect: false },
                { label: "Insecure Direct Object Reference (IDOR) on User Profile", isCorrect: false },
              ].map((opt, idx) => {
                const isSelected = drillAnswer === idx
                return (
                  <button
                    key={idx}
                    disabled={drillSubmitted}
                    onClick={() => handleDrillSubmit(idx)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      drillSubmitted
                        ? opt.isCorrect
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold"
                          : isSelected
                          ? "bg-rose-50 border border-rose-300 text-rose-900"
                          : "bg-slate-50 border border-slate-200 text-slate-500 opacity-60"
                        : "bg-slate-50 hover:bg-blue-50/80 border border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <span className="font-mono-tech text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{opt.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Drill Result Explanation */}
            {drillSubmitted && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50/80 border border-blue-200 text-xs space-y-2 animate-fade-in-up">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  {drillAnswer === 0 ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-700">Correct! +150 XP Awarded</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                      <span className="text-amber-800">Review Tactical Analysis</span>
                    </>
                  )}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  The IP address <code className="font-mono text-blue-700 bg-white px-1 py-0.5 rounded border border-blue-200">169.254.169.254</code> is the link-local address for AWS/Azure Instance Metadata Service (IMDS). Attackers abuse SSRF flaws to harvest IAM temporary session keys.
                </p>
                <button
                  onClick={handleDrillReset}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline pt-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Try Another Drill
                </button>
              </div>
            )}
          </Card>

          {/* ====================================================================
              WIDGET 2: INDUSTRY CERTIFICATION ROADMAP MAPPING
             ==================================================================== */}
          <Card className="p-5 border-slate-200 shadow-sm bg-white space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Industry Certification Readiness
              </h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              CyberPath curriculum directly prepares you for recognized offensive and defensive credentials:
            </p>

            <div className="space-y-3">
              {[
                { name: "CompTIA Security+ (SY0-701)", readiness: 85, color: "bg-blue-600" },
                { name: "Certified Ethical Hacker (CEH v12)", readiness: 65, color: "bg-indigo-600" },
                { name: "OffSec Certified Professional (OSCP)", readiness: 40, color: "bg-amber-600" },
                { name: "Certified Cloud Security (CCSP)", readiness: 25, color: "bg-cyan-600" },
              ].map((cert, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 truncate max-w-[200px]">{cert.name}</span>
                    <span className="font-mono-tech text-slate-600">
                      <CountUp end={cert.readiness} suffix="%" />
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cert.color} rounded-full transition-all duration-500`}
                      style={{ width: `${cert.readiness}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link to="/learning-paths" className="w-full block">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Explore Full Career Paths
                </Button>
              </Link>
            </div>
          </Card>

          {/* ====================================================================
              WIDGET 3: LIVE TERMINAL LAB SHORTCUT
             ==================================================================== */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs text-blue-300">
              <Terminal className="h-3.5 w-3.5" />
              <span>TERMINAL SANDBOX STANDBY</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every course module includes dedicated ephemeral Linux containers with pre-installed attack & triage toolchains.
            </p>
            <Link to="/labs" className="inline-block w-full">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white"
              >
                Launch Cyber Range
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Learning
