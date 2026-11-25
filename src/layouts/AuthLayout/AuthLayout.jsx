import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Lock, ShieldCheck, X, FileCheck2 } from "lucide-react"
import PublicHeader from "../PublicLayout/PublicHeader"
import CyberBackground from "../../components/common/CyberBackground"
import { Button } from "../../components/common"

const POLICY_CONTENT = {
  privacy: {
    code: "DOC-SEC-01 // ZERO-LOG PRIVACY",
    title: "Chính sách Bảo mật & Dữ liệu Phiên",
    summary: "Cam kết bảo vệ danh tính học viên và nguyên tắc xử lý dữ liệu tối thiểu trên CyberPath.",
    items: [
      {
        heading: "1. Nguyên tắc Zero-Log trong Sandbox",
        body: "Lệnh thực thi, payload thử nghiệm và lưu lượng phân tích bên trong phòng thí nghiệm cô lập được cô lập theo phiên và tự động giải phóng khi kết thúc, không lưu giữ cho mục đích theo dõi cá nhân.",
      },
      {
        heading: "2. Bảo vệ Phiên & Thông tin Định danh",
        body: "Kết nối được bảo vệ bằng mã hóa TLS 1.3; thông tin xác thực áp dụng cơ chế chống vét cạn mật khẩu, giới hạn tần suất truy cập và phản hồi chống dò tìm tài khoản (anti-enumeration).",
      },
      {
        heading: "3. Dữ liệu Học tập & Chứng chỉ",
        body: "Nền tảng chỉ lưu trữ hồ sơ học viên tối thiểu, tiến độ hoàn thành chuyên đề và chữ ký xác thực chứng chỉ công khai khi bạn chủ động đăng ký và xác nhận hoàn thành.",
      },
    ],
  },
  terms: {
    code: "DOC-ETH-02 // LAB CODE OF CONDUCT",
    title: "Quy chế Học thuật & Sử dụng Lab",
    summary: "Chuẩn mực đạo đức nghề nghiệp và quy định an toàn khi vận hành môi trường thực nghiệm.",
    items: [
      {
        heading: "1. Giới hạn Thực nghiệm trong Phạm vi Cô lập",
        body: "Mọi hoạt động kiểm thử lỗ hổng, phân tích giao thức và mô phỏng tấn công phòng thủ chỉ được phép tiến hành trên các mục tiêu ảo hóa thuộc hạ tầng Sandbox của CyberPath.",
      },
      {
        heading: "2. Nghiêm cấm Truy cập Trái phép Bên ngoài",
        body: "Nghiêm cấm sử dụng kỹ thuật, công cụ hoặc tài nguyên học tập để dò quét, khai thác hoặc gây gián đoạn bất kỳ hệ thống, mạng hay dịch vụ nào nằm ngoài phạm vi cho phép.",
      },
      {
        heading: "3. Liêm chính Học thuật & Quyền sở hữu",
        body: "Học viên cam kết tự thực hiện bài đánh giá năng lực, không phát tán lời giải flag hoặc can thiệp vào hệ thống chấm điểm tự động. Mọi hành vi vi phạm sẽ bị thu hồi quyền truy cập Lab.",
      },
    ],
  },
}

/**
 * Centered Editorial Authentication Layout ("Academic Research Atelier").
 * - Retains persistent sticky PublicHeader across authentication flows.
 * - Supports strictly 2 themes: Editorial Light (#FAF9F6) & Deep Obsidian Dark (#0B0E14).
 * - Calm archival framing with JetBrains Mono security assurance metadata and interactive Vietnamese policy dialog.
 */
export function AuthLayout({ children }) {
  const [activePolicy, setActivePolicy] = useState(null)

  // Close policy modal on Escape and lock background scroll while open
  useEffect(() => {
    if (!activePolicy) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActivePolicy(null)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activePolicy])

  const currentDoc = activePolicy ? POLICY_CONTENT[activePolicy] : null

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] flex flex-col justify-between relative overflow-x-hidden font-sans selection:bg-[#1D4ED8]/15 selection:text-[#1D4ED8] dark:selection:bg-[#3B82F6]/25 dark:selection:text-[#38BDF8] transition-colors duration-200">
      {/* Subtle Archival / Obsidian Backdrop */}
      <CyberBackground />

      {/* Persistent Public Header */}
      <PublicHeader />

      {/* Refined Security Assurance Pill */}
      <div className="relative z-10 pt-5 sm:pt-7 flex justify-center px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-2xs text-[11px] font-mono-tech text-[#475569] dark:text-[#94A3B8]">
          <ShieldCheck className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" aria-hidden="true" />
          <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">MÃ HÓA TLS 1.3</span>
          <span className="text-[#D0CCC3] dark:text-white/20" aria-hidden="true">/</span>
          <span className="text-[#475569] dark:text-[#94A3B8]">SANDBOX CÔ LẬP</span>
        </div>
      </div>

      {/* Main Centered Auth Card */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-[464px] mx-auto">
          <div className="bg-white dark:bg-[#121722] rounded-2xl border border-[#E5E2DC] dark:border-white/[0.08] shadow-[0_12px_36px_-12px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.65)] p-6 sm:p-8 relative">
            {children}
          </div>

          {/* Under-Card Security Assurance */}
          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#64748B] dark:text-[#94A3B8]/80 select-none">
            <Lock className="h-3 w-3 text-[#64748B] dark:text-[#64748B] shrink-0" aria-hidden="true" />
            <span>Xác thực phiên chuẩn mực &middot; Chống dò quét mật khẩu &middot; Môi trường cô lập</span>
          </div>
        </div>
      </main>

      {/* Unified Vietnamese Archival Footer */}
      <footer className="relative z-10 py-5 px-4 flex flex-col items-center justify-center gap-3 text-xs text-[#475569] dark:text-[#94A3B8] text-center border-t border-[#E5E2DC] dark:border-white/[0.08] bg-[#F3F1EC]/85 dark:bg-[#0B0E14]/90 backdrop-blur-xs">
        {/* Academic & Security Framework Citations */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono-tech">
          <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]">
            MITRE ATT&amp;CK
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]">
            NIST CSF
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]">
            OWASP ASVS
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]">
            ISO/IEC 27001
          </span>
        </div>

        {/* Standardized Vietnamese Links & Status */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[#475569] dark:text-[#94A3B8]">
          <span>&copy; {new Date().getFullYear()} CyberPath Academy.</span>
          <span className="text-[#D0CCC3] dark:text-white/20" aria-hidden="true">&middot;</span>
          <Link
            to="/"
            className="font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
          >
            Trang chủ Nền tảng
          </Link>
          <span className="text-[#D0CCC3] dark:text-white/20" aria-hidden="true">&middot;</span>
          <button
            type="button"
            onClick={() => setActivePolicy("privacy")}
            className="font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            Chính sách Bảo mật
          </button>
          <span className="text-[#D0CCC3] dark:text-white/20" aria-hidden="true">&middot;</span>
          <button
            type="button"
            onClick={() => setActivePolicy("terms")}
            className="font-medium text-[#0F172A] dark:text-[#F1F5F9] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            Quy chế Học thuật &amp; Sử dụng Lab
          </button>
          <span className="text-[#D0CCC3] dark:text-white/20" aria-hidden="true">&middot;</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block" aria-hidden="true" />
            <span>Hệ thống vận hành ổn định</span>
          </span>
        </div>
      </footer>

      {/* Editorial Policy & Lab Code of Conduct Modal */}
      {currentDoc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-policy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0F172A]/45 dark:bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setActivePolicy(null)}
            aria-hidden="true"
          />

          {/* Dialog Surface */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] shadow-[0_24px_60px_-16px_rgba(15,23,42,0.25)] dark:shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] p-6 sm:p-7 text-left animate-in zoom-in-95 fade-in duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[10px] font-mono-tech font-medium text-[#1D4ED8] dark:text-[#38BDF8] tracking-wide uppercase">
                  <FileCheck2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>{currentDoc.code}</span>
                </div>
                <h2
                  id="auth-policy-modal-title"
                  className="font-serif-editorial text-xl sm:text-2xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-snug"
                >
                  {currentDoc.title}
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {currentDoc.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="shrink-0 p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                aria-label="Đóng hộp thoại"
                title="Đóng hộp thoại"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Policy Switcher Tabs */}
            <div className="mt-4 inline-flex p-1 rounded-xl bg-[#F3F1EC] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] gap-1">
              <button
                type="button"
                onClick={() => setActivePolicy("privacy")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activePolicy === "privacy"
                    ? "bg-white dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC] dark:border-white/[0.08]"
                    : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                }`}
              >
                Chính sách Bảo mật
              </button>
              <button
                type="button"
                onClick={() => setActivePolicy("terms")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activePolicy === "terms"
                    ? "bg-white dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] shadow-2xs border border-[#E5E2DC] dark:border-white/[0.08]"
                    : "text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                }`}
              >
                Quy chế Học thuật &amp; Lab
              </button>
            </div>

            {/* Policy Clauses */}
            <div className="mt-4 space-y-3">
              {currentDoc.items.map((item) => (
                <div
                  key={item.heading}
                  className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-1"
                >
                  <h3 className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    {item.heading}
                  </h3>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-5 pt-4 border-t border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-end">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setActivePolicy(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthLayout
