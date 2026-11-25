import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Mail,
  ArrowLeft,
  MailCheck,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  KeyRound,
  FileText,
} from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"
import useAuth from "../../hooks/useAuth"
import { validateEmail } from "../../utils/validators"

/**
 * Production-ready Forgot Password recovery flow ("Academic Research Atelier"):
 * - Anti-enumeration request handling
 * - Resend cooldown timer to mitigate rate-limit abuse
 * - Safe state management without exposing token credentials
 */
export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [formError, setFormError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const { requestPasswordReset, isLoading } = useAuth()

  useEffect(() => {
    let timer
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFieldError("")
    setFormError("")

    if (isLoading) return

    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) {
      setFieldError(emailCheck.error)
      return
    }

    const cleanEmail = email.trim().toLowerCase()
    const result = await requestPasswordReset(cleanEmail)

    if (result.success) {
      setIsSuccess(true)
      setResendCooldown(30)
    } else {
      setFormError(result.error || "Không thể xử lý yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.")
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return

    const cleanEmail = email.trim().toLowerCase()
    await requestPasswordReset(cleanEmail)
    setResendCooldown(30)
  }

  const inputSurfaceClass = fieldError
    ? "dark:bg-[#0B0E14]/80 dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
    : "border-[#D0CCC3] dark:bg-[#0B0E14]/80 dark:border-white/[0.12] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] dark:focus:ring-blue-500/20"

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Quay lại trang đăng nhập</span>
        </Link>

        {formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-semibold block">Lỗi yêu cầu</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {!isSuccess ? (
          /* Initial Request Form State */
          <div className="space-y-5">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech font-medium text-[#1D4ED8] dark:text-[#38BDF8] tracking-wide uppercase">
                <KeyRound className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Khôi Phục Thông Tin Đăng Nhập</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-[28px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                Đặt Lại Mật Khẩu
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Nhập địa chỉ email đã đăng ký để nhận liên kết khôi phục an toàn sử dụng một lần.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                id="reset-email"
                label="Địa chỉ Email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldError) setFieldError("")
                  if (formError) setFormError("")
                }}
                placeholder="hocvien@cyberpath.edu.vn"
                leftIcon={<Mail className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
                errorMessage={fieldError}
                disabled={isLoading}
                className={inputSurfaceClass}
              />

              <div className="p-3 rounded-xl bg-[#F3F1EC]/75 dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[11px] text-[#475569] dark:text-[#94A3B8] flex items-start gap-2">
                <FileText className="h-3.5 w-3.5 text-[#64748B] dark:text-[#94A3B8] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Lưu ý bảo mật: Liên kết đặt lại mật khẩu là thông tin xác thực sử dụng một lần và tự động hết hạn sau 15 phút.
                </span>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Đang gửi liên kết..."
                  rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
                >
                  Gửi Liên Kết Khôi Phục
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* Anti-Enumeration Success State */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-[#F3F1EC] dark:bg-[#161C2A] text-[#1D4ED8] dark:text-[#38BDF8] border border-[#E5E2DC] dark:border-white/[0.08]">
              <MailCheck className="h-7 w-7 stroke-[2]" aria-hidden="true" />
            </div>

            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-mono-tech font-medium text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
                <span>Đã Tiếp Nhận Yêu Cầu</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-[28px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                Kiểm Tra Hộp Thư Của Bạn
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Nếu tài khoản trùng khớp với{" "}
                <span className="font-mono-tech font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  {email.trim().toLowerCase()}
                </span>
                , liên kết đặt lại mật khẩu an toàn đã được gửi tới hộp thư của bạn.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3F1EC]/75 dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs text-[#475569] dark:text-[#94A3B8] space-y-1">
              <p className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Lưu ý bảo mật:</p>
              <p>
                Liên kết chỉ có hiệu lực một lần trong 15 phút. Vui lòng kiểm tra cả hộp thư đến và thư mục thư rác (Spam).
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {Boolean(import.meta.env?.DEV) && (
                <Link to={`/reset-password?token=mock_demo_token&email=${encodeURIComponent(email)}`} className="block">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    [Dev] Mở Liên Kết Đặt Lại Mật Khẩu
                  </Button>
                </Link>
              )}

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                {resendCooldown > 0
                  ? `Gửi lại sau ${resendCooldown}s`
                  : "Gửi lại liên kết khôi phục"}
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in prompt */}
        <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08]">
          Bạn đã nhớ lại mật khẩu?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword
