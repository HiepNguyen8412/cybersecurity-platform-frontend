import { useState } from "react"
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
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [isTokenInvalid, setIsTokenInvalid] = useState(!token)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { resetPassword, isLoading } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}

    const passwordCheck = validatePassword(password)
    if (!passwordCheck.isValid) {
      errors.password = passwordCheck.error
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password."
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
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
        setFormError(result.error || "Unable to reset password. The link may have expired.")
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
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
              <AlertTriangle className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-semibold text-amber-700 tracking-wide uppercase">
                <span>Security Notice</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Reset Link Invalid or Expired
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For account security, password reset tokens are single-use credentials that expire after 15 minutes.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/forgot-password">
                <Button variant="primary" size="lg" fullWidth>
                  Request a New Reset Link
                </Button>
              </Link>
            </div>

            <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Remembered your credentials?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        ) : !isSuccess ? (
          /* State 2: Active Reset Password Form */
          <div className="space-y-5">
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                <KeyRound className="h-3 w-3" />
                <span>Single-Use Token Verified</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Set New Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                Choose a strong, unique password to protect your account and labs.
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold block">Update error</span>
                  <span>{formError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* New Password */}
              <div className="space-y-1.5">
                <Input
                  id="new-password"
                  label="New password"
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
                    className="text-xs font-semibold text-slate-700 tracking-wide"
                  >
                    Confirm new password <span className="text-rose-500">*</span>
                  </label>

                  {isPasswordMatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 animate-in fade-in">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Passwords match</span>
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
                  placeholder="••••••••"
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
                  loadingText="Updating credentials..."
                  rightIcon={!isBusy ? <ArrowRight className="h-4 w-4" /> : null}
                >
                  Update Password & Sign In
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* State 3: Password Successfully Updated */
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
                <Shield className="h-3 w-3" />
                <span>Credentials Secured</span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Password Updated Successfully
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                Your account password has been updated. You can now use your new credentials to sign in.
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
                Sign In With New Password
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in link */}
        {!isSuccess && !isTokenInvalid && (
          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Remember your existing password?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </AuthLayout>
  )
}

export default ResetPassword
