import { useState } from "react"
import {
  Smartphone,
  Bell,
  Terminal,
  Laptop,
  Check,
  Save,
  RotateCcw,
  ShieldCheck,
} from "lucide-react"
import { Card, Button } from "../../components/common"

const STORAGE_KEY = "cyber_settings_prefs"

const DEFAULT_PREFS = {
  mfaEnabled: true,
  mfaMethod: "webauthn",
  sandboxTimeout: "30",
  telemetryVerbosity: "verbose",
  cveAlerts: true,
  labReminders: true,
  weeklyDigest: false,
}

const VALID_TIMEOUTS = new Set(["15", "30", "60"])
const VALID_VERBOSITIES = new Set(["compact", "verbose", "raw_hex"])
const VALID_MFA_METHODS = new Set(["webauthn", "totp"])

const TELEMETRY_OPTIONS = [
  { id: "compact", label: "Rút gọn", sub: "Compact" },
  { id: "verbose", label: "Chi tiết", sub: "Verbose" },
  { id: "raw_hex", label: "Mã Hex thô", sub: "Raw Hex" },
]

const INITIAL_SESSIONS = [
  {
    id: "sess-current",
    device: "Trình duyệt Hiện tại · Phiên Xác thực HTTPS",
    location: "Hà Nội, Việt Nam · IP nội bộ",
    isCurrent: true,
  },
  {
    id: "sess-secondary",
    device: "Trạm Nghiên cứu Linux · Firefox ESR",
    location: "Đà Nẵng, Việt Nam · 14.161.42.10",
    isCurrent: false,
  },
]

function loadSettingsPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return DEFAULT_PREFS

    return {
      mfaEnabled:
        typeof parsed.mfaEnabled === "boolean"
          ? parsed.mfaEnabled
          : DEFAULT_PREFS.mfaEnabled,
      mfaMethod: VALID_MFA_METHODS.has(parsed.mfaMethod)
        ? parsed.mfaMethod
        : DEFAULT_PREFS.mfaMethod,
      sandboxTimeout: VALID_TIMEOUTS.has(String(parsed.sandboxTimeout))
        ? String(parsed.sandboxTimeout)
        : DEFAULT_PREFS.sandboxTimeout,
      telemetryVerbosity: VALID_VERBOSITIES.has(parsed.telemetryVerbosity)
        ? parsed.telemetryVerbosity
        : DEFAULT_PREFS.telemetryVerbosity,
      cveAlerts:
        typeof parsed.cveAlerts === "boolean"
          ? parsed.cveAlerts
          : DEFAULT_PREFS.cveAlerts,
      labReminders:
        typeof parsed.labReminders === "boolean"
          ? parsed.labReminders
          : DEFAULT_PREFS.labReminders,
      weeklyDigest:
        typeof parsed.weeklyDigest === "boolean"
          ? parsed.weeklyDigest
          : DEFAULT_PREFS.weeklyDigest,
    }
  } catch {
    return DEFAULT_PREFS
  }
}

function persistSettingsPrefs(nextPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPrefs))
  } catch {
    // Bỏ qua lỗi hạn mức lưu trữ trình duyệt
  }
}

export function Settings() {
  const [prefs, setPrefs] = useState(loadSettingsPrefs)
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const [saveMessage, setSaveMessage] = useState("")

  const triggerToast = (msg) => {
    setSaveMessage(msg)
    window.setTimeout(() => {
      setSaveMessage((current) => (current === msg ? "" : current))
    }, 2600)
  }

  const updatePref = (key, value) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value }
      persistSettingsPrefs(next)
      return next
    })
  }

  const handleSave = (e) => {
    e.preventDefault()
    persistSettingsPrefs(prefs)
    triggerToast("Đã lưu và đồng bộ cấu hình cục bộ")
  }

  const handleResetDefaults = () => {
    setPrefs(DEFAULT_PREFS)
    persistSettingsPrefs(DEFAULT_PREFS)
    triggerToast("Đã khôi phục thiết lập mặc định an toàn")
  }

  const handleRevokeSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    triggerToast("Đã thu hồi phiên truy cập từ xa")
  }

  return (
    <div className="space-y-8 pb-14 animate-fade-in-up">
      {/* ====================================================================
          §01. TIÊU ĐỀ CẤU HÌNH HỆ THỐNG & KIỂM SOÁT BẢO MẬT
         ==================================================================== */}
      <section className="rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#1D4ED8] dark:bg-[#3B82F6] text-white uppercase tracking-[0.08em]">
                §01 // CẤU HÌNH NỀN TẢNG
              </span>
              <span
                className={`font-mono-tech text-[11px] font-semibold px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5 ${
                  prefs.mfaEnabled
                    ? "bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25"
                    : "bg-amber-50 dark:bg-amber-500/12 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/25"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>
                  {prefs.mfaEnabled ? "HỒ SƠ ĐÃ TĂNG CƯỜNG 2FA" : "CẦN BẬT XÁC THỰC 2FA"}
                </span>
              </span>
            </div>

            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#0F172A] dark:text-[#F1F5F9] tracking-[-0.02em]">
              Kiểm soát Bảo mật &amp; Cấu hình Sandbox
            </h1>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Thiết lập xác thực đa yếu tố (2FA / WebAuthn), thời gian thu hồi máy ảo cô lập và ngưỡng cảnh báo lỗ hổng trên nền tảng. Mọi thay đổi được lưu bền vững vào trình duyệt của bạn.
            </p>
          </div>

          {saveMessage && (
            <div
              role="status"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/12 border border-emerald-200 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shrink-0"
            >
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          §02. CÁC NHÓM TÙY CHỌN BẢO MẬT & PHÒNG THÍ NGHIỆM
         ==================================================================== */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: XÁC THỰC & CẤU HÌNH SANDBOX (7 CỘT) */}
        <div className="lg:col-span-7 space-y-6">
          {/* XÁC THỰC HAI YẾU TỐ (2FA / WEBAUTHN) */}
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/12 border border-blue-200/80 dark:border-blue-500/25 flex items-center justify-center text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                    Xác thực Hai Yếu Tố (2FA / WebAuthn)
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Bảo vệ tài khoản bằng khóa phần cứng FIDO2 hoặc ứng dụng tạo mã TOTP.
                  </p>
                </div>
              </div>

              <button
                id="settings-mfa-toggle"
                type="button"
                role="switch"
                aria-checked={prefs.mfaEnabled}
                aria-label="Bật hoặc tắt xác thực hai yếu tố 2FA / WebAuthn"
                onClick={() => updatePref("mfaEnabled", !prefs.mfaEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6] ${
                  prefs.mfaEnabled ? "bg-[#1D4ED8] dark:bg-[#3B82F6]" : "bg-[#D0CCC3] dark:bg-[#1B2335]"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                    prefs.mfaEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-mono-tech flex items-center justify-between gap-2">
                <span className="text-[#475569] dark:text-[#94A3B8]">TRẠNG THÁI 2FA:</span>
                <span
                  className={`font-bold ${
                    prefs.mfaEnabled
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {prefs.mfaEnabled ? "ĐANG KÍCH HOẠT" : "ĐÃ TẠM TẮT"}
                </span>
              </div>

              <div>
                <label htmlFor="settings-mfa-method" className="sr-only">
                  Phương thức xác thực chính
                </label>
                <select
                  id="settings-mfa-method"
                  name="mfaMethod"
                  value={prefs.mfaMethod}
                  onChange={(e) => updatePref("mfaMethod", e.target.value)}
                  disabled={!prefs.mfaEnabled}
                  className="w-full h-full px-3 py-2.5 rounded-xl text-xs font-mono-tech bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] disabled:opacity-50"
                >
                  <option value="webauthn">Khóa phần cứng FIDO2 / WebAuthn</option>
                  <option value="totp">Ứng dụng mã OTP (TOTP RFC 6238)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* VÒNG ĐỜI MÁY ẢO SANDBOX & TERMINAL */}
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-500/12 border border-blue-200/80 dark:border-blue-500/25 flex items-center justify-center text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  Vòng đời Sandbox &amp; Giao diện Terminal
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Thiết lập thời hạn thu hồi container khi nhàn rỗi và độ chi tiết nhật ký thực thi.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label
                  htmlFor="settings-sandbox-timeout"
                  className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech block mb-1.5"
                >
                  THỜI GIAN TỰ THU HỒI CONTAINER NHÀN RỖI:
                </label>
                <select
                  id="settings-sandbox-timeout"
                  name="sandboxTimeout"
                  value={prefs.sandboxTimeout}
                  onChange={(e) => updatePref("sandboxTimeout", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs sm:text-sm bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] font-mono-tech"
                >
                  <option value="15">15 phút (Thu hồi RAM nhanh khi nhàn rỗi)</option>
                  <option value="30">30 phút (Mức khuyến nghị mặc định)</option>
                  <option value="60">60 phút (Phù hợp bài kiểm thử xâm nhập dài)</option>
                </select>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech block mb-1.5">
                  MỨC ĐỘ CHI TIẾT NHẬT KÝ TELEMETRY:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {TELEMETRY_OPTIONS.map((mode) => {
                    const isSelected = prefs.telemetryVerbosity === mode.id
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => updatePref("telemetryVerbosity", mode.id)}
                        aria-pressed={isSelected}
                        className={`p-2.5 rounded-xl text-center border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#1D4ED8] dark:bg-[#3B82F6] text-white border-[#1D4ED8] dark:border-[#3B82F6]"
                            : "bg-[#FAF9F6] dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6]"
                        }`}
                      >
                        <span className="block text-xs font-semibold">{mode.label}</span>
                        <span
                          className={`block text-[10px] font-mono-tech ${
                            isSelected ? "text-blue-100" : "text-[#64748B] dark:text-[#94A3B8]"
                          }`}
                        >
                          {mode.sub}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* PHIÊN ĐĂNG NHẬP ĐANG HOẠT ĐỘNG */}
          <Card variant="flat" padding="lg" className="space-y-4">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
              <Laptop className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>Phiên Đăng nhập Đang Hoạt động</span>
            </h2>

            <div className="space-y-2.5">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                    session.isCurrent
                      ? "bg-blue-50/70 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/25"
                      : "bg-[#FAF9F6] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08]"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2 flex-wrap">
                      <span>{session.device}</span>
                      {session.isCurrent && (
                        <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#1D4ED8] dark:bg-[#3B82F6] text-white">
                          HIỆN TẠI
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] font-mono-tech mt-0.5">
                      {session.location}
                    </div>
                  </div>

                  {session.isCurrent ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono-tech font-bold text-[11px]">
                      ĐANG HOẠT ĐỘNG
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-rose-700 dark:text-rose-400 hover:underline font-mono-tech font-semibold text-[11px] cursor-pointer"
                    >
                      Thu hồi phiên
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* CỘT PHẢI: THÔNG BÁO & LƯU CẤU HÌNH (5 CỘT) */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="flat" padding="lg" className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                Thông báo Tình báo Mối đe dọa &amp; Thực hành
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              <label htmlFor="settings-cve-alerts" className="flex items-start gap-3 cursor-pointer">
                <input
                  id="settings-cve-alerts"
                  name="cveAlerts"
                  type="checkbox"
                  checked={prefs.cveAlerts}
                  onChange={(e) => updatePref("cveAlerts", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D0CCC3] dark:border-white/20 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9] block">
                    Bản tin Lỗ hổng Zero-Day &amp; CVE Khẩn cấp
                  </span>
                  <span className="text-[#475569] dark:text-[#94A3B8] block leading-relaxed">
                    Nhận cảnh báo ngay khi có bài thí nghiệm mới cho lỗ hổng nghiêm trọng (CVSS &ge; 9.0).
                  </span>
                </div>
              </label>

              <label htmlFor="settings-lab-reminders" className="flex items-start gap-3 cursor-pointer">
                <input
                  id="settings-lab-reminders"
                  name="labReminders"
                  type="checkbox"
                  checked={prefs.labReminders}
                  onChange={(e) => updatePref("labReminders", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D0CCC3] dark:border-white/20 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9] block">
                    Cảnh báo Thu hồi &amp; Hết hạn Phòng Lab
                  </span>
                  <span className="text-[#475569] dark:text-[#94A3B8] block leading-relaxed">
                    Thông báo trước 5 phút khi phiên Sandbox không hoạt động sắp bị giải phóng tài nguyên.
                  </span>
                </div>
              </label>

              <label htmlFor="settings-weekly-digest" className="flex items-start gap-3 cursor-pointer">
                <input
                  id="settings-weekly-digest"
                  name="weeklyDigest"
                  type="checkbox"
                  checked={prefs.weeklyDigest}
                  onChange={(e) => updatePref("weeklyDigest", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D0CCC3] dark:border-white/20 text-[#1D4ED8] focus:ring-[#1D4ED8]"
                />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-[#0F172A] dark:text-[#F1F5F9] block">
                    Báo cáo Tổng hợp Tiến độ Hàng tuần
                  </span>
                  <span className="text-[#475569] dark:text-[#94A3B8] block leading-relaxed">
                    Gửi tóm tắt số giờ thực hành Sandbox, điểm XP và khuyến nghị học phần theo khung NIST NICE.
                  </span>
                </div>
              </label>
            </div>
          </Card>

          {/* HÀNH ĐỘNG LƯU & KHÔI PHỤC */}
          <div className="p-6 rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              leftIcon={<Save className="h-4 w-4" />}
            >
              Lưu Cấu Hình Nền Tảng
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleResetDefaults}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Khôi phục mặc định
            </Button>

            <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] text-center font-mono-tech leading-relaxed pt-1">
              Thiết lập được lưu tại khóa cục bộ <code className="text-[#1D4ED8] dark:text-[#38BDF8]">cyber_settings_prefs</code> và áp dụng ngay cho hồ sơ Sandbox của bạn.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Settings
