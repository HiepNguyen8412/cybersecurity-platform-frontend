import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Mail, Lock, AlertCircle, Shield, ArrowRight, Zap, Check } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Checkbox, Divider } from "../../components/common"
import SocialAuthButtons from "../../components/auth/SocialAuthButtons"
import useAuth from "../../hooks/useAuth"
import { validateEmail, sanitizeReturnUrl } from "../../utils/validators"

/**
 * Production-ready Login page with security-first controls:
 * - Anti-enumeration failure responses
 * - Duplicate submission prevention
 * - Safe returnUrl redirection
 * - Cyber-themed credentials assistant
 * - Accessible form labels and error bindings
 */
function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoCopied, setIsDemoCopied] = useState(false)

  const { login, isLoading, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const emailInputRef = useRef(null)

  // Clear errors when mounting or switching
  useEffect(() => {
    clearAuthError()
  }, [clearAuthError])

  const validate = () => {
    const errors = {}

    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error
    }

    if (!password) {
      errors.password = "Password is required."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
    clearAuthError()

    // Prevent accidental duplicate submissions
    if (isSubmitting || isLoading) return

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const result = await login(email.trim(), password, rememberMe)

      if (result.success) {
        // Sanitize redirect target to prevent open redirect vulnerabilities
        const destination = sanitizeReturnUrl(location.state?.from?.pathname, "/dashboard")
        navigate(destination, { replace: true })
      } else {
        // Generic failure message that prevents user enumeration
        setFormError(result.error || "Invalid email or password. Please verify your credentials and try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick fill helper for evaluation & testing
  const handleFillDemo = () => {
    setEmail("alex.morgan@cyberpath.edu")
    setPassword("P@ssword123!")
    setFieldErrors({})
    setFormError("")
    setIsDemoCopied(true)
    setTimeout(() => setIsDemoCopied(false), 2000)
  }

  const activeError = formError || authError
  const isBusy = isSubmitting || isLoading

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Header with Security Sub-badge */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
            <Shield className="h-3 w-3" />
            <span>Secure Access Gateway</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Sign In to Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal">
            Enter your credentials to continue your security practice.
          </p>
        </div>

        {/* Global Auth Error Banner */}
        {activeError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Authentication failed</span>
              <span>{activeError}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Field */}
          <Input
            ref={emailInputRef}
            id="login-email"
            label="Email address"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }))
              if (formError) setFormError("")
            }}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
            errorMessage={fieldErrors.email}
            disabled={isBusy}
          />

          {/* Password Field with show/hide toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-slate-700 tracking-wide"
              >
                Password <span className="text-rose-500">*</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                tabIndex={isBusy ? -1 : 0}
              >
                Forgot password?
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
              }}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
              showPasswordToggle
              errorMessage={fieldErrors.password}
              disabled={isBusy}
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-0.5">
            <Checkbox
              id="remember-me"
              label="Remember me on this trusted device"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isBusy}
            />
          </div>

          {/* Primary Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isBusy}
              loadingText="Verifying credentials..."
              rightIcon={!isBusy ? <ArrowRight className="h-4 w-4" /> : null}
            >
              Sign In to Platform
            </Button>
          </div>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between text-xs transition-colors hover:bg-slate-100/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[11px] font-semibold text-slate-800 truncate">
                Demo Account &bull; Alex Morgan
              </span>
              <span className="text-[10px] text-slate-500 truncate">
                alex.morgan@cyberpath.edu (Security Analyst)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            className="shrink-0 ml-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all cursor-pointer shadow-2xs"
            title="Auto-fill demo test credentials"
          >
            {isDemoCopied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700">Filled!</span>
              </>
            ) : (
              <span>Auto-Fill</span>
            )}
          </button>
        </div>

        {/* Social Auth Placeholders */}
        <div className="space-y-3 pt-1">
          <Divider label="or authenticate with" />
          <SocialAuthButtons />
        </div>

        {/* Registration Link */}
        <p className="text-center text-xs text-slate-500 pt-1">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login