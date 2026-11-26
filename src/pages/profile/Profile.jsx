import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
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
  FileKey2,
  ChevronDown,
  ChevronUp,
  Award,
  Pencil,
  Save,
  Settings as SettingsIcon,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import useLearningStore from "../../stores/useLearningStore"
import useLabStore from "../../stores/useLabStore"
import { Card, Badge, Button } from "../../components/common"

const PGP_FINGERPRINT = "9B82 E01A 4F78 D23B C901  55A1 8E32 7A4D 2209 11BC"

function readStoredSettings() {
  try {
    const raw = localStorage.getItem("cyber_settings_prefs")
    if (!raw) return { mfaEnabled: true, mfaMethod: "webauthn" }
    const parsed = JSON.parse(raw)
    return {
      mfaEnabled: typeof parsed?.mfaEnabled === "boolean" ? parsed.mfaEnabled : true,
      mfaMethod: parsed?.mfaMethod === "totp" ? "totp" : "webauthn",
    }
  } catch {
    return { mfaEnabled: true, mfaMethod: "webauthn" }
  }
}

function readStoredHandles(defaultHandle) {
  try {
    const raw = localStorage.getItem("cyber_profile_handles")
    if (!raw) {
      return {
        github: `@${defaultHandle}`,
        ctfOrg: "Nghiên cứu viên Cyber Range",
      }
    }
    const parsed = JSON.parse(raw)
    return {
      github: typeof parsed?.github === "string" && parsed.github.trim() ? parsed.github : `@${defaultHandle}`,
      ctfOrg: typeof parsed?.ctfOrg === "string" && parsed.ctfOrg.trim() ? parsed.ctfOrg : "Nghiên cứu viên Cyber Range",
    }
  } catch {
    return {
      github: `@${defaultHandle}`,
      ctfOrg: "Nghiên cứu viên Cyber Range",
    }
  }
}

