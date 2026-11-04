import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { Lock, CheckCircle2, ArrowRight, AlertTriangle, AlertCircle, KeyRound, Shield } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"
import PasswordStrength from "../../components/auth/PasswordStrength"
import useAuth from "../../hooks/useAuth"
import { validatePassword } from "../../utils/validators"

/**
 * Production-ready Reset Password page:
 * - Token presence and validity checks
 * - Clear expired/invalid token fallback states
 * - Strict password complexity validation with live match verification
 * - Seamless transition to Login
 */
function ResetPassword() {
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

  // Scrub sensitive single-use token from the URL bar to prevent history/referer leakage
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
        if (result.statusCode === 400 || result.error?.toLowerCase().includes("expired") || result.error?.toLowerCase().includes("invalid")) {
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

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* State 1: Invalid / Expired Token */}
        {isTokenInvalid && !isSuccess ? (
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xs">
              <AlertTriangle className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-600 dark:text-amber-400 tracking-wide uppercase">
                <span>Cảnh Báo An Ninh</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Liên Kết Không Hợp Lệ Hoặc Đã Hết Hạn
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                Để bảo vệ an toàn tài khoản tác chiến, mã token khôi phục mật khẩu chỉ có giá trị sử dụng một lần và hết hạn sau 15 phút.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/forgot-password">
                <Button variant="primary" size="lg" fullWidth>
                  Yêu Cầu Gửi Lại Liên Kết Mới
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
              Đã nhớ lại mật khẩu của bạn?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 hover:underline transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        ) : !isSuccess ? (
          /* State 2: Active Reset Password Form */
          <div className="space-y-5">
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-semibold text-blue-600 dark:text-sky-400 tracking-wide uppercase">
                <KeyRound className="h-3 w-3" />
                <span>Mã Token Một Lần Đã Được Xác Thực</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Thiết Lập Mật Khẩu Mới
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-normal">
                Tạo mật khẩu mạnh mới cho tài khoản tác chiến của bạn để hoàn tất khôi phục.
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Lỗi cập nhật mật khẩu</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* New Password */}
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
                  leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                  showPasswordToggle
                  errorMessage={fieldErrors.password}
                  disabled={isBusy}
                />

                <PasswordStrength password={password} />
              </div>

              {/* Confirm New Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="confirm-new-password"
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide"
                  >
                    Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                  </label>

                  {isPasswordMatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                      <CheckCircle2 className="h-3 w-3" />
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
                  leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
                  showPasswordToggle
                  errorMessage={fieldErrors.confirmPassword}
                  disabled={isBusy}
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
                  Cập Nhật Mật Khẩu & Đăng Nhập
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* State 3: Password Successfully Updated */
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-xs">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                <Shield className="h-3 w-3" />
                <span>Bảo Mật Thành Công</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Mật Khẩu Đã Được Cập Nhật Thành Công
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-normal max-w-sm mx-auto">
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
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
            Vẫn nhớ mật khẩu hiện tại?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 dark:text-sky-400 hover:text-blue-700 dark:hover:text-sky-300 hover:underline transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        )}
    </div>
    </AuthLayout >
  )
}

export default ResetPassword
