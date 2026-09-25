import { createContext, useState } from "react"

const LayoutContext = createContext(null)

export function LayoutProvider({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem("cybershield_sidebar_collapsed")
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [pageTitle, setPageTitle] = useState("")
  const [breadcrumbs, setBreadcrumbs] = useState([])

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("cybershield_sidebar_collapsed", JSON.stringify(next))
      } catch {
        // Ignore storage errors
      }
      return next
    })
  }

  const openMobileMenu = () => setIsMobileMenuOpen(true)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebarCollapse,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
        pageTitle,
        setPageTitle,
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export default LayoutContext
