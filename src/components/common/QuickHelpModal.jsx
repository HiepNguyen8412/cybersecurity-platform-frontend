import { useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  X, 
  BookOpen, 
  CreditCard, 
  Mail, 
  Compass, 
  MessageSquare,
  FlaskConical
} from "lucide-react"

/**
 * QuickHelpModal
 * Interactive assistance dialog triggered by the floating '?' button on public pages.
 * Provides immediate answers, navigational shortcuts, and support channels.
 */
export default function QuickHelpModal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  const quickFaqs = [
    {
      q: "Tôi có cần cài đặt máy ảo hay phần mềm nào không?",
      a: "Hoàn toàn không! Mọi phòng lab đều chạy trong container cô lập trên đám mây, tích hợp sẵn terminal tương tác, bộ bắt gói tin và trình soạn thảo code ngay trên trình duyệt.",
    },
    {
      q: "Tôi có thể bắt đầu rèn luyện miễn phí không?",
      a: "Có! Gói Cộng Đồng bao gồm 25+ phòng lab nền tảng, sơ đồ ánh xạ MITRE ATT&CK và các bài học cốt lõi hoàn toàn miễn phí, không yêu cầu thẻ tín dụng.",
    },
    {
      q: "Xem chi tiết bảng giá và gói tài khoản ở đâu?",
      a: "Truy cập trang Bảng Giá để so sánh quyền lợi giữa các gói Miễn phí, Chuyên viên Pro (699.000đ/tháng) và Doanh nghiệp.",
      linkTo: "/pricing",
      linkText: "Xem bảng giá chi tiết →",
    },
  ]

  const quickLinks = [
    {
      label: "Phòng Lab Thực Chiến",
      desc: "120+ môi trường giả lập cô lập",
      to: "/labs",
      icon: FlaskConical,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      label: "Lộ Trình Chuyên Môn",
      desc: "Lộ trình đào tạo SOC & Red Team",
      to: "/learning-paths",
      icon: Compass,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      label: "Giáo Trình Tác Chiến",
      desc: "Khóa học phòng thủ chuyên sâu",
      to: "/learning",
      icon: BookOpen,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
    {
      label: "Bảng Giá & Gói Cước",
      desc: "Chi tiết các gói thành viên & tổ chức",
      to: "/pricing",
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 cyberpunk:bg-[#071022] rounded-3xl shadow-2xl dark:shadow-black/80 cyberpunk:shadow-sm border border-slate-200 dark:border-slate-800 cyberpunk:border-cyan-500/50 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/30 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 cyberpunk:from-[#071022] cyberpunk:via-[#09152b] cyberpunk:to-[#0c1e3d]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-lg font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
                Trung Tâm Hỗ Trợ & Lối Tắt Nhanh
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300/80">
                Các câu hỏi thường gặp & hướng dẫn điều hướng nền tảng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close help modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-slate-600">
          {/* Section 1: Quick Navigation Shortcuts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-tech">
              LỐI TẮT TRUY CẬP NHANH
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {quickLinks.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={onClose}
                    className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/30 bg-white dark:bg-slate-800/80 cyberpunk:bg-[#0d1e3d] hover:border-blue-300 dark:hover:border-cyan-500/50 hover:bg-blue-50/30 dark:hover:bg-slate-700/80 transition-all flex items-start gap-3 group cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-50 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors text-xs sm:text-sm">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Section 2: Frequently Asked Questions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono-tech">
              CÂU HỎI THƯỜNG GẶP
            </h3>
            <div className="space-y-3">
              {quickFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 cyberpunk:bg-[#050c1b] border border-slate-200/70 dark:border-slate-700/70 cyberpunk:border-cyan-500/30 space-y-1 text-xs"
                >
                  <div className="font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-100 flex items-center gap-1.5">
                    <span className="text-blue-600 font-mono-tech">Q:</span> {faq.q}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 cyberpunk:text-slate-300 leading-relaxed pl-4">
                    {faq.a}
                  </p>
                  {faq.linkTo && (
                    <div className="pl-4 pt-1">
                      <Link
                        to={faq.linkTo}
                        onClick={onClose}
                        className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        {faq.linkText}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Contact & Support */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                Bạn vẫn cần hỗ trợ kỹ thuật?
              </div>
              <div className="text-[11px] text-blue-800/80">
                Đội ngũ chuyên gia an ninh mạng và kỹ sư của chúng tôi luôn sẵn sàng giải đáp.
              </div>
            </div>
            <a
              href="mailto:support@cyberpath.io"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Liên Hệ Hỗ Trợ</span>
            </a>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 cyberpunk:bg-[#030712] border-t border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/30 flex items-center justify-between text-xs text-slate-500 font-mono-tech px-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-slate-600">Hệ Thống Thao Trường: Hoạt Động 100%</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close ESC
          </button>
        </div>
      </div>
    </div>
  )
}
