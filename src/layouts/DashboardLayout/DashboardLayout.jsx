import Sidebar from "../../components/layout/Sidebar"
import Navbar from "../../components/layout/Navbar"

function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-900">
            <Sidebar />

            <Navbar />

            <main className="ml-64 pt-16">
                <div className="min-h-[calc(100vh-4rem)] p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout