import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  SearchX,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileKey2,
  Hash,
  Calendar,
  UserCheck,
  Award,
  Link2,
  Info,
  AlertTriangle,
  Loader2,
  ArrowRight,
  BookOpen,
} from "lucide-react"
import certificationService from "../../services/certificationService"

// ============================================================================
// CHỨNG THƯ MẪU MINH HỌA (OFFLINE DEMO SPECIMENS — KHÔNG GIẢ MẠO CSDL CHÍNH THỨC)
// ============================================================================
const DEMO_CERTIFICATES = {
  "CP-2026-WEB-8F4C3E19": {
    valid: true,
    revoked: false,
    certificateCode: "CP-2026-WEB-8F4C3E19",
    recipientName: "Nguyễn Minh Khoa",
    courseTitle: "Chuyên đề Bảo mật Ứng dụng Web & Phòng thủ AST (OWASP ASVS v4.0)",
    issueDate: "2026-10-18T14:30:00",
    sha256Hash: "8f4c92a1b7e04d31c9a5e6f8120934bc7d5a8e1120c4f9b3a6d108e29f4a3e19",
    pgpSignature: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

Recipient: Nguyễn Minh Khoa
Specialization: Chuyên đề Bảo mật Ứng dụng Web & Phòng thủ AST (OWASP ASVS v4.0)
Certificate Serial: CP-2026-WEB-8F4C3E19
Issued At: 2026-10-18T14:30:00
Integrity Hash: 8f4c92a1b7e04d31c9a5e6f8120934bc7d5a8e1120c4f9b3a6d108e29f4a3e19
Issuer: CyberPath Academic Security Registry (Demo Specimen)
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4 (CyberPath-Academic-CA)

wsBzBAEBCAAGBQJkOGY4Q0FGQkFBQUJGUzRDOEJGRTJBMTE0MDk3Q0Q5MUQ4RTQ=
-----END PGP SIGNATURE-----`,
    statusMessage: "Hồ sơ mẫu minh họa hợp lệ theo chuẩn băm SHA-256 & chữ ký PGP (Demo Specimen).",
    label: "Mẫu Hợp lệ · Web & AST",
  },
  "CP-2026-SOC-4A91D20B": {
    valid: true,
    revoked: false,
    certificateCode: "CP-2026-SOC-4A91D20B",
    recipientName: "Trần Thu Hà",
    courseTitle: "Chuyên viên Giám sát SOC & Điều tra Sự cố MITRE ATT&CK",
    issueDate: "2026-11-02T09:15:00",
    sha256Hash: "4a91d20b6c8841fa9302e571bc4928d0a1f73c68b2e5094dc813a7f26e9b4d0b",
    pgpSignature: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

Recipient: Trần Thu Hà
Specialization: Chuyên viên Giám sát SOC & Điều tra Sự cố MITRE ATT&CK
Certificate Serial: CP-2026-SOC-4A91D20B
Issued At: 2026-11-02T09:15:00
Integrity Hash: 4a91d20b6c8841fa9302e571bc4928d0a1f73c68b2e5094dc813a7f26e9b4d0b
Issuer: CyberPath Academic Security Registry (Demo Specimen)
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4 (CyberPath-Academic-CA)

wsBzBAEBCAAGBQJkNEE5RjRCQTEyODlDRjEwMkU4NDc1Q0I5QTMyMUY4MDJFMTA=
-----END PGP SIGNATURE-----`,
    statusMessage: "Hồ sơ mẫu minh họa hợp lệ theo chuẩn băm SHA-256 & chữ ký PGP (Demo Specimen).",
    label: "Mẫu Hợp lệ · SOC & ATT&CK",
  },
  "CP-2026-REV-0019F2C4": {
    valid: false,
    revoked: true,
    certificateCode: "CP-2026-REV-0019F2C4",
    recipientName: "Lê Hoàng Nam",
    courseTitle: "Kiến trúc Zero-Trust & Phòng thủ Hạ tầng Cloud",
    issueDate: "2026-08-11T16:45:00",
    sha256Hash: "0019f2c48a3b7190e2d45581ca9b6f03d712e4890ab4c5f612398e01d7a4f2c4",
    pgpSignature: `-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

Recipient: Lê Hoàng Nam
Specialization: Kiến trúc Zero-Trust & Phòng thủ Hạ tầng Cloud
Certificate Serial: CP-2026-REV-0019F2C4
Status: REVOKED (Integrity / Academic Policy Audit)
Integrity Hash: 0019f2c48a3b7190e2d45581ca9b6f03d712e4890ab4c5f612398e01d7a4f2c4
Issuer: CyberPath Academic Security Registry (Demo Specimen)
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v2.4 (CyberPath-Academic-CA)

wsBzBAEBCAAGBQJkUkVWMDkxRkMyNEExQkU0ODA1QzIyRTk5QjE3QzM0QTg4MDA=
-----END PGP SIGNATURE-----`,
    statusMessage: "Chứng chỉ mẫu đã bị thu hồi: Cấp lại theo phiên bản chuẩn hóa mới (Demo Specimen).",
    label: "Mẫu Đã thu hồi · Cloud",
  },
}

