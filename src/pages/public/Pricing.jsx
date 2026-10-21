import { useState, useEffect, Fragment } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Check,
  X,
  Building2,
  ChevronRight,
  ChevronDown,
  Shield,
  Info,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { certificationService } from "../../services/certificationService"
import { challengeService } from "../../services/challengeService"

/**
 * Pricing Page - Bespoke Cyber Defense & SOC Range Subscriptions
 * Designed for authentic hands-on practitioners, corporate SOCs, and universities.
 */
export function Pricing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isAnnual, setIsAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState(null)
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false)
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false)
  const [interestEmail, setInterestEmail] = useState("")
  const [registeredInterest, setRegisteredInterest] = useState(false)
  const [isSubmittingInterest, setIsSubmittingInterest] = useState(false)
  const [interestFeedback, setInterestFeedback] = useState("")
  const [interestError, setInterestError] = useState("")
  const [realLabCount, setRealLabCount] = useState(null)

  useEffect(() => {
    let isMounted = true
    challengeService.getAllChallenges()
      .then((challenges) => {
        if (isMounted && Array.isArray(challenges)) {
          setRealLabCount(challenges.length)
        }
      })
      .catch(() => {
        // Fallback gracefully without breaking layout
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleRegisterInterest = async (e) => {
    e.preventDefault()
    if (!interestEmail || !interestEmail.includes("@")) {
      setInterestError("Vui lòng nhập địa chỉ email hợp lệ.")
      return
    }
    setInterestError("")
    setIsSubmittingInterest(true)
    try {
      const res = await certificationService.registerWaitlist(interestEmail, "pro", "pricing_beta")
      setRegisteredInterest(true)
      setInterestFeedback(res.message || "Đăng ký thành công! Email của bạn đã được ghi nhận vào hệ thống ưu tiên.")
    } catch (err) {
      setInterestError(err.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.")
    } finally {
      setIsSubmittingInterest(false)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const plans = [
    {
      id: "community",
      name: "Học Viên Nền Tảng (Free)",
      badge: "Miễn Phí Trải Nghiệm",
      description: "Trải nghiệm bài giảng nhập môn an toàn thông tin, thực hành lab CTF căn bản và theo dõi tiến độ cá nhân.",
      monthlyPrice: 0,
      annualPrice: 0,
      period: "miễn phí",
      popular: false,
      ctaText: isAuthenticated ? "Gói Đang Sử Dụng" : "Bắt Đầu Miễn Phí",
      ctaTo: isAuthenticated ? "/dashboard" : "/register",
      features: [
        { text: "1–2 Khóa học nền tảng (Web Security & Linux Defense)", included: true },
        { text: "3–5 Phòng Lab CTF & Sandbox thực hành căn bản", included: true },
        { text: "Theo dõi tiến độ học tập cá nhân & Điểm XP", included: true },
        { text: "Tra cứu ma trận MITRE ATT&CK & CVE cơ bản", included: true },
        { text: "AI Security Mentor (Giới hạn câu hỏi căn bản)", included: true },
        { text: "Toàn bộ 6 chuyên đề nâng cao & Capstone Projects", included: false },
        { text: "Hệ thống gợi ý sâu 3 mức độ & Hướng dẫn Remediation", included: false },
        { text: "Cấp phát Chứng chỉ số PGP sau khi hoàn thành Capstone", included: false },
      ],
    },
    {
      id: "pro",
      name: "Chuyên Viên Tác Chiến PRO",
      badge: "Mở Khóa Toàn Diện",
      description: "Toàn quyền truy cập tất cả khóa học hiện có, phòng lab CTF thực chiến, trợ lý AI Mentor hạn ngạch cao và chứng chỉ số.",
      monthlyPrice: 24,
      annualPrice: 19,
      period: "mỗi tháng",
      popular: true,
      ctaText: "Đăng Ký Trải Nghiệm Sớm (Beta)",
      ctaTo: "#early-access",
      features: [
        { text: "Toàn bộ 6 Khóa học chuyên sâu (Web, SOC, Network, Cloud, PWN, Crypto)", included: true },
        { text: realLabCount ? `Toàn bộ ${realLabCount} Phòng Lab CTF & Thử thách độc quyền hiện có` : "Toàn bộ các Phòng Lab CTF & Thử thách thực chiến hiện có", included: true },
        { text: "Trợ lý AI Mentor phân tích kỹ thuật với hạn ngạch cao", included: true },
        { text: "Hệ thống gợi ý 3 mức độ (Khái niệm -> Cú pháp -> Phân tích đáp án)", included: true },
        { text: "Hướng dẫn Remediation vá lỗi & Mã nguồn phòng thủ chuẩn", included: true },
        { text: "Đồ án Capstone cuối lộ trình & Bảng đánh giá Rubric chuẩn NIST", included: true },
        { text: "Cấp Chứng chỉ số PGP khi đạt chuẩn điều kiện", included: true },
        { text: "Quản trị đội ngũ & Báo cáo kỹ năng tổ chức", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Hạ Tầng SOC Doanh Nghiệp",
      badge: "Tổ Chức & Đào Tạo",
      description: "Hạ tầng thao trường riêng, dashboard đo kiểm kỹ năng đội ngũ, kịch bản diễn tập tùy biến và tích hợp hệ thống LMS doanh nghiệp.",
      monthlyPrice: 79,
      annualPrice: 65,
      period: "mỗi tài khoản/tháng",
      popular: false,
      ctaText: "Liên Hệ Giải Pháp Doanh Nghiệp",
      ctaTo: "#enterprise-contact",
      features: [
        { text: "Bao gồm tất cả quyền lợi Gói Pro", included: true },
        { text: "Team Dashboard & Quản trị phân quyền thành viên tổ chức", included: true },
        { text: "Báo cáo phân tích khoảng trống kỹ năng đội ngũ theo chuẩn NIST NICE", included: true },
        { text: "Cụm phòng Lab riêng tư (Private Cloud Sandbox)", included: true },
        { text: "Đăng nhập một lần Doanh nghiệp (SSO / SAML 2.0 / Okta)", included: true },
        { text: "Xuất dữ liệu đào tạo chuẩn quốc tế SCORM / xAPI / LMS", included: true },
        { text: "Hỗ trợ kỹ thuật riêng và thiết kế kịch bản diễn tập theo yêu cầu", included: true },
        { text: "Diễn tập tấn công đối kháng Red vs Blue Live theo đợt", included: true },
      ],
    },
  ]

  const comparisonFeatures = [
    {
      category: "Hạ Tầng Cyber Range & Môi Trường Sandbox",
      items: [
        { name: "Phòng Lab CTF & Sandbox thực hành trên trình duyệt", community: "3–5 Labs cơ bản", pro: realLabCount ? `Toàn bộ ${realLabCount} Labs hiện có` : "Toàn bộ các phòng lab hiện có", enterprise: "Cluster riêng + Tùy biến" },
        { name: "Số lượng máy ảo chạy đồng thời tối đa", community: "1 Sandbox", pro: "2 Sandboxes", enterprise: "Cluster máy ảo riêng" },
        { name: "Thời gian khởi động môi trường máy ảo", community: "< 6 giây", pro: "< 3 giây", enterprise: "Khởi động tức thì (Warm-Pool)" },
        { name: "Thời lượng phiên thực hành liên tục", community: "60 phút / bài", pro: "Không giới hạn", enterprise: "Cấu hình theo SLA doanh nghiệp" },
      ],
    },
    {
      category: "Giáo Trình & Kỹ Thuật Tác Chiến",
      items: [
        { name: "Khóa học tác chiến chuyên sâu", community: "1–2 Khóa nhập môn", pro: "Toàn bộ 6 Khóa chuyên sâu", enterprise: "Tùy biến giáo trình doanh nghiệp" },
        { name: "Hệ thống gợi ý từng mức độ (Hint Tiers)", community: "Gợi ý mức 1 (Khái niệm)", pro: "Đầy đủ 3 mức + Phân tích đáp án", enterprise: "Đầy đủ 3 mức + Giảng viên hỗ trợ" },
        { name: "Đồ án Capstone & Bảng đánh giá Rubric chuẩn NIST", community: false, pro: true, enterprise: true },
        { name: "Phân tích vì sao sai & Hướng dẫn Remediation", community: "Cơ bản", pro: "Chuyên sâu theo chuẩn OWASP", enterprise: "Playbook SOC doanh nghiệp" },
      ],
    },
    {
      category: "Trợ Lý AI Mentor & Đo Kiểm Năng Lực",
      items: [
        { name: "Trợ lý AI Security Mentor", community: "5 lượt hỏi / ngày", pro: "Hạn ngạch cao (50 lượt / ngày)", enterprise: "Không giới hạn + Fine-tuned" },
        { name: "Kiểm tra cú pháp code động & AST Scanner", community: "Tiêu chuẩn", pro: "Phân tích AST thời gian thực", enterprise: "Tích hợp script chấm riêng" },
        { name: "Huy hiệu & Chứng chỉ số PGP có mã tra cứu", community: false, pro: "Cấp khi đạt đủ điều kiện (100% + Capstone)", enterprise: "Gắn thương hiệu đơn vị đào tạo" },
        { name: "Team Dashboard, SSO & Báo cáo SCORM/LMS", community: false, pro: false, enterprise: true },
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
                  {plan.id === "pro" ? (
                    <button
                      type="button"
                      onClick={() => setShowEarlyAccessModal(true)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer cyber-btn-primary btn-cyber-interactive shadow-md shadow-blue-500/15"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{plan.ctaText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : plan.id === "enterprise" ? (
                    <button
                      type="button"
                      onClick={() => setShowEnterpriseModal(true)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer btn-cyber-interactive bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm"
                    >
                      <Building2 className="h-4 w-4" />
                      <span>{plan.ctaText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      to={plan.ctaTo}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer btn-cyber-interactive bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm"
                    >
                      <span>{plan.ctaText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
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

      {/* ====================================================================
          EARLY ACCESS BETA MODAL (TRANSPARENT FEATURE STATUS)
         ==================================================================== */}
      {showEarlyAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowEarlyAccessModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  GIAI ĐOẠN BETA &bull; TRẢI NGHIỆM MIỄN PHÍ
                </span>
                <h3 className="text-lg font-bold text-white">
                  Chính Sách Quyền Lợi Gói Pro
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="flex items-start gap-2 text-cyan-300 font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Minh bạch về trạng thái thanh toán & hạ tầng:</span>
              </div>
              <p>
                Cổng thanh toán tự động và hệ thống quản lý thuê bao (Server-Side Entitlement & Subscription Gate) hiện đang trong quy trình kiểm thử bảo mật nghiêm ngặt theo chuẩn an toàn thông tin.
              </p>
              <p className="font-semibold text-emerald-400">
                🎉 Vì vậy, trong giai đoạn hiện tại, toàn bộ 6 Khóa học chuyên sâu và {realLabCount ? `${realLabCount} Phòng Lab CTF thực chiến hiện có` : "các phòng lab thực chiến hiện có"} đều được mở khóa để bạn rèn luyện hoàn toàn miễn phí!
              </p>
            </div>

            {/* Interest Registration Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Nhận thông báo khi cổng thanh toán chính thức mở:</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={interestEmail}
                  onChange={(e) => {
                    setInterestEmail(e.target.value)
                    if (interestError) setInterestError("")
                  }}
                  disabled={isSubmittingInterest}
                  placeholder="email@example.com"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleRegisterInterest}
                  disabled={isSubmittingInterest}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingInterest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang Lưu...</span>
                    </>
                  ) : registeredInterest ? (
                    "Đã Đăng Ký!"
                  ) : (
                    "Nhận Tin"
                  )}
                </button>
              </div>
              {interestError && (
                <p className="text-[11px] text-red-400 font-mono">
                  ⚠️ {interestError}
                </p>
              )}
              {registeredInterest && (
                <p className="text-[11px] text-emerald-400 font-mono">
                  ✓ {interestFeedback || "Cảm ơn bạn! Chúng tôi đã lưu email vào danh sách ưu tiên."}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowEarlyAccessModal(false)
                  navigate("/learning")
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Vào Học Giáo Trình Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEarlyAccessModal(false)
                  navigate("/labs")
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
              >
                <span>Thực Hành CTF Labs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ENTERPRISE CONTACT MODAL
         ==================================================================== */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5 animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowEnterpriseModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                  GIẢI PHÁP TỔ CHỨC & ĐÀO TẠO
                </span>
                <h3 className="text-lg font-bold text-white">
                  Tư Vấn Thao Trường SOC Doanh Nghiệp
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Dành riêng cho doanh nghiệp, viện nghiên cứu và trường đại học cần hạ tầng Cyber Range cô lập, đồng bộ dữ liệu chuẩn SCORM/LMS và diễn tập đối kháng Red vs Blue.
            </p>

            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Email Chuyên Gia: <strong className="text-white">enterprise@cyberdefense.local</strong></span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Tiêu chuẩn: On-premise Air-Gapped / AWS / Azure Dedicated</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Hỗ trợ kỹ thuật: SLA cam kết phản hồi dưới 1 giờ</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowEnterpriseModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pricing
