import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Lock, CheckCircle2, ArrowRight } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"
import PasswordStrength from "../../components/auth/PasswordStrength"
import useAuth from "../../hooks/useAuth"

/**
 * Reset Password page with password strength indicator, confirmation matching,
 * and a dedicated success state redirecting to Login.
 */
function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = "Please enter a new password."
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long."
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password."
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    const result = await resetPassword(password)
    setIsLoading(false)

    if (result.success) {
      setIsSuccess(true)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {!isSuccess ? (
          /* ====================================================================
             Form State: Enter New Password
             ==================================================================== */
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Set new password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                Your new password must be at least 8 characters long and different from previous passwords.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-4 w-4" />}
                  showPasswordToggle
                  errorMessage={errors.password}
                  disabled={isLoading}
                />

                {/* Password Strength Meter & Checklist */}
                <PasswordStrength password={password} />
              </div>

              {/* Confirm New Password */}
              <Input
                id="confirm-new-password"
                label="Confirm new password"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                }}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                showPasswordToggle
                errorMessage={errors.confirmPassword}
                disabled={isLoading}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Updating password..."
                >
                  Reset password
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* ====================================================================
             Success State: Password Updated
             ==================================================================== */
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Your password has been updated
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                Your account password has been changed successfully. You can now use your new credentials to sign in.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate("/login")}
              >
                Return to Login
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in link */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Remember your old password?{" "}
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

export default ResetPassword
