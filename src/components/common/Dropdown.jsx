import { useState, useRef, useEffect } from "react"

/**
 * Reusable Dropdown menu component with outside-click and ESC key closing.
 */
export function Dropdown({
  trigger,
  children,
  align = "right",
  width = "w-56",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close()
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape" && isOpen) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const alignStyles = {
    left: "left-0",
    right: "right-0",
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div
        onClick={toggle}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            toggle()
          }
        }}
      >
        {typeof trigger === "function" ? trigger({ isOpen, toggle, close }) : trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`
            absolute top-full mt-2 z-50 rounded-xl bg-white dark:bg-[#121722] p-1.5 shadow-lg dark:shadow-2xl dark:shadow-black/60 border border-[#E5E2DC] dark:border-white/[0.09]
            focus:outline-none animate-in fade-in zoom-in-95
            ${alignStyles[align] || alignStyles.right}
            ${width}
          `.trim()}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon = null,
  danger = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return
        onClick?.(e)
      }}
      className={`
        w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors cursor-pointer select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          danger
            ? "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/12 active:bg-rose-100 dark:active:bg-rose-500/20"
            : "text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] active:bg-[#ECE9E2] dark:active:bg-[#1B2335]"
        }
        ${className}
      `.trim()}
      {...props}
    >
      {icon && <span className="shrink-0 text-[#64748B] dark:text-[#94A3B8]">{icon}</span>}
      <span className="grow truncate">{children}</span>
    </button>
  )
}

export function DropdownHeader({ children, className = "" }) {
  return (
    <div
      className={`px-3 py-2 text-[10px] font-mono-tech font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] select-none ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownDivider({ className = "" }) {
  return (
    <div
      className={`my-1 border-t border-[#EFEDE7] dark:border-white/[0.06] ${className}`}
    />
  )
}

export default Dropdown
