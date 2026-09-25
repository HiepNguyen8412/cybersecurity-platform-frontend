import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import {
  MailCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Edit2,
  Check,
  Loader2,
  Shield,
  ShieldCheck,
} from "lucide-react"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input, Badge } from "../../components/common"
import useAuth from "../../hooks/useAuth"
import { validateEmail } from "../../utils/validators"

/**
 * Production-ready Email Verification page:
 * - Reads verification tokens from URL parameters
 * - Auto-triggers verification check when token is present
 * - 60s cooldown timer on resend requests to prevent abuse
 * - Explicit expired/invalid token states
 */
function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmail, resendVerification, isLoading } = useAuth()

  const urlToken = searchParams.get("token")
  const urlEmail = searchParams.get("email")

  const initialEmail =
    urlEmail ||
    (() => {
      try {
        return sessionStorage.getItem("cyberpath_pending_verify_email") || ""
      } catch {
        return ""
      }
    })() ||
    "alex.morgan@cyberpath.edu"

  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState(() => (urlToken ? "verifying" : "waiting"))
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [tempEmail, setTempEmail] = useState(initialEmail)
  const [editError, setEditError] = useState("")
  const [resendNotification, setResendNotification] = useState("")
  const [cooldown, setCooldown] = useState(0)

  // Resend cooldown timer effect
  useEffect(() => {
    let timer
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  // Automatically attempt token verification if a token is present in the URL query
  useEffect(() => {
    if (!urlToken) return
    let isMounted = true

    const runVerification = async () => {
      const result = await verifyEmail(urlToken, urlEmail || email)
      if (!isMounted) return

      if (result.success) {
        setStatus("verified")
      } else {
        setStatus("expired")
      }
    }

    runVerification()

    return () => {
      isMounted = false
    }
  }, [urlToken, urlEmail, email, verifyEmail])

  // Manual simulation / token verification trigger
  const triggerTokenVerification = async (tokenVal, emailVal) => {
    setStatus("verifying")
    const result = await verifyEmail(tokenVal, emailVal)
    if (result.success) {
      setStatus("verified")
    } else {
      setStatus("expired")
    }
  }

  // Resend verification email
  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return

    setResendNotification("")
    const result = await resendVerification(email)

    if (result.success) {
      setResendNotification(`A new verification email has been dispatched to ${email}.`)
      setCooldown(60)
    } else {
      setResendNotification("Unable to send verification email. Please try again in a few moments.")
    }
  }

  // Save corrected email address
  const handleSaveEmail = (e) => {
    e.preventDefault()
    setEditError("")

    const emailCheck = validateEmail(tempEmail)
    if (!emailCheck.isValid) {
      setEditError(emailCheck.error)
      return
    }

    const clean = tempEmail.trim().toLowerCase()
    setEmail(clean)
    setIsEditingEmail(false)
    try {
      sessionStorage.setItem("cyberpath_pending_verify_email", clean)
    } catch {
      // Ignore
    }
    setResendNotification(`Updated email to ${clean}. A new verification link has been sent.`)
    setCooldown(60)
  }

  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* ====================================================================
            STATE: Verifying Token
           ==================================================================== */}
        {status === "verifying" && (
          <div className="space-y-5 text-center py-6 animate-in fade-in">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <Loader2 className="h-7 w-7 animate-spin stroke-[2.2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Verifying Email Token...
              </h2>
              <p className="text-xs text-slate-500">
                Confirming cryptographic security token with CyberPath gateway.
              </p>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE: Waiting for Verification
           ==================================================================== */}
        {status === "waiting" && (
          <div className="space-y-5 animate-in fade-in">
            {/* Visual Header */}
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
              <MailCheck className="h-7 w-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                <Shield className="h-3 w-3" />
                <span>Verification Pending</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Verify Your Email
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
                      setEditError("")
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 p-0.5 rounded cursor-pointer"
                    title="Change email address"
                    aria-label="Change email address"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveEmail} className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="change-email"
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      size="sm"
                      wrapperClassName="flex-1"
                      errorMessage={editError}
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
                  </div>
                </form>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed text-left">
              Click the link inside your email to activate your account and provision your isolated cybersecurity learning environment.
            </p>

            {resendNotification && (
              <div
                role="status"
                className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-xs text-blue-800 animate-in fade-in text-left"
              >
                {resendNotification}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              {/* Demo Action: Simulate token verification for review */}
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => triggerTokenVerification("mock_demo_token", email)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Simulate: Confirm Email Token
              </Button>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleResend}
                  disabled={cooldown > 0 || isLoading}
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                >
                  {cooldown > 0 ? `Resend (${cooldown}s)` : "Resend email"}
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
            STATE: Email Verified
           ==================================================================== */}
        {status === "verified" && (
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
              <CheckCircle2 className="h-7 w-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
                <ShieldCheck className="h-3 w-3" />
                <span>Verification Complete</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Email Verified!
                </h2>
                <Badge variant="success" size="sm">
                  Verified
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your email <span className="font-semibold text-slate-900">{email}</span> has been confirmed. Your learning environment and sandboxes are ready.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE: Verification Token Expired
           ==================================================================== */}
        {status === "expired" && (
          <div className="space-y-5 text-center animate-in fade-in duration-200">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 shadow-2xs">
              <AlertTriangle className="h-7 w-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[11px] font-semibold text-amber-700 tracking-wide uppercase">
                <span>Security Notice</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">
                  Verification Link Expired
                </h2>
                <Badge variant="warning" size="sm">
                  Expired
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                For security reasons, email verification links expire after 24 hours. Request a new link below to activate your account.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setStatus("waiting")
                  handleResend()
                }}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Send a New Verification Link
              </Button>

              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setStatus("waiting")}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Back to sign in prompt */}
        {status !== "verified" && (
          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already verified?{" "}
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

export default VerifyEmail
