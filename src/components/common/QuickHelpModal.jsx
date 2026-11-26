import { useEffect } from "react"
import { Link } from "react-router-dom"
import {
  X,
  BookOpen,
  CreditCard,
  Mail,
  Compass,
  MessageSquare,
  FlaskConical,
  Cpu,
  BadgeCheck,
} from "lucide-react"

/**
 * QuickHelpModal
 * Interactive assistance dialog triggered by the floating '?' button on public pages.
 * Provides immediate answers, navigational shortcuts, and support channels.
 */
export function QuickHelpModal({ isOpen, onClose }) {
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
      a: "Hoàn toàn không. Mọi phòng lab đều chạy trong container cô lập trên đám mây, tích hợp sẵn terminal tương tác, bộ phân tích gói tin và trình biên tập ngay trên trình duyệt.",
    },
    {
      q: "Tôi có thể bắt đầu rèn luyện miễn phí không?",
      a: "Có. Gói Cộng Đồng bao gồm các bài lab nền tảng, sơ đồ ánh xạ MITRE ATT&CK và học phần cốt lõi hoàn toàn miễn phí, không yêu cầu thẻ thanh toán.",
    },
    {
      q: "Xem chi tiết bảng giá và gói tài khoản ở đâu?",
      a: "Truy cập trang Bảng Giá để đối chiếu quyền lợi giữa các gói Miễn phí, Chuyên viên Pro và Doanh nghiệp/Đại học.",
      linkTo: "/pricing",
      linkText: "Xem bảng giá chi tiết →",
    },
  ]

  const quickLinks = [
    {
      label: "Phòng Lab Thực Chiến",
      desc: "Môi trường container cô lập trên trình duyệt",
      to: "/labs",
      icon: FlaskConical,
      color:
        "text-[#1D4ED8] dark:text-[#38BDF8] bg-[#EFF6FF] dark:bg-[#3B82F6]/12 border-[#BFDBFE] dark:border-[#3B82F6]/25",
    },
    {
      label: "AI Research Workbench",
      desc: "Phân tích AST, CWE và phản biện phòng thủ",
      to: "/workbench",
      icon: Cpu,
      color:
        "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/12 border-indigo-200 dark:border-indigo-500/25",
    },
    {
      label: "Lộ Trình Chuyên Môn",
      desc: "Chương trình đào tạo SOC & Kỹ sư Bảo mật",
      to: "/learning-paths",
      icon: Compass,
      color:
        "text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/12 border-sky-200 dark:border-sky-500/25",
    },
    {
      label: "Giáo Trình Học Thuật",
      desc: "Khóa học lý thuyết & phòng thủ chuyên sâu",
      to: "/learning",
      icon: BookOpen,
      color:
        "text-slate-700 dark:text-slate-300 bg-[#F3F1EC] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.1]",
    },
    {
      label: "Xác Thực Chứng Chỉ",
      desc: "Tra cứu mã băm SHA-256 & chữ ký số PGP",
      to: "/verify",
      icon: BadgeCheck,
      color:
        "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/25",
    },
    {
      label: "Bảng Giá & Gói Cước",
      desc: "Chi tiết gói thành viên & tổ chức đào tạo",
      to: "/pricing",
      icon: CreditCard,
      color:
        "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/12 border-amber-200 dark:border-amber-500/25",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      {/* Nền mờ hộp thoại */}
      <div
        className="fixed inset-0 bg-[#0F172A]/55 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Thẻ hộp thoại chính */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121722] rounded-2xl shadow-2xl dark:shadow-black/80 border border-[#E5E2DC] dark:border-white/[0.09] overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Đầu hộp thoại */}
        <div className="p-5 sm:p-6 border-b border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between bg-[#FAF9F6] dark:bg-[#0E131D]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8] dark:bg-[#2563EB] text-white shrink-0">
              <BookOpen className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div>
              <h2
                id="help-modal-title"
                className="font-serif-editorial text-xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight"
              >
                Trung Tâm Hỗ Trợ &amp; Lối Tắt Nhanh
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                Các câu hỏi thường gặp và hướng dẫn điều hướng nền tảng
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
            aria-label="Đóng hộp thoại trợ giúp"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung cuộn */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-[#475569] dark:text-[#94A3B8]">
          {/* Phần 1: Lối tắt điều hướng */}
          <div>
            <h3 className="text-[11px] font-mono-tech font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8] mb-3">
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
                    className="p-3 rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#161C2A]/60 hover:border-[#1D4ED8]/45 dark:hover:border-[#3B82F6]/45 hover:bg-[#FAF9F6] dark:hover:bg-[#161C2A] transition-colors flex items-start gap-3 group cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${item.color}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors text-xs sm:text-sm truncate">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Phần 2: Câu hỏi thường gặp */}
          <div>
            <h3 className="text-[11px] font-mono-tech font-semibold uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8] mb-3">
              CÂU HỎI THƯỜNG GẶP
            </h3>
            <div className="space-y-2.5">
              {quickFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A]/70 border border-[#E5E2DC] dark:border-white/[0.08] space-y-1 text-xs"
                >
                  <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] flex items-start gap-1.5">
                    <span className="text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech shrink-0">
                      Hỏi:
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-[#475569] dark:text-[#94A3B8] leading-relaxed pl-8">
                    {faq.a}
                  </p>
                  {faq.linkTo && (
                    <div className="pl-8 pt-1">
                      <Link
                        to={faq.linkTo}
                        onClick={onClose}
                        className="text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1"
                      >
                        {faq.linkText}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Phần 3: Liên hệ & Hỗ trợ */}
          <div className="p-4 rounded-xl bg-[#EFF6FF] dark:bg-[#3B82F6]/10 border border-[#BFDBFE] dark:border-[#3B82F6]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                Bạn vẫn cần hỗ trợ kỹ thuật?
              </div>
              <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                Đội ngũ chuyên gia an ninh mạng và kỹ sư của chúng tôi luôn sẵn sàng giải đáp.
              </div>
            </div>
            <a
              href="mailto:support@cyberpath.io"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white font-semibold text-xs transition-colors shrink-0 cursor-pointer"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Liên Hệ Hỗ Trợ</span>
            </a>
          </div>
        </div>

        {/* Chân hộp thoại */}
        <div className="py-3.5 px-6 bg-[#FAF9F6] dark:bg-[#0E131D] border-t border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] font-mono-tech">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
              Hệ Thống Thao Trường: Sẵn Sàng Hoạt Động
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] cursor-pointer"
          >
            Đóng (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuickHelpModal
