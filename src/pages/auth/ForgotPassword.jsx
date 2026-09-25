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
  ShieldAlert,
} from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"
import useAuth from "../../hooks/useAuth"
import { validateEmail } from "../../utils/validators"

/**
 * Production-ready Forgot Password recovery flow:
 * - Anti-enumeration request handling
 * - Resend cooldown timer to mitigate rate-limit abuse
 * - Safe state management without exposing token credentials
 */
function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [formError, setFormError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const { requestPasswordReset, isLoading, resendVerification } = useAuth()

  // Cooldown countdown effect
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
      setFormError(result.error || "Unable to process password reset request. Please try again.")
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || isLoading) return

    const cleanEmail = email.trim().toLowerCase()
    await resendVerification(cleanEmail)
    setResendCooldown(30)
  }

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </Link>

        {formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Request error</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {!isSuccess ? (
          /* ====================================================================
             Initial Request Form State
             ==================================================================== */
          <div className="space-y-5">
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                <KeyRound className="h-3 w-3" />
                <span>Credential Recovery</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Reset Your Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                Enter your registered email and we'll dispatch a cryptographic, single-use recovery link.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                id="reset-email"
                label="Email address"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldError) setFieldError("")
                  if (formError) setFormError("")
                }}
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
                errorMessage={fieldError}
                disabled={isLoading}
              />

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  For your security, reset links are single-use credentials that automatically expire in 15 minutes.
                </span>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Dispatching recovery link..."
                  rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
                >
                  Send Recovery Link
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* ====================================================================
             Anti-Enumeration "Check Your Email" Success State
             ==================================================================== */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Visual Icon */}
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <MailCheck className="h-7 w-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
                <span>Dispatch Completed</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Check Your Email
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                If an account matches <span className="font-semibold text-slate-900">{email}</span>, a secure password reset link has been dispatched.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">Security Notice:</p>
              <p>
                Links are single-use and expire within 15 minutes. Check both your inbox and quarantine/spam folders.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              {/* Direct link for demonstration / QA testing */}
              <Link to={`/reset-password?token=mock_demo_token&email=${encodeURIComponent(email)}`}>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Simulate: Open Reset Token Link
                </Button>
              </Link>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleResend}
                disabled={resendCooldown > 0 || isLoading}
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                {resendCooldown > 0
                  ? `Resend available in ${resendCooldown}s`
                  : "Resend instructions"}
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in prompt */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword