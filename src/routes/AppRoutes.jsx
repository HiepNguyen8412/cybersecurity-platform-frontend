import { lazy, Suspense } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout/PublicLayout"
import AppLayout from "../layouts/AppLayout/AppLayout"
import ProtectedRoute from "./ProtectedRoute"
import PublicOnlyRoute from "./PublicOnlyRoute"
import PageLoadingFallback from "../components/common/PageLoadingFallback"

// Lazy-Loaded Route Components for high-performance code splitting
const LandingPage = lazy(() => import("../pages/public/LandingPage"))
const Learning = lazy(() => import("../pages/learning/Learning"))
const LearningPaths = lazy(() => import("../pages/learning/LearningPaths"))
const Labs = lazy(() => import("../pages/labs/Labs"))
const Pricing = lazy(() => import("../pages/public/Pricing"))

// Auth Pages (PublicOnly)
const Login = lazy(() => import("../pages/auth/Login"))
const Register = lazy(() => import("../pages/auth/Register"))
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"))
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"))
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"))

// Platform Authenticated Pages (Protected)
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"))
const Progress = lazy(() => import("../pages/progress/Progress"))
const Achievements = lazy(() => import("../pages/progress/Achievements"))
const Profile = lazy(() => import("../pages/profile/Profile"))
const Settings = lazy(() => import("../pages/settings/Settings"))

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* ====================================================================
            1. Public Exploration & Marketing Routes (PublicLayout with Header)
            Accessible by everyone, preserves sticky header across all tabs
           ==================================================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning-paths" element={<LearningPaths />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* ====================================================================
            2. Authentication Routes (Isolated, PublicOnly - Redirects if logged in)
           ==================================================================== */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* ====================================================================
            3. Authenticated Platform Layout Route (Protected Workspace)
           ==================================================================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes