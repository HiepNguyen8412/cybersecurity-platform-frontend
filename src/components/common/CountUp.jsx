import { useState, useEffect, useRef } from "react"

/**
 * Easing function: easeOutCubic
 * Delivers a smooth, balanced deceleration so the numbers roll clearly and gracefully over 3.5 seconds.
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Formats a number with commas and specified decimal places
 */
function formatNumber(num, decimals = 0, separator = ",") {
  const fixed = num.toFixed(decimals)
  if (!separator) return fixed

  const parts = fixed.split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return parts.join(".")
}

/**
 * CountUp Component
 * 
 * Smoothly animates numbers from start to target value using requestAnimationFrame.
 * Integrates IntersectionObserver so the animation kicks off precisely when scrolled into view.
 * 
 * Props:
 * - end: target number (number or parseable string like "2,400" or 2400)
 * - start: starting number (default 0)
 * - duration: duration in milliseconds (default 3500ms / 3.5s)
 * - decimals: number of decimal digits (default 0)
 * - separator: thousands separator (default ",")
 * - prefix: string placed before the number (e.g. "$", "+")
 * - suffix: string placed after the number (e.g. "+", "%", " XP")
 * - className: CSS classes
 */
export function CountUp({
  end = 0,
  start = 0,
  duration = 3500,
  decimals = 0,
  separator = ",",
  prefix = "",
  suffix = "",
  className = "",
  ...props
}) {
  // Normalize target number
  const parsedEnd = typeof end === "number" ? end : parseFloat(String(end).replace(/,/g, "")) || 0
  const parsedStart = typeof start === "number" ? start : parseFloat(String(start).replace(/,/g, "")) || 0

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const [count, setCount] = useState(() => (prefersReducedMotion ? parsedEnd : parsedStart))
  const [hasAnimated, setHasAnimated] = useState(Boolean(prefersReducedMotion))
  const elementRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return

    const currentElem = elementRef.current
    if (!currentElem) return

    // Intersection Observer to trigger on scroll-in
    let isObserved = true
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimation()
            if (currentElem) observer.unobserve(currentElem)
          }
        })
      },
      { threshold: 0.15 }
    )

    observer.observe(currentElem)

    const startAnimation = () => {
      let startTime = null
      let animationFrameId = null

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        const easedProgress = easeOutCubic(progress)
        const currentCount = parsedStart + (parsedEnd - parsedStart) * easedProgress

        setCount(currentCount)

        if (progress < 1 && isObserved) {
          animationFrameId = requestAnimationFrame(animate)
        } else {
          setCount(parsedEnd)
          setHasAnimated(true)
        }
      }

      animationFrameId = requestAnimationFrame(animate)

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId)
      }
    }

    return () => {
      isObserved = false
      if (currentElem) observer.unobserve(currentElem)
    }
  }, [parsedEnd, parsedStart, duration, hasAnimated, prefersReducedMotion])

  const formattedValue = formatNumber(count, decimals, separator)

  return (
    <span ref={elementRef} className={`inline-block tabular-nums ${className}`.trim()} {...props}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}

export default CountUp
