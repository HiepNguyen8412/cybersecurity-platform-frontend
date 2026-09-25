import { Check, X } from "lucide-react"

/**
 * Reusable Password Strength Indicator component.
 * Displays progressive strength meter and clear, unobtrusive requirements checklist.
 */
export function PasswordStrength({ password = "" }) {
  if (!password) return null

  // Requirements tests
  const hasMinLength = password.length >= 8
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  // Calculate score from 1 to 4
  let score = 0
  if (password.length > 0) score += 1
  if (hasMinLength) score += 1
  if (hasUpperLower && (hasNumber || hasSpecial)) score += 1
  if (hasMinLength && hasUpperLower && hasNumber && hasSpecial) score += 1

  const strengthConfig = [
    { label: "", color: "bg-slate-200" },
    { label: "Weak", color: "bg-rose-500", text: "text-rose-600" },
    { label: "Fair", color: "bg-amber-500", text: "text-amber-600" },
    { label: "Good", color: "bg-blue-600", text: "text-blue-600" },
    { label: "Strong", color: "bg-emerald-600", text: "text-emerald-600" },
  ]

  const current = strengthConfig[score] || strengthConfig[1]

  const requirements = [
    { label: "At least 8 characters", met: hasMinLength },
    { label: "Includes numbers or special symbols", met: hasNumber || hasSpecial },
  ]

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-150">
      {/* 4-Segment Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Password strength:</span>
          <span className={`font-semibold ${current.text}`}>
            {current.label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`rounded-full transition-colors duration-200 ${
                score >= step ? current.color : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progressive Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
        {requirements.map((req) => (
          <div
            key={req.label}
            className={`flex items-center gap-1.5 ${
              req.met ? "text-emerald-700" : "text-slate-400"
            }`}
          >
            {req.met ? (
              <Check className="h-3 w-3 stroke-[3] shrink-0" />
            ) : (
              <X className="h-3 w-3 shrink-0 text-slate-300" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PasswordStrength
