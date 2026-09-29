import { createContext, useState, useEffect, useCallback, useRef } from "react"
import authService from "../services/authService"
import { setUnauthorizedSessionHandler } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState(null)

  // Sequence counter to prevent race conditions from concurrent or out-of-order auth requests
  const authActionSeq = useRef(0)

  // Clear any global auth error
  const clearAuthError = useCallback(() => {
    setAuthError(null)
  }, [])

  // Listen for global 401 unauthorized session expiration events from Axios interceptor
  useEffect(() => {
    setUnauthorizedSessionHandler(() => {
      authActionSeq.current += 1
      setUser(null)
      setAuthError("Your session has expired. Please sign in again.")
      try {
        localStorage.removeItem("cyberpath_user_profile")
        sessionStorage.removeItem("cyberpath_user_profile")
        sessionStorage.removeItem("cyberpath_pending_verify_email")
      } catch {
        // Ignore
      }
    })

    return () => {
      setUnauthorizedSessionHandler(null)
    }
  }, [])

  // Restore session on mount without race conditions
  useEffect(() => {
    let isMounted = true
    const currentSeq = ++authActionSeq.current

    async function initializeAuth() {
      try {
        const result = await authService.getCurrentUser()
        // Discard result if unmounted or if another auth action supersedes this one
        if (isMounted && authActionSeq.current === currentSeq) {
          if (result.success && result.data?.user) {
            setUser(result.data.user)
          }
        }
      } catch {
        // No valid session, stay unauthenticated
      } finally {
        if (isMounted && authActionSeq.current === currentSeq) {
          setIsInitializing(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [])

  /**
   * Log in user with race-condition prevention and storage partitioning
   */
  const login = async (email, password, rememberMe = true) => {
    const currentSeq = ++authActionSeq.current
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await authService.login({ email, password, rememberMe })

      // Check sequence to prevent overwriting if a newer login/logout was started
      if (authActionSeq.current !== currentSeq) {
        return { success: false, error: "Action cancelled by a newer operation." }
      }

      if (result.success && result.data?.user) {
        setUser(result.data.user)
        try {
          if (rememberMe) {
            // Persistent storage across browser sessions
            localStorage.setItem("cyberpath_user_profile", JSON.stringify(result.data.user))
            sessionStorage.setItem("cyberpath_user_profile", JSON.stringify(result.data.user))
          } else {
            // Transient session storage only (cleared on browser/tab close)
            localStorage.removeItem("cyberpath_user_profile")
            sessionStorage.setItem("cyberpath_user_profile", JSON.stringify(result.data.user))
          }
        } catch {
          // Ignore storage quota errors
        }
        return { success: true, user: result.data.user }
      } else {
        const errorMsg = result.error || "Invalid email or password."
        setAuthError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch {
      if (authActionSeq.current === currentSeq) {
        const errorMsg = "Unable to sign in. Please verify your connection and try again."
        setAuthError(errorMsg)
        return { success: false, error: errorMsg }
      }
      return { success: false, error: "Operation superseded." }
    } finally {
      if (authActionSeq.current === currentSeq) {
        setIsLoading(false)
      }
    }
  }

  /**
   * Register new user account
   */
  const register = async ({ name, email, password }) => {
    const currentSeq = ++authActionSeq.current
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await authService.register({ name, email, password })

      if (authActionSeq.current !== currentSeq) {
        return { success: false, error: "Operation superseded." }
      }

      if (result.success) {
        // Store pending verification email in sessionStorage (transient, cleared on tab close)
        try {
          sessionStorage.setItem("cyberpath_pending_verify_email", email.trim().toLowerCase())
        } catch {
          // Ignore
        }
        return { success: true, data: result.data }
      } else {
        const errorMsg = result.error || "Unable to register. Please try again."
        setAuthError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch {
      if (authActionSeq.current === currentSeq) {
        const errorMsg = "Registration failed due to a network or server issue."
        setAuthError(errorMsg)
        return { success: false, error: errorMsg }
      }
      return { success: false, error: "Operation superseded." }
    } finally {
      if (authActionSeq.current === currentSeq) {
        setIsLoading(false)
      }
    }
  }

  /**
   * Request password reset link
   */
  const requestPasswordReset = async (email) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await authService.requestPasswordReset({ email })
      return result
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Reset password with token
   */
  const resetPassword = async (token, newPassword) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await authService.resetPassword({ token, newPassword })
      return result
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Verify email address
   */
  const verifyEmail = async (token, email) => {
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await authService.verifyEmail({ token, email })
      if (result.success && user) {
        setUser((prev) => (prev ? { ...prev, isEmailVerified: true } : prev))
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Resend verification email
   */
  const resendVerification = async (email) => {
    setIsLoading(true)
    try {
      return await authService.resendVerification({ email })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Log out and wipe all local session traces
   */
  const logout = async () => {
    // Invalidate sequence so in-flight requests cannot restore user session
    authActionSeq.current += 1
    setIsLoading(true)

    try {
      await authService.logout()
    } finally {
      setUser(null)
      setAuthError(null)
      setIsLoading(false)
      try {
        localStorage.removeItem("cyberpath_user_profile")
        sessionStorage.removeItem("cyberpath_user_profile")
        sessionStorage.removeItem("cyberpath_pending_verify_email")
      } catch {
        // Ignore
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isInitializing,
        isLoading,
        authError,
        clearAuthError,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
