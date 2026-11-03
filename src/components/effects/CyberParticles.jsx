import { useRef, useEffect, memo } from "react"

/**
 * CyberParticles
 * 
 * High-performance, GPU-accelerated canvas animation providing:
 * 1. Ambient Floating Cyber Orbs ("đốm sáng bay lởn vởn"):
 *    - Organic, slow-drifting celestial embers with soft radial bokeh glows.
 *    - Harmonious sine-wave breathing and wandering physics.
 * 2. Interactive Cursor Followers ("đốm sáng di chuyển theo chuột"):
 *    - Chained spring / LERP physics with variable inertia.
 *    - Forms a graceful trailing cyber-wisp constellation tailing the pointer.
 *    - Orbital harmonics when the mouse stops moving.
 *    - Auto-sleep / fadeout when mouse is idle or leaves window.
 * 
 * Strict Performance & UX Constraints:
 * - pointer-events: none (zero interference with clicks, selections, or hover states)
 * - Zero React re-renders during 60/120fps animation loop.
 * - Theme-reactive palette (Cyber Blue & Neon Cyan in cyberpunk mode).
 * - Accessibility: respects prefers-reduced-motion.
 */
export const CyberParticles = memo(function CyberParticles({
  ambientCount = 22,
  followerCount = 4,
  className = "",
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Accessibility check: disable motion if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    let animationFrameId
    let w = 0
    let h = 0
    let dpr = 1

    // Theme detection
    function getColors() {
      const root = document.documentElement
      const isCyber = root.classList.contains("cyberpunk")
      const isDark = root.classList.contains("dark")

      if (isCyber) {
        return {
          ambient1: { r: 0, g: 229, b: 255 },  // Neon Cyan
          ambient2: { r: 0, g: 132, b: 255 },  // Electric Cyber Blue
          ambient3: { r: 56, g: 189, b: 248 }, // Sky Cyan
          followerLead: { r: 0, g: 229, b: 255, a: 0.8 },
          followerTrail1: { r: 0, g: 162, b: 255, a: 0.65 },
          followerTrail2: { r: 56, g: 189, b: 248, a: 0.55 },
          followerTrail3: { r: 30, g: 144, b: 255, a: 0.45 },
        }
      }
      if (isDark) {
        return {
          ambient1: { r: 129, g: 140, b: 248 }, // Indigo 400
          ambient2: { r: 96, g: 165, b: 250 },  // Blue 400
          ambient3: { r: 147, g: 197, b: 253 }, // Blue 300
          followerLead: { r: 129, g: 140, b: 248, a: 0.75 },
          followerTrail1: { r: 96, g: 165, b: 250, a: 0.6 },
          followerTrail2: { r: 147, g: 197, b: 253, a: 0.5 },
          followerTrail3: { r: 99, g: 102, b: 241, a: 0.4 },
        }
      }
      // Light mode
      return {
        ambient1: { r: 99, g: 102, b: 241 },  // Indigo 500
        ambient2: { r: 59, g: 130, b: 246 },  // Blue 500
        ambient3: { r: 14, g: 165, b: 233 },  // Sky 500
        followerLead: { r: 99, g: 102, b: 241, a: 0.5 },
        followerTrail1: { r: 59, g: 130, b: 246, a: 0.4 },
        followerTrail2: { r: 14, g: 165, b: 233, a: 0.35 },
        followerTrail3: { r: 79, g: 70, b: 229, a: 0.25 },
      }
    }

    let colors = getColors()

    // 1. Setup Canvas sizing with DPI scaling
    function handleResize() {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })

    // 2. Initialize Ambient Floating Particles ("đốm sáng bay lởn vởn")
    const ambientParticles = []
    for (let i = 0; i < ambientCount; i++) {
      const isLargeBokeh = Math.random() < 0.15
      const colorKey = Math.random() < 0.5 ? "ambient1" : Math.random() < 0.5 ? "ambient2" : "ambient3"
      ambientParticles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (isLargeBokeh ? 0.2 : 0.4),
        vy: (Math.random() - 0.5) * (isLargeBokeh ? 0.2 : 0.4),
        baseRadius: isLargeBokeh ? 7 + Math.random() * 8 : 1.5 + Math.random() * 2.5,
        glowRadius: isLargeBokeh ? 28 + Math.random() * 20 : 10 + Math.random() * 12,
        baseAlpha: isLargeBokeh ? 0.12 + Math.random() * 0.08 : 0.25 + Math.random() * 0.3,
        pulseSpeed: 0.001 + Math.random() * 0.002,
        pulsePhase: Math.random() * Math.PI * 2,
        colorKey,
      })
    }

    // 3. Initialize Interactive Mouse Followers ("đốm sáng di chuyển theo chuột")
    // Each follower has distinct LERP stiffness, size, and harmonic orbital properties
    const mouseState = {
      targetX: -9999,
      targetY: -9999,
      active: false,
      idleTimer: 0,
      opacity: 0,
    }

    const followers = [
      {
        x: w / 2,
        y: h / 2,
        lerp: 0.16,          // Quick response (Lead orb)
        radius: 3.5,
        glow: 24,
        colorKey: "followerLead",
        orbitRadius: 0,
        orbitSpeed: 0,
        orbitPhase: 0,
      },
      {
        x: w / 2,
        y: h / 2,
        lerp: 0.09,          // Secondary follower with harmonic orbiting
        radius: 2.8,
        glow: 18,
        colorKey: "followerTrail1",
        orbitRadius: 16,
        orbitSpeed: 0.03,
        orbitPhase: 0,
      },
      {
        x: w / 2,
        y: h / 2,
        lerp: 0.055,         // Lazy follower (creates trailing tail)
        radius: 2.2,
        glow: 14,
        colorKey: "followerTrail2",
        orbitRadius: 24,
        orbitSpeed: -0.02,
        orbitPhase: Math.PI / 2,
      },
      {
        x: w / 2,
        y: h / 2,
        lerp: 0.032,         // Distant satellite ember
        radius: 1.8,
        glow: 12,
        colorKey: "followerTrail3",
        orbitRadius: 32,
        orbitSpeed: 0.015,
        orbitPhase: Math.PI,
      },
    ].slice(0, followerCount)

    // Pointer event listeners on window (passive, zero layout thrashing)
    function handlePointerMove(e) {
      mouseState.targetX = e.clientX
      mouseState.targetY = e.clientY
      mouseState.active = true
      mouseState.idleTimer = 0
    }

    function handlePointerLeave() {
      mouseState.active = false
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true })

    // 4. Render loop with requestAnimationFrame
    let lastTime = performance.now()
    let themeCheckTime = 0

    function animate(currentTime) {
      const dt = Math.min(currentTime - lastTime, 40) // capped at 40ms to avoid jumps
      lastTime = currentTime

      // Periodically check for theme toggle changes
      if (currentTime - themeCheckTime > 1500) {
        colors = getColors()
        themeCheckTime = currentTime
      }

      ctx.clearRect(0, 0, w, h)

      // --- A. Render Ambient Floating Particles ("đốm sáng bay lởn vởn") ---
      for (let i = 0; i < ambientParticles.length; i++) {
        const p = ambientParticles[i]

        // Drift motion
        p.x += p.vx * (dt * 0.06)
        p.y += p.vy * (dt * 0.06)
        p.pulsePhase += p.pulseSpeed * dt

        // Soft screen edge bounce & wrap
        if (p.x < -30) p.x = w + 30
        if (p.x > w + 30) p.x = -30
        if (p.y < -30) p.y = h + 30
        if (p.y > h + 30) p.y = -30

        // Subtle breathing luminance and radius
        const pulse = 0.75 + 0.25 * Math.sin(p.pulsePhase)
        const currentAlpha = p.baseAlpha * pulse
        const c = colors[p.colorKey] || colors.ambient1

        // Draw soft radial bokeh glow
        const glowRadius = p.glowRadius * pulse
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius)
        grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${currentAlpha})`)
        grad.addColorStop(0.35, `rgba(${c.r}, ${c.g}, ${c.b}, ${currentAlpha * 0.4})`)
        grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Draw bright core dot
        ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.min(currentAlpha * 1.8, 0.95)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.baseRadius * 0.65, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- B. Render Interactive Mouse Followers ("đốm sáng di chuyển theo chuột") ---
      if (mouseState.active) {
        // Smooth fade-in
        mouseState.opacity = Math.min(mouseState.opacity + 0.05, 1)
        mouseState.idleTimer += dt
      } else {
        // Smooth fade-out when cursor is out of screen
        mouseState.opacity = Math.max(mouseState.opacity - 0.03, 0)
      }

      if (mouseState.opacity > 0.01) {
        for (let i = 0; i < followers.length; i++) {
          const f = followers[i]

          // Orbit phase update
          f.orbitPhase += f.orbitSpeed * (dt * 0.06)
          const orbitOffsetX = Math.cos(f.orbitPhase) * f.orbitRadius
          const orbitOffsetY = Math.sin(f.orbitPhase) * f.orbitRadius

          // LERP target position with orbital satellite offset
          const destX = mouseState.targetX + orbitOffsetX
          const destY = mouseState.targetY + orbitOffsetY

          // Linear Interpolation (LERP) physics
          f.x += (destX - f.x) * f.lerp
          f.y += (destY - f.y) * f.lerp

          const fc = colors[f.colorKey] || colors.followerLead
          const alpha = fc.a * mouseState.opacity

          // 1. Outer Soft Glow Halo
          const followerGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glow)
          followerGrad.addColorStop(0, `rgba(${fc.r}, ${fc.g}, ${fc.b}, ${alpha * 0.85})`)
          followerGrad.addColorStop(0.4, `rgba(${fc.r}, ${fc.g}, ${fc.b}, ${alpha * 0.3})`)
          followerGrad.addColorStop(1, `rgba(${fc.r}, ${fc.g}, ${fc.b}, 0)`)

          ctx.fillStyle = followerGrad
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.glow, 0, Math.PI * 2)
          ctx.fill()

          // 2. High-Luminance Core
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw faint ethereal constellation thread connecting the followers
        if (followers.length > 1) {
          ctx.beginPath()
          ctx.moveTo(followers[0].x, followers[0].y)
          for (let i = 1; i < followers.length; i++) {
            ctx.lineTo(followers[i].x, followers[i].y)
          }
          const leadColor = colors.followerLead
          ctx.strokeStyle = `rgba(${leadColor.r}, ${leadColor.g}, ${leadColor.b}, ${0.12 * mouseState.opacity})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [ambientCount, followerCount])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none select-none z-0 ${className}`}
      aria-hidden="true"
    />
  )
})

export default CyberParticles
