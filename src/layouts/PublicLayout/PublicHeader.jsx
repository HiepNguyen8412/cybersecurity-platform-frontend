import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { ShieldCheck, Menu, X } from "lucide-react"

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: "Courses", to: "/learning" },
    { label: "Labs", to: "/labs" },
    { label: "Paths", to: "/learning-paths" },
    { label: "Pricing", to: "#pricing" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg"
          title="CyberPath — Home"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            CyberPath
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav
          aria-label="Public Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors hover:text-slate-900 ${
                  isActive && link.to !== "#pricing"
                    ? "text-blue-600 font-semibold"
                    : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center text-sm font-semibold rounded-xl px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default PublicHeader
