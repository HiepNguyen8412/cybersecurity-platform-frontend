import { Link } from "react-router-dom"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"

function Login() {
    return (
        <AuthLayout>
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Welcome back
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Sign in to your security platform
                    </p>
                </div>

                <form className="space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-300"
                            >
                                Password
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-xs text-blue-500 hover:text-blue-400"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Sign in
                    </button>
                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-blue-500 hover:text-blue-400"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}

export default Login