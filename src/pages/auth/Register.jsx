import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Mail, Lock, AlertCircle } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Checkbox, Divider } from "../../components/common"
import PasswordStrength from "../../components/auth/PasswordStrength"
import SocialAuthButtons from "../../components/auth/SocialAuthButtons"
import useAuth from "../../hooks/useAuth"

/**
 * Register page with progressive password strength indicator, terms acceptance,
 * clean field validations, and transition to Verify Email.
 */
function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  // Validate form before creating account
  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Please enter your full name."
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com)."
    }

    if (!password) {
      newErrors.password = "Please create a password."
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long."
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password."
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service to create an account."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError("")

    if (!validateForm()) return

    setIsLoading(true)
    const result = await register({ name: name.trim(), email: email.trim(), password })
    setIsLoading(false)

    if (result.success) {
      // Flow requirement: Register -> Verify Email -> Dashboard
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`)
    } else {
      setAuthError(result.error || "Unable to register account. Please try again.")
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal">
            Start your cybersecurity journey with interactive labs and guided learning.
          </p>
        </div>

        {/* Global Error Banner */}
        {authError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Registration error</span>
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
            }}
            placeholder="e.g. Alex Morgan"
            leftIcon={<User className="h-4 w-4" />}
            errorMessage={errors.name}
            disabled={isLoading}
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
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
            }}
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            errorMessage={errors.email}
            disabled={isLoading}
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
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
              }}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              showPasswordToggle
              errorMessage={errors.password}
              disabled={isLoading}
            />

            {/* Progressive Password Strength Meter */}
            <PasswordStrength password={password} />
          </div>

          {/* Confirm Password */}
          <Input
            id="register-confirm-password"
            label="Confirm password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
            }}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            showPasswordToggle
            errorMessage={errors.confirmPassword}
            disabled={isLoading}
          />

          {/* Terms Acceptance */}
          <div className="pt-1">
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked)
                if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: "" }))
              }}
              disabled={isLoading}
              errorMessage={errors.agreeTerms}
              label={
                <span className="text-xs text-slate-600">
                  I agree to the{" "}
                  <span className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                    Privacy Policy
                  </span>
                </span>
              }
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create account
            </Button>
          </div>
        </form>

        {/* Social Registration */}
        <div className="space-y-3">
          <Divider label="or sign up with" />
          <SocialAuthButtons />
        </div>

        {/* Sign In Link */}
        <p className="text-center text-xs text-slate-500 pt-2">
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