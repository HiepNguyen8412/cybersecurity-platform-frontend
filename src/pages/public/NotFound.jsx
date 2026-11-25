import { useState, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FileQuestion,
  Search,
  BookOpen,
  FlaskConical,
  Cpu,
  BadgeCheck,
  Compass,
  CreditCard,
  Home,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"

const DIRECTORY_ITEMS = [
  {
    section: "§01",
    title: "Khóa học & Giáo trình",
    desc: "Chuyên khảo lý thuyết hình thức theo chuẩn OWASP ASVS, RFC 8446 và CWE Top 25.",
    to: "/learning",
    icon: BookOpen,
    keywords: "khóa học giáo trình tài liệu owasp rfc cwe learning courses",
    featured: true,
  },
  {
    section: "§02",
    title: "Phòng Lab Thực Nghiệm",
    desc: "Môi trường sandbox cô lập trên trình duyệt với bài tập phân tích và phòng thủ MITRE ATT&CK.",
    to: "/labs",
    icon: FlaskConical,
    keywords: "phòng lab thực hành sandbox mitre tấn công phòng thủ",
    featured: true,
  },
  {
    section: "§03",
    title: "AI Workbench",
    desc: "Không gian phân tích cú pháp AST, rà soát CVE/CWE và kiểm chứng mã nguồn tương tác.",
    to: "/workbench",
    icon: Cpu,
    keywords: "ai workbench ast cve cwe phân tích mã nguồn",
    featured: true,
  },
  {
    section: "§04",
    title: "Xác Thực Chứng Chỉ",
    desc: "Tra cứu chữ ký số PGP, băm SHA-256 và xác minh văn bằng hoàn thành học phần.",
    to: "/verify",
    icon: BadgeCheck,
    keywords: "xác thực chứng chỉ bằng cấp pgp sha256 verify tra cứu",
    featured: true,
  },
  {
    section: "§05",
    title: "Lộ Trình Chuyên Sâu",
    desc: "Hệ thống học phần phân tầng theo năng lực cho Chuyên viên SOC và Kỹ sư Bảo mật.",
    to: "/learning-paths",
    icon: Compass,
    keywords: "lộ trình nghề nghiệp soc pentest learning paths",
    featured: false,
  },
  {
    section: "§06",
    title: "Bảng Giá & Học Bổng",
    desc: "Thông tin gói thành viên, tài trợ nghiên cứu giáo dục và triển khai cho tổ chức.",
    to: "/pricing",
    icon: CreditCard,
    keywords: "bảng giá gói cước học bổng pricing",
    featured: false,
  },
]

/**
 * NotFound (Trang lỗi 404 theo phong cách Academic Research Atelier)
 */
export function NotFound() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const visibleItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) {
      return DIRECTORY_ITEMS.filter((item) => item.featured)
    }
    return DIRECTORY_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.desc.toLowerCase().includes(trimmed) ||
        item.to.toLowerCase().includes(trimmed) ||
        item.keywords.toLowerCase().includes(trimmed)
    )
  }, [query])

  const handleQuickJump = (event) => {
    event.preventDefault()
    if (visibleItems.length > 0) {
      navigate(visibleItems[0].to)
    }
  }

  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="max-w-3xl w-full space-y-10">
        {/* Khối tiêu đề học thuật */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] font-mono-tech text-xs font-medium tracking-wider">
            <FileQuestion className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>ERR 404 &middot; HTTP NOT FOUND</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight leading-tight">
            ERR 404 — Tài nguyên không tồn tại
          </h1>

          <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
            Đường dẫn bạn truy vấn không có trong danh mục lưu trữ hiện hành của CyberPath hoặc đã được chuyển sang địa chỉ mới. Vui lòng tra cứu nhanh bên dưới để tiếp tục.
          </p>
        </div>

        {/* Thanh tìm kiếm & điều hướng nhanh */}
        <form onSubmit={handleQuickJump} className="max-w-lg mx-auto">
          <label htmlFor="notfound-search" className="sr-only">
            Tìm nhanh học phần, phòng lab hoặc cổng xác thực
          </label>
          <div className="relative flex items-center">
            <Search
              className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3.5 pointer-events-none"
              strokeWidth={1.75}
            />
            <input
              id="notfound-search"
              name="notfoundSearch"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm: Khóa học, Lab, AI Workbench, Xác thực..."
              className="w-full h-11 pl-10 pr-20 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] transition-colors"
            />
            <button
              type="submit"
              disabled={visibleItems.length === 0}
              className="absolute right-1.5 h-8 px-3 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              Đi tới
            </button>
          </div>
        </form>

        {/* Thẻ điều hướng danh mục chính */}
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group p-5 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8]/45 dark:hover:border-[#3B82F6]/45 transition-colors flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-center text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
                    <Icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
                        {item.section} &middot; {item.to}
                      </span>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] group-hover:translate-x-0.5 transition-all"
                        strokeWidth={1.75}
                      />
                    </div>
                    <h2 className="font-serif-editorial text-lg font-semibold text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#1D4ED8] dark:group-hover:text-[#38BDF8] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-center space-y-2">
            <p className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              Không tìm thấy mục phù hợp với từ khóa &ldquo;{query}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:underline cursor-pointer"
            >
              Hiển thị lại toàn bộ danh mục gợi ý
            </button>
          </div>
        )}

        {/* Hành động quay lại */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-semibold text-xs sm:text-sm transition-colors active:scale-[0.98]"
          >
            <Home className="w-4 h-4" strokeWidth={1.75} />
            <span>Về trang chủ</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-white dark:bg-[#121722] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            <span>Quay lại trang trước</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
