import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Lock, CheckCircle2, ArrowRight, AlertTriangle, AlertCircle, KeyRound, ShieldCheck } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"
import PasswordStrength from "../../components/auth/PasswordStrength"
import useAuth from "../../hooks/useAuth"
import { validatePassword } from "../../utils/validators"

/**
 * Production-ready Reset Password page ("Academic Research Atelier"):
 * - Token presence and validity checks
 * - URL token scrubbing to avoid history/referer leakage
 * - Clear expired/invalid token fallback states
 * - Strict password complexity validation with live match verification
 */
export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [token] = useState(() => searchParams.get("token") || "")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [isTokenInvalid, setIsTokenInvalid] = useState(!token)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { resetPassword, isLoading } = useAuth()
  const navigate = useNavigate()

  // Scrub sensitive single-use token from URL bar
  useEffect(() => {
    if (token && window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [token])

  const validate = () => {
    const errors = {}

    const passwordCheck = validatePassword(password)
    if (!passwordCheck.isValid) {
      errors.password = passwordCheck.error
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới."
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")

    if (isSubmitting || isLoading) return

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const result = await resetPassword(token, password)

      if (result.success) {
        setIsSuccess(true)
        setPassword("")
        setConfirmPassword("")
      } else {
        if (
          result.statusCode === 400 ||
          result.error?.toLowerCase().includes("expired") ||
          result.error?.toLowerCase().includes("invalid")
        ) {
          setIsTokenInvalid(true)
        }
        setFormError(result.error || "Không thể đặt lại mật khẩu. Liên kết có thể đã hết hạn hoặc không hợp lệ.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isBusy = isSubmitting || isLoading
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword

  const getInputSurfaceClass = (hasError) =>
    hasError
      ? "dark:bg-[#0B0E14]/80 dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
      : "border-[#D0CCC3] dark:bg-[#0B0E14]/80 dark:border-white/[0.12] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] dark:focus:ring-blue-500/20"

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* State 1: Invalid / Expired Token */}
        {isTokenInvalid && !isSuccess ? (
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
              <AlertTriangle className="h-7 w-7 stroke-[2]" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-[11px] font-mono-tech font-medium text-amber-700 dark:text-amber-300 tracking-wide uppercase">
                <span>Cảnh Báo Bảo Mật</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-[26px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                Liên Kết Không Hợp Lệ Hoặc Đã Hết Hạn
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
                Để bảo vệ an toàn tài khoản học viên, mã token khôi phục mật khẩu chỉ có giá trị sử dụng một lần và hết hạn sau 15 phút.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/forgot-password" className="block">
                <Button variant="primary" size="lg" fullWidth>
                  Yêu Cầu Gửi Lại Liên Kết Mới
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08]">
              Đã nhớ lại mật khẩu của bạn?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        ) : !isSuccess ? (
          /* State 2: Active Reset Password Form */
          <div className="space-y-5">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech font-medium text-[#1D4ED8] dark:text-[#38BDF8] tracking-wide uppercase">
                <KeyRound className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Mã Token Một Lần Hợp Lệ</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-[28px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                Thiết Lập Mật Khẩu Mới
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Tạo mật khẩu mới có độ bảo mật cao cho tài khoản học viên của bạn để hoàn tất khôi phục.
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <span className="font-semibold block">Lỗi cập nhật mật khẩu</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Input
                  id="new-password"
                  label="Mật khẩu mới"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }))
                    if (formError) setFormError("")
                  }}
                  placeholder="Nhập mật khẩu mới an toàn..."
                  leftIcon={<Lock className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
                  showPasswordToggle
                  errorMessage={fieldErrors.password}
                  disabled={isBusy}
                  className={getInputSurfaceClass(Boolean(fieldErrors.password))}
                />

                <div className="dark:[&_.bg-slate-200]:bg-white/10 dark:[&_.text-slate-500]:text-[#94A3B8] dark:[&_.text-emerald-700]:text-emerald-400">
                  <PasswordStrength password={password} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="confirm-new-password"
                    className="text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] tracking-wide"
                  >
                    Xác nhận mật khẩu mới <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>
                  </label>

                  {isPasswordMatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      <span>Mật khẩu trùng khớp</span>
                    </span>
                  )}
                </div>

                <Input
                  id="confirm-new-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }))
                    if (formError) setFormError("")
                  }}
                  placeholder="Nhập lại mật khẩu mới..."
                  leftIcon={<Lock className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
                  showPasswordToggle
                  errorMessage={fieldErrors.confirmPassword}
                  disabled={isBusy}
                  className={getInputSurfaceClass(Boolean(fieldErrors.confirmPassword))}
                />
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isBusy}
                  loadingText="Đang cập nhật mật khẩu..."
                  rightIcon={!isBusy ? <ArrowRight className="h-4 w-4" /> : null}
                >
                  Cập Nhật Mật Khẩu &amp; Đăng Nhập
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* State 3: Password Successfully Updated */
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-mono-tech font-medium text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
                <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>Bảo Mật Thành Công</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-[26px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                Mật Khẩu Đã Được Cập Nhật
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-sm mx-auto">
                Mật khẩu tài khoản của bạn đã được thay đổi an toàn. Bạn hiện có thể đăng nhập bằng mật khẩu mới vừa thiết lập.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate("/login", { replace: true })}
              >
                Đăng Nhập Với Mật Khẩu Mới
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in link */}
        {!isSuccess && !isTokenInvalid && (
          <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-3 border-t border-[#E5E2DC] dark:border-white/[0.08]">
            Vẫn nhớ mật khẩu hiện tại?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  )
}

export default ResetPassword
