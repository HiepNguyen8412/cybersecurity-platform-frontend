import { Routes, Route, Navigate } from "react-router-dom"
import AppLayout from "../layouts/AppLayout/AppLayout"

// Auth Pages
import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ForgotPassword from "../pages/auth/ForgotPassword"
import ResetPassword from "../pages/auth/ResetPassword"
import VerifyEmail from "../pages/auth/VerifyEmail"

// Learning-First Page Shell
import PageShell from "../components/layout/PageShell"
import {
  LayoutDashboard,
  BookOpen,
  Compass,
  FlaskConical,
  TrendingUp,
  Award,
  User,
  Settings,
} from "lucide-react"

function AppRoutes() {
  return (
    <Routes>
      {/* ====================================================================
          1. Authentication Routes
         ==================================================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ====================================================================
          2. Root Default Redirect
         ==================================================================== */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* ====================================================================
          3. Learning Platform Shell Routes (Wrapped in AppLayout)
         ==================================================================== */}
      {/* Dashboard (Home Overview) */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <PageShell
              title="Welcome back, Alex"
              area="Learn"
              subtitle="Daily Learning Overview"
              description="Track your daily learning streak, continue your current module, or practice in hands-on defense labs."
              activeModule="Defensive Security Essentials"
              currentTopic="SQL Injection & Sanitization"
              progressPercent={65}
              nextActionLabel="Continue Lesson"
              nextActionPath="/learning"
              icon={LayoutDashboard}
            />
          </AppLayout>
        }
      />

      {/* Learn Group */}
      <Route
        path="/learning"
        element={
          <AppLayout>
            <PageShell
              title="Learning Modules"
              area="Learn"
              subtitle="Interactive Courses"
              description="Step-by-step interactive courses covering defensive security, penetration testing, and incident response."
              activeModule="Web Application Security"
              currentTopic="Cross-Site Scripting (XSS) Mitigation"
              progressPercent={40}
              nextActionLabel="Start Next Lesson"
              nextActionPath="/learning"
              icon={BookOpen}
            />
          </AppLayout>
        }
      />

      <Route
        path="/learning-paths"
        element={
          <AppLayout>
            <PageShell
              title="Learning Paths"
              area="Learn"
              subtitle="Career Trajectories"
              description="Curated multi-course career tracks designed to take you from fundamentals to certified security practitioner."
              activeModule="SOC Analyst Career Track"
              currentTopic="Security Incident & Event Management"
              progressPercent={28}
              nextActionLabel="Resume Career Path"
              nextActionPath="/learning-paths"
              icon={Compass}
            />
          </AppLayout>
        }
      />

      <Route
        path="/labs"
        element={
          <AppLayout>
            <PageShell
              title="Hands-on Labs"
              area="Learn"
              subtitle="Isolated Browser Sandboxes"
              description="Real-world simulated vulnerability environments. Practice defensive hardening and attack forensics with zero setup."
              activeModule="Server-Side Defense Sandbox"
              currentTopic="Firewall Rules & Packet Filtering"
              progressPercent={80}
              nextActionLabel="Launch Lab Sandbox"
              nextActionPath="/labs"
              icon={FlaskConical}
            />
          </AppLayout>
        }
      />

      {/* Progress Group */}
      <Route
        path="/progress"
        element={
          <AppLayout>
            <PageShell
              title="My Progress"
              area="Progress"
              subtitle="Skill Mastery & Activity"
              description="Review your mastery across security domains, completed modules, and weekly study streaks."
              activeModule="Junior Analyst Progress Matrix"
              currentTopic="Network Protocols & Vulnerabilities"
              progressPercent={72}
              nextActionLabel="View Full Assessment"
              nextActionPath="/progress"
              icon={TrendingUp}
            />
          </AppLayout>
        }
      />

      <Route
        path="/achievements"
        element={
          <AppLayout>
            <PageShell
              title="Achievements & Credentials"
              area="Progress"
              subtitle="Earned Badges"
              description="Verified certificates, challenge trophies, and skill badges earned throughout your learning journey."
              activeModule="Credential Milestone 2"
              currentTopic="Certified Web Defender Apprentice"
              progressPercent={90}
              nextActionLabel="Claim Next Badge"
              nextActionPath="/achievements"
              icon={Award}
            />
          </AppLayout>
        }
      />

      {/* Account Group */}
      <Route
        path="/profile"
        element={
          <AppLayout>
            <PageShell
              title="Learner Profile"
              area="Account"
              subtitle="Public Portfolio & Credentials"
              description="Manage your learning identity, verified skill certificates, and learning preferences."
              activeModule="Public Analyst Profile"
              currentTopic="Profile Verification"
              progressPercent={100}
              nextActionLabel="Edit Preferences"
              nextActionPath="/settings"
              icon={User}
            />
          </AppLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <AppLayout>
            <PageShell
              title="Platform Settings"
              area="Account"
              subtitle="Preferences & Security"
              description="Configure notifications, display preferences, and account security options."
              activeModule="Account Security"
              currentTopic="Multi-Factor Authentication & Sessions"
              progressPercent={100}
              nextActionLabel="Save Changes"
              nextActionPath="/settings"
              icon={Settings}
            />
          </AppLayout>
        }
      />

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