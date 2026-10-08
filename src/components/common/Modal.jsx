import { useEffect } from "react"
import { X } from "lucide-react"

/**
 * Reusable Modal dialog component with backdrop, scroll lock, and ESC close support.
 */
export function Modal({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  footer = null,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEsc = true,
  className = "",
}) {
  // ESC key handler and body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose?.()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, closeOnEsc, onClose])

  if (!isOpen) return null

  const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-4xl",
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => {
          if (closeOnBackdropClick) onClose?.()
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        className={`
          relative w-full rounded-2xl bg-white p-6 shadow-2xl border border-slate-200/80 z-10
          transition-all animate-in zoom-in-95 fade-in duration-200
          ${sizeStyles[size] || sizeStyles.md}
          ${className}
        `.trim()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col space-y-1">
            {title && (
              <h2 id="modal-title" className="text-lg font-bold text-slate-900 leading-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-slate-500 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="text-sm text-slate-600 mb-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
