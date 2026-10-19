import { useState, Fragment } from "react"
import { Link } from "react-router-dom"
import {
  Check,
  X,
  Building2,
  ChevronRight,
  ChevronDown,
  Shield,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"

/**
 * Pricing Page - Bespoke Cyber Defense & SOC Range Subscriptions
 * Designed for authentic hands-on practitioners, corporate SOCs, and universities.
 */
export function Pricing() {
  const { isAuthenticated } = useAuth()
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const plans = [
    {
      id: "community",
      name: "Chiến Binh SOC Tự Do",
      badge: "Miễn Phí Trọn Đời",
      description: "Dành cho sinh viên, học viên mới bắt đầu khám phá kỹ thuật phòng thủ và kiểm thử xâm nhập.",
      monthlyPrice: 0,
      annualPrice: 0,
      period: "miễn phí",
      popular: false,
      ctaText: isAuthenticated ? "Gói Đang Sử Dụng" : "Khởi Chạy Sandbox Miễn Phí",
      ctaTo: isAuthenticated ? "/dashboard" : "/register",
      features: [
        { text: "15 Phòng Lab Cloud Sandbox cơ bản", included: true },
        { text: "Giáo trình Linux & Web Security nền tảng", included: true },
        { text: "Truy cập Terminal Web-SSH an toàn", included: true },
        { text: "Cộng đồng hỗ trợ & giải đáp trên Discord", included: true },
        { text: "Tra cứu ma trận MITRE ATT&CK căn bản", included: true },
        { text: "Khai thác lỗ hổng CVE phức tạp chuyên sâu", included: false },
        { text: "Sổ tay Tác chiến SOC & Đo kiểm Telemetry", included: false },
        { text: "Chứng chỉ số xác thực bằng mã băm PGP", included: false },
      ],
    },
    {
      id: "pro",
      name: "Chuyên Viên Tác Chiến PRO",
      badge: "Lựa Chọn Phổ Biến Nhất",
      description: "Toàn quyền truy cập kho vũ khí phòng thủ, kịch bản tấn công thực tế và telemetry giám sát thời gian thực.",
      monthlyPrice: 24,
      annualPrice: 19,
      period: "mỗi tháng",
      popular: true,
      ctaText: isAuthenticated ? "Nâng Cấp Gói Pro" : "Kích Hoạt Sandbox Pro",
      ctaTo: isAuthenticated ? "/dashboard" : "/register",
      features: [
        { text: "Toàn bộ 120+ Phòng Lab Cloud Sandboxes", included: true },
        { text: "Ma trận MITRE ATT&CK & OWASP Top 10 đầy đủ", included: true },
        { text: "Hạ tầng máy ảo Cloud Sandbox tốc độ cao", included: true },
        { text: "Sổ tay Tác chiến SOC & Hướng dẫn Remediate", included: true },
        { text: "Pháp chứng bộ nhớ RAM (Volatility) & Dị mã", included: true },
        { text: "Chứng chỉ số chính quy có mã tra cứu", included: true },
        { text: "Mô phỏng đợt tấn công Zero-Day & CVE mới", included: true },
        { text: "Phân quyền quản trị nhóm doanh nghiệp", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Trung Tâm SOC Doanh Nghiệp",
      badge: "Hạ Tầng Tác Chiến Riêng",
      description: "Môi trường Cyber Range cô lập chuyên dụng cho đội ngũ SOC, diễn tập Red vs Blue và học viện an ninh mạng.",
      monthlyPrice: 79,
      annualPrice: 65,
      period: "mỗi tài khoản/tháng",
      popular: false,
      ctaText: "Liên Hệ Chuyên Gia Hạ Tầng",
      ctaTo: "/register",
      features: [
        { text: "Bao gồm tất cả quyền lợi Gói Pro", included: true },
        { text: "Hệ thống Cyber Range cô lập (Air-Gapped)", included: true },
        { text: "Kịch bản diễn tập giả lập APT theo yêu cầu", included: true },
        { text: "Bảng đo kiểm kỹ năng đội ngũ & KPI SLA", included: true },
        { text: "Đăng nhập một lần SSO / SAML 2.0 / Okta", included: true },
        { text: "Xuất báo cáo định dạng chuẩn LMS / SCORM", included: true },
        { text: "Chuyên gia Range Master hỗ trợ trực tiếp", included: true },
        { text: "Diễn tập tấn công đối kháng Red vs Blue Live", included: true },
      ],
    },
  ]

  const comparisonFeatures = [
    {
      category: "Hạ Tầng Cyber Range & Môi Trường Sandbox",
      items: [
        { name: "Phòng Lab Linux Cloud Sandbox trực tiếp trên trình duyệt", community: "15 Labs", pro: "Toàn bộ 120+ Labs", enterprise: "Không giới hạn + Tùy biến" },
        { name: "Số lượng máy ảo chạy đồng thời tối đa", community: "1 Sandbox", pro: "3 Sandboxes", enterprise: "Cluster máy ảo riêng" },
        { name: "Thời gian khởi động môi trường máy ảo", community: "< 6 giây", pro: "< 2.5 giây", enterprise: "Khởi động tức thì (Warm-Pool)" },
        { name: "Thời lượng phiên Web-SSH liên tục", community: "60 phút / bài", pro: "Không giới hạn", enterprise: "Cấu hình theo SLA doanh nghiệp" },
      ],
    },
    {
      category: "Giáo Trình & Kỹ Thuật Tác Chiến",
      items: [
        { name: "Đối chiếu kỹ thuật Khung MITRE ATT&CK", community: "Căn bản (8)", pro: "Đầy đủ (120+)", enterprise: "Bộ kịch bản APT đặc thù" },
        { name: "Pháp chứng bộ nhớ RAM & Kernel (Volatility)", community: false, pro: true, enterprise: true },
        { name: "Khai thác vượt rào IAM Cloud & Kubernetes Container Breakout", community: false, pro: true, enterprise: true },
        { name: "Phát hành bài Lab mới định kỳ", community: "Hàng quý", pro: "2 tuần / lần", enterprise: "Ưu tiên nhận kịch bản 0-Day ngay" },
      ],
    },
    {
      category: "Tình Báo Tác Chiến & Đo Kiểm Năng Lực",
      items: [
        { name: "Hệ thống Sổ tay Tác chiến & Đo kiểm Telemetry", community: false, pro: "Truy vấn không giới hạn", enterprise: "Tùy biến theo Playbook SOC" },
        { name: "Kiểm tra cú pháp code động theo AST Scanner", community: "Tiêu chuẩn", pro: "Phân tích AST thời gian thực", enterprise: "Tích hợp script chấm riêng" },
        { name: "Huy hiệu & Chứng chỉ số xác thực bằng mã băm", community: false, pro: true, enterprise: "Gắn thương hiệu đơn vị đào tạo" },
      ],
    },
  ]

  const faqs = [
    {
      q: "Tôi có cần cài đặt phần mềm máy ảo (VMware, VirtualBox) hay tải file ISO không?",
      a: "Hoàn toàn không! Toàn bộ phòng thí nghiệm đều được khởi tạo trên nền tảng Cloud Sandbox cô lập và truyền trực tiếp về trình duyệt qua giao thức Web-SSH bảo mật. Bạn có thể thực hành trên mọi máy tính chỉ với trình duyệt web.",
    },
    {
      q: "Tôi có thể hủy hoặc thay đổi gói đăng ký bất kỳ lúc nào không?",
      a: "Có, bạn nắm toàn quyền kiểm soát. Bạn có thể chuyển đổi hoặc hủy gia hạn bất kỳ lúc nào trong mục Cài đặt tài khoản. Bạn vẫn giữ nguyên quyền truy cập đến hết chu kỳ thanh toán hiện tại.",
    },
    {
      q: "Chứng chỉ hoàn thành bài Lab có được công nhận trong ngành không?",
      a: "Chứng chỉ và huy hiệu kỹ năng của nền tảng được ánh xạ trực tiếp theo Khung năng lực an ninh mạng quốc gia NIST NICE, MITRE ATT&CK Matrix và OWASP Top 10, đính kèm mã định danh xác thực mã hóa công khai.",
    },
    {
      q: "Nền tảng có chính sách ưu đãi cho sinh viên, giảng viên và trường đại học không?",
      a: "Có! Chúng tôi giảm 30% cho sinh viên, giảng viên và các tổ chức đào tạo phi lợi nhuận khi đăng ký qua email đuôi tên miền giáo dục (.edu.vn / .edu).",
    },
    {
      q: "Các hình thức thanh toán được hỗ trợ là gì?",
      a: "Nền tảng hỗ trợ thanh toán qua thẻ tín dụng quốc tế (Visa, MasterCard, JCB), cổng thanh toán nội địa, chuyển khoản ngân hàng và xuất hóa đơn VAT điện tử cho khách hàng doanh nghiệp.",
    },
  ]

  return (
    <div className="min-h-screen pt-10 sm:pt-14 pb-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        {/* ====================================================================
            1. HERO TITLE & BILLING TOGGLE
           ==================================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 cyberpunk:bg-cyan-950/60 border border-blue-200/80 dark:border-blue-800 cyberpunk:border-cyan-500/40 text-blue-700 dark:text-blue-300 cyberpunk:text-cyan-300 text-xs font-mono shadow-2xs">
            <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-cyan-400" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Đầu Tư Vào Kỹ Năng Thực Chiến • Không Phí Ẩn Hạ Tầng
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight leading-tight">
            Nâng Tầm Năng Lực Phòng Thủ SOC. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Trải Nghiệm Trực Tiếp Trên Cloud Sandbox.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300/80 leading-relaxed max-w-2xl mx-auto">
            Lựa chọn cấp độ tài nguyên phù hợp với lộ trình tác chiến của bạn. Rèn luyện diễn tập an toàn, tự động hóa dọn dẹp và zero rủi ro cho máy tính cá nhân.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-semibold select-none cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                !isAnnual
                  ? "text-slate-900 dark:text-white cyberpunk:text-cyan-100 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              Thanh Toán Hàng Tháng
            </button>

            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Chuyển đổi thanh toán năm"
              className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-700 cyberpunk:bg-[#0d1e3d] transition-colors duration-200 ease-in-out focus-ring"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white dark:bg-slate-200 cyberpunk:bg-cyan-400 shadow-sm transition duration-200 ease-in-out ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className="flex items-center gap-2 cursor-pointer select-none bg-transparent border-0 p-0 text-left"
            >
              <span
                className={`text-sm font-semibold transition-colors ${
                  isAnnual
                    ? "text-slate-900 dark:text-white cyberpunk:text-cyan-100 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Gói Trực Chiến Năm
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold font-mono">
                Tiết kiệm 20%
              </span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            2. THREE PRICING CARDS
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.id}
                className={`cyber-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500 dark:border-cyan-500  shadow-xl dark:shadow-black/70 cyberpunk:shadow-sm hover:-translate-y-1"
                    : "hover:-translate-y-0.5"
                }`}
              >
                {/* Popular Ribbon Tag */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[11px] font-mono font-bold uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50">{plan.name}</h2>
                      {!plan.popular && (
                        <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 cyberpunk:bg-[#0d1e3d] text-slate-600 dark:text-slate-300 cyberpunk:text-cyan-300 border border-slate-200 dark:border-slate-700">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 min-h-[40px] leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2 pb-4 border-b border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/20">
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white cyberpunk:text-cyan-50">
                        ${price}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {plan.id === "community" ? "" : isAnnual ? "/tháng (trả theo năm)" : "/tháng"}
                      </span>
                    </div>
                    {isAnnual && plan.annualPrice > 0 && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 font-mono">
                        Thanh toán hàng năm (${plan.annualPrice * 12}/năm)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                      Năng lực được cung cấp:
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm">
                      {plan.features.map((feat) => (
                        <li
                          key={feat.text}
                          className={`flex items-start gap-2.5 ${
                            feat.included
                              ? "text-slate-700 dark:text-slate-200 cyberpunk:text-slate-200"
                              : "text-slate-400 dark:text-slate-600 opacity-60"
                          }`}
                        >
                          {feat.included ? (
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
                          )}
                          <span className={feat.included ? "font-medium" : "line-through"}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call-to-Action Button */}
                <div className="pt-8">
                  <Link
                    to={plan.ctaTo}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      plan.popular
                        ? "cyber-btn-primary btn-cyber-interactive shadow-md shadow-blue-500/15"
                        : "btn-cyber-interactive bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* ====================================================================
            3. ENTERPRISE & COMPLIANCE TRUST BANNER
           ==================================================================== */}
        <div className="rounded-3xl bg-white dark:bg-slate-900/90 cyberpunk:bg-[#071022] border border-slate-200/90 dark:border-slate-800 cyberpunk:border-cyan-500/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 cyberpunk:bg-cyan-950/60 border border-blue-200 dark:border-blue-800 cyberpunk:border-cyan-500/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50">
                Bạn Là Đại Diện Trường Đại Học Hoặc Cơ Quan An Ninh Mạng?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Chúng tôi cung cấp gói tài trợ học thuật, phòng lab cô lập triển khai tại chỗ (on-premise) và voucher chứng chỉ thực hành.
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="btn-cyber-interactive px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 hover:border-blue-400 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shrink-0"
          >
            Yêu Cầu Báo Giá Đào Tạo
          </Link>
        </div>

        {/* ====================================================================
            4. DETAILED FEATURE COMPARISON TABLE
           ==================================================================== */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight">
              Bảng So Sánh Năng Lực Kỹ Thuật
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Phân tích chi tiết thông số kỹ thuật hạ tầng và tính năng giữa các gói đào tạo.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 cyberpunk:border-cyan-500/40 bg-white dark:bg-slate-900/90 cyberpunk:bg-[#071022] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-mono">
                    <th className="py-4 px-6 font-bold w-1/2">Thông Số Kỹ Thuật</th>
                    <th className="py-4 px-4 font-bold text-center w-1/6">Cộng Đồng</th>
                    <th className="py-4 px-4 font-bold text-center text-blue-600 dark:text-cyan-400 w-1/6">Chuyên Viên Pro</th>
                    <th className="py-4 px-4 font-bold text-center w-1/6">Doanh Nghiệp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {comparisonFeatures.map((section) => (
                    <Fragment key={section.category}>
                      <tr className="bg-slate-100/60 dark:bg-slate-800/40 font-semibold font-mono text-xs text-slate-900 dark:text-white">
                        <td colSpan={4} className="py-2.5 px-6">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((row) => (
                        <tr key={row.name} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-6 text-slate-700 dark:text-slate-300 font-medium">{row.name}</td>
                          <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400 font-mono">
                            {typeof row.community === "boolean" ? (
                              row.community ? (
                                <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />
                              )
                            ) : (
                              row.community
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-900 dark:text-white font-semibold font-mono bg-blue-50/30 dark:bg-blue-950/20">
                            {typeof row.pro === "boolean" ? (
                              row.pro ? (
                                <Check className="h-4 w-4 text-blue-600 dark:text-cyan-400 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />
                              )
                            ) : (
                              row.pro
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-600 dark:text-slate-400 font-mono">
                            {typeof row.enterprise === "boolean" ? (
                              row.enterprise ? (
                                <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-slate-300 dark:text-slate-600 mx-auto" />
                              )
                            ) : (
                              row.enterprise
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ====================================================================
            5. FREQUENTLY ASKED QUESTIONS ACCORDION
           ==================================================================== */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white cyberpunk:text-cyan-50 tracking-tight">
              Câu Hỏi Thường Gặp // FAQS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Giải đáp chi tiết về cơ chế vận hành Cloud Sandbox, hình thức thanh toán và kiểm định chứng chỉ.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 cyberpunk:border-cyan-500/30 bg-white dark:bg-slate-900/90 cyberpunk:bg-[#071022] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-50 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 cyberpunk:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 cyberpunk:border-cyan-500/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ====================================================================
            6. BOTTOM CALL-TO-ACTION (EYE-FRIENDLY CYBER DECK)
           ==================================================================== */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Sẵn sàng gia tăng năng lực ứng phó sự cố không gian mạng?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Gia nhập cùng hàng ngàn chuyên viên bảo mật đang diễn tập khắc phục lỗ hổng thực tế. Bắt đầu ngay với gói miễn phí hôm nay.
            </p>
            <div className="pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="cyber-btn-primary btn-cyber-interactive inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/15 cursor-pointer"
              >
                <span>{isAuthenticated ? "Vào Trung Tâm Tác Chiến" : "Đăng Ký Tài Khoản Miễn Phí"}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
