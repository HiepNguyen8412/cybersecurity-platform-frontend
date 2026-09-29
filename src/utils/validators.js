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

const AUTH_PAGES = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
])

/**
 * Sanitizes return URL to prevent Open Redirect attacks.
 * - Accepts both string paths and React Router location objects ({ pathname, search, hash }).
 * - Only allows relative paths on the same origin starting with a single "/" (never "//" or "/\").
 * - Rejects protocol-relative, encoded, or scheme-based exploits (javascript:, data:, etc.).
 * - Strips query/hash when validating against authentication routes to prevent redirect loops.
 */
export function sanitizeReturnUrl(returnUrl, defaultUrl = "/dashboard") {
  let rawUrl
  if (typeof returnUrl === "string") {
    rawUrl = returnUrl
  } else if (returnUrl && typeof returnUrl === "object" && typeof returnUrl.pathname === "string") {
    rawUrl = `${returnUrl.pathname}${returnUrl.search || ""}${returnUrl.hash || ""}`
  } else {
    return defaultUrl
  }

  // Remove ASCII control characters (including \0, \r, \n, \t) without triggering no-control-regex
  let sanitized = ""
  for (let i = 0; i < rawUrl.length; i++) {
    const code = rawUrl.charCodeAt(i)
    if (code >= 32 && code !== 127) {
      sanitized += rawUrl[i]
    }
  }
  const trimmed = sanitized.trim()

  if (!trimmed) {
    return defaultUrl
  }

  // Must begin with single "/" and not "//" (protocol-relative URL) or contain backslashes
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\") || trimmed.includes("\\")) {
    return defaultUrl
  }

  // Verify decoded URL doesn't introduce protocol schemes or double slashes
  try {
    const decoded = decodeURIComponent(trimmed)
    if (
      decoded.startsWith("//") ||
      decoded.startsWith("/\\") ||
      decoded.includes("\\") ||
      /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded.slice(1)) ||
      /javascript:/i.test(decoded) ||
      /data:/i.test(decoded)
    ) {
      return defaultUrl
    }
  } catch {
    // Malformed URI encoding
    return defaultUrl
  }

  // Extract base pathname (excluding query parameters and hash) to check against auth routes
  const [pathnamePart] = trimmed.split(/[?#]/)
  const normalizedPath = pathnamePart.replace(/\/+$/, "").toLowerCase() || "/"

  // Prevent redirecting back to authentication pages (prevents infinite redirect loops)
  if (AUTH_PAGES.has(normalizedPath)) {
    return defaultUrl
  }

  return trimmed
}
