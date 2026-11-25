import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Lock, AlertCircle, ShieldCheck, ArrowRight, CheckCircle2, Info } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Checkbox, Divider } from "../../components/common"
import PasswordStrength from "../../components/auth/PasswordStrength"
import SocialAuthButtons from "../../components/auth/SocialAuthButtons"
import useAuth from "../../hooks/useAuth"
import { validateEmail, validatePassword } from "../../utils/validators"

/**
 * Production-ready Registration page for CyberPath v2 ("Academic Research Atelier"):
 * - Robust input validation and real-time password strength enforcement
 * - Dynamic password match feedback
 * - Academic & isolated lab usage acknowledgement
 * - Anti-enumeration handling for existing accounts
 */
export function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [socialNotice, setSocialNotice] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, login, isLoading, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}

    if (!name.trim()) {
      errors.name = "Vui lòng nhập họ và tên."
    } else if (name.trim().length < 2) {
      errors.name = "Họ và tên phải có tối thiểu 2 ký tự."
    }

    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error
    }

    const passwordCheck = validatePassword(password)
    if (!passwordCheck.isValid) {
      errors.password = passwordCheck.error
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu."
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp."
    }

    if (!agreeTerms) {
      errors.agreeTerms =
        "Bạn phải đồng ý với Chính sách Bảo mật và Quy chế Học thuật & Sử dụng Lab để tạo tài khoản."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    setSocialNotice("")
    clearAuthError()

    if (isSubmitting || isLoading) return

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const cleanEmail = email.trim().toLowerCase()
      const result = await register({
        name: name.trim(),
        email: cleanEmail,
        password,
      })

      if (result.success) {
        try {
          await login(cleanEmail, password, true)
        } catch {
          // Continue redirect even if auto-login threw
        }
        navigate("/", { replace: true })
      } else {
        setFormError(result.error || "Không thể hoàn tất đăng ký. Vui lòng kiểm tra lại thông tin.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeError = formError || authError
  const isBusy = isSubmitting || isLoading
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword

  const getInputSurfaceClass = (hasError) =>
    hasError
      ? "dark:bg-[#0B0E14]/80 dark:text-[#F1F5F9] dark:placeholder:text-[#64748B]"
      : "border-[#D0CCC3] dark:bg-[#0B0E14]/80 dark:border-white/[0.12] dark:text-[#F1F5F9] dark:placeholder:text-[#64748B] focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] dark:focus:ring-blue-500/20"

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Scholarly Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[11px] font-mono-tech font-medium text-[#1D4ED8] dark:text-[#38BDF8] tracking-wide uppercase">
            <ShieldCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>Hồ Sơ Học Viên Mới</span>
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-[28px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
            Tạo Tài Khoản Học Viên
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Khởi tạo định danh để truy cập hệ thống giáo trình chuẩn hóa, phòng thí nghiệm cô lập và lộ trình chuyên sâu.
          </p>
        </div>

        {/* Global Error Banner */}
        {activeError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-semibold block">Lỗi đăng ký tài khoản</span>
              <span>{activeError}</span>
            </div>
          </div>
        )}

        {/* OAuth Notice */}
        {socialNotice && (
          <div
            role="status"
            aria-live="polite"
            className="p-3 rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-xs text-[#475569] dark:text-[#94A3B8] flex items-start gap-2.5 animate-in fade-in"
          >
            <Info className="h-4 w-4 shrink-0 text-[#1D4ED8] dark:text-[#38BDF8] mt-0.5" aria-hidden="true" />
            <span>{socialNotice}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          <Input
            id="register-name"
            label="Họ và tên"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }))
              if (formError) setFormError("")
              if (socialNotice) setSocialNotice("")
            }}
            placeholder="Ví dụ: Nguyễn Minh Hiệp"
            leftIcon={<User className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
            errorMessage={fieldErrors.name}
            disabled={isBusy}
            className={getInputSurfaceClass(Boolean(fieldErrors.name))}
          />

          <Input
            id="register-email"
            label="Địa chỉ Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }))
              if (formError) setFormError("")
              if (socialNotice) setSocialNotice("")
            }}
            placeholder="hocvien@cyberpath.edu.vn"
            leftIcon={<Mail className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
            errorMessage={fieldErrors.email}
            disabled={isBusy}
            className={getInputSurfaceClass(Boolean(fieldErrors.email))}
          />

          <div className="space-y-1.5">
            <Input
              id="register-password"
              label="Tạo mật khẩu"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }))
                if (formError) setFormError("")
              }}
              placeholder="••••••••"
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
                htmlFor="register-confirm-password"
                className="text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] tracking-wide"
              >
                Xác nhận mật khẩu <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>
              </label>

              {isPasswordMatch && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  <span>Mật khẩu khớp</span>
                </span>
              )}
            </div>

            <Input
              id="register-confirm-password"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }))
                if (formError) setFormError("")
              }}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
              showPasswordToggle
              errorMessage={fieldErrors.confirmPassword}
              disabled={isBusy}
              className={getInputSurfaceClass(Boolean(fieldErrors.confirmPassword))}
            />
          </div>

          <div className="pt-0.5">
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked)
                if (fieldErrors.agreeTerms) setFieldErrors((prev) => ({ ...prev, agreeTerms: "" }))
              }}
              disabled={isBusy}
              errorMessage={fieldErrors.agreeTerms}
              label={
                <span className="text-xs text-[#475569] dark:text-[#94A3B8] leading-normal">
                  Tôi đồng ý với{" "}
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Chính sách Bảo mật
                  </span>{" "}
                  và{" "}
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Quy chế Học thuật &amp; Sử dụng Lab
                  </span>
                  .
                </span>
              }
            />
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isBusy}
              loadingText="Đang tạo tài khoản..."
              rightIcon={!isBusy ? <ArrowRight className="h-4 w-4" /> : null}
            >
              Tạo Tài Khoản Học Viên
            </Button>
          </div>
        </form>

        {/* Social Registration */}
        <div className="space-y-3 pt-1">
          <Divider
            label="hoặc đăng ký bằng"
            className="[&>div]:border-[#E5E2DC] dark:[&>div]:border-white/[0.08] [&>span]:text-[#64748B] dark:[&>span]:text-[#94A3B8]"
          />
          <div className="dark:[&_button]:text-[#F1F5F9] dark:[&_button]:border-white/[0.1] dark:[&_button]:bg-[#161C2A] dark:[&_button:hover]:bg-[#1B2335]">
            <SocialAuthButtons
              onSocialClick={(provider) =>
                setSocialNotice(
                  `Đăng ký nhanh qua ${provider} hiện đang bảo trì ở môi trường thử nghiệm. Vui lòng tạo tài khoản bằng biểu mẫu email phía trên.`
                )
              }
            />
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-1">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register
