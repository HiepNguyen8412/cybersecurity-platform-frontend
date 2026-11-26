import { Component } from "react"
import {
  RiRefreshLine,
  RiHome4Line,
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFileCopyLine,
  RiCheckLine,
  RiLifebuoyLine,
} from "@remixicon/react"

/**
 * ErrorBoundary
 * Catches JavaScript errors anywhere in the component tree,
 * logs them safely, and displays a calm, scholarly recovery interface
 * aligned with Editorial Light & Deep Obsidian Dark.
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
      incidentId: "CP-ERR-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    const incidentId = "CP-ERR-" + Math.random().toString(36).substring(2, 8).toUpperCase()
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
    const text = `[Mã Sự Cố: ${this.state.incidentId}]\nThời gian: ${new Date().toISOString()}\nLỗi: ${this.state.error?.toString()}\n\nStack:\n${this.state.errorInfo?.componentStack || "Không có dấu vết ngăn xếp"}`
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
        <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] flex items-center justify-center p-4 sm:p-6 text-[#0F172A] dark:text-[#F1F5F9] font-sans selection:bg-[#1D4ED8]/15 selection:text-[#1D4ED8] dark:selection:bg-[#3B82F6]/25 dark:selection:text-[#38BDF8] relative overflow-hidden">
          {/* Nền lưới kỹ thuật tối giản */}
          <div
            className="fixed inset-0 cyber-ambient-grid pointer-events-none opacity-65"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-lg w-full bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-lg text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Biểu tượng lá chắn bình tĩnh */}
            <div className="w-14 h-14 rounded-xl bg-[#EFF6FF] dark:bg-[#3B82F6]/12 border border-[#BFDBFE] dark:border-[#3B82F6]/30 flex items-center justify-center mx-auto text-[#1D4ED8] dark:text-[#38BDF8]">
              <RiShieldCheckLine className="w-7 h-7" />
            </div>

            {/* Nội dung thông báo thân thiện */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#93C5FD] text-[11px] font-mono-tech font-semibold tracking-wider uppercase">
                <RiLifebuoyLine className="w-3.5 h-3.5" />
                <span>Hỗ Trợ Sự Cố Nền Tảng</span>
              </div>

              <h1 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight">
                Rất tiếc, đã có sự cố xảy ra
              </h1>

              <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-md mx-auto">
                Trang này tạm thời không thể hiển thị nội dung. Dữ liệu tài khoản và tiến trình học tập của bạn hoàn toàn an toàn và đã được bảo lưu trên máy chủ.
              </p>

              {/* Mã tham chiếu sự cố */}
              <div className="pt-1 flex items-center justify-center gap-2">
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Mã tham chiếu sự cố:
                </span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.09] font-mono-tech text-xs font-semibold text-[#1D4ED8] dark:text-[#38BDF8] select-all">
                  #{incidentId}
                </span>
              </div>
            </div>

            {/* Gợi ý khắc phục nhanh */}
            <div className="bg-[#FAF9F6] dark:bg-[#0E131D] rounded-xl p-4 border border-[#E5E2DC] dark:border-white/[0.08] text-left text-xs text-[#475569] dark:text-[#94A3B8] space-y-2">
              <p className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D4ED8] dark:bg-[#38BDF8]" aria-hidden="true" />
                Gợi ý khắc phục nhanh:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-1">
                <li>
                  Bấm nút <strong>Tải Lại Trang</strong> bên dưới để thử nạp lại phiên làm việc.
                </li>
                <li>
                  Quay lại <strong>Trang Chủ</strong> để tiếp tục sử dụng các phân hệ khác.
                </li>
                <li>Hệ thống đã tự động ghi nhận sự cố để kỹ thuật viên kiểm tra.</li>
              </ul>
            </div>

            {/* Chi tiết kỹ thuật thu gọn */}
            <div className="border-t border-[#EFEDE7] dark:border-white/[0.08] pt-4 text-left">
              <button
                type="button"
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] transition-colors py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded"
              >
                <span className="font-mono-tech">Chi tiết kỹ thuật (dành cho quản trị viên)</span>
                {showDetails ? (
                  <RiArrowUpSLine className="w-4 h-4" />
                ) : (
                  <RiArrowDownSLine className="w-4 h-4" />
                )}
              </button>

              {showDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#F3F1EC] dark:bg-[#080B10] border border-[#E5E2DC] dark:border-white/[0.08] text-left space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono-tech text-rose-700 dark:text-amber-400 font-medium break-all">
                      {error?.name || "Lỗi giao diện"}: {error?.message || "Không xác định"}
                    </span>
                    <button
                      type="button"
                      onClick={this.copyDetails}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.1] hover:bg-[#FAF9F6] dark:hover:bg-[#1B2335] text-[10px] text-[#0F172A] dark:text-[#F1F5F9] transition-colors cursor-pointer shrink-0"
                      title="Sao chép lỗi để gửi hỗ trợ"
                    >
                      {copied ? (
                        <>
                          <RiCheckLine className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400">Đã sao chép</span>
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
                    <pre className="text-[10px] font-mono-tech text-[#475569] dark:text-[#94A3B8] max-h-36 overflow-y-auto whitespace-pre-wrap leading-tight bg-white dark:bg-[#0B0E14] p-2.5 rounded-lg border border-[#E5E2DC] dark:border-white/[0.06]">
                      {errorInfo.componentStack.trim()}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {/* Nút hành động chính */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <RiRefreshLine className="w-3.5 h-3.5" />
                <span>Tải Lại Trang</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F1EC] hover:bg-[#ECE9E2] dark:bg-[#161C2A] dark:hover:bg-[#1B2335] border border-[#E5E2DC] dark:border-white/[0.09] text-[#0F172A] dark:text-[#F1F5F9] font-medium text-xs transition-colors cursor-pointer"
              >
                <RiHome4Line className="w-3.5 h-3.5" />
                <span>Về Trang Chủ</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoBack}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] text-xs font-medium transition-colors cursor-pointer"
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
