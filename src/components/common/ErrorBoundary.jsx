import { Component } from "react"
import { RefreshCw, Home, ShieldAlert } from "lucide-react"

/**
 * ErrorBoundary
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a graceful cyber-themed fallback UI.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = "/"
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-mono">
          <div className="max-w-lg w-full p-8 rounded-3xl border border-rose-500/40 bg-slate-900/90 shadow-2xl shadow-rose-950/40 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
                NGOẠI LỆ HỆ THỐNG NGHIÊM TRỌNG
              </span>
              <h1 className="text-xl font-bold text-white tracking-wide mt-2">
                Sự Cố Gián Đoạn Ứng Dụng
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Hệ thống bảo vệ đã cách ly tiến trình lỗi để ngăn chặn rò rỉ dữ liệu phiên làm việc.
              </p>
            </div>

            {/* Error detail */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 text-left text-[11px] text-rose-300 font-mono overflow-x-auto max-h-32">
              <code>{this.state.error?.toString() || "Unknown Component Crash"}</code>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Tải Lại Trang</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Về Trang Chủ</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
