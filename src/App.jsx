import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import ScrollToTop from "./components/common/ScrollToTop"
import ToastContainer from "./components/common/ToastContainer"
import { AuthProvider } from "./context/AuthContext"
import { LayoutProvider } from "./context/LayoutContext"
import useThemeStore from "./stores/useThemeStore"

function App() {
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <LayoutProvider>
          <AppRoutes />
          <ToastContainer />
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App