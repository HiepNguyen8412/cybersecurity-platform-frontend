import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  FlaskConical,
  Brain,
  Shield,
  Crosshair,
  ChevronRight,
  ChevronLeft,
  Code2,
  Play,
  RotateCw,
  Wifi,
  Search,
  Server,
  Radio,
  Terminal,
  Sparkles,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { CountUp } from "../../components/common"

const LIVE_INTEL_FEEDS = [
  {
    id: 1,
    tag: "[APT-EMULATION]",
    tagColor: "text-blue-400",
    text: "412 active sandbox instances running live adversary drills",
    shortText: "412 active sandboxes live",
  },
  {
    id: 2,
    tag: "[MITRE ATT&CK]",
    tagColor: "text-cyan-400",
    text: "T1190 & T1059 attack-defense modules verified & active",
    shortText: "T1190 & T1059 verified",
  },
  {
    id: 3,
    tag: "[DEFENSE SLA]",
    tagColor: "text-emerald-400",
    text: "99.8% zero-day mitigation rate verified across fleet",
    shortText: "99.8% zero-day SLA",
  },
  {
    id: 4,
    tag: "[GLOBAL RADAR]",
    tagColor: "text-amber-400",
    text: "1,240 SOC analysts training across ranges concurrently",
    shortText: "1,240 analysts drilling",
  },
  {
    id: 5,
    tag: "[ZERO EGRESS]",
    tagColor: "text-purple-400",
    text: "Network isolation verified on all range sandbox nodes",
    shortText: "100% egress isolation",
  },
]

