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
  BookOpen,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import { certificationService } from "../../services/certificationService"
import { challengeService } from "../../services/challengeService"

/**
 * Pricing Page — CyberPath v2 ("Academic Research Atelier")
 * Editorial Light & Deep Obsidian Dark two-theme architecture.
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
    if (typeof challengeService?.getAllChallenges === "function") {
      challengeService
        .getAllChallenges()
        .then((challenges) => {
          if (!isMounted) return
          if (Array.isArray(challenges)) {
            setRealLabCount(challenges.length)
          } else if (Array.isArray(challenges?.content)) {
            setRealLabCount(challenges.content.length)
          }
        })
        .catch(() => {
          // Giữ nguyên mô tả mặc định khi API chưa khả dụng
        })
    }
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
      setInterestFeedback(
        res?.message || "Đăng ký thành công. Email của bạn đã được ghi nhận vào danh sách ưu tiên."
      )
    } catch (err) {
      setInterestError(
        err.response?.data?.message || "Không thể kết nối tới máy chủ. Vui lòng thử lại sau."
      )
    } finally {
      setIsSubmittingInterest(false)
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const displayLabCount = realLabCount ?? 37

  const plans = [
    {
      id: "community",
      code: "HỌC VIÊN NỀN TẢNG",
      name: "Gói Cộng Đồng",
      badge: "Miễn Phí",
      description:
        "Tiếp cận chuyên khảo nhập môn an toàn thông tin, thực hành phòng lab căn bản trên trình duyệt và lưu vết tiến độ cá nhân.",
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      ctaText: isAuthenticated ? "Đang Sử Dụng" : "Đăng Ký Miễn Phí",
      ctaTo: isAuthenticated ? "/dashboard" : "/register",
      features: [
        { text: "1–2 Giáo trình nền tảng (An toàn Web & Linux Defense)", included: true },
        { text: "3–5 Phòng Lab CTF & Sandbox thực hành cơ bản", included: true },
        { text: "Theo dõi tiến độ học tập cá nhân & Điểm thực hành", included: true },
        { text: "Tra cứu ma trận MITRE ATT&CK & danh mục CWE cơ bản", included: true },
        { text: "Trợ lý AI Mentor (Giới hạn lượt hỏi hằng ngày)", included: true },
        { text: "Toàn bộ 6 chuyên đề nâng cao & Đồ án Capstone", included: false },
        { text: "Hệ thống gợi ý phân tầng 3 mức & Phân tích Remediation", included: false },
        { text: "Cấp chứng chỉ số ký PGP có mã tra cứu công khai", included: false },
      ],
    },
    {
      id: "pro",
      code: "NGHIÊN CỨU CHUYÊN SÂU",
      name: "Chuyên Viên PRO",
      badge: "Khuyến Nghị",
      description:
        "Mở khóa toàn bộ giáo trình học thuật, hệ thống phòng lab thực nghiệm cô lập, AI Workbench phân tích sâu và quy trình thẩm định Capstone.",
      monthlyPrice: 24,
      annualPrice: 19,
      popular: true,
      ctaText: "Đăng Ký Trải Nghiệm Sớm",
      ctaTo: "#early-access",
      features: [
        { text: "Toàn bộ 6 Chuyên đề (Web, SOC, Mạng, Cloud, PWN, Mật mã)", included: true },
        {
          text: `Toàn bộ ${displayLabCount} Phòng Lab CTF & Bài thí nghiệm thực chiến`,
          included: true,
        },
        { text: "Trợ lý AI Mentor & AI Workbench với hạn ngạch cao", included: true },
        { text: "Gợi ý 3 tầng sư phạm (Khái niệm → Cú pháp → Giải phẫu)", included: true },
        { text: "Hướng dẫn vá lỗi (Remediation) ở cấp độ mã nguồn chuẩn OWASP", included: true },
        { text: "Đồ án Capstone cuối lộ trình thẩm định theo NIST Rubric", included: true },
        { text: "Cấp phát Chứng chỉ số SHA-256 / PGP khi đạt chuẩn", included: true },
        { text: "Bảng quản trị đội ngũ & Báo cáo năng lực tổ chức", included: false },
      ],
    },
    {
      id: "enterprise",
      code: "ĐÀO TẠO & TỔ CHỨC",
      name: "Hạ Tầng Doanh Nghiệp",
      badge: "Tổ Chức",
      description:
        "Cụm thao trường riêng tư cho trường đại học, viện nghiên cứu và trung tâm điều hành an ninh (SOC) kèm tích hợp LMS chuẩn quốc tế.",
      monthlyPrice: 79,
      annualPrice: 65,
      popular: false,
      ctaText: "Liên Hệ Tư Vấn Triển Khai",
      ctaTo: "#enterprise-contact",
      features: [
        { text: "Bao gồm toàn bộ quyền lợi của gói Chuyên Viên PRO", included: true },
        { text: "Bảng quản trị lớp học & phân quyền thành viên tổ chức", included: true },
        { text: "Báo cáo phân tích khoảng trống kỹ năng chuẩn NIST NICE", included: true },
        { text: "Cụm Sandbox riêng tư (Private Cloud / On-premise)", included: true },
        { text: "Xác thực tập trung doanh nghiệp (SSO / SAML 2.0 / OIDC)", included: true },
        { text: "Xuất dữ liệu học tập chuẩn SCORM / xAPI / LMS", included: true },
        { text: "Thiết kế kịch bản diễn tập thực địa theo yêu cầu riêng", included: true },
        { text: "Tổ chức diễn tập đối kháng Red vs Blue theo đợt", included: true },
      ],
    },
  ]

  const comparisonFeatures = [
    {
      category: "§02.1 Hạ Tầng Thao Trường & Môi Trường Cô Lập",
      items: [
        {
          name: "Phòng Lab CTF & Sandbox thực nghiệm trên trình duyệt",
          community: "3–5 Lab cơ bản",
          pro: `Toàn bộ ${displayLabCount} Labs`,
          enterprise: "Cụm riêng + Tùy biến",
        },
        {
          name: "Số lượng Sandbox vận hành đồng thời",
          community: "1 Sandbox",
          pro: "2 Sandboxes",
          enterprise: "Cụm máy ảo độc lập",
        },
        {
          name: "Thời gian khởi tạo môi trường thực hành",
          community: "< 6 giây",
          pro: "< 3 giây",
          enterprise: "Tức thì (Warm-Pool)",
        },
        {
          name: "Thời lượng phiên thực nghiệm liên tục",
          community: "60 phút / bài",
          pro: "Không giới hạn",
          enterprise: "Theo cam kết SLA",
        },
      ],
    },
    {
      category: "§02.2 Giáo Trình Học Thuật & Phương Pháp Luận",
      items: [
        {
          name: "Số lượng chuyên đề đào tạo chuyên sâu",
          community: "1–2 Chuyên đề nhập môn",
          pro: "Toàn bộ 6 Chuyên đề",
          enterprise: "Tùy biến theo tổ chức",
        },
        {
          name: "Hệ thống gợi ý sư phạm phân tầng (Hint Tiers)",
          community: "Mức 1 (Khái niệm)",
          pro: "Đầy đủ 3 mức + Phân tích",
          enterprise: "3 mức + Giảng viên hỗ trợ",
        },
        {
          name: "Đồ án Capstone & Thẩm định NIST Rubric",
          community: false,
          pro: true,
          enterprise: true,
        },
        {
          name: "Phân tích nguyên nhân gốc & Hướng dẫn Remediation",
          community: "Cơ bản",
          pro: "Chuyên sâu chuẩn OWASP",
          enterprise: "Playbook nội bộ SOC",
        },
      ],
    },
    {
      category: "§02.3 AI Workbench & Chứng Thực Năng Lực",
      items: [
        {
          name: "Trợ lý AI Security Mentor & Workbench",
          community: "5 lượt / ngày",
          pro: "50 lượt / ngày",
          enterprise: "Không giới hạn",
        },
        {
          name: "Phân tích cú pháp động (AST Scanner)",
          community: "Tiêu chuẩn",
          pro: "Phân tích thời gian thực",
          enterprise: "Tích hợp bộ luật riêng",
        },
        {
          name: "Chứng chỉ số SHA-256 / PGP tra cứu công khai",
          community: false,
          pro: "Cấp khi hoàn thành 100% + Capstone",
          enterprise: "Gắn định danh đơn vị",
        },
        {
          name: "Quản trị tổ chức, SSO & Đồng bộ SCORM / LMS",
          community: false,
          pro: false,
          enterprise: true,
        },
      ],
    },
  ]

  const faqs = [
    {
      q: "Tôi có cần cài đặt phần mềm máy ảo (VMware, VirtualBox) hay tải file ảnh hệ thống không?",
      a: "Không cần. Toàn bộ phòng thí nghiệm được khởi tạo trên hạ tầng Sandbox đám mây cô lập và truyền tải trực tiếp qua trình duyệt. Người học chỉ cần trình duyệt hiện đại là có thể bắt đầu thực nghiệm ngay.",
    },
    {
      q: "Tôi có thể thay đổi hoặc hủy gia hạn gói đăng ký bất kỳ lúc nào không?",
      a: "Có. Bạn toàn quyền nâng cấp, chuyển đổi hoặc hủy gia hạn trong phần Cài đặt tài khoản. Quyền truy cập vẫn được duy trì đầy đủ cho đến hết chu kỳ thanh toán hiện tại.",
    },
    {
      q: "Chứng chỉ sau khi bảo vệ đồ án Capstone được xác thực bằng cơ chế nào?",
      a: "Mỗi chứng chỉ gắn mã định danh duy nhất, ánh xạ trực tiếp theo khung năng lực NIST NICE, MITRE ATT&CK và OWASP ASVS, kèm dấu vân tay SHA-256 và chữ ký PGP để tra cứu công khai tại cổng /verify.",
    },
    {
      q: "Nền tảng có chính sách hỗ trợ sinh viên, giảng viên và trường đại học không?",
      a: "Có. CyberPath áp dụng chính sách tài trợ học thuật và giảm 30% học phí cho sinh viên, giảng viên khi xác thực qua email tên miền giáo dục (.edu.vn / .edu).",
    },
    {
      q: "Nền tảng hỗ trợ những phương thức thanh toán nào?",
      a: "Hệ thống hỗ trợ thẻ thanh toán quốc tế (Visa, MasterCard, JCB), chuyển khoản ngân hàng nội địa và xuất hóa đơn VAT điện tử đầy đủ cho doanh nghiệp hoặc đơn vị đào tạo.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] py-14 sm:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24">
        {/* ====================================================================
            1. HERO HEADER & BILLING CYCLE SWITCH
           ==================================================================== */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#475569] dark:text-[#94A3B8]">
            <Shield className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.6} />
            <span>HỌC PHÍ &amp; GÓI TÀI NGUYÊN // CYBERPATH PRESS</span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-medium tracking-[-0.02em] leading-[1.14] text-[#0F172A] dark:text-[#F1F5F9]">
            Đầu tư cho năng lực nghiên cứu và phòng thủ hệ thống bền vững.
          </h1>

          <p className="font-sans text-base sm:text-lg text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            Lựa chọn gói tài nguyên phù hợp với mục tiêu học tập cá nhân hoặc triển khai thao trường cô lập cho đơn vị đào tạo, minh bạch chi phí và không phát sinh phí hạ tầng ẩn.
          </p>

          {/* Monthly / Annual Switch */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`text-sm font-sans cursor-pointer transition-colors bg-transparent border-0 p-0 ${
                !isAnnual
                  ? "text-[#0F172A] dark:text-[#F1F5F9] font-semibold"
                  : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
              }`}
            >
              Thanh toán theo tháng
            </button>

            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Chuyển đổi chu kỳ thanh toán theo năm"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors ${
                isAnnual
                  ? "bg-[#1D4ED8] dark:bg-[#3B82F6] border-transparent"
                  : "bg-[#ECE9E2] dark:bg-[#161C2A] border-[#D0CCC3] dark:border-white/[0.16]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className="inline-flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left"
            >
              <span
                className={`text-sm font-sans transition-colors ${
                  isAnnual
                    ? "text-[#0F172A] dark:text-[#F1F5F9] font-semibold"
                    : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9]"
                }`}
              >
                Thanh toán theo năm
              </span>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-mono-tech text-[11px] font-semibold">
                Tiết kiệm 20%
              </span>
            </button>
          </div>
        </section>

        {/* ====================================================================
            2. THREE TIER PRICING CARDS
           ==================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.id}
                className={`rounded-xl bg-white dark:bg-[#121722] p-7 sm:p-8 flex flex-col justify-between relative transition-colors ${
                  plan.popular
                    ? "border-2 border-[#1D4ED8] dark:border-[#3B82F6] shadow-[0_12px_32px_-10px_rgba(29,78,216,0.14)] dark:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6)]"
                    : "border border-[#E5E2DC] dark:border-white/[0.08]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded bg-[#1D4ED8] dark:bg-[#3B82F6] text-white font-mono-tech text-[10px] font-semibold uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Header */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                        {plan.code}
                      </span>
                      {!plan.popular && (
                        <span className="font-mono-tech text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] text-[#475569] dark:text-[#94A3B8] border border-[#E5E2DC] dark:border-white/[0.08]">
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif-editorial text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      {plan.name}
                    </h2>

                    <p className="font-sans text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed min-h-[44px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="py-4 border-y border-[#EFEDE7] dark:border-white/[0.06]">
                    <div className="flex items-baseline gap-2 font-mono-tech">
                      <span className="text-4xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] tabular-nums">
                        ${price}
                      </span>
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {plan.id === "community"
                          ? "/ vĩnh viễn"
                          : plan.id === "enterprise"
                          ? isAnnual
                            ? "/ tài khoản / tháng (theo năm)"
                            : "/ tài khoản / tháng"
                          : isAnnual
                          ? "/ tháng (trả theo năm)"
                          : "/ tháng"}
                      </span>
                    </div>
                    {isAnnual && plan.annualPrice > 0 && (
                      <p className="font-mono-tech text-[11px] text-emerald-700 dark:text-emerald-400 mt-1.5">
                        Thanh toán một lần ${plan.annualPrice * 12} mỗi năm
                      </p>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3">
                    <div className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                      PHẠM VI QUYỀN LỢI
                    </div>
                    <ul className="space-y-2.5 text-sm font-sans">
                      {plan.features.map((feat) => (
                        <li
                          key={feat.text}
                          className={`flex items-start gap-2.5 ${
                            feat.included
                              ? "text-[#0F172A] dark:text-[#F1F5F9]"
                              : "text-[#64748B] dark:text-[#64748B]/75"
                          }`}
                        >
                          {feat.included ? (
                            <Check
                              className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0 mt-0.5"
                              strokeWidth={2}
                            />
                          ) : (
                            <X
                              className="h-4 w-4 text-[#D0CCC3] dark:text-white/[0.2] shrink-0 mt-0.5"
                              strokeWidth={1.8}
                            />
                          )}
                          <span className={feat.included ? "text-[13px]" : "text-[13px] line-through"}>
                            {feat.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-8">
                  {plan.id === "pro" ? (
                    <button
                      type="button"
                      onClick={() => setShowEarlyAccessModal(true)}
                      className="w-full py-3 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-4 w-4" strokeWidth={1.7} />
                      <span>{plan.ctaText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : plan.id === "enterprise" ? (
                    <button
                      type="button"
                      onClick={() => setShowEnterpriseModal(true)}
                      className="w-full py-3 px-4 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] hover:bg-[#F3F1EC] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.1] font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Building2 className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" strokeWidth={1.7} />
                      <span>{plan.ctaText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      to={plan.ctaTo}
                      className="w-full py-3 px-4 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] hover:bg-[#F3F1EC] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.1] font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>{plan.ctaText}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </section>

        {/* ====================================================================
            3. UNIVERSITY & ACADEMIC GRANT BANNER
           ==================================================================== */}
        <section className="rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8] flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5" strokeWidth={1.6} />
            </div>
            <div className="space-y-1">
              <h3 className="font-sans text-base font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                Đại diện Trường Đại học, Viện Nghiên cứu hoặc Trung tâm An ninh Mạng?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                CyberPath cung cấp chương trình tài trợ học thuật, cụm phòng thí nghiệm cô lập triển khai tại chỗ (On-premise) và ưu đãi 30% cho email giáo dục.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowEnterpriseModal(true)}
            className="px-5 py-2.5 rounded-lg bg-white dark:bg-[#121722] hover:bg-[#FAF9F6] dark:hover:bg-[#1B2335] border border-[#E5E2DC] dark:border-white/[0.1] text-[#0F172A] dark:text-[#F1F5F9] font-sans font-semibold text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors shrink-0"
          >
            Xem Thông Tin Tổ Chức
          </button>
        </section>

        {/* ====================================================================
            4. ACADEMIC SPECIFICATION COMPARISON TABLE
           ==================================================================== */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
              §02 // ĐỐI CHIẾU THÔNG SỐ KỸ THUẬT
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-[-0.015em] text-[#0F172A] dark:text-[#F1F5F9]">
              So sánh năng lực hạ tầng &amp; quyền lợi học thuật
            </h2>
            <p className="font-sans text-sm text-[#475569] dark:text-[#94A3B8]">
              Chi tiết giới hạn tài nguyên Sandbox, mức độ hỗ trợ sư phạm và cơ chế cấp phát chứng chỉ số.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F3F1EC] dark:bg-[#161C2A] border-b border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] font-mono-tech text-xs">
                    <th className="py-4 px-6 font-semibold w-1/2">Thông số kỹ thuật</th>
                    <th className="py-4 px-4 font-semibold text-center w-1/6">Cộng Đồng</th>
                    <th className="py-4 px-4 font-semibold text-center text-[#1D4ED8] dark:text-[#38BDF8] w-1/6">
                      Chuyên Viên PRO
                    </th>
                    <th className="py-4 px-4 font-semibold text-center w-1/6">Doanh Nghiệp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFEDE7] dark:divide-white/[0.06]">
                  {comparisonFeatures.map((section) => (
                    <Fragment key={section.category}>
                      <tr className="bg-[#FAF9F6] dark:bg-[#0B0E14]/50 font-mono-tech text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8]">
                        <td colSpan={4} className="py-2.5 px-6 uppercase tracking-wider">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((row) => (
                        <tr
                          key={row.name}
                          className="hover:bg-[#FAF9F6]/80 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="py-3.5 px-6 font-sans text-[#0F172A] dark:text-[#F1F5F9] font-medium">
                            {row.name}
                          </td>
                          <td className="py-3.5 px-4 text-center text-[#475569] dark:text-[#94A3B8] font-mono-tech text-xs tabular-nums">
                            {typeof row.community === "boolean" ? (
                              row.community ? (
                                <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-[#D0CCC3] dark:text-white/[0.2] mx-auto" />
                              )
                            ) : (
                              row.community
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-[#0F172A] dark:text-[#F1F5F9] font-semibold font-mono-tech text-xs tabular-nums bg-[#1D4ED8]/[0.03] dark:bg-[#3B82F6]/[0.06]">
                            {typeof row.pro === "boolean" ? (
                              row.pro ? (
                                <Check className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8] mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-[#D0CCC3] dark:text-white/[0.2] mx-auto" />
                              )
                            ) : (
                              row.pro
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center text-[#475569] dark:text-[#94A3B8] font-mono-tech text-xs tabular-nums">
                            {typeof row.enterprise === "boolean" ? (
                              row.enterprise ? (
                                <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400 mx-auto" />
                              ) : (
                                <X className="h-4 w-4 text-[#D0CCC3] dark:text-white/[0.2] mx-auto" />
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
        </section>

        {/* ====================================================================
            5. FREQUENTLY ASKED QUESTIONS ACCORDION
           ==================================================================== */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2.5">
            <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
              §03 // CÂU HỎI THƯỜNG GẶP
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-[-0.015em] text-[#0F172A] dark:text-[#F1F5F9]">
              Giải đáp về vận hành Sandbox &amp; kiểm định chứng chỉ
            </h2>
          </div>

          <div className="divide-y divide-[#E5E2DC] dark:divide-white/[0.08] rounded-xl border border-[#E5E2DC] dark:border-white/[0.08] bg-white dark:bg-[#121722] overflow-hidden">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:px-6 text-left flex items-center justify-between gap-4 font-sans font-semibold text-sm sm:text-base text-[#0F172A] dark:text-[#F1F5F9] hover:text-[#1D4ED8] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#64748B] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#1D4ED8] dark:text-[#38BDF8]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 font-sans text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ====================================================================
            6. HARMONIZED EDITORIAL CLOSING BANNER
           ==================================================================== */}
        <section className="rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-10 sm:p-14 text-center">
          <div className="max-w-xl mx-auto space-y-4">
            <div className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#1D4ED8] dark:text-[#38BDF8]">
              §04 // KHỞI ĐẦU MIỄN PHÍ
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium tracking-[-0.015em] text-[#0F172A] dark:text-[#F1F5F9]">
              Bắt đầu lộ trình nghiên cứu an ninh mạng ngay hôm nay
            </h2>
            <p className="font-sans text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Tạo tài khoản cộng đồng miễn phí để trải nghiệm hệ thống giáo trình chuẩn quốc tế và phòng thí nghiệm thực hành trực tiếp trên trình duyệt.
            </p>
            <div className="pt-2">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-sm transition-colors"
              >
                <span>
                  {isAuthenticated ? "Vào Bảng Điều Khiển Học Tập" : "Đăng Ký Tài Khoản Miễn Phí"}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================================
          MODAL 1: EARLY ACCESS BETA (DUAL-THEME EDITORIAL MODAL)
         ==================================================================== */}
      {showEarlyAccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="early-access-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 dark:bg-black/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] rounded-xl p-6 sm:p-8 shadow-2xl text-[#0F172A] dark:text-[#F1F5F9] space-y-5">
            <button
              type="button"
              onClick={() => setShowEarlyAccessModal(false)}
              aria-label="Đóng cửa sổ"
              className="absolute top-4 right-4 p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]">
                <BookOpen className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <div>
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8]">
                  GIAI ĐOẠN BETA &middot; MỞ KHÓA HỌC THUẬT
                </span>
                <h3 id="early-access-title" className="font-serif-editorial text-xl font-medium">
                  Chính sách quyền lợi gói Chuyên Viên PRO
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5 text-xs font-sans leading-relaxed text-[#475569] dark:text-[#94A3B8]">
              <div className="flex items-start gap-2 text-[#0F172A] dark:text-[#F1F5F9] font-semibold">
                <Info className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                <span>Minh bạch trạng thái cổng thanh toán &amp; phân quyền:</span>
              </div>
              <p>
                Hệ thống cổng thanh toán tự động và quản lý thuê bao phía máy chủ đang trong giai đoạn kiểm định bảo mật trước khi phát hành thương mại chính thức.
              </p>
              <div className="flex items-start gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Trong giai đoạn hiện tại, toàn bộ 6 chuyên đề chuyên sâu và{" "}
                  {displayLabCount} phòng thí nghiệm thực chiến hiện có đều được mở miễn phí phục vụ
                  cộng đồng học tập.
                </span>
              </div>
            </div>

            {/* Waitlist Form */}
            <form
              onSubmit={handleRegisterInterest}
              className="p-4 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2.5"
            >
              <label
                htmlFor="waitlist-email-input"
                className="font-mono-tech text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <span>Nhận thông báo khi phiên bản PRO chính thức mở đăng ký:</span>
              </label>

              <div className="flex gap-2">
                <input
                  id="waitlist-email-input"
                  name="waitlistEmail"
                  type="email"
                  value={interestEmail}
                  onChange={(e) => {
                    setInterestEmail(e.target.value)
                    if (interestError) setInterestError("")
                  }}
                  disabled={isSubmittingInterest}
                  placeholder="name@university.edu.vn"
                  className="flex-1 bg-white dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.12] rounded-lg px-3 py-2 text-xs font-mono-tech text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isSubmittingInterest}
                  className="px-4 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingInterest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : registeredInterest ? (
                    "Đã đăng ký"
                  ) : (
                    "Ghi danh"
                  )}
                </button>
              </div>

              {interestError && (
                <p className="flex items-center gap-1.5 text-[11px] text-rose-700 dark:text-rose-400 font-sans">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{interestError}</span>
                </p>
              )}
              {registeredInterest && (
                <p className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{interestFeedback}</span>
                </p>
              )}
            </form>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowEarlyAccessModal(false)
                  navigate("/learning")
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Mở Giáo Trình Ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowEarlyAccessModal(false)
                  navigate("/labs")
                }}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] hover:bg-[#F3F1EC] dark:hover:bg-[#1B2335] text-[#0F172A] dark:text-[#F1F5F9] border border-[#E5E2DC] dark:border-white/[0.1] font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Vào Phòng Thí Nghiệm</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: ENTERPRISE & UNIVERSITY INQUIRY
         ==================================================================== */}
      {showEnterpriseModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="enterprise-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 dark:bg-black/75 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.1] rounded-xl p-6 sm:p-8 shadow-2xl text-[#0F172A] dark:text-[#F1F5F9] space-y-5">
            <button
              type="button"
              onClick={() => setShowEnterpriseModal(false)}
              aria-label="Đóng cửa sổ"
              className="absolute top-4 right-4 p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]">
                <Building2 className="w-5 h-5" strokeWidth={1.7} />
              </div>
              <div>
                <span className="font-mono-tech text-[10px] font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8]">
                  GIẢI PHÁP TỔ CHỨC &amp; ĐÀO TẠO
                </span>
                <h3 id="enterprise-modal-title" className="font-serif-editorial text-xl font-medium">
                  Triển khai thao trường CyberPath cho tổ chức
                </h3>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Giải pháp dành riêng cho doanh nghiệp, viện nghiên cứu và trường đại học cần cụm thao trường cô lập, tích hợp dữ liệu chuẩn SCORM/xAPI và tổ chức diễn tập đối kháng theo đội ngũ.
            </p>

            <div className="space-y-3 p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-mono-tech">
              <div className="flex items-center gap-3 text-[#475569] dark:text-[#94A3B8]">
                <Mail className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" />
                <span>
                  Liên hệ kỹ thuật:{" "}
                  <strong className="text-[#0F172A] dark:text-[#F1F5F9]">
                    enterprise@cyberpath.edu.vn
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[#475569] dark:text-[#94A3B8]">
                <Lock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Mô hình triển khai: On-premise Air-Gapped hoặc Dedicated Cloud</span>
              </div>
              <div className="flex items-center gap-3 text-[#475569] dark:text-[#94A3B8]">
                <Shield className="w-4 h-4 text-[#1D4ED8] dark:text-[#38BDF8] shrink-0" />
                <span>Hỗ trợ vận hành: Cam kết phản hồi kỹ thuật SLA dưới 1 giờ</span>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEnterpriseModal(false)}
                className="w-full py-2.5 px-4 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-sans font-semibold text-xs transition-colors cursor-pointer"
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
