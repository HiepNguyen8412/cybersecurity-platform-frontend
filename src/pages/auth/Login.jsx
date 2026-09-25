import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, AlertCircle, Info } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Checkbox, Divider } from "../../components/common"
import SocialAuthButtons from "../../components/auth/SocialAuthButtons"
import useAuth from "../../hooks/useAuth"

/**
 * Login page with complete validation states (default, focus, error, loading, success),
 * show/hide password, remember me, social login placeholders, and mock state handling.
 */
function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  // Validate form inputs before submission
  const validateForm = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = "Please enter your email address."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@domain.com)."
    }

    if (!password) {
      newErrors.password = "Please enter your password."
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError("")

    if (!validateForm()) return

    setIsLoading(true)
    const result = await login(email.trim(), password, rememberMe)
    setIsLoading(false)

    if (result.success) {
      navigate("/dashboard")
    } else {
      setAuthError(result.error || "Invalid credentials. Please verify your email and password.")
    }
  }

  // Quick fill helper for review/testing
  const handleFillDemo = () => {
    setEmail("alex.morgan@cybershield.edu")
    setPassword("password123")
    setErrors({})
    setAuthError("")
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-normal">
            Sign in to your learning account to continue your practice.
          </p>
        </div>

        {/* Global Auth Error (if credentials fail) */}
        {authError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Authentication failed</span>
              <span>{authError}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email Field */}
          <Input
            id="login-email"
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
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
              }}
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              showPasswordToggle
              errorMessage={errors.password}
              disabled={isLoading}
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="pt-1">
            <Checkbox
              id="remember-me"
              label="Remember me for 30 days"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
          </div>

          {/* Primary Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign in
            </Button>
          </div>
        </form>

        {/* Demo Quick Fill Helper */}
        <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="text-[11px] text-blue-800">
              Demo: <span className="font-semibold">alex.morgan@cybershield.edu</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Social Auth Placeholders */}
        <div className="space-y-3">
          <Divider label="or continue with" />
          <SocialAuthButtons />
        </div>

        {/* Registration Link */}
        <p className="text-center text-xs text-slate-500 pt-2">
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