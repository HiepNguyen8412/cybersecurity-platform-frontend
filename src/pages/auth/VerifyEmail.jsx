import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { MailCheck, CheckCircle2, AlertTriangle, RefreshCw, ArrowRight, Edit2, Check } from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Badge } from "../../components/common"
import useAuth from "../../hooks/useAuth"

/**
 * Verify Email flow supporting states:
 * - Waiting (awaiting verification)
 * - Resending (sending new verification email)
 * - Verified (email confirmed, redirect to dashboard)
 * - Expired (verification token expired, request new link)
 */
function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmail } = useAuth()

  const initialEmail =
    searchParams.get("email") ||
    sessionStorage.getItem("cybershield_pending_verify_email") ||
    "alex.morgan@cybershield.edu"

  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState(() =>
    searchParams.get("status") === "verified" ? "verified" : "waiting"
  )
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [tempEmail, setTempEmail] = useState(initialEmail)
  const [resendNotification, setResendNotification] = useState("")

  // Mock resend email action
  const handleResend = async () => {
    setStatus("resending")
    setResendNotification("")
    await new Promise((resolve) => setTimeout(resolve, 600))
    setStatus("waiting")
    setResendNotification(`A new verification email has been sent to ${email}.`)
  }

  // Mock simulate verification action
  const handleSimulateVerification = async () => {
    await verifyEmail(email)
    setStatus("verified")
  }

  // Save updated email
  const handleSaveEmail = (e) => {
    e.preventDefault()
    if (tempEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail.trim())) {
      setEmail(tempEmail.trim())
      setIsEditingEmail(false)
      setResendNotification(`Updated email to ${tempEmail.trim()}. Fresh verification sent.`)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* ====================================================================
            STATE 1 & 2: Waiting / Resending
           ==================================================================== */}
        {status !== "verified" && status !== "expired" && (
          <div className="space-y-6">
            {/* Visual Header */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <MailCheck className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Verify your email
                </h2>
                <Badge variant="primary" size="sm">
                  Pending
                </Badge>
              </div>

              {!isEditingEmail ? (
                <div className="flex items-center gap-2 pt-0.5">
                  <p className="text-xs sm:text-sm text-slate-600">
                    We sent a verification link to:{" "}
                    <span className="font-semibold text-slate-900">{email}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTempEmail(email)
                      setIsEditingEmail(true)
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 p-0.5 rounded cursor-pointer"
                    title="Change email address"
                    aria-label="Change email address"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveEmail} className="flex items-center gap-2 pt-2">
                  <Input
                    id="change-email"
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    size="sm"
                    wrapperClassName="flex-1"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingEmail(false)}
                  >
                    Cancel
                  </Button>
                </form>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Click the link inside the email to confirm your account and gain full access to learning tracks and simulated labs.
            </p>

            {resendNotification && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-xs text-blue-800 animate-in fade-in">
                {resendNotification}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              {/* Mock Simulation trigger to test Verified state */}
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleSimulateVerification}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Simulate: Confirm Email &rarr; Dashboard
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleResend}
                  isLoading={status === "resending"}
                  loadingText="Resending..."
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  Resend email
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setStatus("expired")}
                  className="text-slate-600 hover:text-amber-700"
                >
                  Test Expired Link
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 3: Verified
           ==================================================================== */}
        {status === "verified" && (
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Email verified!
                </h2>
                <Badge variant="success" size="sm">
                  Verified
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your email <span className="font-semibold text-slate-900">{email}</span> has been confirmed. Your learning environment is fully provisioned.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate("/dashboard")}
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 4: Expired
           ==================================================================== */}
        {status === "expired" && (
          <div className="space-y-6 text-left animate-in fade-in duration-200">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-2xs">
              <AlertTriangle className="h-7 w-7 stroke-[2]" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Verification link expired
                </h2>
                <Badge variant="warning" size="sm">
                  Expired
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                For security reasons, verification links expire after 24 hours. Request a new link below to activate your account.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setStatus("waiting")
                  setResendNotification("A brand new verification link has been dispatched.")
                }}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Request a new link
              </Button>

              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setStatus("waiting")}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in link */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already verified?{" "}
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

export default VerifyEmail
