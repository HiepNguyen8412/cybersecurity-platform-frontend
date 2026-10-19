import { Check, X } from "lucide-react"
import { calculatePasswordStrength } from "../../utils/validators"

/**
 * Reusable Password Strength Indicator component.
 * Displays progressive strength meter and clean, unobtrusive requirements checklist.
 */
export function PasswordStrength({ password = "" }) {
  if (!password) return null

  const strength = calculatePasswordStrength(password)

  const requirements = [
    { label: "Tối thiểu 8 ký tự", met: strength.hasMinLength },
    { label: "Bao gồm chữ hoa và chữ thường", met: strength.hasUpperLower },
    { label: "Ít nhất một chữ số (0-9)", met: strength.hasNumber },
    { label: "Ít nhất một ký tự đặc biệt (!@#$)", met: strength.hasSpecial },
  ]

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-150" aria-live="polite">
      {/* 4-Segment Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Độ mạnh mật khẩu:</span>
          <span className={`font-semibold ${strength.textColor}`}>
            {strength.label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 h-1.5" role="progressbar" aria-valuenow={strength.score * 25} aria-valuemin={0} aria-valuemax={100}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`rounded-full transition-colors duration-200 ${
                strength.score >= step ? strength.color : "bg-slate-200"
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
              <Check className="h-3 w-3 stroke-[3] shrink-0 text-emerald-600" aria-hidden="true" />
            ) : (
              <X className="h-3 w-3 shrink-0 text-slate-300" aria-hidden="true" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PasswordStrength
