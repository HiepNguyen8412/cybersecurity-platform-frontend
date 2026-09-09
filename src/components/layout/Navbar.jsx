import { Bell, Search, UserCircle } from "lucide-react"

function Navbar() {
    return (
        <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-80 rounded-lg border border-slate-800 bg-slate-900 py-2 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Notification */}
                    <button
                        type="button"
                        className="relative rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        <Bell className="h-5 w-5" />

                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    {/* User */}
                    <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                        <UserCircle className="h-8 w-8 text-slate-400" />

                        <div>
                            <p className="text-sm font-medium text-white">
                                User
                            </p>

                            <p className="text-xs text-slate-500">
                                Security Analyst
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar