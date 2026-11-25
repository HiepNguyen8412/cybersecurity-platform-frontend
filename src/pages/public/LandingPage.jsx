import { useState, useMemo, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  BookOpen,
  Terminal,
  Shield,
  ShieldCheck,
  ArrowRight,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  Cpu,
  Layers,
  FileCheck,
  Code2,
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { CountUp } from "../../components/common"
import { challengeService } from "../../services/challengeService"

// ============================================================================
// §00 TÀI LIỆU THAM CHIẾU & CHUẨN MỰC HỌC THUẬT GỐC
// ============================================================================
const ACADEMIC_STANDARDS = [
  {
    code: "RFC 8446",
    org: "IETF Standard",
    title: "TLS 1.3 Protocol",
    desc: "Đặc tả bắt tay mật mã 1-RTT & Forward Secrecy",
  },
  {
    code: "MITRE ATT&CK® v14",
    org: "MITRE Corp",
    title: "Adversary TTP Matrix",
    desc: "Phân loại chiến thuật và kỹ thuật xâm nhập thực tế",
  },
  {
    code: "OWASP ASVS v4.0",
    org: "OWASP Foundation",
    title: "Application Verification",
    desc: "Tiêu chuẩn kiểm định an toàn kiến trúc ứng dụng Web",
  },
  {
    code: "NIST SP 800-53",
    org: "NIST Framework",
    title: "Security Controls",
    desc: "Hệ thống kiểm soát an ninh & quản trị rủi ro R5",
  },
  {
    code: "CWE™ Top 25",
    org: "MITRE CWE",
    title: "Software Weaknesses",
    desc: "Danh mục điểm yếu cốt lõi trong thiết kế phần mềm",
  },
  {
    code: "ISO/IEC 27001",
    org: "ISO / IEC",
    title: "ISMS Governance",
    desc: "Chuẩn quốc tế về hệ thống quản lý an toàn thông tin",
  },
]

// ============================================================================
// §01–§03 MÔ HÌNH ĐÀO TẠO 3 TẦNG HỌC THUẬT (BLOOM'S TAXONOMY)
// ============================================================================
const PEDAGOGY_PILLARS = [
  {
    section: "§01",
    bloom: "BLOOM: THÔNG HIỂU & PHÂN TÍCH HÌNH THỨC",
    title: "Lý thuyết Hình thức & Giao thức",
    summary:
      "Giải phẫu bản chất lỗ hổng từ tài liệu chuẩn gốc (RFC, CWE, kiến trúc bộ nhớ và cây cú pháp AST), giúp người học lý giải được nguyên nhân gốc rễ thay vì ghi nhớ công cụ rời rạc.",
    artifacts: [
      "Chuyên khảo giải phẫu giao thức & kiến trúc hệ thống",
      "Sơ đồ trạng thái tấn công – phòng thủ theo MITRE ATT&CK",
      "Câu hỏi thẩm định tư duy phản biện sau mỗi chương",
    ],
    icon: BookOpen,
  },
  {
    section: "§02",
    bloom: "BLOOM: VẬN DỤNG & KIỂM CHỨNG THỰC NGHIỆM",
    title: "Thực nghiệm Tương tác & Sandbox Cô lập",
    summary:
      "Chuyển hóa lý thuyết thành thao tác kỹ thuật trong các MicroVM và container cô lập mạng ngay trên trình duyệt. Quan sát đồng thời luồng khai thác và cơ chế vá lỗi chuẩn xác.",
    artifacts: [
      "Môi trường cô lập MicroVM khởi tạo trong dưới 3 giây",
      "Chuỗi bài lab gắn mã CWE, MITRE ID & dữ liệu PCAP thực",
      "Hướng dẫn khắc phục (Remediation) ở cấp mã nguồn",
    ],
    icon: Terminal,
  },
  {
    section: "§03",
    bloom: "BLOOM: ĐÁNH GIÁ & BẢO VỆ HỆ THỐNG",
    title: "Bảo vệ Đồ án Capstone & Chứng chỉ SHA-256/PGP",
    summary:
      "Tổng hợp năng lực qua đồ án cuối lộ trình được chấm điểm theo bảng tiêu chí NIST NICE Rubric. Chứng chỉ hoàn thành được băm SHA-256 và ký PGP để tra cứu công khai.",
    artifacts: [
      "Báo cáo kỹ thuật Capstone đánh giá 4 trụ cột NIST Rubric",
      "Mã định danh chứng chỉ duy nhất tra cứu tại cổng /verify",
      "Chữ ký mật mã PGP chứng thực toàn vẹn hồ sơ năng lực",
    ],
    icon: FileCheck,
  },
]

// ============================================================================
// TUYỂN TẬP PHÒNG THÍ NGHIỆM THỰC NGHIỆM
// ============================================================================
const LAB_DOMAINS = [
  { key: "all", label: "Tất cả" },
  { key: "web", label: "Web" },
  { key: "soc", label: "SOC" },
  { key: "cloud", label: "Cloud" },
  { key: "crypto", label: "Mật mã" },
]

const SHOWCASE_LABS = [
  {
    id: "SPEC-01",
    category: "web",
    domainLabel: "Web Security",
    mitre: "T1190",
    cwe: "CWE-89",
    title: "Khai thác SQL Injection & Cô lập cây cú pháp bằng PreparedStatement",
    difficulty: "Cơ bản",
    durationMins: 30,
    desc: "Phân tích ranh giới phân tách token giữa dữ liệu người dùng và cấu trúc lệnh SQL, triển khai tham số hóa truy vấn an toàn trên tầng driver.",
  },
  {
    id: "SPEC-02",
    category: "web",
    domainLabel: "Web Security",
    mitre: "T1552",
    cwe: "CWE-347",
    title: "Phân tích điểm yếu JWT HS256 & Chuyển đổi chữ ký bất đối xứng RS256",
    difficulty: "Trung bình",
    durationMins: 45,
    desc: "Đánh giá rủi ro khóa đối xứng có entropy thấp và thiết lập xác thực token bằng cặp khóa bất đối xứng Ed25519 / RS256.",
  },
  {
    id: "SPEC-03",
    category: "soc",
    domainLabel: "SOC & Pháp chứng",
    mitre: "T1071",
    cwe: "PCAP / IDS",
    title: "Điều tra lưu lượng C2 Beaconing từ PCAP & Viết luật Suricata IDS",
    difficulty: "Trung bình",
    durationMins: 40,
    desc: "Trích xuất chu kỳ truyền tin bất thường trên tầng TLS/HTTP2 và xây dựng tập luật phát hiện tự động chuẩn Suricata 7.0.",
  },
  {
    id: "SPEC-04",
    category: "cloud",
    domainLabel: "Cloud Security",
    mitre: "T1078",
    cwe: "CWE-918",
    title: "Khai thác SSRF tới Metadata Cloud & Áp dụng chính sách IMDSv2",
    difficulty: "Nâng cao",
    durationMins: 55,
    desc: "Kiểm chứng luồng truy cập địa chỉ link-local 169.254.169.254 và cấu hình xác thực token phiên bắt buộc với hop-limit = 1.",
  },
  {
    id: "SPEC-05",
    category: "soc",
    domainLabel: "SOC & Pháp chứng",
    mitre: "T1055",
    cwe: "Volatility 3",
    title: "Pháp chứng bộ nhớ RAM: Truy vết kỹ thuật Process Injection",
    difficulty: "Nâng cao",
    durationMins: 60,
    desc: "Bóc tách vùng nhớ bất thường (Unlinked VAD) trong tiến trình hệ thống bằng Volatility 3 và phục hồi dấu vết thực thi.",
  },
  {
    id: "SPEC-06",
    category: "crypto",
    domainLabel: "Mật mã học",
    mitre: "T1557",
    cwe: "CWE-327",
    title: "Tấn công Padding Oracle trên AES-CBC & Chuyển sang AEAD AES-GCM",
    difficulty: "Nâng cao",
    durationMins: 45,
    desc: "Mô phỏng khai thác thông điệp lỗi giải mã PKCS#7 để khôi phục bản rõ và triển khai mã hóa xác thực toàn vẹn AES-256-GCM.",
  },
]

// ============================================================================
// WORKBENCH TAB 1 DATA & TOKENIZER (CWE-89 AST ISOLATION)
// ============================================================================
const SQLI_PRESETS = [
  { label: "' OR 1=1 --", value: "' OR 1=1 --" },
  { label: "' UNION SELECT NULL--", value: "' UNION SELECT NULL--" },
  { label: "admin'/*", value: "admin'/*" },
  { label: "nguyen.an", value: "nguyen.an" },
]

function analyzeSqlAst(input) {
  const source = (input || "").trim()
  if (!source) {
    return {
      isInjection: false,
      tokens: [{ text: "<empty>", type: "EMPTY_INPUT", danger: false }],
      rawQueryAst: "LiteralNode(\"\")",
    }
  }

  const tokenSpecs = [
    { regex: /^--/, type: "SQL_LINE_COMMENT", danger: true },
    { regex: /^\/\*/, type: "SQL_BLOCK_COMMENT", danger: true },
    { regex: /^\*\//, type: "SQL_COMMENT_END", danger: true },
    { regex: /^['"]/, type: "STRING_DELIMITER", danger: true },
    { regex: /^;/, type: "STMT_TERMINATOR", danger: true },
    { regex: /^=/, type: "COMPARISON_OP", danger: true },
    { regex: /^\s+/, type: "WS", danger: false },
    { regex: /^[a-zA-Z_][a-zA-Z0-9_.]*/, type: "WORD", danger: false },
    { regex: /^[0-9]+/, type: "NUMERIC_LITERAL", danger: false },
    { regex: /^./, type: "SYMBOL", danger: false },
  ]

  const sqlKeywords = new Set([
    "OR",
    "AND",
    "UNION",
    "SELECT",
    "FROM",
    "WHERE",
    "DROP",
    "DELETE",
    "INSERT",
    "UPDATE",
    "NULL",
    "SLEEP",
  ])

  const tokens = []
  let rest = source
  while (rest.length > 0) {
    let matched = false
    for (const spec of tokenSpecs) {
      const m = rest.match(spec.regex)
      if (m) {
        const text = m[0]
        if (spec.type !== "WS") {
          if (spec.type === "WORD") {
            const upper = text.toUpperCase()
            if (sqlKeywords.has(upper)) {
              tokens.push({
                text,
                type: upper === "NULL" ? "NULL_LITERAL" : "SQL_KEYWORD",
                danger: true,
              })
            } else {
              tokens.push({ text, type: "IDENTIFIER", danger: false })
            }
          } else {
            tokens.push({ text, type: spec.type, danger: spec.danger })
          }
        }
        rest = rest.slice(text.length)
        matched = true
        break
      }
    }
    if (!matched) break
  }

  const hasQuoteBreak = tokens.some((t) => t.type === "STRING_DELIMITER")
  const hasSqlMeta = tokens.some((t) => t.danger)
  const isInjection = hasQuoteBreak || (hasSqlMeta && tokens.length > 1)

  return {
    isInjection,
    tokens,
    rawQueryAst: isInjection
      ? `WhereClause(BinaryExpr(Eq(col:user, "..."), InjectedBranch(${tokens
          .filter((t) => t.danger)
          .map((t) => t.text)
          .slice(0, 4)
          .join(" ")})))`
      : `WhereClause(Eq(col:user, LiteralString("${source}")))`,
  }
}

// ============================================================================
// WORKBENCH TAB 2 DATA (TLS 1.3 HANDSHAKE — RFC 8446)
// ============================================================================
const TLS_HANDSHAKE_STEPS = [
  {
    step: "01",
    title: "ClientHello + X25519",
    direction: "Client → Server",
    rtt: "Khởi tạo 1-RTT",
    wire: "supported_versions: TLS 1.3 (0x0304) | key_share: X25519(pk_c) | cipher: TLS_AES_256_GCM_SHA384",
    summary:
      "Máy khách gửi danh sách cipher suite hiện đại (loại bỏ hoàn toàn khóa tĩnh RSA) kèm khóa công khai ECDHE tạm thời ngay trong thông điệp đầu tiên.",
    pfsNote:
      "Khóa công khai pk_c được tạo mới ngẫu nhiên cho riêng phiên kết nối này và sẽ bị hủy khỏi RAM sau khi phiên kết thúc.",
  },
  {
    step: "02",
    title: "ServerHello + CertificateVerify",
    direction: "Server → Client",
    rtt: "1-RTT Response",
    wire: "key_share: X25519(pk_s) | {Certificate: X.509} | {CertificateVerify: Ed25519/RSA-PSS} | {Finished}",
    summary:
      "Máy chủ gửi khóa công khai tạm thời pk_s, đồng thời mã hóa chứng chỉ và chữ ký CertificateVerify xác thực toàn bộ dữ liệu bắt tay (transcript hash).",
    pfsNote:
      "Khóa riêng của chứng chỉ máy chủ chỉ dùng để ký xác thực danh tính — không tham gia vào việc mã hóa hoặc trao đổi khóa phiên.",
  },
  {
    step: "03",
    title: "HKDF Key Schedule",
    direction: "Client ↔ Server (Nội bộ)",
    rtt: "Dẫn xuất khóa",
    wire: "shared = X25519(sk_c, pk_s) → HKDF-Extract(0, shared) → HKDF-Expand-Label(\"c ap traffic\")",
    summary:
      "Cả hai phía tính toán độc lập bí mật chung ECDHE và dẫn xuất cây khóa phân tầng qua HKDF-SHA384 để tách bạch khóa bắt tay và khóa lưu lượng.",
    pfsNote:
      "Perfect Forward Secrecy (PFS): Ngay cả khi khóa riêng dài hạn của máy chủ bị lộ về sau, kẻ nghe lén vẫn không thể giải mã dữ liệu lưu lượng quá khứ.",
  },
  {
    step: "04",
    title: "AEAD Encrypted Channel",
    direction: "Client ⇄ Server",
    rtt: "Truyền tải bảo mật",
    wire: "AEAD_AES_256_GCM(K_app, nonce = IV ⊕ seq_num, AAD = RecordHeader, Plaintext)",
    summary:
      "Kênh ứng dụng vận hành ở chế độ AEAD, đảm bảo đồng thời tính bí mật, toàn vẹn dữ liệu và chống tấn công phát lại bằng bộ đếm tuần tự.",
    pfsNote:
      "Giao thức hỗ trợ thông điệp KeyUpdate giúp xoay vòng khóa phiên định kỳ trong các kết nối dài hạn mà không phải bắt tay lại.",
  },
]

// ============================================================================
// WORKBENCH TAB 3 DATA (STACK MEMORY FRAME SIMULATION)
// ============================================================================
const STACK_SLOTS = [
  {
    name: "Buffer [char buf[16]]",
    addr: "0x7fff..a0",
    safeVal: "\"cyberpath_ok\\0\"",
    overflowVal: "\"AAAAAAAAAAAAAAAA\"",
    role: "Vùng nhớ chứa dữ liệu nhập (16 bytes)",
  },
  {
    name: "Alignment Padding",
    addr: "0x7fff..b0",
    safeVal: "0x0000000000000000",
    overflowVal: "0x4141414141414141",
    role: "Vùng đệm căn chỉnh 8-byte trên kiến trúc x86_64",
  },
  {
    name: "Stack Canary",
    addr: "0x7fff..b8",
    safeVal: "0xdeadbeef00",
    overflowVal: "0x4141414141",
    role: "Giá trị bảo vệ phát hiện ghi đè trước khi hàm trả về",
  },
  {
    name: "Saved RBP",
    addr: "0x7fff..c0",
    safeVal: "0x7fffffffe100",
    overflowVal: "0x4141414141414141",
    role: "Con trỏ khung ngăn xếp của hàm gọi trước",
  },
  {
    name: "Return Address (RIP)",
    addr: "0x7fff..c8",
    safeVal: "0x004012a4 <main+36>",
    overflowVal: "0x4141414141414141",
    role: "Địa chỉ lệnh kế tiếp khi hàm kết thúc thực thi",
  },
]

const SAMPLE_CERT_CODES = [
  "CP-2026-WEB-8F4C3E19",
  "CP-2026-SOC-4A91D20B",
]

export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Đồng bộ số lượng phòng Lab thực tế từ API (fallback 37 giống /pricing)
  const [realLabCount, setRealLabCount] = useState(null)

  useEffect(() => {
    let isMounted = true
    if (typeof challengeService?.getAllChallenges === "function") {
      challengeService
        .getAllChallenges()
        .then((challenges) => {
          if (!isMounted) return
          if (Array.isArray(challenges)) {
            setRealLabCount(challenges.length)
          } else if (Array.isArray(challenges?.content)) {
            setRealLabCount(challenges.content.length)
          }
        })
        .catch(() => {
          // Fallback về 37 khi API chưa khả dụng
        })
    }
    return () => {
      isMounted = false
    }
  }, [])

  const displayLabCount = realLabCount ?? 37

  // Hero Interactive Workbench Tabs: 'ast' | 'tls' | 'stack'
  const [workbenchTab, setWorkbenchTab] = useState("ast")

  // Tab 1: AST SQLi Inspector State
  const [sqlInput, setSqlInput] = useState("' OR 1=1 --")
  const astAnalysis = useMemo(() => analyzeSqlAst(sqlInput), [sqlInput])

  // Tab 2: TLS 1.3 Stepper State
  const [tlsStepIndex, setTlsStepIndex] = useState(0)
  const activeTlsStep = TLS_HANDSHAKE_STEPS[tlsStepIndex]

  // Tab 3: Stack Frame Mitigation State
  const [stackMitigated, setStackMitigated] = useState(false)
  const [stackOverflowPayload, setStackOverflowPayload] = useState(true)
  const isCorrupted = stackOverflowPayload && !stackMitigated

  // Section 4: Specimen Labs Filter State
  const [labCategory, setLabCategory] = useState("all")
  const [labSearch, setLabSearch] = useState("")

  const filteredLabs = useMemo(() => {
    const q = labSearch.trim().toLowerCase()
    return SHOWCASE_LABS.filter((lab) => {
      const matchesCat = labCategory === "all" || lab.category === labCategory
      const matchesQuery =
        !q ||
        lab.title.toLowerCase().includes(q) ||
        lab.desc.toLowerCase().includes(q) ||
        lab.mitre.toLowerCase().includes(q) ||
        lab.cwe.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [labCategory, labSearch])

  // Section 5: Quick Certificate Verification State
  const [certCode, setCertCode] = useState("")

  const handleVerifySubmit = (e) => {
    e.preventDefault()
    const trimmed = certCode.trim()
    if (trimmed) {
      navigate(`/verify/${encodeURIComponent(trimmed)}`)
    } else {
      navigate("/verify")
    }
  }

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200">
      {/* ====================================================================
          SECTION 1: ASYMMETRIC MONOGRAPH HERO
         ==================================================================== */}
      <section className="pt-14 sm:pt-20 lg:pt-24 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            {/* LEFT COLUMN: Monograph Typography & Abstract */}
            <div className="lg:col-span-5 space-y-7 pt-2">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#475569] dark:text-[#94A3B8]">
                <BookOpen className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.6} />
                <span>CHUYÊN KHẢO AN NINH MẠNG // CYBERPATH PRESS</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-[-0.02em] leading-[1.12] text-[#0F172A] dark:text-[#F1F5F9]">
                Nghiên cứu bản chất lỗ hổng và{" "}
                <em className="italic font-normal text-[#1D4ED8] dark:text-[#38BDF8]">
                  nghệ thuật phòng thủ hệ thống
                </em>
                .
              </h1>

              <p className="font-sans text-base sm:text-[17px] leading-[1.7] text-[#475569] dark:text-[#94A3B8]">
                CyberPath kết hợp lý thuyết hình thức từ các đặc tả gốc (RFC, MITRE ATT&amp;CK, CWE), thao trường đám mây cô lập trên trình duyệt và quy trình thẩm định đồ án Capstone chuẩn NIST Rubric — giúp kỹ sư hiểu sâu cơ chế thay vì lệ thuộc công cụ.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <Link
                  to="/learning"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-sm whitespace-nowrap shrink-0 shadow-xs transition-colors active:scale-[0.99]"
                >
                  <span>Khám Phá Giáo Trình</span>
                  <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                </Link>

                <Link
                  to="/workbench"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-[#121722] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#D0CCC3] dark:hover:border-white/[0.16] font-sans font-semibold text-sm whitespace-nowrap shrink-0 transition-colors active:scale-[0.99]"
                >
                  <Terminal className="h-4 w-4 shrink-0 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.7} />
                  <span>Mở AI Workbench</span>
                </Link>
              </div>

              {isAuthenticated && (
                <div className="pt-0.5">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                  >
                    <span>→ Tiếp tục phiên học tập tại Bảng Điều Khiển</span>
                  </Link>
                </div>
              )}

              {/* Subtle Monospace KPI Strip */}
              <div className="pt-6 border-t border-[#E5E2DC] dark:border-white/[0.08] grid grid-cols-3 gap-4">
                <div>
                  <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                    ĐỐI CHIẾU CHUẨN
                  </div>
                  <div className="font-mono-tech text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                    OWASP · MITRE
                  </div>
                </div>
                <div>
                  <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                    SANDBOX CÔ LẬP
                  </div>
                  <div className="font-mono-tech text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                    <CountUp
                      key={displayLabCount}
                      start={displayLabCount}
                      end={displayLabCount}
                      suffix="+ Phòng Lab"
                      duration={250}
                    />
                  </div>
                </div>
                <div>
                  <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-400">
                    THẨM ĐỊNH
                  </div>
                  <div className="font-mono-tech text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                    NIST Rubric
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE ACADEMIC PREVIEW WORKBENCH */}
            <div className="lg:col-span-7">
              <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.09] shadow-[0_12px_36px_-12px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] overflow-hidden">
                {/* Workbench Chrome Header */}
                <div className="px-5 py-3.5 bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.6} />
                    <span className="font-mono-tech text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                      ATELIER WORKBENCH // MÔ PHỎNG TƯƠNG TÁC
                    </span>
                  </div>
                  <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]">
                    KHÔNG GIAN THỰC NGHIỆM
                  </span>
                </div>

                {/* 3 Specimen Tabs */}
                <div
                  role="tablist"
                  aria-label="Mô phỏng kỹ thuật tương tác"
                  className="px-4 sm:px-5 pt-3 bg-[#FAF9F6] dark:bg-[#0B0E14]/60 border-b border-[#E5E2DC] dark:border-white/[0.08] flex items-center gap-1 overflow-x-auto"
                >
                  {[
                    { id: "ast", label: "Phân Tích Cú Pháp AST (CWE-89)", icon: Code2 },
                    { id: "tls", label: "Bắt Tay TLS 1.3 (RFC 8446)", icon: Lock },
                    { id: "stack", label: "Mô Phỏng Bộ Nhớ Stack", icon: Layers },
                  ].map((tab) => {
                    const Icon = tab.icon
                    const isActive = workbenchTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setWorkbenchTab(tab.id)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-sans font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                          isActive
                            ? "border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8] bg-white dark:bg-[#121722] rounded-t-md"
                            : "border-transparent text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Tab Body */}
                <div className="p-5 sm:p-6 min-h-[380px]">
                  {/* --------------------------------------------------------
                      TAB 1: AST SQL INJECTION INSPECTOR (CWE-89)
                     -------------------------------------------------------- */}
                  {workbenchTab === "ast" && (
                    <div className="space-y-5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label
                            htmlFor="ast-payload-input"
                            className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] font-medium"
                          >
                            Đầu vào tham số <code className="text-[#1D4ED8] dark:text-[#38BDF8]">username</code>
                          </label>
                          <span
                            className={`inline-flex items-center gap-1.5 font-mono-tech text-[10px] font-semibold px-2.5 py-0.5 rounded border ${
                              astAnalysis.isInjection
                                ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30"
                                : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                            }`}
                          >
                            {astAnalysis.isInjection ? (
                              <>
                                <AlertTriangle className="h-3 w-3" />
                                <span>PHÁ VỠ CẤU TRÚC AST · CWE-89</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3" />
                                <span>GIÁ TRỊ THUẦN TÚY</span>
                              </>
                            )}
                          </span>
                        </div>

                        <input
                          id="ast-payload-input"
                          name="astPayload"
                          type="text"
                          value={sqlInput}
                          onChange={(e) => setSqlInput(e.target.value)}
                          placeholder="Nhập chuỗi kiểm thử SQLi..."
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] font-mono-tech text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9]"
                        />

                        {/* Preset Payloads */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono-tech text-[10px] text-[#64748B] dark:text-slate-300 mr-1">
                            Mẫu thử:
                          </span>
                          {SQLI_PRESETS.map((preset) => {
                            const selected = sqlInput === preset.value
                            return (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setSqlInput(preset.value)}
                                className={`font-mono-tech text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                                  selected
                                    ? "bg-[#1D4ED8]/10 dark:bg-[#3B82F6]/15 text-[#1D4ED8] dark:text-[#38BDF8] border-[#1D4ED8]/40 dark:border-[#3B82F6]/40 font-semibold"
                                    : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                                }`}
                              >
                                {preset.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Lexical Tokens */}
                      <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5">
                        <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                          1. Phân tách Từ vựng (Lexical Token Stream)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {astAnalysis.tokens.map((tok, idx) => (
                            <div
                              key={`${tok.type}-${idx}`}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono-tech text-[11px] ${
                                tok.danger
                                  ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200"
                                  : "bg-white dark:bg-[#121722] border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9]"
                              }`}
                            >
                              <span className="font-semibold">{tok.text}</span>
                              <span className="text-[9px] opacity-75">[{tok.type}]</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AST Isolation Comparison Diagram */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="p-3.5 rounded-lg border border-rose-200/80 dark:border-rose-500/25 bg-rose-50/40 dark:bg-rose-950/15 space-y-2">
                          <div className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                            Ghép chuỗi thô (Rủi ro AST)
                          </div>
                          <div className="font-mono-tech text-[11px] text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed break-all">
                            SELECT * FROM users WHERE user = &apos;{sqlInput}&apos;
                          </div>
                          <div className="font-mono-tech text-[10px] text-rose-700 dark:text-rose-300 pt-1.5 border-t border-rose-200/60 dark:border-rose-500/20">
                            AST: {astAnalysis.rawQueryAst}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg border border-emerald-200/80 dark:border-emerald-500/25 bg-emerald-50/40 dark:bg-emerald-950/15 space-y-2">
                          <div className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                            Tham số hóa (Cô lập AST An Toàn)
                          </div>
                          <div className="font-mono-tech text-[11px] text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed">
                            stmt = conn.prepareStatement(&quot;... WHERE user = ?&quot;)
                            <br />
                            stmt.setString(1, input)
                          </div>
                          <div className="font-mono-tech text-[10px] text-emerald-700 dark:text-emerald-300 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-500/20">
                            AST: PlaceholderBind(?1) → LiteralLeaf(&quot;{sqlInput || ""}&quot;)
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      TAB 2: TLS 1.3 HANDSHAKE STEPPER (RFC 8446)
                     -------------------------------------------------------- */}
                  {workbenchTab === "tls" && (
                    <div className="space-y-5">
                      {/* 4-Step Selector */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TLS_HANDSHAKE_STEPS.map((item, idx) => {
                          const active = idx === tlsStepIndex
                          return (
                            <button
                              key={item.step}
                              type="button"
                              onClick={() => setTlsStepIndex(idx)}
                              className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                                active
                                  ? "bg-[#1D4ED8]/8 dark:bg-[#3B82F6]/15 border-[#1D4ED8] dark:border-[#3B82F6] text-[#0F172A] dark:text-[#F1F5F9]"
                                  : "bg-[#FAF9F6] dark:bg-[#0B0E14] border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8] hover:border-[#D0CCC3] dark:hover:border-white/[0.16]"
                              }`}
                            >
                              <div className="font-mono-tech text-[10px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                                BƯỚC {item.step}
                              </div>
                              <div className="font-sans text-xs font-semibold mt-0.5 leading-snug">
                                {item.title}
                              </div>
                            </button>
                          )
                        })}
                      </div>

                      {/* Active Step Protocol Inspection */}
                      <div className="p-4 sm:p-5 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono-tech text-xs font-semibold px-2 py-0.5 rounded bg-[#1D4ED8] dark:bg-[#3B82F6] text-white">
                              {activeTlsStep.direction}
                            </span>
                            <span className="font-sans text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                              {activeTlsStep.title}
                            </span>
                          </div>
                          <span className="font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8]">
                            {activeTlsStep.rtt}
                          </span>
                        </div>

                        <div className="p-3 rounded bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8] leading-relaxed break-words">
                          {activeTlsStep.wire}
                        </div>

                        <p className="font-sans text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                          {activeTlsStep.summary}
                        </p>

                        <div className="p-3.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-start gap-2.5">
                          <ShieldCheck
                            className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5"
                            strokeWidth={1.7}
                          />
                          <div className="text-xs leading-relaxed">
                            <span className="font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                              Thuộc tính Forward Secrecy (PFS):{" "}
                            </span>
                            <span className="text-[#475569] dark:text-[#94A3B8]">
                              {activeTlsStep.pfsNote}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper Controls */}
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setTlsStepIndex((prev) => Math.max(0, prev - 1))}
                          disabled={tlsStepIndex === 0}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-sans font-medium text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                          <span>Bước trước</span>
                        </button>

                        <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                          Giai đoạn {tlsStepIndex + 1} / {TLS_HANDSHAKE_STEPS.length} (RFC 8446 §2)
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setTlsStepIndex((prev) =>
                              Math.min(TLS_HANDSHAKE_STEPS.length - 1, prev + 1)
                            )
                          }
                          disabled={tlsStepIndex === TLS_HANDSHAKE_STEPS.length - 1}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1D4ED8] dark:bg-[#3B82F6] text-white text-xs font-sans font-medium hover:bg-[#1E40AF] dark:hover:bg-[#2563EB] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          <span>Bước kế tiếp</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --------------------------------------------------------
                      TAB 3: STACK MEMORY FRAME SIMULATOR
                     -------------------------------------------------------- */}
                  {workbenchTab === "stack" && (
                    <div className="space-y-4">
                      {/* Controls */}
                      <div className="flex flex-col gap-2.5 pb-3 border-b border-[#E5E2DC] dark:border-white/[0.08]">
                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-slate-300 shrink-0 whitespace-nowrap">
                              Kích thước đầu vào:
                            </span>
                            <button
                              type="button"
                              onClick={() => setStackOverflowPayload(false)}
                              className={`px-2.5 py-1 rounded font-mono-tech text-[11px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                                !stackOverflowPayload
                                  ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-transparent"
                                  : "bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#475569] dark:text-slate-300 border-[#E5E2DC] dark:border-white/[0.08]"
                              }`}
                            >
                              12 bytes
                            </button>
                            <button
                              type="button"
                              onClick={() => setStackOverflowPayload(true)}
                              className={`px-2.5 py-1 rounded font-mono-tech text-[11px] border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                                stackOverflowPayload
                                  ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-transparent"
                                  : "bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#475569] dark:text-slate-300 border-[#E5E2DC] dark:border-white/[0.08]"
                              }`}
                            >
                              32 bytes (Tràn biên)
                            </button>
                          </div>

                          {/* Toggle Checked vs Unchecked Mitigation */}
                          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] shrink-0">
                            <button
                              type="button"
                              onClick={() => setStackMitigated(false)}
                              className={`px-2.5 py-1 rounded-md font-mono-tech text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                                !stackMitigated
                                  ? "bg-white dark:bg-[#121722] text-rose-700 dark:text-rose-300 font-semibold shadow-2xs"
                                  : "text-[#475569] dark:text-slate-300"
                              }`}
                            >
                              strcpy (Không kiểm tra)
                            </button>
                            <button
                              type="button"
                              onClick={() => setStackMitigated(true)}
                              className={`px-2.5 py-1 rounded-md font-mono-tech text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                                stackMitigated
                                  ? "bg-white dark:bg-[#121722] text-emerald-700 dark:text-emerald-300 font-semibold shadow-2xs"
                                  : "text-[#475569] dark:text-slate-300"
                              }`}
                            >
                              strncpy + Bounds Check
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 5-Slot Stack Frame Diagram */}
                      <div className="space-y-1.5">
                        {STACK_SLOTS.map((slot, idx) => {
                          const slotAffected = isCorrupted && idx >= 1
                          const isCritical = isCorrupted && (idx === 2 || idx === 4)
                          return (
                            <div
                              key={slot.addr}
                              className={`px-3.5 py-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors ${
                                isCritical
                                  ? "bg-rose-50/70 dark:bg-rose-950/25 border-rose-300 dark:border-rose-500/40"
                                  : slotAffected
                                  ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/35"
                                  : "bg-[#FAF9F6] dark:bg-[#0B0E14] border-[#E5E2DC] dark:border-white/[0.08]"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-slate-300 shrink-0">
                                  [{slot.addr}]
                                </span>
                                <div className="min-w-0">
                                  <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                                    {slot.name}
                                  </div>
                                  <div className="font-sans text-[11px] text-[#64748B] dark:text-slate-400 truncate">
                                    {slot.role}
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`font-mono-tech text-[11px] font-semibold shrink-0 px-2 py-0.5 rounded ${
                                  slotAffected
                                    ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200"
                                    : "bg-white dark:bg-[#121722] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]"
                                }`}
                              >
                                {slotAffected ? slot.overflowVal : slot.safeVal}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {/* Diagnostic Outcome */}
                      <div
                        className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                          isCorrupted
                            ? "bg-rose-50 dark:bg-rose-950/25 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200"
                            : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                        }`}
                      >
                        {isCorrupted ? (
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                        )}
                        <div>
                          {isCorrupted ? (
                            <span>
                              <strong>Tràn bộ đệm (CWE-121):</strong> 32 byte đầu vào vượt giới hạn{" "}
                              <code className="font-mono-tech">buf[16]</code>, ghi đè{" "}
                              <code className="font-mono-tech">Stack Canary (0xdeadbeef00)</code> và
                              địa chỉ trả về <code className="font-mono-tech">RIP</code>. Tiến trình
                              bị hủy bởi <code className="font-mono-tech">__stack_chk_fail()</code>{" "}
                              hoặc bị chiếm luồng thực thi.
                            </span>
                          ) : stackMitigated ? (
                            <span>
                              <strong>Biện pháp giảm thiểu hoạt động:</strong>{" "}
                              <code className="font-mono-tech">strncpy(buf, input, sizeof(buf) - 1)</code>{" "}
                              giữ dữ liệu trong biên an toàn.{" "}
                              <code className="font-mono-tech">Stack Canary</code> nguyên vẹn và{" "}
                              <code className="font-mono-tech">RIP</code> trở về đúng{" "}
                              <code className="font-mono-tech">&lt;main+36&gt;</code>.
                            </span>
                          ) : (
                            <span>
                              <strong>Trạng thái an toàn (12/16 bytes):</strong> Dữ liệu nằm gọn
                              trong vùng đệm đã cấp phát, các thanh ghi khung ngăn xếp không bị ảnh hưởng.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Workbench Footer */}
                <div className="px-5 py-3 bg-[#F3F1EC] dark:bg-[#161C2A] border-t border-[#E5E2DC] dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8]">
                    Môi trường mô phỏng tại trình duyệt · Thực chiến toàn phần trên MicroVM
                  </span>
                  <Link
                    to="/labs"
                    className="inline-flex items-center gap-1 font-sans font-semibold text-xs text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                  >
                    <span>Mở toàn bộ Phòng Thí Nghiệm</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: ACADEMIC STANDARDS & PRIMARY CITATIONS BAND
         ==================================================================== */}
      <section className="py-12 sm:py-14 border-y border-[#E5E2DC] dark:border-white/[0.08] bg-[#F3F1EC]/75 dark:bg-[#161C2A]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#475569] dark:text-[#94A3B8]">
              §00 // TÀI LIỆU THAM CHIẾU &amp; CHUẨN MỰC ĐỐI CHIẾU GỐC
            </span>
            <span className="font-sans text-xs text-[#64748B] dark:text-[#94A3B8]">
              Mọi giáo trình và bài lab đều trích dẫn trực tiếp chuẩn quốc tế hiện hành
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {ACADEMIC_STANDARDS.map((std) => (
              <div
                key={std.code}
                className="p-4 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tech text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                    {std.code}
                  </span>
                </div>
                <div>
                  <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    {std.title}
                  </div>
                  <p className="font-sans text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-snug">
                    {std.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: MÔ HÌNH ĐÀO TẠO 3 TẦNG HỌC THUẬT (BLOOM'S TAXONOMY)
         ==================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7 space-y-3">
              <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
                §01 — §03 // PHƯƠNG PHÁP LUẬN ĐÀO TẠO
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.6rem] font-medium tracking-[-0.015em] leading-[1.15] text-[#0F172A] dark:text-[#F1F5F9]">
                Mô hình đào tạo 3 tầng học thuật theo thang nhận thức Bloom
              </h2>
            </div>
            <div className="lg:col-span-5">
              <blockquote className="font-serif-editorial italic text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] border-l-2 border-[#1D4ED8] dark:border-[#3B82F6] pl-4 leading-relaxed">
                &ldquo;Hiểu thấu cơ chế truyền dẫn và bộ nhớ trước khi chạm vào dòng lệnh khai thác — phòng thủ bền vững bắt nguồn từ tư duy hệ thống.&rdquo;
              </blockquote>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PEDAGOGY_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <article
                  key={pillar.section}
                  className="p-7 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#EFEDE7] dark:border-white/[0.06] pb-4">
                      <span className="font-mono-tech text-sm font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                        {pillar.section}
                      </span>
                      <div className="h-9 w-9 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-center text-[#0F172A] dark:text-[#F1F5F9]">
                        <Icon className="h-4 w-4" strokeWidth={1.6} />
                      </div>
                    </div>

                    <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                      {pillar.bloom}
                    </div>

                    <h3 className="font-serif-editorial text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="font-sans text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {pillar.summary}
                    </p>
                  </div>

                  <ul className="pt-4 border-t border-[#EFEDE7] dark:border-white/[0.06] space-y-2.5">
                    {pillar.artifacts.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 font-sans text-xs sm:text-[13px] text-[#0F172A] dark:text-[#F1F5F9]"
                      >
                        <Check
                          className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0 mt-0.5"
                          strokeWidth={2}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: TUYỂN TẬP PHÒNG THÍ NGHIỆM THỰC NGHIỆM
         ==================================================================== */}
      <section className="py-20 sm:py-28 border-t border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
                §04 // TUYỂN TẬP MẪU THÍ NGHIỆM
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-[-0.015em] text-[#0F172A] dark:text-[#F1F5F9]">
                Tuyển tập phòng thí nghiệm thực nghiệm
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Mỗi bài thực nghiệm tập trung vào một cơ chế kỹ thuật rõ ràng, đối chiếu trực tiếp mã MITRE ATT&amp;CK và hướng dẫn khắc phục đạt chuẩn kiểm định.
              </p>
            </div>

            {/* Domain Filter & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="relative">
                <Search className="h-4 w-4 text-[#64748B] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="lab-search-input"
                  name="labSearch"
                  type="text"
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  placeholder="Tìm mã MITRE, CWE, chủ đề..."
                  aria-label="Tìm kiếm phòng thí nghiệm"
                  className="w-full sm:w-56 md:w-64 lg:w-72 pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] text-xs font-sans text-[#0F172A] dark:text-[#F1F5F9]"
                />
              </div>

              <div className="inline-flex flex-nowrap items-center gap-1 p-1 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] shrink-0 overflow-x-auto max-w-full">
                {LAB_DOMAINS.map((domain) => {
                  const active = labCategory === domain.key
                  return (
                    <button
                      key={domain.key}
                      type="button"
                      onClick={() => setLabCategory(domain.key)}
                      className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-sans font-medium transition-colors cursor-pointer ${
                        active
                          ? "bg-white dark:bg-[#121722] text-[#1D4ED8] dark:text-[#38BDF8] font-semibold shadow-2xs"
                          : "text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                      }`}
                    >
                      {domain.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Specimen Cards Grid */}
          {filteredLabs.length === 0 ? (
            <div className="p-12 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-center space-y-3">
              <FlaskConical className="h-6 w-6 text-[#64748B] dark:text-slate-400 mx-auto" strokeWidth={1.5} />
              <p className="font-sans text-sm text-[#475569] dark:text-[#94A3B8]">
                Không tìm thấy bài thí nghiệm phù hợp với từ khóa hiện tại.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLabCategory("all")
                  setLabSearch("")
                }}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map((lab) => (
                <article
                  key={lab.id}
                  className="p-6 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8]/50 dark:hover:border-[#3B82F6]/50 transition-colors flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EFEDE7] dark:border-white/[0.06]">
                      <div className="flex items-center gap-2 font-mono-tech text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] font-semibold">
                          MITRE {lab.mitre}
                        </span>
                        <span className="text-[#475569] dark:text-slate-300">{lab.cwe}</span>
                      </div>
                      <span className="font-mono-tech text-[11px] font-medium text-[#475569] dark:text-slate-300">
                        {lab.id}
                      </span>
                    </div>

                    <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-slate-300">
                      {lab.domainLabel}
                    </div>

                    <h3 className="font-sans text-base font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                      {lab.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed">
                      {lab.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="font-mono-tech text-[11px] text-[#475569] dark:text-slate-300">
                      <span>{lab.durationMins} phút</span>
                      <span className="mx-1.5">&middot;</span>
                      <span>{lab.difficulty}</span>
                    </div>

                    <Link
                      to="/labs"
                      className="inline-flex items-center gap-1 font-sans font-semibold text-xs text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
                    >
                      <span>Thực hành</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: THANH TRA CỨU & XÁC THỰC CHỨNG CHỈ NHANH
         ==================================================================== */}
      <section className="py-16 sm:py-24 bg-[#F3F1EC]/70 dark:bg-[#161C2A]/45 border-y border-[#E5E2DC] dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-7 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
                <Shield className="h-3.5 w-3.5" strokeWidth={1.7} />
                <span>§05 // CỔNG XÁC THỰC CHỨNG CHỈ HỌC THUẬT</span>
              </div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-medium tracking-[-0.015em] text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                Tra cứu &amp; xác thực chứng chỉ kỹ năng số
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Nhà tuyển dụng và đơn vị đào tạo có thể kiểm tra trực tiếp tính hợp lệ của chứng chỉ hoàn thành đồ án Capstone thông qua mã định danh và dấu vân tay băm SHA-256 / PGP.
              </p>

              {/* Sample Preview Card */}
              <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    MẪU HỒ SƠ ĐÃ KÝ XÁC THỰC
                  </div>
                  <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate mt-0.5">
                    Chuyên đề Bảo mật Ứng dụng Web &amp; Phòng thủ AST
                  </div>
                  <div className="font-mono-tech text-[10px] text-[#1D4ED8] dark:text-[#38BDF8] mt-1 truncate">
                    SHA-256: 8f4c92a1...3e19 &middot; NIST NICE SP 800-181
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <form onSubmit={handleVerifySubmit} className="space-y-3">
                <label
                  htmlFor="quick-cert-verify-input"
                  className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                >
                  Mã định danh chứng chỉ (Certificate Code)
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    id="quick-cert-verify-input"
                    name="certificateCode"
                    type="text"
                    value={certCode}
                    onChange={(e) => setCertCode(e.target.value)}
                    placeholder="VD: CP-2026-WEB-8F4C3E19"
                    className="flex-1 px-4 py-3 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] font-mono-tech text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-sm cursor-pointer transition-colors shrink-0"
                  >
                    <span>Xác Thực</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="font-sans text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Mã mẫu kiểm thử:
                </span>
                {SAMPLE_CERT_CODES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setCertCode(sample)}
                    className="font-mono-tech text-[11px] px-2.5 py-1 rounded bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] cursor-pointer transition-colors"
                  >
                    {sample}
                  </button>
                ))}
                <Link
                  to="/verify"
                  className="font-sans text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline ml-auto"
                >
                  Mở trang tra cứu đầy đủ →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: HARMONIZED CLOSING BANNER
         ==================================================================== */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-10 sm:p-14 lg:p-16 text-center">
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
                §06 // BẮT ĐẦU NGHIÊN CỨU
              </div>

              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-[-0.015em] leading-[1.15] text-[#0F172A] dark:text-[#F1F5F9]">
                Sẵn sàng tiếp cận an ninh mạng từ nền tảng bản chất?
              </h2>

              <p className="font-sans text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Khởi tạo tài khoản miễn phí để truy cập giáo trình học thuật chuẩn RFC/MITRE và thực nghiệm trực tiếp trên các phòng Sandbox cô lập.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-sm transition-colors"
                >
                  <span>
                    {isAuthenticated ? "Vào Bảng Điều Khiển Học Tập" : "Đăng Ký Tài Khoản Miễn Phí"}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/pricing"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] hover:bg-[#F3F1EC] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.08] font-sans font-semibold text-sm transition-colors"
                >
                  <span>Xem Học Phí &amp; Gói Tổ Chức</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
