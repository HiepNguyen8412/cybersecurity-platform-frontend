import { Link } from "react-router-dom"

export function PublicFooter() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white py-8 transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-slate-500">
        <span>&copy; {new Date().getFullYear()} CyberPath, Inc.</span>
        <span className="hidden sm:inline text-slate-300">&middot;</span>
        <div className="flex items-center gap-4">
          <Link to="#" className="hover:text-slate-800 transition-colors">
            Privacy
          </Link>
          <span className="text-slate-300">&middot;</span>
          <Link to="#" className="hover:text-slate-800 transition-colors">
            Terms
          </Link>
          <span className="text-slate-300">&middot;</span>
          <Link to="#" className="hover:text-slate-800 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
