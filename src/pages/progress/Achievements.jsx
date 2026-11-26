import { useState, useEffect, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Award,
  CheckCircle2,
  Lock,
  ExternalLink,
  FileCheck,
  Check,
  Copy,
  RefreshCw,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  FileKey2,
  Hash,
  Calendar,
  UserCheck,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { Card, Button, CountUp } from "../../components/common"
import certificationService from "../../services/certificationService"
import useLearningStore from "../../stores/useLearningStore"
import useLabStore from "../../stores/useLabStore"

const OFFLINE_SAMPLE_CERTIFICATES = [
  {
    id: "sample-cert-01",
    certificateCode: "CP-2026-WEB-8F4C3E19",
    courseTitle: "Chuyên đề Bảo mật Ứng dụng Web & Phòng thủ AST (OWASP ASVS v4.0)",
    recipientName: "Nghiên cứu viên CyberPath (Mẫu)",
    issueDate: "2026-10-18T14:30:00",
    sha256Hash: "8f4c92a1b7e04d31c9a5e6f8120934bc7d5a8e1120c4f9b3a6d108e29f4a3e19",
    pgpSignature: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

Certificate Serial: CP-2026-WEB-8F4C3E19
Specialization: Bảo mật Ứng dụng Web & Phòng thủ AST (OWASP ASVS v4.0)
Integrity Hash: 8f4c92a1b7e04d31c9a5e6f8120934bc7d5a8e1120c4f9b3a6d108e29f4a3e19
Issuer: CyberPath Academic Security Registry (Offline Sample)
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4 (CyberPath-Academic-CA)

wsBzBAEBCAAGBQJkOGY4Q0FGQkFBQUJGUzRDOEJGRTJBMTE0MDk3Q0Q5MUQ4RTQ=
-----END PGP SIGNATURE-----`,
    revoked: false,
    accreditation: "Đối chiếu chuẩn OWASP ASVS v4.0 · CWE-89 / CWE-79 · NIST NICE",
    skills: ["Tham số hóa SQLi", "Kiểm toán DOM XSS", "Chính sách CSP", "Xác thực JWT"],
    isSample: true,
  },
  {
    id: "sample-cert-02",
    certificateCode: "CP-2026-SOC-4A91D20B",
    courseTitle: "Chuyên viên Giám sát SOC & Điều tra Sự cố MITRE ATT&CK",
    recipientName: "Nghiên cứu viên CyberPath (Mẫu)",
    issueDate: "2026-11-02T09:15:00",
    sha256Hash: "4a91d20b6c8841fa9302e571bc4928d0a1f73c68b2e5094dc813a7f26e9b4d0b",
    pgpSignature: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

Certificate Serial: CP-2026-SOC-4A91D20B
Specialization: Giám sát SOC & Điều tra Sự cố MITRE ATT&CK
Integrity Hash: 4a91d20b6c8841fa9302e571bc4928d0a1f73c68b2e5094dc813a7f26e9b4d0b
Issuer: CyberPath Academic Security Registry (Offline Sample)
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4 (CyberPath-Academic-CA)

wsBzBAEBCAAGBQJkNEE5RjRCQTEyODlDRjEwMkU4NDc1Q0I5QTMyMUY4MDJFMTA=
-----END PGP SIGNATURE-----`,
    revoked: false,
    accreditation: "Đối chiếu khung NIST NICE SP 800-181 · MITRE ATT&CK",
    skills: ["Tương quan SIEM", "Nhật ký Sysmon", "Quy tắc Suricata IDS", "Ứng cứu Sự cố"],
    isSample: true,
  },
]

const BASELINE_COMPETENCY_BADGES = [
  {
    id: "b1",
    title: "Kiểm toán & Vá lỗ hổng Injection Web",
    domainKey: "web",
    standard: "CWE-89 · CWE-79 · OWASP A03",
    tier: "Bậc 2",
    baselineUnlocked: true,
    baselineProgress: 100,
    earnedDate: "04/10/2026",
    description:
      "Hoàn thành khai thác có kiểm soát và chuẩn hóa mã vá bằng Prepared Statements / DOM isolation trên 10 ứng dụng thử nghiệm.",
    xp: "+500 XP",
  },
  {
    id: "b2",
    title: "Pháp chứng Lưu lượng Gói tin Mạng",
    domainKey: "network",
    standard: "PCAP · MITRE T1040",
    tier: "Bậc 2",
    baselineUnlocked: true,
    baselineProgress: 100,
    earnedDate: "01/10/2026",
    description:
      "Tái cấu trúc luồng dữ liệu trích xuất từ tệp bắt gói tin thô PCAP bằng Wireshark và tshark, phát hiện kênh ngầm DNS.",
    xp: "+450 XP",
  },
  {
    id: "b3",
    title: "Kỹ sư Giám sát SIEM & Quy tắc Sigma",
    domainKey: "defensive",
    standard: "Sigma · MITRE ATT&CK",
    tier: "Bậc 1",
    baselineUnlocked: true,
    baselineProgress: 100,
    earnedDate: "25/09/2026",
    description:
      "Biên soạn quy tắc tương quan sự kiện trên Elastic SIEM và phân tích nhật ký Sysmon phát hiện di chuyển ngang.",
    xp: "+400 XP",
  },
  {
    id: "b4",
    title: "Mật mã học Ứng dụng & Giao thức TLS 1.3",
    domainKey: "network",
    standard: "RFC 8446 · PKI · SHA-256",
    tier: "Bậc 2",
    baselineUnlocked: true,
    baselineProgress: 100,
    earnedDate: "18/09/2026",
    description:
      "Làm chủ hạ tầng khóa công khai PKI, quy trình bắt tay TLS 1.3 (ECDHE / HKDF) và kiểm toán lỗi nhầm lẫn thuật toán JWT.",
    xp: "+600 XP",
  },
  {
    id: "b5",
    title: "Kiểm toán Danh tính & Phân quyền Cloud IAM",
    domainKey: "cloud",
    standard: "AWS STS · IMDSv2 · NIST NICE",
    tier: "Bậc 3",
    baselineUnlocked: false,
    baselineProgress: 45,
    earnedDate: null,
    description:
      "Phát hiện và khắc phục 5 chuỗi leo thang đặc quyền IAM PassRole, AssumeRole và chặn truy cập AWS Metadata IMDSv1.",
    xp: "+800 XP",
  },
  {
    id: "b6",
    title: "Khai thác Bộ nhớ & Dịch ngược Nhị phân",
    domainKey: "reverse",
    standard: "CWE-121 · x86_64 · ROP",
    tier: "Bậc 3",
    baselineUnlocked: false,
    baselineProgress: 20,
    earnedDate: null,
    description:
      "Phân tích cấu trúc khung ngăn xếp x86_64, cơ chế Stack Canary / NX và kiểm toán lỗi tràn bộ đệm trong mã nguồn C.",
    xp: "+1.000 XP",
  },
]

const FILTER_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "unlocked", label: "Đã đạt" },
  { id: "locked", label: "Đang tiến hành" },
]

function formatIssueDate(rawDate) {
  if (!rawDate) return "Chưa xác định"
  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) return String(rawDate)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed)
}

function truncateHash(hash) {
  if (!hash) return "Chưa có mã băm"
  if (hash.length <= 24) return hash
  return `${hash.slice(0, 14)}…${hash.slice(-10)}`
}

export function Achievements() {
  const { courses, completedLessons } = useLearningStore()
  const { completedLabs } = useLabStore()

  const [certificates, setCertificates] = useState([])
  const [sourceMode, setSourceMode] = useState("loading") // "loading" | "official" | "official_empty" | "offline_sample"
  const [showSampleWhenEmpty, setShowSampleWhenEmpty] = useState(false)
  const [expandedPgpIds, setExpandedPgpIds] = useState({})
  const [activeCategory, setActiveCategory] = useState("all")
  const [copiedId, setCopiedId] = useState(null)

  const fetchMyCertificates = useCallback(async () => {
    setSourceMode("loading")
    try {
      const data = await certificationService.getMyCertificates()
      if (Array.isArray(data) && data.length > 0) {
        setCertificates(data)
        setSourceMode("official")
      } else if (Array.isArray(data)) {
        setCertificates([])
        setSourceMode("official_empty")
      } else {
        setCertificates(OFFLINE_SAMPLE_CERTIFICATES)
        setSourceMode("offline_sample")
      }
    } catch {
      setCertificates(OFFLINE_SAMPLE_CERTIFICATES)
      setSourceMode("offline_sample")
    }
  }, [])

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!active) return
      await fetchMyCertificates()
    }
    run()
    return () => {
      active = false
    }
  }, [fetchMyCertificates])

  const handleCopy = async (id, text) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      window.setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Bỏ qua nếu môi trường trình duyệt chặn clipboard
    }
  }

  const togglePgp = (certKey) => {
    setExpandedPgpIds((prev) => ({
      ...prev,
      [certKey]: !prev[certKey],
    }))
  }

  // Kết hợp tiến độ khóa học & lab để cập nhật trạng thái huy hiệu năng lực học thuật
  const competencyBadges = useMemo(() => {
    return BASELINE_COMPETENCY_BADGES.map((badge) => {
      const matchingCourses = courses.filter((c) => c.category === badge.domainKey)
      const totalLessons = matchingCourses.reduce(
        (sum, c) => sum + (c.syllabus?.length || 0),
        0
      )
      const doneLessons = matchingCourses.reduce(
        (sum, c) => sum + (completedLessons[c.id]?.length || 0),
        0
      )

      const liveRatio =
        totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0
      const hasLiveCourseDone = totalLessons > 0 && doneLessons >= totalLessons

      const unlocked =
        badge.baselineUnlocked ||
        hasLiveCourseDone ||
        (badge.domainKey === "cloud" && completedLabs.includes("lab-07"))

      const progress = unlocked
        ? 100
        : Math.max(badge.baselineProgress, liveRatio)

      return {
        ...badge,
        unlocked,
        progress,
      }
    })
  }, [courses, completedLessons, completedLabs])

  const unlockedCount = competencyBadges.filter((b) => b.unlocked).length

  const filteredBadges = useMemo(() => {
    return competencyBadges.filter((b) => {
      if (activeCategory === "all") return true
      if (activeCategory === "unlocked") return b.unlocked
      if (activeCategory === "locked") return !b.unlocked
      return true
    })
  }, [competencyBadges, activeCategory])

  const displayedCertificates =
    sourceMode === "official_empty" && showSampleWhenEmpty
      ? OFFLINE_SAMPLE_CERTIFICATES
      : certificates

  const activeCertCount =
    sourceMode === "official"
      ? certificates.filter((c) => !c.revoked).length
      : sourceMode === "offline_sample"
      ? OFFLINE_SAMPLE_CERTIFICATES.length
      : 0

  return (
    <div className="space-y-10 pb-14 animate-fade-in-up">
      {/* ====================================================================
          §01. TỔNG QUAN VĂN BẰNG & CHỨNG CHỈ HỌC THUẬT
         ==================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#1D4ED8] dark:bg-[#3B82F6] text-white uppercase tracking-[0.08em]">
                §01 // VĂN BẰNG &amp; CHỨNG THỰC MẬT MÃ
              </span>
              <span
                className={`font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${
                  sourceMode === "offline_sample"
                    ? "bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/25"
                    : "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                }`}
              >
                {sourceMode === "offline_sample" ? (
                  <>
                    <Info className="h-3.5 w-3.5" />
                    <span>MẪU NGOẠI TUYẾN (OFFLINE SAMPLE)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{activeCertCount} VĂN BẰNG HỢP LỆ</span>
                  </>
                )}
              </span>
            </div>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl lg:text-[2.25rem] font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-[-0.02em] leading-tight">
              Hồ sơ Chứng chỉ Số &amp;{" "}
              <em className="italic font-normal text-[#1D4ED8] dark:text-[#38BDF8]">
                Huy hiệu Năng lực
              </em>
            </h1>

            <p className="text-[#475569] dark:text-[#94A3B8] text-xs sm:text-sm leading-relaxed">
              Lưu trữ các văn bằng tốt nghiệp Capstone gắn dấu vân tay SHA-256 và chữ ký số PGP RSA-4096, cùng hệ thống huy hiệu năng lực đạt được qua thực nghiệm an ninh mạng.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[118px]">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Huy Hiệu Đã Đạt
              </span>
              <span className="text-lg font-mono-tech font-bold text-[#1D4ED8] dark:text-[#38BDF8] mt-0.5 block">
                <CountUp
                  key={`badges-${unlockedCount}`}
                  end={unlockedCount}
                  start={unlockedCount}
                  duration={250}
                />{" "}
                / {competencyBadges.length}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[118px]">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Chứng Chỉ Số
              </span>
              <span className="text-lg font-mono-tech font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
                <CountUp
                  key={`certs-${activeCertCount}`}
                  end={activeCertCount}
                  start={activeCertCount}
                  duration={250}
                />
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-center min-w-[118px] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase block font-semibold">
                Chuẩn Xác Thực
              </span>
              <span className="text-sm font-mono-tech font-bold text-[#0F172A] dark:text-[#F1F5F9] mt-1 block">
                SHA-256 · PGP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          §02. CHỨNG CHỈ ĐÃ CẤP TỪ SỔ CÁI (GET /api/certificates/my-certificates)
         ==================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>Văn bằng &amp; Chứng chỉ Học thuật (Sổ cái SHA-256)</span>
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
              Chứng thư ký mật mã dùng để đối chiếu trực tiếp qua cổng xác thực công khai không cần đăng nhập.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchMyCertificates}
              disabled={sourceMode === "loading"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${sourceMode === "loading" ? "animate-spin" : ""}`}
              />
              <span>Đồng bộ sổ cái</span>
            </button>
            <Link
              to="/verify"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] transition-colors"
            >
              <span>Cổng tra cứu</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Biểu ngữ báo hiệu trạng thái Offline Sample */}
        {sourceMode === "offline_sample" && (
          <div className="rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
            <div className="flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                <strong className="font-semibold">Chế độ Mẫu Ngoại tuyến (Offline Sample):</strong>{" "}
                Không thể truy xuất dữ liệu chứng chỉ từ máy chủ (chưa đăng nhập phiên backend hoặc máy chủ đang bảo trì). Các văn bằng bên dưới là dữ liệu mẫu tham khảo cấu trúc SHA-256 &amp; PGP.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchMyCertificates}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-amber-300 dark:border-amber-500/40 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer hover:bg-amber-100/60 dark:hover:bg-[#161C2A] transition-colors"
            >
              Thử kết nối lại
            </button>
          </div>
        )}

        {/* Khung trạng thái đang tải tĩnh */}
        {sourceMode === "loading" && (
          <div
            aria-busy="true"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[0, 1].map((idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 space-y-4"
              >
                <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D4ED8] dark:text-[#38BDF8]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang truy vấn văn bằng từ sổ cái chính thức...</span>
                </div>
                <div className="h-6 w-3/4 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                <div className="h-14 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
                <div className="h-9 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
              </div>
            ))}
          </div>
        )}

        {/* Trạng thái người dùng đã kết nối máy chủ nhưng chưa có văn bằng thực */}
        {sourceMode === "official_empty" && (
          <div className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <span className="font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] uppercase">
                  SỔ CÁI ĐÃ ĐỒNG BỘ · 0 VĂN BẰNG ĐÃ CẤP
                </span>
                <h3 className="font-serif-editorial text-xl font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                  Bạn chưa có chứng chỉ số chính thức nào được phát hành
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Để nhận văn bằng gắn mã băm SHA-256 và chữ ký PGP, hãy hoàn thành 100% bài học trong một chuyên đề và bảo vệ đồ án Capstone đạt tối thiểu 80/100 điểm Rubric NIST NICE.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link to="/learning">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Mở Giáo trình &amp; Capstone
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowSampleWhenEmpty((prev) => !prev)}
                  className="px-3.5 py-2 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] cursor-pointer hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] transition-colors"
                >
                  {showSampleWhenEmpty ? "Ẩn mẫu minh họa" : "Xem mẫu minh họa"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danh sách chứng chỉ (Thật từ server hoặc Mẫu ngoại tuyến) */}
        {sourceMode !== "loading" && displayedCertificates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedCertificates.map((cert) => {
              const certKey = cert.id || cert.certificateCode
              const isRevoked = Boolean(cert.revoked)
              const isPgpOpen = Boolean(expandedPgpIds[certKey])

              return (
                <Card
                  key={certKey}
                  variant="flat"
                  padding="lg"
                  className={`border-t-2 ${
                    isRevoked
                      ? "border-t-rose-600 dark:border-t-rose-500"
                      : "border-t-[#1D4ED8] dark:border-t-[#3B82F6]"
                  } space-y-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded border inline-flex items-center gap-1 ${
                            isRevoked
                              ? "bg-rose-50 dark:bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/25"
                              : "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                          }`}
                        >
                          {isRevoked ? (
                            <>
                              <ShieldAlert className="h-3 w-3" />
                              <span>ĐÃ THU HỒI</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>HỢP LỆ</span>
                            </>
                          )}
                        </span>

                        <span className="font-mono-tech text-[10px] font-medium px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                          {cert.isSample ? "MẪU NGOẠI TUYẾN" : "CHỨNG THƯ CHÍNH THỨC"}
                        </span>
                      </div>

                      <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-snug pt-0.5">
                        {cert.courseTitle}
                      </h3>
                    </div>

                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/12 border border-blue-200/80 dark:border-blue-500/25 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                    </div>
                  </div>

                  {/* Thông tin người nhận & ngày cấp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06] flex items-center gap-2">
                      <UserCheck className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase">
                          Học viên được cấp
                        </span>
                        <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate block">
                          {cert.recipientName || "Nghiên cứu viên CyberPath"}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06] flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-mono-tech text-[#64748B] dark:text-[#94A3B8] uppercase">
                          Ngày cấp phát
                        </span>
                        <span className="font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] block">
                          {formatIssueDate(cert.issueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {cert.accreditation && (
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono-tech">
                      {cert.accreditation}
                    </p>
                  )}

                  {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {cert.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] text-[10px] font-mono-tech border border-[#E5E2DC] dark:border-white/[0.08]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Khối Mã Định Danh & Dấu Vân Tay SHA-256 */}
                  <div className="rounded-xl bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 font-mono-tech text-[11px]">
                      <span className="text-[#475569] dark:text-[#94A3B8] truncate">
                        Mã số:{" "}
                        <strong className="text-[#0F172A] dark:text-[#F1F5F9]">
                          {cert.certificateCode}
                        </strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(`code-${certKey}`, cert.certificateCode)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer shrink-0"
                        title="Sao chép mã chứng chỉ"
                      >
                        {copiedId === `code-${certKey}` ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>Đã chép mã</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Chép mã</span>
                          </>
                        )}
                      </button>
                    </div>

                    {cert.sha256Hash && (
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#EFEDE7] dark:border-white/[0.06] font-mono-tech text-[11px]">
                        <span className="inline-flex items-center gap-1.5 text-[#64748B] dark:text-[#94A3B8] truncate">
                          <Hash className="h-3 w-3 shrink-0 text-[#1D4ED8] dark:text-[#38BDF8]" />
                          <span className="truncate">{truncateHash(cert.sha256Hash)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`hash-${certKey}`, cert.sha256Hash)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer shrink-0"
                          title="Sao chép mã băm SHA-256"
                        >
                          {copiedId === `hash-${certKey}` ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Đã chép Hash</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Chép SHA-256</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Chữ ký PGP mở rộng (nếu có) */}
                  {cert.pgpSignature && isPgpOpen && (
                    <div className="rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-[#0F172A] dark:bg-[#080B10] p-3">
                      <pre className="m-0 font-mono-tech text-[10px] leading-relaxed text-slate-100 overflow-x-auto whitespace-pre">
                        {cert.pgpSignature}
                      </pre>
                    </div>
                  )}

                  {/* Thanh hành động trực tiếp */}
                  <div className="pt-2 border-t border-[#EFEDE7] dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-2.5">
                    {cert.pgpSignature ? (
                      <button
                        type="button"
                        onClick={() => togglePgp(certKey)}
                        aria-expanded={isPgpOpen}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-mono-tech font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] transition-colors cursor-pointer"
                      >
                        <FileKey2 className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                        <span>{isPgpOpen ? "Ẩn chữ ký PGP" : "Xem chữ ký PGP"}</span>
                        {isPgpOpen ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : (
                      <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        Ký bởi CyberPath CA
                      </span>
                    )}

                    <Link
                      to={`/verify/${encodeURIComponent(cert.certificateCode)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Xác thực công khai</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* ====================================================================
          §03. DANH MỤC HUY HIỆU NĂNG LỰC HỌC THUẬT
         ==================================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span>Huy hiệu Năng lực Thực nghiệm</span>
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
              Cấp phát tự động khi hoàn thành các mục tiêu tấn công, phòng thủ và điều tra số trong Cyber Range.
            </p>
          </div>

          {/* Thanh lọc trạng thái huy hiệu */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {FILTER_TABS.map((tab) => {
              const isActive = activeCategory === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6]"
                      : "bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <Card
              key={badge.id}
              variant="flat"
              padding="md"
              className={`transition-colors flex flex-col justify-between space-y-4 ${
                badge.unlocked
                  ? "bg-white dark:bg-[#121722]"
                  : "bg-[#FAF9F6] dark:bg-[#121722]/75"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 ${
                      badge.unlocked
                        ? "bg-blue-50 dark:bg-blue-500/12 border-blue-200 dark:border-blue-500/25 text-[#1D4ED8] dark:text-[#38BDF8]"
                        : "bg-[#F3F1EC] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#64748B] dark:text-[#94A3B8]"
                    }`}
                  >
                    {badge.unlocked ? (
                      <Award className="h-5 w-5" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                      {badge.tier}
                    </span>
                    <span className="font-mono-tech text-xs font-bold text-[#1D4ED8] dark:text-[#38BDF8]">
                      {badge.xp}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8] block">
                    {badge.standard}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EFEDE7] dark:border-white/[0.06] text-[11px] font-mono-tech">
                {badge.unlocked ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>ĐÃ ĐẠT · {badge.earnedDate || "Phiên hiện tại"}</span>
                  </span>
                ) : (
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-[#64748B] dark:text-[#94A3B8]">
                      <span>TIẾN ĐỘ ĐANG MỞ</span>
                      <span>{badge.progress}%</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={badge.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={badge.title}
                      className="h-1.5 w-full rounded-full bg-[#ECE9E2] dark:bg-[#161C2A] overflow-hidden"
                    >
                      <div
                        className="h-full rounded-full bg-[#1D4ED8] dark:bg-[#3B82F6] transition-all duration-300"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ====================================================================
          §04. KÊU GỌI HÀNH ĐỘNG TIẾP THEO
         ==================================================================== */}
      <section className="p-6 rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8]">
            §04 // TIẾP TỤC CHƯƠNG TRÌNH NGHIÊN CỨU
          </span>
          <h3 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
            Sẵn sàng chinh phục chứng chỉ an ninh mạng tiếp theo?
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Khởi chạy phòng thí nghiệm Cyber Range để hoàn tất các mục tiêu còn lại cho huy hiệu Kiểm toán Cloud IAM hoặc bảo vệ đồ án Capstone.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link to="/labs">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Mở Phòng Thí Nghiệm
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Achievements
