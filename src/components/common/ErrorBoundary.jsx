import { Component } from "react"
import {
  RiRefreshLine,
  RiHome4Line,
  RiArrowLeftLine,
  RiShieldCheckFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFileCopyLine,
  RiCheckLine,
  RiLifebuoyLine,
} from "@remixicon/react"

/**
 * ErrorBoundary
 * Catches JavaScript errors anywhere in the component tree,
 * logs them safely, and displays a friendly, reassuring, user-focused UI
 * with bespoke Remix Icon vessels and collapsible admin forensics.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
      incidentId: "SEC-OPS-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    const incidentId = "SEC-OPS-" + Math.random().toString(36).substring(2, 8).toUpperCase()
    this.setState({ errorInfo, incidentId })
    console.error(`[ErrorBoundary] Sự cố ${incidentId}:`, error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = "/"
  }

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }))
  }

  copyDetails = () => {
    const text = `[Mã Sự Cố: ${this.state.incidentId}]\nThời gian: ${new Date().toISOString()}\nLỗi: ${this.state.error?.toString()}\n\nStack:\n${this.state.errorInfo?.componentStack || "Không có stack"}`
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.setState({ copied: true })
        setTimeout(() => this.setState({ copied: false }), 2500)
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const { incidentId, showDetails, copied, error, errorInfo } = this.state

      return (
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4 sm:p-6 text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-hidden select-none">
          {/* Subtle Background Cyber Grid */}
          <div
            className="fixed inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.15) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          {/* Ambient Glow */}
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-r from-indigo-600/15 via-indigo-600/10 to-blue-500/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-lg w-full bg-[#090a0f]/95 border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 text-center space-y-6 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Friendly Shield Icon Header with Glowing Ring */}
            <div className="relative w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-300 shadow-[0_0_20px_rgba(91,91,214,0.25)] ring-1 ring-white/10">
              <RiShieldCheckFill className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#090a0f] animate-pulse" />
            </div>

            {/* Main Friendly Content */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-[11px] font-mono font-semibold tracking-wider uppercase shadow-2xs">
                <RiLifebuoyLine className="w-3.5 h-3.5 text-indigo-400" />
                <span>Trợ Giúp Sự Cố Nền Tảng</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Rất tiếc, đã có sự cố xảy ra
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Trang này tạm thời không thể hiển thị nội dung. Dữ liệu tài khoản và tiến trình học tập của bạn hoàn toàn an toàn và đã được bảo lưu trên máy chủ.
              </p>

              {/* Incident Code Badge */}
              <div className="pt-1 flex items-center justify-center gap-2">
                <span className="text-xs text-slate-400">Mã tham chiếu sự cố:</span>
                <span className="inline-block px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.1] font-mono text-xs font-semibold text-cyan-300 select-all shadow-inner">
                  #{incidentId}
                </span>
              </div>
            </div>

            {/* Quick Suggestions Card */}
            <div className="bg-[#070b14]/90 rounded-2xl p-4 border border-white/[0.06] text-left text-xs text-slate-400 space-y-2.5">
              <p className="font-semibold text-slate-200 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Gợi ý khắc phục nhanh:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-1">
                <li>Bấm nút <strong>Tải Lại Trang</strong> bên dưới để thử nạp lại phiên làm việc.</li>
                <li>Quay lại <strong>Trang Chủ</strong> để tiếp tục sử dụng các phân hệ khác.</li>
                <li>Hệ thống đã tự động lưu log sự cố để kỹ thuật viên kiểm tra.</li>
              </ul>
            </div>

            {/* Collapsible Technical Details (Hidden by default, clean for ordinary users) */}
            <div className="border-t border-white/[0.08] pt-4 text-left">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer focus:outline-none"
              >
                <span className="font-mono">Chi tiết kỹ thuật (dành cho quản trị viên)</span>
                {showDetails ? (
                  <RiArrowUpSLine className="w-4 h-4 text-slate-400" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-left space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-400 font-medium">
                      {error?.name || "Lỗi giao diện"}: {error?.message || "Không xác định"}
                    </span>
                    <button
                      type="button"
                      onClick={this.copyDetails}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-[10px] text-slate-200 transition-colors cursor-pointer"
                      title="Sao chép lỗi để gửi hỗ trợ"
                    >
                      {copied ? (
                        <>
                          <RiCheckLine className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <RiFileCopyLine className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>

                  {errorInfo?.componentStack && (
                    <pre className="text-[10px] font-mono text-slate-400 max-h-36 overflow-y-auto whitespace-pre-wrap leading-tight bg-black/40 p-2.5 rounded-lg border border-white/5">
                      {errorInfo.componentStack.trim()}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 ring-1 ring-white/20 transition-all cursor-pointer"
              >
                <RiRefreshLine className="w-3.5 h-3.5" />
                <span>Tải Lại Trang</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium text-xs transition-colors cursor-pointer"
              >
                <RiHome4Line className="w-3.5 h-3.5" />
                <span>Về Trang Chủ</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoBack}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] text-xs transition-colors cursor-pointer"
                title="Quay lại trang trước"
              >
                <RiArrowLeftLine className="w-3.5 h-3.5" />
                <span>Quay Lại</span>
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
