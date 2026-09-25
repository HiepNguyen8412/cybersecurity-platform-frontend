import { createContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("cybershield_auth_user")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  // Sync user state changes to storage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("cybershield_auth_user", JSON.stringify(user))
      } else {
        localStorage.removeItem("cybershield_auth_user")
      }
    } catch {
      // Ignore storage errors
    }
  }, [user])

  /**
   * Mock login with realistic delay and validation states.
   */
  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)

    // Trigger mock error for testing if user enters invalid demo credentials
    if (email === "error@test.com" || password === "wrong") {
      return {
        success: false,
        error: "Invalid email or password. For demo, try alex@cybershield.edu with any password.",
      }
    }

    const mockUser = {
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Alex Morgan",
      email: email,
      role: "Security Analyst",
      avatarStatus: "online",
      rememberMe,
    }

    setUser(mockUser)
    return { success: true, user: mockUser }
  }

  /**
   * Mock registration.
   */
  const register = async ({ name, email, password }) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 650))
    setIsLoading(false)

    if (email === "taken@cybershield.edu") {
      return {
        success: false,
        error: "An account with this email address already exists. Please sign in instead.",
      }
    }

    const newUser = {
      name,
      email,
      role: "Learner",
      avatarStatus: "online",
      isEmailVerified: false,
      hasPassword: Boolean(password),
    }

    // Save pending email in session storage for verification flow
    try {
      sessionStorage.setItem("cybershield_pending_verify_email", email)
    } catch {
      // Ignore storage error
    }

    return { success: true, user: newUser }
  }

  /**
   * Mock email verification.
   */
  const verifyEmail = async (email) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)

    if (user && user.email === email) {
      setUser((prev) => ({ ...prev, isEmailVerified: true }))
    }

    return { success: true }
  }

  /**
   * Mock password reset request.
   */
  const requestPasswordReset = async (email) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsLoading(false)

    return { success: true, email }
  }

  /**
   * Mock password update.
   */
  const resetPassword = async (newPassword) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsLoading(false)

    if (newPassword && user) {
      setUser((prev) => ({ ...prev, passwordUpdated: true }))
    }

    return { success: true }
  }

  /**
   * Logout.
   */
  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem("cybershield_auth_user")
    } catch {
      // Ignore
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
