import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout"

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
            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="/dashboard"
                element={
                    <DashboardLayout>
                        <Placeholder title="Dashboard" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/threats"
                element={
                    <DashboardLayout>
                        <Placeholder title="Threats" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/vulnerabilities"
                element={
                    <DashboardLayout>
                        <Placeholder title="Vulnerabilities" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/incidents"
                element={
                    <DashboardLayout>
                        <Placeholder title="Incidents" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/security-labs"
                element={
                    <DashboardLayout>
                        <Placeholder title="Security Labs" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/learning"
                element={
                    <DashboardLayout>
                        <Placeholder title="Learning" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/profile"
                element={
                    <DashboardLayout>
                        <Placeholder title="Profile" />
                    </DashboardLayout>
                }
            />

            <Route
                path="/settings"
                element={
                    <DashboardLayout>
                        <Placeholder title="Settings" />
                    </DashboardLayout>
                }
            />
        </Routes>
    )
}

export default AppRoutes