export function Profile() {
  const { user } = useAuth()
  const { courses, completedLessons } = useLearningStore()
  const { completedLabs } = useLabStore()

  const fullFromParts = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim()
  const learnerName =
    user?.fullName || fullFromParts || user?.username || "Nghiên cứu viên CyberPath"
  const learnerEmail = user?.email || "researcher@cyberpath.edu.vn"

  const rawHandle =
    user?.username || (user?.email ? user.email.split("@")[0] : "cyberpath-researcher")
  const cleanHandle =
    String(rawHandle).replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase() || "cyberpath-researcher"

  const isAdmin =
    Boolean(user?.roles?.includes?.("ROLE_ADMIN")) || user?.role === "Administrator"

  const [copiedKey, setCopiedKey] = useState(null) // "fingerprint" | "pgpBlock" | "link"
  const [showPublicKeyBlock, setShowPublicKeyBlock] = useState(false)
  const [settingsPrefs] = useState(readStoredSettings)

  const [handles, setHandles] = useState(() => readStoredHandles(cleanHandle))
  const [isEditingHandles, setIsEditingHandles] = useState(false)
  const [draftGithub, setDraftGithub] = useState(handles.github)
  const [draftCtfOrg, setDraftCtfOrg] = useState(handles.ctfOrg)

  const pgpPublicKeyBlock = useMemo(() => {
    return `-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: User-ID: ${learnerName} <${learnerEmail}>
Comment: Key-Algorithm: PGP RSA-4096
Comment: Fingerprint: ${PGP_FINGERPRINT}

mQINBGmK4PABEAC7x9cQ2mL8uR4sKp1wE6vZ0nT3jH5bY8aD2fW7qV4kM9pN1cX6
zL3rT8vB5hJ2nK7wM4pQ9xS1dF6gH8jK0lM2nP4qR6sT8uV0wX2yZ4aB6cD8eF0g
H2iJ4kL6mN8oP0qR2sT4uV6wX8yZ0aB2cD4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX
4yZ6aB8cD0eF2gH4iJ6kL8mN0oP2qR4sT6uV8wX0yZ2aB4cD6eF8gH0iJ2kL4mN6
oP8qR0sT2uV4wX6yZ8aB0cD2eF4gH6iJ8kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8e
ARAQABtChOZ2hpw6puIGPhu6l1IHZpw6puIEN5YmVyUGF0aCA8Q2VydD6JAk4EEwEI
ADgWIQSbguAaT3jSO8kBVaGOKXpNIgkRvAUCaYrg8AIbAwULCQgHAgYVCgkICwIE
FgIDAQIeAQIXgAAKCRCOKXpNIgkRvK9XD/9A1X7z8K2pM5nQ9vR3wT6yB4cJ8fL1
-----END PGP PUBLIC KEY BLOCK-----`
  }, [learnerName, learnerEmail])

  const competencies = useMemo(() => {
    const lessonCountByCat = (cat) =>
      courses
        .filter((c) => c.category === cat)
        .reduce((sum, c) => sum + (completedLessons[c.id]?.length || 0), 0)

    const webBoost = lessonCountByCat("web") * 2
    const socBoost = lessonCountByCat("defensive") * 2 + (completedLabs.includes("lab-05") ? 3 : 0)
    const netBoost = lessonCountByCat("network") * 2
    const cloudBoost = lessonCountByCat("cloud") * 3

    return [
      {
        name: "Kiểm thử Bảo mật Web (OWASP Top 10 · CWE-89/79)",
        level: "Chuyên sâu",
        pct: Math.min(100, 88 + webBoost),
      },
      {
        name: "Phân tích SIEM Logstash & Nhật ký Sysmon (MITRE ATT&CK)",
        level: "Thành thạo",
        pct: Math.min(100, 79 + socBoost),
      },
      {
        name: "Pháp chứng Gói tin Mạng & Wireshark (PCAP)",
        level: "Thành thạo",
        pct: Math.min(100, 75 + netBoost),
      },
      {
        name: "Mật mã học Ứng dụng & Giao thức TLS 1.3 (RFC 8446)",
        level: "Thành thạo",
        pct: 72,
      },
      {
        name: "Kiểm toán Hạ tầng Cloud & AWS IAM (NIST NICE)",
        level: "Đang phát triển",
        pct: Math.min(100, 48 + cloudBoost),
      },
    ]
  }, [courses, completedLessons, completedLabs])

  const handleCopy = async (key, text) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      // Bỏ qua nếu môi trường chặn clipboard
    }
  }

  const handleSaveHandles = (e) => {
    e.preventDefault()
    const nextHandles = {
      github: draftGithub.trim() || `@${cleanHandle}`,
      ctfOrg: draftCtfOrg.trim() || "Nghiên cứu viên Cyber Range",
    }
    setHandles(nextHandles)
    setIsEditingHandles(false)
    try {
      localStorage.setItem("cyber_profile_handles", JSON.stringify(nextHandles))
    } catch {
      // Bỏ qua lỗi bộ nhớ cục bộ
    }
  }

  const profileShareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/profile#${encodeURIComponent(cleanHandle)}`
      : `https://cyberpath.edu.vn/researchers/${cleanHandle}`

  return (
    <div className="space-y-8 pb-14 animate-fade-in-up">
      {/* ====================================================================
          §01. HỒ SƠ ĐỊNH DANH NGHIÊN CỨU VIÊN (DOSSIER IDENTITY BANNER)
         ==================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Ảnh đại diện chữ cái viết tắt */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-[#1D4ED8] dark:bg-[#2563EB] flex items-center justify-center text-white font-serif-editorial text-2xl sm:text-3xl font-semibold border border-[#1E40AF]/20 dark:border-white/10">
                {learnerName.slice(0, 2).toUpperCase()}
              </div>
              <span
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#121722] flex items-center justify-center"
                title="Trạng thái hồ sơ: Đang hoạt động"
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Thông tin định danh */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08] uppercase tracking-wider">
                  §01 // HỒ SƠ NGHIÊN CỨU VIÊN
                </span>
                <span className="font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/12 text-[#1D4ED8] dark:text-[#93C5FD] border border-blue-200 dark:border-blue-500/25">
                  {isAdmin ? "QUẢN TRỊ HỆ THỐNG // SOC" : "NGHIÊN CỨU VIÊN // BẬC 2"}
                </span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-[-0.02em]">
                {learnerName}
              </h1>

              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] font-mono-tech flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                  <span>{learnerEmail}</span>
                </span>
                <span className="text-[#D0CCC3] dark:text-white/20">&bull;</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8]" />
                  <span>Cơ sở Nghiên cứu Hà Nội</span>
                </span>
                <span className="text-[#D0CCC3] dark:text-white/20">&bull;</span>
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
                  <Flame className="h-3.5 w-3.5" />
                  <span>Chuỗi 7 ngày</span>
                </span>
              </p>

              <p className="text-xs text-[#475569] dark:text-[#94A3B8] max-w-xl leading-relaxed">
                Nghiên cứu viên an ninh mạng chuyên sâu về kiểm thử bảo mật ứng dụng Web (OWASP ASVS), xây dựng quy tắc tương quan SIEM và điều tra ứng cứu sự cố theo khung MITRE ATT&amp;CK.
              </p>
            </div>
          </div>

          {/* Nút thao tác hồ sơ */}
          <div className="flex sm:flex-col gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy("link", profileShareUrl)}
              leftIcon={
                copiedKey === "link" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )
              }
            >
              {copiedKey === "link" ? "Đã sao chép liên kết" : "Sao chép liên kết"}
            </Button>

            <Link to="/achievements">
              <Button variant="primary" size="sm" fullWidth leftIcon={<Award className="h-3.5 w-3.5" />}>
                Văn bằng &amp; Chứng chỉ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          §02. BỐ CỤC HAI CỘT: NĂNG LỰC CHUYÊN MÔN & KHÓA MẬT MÃ PGP
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI (7 CỘT) */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>Năng lực Chuyên môn đã Kiểm chứng</span>
              </h2>
              <span className="text-[11px] font-mono-tech text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-500/12 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/25">
                ĐÃ KIỂM ĐỊNH NIST NICE
              </span>
            </div>

            <div className="space-y-4">
              {competencies.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center gap-2 text-xs font-semibold">
                    <span className="text-[#0F172A] dark:text-[#F1F5F9]">{skill.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                        {skill.level}
                      </span>
                      <span className="font-mono-tech text-[#1D4ED8] dark:text-[#38BDF8] font-bold">
                        {skill.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#ECE9E2] dark:bg-[#161C2A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1D4ED8] dark:bg-[#3B82F6] rounded-full transition-all duration-500"
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ĐỊNH DANH NỀN TẢNG LIÊN KẾT */}
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>Định danh Nền tảng Liên kết</span>
              </h3>

              <button
                type="button"
                onClick={() => {
                  setDraftGithub(handles.github)
                  setDraftCtfOrg(handles.ctfOrg)
                  setIsEditingHandles((prev) => !prev)
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-medium text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer transition-colors"
              >
                <Pencil className="h-3 w-3" />
                <span>{isEditingHandles ? "Hủy" : "Cập nhật"}</span>
              </button>
            </div>

            {isEditingHandles ? (
              <form onSubmit={handleSaveHandles} className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="profile-github-handle"
                      className="block font-mono-tech text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8] mb-1"
                    >
                      Tài khoản GitHub
                    </label>
                    <input
                      id="profile-github-handle"
                      name="githubHandle"
                      type="text"
                      value={draftGithub}
                      onChange={(e) => setDraftGithub(e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 py-2 rounded-lg text-xs font-mono-tech bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-ctf-handle"
                      className="block font-mono-tech text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8] mb-1"
                    >
                      Đơn vị / Nhóm CTF
                    </label>
                    <input
                      id="profile-ctf-handle"
                      name="ctfOrganization"
                      type="text"
                      value={draftCtfOrg}
                      onChange={(e) => setDraftCtfOrg(e.target.value)}
                      placeholder="Tên nhóm nghiên cứu"
                      className="w-full px-3 py-2 rounded-lg text-xs font-mono-tech bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="h-3.5 w-3.5" />}>
                    Lưu định danh
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <GitBranch className="h-5 w-5 text-[#475569] dark:text-[#94A3B8] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] block truncate">
                        GitHub
                      </span>
                      <span className="text-[11px] text-[#475569] dark:text-[#94A3B8] font-mono-tech truncate block">
                        {handles.github}
                      </span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" className="whitespace-nowrap shrink-0">
                    Đã liên kết
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Globe className="h-5 w-5 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-[#F1F5F9] block truncate">
                        Hồ sơ Cyber Range
                      </span>
                      <span className="text-[11px] text-[#475569] dark:text-[#94A3B8] font-mono-tech truncate block">
                        {handles.ctfOrg}
                      </span>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm" className="whitespace-nowrap shrink-0">
                    Hoạt động
                  </Badge>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* CỘT PHẢI (5 CỘT): KHÓA PGP CÔNG KHAI & TRẠNG THÁI BẢO MẬT */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  Dấu vân tay Khóa Công khai PGP
                </h3>
              </div>
              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08] whitespace-nowrap shrink-0">
                PGP RSA-4096
              </span>
            </div>

            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Dùng để ký xác thực đồ án Capstone, đối chiếu mã băm SHA-256 và mã hóa báo cáo thẩm định kỹ thuật:
            </p>

            <div className="rounded-xl bg-[#0F172A] dark:bg-[#080B10] p-3.5 font-mono-tech text-[11px] text-emerald-400 break-all border border-[#1E293B] dark:border-white/[0.08]">
              {PGP_FINGERPRINT}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("fingerprint", PGP_FINGERPRINT)}
                leftIcon={
                  copiedKey === "fingerprint" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )
                }
                className="flex-1 justify-center"
              >
                {copiedKey === "fingerprint" ? "Đã chép Fingerprint" : "Sao chép Fingerprint"}
              </Button>

              <button
                type="button"
                onClick={() => setShowPublicKeyBlock((prev) => !prev)}
                aria-expanded={showPublicKeyBlock}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] transition-colors cursor-pointer whitespace-nowrap"
              >
                <FileKey2 className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>{showPublicKeyBlock ? "Ẩn khóa PGP" : "Xem khóa PGP"}</span>
                {showPublicKeyBlock ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {showPublicKeyBlock && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Khối khóa công khai ASCII-Armored
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy("pgpBlock", pgpPublicKeyBlock)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    {copiedKey === "pgpBlock" ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Đã sao chép khối khóa</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Sao chép khối khóa</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] p-3">
                  <pre className="m-0 font-mono-tech text-[10px] leading-relaxed text-slate-200 overflow-x-auto whitespace-pre">
                    {pgpPublicKeyBlock}
                  </pre>
                </div>
              </div>
            )}
          </Card>

          {/* TRẠNG THÁI XÁC THỰC HAI YẾU TỐ (ĐỒNG BỘ VỚI SETTINGS) */}
          <section className="p-6 rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] uppercase">
                <Lock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Kiểm toán Bảo mật Tài khoản</span>
              </div>
              <span
                className={`font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap shrink-0 ${
                  settingsPrefs.mfaEnabled
                    ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                    : "bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/25"
                }`}
              >
                {settingsPrefs.mfaEnabled ? "ĐÃ BẢO VỆ 2FA" : "CHƯA BẬT 2FA"}
              </span>
            </div>

            <h4 className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              {settingsPrefs.mfaEnabled
                ? settingsPrefs.mfaMethod === "totp"
                  ? "Xác thực Hai Yếu Tố: Ứng dụng TOTP"
                  : "Xác thực Hai Yếu Tố: 2FA / WebAuthn FIDO2"
                : "Xác thực Hai Yếu Tố đang Tạm tắt"}
            </h4>

            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              {settingsPrefs.mfaEnabled
                ? "Tài khoản đang được bảo vệ bằng cơ chế xác thực đa yếu tố 2FA / WebAuthn. Phiên truy cập tự động luân chuyển mã làm mới theo chu kỳ bảo mật."
                : "Khuyến nghị kích hoạt xác thực hai yếu tố 2FA / WebAuthn trong phần Cài đặt để bảo vệ khóa PGP và phiên thực hành Sandbox."}
            </p>

            <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-mono-tech text-[#475569] dark:text-[#94A3B8] bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] px-2.5 py-1 rounded-md">
                KIỂM ĐỊNH GẦN NHẤT: 08:30 UTC
              </span>

              <Link
                to="/settings"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline"
              >
                <SettingsIcon className="h-3.5 w-3.5" />
                <span>Cấu hình bảo mật</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
