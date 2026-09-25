import { Routes, Route, Navigate } from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout/PublicLayout"
import AppLayout from "../layouts/AppLayout/AppLayout"

// Public Pages
import LandingPage from "../pages/public/LandingPage"

// Auth Pages (Preserved)
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import VerifyEmail from "../pages/auth/VerifyEmail"

// Platform Pages (Authenticated workspace)
import Dashboard from "../pages/dashboard/Dashboard"
import Learning from "../pages/learning/Learning"
import LearningPaths from "../pages/learning/LearningPaths"
import Labs from "../pages/labs/Labs"
import Progress from "../pages/progress/Progress"
import Achievements from "../pages/progress/Achievements"
import Profile from "../pages/profile/Profile"
import Settings from "../pages/settings/Settings"

function AppRoutes() {
  return (
    <Routes>
      {/* ====================================================================
          1. Public Marketing Routes (PublicLayout)
         ==================================================================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* ====================================================================
          2. Authentication Routes (Isolated, not wrapped in AppLayout)
         ==================================================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ====================================================================
          3. Authenticated Platform Layout Route (Persistent AppLayout with <Outlet />)
         ==================================================================== */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learning-paths" element={<LearningPaths />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* ====================================================================
          4. Legacy Aliases / Backwards Compatibility
         ==================================================================== */}
      <Route path="/security-labs" element={<Navigate to="/labs" replace />} />
      <Route path="/threats" element={<Navigate to="/dashboard" replace />} />
      <Route path="/vulnerabilities" element={<Navigate to="/dashboard" replace />} />
      <Route path="/incidents" element={<Navigate to="/dashboard" replace />} />

      {/* ====================================================================
          5. Fallback 404
         ==================================================================== */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes