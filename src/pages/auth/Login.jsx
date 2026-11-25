import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Mail, Lock, AlertCircle, ShieldCheck, ArrowRight, KeyRound, Check, Info } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Checkbox, Divider } from "../../components/common"
import SocialAuthButtons from "../../components/auth/SocialAuthButtons"
import useAuth from "../../hooks/useAuth"
import { validateEmail, sanitizeReturnUrl } from "../../utils/validators"

/**
 * Production-ready Login page for CyberPath v2 ("Academic Research Atelier"):
 * - Anti-enumeration failure responses
 * - Duplicate submission prevention
 * - Safe returnUrl redirection
 * - Non-intrusive demo credential helper
 * - Accessible form labels and error bindings
 */
export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [socialNotice, setSocialNotice] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoCopied, setIsDemoCopied] = useState(false)

  const { login, isLoading, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailInputRef = useRef(null)
  const demoTimerRef = useRef(null)

  // Clear auth errors when mounting and clean up demo timer on unmount
  useEffect(() => {
    clearAuthError()
    return () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current)
    }
  }, [clearAuthError])

  const validate = () => {
    const errors = {}

    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error
    }

    if (!password) {
      errors.password = "Vui lòng nhập mật khẩu."
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
      const result = await login(email.trim(), password, rememberMe)

      if (result.success) {
        const destination = sanitizeReturnUrl(location.state?.from, "/")
        navigate(destination, { replace: true })
      } else {
        setFormError(result.error || "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick fill helper for evaluation & testing with backend seed account
  const handleFillDemo = () => {
    setEmail("hiep.nguyen@cyberpath.edu")
    setPassword("P@ssword123!")
    setFieldErrors({})
    setFormError("")
    setSocialNotice("")
    setIsDemoCopied(true)
    if (demoTimerRef.current) clearTimeout(demoTimerRef.current)
    demoTimerRef.current = setTimeout(() => setIsDemoCopied(false), 2000)
  }

  const activeError = formError || authError
  const isBusy = isSubmitting || isLoading

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
            <span>Cổng Xác Thực Học Viên</span>
          </div>

          <h1 className="font-serif-editorial text-2xl sm:text-[28px] font-semibold tracking-tight text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
            Đăng Nhập Nền Tảng
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Nhập thông tin định danh để tiếp tục lộ trình nghiên cứu và thực nghiệm an ninh mạng.
          </p>
        </div>

        {/* Global Auth Error Banner */}
        {activeError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <span className="font-semibold block">Xác thực không thành công</span>
              <span>{activeError}</span>
            </div>
          </div>
        )}

        {/* OAuth Maintenance Notice */}
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            ref={emailInputRef}
            id="login-email"
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-[#0F172A] dark:text-[#E2E8F0] tracking-wide"
              >
                Mật khẩu <span className="text-rose-500 ml-0.5" aria-hidden="true">*</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
                tabIndex={isBusy ? -1 : 0}
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }))
                if (formError) setFormError("")
                if (socialNotice) setSocialNotice("")
              }}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4 text-[#64748B] dark:text-[#94A3B8]" />}
              showPasswordToggle
              errorMessage={fieldErrors.password}
              disabled={isBusy}
              className={getInputSurfaceClass(Boolean(fieldErrors.password))}
            />
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <Checkbox
              id="remember-me"
              label={
                <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Ghi nhớ phiên đăng nhập trên thiết bị này
                </span>
              }
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
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
              loadingText="Đang xác thực thông tin..."
              rightIcon={!isBusy ? <ArrowRight className="h-4 w-4" /> : null}
            >
              Đăng Nhập
            </Button>
          </div>
        </form>

        {/* Non-Intrusive Demo Credential Helper */}
        <div className="p-3 rounded-xl bg-[#F3F1EC]/75 dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]">
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[11px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                Tài khoản trải nghiệm &middot; Hiệp Nguyễn
              </span>
              <span className="text-[10px] font-mono-tech text-[#475569] dark:text-[#94A3B8] truncate">
                hiep.nguyen@cyberpath.edu
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            disabled={isBusy}
            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#D0CCC3] dark:border-white/[0.12] text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] hover:bg-[#FAF9F6] dark:hover:bg-[#1B2335] transition-colors cursor-pointer disabled:opacity-50"
            title="Điền nhanh thông tin tài khoản mẫu"
          >
            {isDemoCopied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-700 dark:text-emerald-300">Đã điền</span>
              </>
            ) : (
              <span>Điền nhanh</span>
            )}
          </button>
        </div>

        {/* Social Auth Options */}
        <div className="space-y-3 pt-1">
          <Divider
            label="hoặc xác thực qua"
            className="[&>div]:border-[#E5E2DC] dark:[&>div]:border-white/[0.08] [&>span]:text-[#64748B] dark:[&>span]:text-[#94A3B8]"
          />
          <div className="dark:[&_button]:text-[#F1F5F9] dark:[&_button]:border-white/[0.1] dark:[&_button]:bg-[#161C2A] dark:[&_button:hover]:bg-[#1B2335]">
            <SocialAuthButtons
              onSocialClick={(provider) =>
                setSocialNotice(
                  `Xác thực qua ${provider} hiện đang bảo trì ở môi trường thử nghiệm. Vui lòng đăng nhập bằng email hoặc dùng tài khoản mẫu.`
                )
              }
            />
          </div>
        </div>

        {/* Registration Link */}
        <p className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-1">
          Chưa có tài khoản học viên?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#1D4ED8] dark:text-[#38BDF8] hover:text-[#1E40AF] dark:hover:text-[#60A5FA] hover:underline transition-colors"
          >
            Tạo tài khoản mới
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
