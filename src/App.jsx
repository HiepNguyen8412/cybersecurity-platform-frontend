import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import ScrollToTop from "./components/common/ScrollToTop"
import { AuthProvider } from "./context/AuthContext"
import { LayoutProvider } from "./context/LayoutContext"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <LayoutProvider>
          <AppRoutes />
        </LayoutProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App