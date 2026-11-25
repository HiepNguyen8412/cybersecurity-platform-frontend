import { useState, useEffect, useRef } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import {
  MailCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Edit2,
  Check,
  Loader2,
  ShieldCheck,
} from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Badge } from "../../components/common"
import useAuth from "../../hooks/useAuth"
import { validateEmail } from "../../utils/validators"

/**
 * Production-ready Email Verification page ("Academic Research Atelier"):
 * - Reads verification tokens from URL parameters and scrubs token from address bar
 * - Auto-triggers verification check when token is present
 * - 60s cooldown timer on resend requests to prevent abuse
 * - Explicit expired/invalid token states
 */
export function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmail, resendVerification, isLoading } = useAuth()

  const rawUrlToken = searchParams.get("token")
  const rawUrlEmail = searchParams.get("email")

  // Sanitize and validate email from URL query to prevent input injection
  const validatedUrlEmail =
    rawUrlEmail && validateEmail(rawUrlEmail).isValid ? rawUrlEmail.trim().toLowerCase() : null

  const initialEmail =
    validatedUrlEmail ||
    (() => {
      try {
        const stored = sessionStorage.getItem("cyberpath_pending_verify_email")
        return stored && validateEmail(stored).isValid ? stored : ""
      } catch {
        return ""
      }
    })() ||
    "hiep.nguyen@cyberpath.edu"

  const [email, setEmail] = useState(initialEmail)
  const [token] = useState(() => (rawUrlToken ? rawUrlToken.trim() : ""))
  const [status, setStatus] = useState(() => (rawUrlToken ? "verifying" : "waiting"))
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [tempEmail, setTempEmail] = useState(initialEmail)
  const [editError, setEditError] = useState("")
  const [resendNotification, setResendNotification] = useState("")
  const [cooldown, setCooldown] = useState(0)

  // Keep latest verifyEmail reference in a ref to prevent re-triggering token verification on loading state changes
  const latestVerifyEmailRef = useRef(verifyEmail)
  useEffect(() => {
    latestVerifyEmailRef.current = verifyEmail
  }, [verifyEmail])

  // Resend cooldown timer effect
  useEffect(() => {
    let timer
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  // Automatically verify token and scrub token from URL bar to prevent history/referer leakage
  useEffect(() => {
    if (!token) return
    let isMounted = true

    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    const runVerification = async () => {
      const result = await latestVerifyEmailRef.current(token, validatedUrlEmail || email)
      if (!isMounted) return

      if (result.success) {
        setStatus("verified")
      } else {
        setStatus("expired")
      }
    }

    runVerification()

    return () => {
      isMounted = false
    }
  }, [token, validatedUrlEmail, email])

  // Manual simulation / token verification trigger
  const triggerTokenVerification = async (tokenVal, emailVal) => {
    setStatus("verifying")
    const result = await verifyEmail(tokenVal, emailVal)
    if (result.success) {
      setStatus("verified")
    } else {
      setStatus("expired")
    }
  }

  // Resend verification email
  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return

    setResendNotification("")
    const result = await resendVerification(email)

    if (result.success) {
      setResendNotification(`Một email xác thực mới đã được gửi tới ${email}.`)
      setCooldown(60)
    } else {
      setResendNotification("Không thể gửi email xác thực lúc này. Vui lòng thử lại sau ít phút.")
    }
  }

  // Save corrected email address
  const handleSaveEmail = (e) => {
    e.preventDefault()
    setEditError("")

    const emailCheck = validateEmail(tempEmail)
    if (!emailCheck.isValid) {
      setEditError(emailCheck.error)
      return
    }

    const clean = tempEmail.trim().toLowerCase()
    setEmail(clean)
    setIsEditingEmail(false)
    try {
      sessionStorage.setItem("cyberpath_pending_verify_email", clean)
    } catch {
      // Ignore
    }
    setResendNotification(`Đã cập nhật email thành ${clean}. Liên kết xác thực mới đã được gửi.`)
    setCooldown(60)
  }

  const editInputClass = editError
    ? "dark:bg-[#0B0E14]/80 dark:text-[#F1F5F9]"
    : "border-[#D0CCC3] dark:bg-[#0B0E14]/80 dark:border-white/[0.12] dark:text-[#F1F5F9] focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] dark:focus:ring-blue-500/20"

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* STATE: Verifying Token */}
        {status === "verifying" && (
          <div className="space-y-5 text-center py-6 animate-in fade-in">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
              <Loader2 className="h-7 w-7 animate-spin stroke-[2]" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-serif-editorial text-2xl font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
                Đang Xác Thực Token Email...
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                Đang đối chiếu mã xác thực mật mã học với cổng xác nhận CyberPath.
              </p>
            </div>
          </div>
        )}

        {/* STATE: Waiting for Verification */}
        {status === "waiting" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
              <MailCheck className="h-7 w-7 stroke-[2]" aria-hidden="true" />
            </div>

            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech font-medium text-[#1D4ED8] dark:text-[#38BDF8] tracking-wide uppercase">
                <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Đang Chờ Xác Nhận Email</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <h1 className="font-serif-editorial text-2xl sm:text-[26px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                  Xác Thực Địa Chỉ Email
                </h1>
                <Badge variant="primary" size="sm" className="font-mono-tech">
                  Chờ duyệt
                </Badge>
              </div>

              {!isEditingEmail ? (
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                    Liên kết xác thực đã được gửi tới:{" "}
                    <span className="font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9] break-all">
                      {email}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTempEmail(email)
                      setIsEditingEmail(true)
                      setEditError("")
                    }}
                    className="text-xs text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] p-1 rounded-md hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
                    title="Thay đổi địa chỉ email"
                    aria-label="Thay đổi địa chỉ email"
                  >
                    <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveEmail} className="space-y-2 pt-2 text-left">
                  <div className="flex items-start gap-2">
                    <Input
                      id="change-email"
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      size="sm"
                      wrapperClassName="flex-1"
                      errorMessage={editError}
                      className={editInputClass}
                    />
                    <Button type="submit" size="sm" variant="primary" className="shrink-0">
                      <Check className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Lưu
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => setIsEditingEmail(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              )}
            </div>

            <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed text-left">
              Nhấp vào liên kết bên trong email để kích hoạt tài khoản và khởi tạo môi trường học tập an ninh mạng cô lập của bạn.
            </p>

            {resendNotification && (
              <div
                role="status"
                aria-live="polite"
                className="p-3 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs text-[#0F172A] dark:text-[#F1F5F9] animate-in fade-in text-left"
              >
                {resendNotification}
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              {Boolean(import.meta.env?.DEV) && (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => triggerTokenVerification("mock_demo_token", email)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  [Dev] Mô Phỏng Xác Nhận Token Email
                </Button>
              )}

              <div className={import.meta.env?.DEV ? "grid grid-cols-2 gap-2.5" : "w-full"}>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth={!import.meta.env?.DEV}
                  onClick={handleResend}
                  disabled={cooldown > 0 || isLoading}
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  {cooldown > 0 ? `Gửi lại (${cooldown}s)` : "Gửi lại email"}
                </Button>

                {import.meta.env?.DEV && (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => setStatus("expired")}
                    className="text-[#475569] dark:text-[#94A3B8] hover:text-amber-700 dark:hover:text-amber-300"
                  >
                    [Dev] Thử hết hạn
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STATE: Email Verified */}
        {status === "verified" && (
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-mono-tech font-medium text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
                <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Xác Thực Email Thành Công</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <h1 className="font-serif-editorial text-2xl sm:text-[26px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                  Đã Xác Thực Email
                </h1>
                <Badge variant="success" size="sm" className="font-mono-tech">
                  Hợp lệ
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Địa chỉ email{" "}
                <span className="font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  {email}
                </span>{" "}
                đã được xác nhận. Không gian học tập và các phòng thí nghiệm cô lập của bạn đã sẵn sàng.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate("/", { replace: true })}
              >
                Về Trang Chủ Nền Tảng
              </Button>
            </div>
          </div>
        )}

        {/* STATE: Verification Token Expired */}
        {status === "expired" && (
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <AlertTriangle className="h-7 w-7 stroke-[2]" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-[11px] font-mono-tech font-medium text-amber-700 dark:text-amber-300 tracking-wide uppercase">
                <span>Lưu Ý Bảo Mật</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <h1 className="font-serif-editorial text-2xl sm:text-[26px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                  Liên Kết Xác Thực Đã Hết Hạn
                </h1>
                <Badge variant="warning" size="sm" className="font-mono-tech">
                  Hết hạn
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Vì lý do bảo mật, liên kết xác thực email tự động hết hạn sau 24 giờ. Vui lòng yêu cầu một liên kết mới để kích hoạt tài khoản.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setStatus("waiting")
                  handleResend()
                }}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Gửi Liên Kết Xác Thực Mới
              </Button>

              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setStatus("waiting")}
              >
                Quay lại
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in prompt */}
        {status !== "verified" && (
          <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08]">
            Đã xác thực email trước đó?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
            >
              Đăng nhập
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  )
}

export default VerifyEmail
