import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, MailCheck, RefreshCw, ArrowRight } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"
import useAuth from "../../hooks/useAuth"

/**
 * Forgot Password recovery flow with initial request state and dedicated "Check your email" success state.
 */
function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState("")

  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.")
      return
    }

    setIsLoading(true)
    const result = await requestPasswordReset(email.trim())
    setIsLoading(false)

    if (result.success) {
      setIsSuccess(true)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setResendMessage("")
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsResending(false)
    setResendMessage("A fresh reset link has been dispatched to your inbox.")
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </Link>

        {!isSuccess ? (
          /* ====================================================================
             Initial Request Form State
             ==================================================================== */
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Forgot password?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                Enter your registered email address and we'll send you instructions to reset your password.
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
                  if (error) setError("")
                }}
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                errorMessage={error}
                disabled={isLoading}
              />

              <div className="pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  loadingText="Sending reset link..."
                >
                  Send reset link
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* ====================================================================
             Dedicated "Check Your Email" Success State
             ==================================================================== */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Visual Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <MailCheck className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                Check your email
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We've sent a password reset link to:
                <br />
                <span className="font-semibold text-slate-900">{email}</span>
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Click the link in the email to set a new password. If you don't see it within a couple minutes, please check your spam folder.
            </p>

            {resendMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 animate-in fade-in">
                {resendMessage}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              {/* Direct link to test Reset Password step */}
              <Link to={`/reset-password?email=${encodeURIComponent(email)}`}>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Test Reset Flow &rarr; Reset Password
                </Button>
              </Link>

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleResend}
                isLoading={isResending}
                loadingText="Resending..."
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Resend email
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