const SAMPLE_IDS = Object.keys(DEMO_CERTIFICATES)

function formatIssueDate(rawDate) {
  if (!rawDate) return "Không xác định"
  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) return String(rawDate)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed)
}

function getCertificateStatusMeta(record) {
  if (!record) {
    return {
      key: "NOT_FOUND",
      badgeText: "KHÔNG TÌM THẤY",
      Icon: SearchX,
      badgeClass:
        "bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
      accentBorder: "border-amber-300/80 dark:border-amber-500/30",
    }
  }
  if (record.revoked) {
    return {
      key: "REVOKED",
      badgeText: "ĐÃ THU HỒI",
      Icon: ShieldAlert,
      badgeClass:
        "bg-rose-50 dark:bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
      accentBorder: "border-rose-300/80 dark:border-rose-500/30",
    }
  }
  if (record.valid) {
    return {
      key: "VALID",
      badgeText: "HỢP LỆ",
      Icon: ShieldCheck,
      badgeClass:
        "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
      accentBorder: "border-emerald-300/80 dark:border-emerald-500/30",
    }
  }
  return {
    key: "NOT_FOUND",
    badgeText: "KHÔNG TÌM THẤY",
    Icon: SearchX,
    badgeClass:
      "bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    accentBorder: "border-amber-300/80 dark:border-amber-500/30",
  }
}

