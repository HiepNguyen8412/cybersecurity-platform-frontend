import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  FlaskConical,
  Shield,
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
  Compass,
  UserCheck,
  FileText,
  Zap,
  Crosshair,
  ArrowRight,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { CountUp } from "../../components/common"
import CyberNetworkCanvas from "../../components/effects/CyberNetworkCanvas"
import CyberCommandTheater from "../../components/effects/CyberCommandTheater"

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

// YewSafe-Inspired Standards & Technology Ecosystem Marquee
const STANDARDS_ECOSYSTEM = [
  { name: "MITRE ATT&CK® v14", category: "Adversary TTP Matrix", icon: "🛡️" },
  { name: "OWASP Top 10 2025", category: "AppSec Vulnerability Standard", icon: "⚡" },
  { name: "NIST SP 800-53 R5", category: "Federal Security Controls", icon: "🏛️" },
  { name: "CIS Critical Controls", category: "System Hardening Baseline", icon: "🔒" },
  { name: "ISO/IEC 27001:2022", category: "ISMS Information Security", icon: "🌐" },
  { name: "Kali Linux Rolling", category: "Offensive PenTest Suite", icon: "🐉" },
  { name: "Suricata 7.0 IDS/IPS", category: "High-Performance Threat Engine", icon: "📡" },
  { name: "Wireshark Protocol", category: "Packet Deep Telemetry", icon: "🦈" },
  { name: "Snort 3 Inspection", category: "Deep Packet Detection", icon: "🐗" },
  { name: "Ghidra SRE Framework", category: "NSA Reverse Engineering", icon: "🔬" },
  { name: "Metasploit Framework", category: "Exploitation & Automation", icon: "🎯" },
  { name: "Docker Hardened Node", category: "Ephemeral MicroVM Sandbox", icon: "🐳" },
]

// YewSafe-Inspired 4-Card Promo & Strategic Feature Ribbon
const PROMO_RIBBON_CARDS = [
  {
    pill: "DÙNG THỬ MIỄN PHÍ",
    pillColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    title: "120+ Phòng Lab Sandbox Trực Tiếp",
    description: "Khởi động ngay container Kali, Burp Suite & DVWA không cần cài đặt phức tạp trên máy.",
    cta: "Thử Nghiệm Ngay",
    link: "/labs",
    laserColor: "via-cyan-400",
  },
  {
    pill: "CHIẾN DỊCH APT",
    pillColor: "bg-red-500/10 text-red-400 border-red-500/30",
    title: "Diễn Tập Kịch Bản Nhóm APT Thực Tế",
    description: "Tái hiện các chuỗi tấn công APT28, APT29, Ransomware LockBit trên môi trường Active Directory.",
    cta: "Khám Phá Kịch Bản",
    link: "/labs?category=APT",
    laserColor: "via-red-400",
  },
  {
    pill: "LÁ CHẮN SOAR & SOC",
    pillColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    title: "Phản Ứng Sự Cố Blue Team & Forensics",
    description: "Điều tra log SIEM Splunk/ELK, phân tích bộ nhớ dump Volatility và cách ly mối đe dọa thời gian thực.",
    cta: "Vào Phòng SOC",
    link: "/labs?category=BlueTeam",
    laserColor: "via-emerald-400",
  },
  {
    pill: "CHỨNG CHỈ QUỐC TẾ",
    pillColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    title: "Lộ Trình Đạt Chuẩn CEH, OSCP & Sec+",
    description: "Hệ thống bài tập căn cứ theo ma trận kỹ năng NIST NICE và chứng nhận hoàn thành có mã tra cứu công khai.",
    cta: "Xem Lộ Trình",
    link: "/learning-paths",
    laserColor: "via-amber-400",
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

  // YewSafe-Inspired Quick Target Vulnerability Scanner
  const [scanTargetInput, setScanTargetInput] = useState("")
  const [isScanningTarget, setIsScanningTarget] = useState(false)
  const [targetScanReport, setTargetScanReport] = useState(null)

  const handleRunTargetScan = (customTarget) => {
    const rawTarget = customTarget !== undefined ? customTarget : scanTargetInput
    const target = (rawTarget || "10.10.14.89").trim()
    setIsScanningTarget(true)
    setTargetScanReport(null)

    setTimeout(() => {
      setIsScanningTarget(false)
      const isSql = target.includes("14.89") || target.toLowerCase().includes("sql")
      const isJwt = target.toLowerCase().includes("jwt") || target.includes("100")

      setTargetScanReport({
        target: target,
        ip: target.match(/^\d+\.\d+\.\d+\.\d+$/) ? target : "103.142.112.44",
        status: "TARGET_ACTIVE",
        latency: "14ms",
        ports: [
          { port: "80/tcp", service: "HTTP (Nginx/1.24)", state: "OPEN", risk: "HIGH" },
          { port: "443/tcp", service: "HTTPS (TLS 1.3)", state: "OPEN", risk: "LOW" },
          { port: "8080/tcp", service: "Admin API Console", state: "EXPOSED", risk: "CRITICAL" },
          { port: "22/tcp", service: "SSH (OpenSSH 8.9)", state: "SECURED", risk: "INFO" },
        ],
        vuln: isJwt
          ? "CWE-347: JWT_SECRET_HS256_WEAK"
          : isSql
            ? "CVE-2024-38812: Time-based Blind SQLi"
            : "CVE-2024-4577: PHP CGI Remote Code Execution",
        severity: isJwt ? "HIGH 8.2" : "CRITICAL 9.8",
        cveDesc: isJwt
          ? "Khóa ký HS256 từ điển yếu, cho phép giả mạo Claim role=admin để leo thang đặc quyền."
          : isSql
            ? "Lỗ hổng chèn mã SQL không qua kiểm duyệt tham số tại endpoint /api/v1/auth/session."
            : "Lỗ hổng xử lý đối số CGI trên Windows/Apache cho phép thực thi mã từ xa không cần xác thực.",
        mitigation: isJwt
          ? "Chuyển sang thuật toán bất đối xứng RS256/ES256 & tăng entropy khóa."
          : isSql
            ? "Sử dụng PreparedStatement parameterized query & bật luật chặn WAF L7."
            : "Cập nhật bản vá PHP 8.2.20 & bật ModSecurity ruleset OWASP CRS.",
      })
    }, 550)
  }

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
              <span>LƯU LƯỢNG RA: ĐÃ CÔ LẬP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. ASYMMETRICAL COMMAND CENTER HERO
         ==================================================================== */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 lg:pb-24 animate-fade-in-up">
        {/* ====================================================================
            ATMOSPHERIC CYBER NETWORK CANVAS BACKGROUND
            Custom interactive particle network animation — zero external assets.
            Adapts automatically to Light / Dark / Cyberpunk themes.
           ==================================================================== */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <CyberNetworkCanvas className="absolute inset-0" />

          {/* Bottom Edge Blend — dissolves canvas into the next section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-canvas)] pointer-events-none" />

          {/* Subtle Scanline Micro-Texture for CRT / radar feel */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] cyberpunk:opacity-[0.09] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
              backgroundSize: "100% 3px",
            }}
          />
        </div>

        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[420px] bg-gradient-to-b from-blue-500/10 via-cyan-400/5 to-transparent blur-3xl pointer-events-none z-0" />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Mission Briefing & Action Dispatch */}
            <div className="lg:col-span-6 space-y-6">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-[1.08]">
                Offensive Mastery. <br />
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-300 cyberpunk:from-[#38bdf8] cyberpunk:via-[#22d3ee] cyberpunk:to-[#34d399] bg-clip-text text-transparent drop-shadow-xs">
                  Defensive Precision.
                </span> <br />
                Real Attack Forensics.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 cyberpunk:text-slate-300 leading-relaxed max-w-xl">
                Tackle realistic cloud and network security challenges. Reverse-engineer authentic vulnerabilities, implement hardened defenses, and accelerate your security career.
              </p>

              {/* YewSafe-Inspired Quick Target IP/Domain Scanner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0c10]/95 border border-slate-800 hover:border-cyan-500/40 shadow-xl shadow-black/40 backdrop-blur-md relative overflow-hidden transition-all">
                {/* Laser Accent Top Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono-tech font-bold text-cyan-300 uppercase tracking-wide">
                      TRA CỨU & QUÉT LỖ HỔNG MỤC TIÊU NHANH
                    </span>
                  </div>
                  <span className="text-[10px] font-mono-tech text-slate-400 hidden sm:inline-block">
                    LIVE TELEMETRY HUD
                  </span>
                </div>

                {/* Search Bar Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleRunTargetScan()
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Crosshair className="h-4 w-4 text-cyan-400" />
                    </div>
                    <input
                      type="text"
                      value={scanTargetInput}
                      onChange={(e) => setScanTargetInput(e.target.value)}
                      placeholder="Nhập IP, Hostname mục tiêu (vd: 10.10.14.89, corp.internal)..."
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0e121a] border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono-tech text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isScanningTarget}
                    className="btn-cyber-interactive inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono-tech font-bold text-xs bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shrink-0 cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-400/20"
                  >
                    {isScanningTarget ? (
                      <>
                        <RotateCw className="h-3.5 w-3.5 animate-spin text-slate-950" />
                        <span>ĐANG QUÉT...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5 fill-slate-950" />
                        <span>QUÉT MỤC TIÊU</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Target Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] font-mono-tech text-slate-400 font-semibold uppercase">Mẫu thử nhanh:</span>
                  {[
                    { label: "10.10.14.89 [SQLi]", val: "10.10.14.89" },
                    { label: "192.168.1.100 [JWT]", val: "192.168.1.100" },
                    { label: "corp-banking.vn [RCE]", val: "corp-banking.vn" },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => {
                        setScanTargetInput(chip.val)
                        handleRunTargetScan(chip.val)
                      }}
                      className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-800/80 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-400/40 transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Live Scan Diagnostic Report Box */}
                {targetScanReport && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800 space-y-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                        <span className="font-mono-tech font-bold text-red-400">
                          {targetScanReport.vuln}
                        </span>
                      </div>
                      <span className="font-mono-tech font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[10px]">
                        CVSS: {targetScanReport.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      {targetScanReport.cveDesc}
                    </p>

                    {/* Ports Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono-tech text-[10px]">
                      {targetScanReport.ports.map((p, i) => (
                        <div key={i} className="p-1.5 rounded bg-slate-900/90 border border-slate-800 flex flex-col">
                          <span className="font-bold text-slate-200">{p.port}</span>
                          <span className="text-slate-400 truncate">{p.service}</span>
                          <span className={`text-[9px] font-bold ${p.risk === 'CRITICAL' ? 'text-red-400' : p.risk === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {p.state} • {p.risk}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Direct Action Link */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-mono-tech">
                        🛡 Khắc phục: <span className="text-slate-200">{targetScanReport.mitigation}</span>
                      </span>
                      <Link
                        to="/labs"
                        className="inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap ml-2"
                      >
                        <span>Khởi động Lab này</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Tool Chips (Clickable Quick Prompts) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-mono-tech text-slate-400 font-bold uppercase">Công Cụ Diễn Tập:</span>
                {["Burp Suite", "Wireshark", "SQLMap", "Suricata", "Ghidra"].map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-mono-tech font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 cyberpunk:bg-[#071329] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-300 shadow-2xs hover:border-blue-400 dark:hover:border-cyan-400 hover:text-blue-600 dark:hover:text-cyan-300 transition-colors select-none"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="cyber-btn-primary btn-cyber-interactive inline-flex items-center justify-center font-bold rounded-xl px-6 py-3.5 text-sm gap-2.5 cursor-pointer group shadow-md shadow-blue-500/15"
                >
                  <Play className="h-4 w-4 fill-white group-hover:scale-110 transition-transform" />
                  <span>{isAuthenticated ? "Vào Bảng Điều Khiển Tác Chiến" : "Khởi Động Sandbox Miễn Phí"}</span>
                </Link>
                <Link
                  to="/labs"
                  className="btn-cyber-interactive inline-flex items-center justify-center gap-2 font-semibold rounded-xl px-5 py-3.5 text-sm bg-white dark:bg-slate-900 cyberpunk:bg-[#071329] text-slate-800 dark:text-slate-100 cyberpunk:text-cyan-300 border border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/40 hover:border-blue-400 dark:hover:border-cyan-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                >
                  <FlaskConical className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                  <span>Khám Phá 120+ Phòng Lab</span>
                </Link>
              </div>

              {/* Telemetry Counter Strip */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 cyberpunk:border-slate-800/80">
                <div className="space-y-0.5">
                  <div className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white cyberpunk:text-cyan-50">
                    <CountUp end={2400} suffix="+" />
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Chuyên Viên Tác Chiến</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-400">
                    <CountUp end={120} suffix="+" />
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Phòng Lab Thực Địa</div>
                </div>
                <div className="space-y-0.5">
                  <div className="font-mono-tech text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    <CountUp end={100} suffix="%" />
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">MITRE ATT&CK</div>
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
                      title="Phát lại chuỗi thao tác"
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
                    <span>Vào Phòng Lab</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          YEWSAFE-INSPIRED STANDARDS & SECURITY ECOSYSTEM MARQUEE
          Infinite Scrolling Ticker with Laser Horizon Glow Accents
         ==================================================================== */}
      <section className="relative w-full overflow-hidden bg-[#07090e] border-y border-white/5 py-4">
        {/* Cyan Laser Horizon Beam Accents (Top & Bottom) */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

        <div className="max-w-[1240px] mx-auto px-4 mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono-tech uppercase font-bold tracking-wider text-cyan-400/90">
              HỆ SINH THÁI TIÊU CHUẨN AN TOÀN THÔNG TIN & CÔNG NGHỆ TÍCH HỢP
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono-tech text-slate-500">
            100% STANDARDS COMPLIANT • ZERO-TRUST SANDBOX FLEET
          </span>
        </div>

        {/* Infinite Marquee Strip */}
        <div className="flex overflow-hidden relative select-none">
          {/* Left/Right Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#07090e] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#07090e] to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee-infinite items-center gap-4 py-1">
            {[...STANDARDS_ECOSYSTEM, ...STANDARDS_ECOSYSTEM].map((item, idx) => (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0e121a]/90 border border-slate-800/80 hover:border-cyan-400/50 hover:bg-[#121722] transition-colors shrink-0 group cursor-default"
              >
                <span className="text-base group-hover:scale-110 transition-transform">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono-tech font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono-tech text-slate-500">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          CYBER COMMAND THEATER (Cinematic Video & Interactive Operations HUD)
          Inspired by NCS Group National SOC & Cyber Defense Command Center
         ==================================================================== */}
      <CyberCommandTheater />

      {/* ====================================================================
          YEWSAFE-INSPIRED PROMO & STRATEGIC CAPABILITY RIBBON
          4 Glassmorphic High-Tech Cards with Category Pills & Laser Beam Bottoms
         ==================================================================== */}
      <section className="relative max-w-[1240px] mx-auto px-4 sm:px-6 pt-4 pb-8 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMO_RIBBON_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="group relative bg-[#0a0c10]/95 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/30 overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all pointer-events-none" />

              <div className="space-y-3 relative z-10">
                {/* Pill Badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase tracking-wider border ${card.pillColor}`}>
                    {card.pill}
                  </span>
                  <span className="text-[10px] font-mono-tech text-slate-600">0{idx + 1}</span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* CTA Link with Orange Accent (YewSafe Signature #FF6B00) */}
              <div className="pt-4 mt-2 border-t border-slate-800/60 relative z-10">
                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF7A00] hover:text-[#FFA040] transition-colors group/link"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Bottom Horizon Laser Beam Accent */}
              <div className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent ${card.laserColor} to-transparent opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          3. BENTO GRID ARCHITECTURE (Bespoke Cyber Ecosystem)
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-mono-tech font-bold text-blue-600 uppercase tracking-widest">
            KIẾN TRÚC NỀN TẢNG TÁC CHIẾN
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Thiết Kế Chuẩn Hóa Cho Năng Lực An Ninh Thực Chiến
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Hệ sinh thái Sandbox toàn diện kết hợp phân tích gói tin mạng thực tế, sơ đồ đối thủ APT và điều tra pháp chứng SOC tự động.
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
                      Bộ Phân Tích Gói Tin Mạng Thời Gian Thực
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Luồng bắt gói tin trực tiếp với cơ chế bóc tách & chặn lọc tương tác
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetPackets}
                  title="Tải lại luồng trực tiếp"
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
                            : "bg-white dark:bg-slate-800 cyberpunk:bg-[#0a1628] border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/30 text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-300"
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
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800/80 cyberpunk:bg-[#0a1628] border border-slate-200/60 dark:border-slate-700/60 cyberpunk:border-cyan-500/30 text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300 whitespace-nowrap">
                          {pkt.statusLabel || "PASSED"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <span className="cursor-default">Môi trường Wireshark & phân tích PCAP được tích hợp sẵn trong mọi phòng lab.</span>
              <span className="font-mono-tech font-bold text-blue-600 shrink-0 whitespace-nowrap cursor-default">
                CÔ LẬP KHÔNG RÒ RỈ DỮ LIỆU
              </span>
            </div>
          </div>

          {/* BENTO 2: MITRE ATT&CK Matrix Navigator - 4 cols */}
          <div className="md:col-span-12 lg:col-span-4 cyber-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-200">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50">Ánh Xạ MITRE ATT&CK</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">Chiến thuật tấn công thực tế từ các nhóm APT</p>
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
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Biện pháp phòng thủ: </span>
              {mitreTechniques.find((m) => m.id === selectedMitre)?.mitigation}
            </div>
          </div>

          {/* BENTO 3: Automated SOC Telemetry & Defense Engine - 6 cols */}
          <div className="md:col-span-12 lg:col-span-6 cyber-card p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50">Hệ thống Đo kiểm Tác chiến SOC</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">Phân tích telemetry & bóc tách payload tự động</p>
                  </div>
                </div>
                <span className="font-mono-tech text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                  TELEMETRY ENGINE
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono-tech text-xs space-y-1.5">
                  <div className="text-cyan-400 text-[11px] font-bold">SOC-TELEMETRY // PHÂN TÍCH VECTOR LAB #04:</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    "Phát hiện Session Token mã hóa Base64 trong HTTP Header. Đang giải mã phân tích độ dài khối padding để xác định điểm khai thác Padding Oracle (CVE-2023-41892)."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono-tech">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 cyberpunk:bg-[#071329] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/30 text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-200">
                    <span className="font-bold text-blue-600 dark:text-cyan-400 block">Bộ Dịch Ngược Mã Nguồn</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Phân tích assembly x86 & luồng thực thi CFG</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 cyberpunk:bg-[#071329] border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/30 text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-200">
                    <span className="font-bold text-blue-600 block">Khắc Phục Mã Nguồn</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Đề xuất cú pháp phòng thủ chuẩn hóa NIST</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Gợi ý tác chiến mở từng bước theo ngữ cảnh. Đảm bảo tính thử thách và rèn luyện tư duy.</span>
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
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50">Sandbox Zero-Trust Trên Trình Duyệt</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300">Điều phối container siêu nhẹ tức thì</p>
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
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">ĐỘ TRỄ PING</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-xl font-black text-blue-600">
                    <CountUp end={100} suffix="%" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">MỨC CÔ LẬP</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200">
                  <div className="text-xl font-black text-emerald-600">
                    <CountUp end={3} prefix="< " suffix="s" />
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">KHỞI ĐỘNG LAB</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Mọi kịch bản thực hành đều chạy trong container ảo hóa cô lập hoàn toàn, hỗ trợ snapshot khôi phục tự động và an toàn tuyệt đối cho thiết bị của bạn.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hoạt động mượt mà trên mọi trình duyệt Chrome, Edge, Firefox và Safari.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. INTERACTIVE PLAYGROUND: LIVE PAYLOAD ANALYZER
         ==================================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10">
        <div className="cyber-card p-6 sm:p-8 rounded-3xl border border-blue-200 dark:border-slate-800 cyberpunk:border-cyan-500/40 bg-gradient-to-r from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 cyberpunk:from-[#071022] cyberpunk:via-[#09152b] cyberpunk:to-[#0c1e3d] shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider font-mono-tech">
                <Code2 className="h-4 w-4" />
                <span>BỘ PHÂN TÍCH CÚ PHÁP AST TRỰC TIẾP</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Kiểm Thử Trình Quét Phòng Thủ Trực Tiếp
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Nhập bất kỳ chuỗi tấn công SQL Injection hoặc XSS để quan sát phân tích token từ vựng và đề xuất cách vá lỗi ngay lập tức.
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
                    className="w-full pl-18 pr-3 py-2.5 text-xs font-mono-tech bg-white dark:bg-slate-800 cyberpunk:bg-[#030712] border border-slate-300 dark:border-slate-700 cyberpunk:border-cyan-500/40 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-900 dark:text-white shadow-2xs"
                    placeholder="Nhập chuỗi payload SQL/XSS kiểm thử..."
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
                  <span>{isScanning ? "Đang Quét..." : "Phân Tích Payload"}</span>
                </button>
              </div>

              {scanResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono-tech text-xs space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold">[{scanResult.vulnType}]</span>
                    <span className="text-amber-400 text-[11px]">{scanResult.severity}</span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    Khắc phục: <span className="text-emerald-400 font-semibold">{scanResult.remediation}</span>
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
              DANH MỤC PHÒNG LAB THỰC CHIẾN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Hệ Thống Phòng Lab Thực Chiến
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Các môi trường khai thác lỗ hổng thực tế được ánh xạ với chuẩn CVE và ma trận MITRE ATT&CK.
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
                placeholder="Tìm kiếm phòng lab, mã CVE..."
                className="pl-9 pr-3 py-1.5 text-xs font-mono-tech rounded-xl border border-slate-200 dark:border-slate-700 cyberpunk:border-cyan-500/40 bg-white dark:bg-slate-800 cyberpunk:bg-[#030712] text-slate-900 dark:text-white focus:border-blue-600 outline-none w-full sm:w-48 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 cyberpunk:bg-[#0d1e3d] rounded-xl border border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/40 text-xs">
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
                      ? "bg-white dark:bg-slate-700 cyberpunk:bg-cyan-500/20 text-blue-600 dark:text-cyan-300 shadow-2xs font-bold"
                      : "text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-400/80 hover:text-slate-900 dark:hover:text-white"
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
            <span className="font-semibold">Kịch Bản Đang Lọc:</span>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              <CountUp end={filteredLabs.length} duration={3500} /> Phòng Lab Khả Dụng
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
                <CountUp end={100} duration={3500} suffix="%" /> Cấu Hình Tự Động
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
                    <CountUp end={lab.durationMins || parseInt(lab.duration)} duration={3500} suffix=" phút" />
                  </span>
                  <span>&bull;</span>
                  <span className="whitespace-nowrap">{lab.difficulty}</span>
                </div>

                <Link
                  to="/labs"
                  className="cyber-btn-primary btn-cyber-interactive px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <span>Khởi Chạy</span>
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
                Truy Cập Tức Thì • Không Cần Cài Đặt Máy Ảo
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                Bắt đầu hành trình an ninh mạng thực chiến ngay hôm nay
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                Tham gia miễn phí. Không cần thẻ tín dụng. Khởi chạy các mục tiêu đám mây cô lập ngay trên trình duyệt và rèn luyện kỹ năng theo tiến độ của bạn.
              </p>
            </div>

            {/* 3 Core Value Micro-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-left">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Sandbox Trên Trình Duyệt</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">Không cần tải về hay cài máy ảo</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">120+ Phòng Lab Thực Chiến</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">MITRE ATT&CK & OWASP</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Kích Hoạt Tức Thì</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">Không yêu cầu thẻ tín dụng</div>
                </div>
              </div>
            </div>

            {/* Dual CTA Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="cyber-btn-primary btn-cyber-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold text-sm px-7 py-3.5 rounded-xl shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 transition-all cursor-pointer"
              >
                <span>{isAuthenticated ? "Vào Bảng Điều Khiển" : "Tạo Tài Khoản Thực Chiến"}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/labs"
                className="btn-cyber-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-sm px-5 py-3.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer"
              >
                <Search className="h-4 w-4 text-sky-400" />
                <span>Khám Phá Phòng Lab Trực Tiếp</span>
              </Link>
            </div>

            {/* Micro Telemetry Bar */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono-tech text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <CountUp end={2400} suffix="+" /> Học Viên Tác Chiến
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <CountUp end={99.98} decimals={2} suffix="%" /> Range SLA
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <CountUp end={120} suffix="+" /> Máy Ảo Diễn Tập
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