const CONSOLE_SCENARIOS = {
  cli: [
    {
      id: "sqli-exploit",
      title: "Drill 1/3 • SQL Injection Hotpatch",
      flag: "FLAG{SQLi_P4TCH3D_V2}",
      steps: [
        { type: "cmd", prompt: "range:~$", text: "nmap -sV -p 8080 10.10.14.89" },
        { type: "out", text: "[+] Port 8080/tcp open (Apache/2.4.52)", color: "text-cyan-300" },
        { type: "cmd", prompt: "$", text: "sqlmap -u http://10.10.14.89/api/auth --batch" },
        { type: "out", text: "[!] Vulnerable: Boolean-based blind SQLi", color: "text-amber-300" },
        { type: "out", text: "★ FLAG CAPTURED: FLAG{SQLi_P4TCH3D_V2}", color: "text-emerald-400 font-bold" },
        { type: "cmd", prompt: "$", text: "git apply patches/prepared_stmt.diff" },
        { type: "out", text: "🛡 [SECURED] Enforced PreparedStatement ($1)", color: "text-emerald-300 font-semibold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
    {
      id: "jwt-forgery",
      title: "Drill 2/3 • JWT Token Forgery",
      flag: "FLAG{JWT_KEY_PWN3D}",
      steps: [
        { type: "cmd", prompt: "range:~$", text: "curl -s http://10.10.14.89/api/session" },
        { type: "out", text: '{"alg": "HS256", "sub": "guest", "role": "user"}', color: "text-slate-400" },
        { type: "cmd", prompt: "$", text: "jwt-tool --tamper --claim role=admin $TOKEN" },
        { type: "out", text: "[!] Forged signature accepted: Role escalated", color: "text-amber-300" },
        { type: "out", text: "★ FLAG CAPTURED: FLAG{JWT_KEY_PWN3D}", color: "text-emerald-400 font-bold" },
        { type: "cmd", prompt: "$", text: "authctl enforce-keys --curve ed25519" },
        { type: "out", text: "🛡 [SECURED] Enforced RS256 Asymmetric Keys", color: "text-emerald-300 font-semibold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
    {
      id: "bof-canary",
      title: "Drill 3/3 • Buffer Overflow Canary",
      flag: "FLAG{CANARY_SHIELD_V4}",
      steps: [
        { type: "cmd", prompt: "range:~$", text: "gdb -q -batch -ex run ./vuln_service" },
        { type: "out", text: "[!] Process crashed: SIGSEGV (0x41414141)", color: "text-rose-400" },
        { type: "out", text: "⚠ Stack Canary missing: EIP overwritten", color: "text-amber-300" },
        { type: "cmd", prompt: "$", text: "gcc -fstack-protector-all -o safe main.c" },
        { type: "out", text: "🛡 [SECURED] Stack smashing detected: Aborted", color: "text-emerald-300 font-semibold" },
        { type: "out", text: "★ DRILL PASSED: Level Up SOC Analyst (+300 XP)", color: "text-emerald-400 font-bold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
  ],
  vector: [
    {
      id: "ast-sqli",
      title: "Drill 1/3 • AST Query Tree Coercion",
      flag: "AST_EXPLOIT_VERIFIED",
      steps: [
        { type: "cmd", prompt: "vector:~$", text: "inspect-ast --payload \"' OR 1=1--\"" },
        { type: "out", text: "[+] AST Node: BinaryExpr(1=1) -> TRUE", color: "text-cyan-300" },
        { type: "out", text: "★ Tautology bypass confirmed (CVSS 8.9)", color: "text-amber-300" },
        { type: "cmd", prompt: "$", text: "inspect-ast --apply-sanitizer param_ast" },
        { type: "out", text: "🛡 AST Sanitized: ParameterPlaceholder($1)", color: "text-emerald-300 font-semibold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
    {
      id: "xss-csp",
      title: "Drill 2/3 • Polyglot XSS & CSP Defense",
      flag: "FLAG{DOM_XSS_SESSION_HIJACK}",
      steps: [
        { type: "cmd", prompt: "vector:~$", text: "fuzz-xss --target http://10.10.14.89/feed" },
        { type: "out", text: "[!] Reflection detected in DOM: 200 OK", color: "text-rose-400" },
        { type: "out", text: "★ FLAG CAPTURED: FLAG{DOM_XSS_SESSION_HIJACK}", color: "text-emerald-400 font-bold" },
        { type: "cmd", prompt: "$", text: "deploy-csp --policy \"script-src 'nonce-89f'\"" },
        { type: "out", text: "🛡 [MITIGATED] Blocked inline script (CSP 400)", color: "text-emerald-300 font-semibold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
    {
      id: "ssrf-cloud",
      title: "Drill 3/3 • SSRF Metadata Hardening",
      flag: "SSRF_IMDSV2_HARDENED",
      steps: [
        { type: "cmd", prompt: "vector:~$", text: "curl -s http://10.10.14.89/proxy?url=meta" },
        { type: "out", text: "[!] Discovered IAM Role: production-role", color: "text-amber-300" },
        { type: "cmd", prompt: "$", text: "cloudctl imdsv2-enforce --require-token" },
        { type: "out", text: "🛡 [SECURED] IMDSv2 token enforced (401)", color: "text-emerald-300 font-semibold" },
        { type: "out", text: "★ Zero-Trust Network Policy verified", color: "text-emerald-400 font-bold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
  ],
  defense: [
    {
      id: "suricata-ids",
      title: "Drill 1/3 • Suricata IDS Automated Ban",
      flag: "SURICATA_IP_BANNED",
      steps: [
        { type: "cmd", prompt: "soc:~$", text: "suricata -T -c /etc/suricata/rules.yaml" },
        { type: "out", text: "[+] 4,210 signatures compiled in 18ms", color: "text-cyan-300" },
        { type: "out", text: "⚠ ALERT: Suspicious SQL comment in URI", color: "text-amber-300" },
        { type: "cmd", prompt: "$", text: "fail2ban-client set nginx-sqli banip 198.51.100.44" },
        { type: "out", text: "🛡 [DEFENSE ENGAGED] IP Banned (Iptables DROP)", color: "text-emerald-300 font-semibold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
    {
      id: "c2-severance",
      title: "Drill 2/3 • Reverse Shell Quarantine",
      flag: "APPARMOR_C2_CONTAINED",
      steps: [
        { type: "cmd", prompt: "soc:~$", text: "netstat -antp | grep 4444" },
        { type: "out", text: "[!] Active connection on port 4444 (PID 3914)", color: "text-rose-400" },
        { type: "cmd", prompt: "$", text: "kill -9 3914 && aa-enforce /etc/apparmor" },
        { type: "out", text: "🛡 [HARDENED] Reverse shell severed. Contained.", color: "text-emerald-300 font-semibold" },
        { type: "out", text: "★ Incident contained in 4.2s (SLA <60s)", color: "text-emerald-400 font-bold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
    {
      id: "ransomware-decrypt",
      title: "Drill 3/3 • Memory Forensics Recovery",
      flag: "AES_KEY_RESTORED_100%",
      steps: [
        { type: "cmd", prompt: "soc:~$", text: "volatility -f /tmp/ram.raw windows.malfind" },
        { type: "out", text: "[+] Memory injection detected in svchost", color: "text-amber-300" },
        { type: "cmd", prompt: "$", text: "decryptor --extract-aes-key --offset 0x4012A0" },
        { type: "out", text: "[✓] Extracted 256-bit AES Master Key", color: "text-emerald-400 font-bold" },
        { type: "out", text: "🛡 [RESTORED] Zero files encrypted. 100% safe.", color: "text-emerald-300 font-semibold" },
        { type: "cmd", prompt: "$", text: "clear", isClear: true },
      ],
    },
  ],
}

function TerminalTypingScreen({
  scenarios,
  scenarioIndex,
  onNextScenario,
}) {
  const [displayedItems, setDisplayedItems] = useState([])
  const [activeCommand, setActiveCommand] = useState(null)
  const onNextScenarioRef = useRef(onNextScenario)

  useEffect(() => {
    onNextScenarioRef.current = onNextScenario
  }, [onNextScenario])

  useEffect(() => {
    let isCancelled = false
    const list = scenarios || []
    if (list.length === 0) return

    const currentScenario = list[scenarioIndex % list.length]
    const steps = currentScenario.steps || []
    let currentStep = 0
    let charPos = 0
    let timer = null

    const run = () => {
      if (isCancelled) return

      if (currentStep >= steps.length) {
        onNextScenarioRef.current?.()
        return
      }

      const step = steps[currentStep]

      if (step.type === "cmd") {
        if (charPos < step.text.length) {
          charPos++
          setActiveCommand({
            prompt: step.prompt,
            text: step.text.slice(0, charPos),
          })
          const jitter = step.isClear ? 14 : 26 + Math.floor(Math.random() * 16)
          timer = setTimeout(run, jitter)
        } else {
          // Finished typing this command line
          timer = setTimeout(() => {
            if (isCancelled) return
            if (step.isClear) {
              setDisplayedItems([])
              setActiveCommand(null)
              currentStep++
              charPos = 0
              timer = setTimeout(run, 400)
            } else {
              setDisplayedItems((prev) => [
                ...prev,
                {
                  id: `${scenarioIndex}-${currentStep}-${Date.now()}`,
                  type: "cmd",
                  prompt: step.prompt,
                  text: step.text,
                },
              ])
              setActiveCommand(null)
              currentStep++
              charPos = 0
              timer = setTimeout(run, 180)
            }
          }, step.isClear ? 250 : 200)
        }
      } else if (step.type === "out") {
        setDisplayedItems((prev) => [
          ...prev,
          {
            id: `${scenarioIndex}-${currentStep}-${Date.now()}`,
            type: "out",
            text: step.text,
            color: step.color,
          },
        ])
        currentStep++
        const nextStep = steps[currentStep]
        // If the next step is clear, give user 1400ms to read the result!
        const delay = nextStep?.isClear ? 1400 : 160
        timer = setTimeout(run, delay)
      }
    }

    timer = setTimeout(run, 180)

    return () => {
      isCancelled = true
      clearTimeout(timer)
    }
  }, [scenarios, scenarioIndex])

  // Maintain last 7 lines visible so terminal height never fluctuates or overflows
  const visibleItems = displayedItems.slice(-7)

  return (
    <div className="mt-3.5 min-h-[220px] max-h-[220px] font-mono-tech text-[11px] sm:text-xs space-y-1 sm:space-y-1.5 overflow-hidden flex flex-col justify-end select-none">
      {visibleItems.map((item) => (
        <div key={item.id} className="leading-relaxed animate-fade-in-up truncate">
          {item.type === "cmd" ? (
            <div className="text-slate-300 truncate">
              <span className="text-emerald-400 font-semibold">{item.prompt}</span>{" "}
              <span className="text-slate-100 font-medium">{item.text}</span>
            </div>
          ) : (
            <div className={`${item.color} truncate`}>{item.text}</div>
          )}
        </div>
      ))}

      {/* Currently Active Typing Command Line with Cursor */}
      {activeCommand && (
        <div className="text-slate-300 leading-relaxed truncate">
          <span className="text-emerald-400 font-semibold">{activeCommand.prompt}</span>{" "}
          <span className="text-slate-100 font-medium">{activeCommand.text}</span>
          <span className="terminal-cursor" aria-hidden="true" />
        </div>
      )}

      {/* When waiting between commands or transition, keep blinking cursor block */}
      {!activeCommand && (
        <div className="text-slate-400 leading-relaxed flex items-center">
          <span className="text-emerald-400 font-bold">$ </span>
          <span className="terminal-cursor" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export function LandingPage() {
  const { isAuthenticated } = useAuth()

  // Hero Terminal State with Real-Time Typing Animation
  const [activeConsoleTab, setActiveConsoleTab] = useState("cli") // 'cli' | 'vector' | 'defense'
  const [replayKey, setReplayKey] = useState(0)
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)

  const handleTabChange = useCallback((newTab) => {
    setActiveConsoleTab(newTab)
    setActiveScenarioIdx(0)
    setCycleCount(0)
  }, [])

  const handleNextScenario = useCallback(() => {
    const scenarios = CONSOLE_SCENARIOS[activeConsoleTab] || []
    setActiveScenarioIdx((prev) => (prev + 1) % (scenarios.length || 1))
    setCycleCount((c) => c + 1)
  }, [activeConsoleTab])

  // Live Intel Automated Carousel State (Rotates every 3.5 seconds)
  const [activeIntelIdx, setActiveIntelIdx] = useState(0)
  const [isIntelPaused, setIsIntelPaused] = useState(false)

  useEffect(() => {
    if (isIntelPaused) return
    const timer = setInterval(() => {
      setActiveIntelIdx((prev) => (prev + 1) % LIVE_INTEL_FEEDS.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [isIntelPaused])

  const handlePrevIntel = useCallback(() => {
    setActiveIntelIdx((prev) => (prev - 1 + LIVE_INTEL_FEEDS.length) % LIVE_INTEL_FEEDS.length)
  }, [])

  const handleNextIntel = useCallback(() => {
    setActiveIntelIdx((prev) => (prev + 1) % LIVE_INTEL_FEEDS.length)
  }, [])

  // Interactive Live Packet Sniffer State in Bento Grid
  const INITIAL_PACKETS = [
    { id: 101, protocol: "TCP", src: "192.168.1.45:44321", cleanSrc: "192.168.1.45", dst: "10.0.0.80:80", cleanDst: "10.0.0.80", info: "SYN [Seq=0 Win=64240]", status: "normal", statusLabel: "ACK" },
    { id: 102, protocol: "HTTP", src: "192.168.1.45:44321", cleanSrc: "192.168.1.45", dst: "10.0.0.80:80", cleanDst: "10.0.0.80", info: "POST /auth - ' OR 1=1 --", status: "malicious", statusLabel: "EXPLOIT" },
    { id: 103, protocol: "DNS", src: "10.0.0.80:53120", cleanSrc: "10.0.0.80", dst: "8.8.8.8:53", cleanDst: "8.8.8.8", info: "Standard query corp.internal", status: "normal", statusLabel: "RESOLVED" },
    { id: 104, protocol: "TLSv1.3", src: "10.0.0.80:443", cleanSrc: "10.0.0.80", dst: "172.16.4.12:51220", cleanDst: "172.16.4.12", info: "Application Data [Encrypted]", status: "secure", statusLabel: "SECURE" },
  ]
  const [packets, setPackets] = useState(INITIAL_PACKETS)
  const [droppedPacketId, setDroppedPacketId] = useState(null)

  // Interactive AST Payload Scanner
  const [testPayload, setTestPayload] = useState("' OR 1=1 --")
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  // Interactive MITRE Technique selector
  const [selectedMitre, setSelectedMitre] = useState("T1190")

  // Interactive Labs Showcase Filter
  const [labFilter, setLabFilter] = useState("all")
  const [labSearch, setLabSearch] = useState("")

  const handleSimulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      const isSql = testPayload.toLowerCase().includes("or") || testPayload.includes("'") || testPayload.includes("1=1")
      const isXss = testPayload.toLowerCase().includes("<script") || testPayload.includes("onerror")
      setScanResult({
        detected: isSql || isXss,
        vulnType: isXss ? "CWE-79: Cross-Site Scripting (XSS)" : "CWE-89: SQL Injection Vector",
        severity: "CRITICAL (CVSS 9.8)",
        remediation: isXss
          ? "Context-aware HTML entity encoding & Content Security Policy (CSP)"
          : "Enforce PreparedStatement parameterized query binding",
      })
    }, 550)
  }

  const handleDropPacket = (id) => {
    setDroppedPacketId(id)
    setTimeout(() => {
      setPackets((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "mitigated", statusLabel: "BLOCKED" } : p
        )
      )
      setDroppedPacketId(null)
    }, 300)
  }

  const handleResetPackets = () => {
    setPackets(INITIAL_PACKETS)
  }

  const mitreTechniques = [
    {
      id: "T1190",
      tactic: "Initial Access",
      name: "Exploit Public-Facing App",
      mitigation: "Hardened WAF rules & continuous vulnerability patch validation.",
    },
    {
      id: "T1059",
      tactic: "Execution",
      name: "Command and Scripting Interpreter",
      mitigation: "Constrained language mode and strict executable whitelisting (AppLocker/WDAC).",
    },
    {
      id: "T1003",
      tactic: "Credential Access",
      name: "OS Credential Dumping (LSASS)",
      mitigation: "Enable LSA Protection (RunAsPPL) & Credential Guard isolation.",
    },
    {
      id: "T1048",
      tactic: "Exfiltration",
      name: "Exfiltration Over Alternative Protocol",
      mitigation: "Strict egress firewall packet inspection & DNS tunneling anomaly detection.",
    },
  ]

  const showcaseLabs = [
    {
      id: "lab-01",
      category: "web",
      title: "SQL Injection: Filter Evasion & Parameterization",
      difficulty: "Intermediate",
      duration: "35 mins",
      durationMins: 35,
      mitre: "T1190",
      bounty: "450 PTS",
      points: 450,
      desc: "Bypass naive blacklist filters using hex encoding, then implement secure parameterized database queries.",
    },
    {
      id: "lab-02",
      category: "web",
      title: "JWT Token Manipulation & Algorithm Confusion",
      difficulty: "Advanced",
      duration: "45 mins",
      durationMins: 45,
      mitre: "T1556",
      bounty: "600 PTS",
      points: 600,
      desc: "Exploit asymmetric RSA-to-HMAC algorithm confusion to forge administrative authentication tokens.",
    },
    {
      id: "lab-03",
      category: "soc",
      title: "Incident Response: Memory Forensics with Volatility",
      difficulty: "Intermediate",
      duration: "50 mins",
      durationMins: 50,
      mitre: "T1055",
      bounty: "500 PTS",
      points: 500,
      desc: "Analyze raw RAM dumps to identify injected DLLs, unlinked process trees, and hidden C2 beacons.",
    },
    {
      id: "lab-04",
      category: "soc",
      title: "Suricata Snort Rules & C2 Traffic Detection",
      difficulty: "Novice",
      duration: "30 mins",
      durationMins: 30,
      mitre: "T1071",
      bounty: "350 PTS",
      points: 350,
      desc: "Write high-fidelity signature rules to detect suspicious outbound beaconing patterns in network pcap.",
    },
    {
      id: "lab-05",
      category: "cloud",
      title: "AWS IAM Privilege Escalation & Metadata Abuse",
      difficulty: "Advanced",
      duration: "55 mins",
      durationMins: 55,
      mitre: "T1078",
      bounty: "650 PTS",
      points: 650,
      desc: "Exploit SSRF vulnerabilities on EC2 instances to harvest temporary STS credentials via IMDSv2 evasion.",
    },
    {
      id: "lab-06",
      category: "crypto",
      title: "Cryptographic Padding Oracle Attack Defense",
      difficulty: "Advanced",
      duration: "40 mins",
      durationMins: 40,
      mitre: "T1557",
      bounty: "550 PTS",
      points: 550,
      desc: "Decipher CBC-mode encrypted ciphertexts by observing padding error side-channels in web applications.",
    },
  ]

  const filteredLabs = showcaseLabs.filter((lab) => {
    const matchesCategory = labFilter === "all" || lab.category === labFilter
    const matchesSearch =
      lab.title.toLowerCase().includes(labSearch.toLowerCase()) ||
      lab.desc.toLowerCase().includes(labSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="w-full">
      {/* ====================================================================
          1. LIVE SECURITY TELEMETRY MARQUEE (Top HUD Stream with Auto Carousel)
         ==================================================================== */}
      <div
        className="w-full bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-mono-tech py-1.5 px-3 sm:px-4 select-none overflow-hidden"
        onMouseEnter={() => setIsIntelPaused(true)}
        onMouseLeave={() => setIsIntelPaused(false)}
      >
        <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Live Indicator Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold tracking-wider text-[10px] sm:text-[11px]">
              LIVE INTEL:
            </span>
          </div>

          {/* Carousel Animated Slide Item */}
          <div className="flex-1 min-w-0 overflow-hidden flex items-center justify-start">
            <div
              key={activeIntelIdx}
              className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300 min-w-0"
            >
              <span className={`font-semibold shrink-0 text-[10px] sm:text-xs ${LIVE_INTEL_FEEDS[activeIntelIdx].tagColor}`}>
                {LIVE_INTEL_FEEDS[activeIntelIdx].tag}
              </span>
              {/* Ultra-compact on mobile so it never gets cut off */}
              <span className="text-slate-300 sm:hidden truncate text-[11px]">
                {LIVE_INTEL_FEEDS[activeIntelIdx].shortText}
              </span>
              <span className="text-slate-300 hidden sm:inline truncate text-xs">
                {LIVE_INTEL_FEEDS[activeIntelIdx].text}
              </span>
            </div>
          </div>

          {/* Carousel Controls & Secondary Telemetry */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 text-slate-400">
            <div className="flex items-center gap-0.5 bg-slate-800/80 rounded-md p-0.5 border border-slate-700/60">
              <button
                type="button"
                onClick={handlePrevIntel}
                aria-label="Previous intel feed item"
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <span className="text-[10px] text-slate-400 px-1 font-bold">
                {activeIntelIdx + 1}/{LIVE_INTEL_FEEDS.length}
              </span>
              <button
                type="button"
                onClick={handleNextIntel}
                aria-label="Next intel feed item"
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-slate-400 pl-2 border-l border-slate-800">
              <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
              <span>EGRESS: ISOLATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. ASYMMETRICAL COMMAND CENTER HERO
         ==================================================================== */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24 animate-fade-in-up">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] bg-gradient-to-b from-blue-500/10 via-cyan-400/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Mission Briefing & Action Dispatch */}
            <div className="lg:col-span-6 space-y-6">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-slate-900 leading-[1.08]">
                Offensive Mastery. <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Defensive Precision.
                </span> <br />
                Real Attack Forensics.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Tackle realistic cloud and network security challenges. Reverse-engineer authentic vulnerabilities, implement hardened defenses, and accelerate your security career.
              </p>

              {/* Interactive Tool Chips (Clickable Quick Prompts) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono-tech text-slate-400 font-bold uppercase">Target Tools:</span>
                {["Burp Suite", "Wireshark", "SQLMap", "Suricata", "Ghidra"].map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-mono-tech font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs hover:border-blue-400 hover:text-blue-600 transition-colors select-none"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="cyber-btn-primary btn-cyber-interactive inline-flex items-center justify-center font-bold rounded-xl px-6 py-3.5 text-sm gap-2.5 cursor-pointer group shadow-lg shadow-blue-500/25"
                >
                  <Play className="h-4 w-4 fill-white group-hover:scale-110 transition-transform" />
                  <span>{isAuthenticated ? "Enter Mission Dashboard" : "Deploy Free Lab Sandbox"}</span>
                </Link>
                <Link
                  to="/labs"
                  className="btn-cyber-interactive inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-5 py-3.5 text-sm bg-white/95 text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 shadow-2xs transition-all cursor-pointer"
                >
                  <FlaskConical className="h-4 w-4 text-blue-600" />
                  <span>Explore 120+ Labs</span>
                </Link>
              </div>

              {/* Telemetry Counter Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-slate-900">
                    <CountUp end={2400} suffix="+" />
                  </div>
                  <div className="text-xs font-medium text-slate-500">Active Analysts</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-blue-600">
                    <CountUp end={120} suffix="+" />
                  </div>
                  <div className="text-xs font-medium text-slate-500">Sandboxed Labs</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-emerald-600">
                    <CountUp end={100} suffix="%" />
                  </div>
                  <div className="text-xs font-medium text-slate-500">MITRE ATT&CK</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Live Security Console */}
            <div className="lg:col-span-6 flex justify-center">
              {/* Console Chassis */}
              <div className="w-full max-w-xl cyber-terminal rounded-2xl p-4 sm:p-5 text-slate-100 shadow-2xl relative border border-slate-800">
                {/* Window Frame Bar */}
                {/* Window Frame Bar */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500/90 inline-block" />
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500/90 inline-block" />
                    <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500/90 inline-block" />
                    <span className="hidden sm:inline ml-1.5 font-mono-tech text-xs text-slate-400 font-medium">
                      analyst@range:~$
                    </span>
                    <span className="sm:hidden ml-1 font-mono-tech text-[11px] text-slate-400 font-medium">
                      range:~$
                    </span>
                  </div>

                  {/* Clean Tab Selector + Replay Button */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                      {[
                        { key: "cli", label: "CLI" },
                        { key: "vector", label: "Vector" },
                        { key: "defense", label: "Defense" },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => handleTabChange(tab.key)}
                          className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[11px] sm:text-xs font-mono-tech transition-all cursor-pointer ${
                            activeConsoleTab === tab.key
                              ? "bg-blue-600 text-white font-bold shadow-2xs"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReplayKey((k) => k + 1)
                        setActiveScenarioIdx(0)
                        setCycleCount(0)
                      }}
                      className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                      title="Replay sequence"
                      aria-label="Replay terminal animation"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Console Output Screen with Real-Time Typing Animation & Infinite Loop */}
                <TerminalTypingScreen
                  key={`${activeConsoleTab}-${replayKey}-${cycleCount}`}
                  scenarios={CONSOLE_SCENARIOS[activeConsoleTab] || CONSOLE_SCENARIOS.cli}
                  scenarioIndex={activeScenarioIdx}
                  onNextScenario={handleNextScenario}
                />

                {/* Console Footer with Live Drill Status */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-mono-tech text-slate-300 font-semibold text-[11px] sm:text-xs truncate">
                      {CONSOLE_SCENARIOS[activeConsoleTab]?.[activeScenarioIdx]?.title || "Active Container"}
                    </span>
                  </div>
                  <Link
                    to="/labs"
                    className="text-blue-400 hover:text-cyan-300 font-mono-tech font-semibold flex items-center gap-1 transition-colors shrink-0 text-[11px] sm:text-xs whitespace-nowrap"
                  >
                    <span>Launch Lab</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. BENTO GRID ARCHITECTURE (Bespoke Cyber Ecosystem)
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-mono-tech font-bold text-blue-600 uppercase tracking-widest">
            THE PLATFORM ARCHITECTURE
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered For True Security Proficiency
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A comprehensive sandbox ecosystem combining real packet inspection, adversary mapping, and guided AI reasoning.
          </p>
        </div>

        {/* Bento Grid Layout (Asymmetrical 12-col) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* BENTO 1: Interactive Network Packet Sniffer (Wireshark-in-Browser) - 8 cols */}
          <div className="md:col-span-12 lg:col-span-8 cyber-card p-5 sm:p-6 rounded-2xl flex flex-col justify-between overflow-hidden">
            <div className="space-y-3 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200 shrink-0">
                    <Wifi className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Live Packet Forensics Engine
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Real-time packet capture stream with interactive inspection
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetPackets}
                  title="Click to reload live stream"
                  className="font-mono-tech text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer transition-colors"
                >
                  INTERFACE: eth0 [PROMISCUOUS]
                </button>
              </div>

              {/* Packet Stream Table (Clean Responsive Row - Never Scrolls, Hides Non-essential details on mobile) */}
              <div className="space-y-1.5 font-mono-tech text-xs overflow-hidden">
                {packets.map((pkt) => (
                  <div
                    key={pkt.id}
                    className={`flex items-center justify-between p-2 sm:p-2.5 rounded-xl border gap-2 transition-all overflow-hidden ${
                      droppedPacketId === pkt.id
                        ? "opacity-30 scale-95"
                        : pkt.status === "malicious"
                        ? "bg-rose-50/70 border-rose-200 text-rose-900"
                        : pkt.status === "mitigated"
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                        : "bg-slate-50/70 border-slate-200/80 text-slate-700"
                    }`}
                  >
                    {/* Left: Protocol Badge + Clean IP Flow */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-hidden">
                      <span
                        className={`font-bold text-[10px] sm:text-xs px-1.5 py-0.5 rounded border shrink-0 ${
                          pkt.protocol === "HTTP"
                            ? "bg-rose-100/90 border-rose-200 text-rose-800"
                            : pkt.protocol === "DNS"
                            ? "bg-sky-100/90 border-sky-200 text-sky-800"
                            : pkt.protocol === "TLSv1.3"
                            ? "bg-emerald-100/90 border-emerald-200 text-emerald-800"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {pkt.protocol}
                      </span>

                      {/* Clean IP flow: on mobile, strip noisy ports so it fits cleanly in 1 line without scroll */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate shrink min-w-0">
                        <span className="truncate sm:hidden font-medium">
                          {pkt.cleanSrc}
                        </span>
                        <span className="hidden sm:inline font-medium">
                          {pkt.src}
                        </span>
                        <span className="text-slate-400 text-[10px] shrink-0">→</span>
                        <span className="truncate sm:hidden font-medium">
                          {pkt.cleanDst}
                        </span>
                        <span className="hidden sm:inline font-medium">
                          {pkt.dst}
                        </span>
                      </div>

                      {/* Payload Info: Hidden on small screens (no scrollbar), shown on md+ screens */}
                      <span className="hidden md:inline font-semibold text-[11px] text-slate-800 truncate max-w-[200px] lg:max-w-[280px]">
                        {pkt.info}
                      </span>
                    </div>

                    {/* Right: Action or Status Badge */}
                    <div className="shrink-0 flex items-center">
                      {pkt.status === "malicious" ? (
                        <button
                          type="button"
                          onClick={() => handleDropPacket(pkt.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 cursor-pointer shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                        >
                          DROP PACKET
                        </button>
                      ) : pkt.status === "mitigated" ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 whitespace-nowrap">
                          MITIGATED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-200/60 text-slate-500 whitespace-nowrap">
                          {pkt.statusLabel || "PASSED"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span className="cursor-default">Interactive Wireshark & PCAP analysis incorporated in every lab.</span>
              <span className="font-mono-tech font-bold text-blue-600 shrink-0 whitespace-nowrap cursor-default">
                ZERO EGRESS BREACH
              </span>
            </div>
          </div>

          {/* BENTO 2: MITRE ATT&CK Matrix Navigator - 4 cols */}
          <div className="md:col-span-12 lg:col-span-4 cyber-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200">
                  <Crosshair className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">MITRE ATT&CK Mapping</h3>
                  <p className="text-[11px] text-slate-500">Enterprise adversary tactics</p>
                </div>
              </div>

              {/* Interactive MITRE Chips */}
              <div className="space-y-2">
                {mitreTechniques.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedMitre(tech.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer font-mono-tech ${
                      selectedMitre === tech.id
                        ? "bg-blue-50/90 border-blue-300 text-blue-900 shadow-2xs"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-600">{tech.id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{tech.tactic}</span>
                    </div>
                    <p className="text-xs font-semibold mt-0.5 truncate">{tech.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active MITRE Defense Note */}
            <div className="mt-4 pt-3 border-t border-slate-100 font-mono-tech text-[11px] text-slate-600">
              <span className="text-emerald-600 font-bold">Countermeasure: </span>
              {mitreTechniques.find((m) => m.id === selectedMitre)?.mitigation}
            </div>
          </div>

          {/* BENTO 3: Autonomous AI Security Mentor - 6 cols */}
          <div className="md:col-span-12 lg:col-span-6 cyber-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Security AI Co-Pilot</h3>
                    <p className="text-[11px] text-slate-500">Autonomous reasoning companion</p>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                  LLM REASONER
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono-tech text-xs space-y-1.5">
                  <div className="text-cyan-400 text-[11px] font-bold">CYBER-AI // ADVICE ON LAB #04:</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Notice the Base64 cookie in the HTTP request. Decode it and look for the padding byte length to calculate the oracle injection point."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="font-bold text-blue-600 block">Decompiler Assistant</span>
                    <span className="text-[11px] text-slate-500">Explains x86 assembly & ASM jumps</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="font-bold text-blue-600 block">Code Remediation</span>
                    <span className="text-[11px] text-slate-500">Suggests hardened defense syntax</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hints unlocked only when you need them. No answers spoiled.</span>
            </div>
          </div>

          {/* BENTO 4: Sandbox Resource Telemetry & Health Gauges - 6 cols */}
          <div className="md:col-span-12 lg:col-span-6 cyber-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Zero-Trust Browser Sandbox</h3>
                    <p className="text-[11px] text-slate-500">Ephemeral container orchestration</p>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  HARDENED K8S
                </span>
              </div>

              {/* 3 Resource Dials */}
              <div className="grid grid-cols-3 gap-3 font-mono-tech text-center">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-xl font-black text-slate-900">
                    <CountUp end={12} suffix="ms" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">PING LATENCY</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-xl font-black text-blue-600">
                    <CountUp end={100} suffix="%" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">ISOLATION</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-xl font-black text-emerald-600">
                    <CountUp end={3} prefix="< " suffix="s" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">CONTAINER BOOT</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Every practice scenario runs inside an isolated micro-virtualized container with automated snapshot restore and zero threat to your local machine.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Runs seamlessly in standard Chrome, Edge, Firefox, and Safari.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. INTERACTIVE PLAYGROUND: LIVE PAYLOAD ANALYZER
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10">
        <div className="cyber-card p-6 sm:p-8 rounded-3xl border border-blue-200 bg-gradient-to-r from-white via-blue-50/30 to-white shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider font-mono-tech">
                <Code2 className="h-4 w-4" />
                <span>INTERACTIVE AST PARSER</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Test Our Defense Scanner Live
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Input any raw SQL injection or XSS string to observe real-time lexical tokenization and immediate remediation guidance.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 font-mono-tech text-xs text-slate-400">payload:</span>
                  <input
                    type="text"
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    className="w-full pl-18 pr-3 py-2.5 text-xs font-mono-tech bg-white border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 shadow-2xs"
                    placeholder="Enter SQL/XSS payload..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="cyber-btn-primary btn-cyber-interactive px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
                >
                  {isScanning ? (
                    <RotateCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  <span>{isScanning ? "Scanning..." : "Analyze Payload"}</span>
                </button>
              </div>

              {scanResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono-tech text-xs space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold">[{scanResult.vulnType}]</span>
                    <span className="text-amber-400 text-[11px]">{scanResult.severity}</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Remediation: <span className="text-emerald-400 font-semibold">{scanResult.remediation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. INTERACTIVE FILTERABLE LABS SHOWROOM
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-14 sm:py-18">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono-tech font-bold text-blue-600 uppercase tracking-widest">
              HANDS-ON SIMULATION CATALOG
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Explore Practice Laboratories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real vulnerability sandboxes mapped to industry CVEs and MITRE tactics.
            </p>
          </div>

          {/* Search + Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={labSearch}
                onChange={(e) => setLabSearch(e.target.value)}
                placeholder="Search labs, CVEs..."
                className="pl-9 pr-3 py-1.5 text-xs font-mono-tech rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-blue-600 outline-none w-full sm:w-48 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs">
              {[
                { key: "all", label: "All" },
                { key: "web", label: "Web" },
                { key: "soc", label: "SOC" },
                { key: "cloud", label: "Cloud" },
                { key: "crypto", label: "Crypto" },
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setLabFilter(cat.key)}
                  className={`px-3 py-1 rounded-lg font-mono-tech text-xs font-semibold transition-all cursor-pointer ${
                    labFilter === cat.key
                      ? "bg-white text-blue-600 shadow-2xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Lab Telemetry Summary Bar with CountUp */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-tech">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="font-semibold">Filtered Scenarios:</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              <CountUp end={filteredLabs.length} duration={3500} /> Labs Available
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>
              Cumulative Rewards:{" "}
              <strong className="text-amber-800 font-bold">
                <CountUp
                  end={filteredLabs.reduce((sum, l) => sum + (l.points || 0), 0)}
                  duration={3500}
                  prefix="+"
                  suffix=" PTS"
                />
              </strong>
            </span>
            <span className="hidden sm:inline text-slate-300">&bull;</span>
            <span className="hidden sm:inline">
              Cloud VM Automation:{" "}
              <strong className="text-emerald-700 font-bold">
                <CountUp end={100} duration={3500} suffix="%" /> Zero-Config
              </strong>
            </span>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              className="cyber-card p-5 rounded-2xl flex flex-col justify-between group hover:border-blue-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    MITRE: {lab.mitre}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    +<CountUp end={lab.points || parseInt(lab.bounty)} duration={3500} suffix=" PTS" />
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {lab.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-mono-tech text-slate-500 whitespace-nowrap shrink-0">
                  <span className="whitespace-nowrap">
                    <CountUp end={lab.durationMins || parseInt(lab.duration)} duration={3500} suffix=" mins" />
                  </span>
                  <span>&bull;</span>
                  <span className="whitespace-nowrap">{lab.difficulty}</span>
                </div>

                <Link
                  to="/labs"
                  className="cyber-btn-primary btn-cyber-interactive px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span>Launch</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          6. HIGH-TECH CALL-TO-ACTION DECK (EYE-FRIENDLY CYBER GLASS)
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 pb-10 sm:pb-12">
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12 lg:p-14 text-center overflow-hidden shadow-2xl shadow-slate-950/30">
          {/* Subtle Cyber Grid & Ambient Glow (Comfortable, Non-Glare) */}
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-mono-tech shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-slate-300 tracking-wider uppercase">
                Instant Access Range • Zero Local Setup
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Start your cybersecurity journey today
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Free to join. No credit card required. Launch isolated cloud targets in your browser and practice defensive & offensive drills at your own pace.
              </p>
            </div>

            {/* 3 Core Value Micro-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-left">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Browser Sandboxes</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">Zero VM setup or download</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">120+ Real-World Labs</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">MITRE ATT&CK & OWASP</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Free to Join</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">No credit card required</div>
                </div>
              </div>
            </div>

            {/* Dual CTA Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="cyber-btn-primary btn-cyber-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all cursor-pointer"
              >
                <span>{isAuthenticated ? "Launch Dashboard" : "Create Free Account"}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/labs"
                className="btn-cyber-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-3.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4 text-sky-400" />
                <span>Explore Live Labs</span>
              </Link>
            </div>

            {/* Micro Telemetry Bar */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono-tech text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <CountUp end={2400} suffix="+" /> Active Analysts
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <CountUp end={99.98} decimals={2} suffix="%" /> Range SLA
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <CountUp end={120} suffix="+" /> Sandboxed Labs
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
