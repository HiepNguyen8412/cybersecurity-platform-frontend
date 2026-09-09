import {
    LayoutDashboard,
    ShieldAlert,
    Bug,
    Siren,
    FlaskConical,
    GraduationCap,
    User,
    Settings,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Threats", icon: ShieldAlert, path: "/threats" },
    { label: "Vulnerabilities", icon: Bug, path: "/vulnerabilities" },
    { label: "Incidents", icon: Siren, path: "/incidents" },
    { label: "Security Labs", icon: FlaskConical, path: "/security-labs" },
    { label: "Learning", icon: GraduationCap, path: "/learning" },
]

function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-950 text-slate-200">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <ShieldAlert className="mr-3 h-7 w-7 text-blue-500" />

                <div>
                    <h1 className="text-sm font-bold text-white">
                        Cybersecurity
                    </h1>

                    <p className="text-xs text-slate-500">
                        Interactive Platform
                    </p>
                </div>
            </div>

            {/* Menu */}
            <nav className="p-4">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Platform
                </p>

                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </NavLink>
                        )
                    })}
                </div>
            </nav>

            {/* Bottom menu */}
            <div className="absolute bottom-0 left-0 w-full border-t border-slate-800 p-4">
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `mb-1 flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    <User className="mr-3 h-5 w-5" />
                    Profile
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`
                    }
                >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                </NavLink>
            </div>
        </aside>
    )
}

export default Sidebar