export function CertificateVerify() {
  const { certificateCode: paramCode } = useParams()
  const navigate = useNavigate()

  const decodedParam = paramCode ? decodeURIComponent(paramCode).trim() : ""
  const [prevParam, setPrevParam] = useState(decodedParam)
  const [inputCode, setInputCode] = useState(decodedParam)
  const [isVerifying, setIsVerifying] = useState(() => Boolean(decodedParam))
  const [verificationResult, setVerificationResult] = useState(null)
  const [sourceMode, setSourceMode] = useState(null) // "official" | "demo" | "offline_error"
  const [fallbackReason, setFallbackReason] = useState("")
  const [isPgpExpanded, setIsPgpExpanded] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null)

  const verifySeqRef = useRef(0)

  if (decodedParam !== prevParam) {
    setPrevParam(decodedParam)
    setInputCode(decodedParam)
    if (decodedParam) {
      setIsVerifying(true)
      setFallbackReason("")
      setIsPgpExpanded(false)
    } else {
      setIsVerifying(false)
      setVerificationResult(null)
      setSourceMode(null)
      setFallbackReason("")
    }
  }

  const fetchVerificationResult = useCallback(async (rawCode, seq, isCancelled = () => false) => {
    const cleanCode = String(rawCode || "").trim()
    if (!cleanCode) return

    const upperKey = cleanCode.toUpperCase()
    const demoSpecimen = DEMO_CERTIFICATES[upperKey] || null

    try {
      const data = await certificationService.verifyCertificate(encodeURIComponent(cleanCode))
      if (isCancelled() || verifySeqRef.current !== seq) return

      const existsInDb = Boolean(data?.valid || data?.revoked)
      if (existsInDb) {
        setVerificationResult(data)
        setSourceMode("official")
      } else if (demoSpecimen) {
        // Máy chủ đang chạy nhưng chưa seed bản ghi mẫu này: minh bạch nguồn gốc Demo
        setVerificationResult(demoSpecimen)
        setSourceMode("demo")
        setFallbackReason(
          "Máy chủ xác thực chính thức không có bản ghi thực tế cho mã mẫu này; đang hiển thị Chứng Thư Mẫu Minh Họa cấu trúc SHA-256 & PGP."
        )
      } else {
        setVerificationResult(
          data || {
            valid: false,
            revoked: false,
            certificateCode: cleanCode,
            recipientName: null,
            courseTitle: null,
            issueDate: null,
            sha256Hash: null,
            pgpSignature: null,
            statusMessage: "Mã chứng chỉ không tồn tại trên cơ sở dữ liệu xác thực.",
          }
        )
        setSourceMode("official")
      }
    } catch {
      if (isCancelled() || verifySeqRef.current !== seq) return

      if (demoSpecimen) {
        setVerificationResult(demoSpecimen)
        setSourceMode("demo")
        setFallbackReason(
          "Máy chủ xác thực hiện không phản hồi — Đang hiển thị Chứng Thư Mẫu Minh Họa cục bộ (Offline Demo)."
        )
      } else {
        setVerificationResult({
          valid: false,
          revoked: false,
          certificateCode: cleanCode,
          recipientName: null,
          courseTitle: null,
          issueDate: null,
          sha256Hash: null,
          pgpSignature: null,
          statusMessage:
            "Không thể kết nối tới cổng xác thực chính thức của máy chủ. Vui lòng thử lại sau hoặc dùng mã mẫu minh họa.",
        })
        setSourceMode("offline_error")
      }
    } finally {
      if (!isCancelled() && verifySeqRef.current === seq) {
        setIsVerifying(false)
      }
    }
  }, [])

  const executeVerification = useCallback(
    (rawCode) => {
      const cleanCode = String(rawCode || "").trim()
      if (!cleanCode) return
      const seq = ++verifySeqRef.current
      setIsVerifying(true)
      setFallbackReason("")
      setIsPgpExpanded(false)
      fetchVerificationResult(cleanCode, seq)
    },
    [fetchVerificationResult]
  )

  // Tự động xác thực khi mở trang có :certificateCode hoặc khi URL thay đổi
  useEffect(() => {
    if (!decodedParam) return undefined
    let cancelled = false
    const seq = ++verifySeqRef.current
    fetchVerificationResult(decodedParam, seq, () => cancelled)
    return () => {
      cancelled = true
    }
  }, [decodedParam, fetchVerificationResult])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const clean = inputCode.trim()
    if (!clean) return
    if (clean === decodedParam) {
      executeVerification(clean)
    } else {
      navigate(`/verify/${encodeURIComponent(clean)}`)
    }
  }

  const handleSampleClick = (sampleCode) => {
    setInputCode(sampleCode)
    if (sampleCode === decodedParam) {
      executeVerification(sampleCode)
    } else {
      navigate(`/verify/${encodeURIComponent(sampleCode)}`)
    }
  }

  const copyToClipboard = async (key, text) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    } catch {
      // Bỏ qua nếu môi trường chặn clipboard
    }
  }

  const statusMeta = getCertificateStatusMeta(verificationResult)
  const StatusIcon = statusMeta.Icon
  const verificationUrl =
    typeof window !== "undefined" && verificationResult?.certificateCode
      ? `${window.location.origin}/verify/${encodeURIComponent(verificationResult.certificateCode)}`
      : ""

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ====================================================================
            TIÊU ĐỀ CỔNG XÁC THỰC VĂN BẰNG HỌC THUẬT
           ==================================================================== */}
        <header className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#1D4ED8] dark:text-[#38BDF8]">
            <FileKey2 className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>SỔ CÁI CHỨNG THỰC CÔNG KHAI // SHA-256 &amp; PGP</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-[-0.02em] leading-[1.12] text-[#0F172A] dark:text-[#F1F5F9]">
            Cổng Tra Cứu &amp; Xác Thực Chứng Chỉ Học Thuật
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Nhà tuyển dụng, giảng viên và tổ chức đối tác có thể kiểm tra trực tiếp tính hợp lệ, trạng thái thu hồi và chữ ký mật mã PGP của chứng chỉ Capstone CyberPath mà không cần đăng nhập.
          </p>
        </header>

        {/* ====================================================================
            KHUNG TRA CỨU MÃ ĐỊNH DANH CHỨNG CHỈ
           ==================================================================== */}
        <section className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 sm:p-7 space-y-4 shadow-xs">
          <form onSubmit={handleSearchSubmit} className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="certificate-verify-input"
                className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
              >
                Mã định danh chứng chỉ (Certificate Serial Code)
              </label>
              <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Định dạng chuẩn: CERT-CYBER-2026-* hoặc CP-2026-*
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="certificate-verify-input"
                  name="certificateCode"
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Nhập mã chứng chỉ, VD: CP-2026-WEB-8F4C3E19"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] font-mono-tech text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B]"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || !inputCode.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] disabled:opacity-60 text-white font-sans font-semibold text-sm cursor-pointer transition-colors shrink-0"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang truy vấn...</span>
                  </>
                ) : (
                  <>
                    <span>Xác Thực</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Các mã mẫu minh họa bấm chọn nhanh */}
          <div className="pt-2 border-t border-[#EFEDE7] dark:border-white/[0.06] flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs text-[#64748B] dark:text-[#94A3B8] mr-1">
              Mã mẫu minh họa:
            </span>
            {SAMPLE_IDS.map((sampleCode) => {
              const sampleMeta = DEMO_CERTIFICATES[sampleCode]
              const isSelected = decodedParam.toUpperCase() === sampleCode
              return (
                <button
                  key={sampleCode}
                  type="button"
                  onClick={() => handleSampleClick(sampleCode)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#1D4ED8]/10 dark:bg-[#3B82F6]/15 border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8]"
                      : "bg-[#FAF9F6] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6]"
                  }`}
                >
                  <span className="font-mono-tech text-[11px] font-semibold">{sampleCode}</span>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] hidden sm:inline">
                    ({sampleMeta.label})
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ====================================================================
            KẾT QUẢ XÁC THỰC — THẺ CHỨNG CHỈ LƯU TRỮ HỌC THUẬT
           ==================================================================== */}
        {isVerifying && (
          <div
            aria-busy="true"
            className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#1D4ED8] dark:text-[#38BDF8]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang đối chiếu dữ liệu chứng chỉ trên sổ cái...</span>
              </span>
              <div className="h-6 w-48 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A]" />
            </div>
            <div className="h-8 w-2/3 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-16 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
              <div className="h-16 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
            </div>
            <div className="h-20 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
          </div>
        )}

        {!isVerifying && verificationResult && (
          <div className="space-y-4">
            {/* Thông báo minh bạch nguồn xác thực */}
            {sourceMode === "demo" && fallbackReason && (
              <div className="rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-3 flex items-start gap-3 text-amber-900 dark:text-amber-200">
                <Info className="h-4 w-4 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">{fallbackReason}</p>
              </div>
            )}

            {sourceMode === "offline_error" && (
              <div className="rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">{verificationResult.statusMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSampleClick("CP-2026-WEB-8F4C3E19")}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-amber-300 dark:border-amber-500/40 text-xs font-semibold hover:bg-amber-100/60 dark:hover:bg-[#161C2A] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  Thử mẫu Offline Demo
                </button>
              </div>
            )}

            {/* THẺ CHỨNG CHỈ LƯU TRỮ (ARCHIVAL ACADEMIC FOLIO CARD) */}
            <article
              className={`rounded-2xl bg-white dark:bg-[#121722] border ${statusMeta.accentBorder} p-2 sm:p-3 shadow-sm`}
            >
              <div className="rounded-xl border border-[#EFEDE7] dark:border-white/[0.06] bg-[#FAF9F6]/60 dark:bg-[#0B0E14]/50 p-5 sm:p-8 space-y-6">
                {/* Hàng trạng thái & nguồn chứng thực */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5E2DC] dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono-tech text-xs font-semibold ${statusMeta.badgeClass}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      <span>{statusMeta.badgeText}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono-tech text-[11px] font-medium ${
                        sourceMode === "official"
                          ? "bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border-blue-200 dark:border-blue-500/25"
                          : "bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.09]"
                      }`}
                    >
                      {sourceMode === "official"
                        ? "Xác Thực từ Máy Chủ Chính Thức"
                        : sourceMode === "demo"
                          ? "Chứng Thư Mẫu Minh Họa (Offline Demo)"
                          : "Mất kết nối Máy chủ"}
                    </span>
                  </div>

                  {verificationUrl && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard("url", verificationUrl)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] cursor-pointer transition-colors"
                    >
                      {copiedKey === "url" ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Đã sao chép URL xác thực</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                          <span>Sao chép liên kết xác thực</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Nội dung chính của chứng chỉ */}
                {statusMeta.key === "NOT_FOUND" ? (
                  <div className="py-6 text-center space-y-3 max-w-lg mx-auto">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/12 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300">
                      <SearchX className="h-6 w-6" />
                    </div>
                    <h2 className="font-serif-editorial text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      Không tìm thấy hồ sơ cho mã {verificationResult.certificateCode}
                    </h2>
                    <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {verificationResult.statusMessage ||
                        "Mã định danh này không tồn tại trên cơ sở dữ liệu chứng thực hoặc có thể đã bị nhập sai ký tự."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Tiêu đề văn bằng */}
                    <div className="space-y-2">
                      <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#64748B] dark:text-[#94A3B8]">
                        HỌC VIỆN AN NINH MẠNG CYBERPATH // CHỨNG CHỈ HOÀN THÀNH CAPSTONE
                      </div>
                      <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                        {verificationResult.courseTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                        {verificationResult.statusMessage}
                      </p>
                    </div>

                    {/* Lưới thông tin định danh học viên & ngày cấp */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-4 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                          <UserCheck className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                          <span>Học viên được cấp</span>
                        </div>
                        <div className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                          {verificationResult.recipientName || "Không có dữ liệu"}
                        </div>
                      </div>

                      <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-4 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                          <Calendar className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                          <span>Thời điểm cấp phát</span>
                        </div>
                        <div className="font-mono-tech text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] pt-1">
                          {formatIssueDate(verificationResult.issueDate)}
                        </div>
                      </div>

                      <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-4 space-y-1">
                        <div className="flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                          <Award className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                          <span>Mã định danh (Serial)</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="font-mono-tech text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8] truncate">
                            {verificationResult.certificateCode}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard("code", verificationResult.certificateCode)
                            }
                            aria-label="Sao chép mã chứng chỉ"
                            className="p-1 rounded hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer"
                          >
                            {copiedKey === "code" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Dấu vân tay toàn vẹn SHA-256 */}
                    {verificationResult.sha256Hash && (
                      <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-4 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                            <Hash className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                            <span>Dấu vân tay Toàn vẹn (SHA-256 Digest)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard("sha256", verificationResult.sha256Hash)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
                          >
                            {copiedKey === "sha256" ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Đã sao chép SHA-256</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Sao chép Hash</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="font-mono-tech text-xs text-[#0F172A] dark:text-[#F1F5F9] bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#EFEDE7] dark:border-white/[0.06] rounded-lg px-3 py-2.5 break-all">
                          {verificationResult.sha256Hash}
                        </div>
                      </div>
                    )}

                    {/* Khối chữ ký PGP có thể mở rộng / thu gọn */}
                    {verificationResult.pgpSignature && (
                      <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] overflow-hidden">
                        <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 bg-[#FAF9F6] dark:bg-[#161C2A]">
                          <button
                            type="button"
                            onClick={() => setIsPgpExpanded((prev) => !prev)}
                            aria-expanded={isPgpExpanded}
                            className="inline-flex items-center gap-2 text-xs font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] cursor-pointer"
                          >
                            <FileKey2 className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                            <span>
                              {isPgpExpanded
                                ? "Thu gọn Chữ ký Mật mã PGP (ASCII-Armored)"
                                : "Xem Chữ ký Mật mã PGP (ASCII-Armored)"}
                            </span>
                            {isPgpExpanded ? (
                              <ChevronUp className="h-4 w-4 text-[#64748B]" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-[#64748B]" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => copyToClipboard("pgp", verificationResult.pgpSignature)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
                          >
                            {copiedKey === "pgp" ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Đã sao chép PGP</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Sao chép Khối PGP</span>
                              </>
                            )}
                          </button>
                        </div>

                        {isPgpExpanded && (
                          <div className="p-4 border-t border-[#E5E2DC] dark:border-white/[0.08] bg-[#0F172A] dark:bg-[#080B10]">
                            <pre className="m-0 font-mono-tech text-[11px] leading-relaxed text-slate-100 overflow-x-auto whitespace-pre">
                              {verificationResult.pgpSignature}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          </div>
        )}

        {/* ====================================================================
            TRẠNG THÁI MẶC ĐỊNH TRƯỚC KHI TRA CỨU & HƯỚNG DẪN XÁC MINH
           ==================================================================== */}
        {!isVerifying && !verificationResult && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 space-y-2">
              <div className="font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8]">
                01 // MÃ BĂM TOÀN VẸN
              </div>
              <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Đối chiếu SHA-256
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Mỗi chứng chỉ Capstone đều gắn mã băm SHA-256 duy nhất sinh từ mã định danh, hồ sơ học viên, khóa học và dấu thời gian phát hành.
              </p>
            </div>

            <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 space-y-2">
              <div className="font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8]">
                02 // CHỮ KÝ MẬT MÃ
              </div>
              <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Chữ ký Mật mã PGP
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Khối chữ ký ASCII-Armored cho phép lưu trữ ngoại tuyến và kiểm chứng tính chống giả mạo của chứng chỉ tại bất kỳ thời điểm nào.
              </p>
            </div>

            <div className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 space-y-2">
              <div className="font-mono-tech text-[11px] text-[#1D4ED8] dark:text-[#38BDF8]">
                03 // KIỂM TRA THU HỒI
              </div>
              <h2 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Trạng thái Thu hồi Thời gian thực
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Hệ thống phân biệt rõ chứng chỉ <strong className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">HỢP LỆ</strong>, <strong className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">ĐÃ THU HỒI</strong> và <strong className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">KHÔNG TÌM THẤY</strong> trực tiếp từ sổ cái API.
              </p>
            </div>
          </section>
        )}

        {/* Chân trang liên kết học thuật */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
            <span>Tiêu chuẩn đánh giá Capstone tuân theo NIST NICE SP 800-181 &amp; OWASP ASVS.</span>
          </span>
          <Link
            to="/learning-paths"
            className="font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
          >
            Xem lộ trình cấp chứng chỉ →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CertificateVerify
