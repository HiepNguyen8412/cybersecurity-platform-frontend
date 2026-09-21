import { Routes, Route, Navigate } from "react-router-dom"

import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout"

import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"
import ForgotPassword from "../pages/auth/ForgotPassword"

function Placeholder({ title }) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white">
                {title}
            </h1>

            <p className="mt-2 text-slate-400">
                This page is under development.
            </p>
        </div>
    )
}

function AppRoutes() {
    return (
        <Routes>
            {/* ==================== */}
            {/* Authentication */}
            {/* ==================== */}

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            {/* ==================== */}
            {/* Default */}
            {/* ==================== */}

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* ==================== */}
            {/* Dashboard */}
            {/* ==================== */}

            <Route
                path="/dashboard"
                element={
                    <DashboardLayout>
                        <Placeholder title="Dashboard" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Threats */}
            {/* ==================== */}

            <Route
                path="/threats"
                element={
                    <DashboardLayout>
                        <Placeholder title="Threats" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Vulnerabilities */}
            {/* ==================== */}

            <Route
                path="/vulnerabilities"
                element={
                    <DashboardLayout>
                        <Placeholder title="Vulnerabilities" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Incidents */}
            {/* ==================== */}

            <Route
                path="/incidents"
                element={
                    <DashboardLayout>
                        <Placeholder title="Incidents" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Security Labs */}
            {/* ==================== */}

            <Route
                path="/security-labs"
                element={
                    <DashboardLayout>
                        <Placeholder title="Security Labs" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Learning */}
            {/* ==================== */}

            <Route
                path="/learning"
                element={
                    <DashboardLayout>
                        <Placeholder title="Learning" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Profile */}
            {/* ==================== */}

            <Route
                path="/profile"
                element={
                    <DashboardLayout>
                        <Placeholder title="Profile" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* Settings */}
            {/* ==================== */}

            <Route
                path="/settings"
                element={
                    <DashboardLayout>
                        <Placeholder title="Settings" />
                    </DashboardLayout>
                }
            />

            {/* ==================== */}
            {/* 404 */}
            {/* ==================== */}

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    )
}

export default AppRoutes