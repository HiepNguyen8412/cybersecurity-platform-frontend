import { Link } from "react-router-dom"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"

function ForgotPassword() {
    return (
        <AuthLayout>
            <div>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Forgot password?
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Enter your email and we'll send you a password reset link.
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

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        Send reset link
                    </button>
                </form>

                {/* Back to login */}
                <p className="mt-6 text-center text-sm text-slate-400">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-500 hover:text-blue-400"
                    >
                        Back to sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}

export default ForgotPassword