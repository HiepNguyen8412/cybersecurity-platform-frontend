import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

/**
 * Reusable Breadcrumb component.
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function Breadcrumb({
  items = [],
  showHome = false,
  separator = <ChevronRight className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 cyberpunk:text-cyan-500 shrink-0" />,
  className = "",
}) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs ${className}`.trim()}>
      <ol className="flex items-center space-x-1.5 list-none m-0 p-0 flex-wrap">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="text-slate-400 dark:text-slate-400 cyberpunk:text-cyan-400 hover:text-slate-600 dark:hover:text-slate-200 cyberpunk:hover:text-cyan-200 transition-colors inline-flex items-center"
              title="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
            {items.length > 0 && <span className="ml-1.5">{separator}</span>}
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label || index} className="inline-flex items-center">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="font-medium text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300 hover:text-slate-800 dark:hover:text-white cyberpunk:hover:text-cyan-100 transition-colors inline-flex items-center gap-1.5"
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={`font-semibold inline-flex items-center gap-1.5 ${
                    isLast
                      ? "text-slate-900 dark:text-white cyberpunk:text-cyan-50"
                      : "text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300/80"
                  }`}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && <span className="ml-1.5">{separator}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
