import { Link } from "react-router-dom"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"

function Register() {
    return (
        <AuthLayout>
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Create account
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Create your security platform account
                    </p>
                </div>

                <form className="space-y-5">
                    {/* Full name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Full name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                        />
                    </div>

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
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                        />
                    </div>

                    {/* Confirm password */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-slate-300"
                        >
                            Confirm password
                        </label>

                        <input
                            id="confirmPassword"
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
                        Create account
                    </button>
                </form>

                {/* Login */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-500 hover:text-blue-400"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}

export default Register