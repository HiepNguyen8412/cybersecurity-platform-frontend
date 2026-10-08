import { useState, useRef, useId } from "react"

/**
 * Lightweight, accessible Tooltip component.
 */
export function Tooltip({
  content,
  children,
  position = "top",
  delay = 150,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)
  const tooltipId = useId()

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <div aria-describedby={isVisible ? tooltipId : undefined}>
        {children}
      </div>

      {isVisible && content && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`
            absolute z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 rounded-md shadow-md
            whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95
            ${positionStyles[position] || positionStyles.top}
            ${className}
          `.trim()}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export default Tooltip
