import axios from "axios"

/**
 * Patterns matching sensitive server errors or internal technical leaks.
 * Prevents stack traces, class names, SQL syntax errors, or DB details from leaking to the UI.
 */
const TECHNICAL_LEAK_PATTERNS = [
  /exception/i,
  /sql/i,
  /hibernate/i,
  /org\.springframework/i,
  /java\./i,
  /javax\./i,
  /jakarta\./i,
  /syntax\s*error/i,
  /stack\s*trace/i,
  /column\s+.*not\s+found/i,
  /table\s+.*doesn't\s+exist/i,
  /nullpointer/i,
  /at\s+[\w$./]+(?::\d+)?/i,
  /jdbc/i,
  /database/i,
  /datasource/i,
  /deadlock/i,
]

function containsTechnicalLeak(text) {
  if (typeof text !== "string") return false
  return TECHNICAL_LEAK_PATTERNS.some((pattern) => pattern.test(text))
}

/**
 * Axios instance configured for secure backend communication.
 * - withCredentials: true ensures HttpOnly cookies (session/refresh tokens) are sent automatically.
 * - xsrfCookieName & xsrfHeaderName align with Spring Security CSRF protection.
 * - Centralized response interceptor catches 401 session expiration without leaking technical traces.
 */
const api = axios.create({
  baseURL: (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:8080/api",
  withCredentials: true,
  timeout: 15000,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

// Global session expiration handler (registered by AuthContext)
let unauthorizedSessionHandler = null

export function setUnauthorizedSessionHandler(handler) {
  unauthorizedSessionHandler = handler
}

// Endpoints where a 401 represents invalid credentials rather than an expired session
const AUTH_CREDENTIAL_ENDPOINTS = ["/auth/login", "/auth/register"]

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ""
      const isAuthCredentialAttempt = AUTH_CREDENTIAL_ENDPOINTS.some((endpoint) =>
        requestUrl.includes(endpoint)
      )

      // If an authenticated endpoint receives 401, trigger session invalidation
      if (!isAuthCredentialAttempt && typeof unauthorizedSessionHandler === "function") {
        unauthorizedSessionHandler()
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Parses Axios errors into clean, security-hardened user-friendly error messages.
 * Prevents technical stack traces, database schema leaks, and user enumeration leaks from reaching the UI.
 */
export function parseApiError(error, defaultMessage = "An unexpected error occurred. Please try again.") {
  if (!error) return defaultMessage

  // Server responded with an HTTP status code outside 2xx
  if (error.response) {
    const status = error.response.status
    const data = error.response.data

    if (status === 401) {
      // Standardized message to prevent account enumeration / internal message exposure
      return "Invalid credentials or session expired."
    }

    if (status === 403) {
      return "You do not have permission to perform this action."
    }

    if (status === 404) {
      return "The requested resource was not found."
    }

    if (status === 429) {
      return "Too many requests. Please slow down and try again in a few moments."
    }

    if (status >= 500) {
      return "The service is temporarily unavailable. Please try again later."
    }

    // Client/validation errors from backend (400, 422)
    if (data?.message && typeof data.message === "string") {
      // Suppress messages containing internal technical jargon or stack traces
      if (!containsTechnicalLeak(data.message)) {
        return data.message
      }
      return "The request could not be processed. Please check your input."
    }
  }

  // Request was made but no response was received (Network error / Backend down)
  if (error.request) {
    return "Unable to connect to the server. Please check your network connection."
  }

  // Never return raw error.message (which may contain internal network or runtime details)
  return defaultMessage
}

export default api