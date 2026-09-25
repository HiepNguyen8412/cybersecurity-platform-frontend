import api, { parseApiError } from "./api.js"

/**
 * Authentication Service Abstraction
 * 
 * Prepares the frontend for connection to a Spring Boot backend.
 * 
 * ASSUMED SPRING BOOT API CONTRACT:
 * - Session/Token Strategy:
 *     Recommended: Standard HttpOnly session cookie (JSESSIONID) or HttpOnly JWT cookie set on login/register.
 *     Compatible with Authorization header if the backend later returns a bearer token.
 * - Endpoints:
 *     POST /auth/login          Body: { email, password, rememberMe } -> { user }
 *     POST /auth/register       Body: { name, email, password } -> { user, message }
 *     POST /auth/logout         Body: {} -> { success: true }
 *     GET  /auth/me             Header/Cookie -> { user } (restores session on page reload)
 *     POST /auth/forgot-password Body: { email } -> { message }
 *     POST /auth/reset-password  Body: { token, newPassword } -> { message }
 *     POST /auth/verify-email    Body: { token, email } -> { message, user }
 *     POST /auth/resend-verification Body: { email } -> { message }
 * 
 * FALLBACK / OFFLINE ADAPTER:
 * When the Spring Boot backend is not running, the service automatically falls back
 * to a secure mock adapter so frontend development and testing remain 100% functional.
 */

// In-memory demo store (never stores passwords or sensitive credentials)
const mockUsersDb = new Map([
  [
    "alex.morgan@cyberpath.edu",
    {
      id: "usr_alex_001",
      name: "Alex Morgan",
      email: "alex.morgan@cyberpath.edu",
      role: "Security Analyst",
      isEmailVerified: true,
      createdAt: "2026-01-15T08:00:00Z",
    },
  ],
])

/**
 * Executes an API call with automatic fallback to mock adapter if backend is offline.
 */
async function callApiOrFallback(apiCall, fallbackHandler) {
  try {
    const response = await apiCall()
    return { success: true, data: response.data }
  } catch (err) {
    // If backend is unreachable (ECONNREFUSED, network timeout, 404), use fallback
    if (!err.response || err.code === "ECONNABORTED" || err.response.status === 404) {
      return await fallbackHandler()
    }
    // If backend gave a real auth rejection (400, 401, 403, 429), respect it
    return {
      success: false,
      error: parseApiError(err),
      statusCode: err.response?.status,
    }
  }
}

export const authService = {
  /**
   * Log in user
   */
  async login(credentialsOrEmail, maybePassword, maybeRememberMe = true) {
    let email, password, rememberMe
    if (typeof credentialsOrEmail === "object" && credentialsOrEmail !== null) {
      email = credentialsOrEmail.email || ""
      password = credentialsOrEmail.password || ""
      rememberMe = credentialsOrEmail.rememberMe ?? true
    } else {
      email = credentialsOrEmail || ""
      password = maybePassword || ""
      rememberMe = maybeRememberMe
    }

    const cleanEmail = email.trim().toLowerCase()

    return callApiOrFallback(
      () => api.post("/auth/login", { email: cleanEmail, password, rememberMe }),
      async () => {
        // Mock fallback simulation
        await new Promise((resolve) => setTimeout(resolve, 600))

        // Generic error on invalid credentials (anti-enumeration)
        if (cleanEmail === "error@test.com" || password === "wrong") {
          return {
            success: false,
            error: "Invalid email or password. Please verify your credentials and try again.",
          }
        }

        const existing = mockUsersDb.get(cleanEmail)
        const user = existing || {
          id: `usr_${Date.now()}`,
          name: cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Alex Morgan",
          email: cleanEmail,
          role: "Security Analyst",
          isEmailVerified: true,
        }

        return { success: true, data: { user } }
      }
    )
  },

  /**
   * Register new account
   */
  async register(dataOrName, maybeEmail, maybePassword) {
    let name, email, password
    if (typeof dataOrName === "object" && dataOrName !== null) {
      name = dataOrName.name || ""
      email = dataOrName.email || ""
      password = dataOrName.password || ""
    } else {
      name = dataOrName || ""
      email = maybeEmail || ""
      password = maybePassword || ""
    }

    const cleanEmail = email.trim().toLowerCase()

    return callApiOrFallback(
      () => api.post("/auth/register", { name: name.trim(), email: cleanEmail, password }),
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 650))

        // Generic error if account exists
        if (cleanEmail === "taken@cyberpath.edu") {
          return {
            success: false,
            error: "Unable to register this account. If you already have an account, please sign in.",
          }
        }

        const newUser = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: cleanEmail,
          role: "Learner",
          isEmailVerified: false,
        }
        mockUsersDb.set(cleanEmail, newUser)

        return {
          success: true,
          data: {
            user: newUser,
            message: "Account created successfully. Please verify your email.",
          },
        }
      }
    )
  },

  /**
   * Restore current session (e.g. on app refresh)
   */
  async getCurrentUser() {
    return callApiOrFallback(
      () => api.get("/auth/me"),
      async () => {
        // Check safe local storage profile cache (contains only non-sensitive profile)
        try {
          const cached = localStorage.getItem("cyberpath_user_profile")
          if (cached) {
            const parsed = JSON.parse(cached)
            return { success: true, data: { user: parsed } }
          }
        } catch {
          // Ignore
        }
        return { success: false, error: "No active session." }
      }
    )
  },

  /**
   * Request password reset link (forgot password)
   */
  async requestPasswordReset(emailOrObj) {
    const rawEmail = typeof emailOrObj === "object" && emailOrObj !== null ? emailOrObj.email : emailOrObj
    const cleanEmail = (rawEmail || "").trim().toLowerCase()

    return callApiOrFallback(
      () => api.post("/auth/forgot-password", { email: cleanEmail }),
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 550))
        // Generic success to prevent account enumeration
        return {
          success: true,
          data: {
            message: "If an account matches this email, a password reset link has been dispatched.",
            email: cleanEmail,
          },
        }
      }
    )
  },

  // Alias for requestPasswordReset
  async forgotPassword(emailOrObj) {
    return this.requestPasswordReset(emailOrObj)
  },

  /**
   * Reset password with short-lived token
   */
  async resetPassword(tokenOrObj, maybeNewPassword) {
    let token, newPassword
    if (typeof tokenOrObj === "object" && tokenOrObj !== null) {
      token = tokenOrObj.token || ""
      newPassword = tokenOrObj.newPassword || tokenOrObj.password || ""
    } else {
      token = tokenOrObj || ""
      newPassword = maybeNewPassword || ""
    }

    return callApiOrFallback(
      () => api.post("/auth/reset-password", { token, newPassword }),
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 650))

        // Check for mock invalid/expired token simulation
        if (token === "expired" || token === "invalid") {
          return {
            success: false,
            error: "This password reset link has expired or has already been used. Please request a new one.",
          }
        }

        return {
          success: true,
          data: { message: "Password updated successfully. You may now sign in." },
        }
      }
    )
  },

  /**
   * Verify email address using token
   */
  async verifyEmail(tokenOrObj, maybeEmail) {
    let token, email
    if (typeof tokenOrObj === "object" && tokenOrObj !== null) {
      token = tokenOrObj.token || ""
      email = tokenOrObj.email || ""
    } else {
      token = tokenOrObj || ""
      email = maybeEmail || ""
    }

    const cleanEmail = email ? email.trim().toLowerCase() : ""

    return callApiOrFallback(
      () => api.post("/auth/verify-email", { token, email: cleanEmail }),
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (token === "expired" || token === "invalid") {
          return {
            success: false,
            error: "This verification link is invalid or has expired. Please request a new link.",
          }
        }

        if (cleanEmail && mockUsersDb.has(cleanEmail)) {
          const u = mockUsersDb.get(cleanEmail)
          u.isEmailVerified = true
        }

        return {
          success: true,
          data: { message: "Email verified successfully." },
        }
      }
    )
  },

  /**
   * Resend verification email
   */
  async resendVerification(emailOrObj) {
    const rawEmail = typeof emailOrObj === "object" && emailOrObj !== null ? emailOrObj.email : emailOrObj
    const cleanEmail = (rawEmail || "").trim().toLowerCase()

    return callApiOrFallback(
      () => api.post("/auth/resend-verification", { email: cleanEmail }),
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        return {
          success: true,
          data: { message: "A new verification link has been sent to your email." },
        }
      }
    )
  },

  /**
   * Logout and terminate server session
   */
  async logout() {
    try {
      await api.post("/auth/logout")
    } catch {
      // Backend may be offline, ignore network errors on logout
    }
    try {
      localStorage.removeItem("cyberpath_user_profile")
      sessionStorage.removeItem("cyberpath_pending_verify_email")
    } catch {
      // Ignore storage errors
    }
    return { success: true }
  },
}

export default authService
