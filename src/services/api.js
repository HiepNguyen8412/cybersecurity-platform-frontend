import axios from "axios"

/**
 * Axios instance configured for secure backend communication.
 * - withCredentials: true ensures HttpOnly cookies (session/refresh tokens) are sent automatically.
 * - Centralized error interceptor standardizes security-safe messages without leaking server stack traces.
 */
const api = axios.create({
  baseURL: (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "http://localhost:8080/api",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
})

/**
 * Parses Axios errors into clean, safe user-friendly error messages.
 * Prevents technical stack traces or database schema leaks from reaching the UI.
 */
export function parseApiError(error, defaultMessage = "An unexpected error occurred. Please try again.") {
  if (!error) return defaultMessage

  // Server responded with an HTTP status code outside 2xx
  if (error.response) {
    const status = error.response.status
    const data = error.response.data

    if (status === 401) {
      return data?.message || "Invalid credentials or session expired."
    }

    if (status === 403) {
      return data?.message || "You do not have permission to perform this action."
    }

    if (status === 404) {
      return data?.message || "The requested resource was not found."
    }

    if (status === 429) {
      return "Too many attempts. Please slow down and try again in a few moments."
    }

    if (status >= 500) {
      return "The service is temporarily unavailable. Please try again later."
    }

    // Client/validation errors from backend (400, 422)
    if (data?.message && typeof data.message === "string") {
      return data.message
    }
  }

  // Request was made but no response was received (Network error / Backend down)
  if (error.request) {
    return "Unable to connect to the server. Please check your network connection."
  }

  return error.message || defaultMessage
}

export default api