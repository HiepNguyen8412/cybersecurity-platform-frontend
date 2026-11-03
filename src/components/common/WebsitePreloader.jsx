import { useEffect, memo } from "react"

/**
 * WebsitePreloader
 * 
 * Seamless React coordinator for the unified global preloader.
 * Dissolves immediately once React has finished rendering (Zero-Friction UX).
 */
export const WebsitePreloader = memo(function WebsitePreloader({ minDuration = 120 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.__dismissCyberPreloader) {
        window.__dismissCyberPreloader()
      }
    }, minDuration)

    return () => clearTimeout(timer)
  }, [minDuration])

  return null
})

export default WebsitePreloader
