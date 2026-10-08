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

  // Close on outside click
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
            absolute top-full mt-2 z-50 rounded-xl bg-white p-1.5 shadow-lg border border-slate-200/80
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
            ? "text-rose-600 hover:bg-rose-50 active:bg-rose-100"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
        }
        ${className}
      `.trim()}
      {...props}
    >
      {icon && <span className="shrink-0 text-slate-400 group-hover:text-slate-600">{icon}</span>}
      <span className="grow truncate">{children}</span>
    </button>
  )
}

export function DropdownHeader({ children, className = "" }) {
  return (
    <div className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 select-none ${className}`}>
      {children}
    </div>
  )
}

export function DropdownDivider({ className = "" }) {
  return <div className={`my-1 border-t border-slate-100 ${className}`} />
}

export default Dropdown
