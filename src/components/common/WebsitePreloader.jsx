import { useEffect, memo } from "react"

/**
 * WebsitePreloader
 *
 * Seamless React coordinator for the initial document preloader.
 * Dismisses immediately once React has mounted.
 */
export const WebsitePreloader = memo(function WebsitePreloader({ minDuration = 80 }) {
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
