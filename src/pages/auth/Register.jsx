import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Lock, AlertCircle, Shield, ArrowRight, CheckCircle2 } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Checkbox, Divider } from "../../components/common"
import PasswordStrength from "../../components/auth/PasswordStrength"
import SocialAuthButtons from "../../components/auth/SocialAuthButtons"
import useAuth from "../../hooks/useAuth"
import { validateEmail, validatePassword } from "../../utils/validators"

/**
 * Production-ready Registration page:
 * - Robust input validation and real-time password strength enforcement
 * - Dynamic password match feedback
 * - Responsible security lab usage acknowledgement
 * - Anti-enumeration handling for existing accounts
 */
function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, isLoading, authError, clearAuthError } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errors = {}

    if (!name.trim()) {
      errors.name = "Full name is required."
    } else if (name.trim().length < 2) {
      errors.name = "Full name must be at least 2 characters."
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
      errors.confirmPassword = "Please confirm your password."
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }

    if (!agreeTerms) {
      errors.agreeTerms = "You must agree to the Terms of Service and Lab Ethics to create an account."
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError("")
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
        // Direct transition to email verification
        navigate(`/verify-email?email=${encodeURIComponent(cleanEmail)}`, { replace: true })
      } else {
        setFormError(result.error || "Unable to complete registration. Please verify your details.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeError = formError || authError
  const isBusy = isSubmitting || isLoading

  // Live password match helper
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Header with Security Sub-badge */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
            <Shield className="h-3 w-3" />
            <span>Defender Registration</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Create Your Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal">
            Access hands-on virtual security labs, challenge ranges, and guided paths.
          </p>
        </div>

        {/* Global Error Banner */}
        {activeError && (
          <div
            role="alert"
            aria-live="assertive"
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Registration error</span>
              <span>{activeError}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Full Name */}
          <Input
            id="register-name"
            label="Full name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }))
              if (formError) setFormError("")
            }}
            placeholder="e.g. Alex Morgan"
            leftIcon={<User className="h-4 w-4 text-slate-400" />}
            errorMessage={fieldErrors.name}
            disabled={isBusy}
          />

          {/* Email Address */}
          <Input
            id="register-email"
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

          {/* Password with Strength Indicator */}
          <div className="space-y-1.5">
            <Input
              id="register-password"
              label="Create password"
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

            {/* Progressive Password Strength Meter */}
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="register-confirm-password"
                className="text-xs font-semibold text-slate-700 tracking-wide"
              >
                Confirm password <span className="text-rose-500">*</span>
              </label>

              {isPasswordMatch && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 animate-in fade-in">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Passwords match</span>
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
              leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
              showPasswordToggle
              errorMessage={fieldErrors.confirmPassword}
              disabled={isBusy}
            />
          </div>

          {/* Terms Acceptance */}
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
                <span className="text-xs text-slate-600 leading-normal">
                  I agree to the{" "}
                  <span className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                    Terms of Service
                  </span>
                  ,{" "}
                  <span className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                    Privacy Policy
                  </span>
                  , and responsible security lab ethics.
                </span>
              }
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isBusy}
              loadingText="Creating account..."
              rightIcon={!isBusy ? <ArrowRight className="h-4 w-4" /> : null}
            >
              Create Defender Account
            </Button>
          </div>
        </form>

        {/* Social Registration */}
        <div className="space-y-3 pt-1">
          <Divider label="or sign up with" />
          <SocialAuthButtons />
        </div>

        {/* Sign In Link */}
        <p className="text-center text-xs text-slate-500 pt-1">
          Already have an account?{" "}
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

export default Register