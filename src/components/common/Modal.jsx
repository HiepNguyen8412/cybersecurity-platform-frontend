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
      {/* Nền mờ hộp thoại */}
      <div
        className="fixed inset-0 bg-[#0F172A]/45 dark:bg-black/75 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => {
          if (closeOnBackdropClick) onClose?.()
        }}
        aria-hidden="true"
      />

      {/* Khung hộp thoại */}
      <div
        className={`
          relative w-full rounded-2xl bg-white dark:bg-[#121722] p-6 shadow-xl dark:shadow-black/70 border border-[#E5E2DC] dark:border-white/[0.09] z-10
          transition-all animate-in zoom-in-95 fade-in duration-200
          ${sizeStyles[size] || sizeStyles.md}
          ${className}
        `.trim()}
      >
        {/* Đầu hộp thoại */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col space-y-1">
            {title && (
              <h2
                id="modal-title"
                className="font-serif-editorial text-xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] transition-colors cursor-pointer"
            aria-label="Đóng hộp thoại"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung */}
        <div className={`text-sm text-[#475569] dark:text-[#94A3B8] ${footer ? "mb-6" : ""}`}>
          {children}
        </div>

        {/* Chân hộp thoại */}
        {footer && (
          <div className="pt-4 border-t border-[#EFEDE7] dark:border-white/[0.06] flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
