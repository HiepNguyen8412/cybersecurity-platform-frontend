import { Link } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative w-full bg-[#0a0c10] text-slate-300 transition-colors overflow-hidden border-t border-slate-800/80">
      {/* ====================================================================
          YEWSAFE-STYLE SIGNATURE LASER HORIZON BEAM GLOW
         ==================================================================== */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[1px]" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-transparent pointer-events-none" />

      {/* Top Footer Main Columns */}
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-10 lg:py-14 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Platform Identity, Mission & Social Links */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg group"
              title="CyberPath — Home"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-4.5 w-4.5 stroke-[2.2]" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-300 ring-2 ring-[#0a0c10] animate-pulse" />
              </div>
              <span className="text-xl font-black tracking-tight text-white leading-none">
                Cyber<span className="text-cyan-400">Path</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Nền tảng thao trường an ninh mạng và diễn tập thực chiến đám mây thế hệ mới. Đem lại năng lực phân tích mã độc, đánh chặn APT và vá lỗi trực tiếp trên sandbox trình duyệt.
            </p>

            {/* Live Operational Status Pill */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/80 border border-gray-700/60 text-xs font-mono-tech text-gray-300 select-none shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-semibold text-emerald-400">SLA 99.98%</span>
                <span className="text-gray-500">&bull;</span>
                <span className="text-gray-400">Range Sandbox Trực Tuyến</span>
              </div>
            </div>

            {/* High-Tech Social Icon Buttons (YewSafe-Style) */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="w-9 h-9 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono-tech cursor-default">
              Nền Tảng Tác Chiến
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Phòng Lab Đám Mây Tương Tác
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Lộ Trình Đào Tạo Chuyên Sâu
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Khóa Học & Module MITRE
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                  Bảng Giá & Gói Doanh Nghiệp
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Bảng Điều Khiển Analyst
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Drill Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono-tech cursor-default">
              Diễn Tập Thực Chiến
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Phòng Thủ Tấn Công Web (WAF)
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Pháp Chứng Bộ Nhớ (RAM Volatility)
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Bắt Gói Tin Mạng Thực Tế (PCAP)
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Leo Thang Đặc Quyền AWS Cloud
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Săn Lùng Mã Độc Suricata IDS
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono-tech cursor-default">
              Bảo Mật & Tiêu Chuẩn
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Tài Trợ Nghiên Cứu Giáo Dục
                </Link>
              </li>
              <li>
                <Link to="/learning" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Tài Liệu Kỹ Thuật & Best Practices
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Chính Sách Báo Cáo Lỗ Hổng
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Điều Khoản Dịch Vụ
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Chính Sách Bảo Mật Dữ Liệu
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="relative border-t border-gray-800/60 bg-black/50 py-4 z-10">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-2 cursor-default select-none text-[11px]">
            <span>&copy; {currentYear} CyberPath Platform. Bảo lưu mọi quyền.</span>
            <span className="text-gray-700">&bull;</span>
            <span className="text-gray-400">Thiết kế chuẩn SOC & Cyber Drill</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono-tech text-gray-400 cursor-default select-none">
            <span className="text-cyan-400">EDGE REGION: AP-SOUTHEAST (HN/HCM)</span>
            <span className="text-gray-700">&bull;</span>
            <span className="text-emerald-400">TLS 1.3 ENFORCED</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
