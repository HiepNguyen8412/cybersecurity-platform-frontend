import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 400)
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Forgot password?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="rounded-xl bg-blue-50 border border-blue-200/60 p-4 text-center">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Reset Link Dispatched
            </p>
            <p className="text-xs text-blue-700">
              If an account matches <span className="font-semibold">{email}</span>, you will receive password reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Input
              id="email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                loadingText="Sending link..."
              >
                Send reset link
              </Button>
            </div>
          </form>
        )}

        {/* Back to login */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default ForgotPassword