function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-white">
                            Cybersecurity
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Interactive Platform
                        </p>
                    </div>

                    {/* Auth content */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
                        {children}
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-slate-600">
                        Cybersecurity Interactive Platform
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout