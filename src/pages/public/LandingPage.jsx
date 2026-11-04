import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Shield,
  Terminal,
  Wifi,
  Code2,
  Play,
  ArrowRight,
  Search,
  Check,
  RotateCw,
  ChevronRight,
  FlaskConical,
  Activity,
  FileCheck,
  CheckCircle2,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { CountUp } from "../../components/common"

// Tiêu chuẩn & Hệ sinh thái công nghệ đối tác
const INDUSTRY_STANDARDS = [
  { name: "MITRE ATT&CK® v14", desc: "Adversary TTP Matrix", tag: "TTP" },
  { name: "OWASP Top 10 2025", desc: "AppSec Vulnerability Standard", tag: "APPSEC" },
  { name: "NIST SP 800-53 R5", desc: "Federal Security Controls", tag: "NIST" },
  { name: "CIS Critical Controls", desc: "System Hardening Baseline", tag: "CIS" },
  { name: "ISO/IEC 27001:2022", desc: "ISMS Information Security", tag: "ISO" },
  { name: "Kali Linux Rolling", desc: "Offensive Security Suite", tag: "OS" },
  { name: "Suricata 7.0 IDS", desc: "High-Performance Threat Engine", tag: "IDS" },
  { name: "Wireshark Protocol", desc: "Deep Packet Inspection", tag: "PCAP" },
]

// Dữ liệu mẫu danh mục phòng lab nổi bật
const SHOWCASE_LABS = [
  {
    id: "lab-01",
    category: "web",
    title: "SQL Injection: Khai Thác & Vá Bằng Parameterized Query",
    difficulty: "Cơ bản",
    durationMins: 30,
    mitre: "T1190",
    points: 300,
    desc: "Phân tích câu lệnh SQL ghép chuỗi dễ bị khai thác auth-bypass và triển khai PreparedStatement an toàn tuyệt đối.",
    tagColor: "blue",
  },
  {
    id: "lab-02",
    category: "web",
    title: "JWT Secret Brute-Force & Chữ Ký Asymmetric RS256",
    difficulty: "Trung bình",
    durationMins: 45,
    mitre: "T1552",
    points: 450,
    desc: "Tấn công bẻ khóa bí mật HS256 yếu bằng jwt-tool và cấu hình nâng cấp sang cặp khóa bất đối xứng Ed25519/RS256.",
    tagColor: "blue",
  },
  {
    id: "lab-03",
    category: "soc",
    title: "Điều Tra Sự Cố: Phát Hiện C2 Beaconing Bằng Wireshark",
    difficulty: "Trung bình",
    durationMins: 40,
    mitre: "T1071",
    points: 400,
    desc: "Phân tích gói tin PCAP để phát hiện chu kỳ beacon của Cobalt Strike và cấu hình luật chặn Suricata IDS tự động.",
    tagColor: "emerald",
  },
  {
    id: "lab-04",
    category: "cloud",
    title: "Khai Thác SSRF Để Thu Thập AWS IAM Metadata Credentials",
    difficulty: "Nâng cao",
    durationMins: 55,
    mitre: "T1078",
    points: 600,
    desc: "Vượt qua cơ chế kiểm duyệt URL để truy cập link 169.254.169.254 và thực thi giải pháp bắt buộc IMDSv2 bảo vệ tài nguyên.",
    tagColor: "amber",
  },
  {
    id: "lab-05",
    category: "soc",
    title: "Pháp Chứng Bộ Nhớ RAM: Bóc Tách Ransomware Process Injection",
    difficulty: "Nâng cao",
    durationMins: 60,
    mitre: "T1055",
    points: 650,
    desc: "Sử dụng Volatility 3 bóc tách tiến trình svchost.exe bị chèn mã độc ngầm và khôi phục khóa mã hóa AES trong bộ nhớ.",
    tagColor: "emerald",
  },
  {
    id: "lab-06",
    category: "crypto",
    title: "Phòng Thủ Tấn Công Padding Oracle Khối Mã Hóa CBC",
    difficulty: "Nâng cao",
    durationMins: 45,
    mitre: "T1557",
    points: 550,
    desc: "Giải mã bản tin thông qua thông điệp lỗi padding error và chuyển đổi sang thuật toán mã hóa xác thực an toàn AES-GCM.",
    tagColor: "indigo",
  },
]

export function LandingPage() {
  const { isAuthenticated } = useAuth()

  // Tab studio tương tác tại Hero: 'patch' | 'packets' | 'mitre'
  const [studioTab, setStudioTab] = useState("patch")

  // Trạng thái vá code tương tác (Interactive Code Patching)
  const [isPatched, setIsPatched] = useState(false)
  const [isPatching, setIsPatching] = useState(false)

  // Trạng thái luồng gói tin tương tác (Interactive Packet Sniffer)
  const INITIAL_PACKETS = [
    { id: 1, protocol: "TLS 1.3", src: "192.168.1.14:52410", dst: "corp-gateway:443", info: "Application Data [AES-256-GCM Encrypted]", status: "safe", statusText: "AN TOÀN" },
    { id: 2, protocol: "HTTP/2", src: "192.168.1.14:52412", dst: "auth.internal:8080", info: "POST /api/v1/login - payload: ' OR 1=1 --", status: "danger", statusText: "PHÁT HIỆN TẤN CÔNG" },
    { id: 3, protocol: "DNS", src: "10.0.4.88:53110", dst: "8.8.8.8:53", info: "Standard query A api.production.corp", status: "safe", statusText: "HỢP LỆ" },
    { id: 4, protocol: "SSH-2.0", src: "bastion-host:22", dst: "core-node:44210", info: "Key Exchange [curve25519-sha256]", status: "safe", statusText: "XÁC THỰC" },
  ]
  const [packetList, setPacketList] = useState(INITIAL_PACKETS)
  const [droppedPacketId, setDroppedPacketId] = useState(null)

  // Trạng thái MITRE TTP tương tác
  const [activeTtpId, setActiveTtpId] = useState("T1190")

  // Bộ phân tích payload AST trực tiếp
  const [testPayload, setTestPayload] = useState("' OR 1=1 --")
  const [scanResult, setScanResult] = useState({
    type: "CWE-89: SQL Injection (Tautology Bypass)",
    severity: "CRITICAL 9.8",
    tokens: ["SINGLE_QUOTE", "OR_KEYWORD", "BOOL_EXPR", "SQL_COMMENT"],
    fix: "Sử dụng PreparedStatement parameterized query binding trên database driver.",
  })
  const [isScanning, setIsScanning] = useState(false)

  // Bộ lọc danh mục phòng lab
  const [labCategory, setLabCategory] = useState("all")
  const [labSearchQuery, setLabSearchQuery] = useState("")

  const handleApplyPatch = () => {
    setIsPatching(true)
    setTimeout(() => {
      setIsPatched(true)
      setIsPatching(false)
    }, 400)
  }

  const handleResetPatch = () => {
    setIsPatched(false)
  }

  const handleDropPacket = (id) => {
    setDroppedPacketId(id)
    setTimeout(() => {
      setPacketList((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "mitigated", statusText: "ĐÃ CHẶN" } : p
        )
      )
      setDroppedPacketId(null)
    }, 300)
  }

  const handleResetPackets = () => {
    setPacketList(INITIAL_PACKETS)
  }

  const handleAnalyzePayload = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      const p = testPayload.toLowerCase()
      if (p.includes("1=1") || p.includes("or") || p.includes("'")) {
        setScanResult({
          type: "CWE-89: SQL Injection (Tautology Bypass)",
          severity: "CRITICAL 9.8",
          tokens: ["SINGLE_QUOTE", "OR_KEYWORD", "BOOL_EXPR", "SQL_COMMENT"],
          fix: "Sử dụng PreparedStatement parameterized query binding trên database driver.",
        })
      } else if (p.includes("<script") || p.includes("onerror")) {
        setScanResult({
          type: "CWE-79: Cross-Site Scripting (XSS Polyglot)",
          severity: "HIGH 8.4",
          tokens: ["HTML_TAG", "JS_EXECUTION", "DOM_ACCESS", "EVENT_HANDLER"],
          fix: "Áp dụng Context-aware HTML entity encoding và cấu hình Content Security Policy (CSP).",
        })
      } else if (p.includes("169.254")) {
        setScanResult({
          type: "CWE-918: Server-Side Request Forgery (SSRF)",
          severity: "CRITICAL 9.3",
          tokens: ["LINK_LOCAL_IP", "AWS_METADATA", "LATEST_CREDENTIALS", "UNRESTRICTED_EGRESS"],
          fix: "Bắt buộc IMDSv2 với HTTP PUT session token và giới hạn hop-limit = 1.",
        })
      } else {
        setScanResult({
          type: "CWE-78: OS Command Injection",
          severity: "CRITICAL 9.8",
          tokens: ["CMD_SEPARATOR", "SHELL_INVOCATION", "POSIX_IDENTITY", "ARBITRARY_EXEC"],
          fix: "Thực thi trực tiếp qua execve mảng argv không qua shell wrapper.",
        })
      }
    }, 350)
  }

  const filteredLabs = SHOWCASE_LABS.filter((lab) => {
    const matchCat = labCategory === "all" || lab.category === labCategory
    const matchSearch =
      lab.title.toLowerCase().includes(labSearchQuery.toLowerCase()) ||
      lab.desc.toLowerCase().includes(labSearchQuery.toLowerCase()) ||
      lab.mitre.toLowerCase().includes(labSearchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-[#080b14] text-slate-900 dark:text-slate-100 transition-colors duration-200 select-none">
      {/* ====================================================================
          1. TOP ANNOUNCEMENT BAR (Sleek hairline release pill)
         ==================================================================== */}
      <div className="w-full bg-slate-50 dark:bg-[#0c101d] border-b border-slate-200/80 dark:border-white/[0.06] py-2 px-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-sky-300 border border-blue-200/80 dark:border-blue-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
              BẢN PHÁT HÀNH 2026
            </span>
            <span className="truncate text-slate-700 dark:text-slate-300">
              Cập nhật 24 phòng lab Cloud Security AWS & Kubernetes theo chuẩn NIST SP 800-53 R5.
            </span>
          </div>

          <Link
            to="/labs?category=cloud"
            className="inline-flex items-center gap-1 text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 font-semibold shrink-0 transition-colors"
          >
            <span>Khám phá ngay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* ====================================================================
          2. HERO SECTION — THOÁNG ĐÃNG, SÁNG SỦA, SANG TRỌNG (Linear/Stripe)
         ==================================================================== */}
      <section className="relative pt-14 sm:pt-20 pb-16 lg:pb-24 overflow-hidden">
        {/* Soft Ambient Radial Diffusion */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-500/10 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Release Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-white/[0.08] text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs mb-8 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">Thao Trường Tác Chiến 2026</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="text-blue-600 dark:text-sky-400 font-semibold">120+ Sandbox Trực Tiếp</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
            Luyện tập an ninh mạng thực chiến{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 dark:from-sky-400 dark:via-blue-300 dark:to-cyan-300">
              trên nền tảng đám mây
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Nâng cao kỹ năng phòng thủ và phản ứng sự cố trên các sandbox đám mây được cô lập an toàn ngay trên trình duyệt. Không cần cài đặt máy ảo phức tạp, sẵn sàng thực chiến chỉ sau 3 giây.
          </p>

          {/* Dual Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>{isAuthenticated ? "Vào Bảng Điều Khiển Tác Chiến" : "Bắt Đầu Thử Nghiệm Miễn Phí"}</span>
            </Link>

            <Link
              to="/labs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-xs sm:text-sm px-6 py-3 rounded-lg bg-white dark:bg-[#0f1422] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.04] shadow-xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <FlaskConical className="h-4 w-4 text-blue-600 dark:text-sky-400" />
              <span>Khám Phá 120+ Phòng Lab</span>
            </Link>
          </div>

          {/* Value Proof Badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              <span>Khởi động trong 3s</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              <span>100% Cô lập trình duyệt</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              <span>Chuẩn MITRE ATT&CK & NIST</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              <span>Không cần cài máy ảo</span>
            </span>
          </div>

          {/* ====================================================================
              3. CENTERPIECE — INTERACTIVE CYBER RANGE WORKBENCH
              Thiết kế theo chuẩn Linear Studio / Stripe Workbench
             ==================================================================== */}
          <div className="mt-12 max-w-5xl mx-auto text-left">
            <div className="rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200/90 dark:border-white/[0.08] shadow-xl overflow-hidden">
              {/* Studio Window Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] gap-3">
                {/* Traffic lights + Workspace title */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    range-workbench.internal
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    SẴN SÀNG TÁC CHIẾN
                  </span>
                </div>

                {/* 3 Tangible Studio Mode Tabs */}
                <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-[#080b14] border border-slate-200/80 dark:border-white/[0.06] self-start sm:self-auto text-xs">
                  {[
                    { id: "patch", label: "Chẩn Đoán & Vá Code", icon: Code2 },
                    { id: "packets", label: "Bộ Bắt Gói Tin Mạng", icon: Wifi },
                    { id: "mitre", label: "Ma Trận Phòng Thủ", icon: Shield },
                  ].map((tab) => {
                    const Icon = tab.icon
                    const active = studioTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStudioTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                          active
                            ? "bg-white dark:bg-[#162032] text-blue-600 dark:text-sky-400 font-semibold shadow-xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Studio Workspace Content */}
              <div className="p-5 sm:p-6 min-h-[300px]">
                {/* TAB 1: CODE VULNERABILITY INSPECTOR & 1-CLICK PATCH */}
                {studioTab === "patch" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06] gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Mục tiêu: Endpoint Xác thực Người dùng (/api/v1/auth/login)</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20">
                            CWE-89 SQL INJECTION
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Quan sát câu lệnh SQL thô có thể bị khai thác auth-bypass và áp dụng bản vá chuẩn PreparedStatement.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isPatched ? (
                          <button
                            type="button"
                            onClick={handleResetPatch}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          >
                            <RotateCw className="h-3 w-3" />
                            <span>Khôi phục lỗ hổng</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleApplyPatch}
                            disabled={isPatching}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer"
                          >
                            {isPatching ? (
                              <>
                                <RotateCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Đang xác minh...</span>
                              </>
                            ) : (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                <span>Áp Dụng Bản Vá</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Code Diff Box */}
                    <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-900 text-slate-200 font-mono text-xs overflow-hidden">
                      <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>src/main/java/com/cyberpath/service/AuthService.java</span>
                        <span className={isPatched ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                          {isPatched ? "TRẠNG THÁI: ĐÃ BẢO VỆ (PreparedStatement Bound)" : "TRẠNG THÁI: LỖ HỔNG (Ghép chuỗi SQL thô)"}
                        </span>
                      </div>

                      <div className="p-4 space-y-1.5 text-[11px] sm:text-xs">
                        <div className="text-slate-500">// 1. Nhận thông tin đăng nhập từ payload người dùng</div>
                        <div className="text-slate-300">String sql;</div>

                        {!isPatched ? (
                          <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-200">
                            <span className="text-rose-400 font-bold select-none">- </span>
                            sql = &quot;SELECT * FROM users WHERE user = &apos;&quot; + username + &quot;&apos; AND pass = &apos;&quot; + password + &quot;&apos;&quot;;
                            <div className="text-[10px] text-rose-300 mt-1 font-sans">
                              ⚠ Cảnh báo: Kẻ tấn công có thể chèn chuỗi &quot;&apos; OR 1=1 --&quot; để vượt qua xác thực mật khẩu.
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 animate-in fade-in duration-200">
                            <span className="text-emerald-400 font-bold select-none">+ </span>
                            PreparedStatement stmt = conn.prepareStatement(&quot;SELECT * FROM users WHERE user = ? AND pass = ?&quot;);
                            <br />
                            <span className="text-emerald-400 font-bold select-none">+ </span>
                            stmt.setString(1, username); stmt.setString(2, hashPassword(password));
                            <div className="text-[10px] text-emerald-300 mt-1 font-sans font-semibold">
                              ✓ An toàn: Tham số được bind trực tiếp qua driver, loại bỏ hoàn toàn nguy cơ SQL Injection.
                            </div>
                          </div>
                        )}

                        <div className="text-slate-400 pt-1">ResultSet rs = stmt.executeQuery();</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: LIVE PACKET TELEMETRY & DROP ACTION */}
                {studioTab === "packets" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Giao diện Mạng: eth0 (Chế độ giám sát thời gian thực)
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Bóc tách lưu lượng mạng và thực thi luật ngăn chặn tức thời (Active Mitigation).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetPackets}
                        className="text-xs font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        Làm mới danh sách
                      </button>
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      {packetList.map((pkt) => (
                        <div
                          key={pkt.id}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${
                            droppedPacketId === pkt.id
                              ? "opacity-30 scale-98"
                              : pkt.status === "danger"
                              ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
                              : pkt.status === "mitigated"
                              ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
                              : "bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.06] text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                                pkt.protocol === "TLS 1.3"
                                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300"
                                  : pkt.protocol === "DNS"
                                  ? "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300"
                                  : pkt.status === "danger"
                                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300"
                                  : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300"
                              }`}
                            >
                              {pkt.protocol}
                            </span>
                            <span className="font-semibold text-xs truncate">
                              {pkt.src} → {pkt.dst}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 hidden md:inline truncate">
                              {pkt.info}
                            </span>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {pkt.status === "danger" ? (
                              <button
                                type="button"
                                onClick={() => handleDropPacket(pkt.id)}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                CHẶN GÓI TIN
                              </button>
                            ) : pkt.status === "mitigated" ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                                ĐÃ CÁCH LY
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-500 uppercase">
                                {pkt.statusText}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: MITRE ATT&CK ADVERSARY TTPs */}
                {studioTab === "mitre" && (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Ma Trận Chiến Thuật MITRE ATT&CK v14
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ánh xạ trực tiếp giữa kỹ thuật tấn công của đối thủ và cơ chế phòng thủ chuyên sâu.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { id: "T1190", tactic: "Initial Access", name: "Exploit Public-Facing App", fix: "Hardened WAF & continuous patch management." },
                        { id: "T1059", tactic: "Execution", name: "Command Interpreter", fix: "Constrained language mode & AppLocker policy." },
                        { id: "T1078", tactic: "Defense Evasion", name: "Valid Accounts Abuse", fix: "MFA FIDO2 & conditional access rules." },
                        { id: "T1557", tactic: "Credential Access", name: "Man-in-the-Middle", fix: "Enforce TLS 1.3 & Certificate Pinning." },
                      ].map((ttp) => (
                        <div
                          key={ttp.id}
                          onClick={() => setActiveTtpId(ttp.id)}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            activeTtpId === ttp.id
                              ? "bg-blue-50/80 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500 shadow-xs"
                              : "bg-slate-50/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.06] hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-blue-600 dark:text-sky-400">
                            <span>{ttp.id}</span>
                            <span className="text-slate-400">{ttp.tactic}</span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                            {ttp.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            {ttp.fix}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Studio Window Footer */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Ubuntu 24.04 LTS Hardened Sandbox • MicroVM Egress Isolation</span>
                </div>
                <Link
                  to="/labs"
                  className="font-semibold text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Mở toàn bộ 120+ phòng Lab</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0e121e] border border-slate-200/80 dark:border-white/[0.08] text-center shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  <CountUp end={2400} suffix="+" />
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Học Viên Diễn Tập</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0e121e] border border-slate-200/80 dark:border-white/[0.08] text-center shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-sky-400">
                  <CountUp end={120} suffix="+" />
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Phòng Lab Thực Địa</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0e121e] border border-slate-200/80 dark:border-white/[0.08] text-center shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  <CountUp end={100} suffix="%" />
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Chuẩn MITRE ATT&CK</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#0e121e] border border-slate-200/80 dark:border-white/[0.08] text-center shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold text-sky-600 dark:text-sky-400">
                  <CountUp end={3} prefix="< " suffix="s" />
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Khởi Động Sandbox</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. TIÊU CHUẨN & HỆ SINH THÁI ĐỐI TÁC (Clean, Calm, Grayscale)
         ==================================================================== */}
      <section className="py-10 border-y border-slate-200/80 dark:border-white/[0.06] bg-white/50 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
            Tương thích và bám sát các tiêu chuẩn an toàn thông tin hàng đầu thế giới
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {INDUSTRY_STANDARDS.map((std) => (
              <div
                key={std.name}
                className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06] text-center flex flex-col justify-center items-center hover:border-slate-300 dark:hover:border-white/[0.12] transition-colors"
              >
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-sky-400">
                  {std.tag}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 leading-tight">
                  {std.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. BENTO GRID — 4 TRỤ CỘT NĂNG LỰC CÓ MICRO-PREVIEW (Linear/Vercel)
         ==================================================================== */}
      <section className="py-18 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
              KIẾN TRÚC THỰC CHIẾN
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
              Hệ sinh thái diễn tập toàn diện
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Mỗi module được thiết kế với giao diện trực quan, cho phép học viên trực tiếp quan sát và thao tác trên từng lớp phòng thủ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Card 1: 120+ Sandbox Labs with Mini-Terminal */}
            <div className="cyber-card p-6 sm:p-7 flex flex-col justify-between group hover:border-blue-400/80 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-sky-400 flex items-center justify-center border border-blue-200/80 dark:border-blue-500/20">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                    KHỞI CHẠY TỨC THÌ
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                    120+ Phòng Lab Sandbox Trực Tiếp
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Khởi động container Kali Linux, Burp Suite & DVWA cô lập hoàn toàn trên trình duyệt chỉ sau 3 giây.
                  </p>
                </div>

                {/* Micro-Terminal Visual Preview */}
                <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 pb-1 border-b border-slate-800/80">
                    <span className="h-2 w-2 rounded-full bg-slate-600" />
                    <span>student@kali-sandbox:~</span>
                  </div>
                  <div className="text-emerald-400">$ nmap -sS -p 80,443,8080 target.corp</div>
                  <div className="text-slate-400">PORT     STATE SERVICE VERSION</div>
                  <div className="text-slate-200">80/tcp   OPEN  http    Apache/2.4.52 (Ubuntu)</div>
                  <div className="text-slate-200">443/tcp  OPEN  ssl/tls OpenSSL 3.0.2</div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  to="/labs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors"
                >
                  <span>Khám phá phòng lab</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 2: APT Campaign Simulator with Kill-Chain Flow */}
            <div className="cyber-card p-6 sm:p-7 flex flex-col justify-between group hover:border-blue-400/80 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/80 dark:border-indigo-500/20">
                    <Shield className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                    CHIẾN DỊCH THỰC TẾ
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                    Diễn Tập Kịch Bản APT & Ransomware
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Tái hiện chuỗi tấn công nâng cao mô phỏng nhóm APT28, APT29 và khóa mã LockBit trên môi trường Active Directory.
                  </p>
                </div>

                {/* Kill-Chain Progression Visual */}
                <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-300 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">TIẾN TRÌNH TÁC CHIẾN KILL-CHAIN:</div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 rounded bg-blue-950/60 border border-blue-800 text-blue-300">
                      T1566<br />Phishing
                    </div>
                    <div className="p-1.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300">
                      T1059<br />Execute
                    </div>
                    <div className="p-1.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300">
                      T1078<br />PrivEsc
                    </div>
                    <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300">
                      BLOCKED<br />Isolated
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  to="/labs?category=APT"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors"
                >
                  <span>Xem kịch bản APT</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 3: SOC & Forensics Center with SIEM Log Stream */}
            <div className="cyber-card p-6 sm:p-7 flex flex-col justify-between group hover:border-blue-400/80 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-500/20">
                    <Activity className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                    PHÒNG THỦ BLUE TEAM
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                    Trung Tâm Điều Hành SOC & Pháp Chứng
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Rèn luyện kỹ năng điều tra log SIEM Splunk/ELK, phân tích dump bộ nhớ Volatility và tự động hóa cách ly mối đe dọa.
                  </p>
                </div>

                {/* SIEM Log Stream Visual */}
                <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-[10px] pb-1 border-b border-slate-800">
                    <span>SPLUNK SIEM LOG STREAM</span>
                    <span className="text-emerald-400 font-bold">● LIVE</span>
                  </div>
                  <div className="text-rose-400 text-[10px] truncate">[CRIT] Suricata: ET WEB_SPECIFIC_APPS SQL Injection</div>
                  <div className="text-amber-400 text-[10px] truncate">[WARN] Volatility: Unlinked VAD hidden DLL detected</div>
                  <div className="text-emerald-400 text-[10px] truncate">[INFO] SOAR: Host 10.0.4.88 network egress isolated</div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  to="/labs?category=soc"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors"
                >
                  <span>Vào phòng SOC</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Bento Card 4: Certifications Pathway with Digital Credential */}
            <div className="cyber-card p-6 sm:p-7 flex flex-col justify-between group hover:border-blue-400/80 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/80 dark:border-sky-500/20">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
                    CHỨNG NHẬN QUỐC TẾ
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                    Lộ Trình Đạt Chuẩn CEH, OSCP & Sec+
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Khung năng lực ánh xạ 1:1 theo chuẩn NIST NICE. Cấp chứng nhận kỹ năng số có mã xác thực công khai chứng minh năng lực thực chiến.
                  </p>
                </div>

                {/* Digital Credential Visual */}
                <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-300 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">VERIFIED SKILL BADGE</div>
                    <div className="font-bold text-white text-xs mt-0.5">Offensive Security Certified Practitioner</div>
                    <div className="text-[10px] text-sky-400 mt-0.5">SHA256: 8f4c...3e19 • NIST NICE SP 800-181</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  to="/learning-paths"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 transition-colors"
                >
                  <span>Xem lộ trình học</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. BỘ PHÂN TÍCH PAYLOAD TƯƠNG TÁC (Rich Hands-on AST Playground)
         ==================================================================== */}
      <section className="py-14 bg-slate-100/60 dark:bg-white/[0.01] border-y border-slate-200/80 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cyber-card p-6 sm:p-8 bg-white dark:bg-[#0e121e]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 uppercase tracking-wider font-mono">
                  <Code2 className="h-4 w-4" />
                  <span>TRÌNH QUÉT CÚ PHÁP PAYLOAD</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Kiểm thử khả năng phòng thủ trực tiếp
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Nhập chuỗi kiểm thử tấn công (SQLi, XSS, SSRF, Command) để quan sát cơ chế bóc tách token cú pháp và đề xuất phòng thủ chuẩn OWASP.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-3.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      placeholder="Nhập chuỗi payload kiểm thử..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#080b14] border border-slate-200 dark:border-white/[0.1] rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAnalyzePayload}
                    disabled={isScanning}
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    {isScanning ? (
                      <>
                        <RotateCw className="h-4 w-4 animate-spin" />
                        <span>Đang phân tích...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        <span>Phân Tích Ngay</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">Mẫu có sẵn:</span>
                  {[
                    { label: "SQL Tautology", val: "' OR 1=1 --" },
                    { label: "Polyglot XSS", val: "<script>alert(document.domain)</script>" },
                    { label: "AWS SSRF", val: "http://169.254.169.254/latest/meta-data/" },
                    { label: "Command Injection", val: "; whoami; id" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setTestPayload(chip.val)}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {scanResult && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#080b14] border border-slate-200 dark:border-white/[0.08] space-y-2.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">[{scanResult.type}]</span>
                      <span className="font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20 text-[11px]">
                        CVSS: {scanResult.severity}
                      </span>
                    </div>

                    {/* Parsed Tokens Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-mono">AST TOKENS:</span>
                      {scanResult.tokens.map((tok) => (
                        <span key={tok} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-blue-500/20">
                          {tok}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-white/[0.06]">
                      Biện pháp khắc phục: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{scanResult.fix}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. DANH MỤC PHÒNG LAB THỰC CHIẾN (Search & Filter Cards)
         ==================================================================== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
                PHÒNG LAB TIÊU BIỂU
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
                Khám phá môi trường diễn tập
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Các bài tập mô phỏng lỗ hổng thực tế được gắn nhãn MITRE ATT&CK và CVE tương ứng.
              </p>
            </div>

            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={labSearchQuery}
                  onChange={(e) => setLabSearchQuery(e.target.value)}
                  placeholder="Tìm phòng lab, CVE, MITRE..."
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#0e121e] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 w-full sm:w-56 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/[0.04] rounded-xl border border-slate-200/80 dark:border-white/[0.08] text-xs">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "web", label: "Web" },
                  { key: "soc", label: "SOC" },
                  { key: "cloud", label: "Cloud" },
                  { key: "crypto", label: "Crypto" },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setLabCategory(cat.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      labCategory === cat.key
                        ? "bg-white dark:bg-[#162032] text-blue-600 dark:text-sky-400 font-semibold shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Labs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLabs.map((lab) => (
              <div
                key={lab.id}
                className="cyber-card p-5 flex flex-col justify-between group hover:border-blue-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-blue-500/20">
                      MITRE: {lab.mitre}
                    </span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      +{lab.points} PTS
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                    {lab.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {lab.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <span>{lab.durationMins} phút</span>
                    <span>&bull;</span>
                    <span>{lab.difficulty}</span>
                  </div>

                  <Link
                    to="/labs"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 transition-colors"
                  >
                    <span>Vào Lab</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          8. CALL TO ACTION BANNER (Thân thiện, ấm áp, sáng sủa)
         ==================================================================== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 sm:p-12 lg:p-14 text-center shadow-xl shadow-blue-600/10 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Sẵn sàng nâng tầm kỹ năng an ninh mạng thực chiến?
            </h2>
            <p className="text-blue-100 text-base leading-relaxed">
              Tạo tài khoản miễn phí chỉ trong 30 giây để bắt đầu thử nghiệm các phòng lab đầu tiên. Không yêu cầu thẻ tín dụng, học tập theo tốc độ của bạn.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{isAuthenticated ? "Vào Bảng Điều Khiển" : "Tạo Tài Khoản Miễn Phí"}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-medium text-sm px-6 py-3 rounded-xl text-white bg-blue-700/60 hover:bg-blue-700 border border-white/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Xem Bảng Giá & Doanh Nghiệp</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
