/**
 * Validation utilities for security-first authentication.
 */

/**
 * Validates email format according to RFC 5322 standard regex.
 * Prevents control characters and common injection vectors.
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email address is required." }
  }

  const trimmed = email.trim()
  if (trimmed.length > 254) {
    return { isValid: false, error: "Email address cannot exceed 254 characters." }
  }

  // Standard safe email pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid email address (e.g. name@domain.com)." }
  }

  return { isValid: true, error: null }
}

/**
 * Calculates password strength score (0 to 4) and checks requirements.
 * Requirements:
 * - Minimum 8 characters (12+ recommended)
 * - Lowercase & uppercase letters
 * - Numbers
 * - Special characters
 */
export function calculatePasswordStrength(password = "") {
  if (!password) {
    return {
      score: 0,
      label: "",
      color: "bg-slate-200",
      textColor: "text-slate-400",
      hasMinLength: false,
      hasUpperLower: false,
      hasNumber: false,
      hasSpecial: false,
      isAcceptable: false,
    }
  }

  const hasMinLength = password.length >= 8
  const hasStrongLength = password.length >= 12
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  let score = 0
  if (password.length > 0) score += 1
  if (hasMinLength) score += 1
  if (hasUpperLower && (hasNumber || hasSpecial)) score += 1
  if ((hasStrongLength || (hasMinLength && hasUpperLower && hasNumber && hasSpecial))) score += 1

  const strengthMap = [
    { label: "", color: "bg-slate-200", textColor: "text-slate-400" },
    { label: "Weak", color: "bg-rose-500", textColor: "text-rose-600" },
    { label: "Fair", color: "bg-amber-500", textColor: "text-amber-600" },
    { label: "Good", color: "bg-blue-600", textColor: "text-blue-600" },
    { label: "Strong", color: "bg-emerald-600", textColor: "text-emerald-600" },
  ]

  const current = strengthMap[score] || strengthMap[1]

  return {
    score,
    label: current.label,
    color: current.color,
    textColor: current.textColor,
    hasMinLength,
    hasUpperLower,
    hasNumber,
    hasSpecial,
    isAcceptable: hasMinLength,
  }
}

/**
 * Validates password format for registration/reset.
 */
export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required." }
  }

  if (password.length < 8) {
    return { isValid: false, error: "Password must be at least 8 characters long." }
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password cannot exceed 128 characters." }
  }

  const strength = calculatePasswordStrength(password)
  if (!strength.hasMinLength) {
    return { isValid: false, error: "Password does not meet minimum length requirement." }
  }

  return { isValid: true, error: null }
}

/**
 * Sanitizes return URL to prevent Open Redirect attacks.
 * Only allows relative paths on the same origin starting with "/" but not "//".
 */
export function sanitizeReturnUrl(returnUrl, defaultUrl = "/dashboard") {
  if (!returnUrl || typeof returnUrl !== "string") {
    return defaultUrl
  }

  const trimmed = returnUrl.trim()

  // Must begin with single "/" and not "//" (protocol-relative URL) or contain backslashes
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("\\")) {
    // Prevent redirecting back to authentication pages
    if (
      trimmed === "/login" ||
      trimmed === "/register" ||
      trimmed === "/forgot-password" ||
      trimmed === "/reset-password" ||
      trimmed === "/verify-email"
    ) {
      return defaultUrl
    }
    return trimmed
  }

  return defaultUrl
}
