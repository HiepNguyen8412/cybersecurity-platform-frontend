import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthLayout from "../../layouts/AuthLayout/AuthLayout"
import { Button, Input } from "../../components/common"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate("/dashboard")
    }, 400)
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create account
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create your security platform account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <Input
            id="name"
            label="Full name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          {/* Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          {/* Password */}
          <Input
            id="password"
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {/* Confirm password */}
          <Input
            id="confirmPassword"
            label="Confirm password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />

          {/* Submit */}
          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create account
            </Button>
          </div>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register