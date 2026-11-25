import { Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full bg-[#F3F1EC] dark:bg-[#080B10] text-[#475569] dark:text-[#94A3B8] border-t border-[#E5E2DC] dark:border-white/[0.08] transition-colors select-none">
      {/* Khối liên kết chính */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Cột 1 & 2: Định danh Học viện & Sứ mệnh học thuật */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6] rounded-lg group"
              title="CyberPath — Học viện An ninh mạng"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D4ED8] dark:bg-[#2563EB] text-white border border-[#1E40AF]/20 dark:border-white/[0.12] transition-colors group-hover:bg-[#1E40AF] dark:group-hover:bg-[#3B82F6]">
                <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-editorial text-xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-none">
                  Cyber<span className="text-[#1D4ED8] dark:text-[#38BDF8]">Path</span>
                </span>
                <span className="text-[9.5px] font-mono-tech font-medium tracking-[0.14em] uppercase text-[#64748B] dark:text-[#94A3B8] mt-1 leading-none">
                  HỌC VIỆN AN NINH MẠNG
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-sm">
              Học viện nghiên cứu và thực nghiệm an ninh mạng chuẩn mực. Kết hợp lý thuyết giao thức hình thức (RFC, MITRE ATT&amp;CK, CWE), môi trường sandbox cô lập trên trình duyệt và xác thực chứng chỉ mật mã.
            </p>

            {/* Trạng thái vận hành hạ tầng thực nghiệm */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech text-[#475569] dark:text-[#94A3B8]">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">SLA 99.98%</span>
                <span className="text-[#CBD5E1] dark:text-white/20">&bull;</span>
                <span>Sandbox Thí Nghiệm Trực Tuyến</span>
              </div>
            </div>

            {/* Liên kết cộng đồng kỹ thuật */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub của CyberPath"
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-center text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] hover:border-[#1D4ED8]/40 dark:hover:border-[#38BDF8]/40 transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter) của CyberPath"
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-center text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] hover:border-[#1D4ED8]/40 dark:hover:border-[#38BDF8]/40 transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cộng đồng Discord CyberPath"
                className="w-9 h-9 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-center text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] hover:border-[#1D4ED8]/40 dark:hover:border-[#38BDF8]/40 transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cột 3: Hệ thống Học thuật */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-[0.12em] font-mono-tech">
              Hệ Thống Học Thuật
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/learning"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Khóa học &amp; Giáo trình MITRE
                </Link>
              </li>
              <li>
                <Link
                  to="/learning-paths"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Lộ trình Đào tạo Chuyên sâu
                </Link>
              </li>
              <li>
                <Link
                  to="/labs"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Phòng Lab Sandbox Cô lập
                </Link>
              </li>
              <li>
                <Link
                  to="/workbench"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  AI Workbench (Phân tích CVE/AST)
                </Link>
              </li>
              <li>
                <Link
                  to="/verify"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Xác thực Chứng chỉ (PGP/SHA-256)
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors font-medium"
                >
                  Bảng giá &amp; Học bổng Nghiên cứu
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Chuyên đề Thực nghiệm */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-[0.12em] font-mono-tech">
              Chuyên Đề Thực Nghiệm
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/labs"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Bảo mật Ứng dụng Web (OWASP ASVS)
                </Link>
              </li>
              <li>
                <Link
                  to="/labs"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Pháp chứng Bộ nhớ &amp; Gói tin (PCAP)
                </Link>
              </li>
              <li>
                <Link
                  to="/learning"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Mật mã &amp; Giao thức (RFC 8446)
                </Link>
              </li>
              <li>
                <Link
                  to="/labs"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Săn lùng Mối đe dọa (MITRE ATT&amp;CK)
                </Link>
              </li>
              <li>
                <Link
                  to="/learning-paths"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Kiến trúc Phòng thủ Cloud (NIST)
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 5: Tiêu chuẩn & Minh bạch */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-[0.12em] font-mono-tech">
              Tiêu Chuẩn &amp; Minh Bạch
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to="/verify"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Cổng Tra cứu Văn bằng Công khai
                </Link>
              </li>
              <li>
                <Link
                  to="/workbench"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Trợ lý Nghiên cứu Lỗ hổng AI
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Không gian Học tập Cá nhân
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Quy chế Học thuật &amp; Đạo đức Lab
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[#475569] dark:text-[#94A3B8] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors"
                >
                  Chính sách Bảo mật Dữ liệu
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Thanh bản quyền & trích dẫn chuẩn mực */}
      <div className="border-t border-[#E5E2DC] dark:border-white/[0.08] bg-[#ECE9E2]/60 dark:bg-[#06080C] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B] dark:text-[#64748B]">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 text-center md:text-left">
            <span className="font-medium text-[#0F172A] dark:text-[#94A3B8]">
              &copy; {currentYear} CyberPath Academy. Bảo lưu mọi quyền.
            </span>
            <span className="text-[#CBD5E1] dark:text-white/20">&bull;</span>
            <span>
              Tham chiếu chuẩn: MITRE ATT&amp;CK&reg; &middot; OWASP ASVS v4.0 &middot; NIST SP 800-53 &middot; RFC 8446 &middot; CWE&trade;
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8]">
            <span className="text-[#1D4ED8] dark:text-[#38BDF8]">KHU VỰC: AP-SOUTHEAST (VN)</span>
            <span className="text-[#CBD5E1] dark:text-white/20">&bull;</span>
            <span className="text-emerald-700 dark:text-emerald-400">TLS 1.3 &middot; PGP / SHA-256</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
