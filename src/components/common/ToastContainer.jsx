import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react"
import useNotificationStore from "../../stores/useNotificationStore"

/**
 * ToastContainer
 * Renders global notifications floating at bottom-right corner with smooth cyber-themed animations.
 */
export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  if (!notifications.length) return null

  return (
    <div
      role="region"
      aria-label="Thông báo hệ thống"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {notifications.map((n) => {
        const isSuccess = n.type === "success"
        const isError = n.type === "error"
        const isWarning = n.type === "warning"

        const borderClass = isSuccess
          ? "border-emerald-500/40 bg-slate-900/95 text-emerald-300 shadow-emerald-950/40"
          : isError
          ? "border-rose-500/40 bg-slate-900/95 text-rose-300 shadow-rose-950/40"
          : isWarning
          ? "border-amber-500/40 bg-slate-900/95 text-amber-300 shadow-amber-950/40"
          : "border-cyan-500/40 bg-slate-900/95 text-cyan-300 shadow-cyan-950/40"

        const icon = isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        ) : isWarning ? (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        )

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0 pr-1">
              {n.title && <h4 className="text-sm font-semibold text-white tracking-wide">{n.title}</h4>}
              {n.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">{n.message}</p>}
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors shrink-0"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
