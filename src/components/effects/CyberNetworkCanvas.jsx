import { useRef, useEffect, useCallback } from "react"

/**
 * CyberNetworkCanvas
 *
 * A high-performance HTML5 Canvas animation rendering an interactive cyber
 * threat-intelligence network topology. Floating nodes connected by pulsing
 * data-flow lines create an atmospheric, hacker-grade backdrop.
 *
 * Features:
 * - Organic floating particle nodes with soft glow halos
 * - Dynamic proximity-based connection lines with travelling data pulses
 * - Subtle mouse-proximity repulsion for interactivity
 * - Hex code labels on select nodes for authenticity
 * - Scanning sweep line (radar-style) for added menace
 * - Fully responsive, DPI-aware, and zero external dependencies
 *
 * Performance: requestAnimationFrame with delta-time, offscreen pre-rendering
 * for glow textures, automatic cleanup on unmount.
 */

const HEX_LABELS = [
  "0xF4C3", "0x7A1D", "0xBE09", "0x3F8A", "0xD2E7",
  "0x91C6", "0x4B5F", "0xA8D2", "0x6E3B", "0xC710",
  "0x2FA5", "0x8D4E", "0xE1B8", "0x5C9F", "0x0A73",
]

/** Create a reusable offscreen radial-glow sprite for each node */
function createGlowSprite(radius, color) {
  const size = radius * 6
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, color)
  gradient.addColorStop(0.3, color.replace(/[\d.]+\)$/, "0.15)"))
  gradient.addColorStop(1, "transparent")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

export default function CyberNetworkCanvas({ className = "" }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animFrameRef = useRef(null)

  const initAndAnimate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // --- Configuration ---
    const NODE_COUNT_BASE = 55 // for 1920px width; scales with viewport
    const CONNECTION_DIST = 180
    const MOUSE_REPEL_DIST = 120
    const MOUSE_REPEL_FORCE = 0.6
    const SWEEP_SPEED = 0.00012 // radians per ms

    // --- Detect theme for color adaptation ---
    function getThemeColors() {
      const root = document.documentElement
      const isDark = root.classList.contains("dark")
      const isCyber = root.classList.contains("cyberpunk")

      if (isCyber) {
        return {
          nodeCore: "rgba(34, 211, 238, 0.9)",     // cyan-400
          nodeGlow: "rgba(34, 211, 238, 0.25)",
          lineBase: "rgba(34, 211, 238, 0.08)",
          lineActive: "rgba(34, 211, 238, 0.28)",
          pulseColor: "rgba(52, 211, 153, 0.8)",    // emerald-400
          sweepColor: "rgba(34, 211, 238, 0.04)",
          labelColor: "rgba(34, 211, 238, 0.35)",
          bigNodeCore: "rgba(56, 189, 248, 0.95)",  // sky-400
          bigNodeGlow: "rgba(56, 189, 248, 0.2)",
        }
      }
      if (isDark) {
        return {
          nodeCore: "rgba(148, 163, 184, 0.7)",     // slate-400
          nodeGlow: "rgba(148, 163, 184, 0.12)",
          lineBase: "rgba(148, 163, 184, 0.05)",
          lineActive: "rgba(148, 163, 184, 0.18)",
          pulseColor: "rgba(96, 165, 250, 0.7)",    // blue-400
          sweepColor: "rgba(148, 163, 184, 0.025)",
          labelColor: "rgba(148, 163, 184, 0.25)",
          bigNodeCore: "rgba(96, 165, 250, 0.8)",
          bigNodeGlow: "rgba(96, 165, 250, 0.15)",
        }
      }
      // Light mode
      return {
        nodeCore: "rgba(100, 116, 139, 0.45)",      // slate-500
        nodeGlow: "rgba(100, 116, 139, 0.06)",
        lineBase: "rgba(100, 116, 139, 0.04)",
        lineActive: "rgba(100, 116, 139, 0.12)",
        pulseColor: "rgba(59, 130, 246, 0.5)",      // blue-500
        sweepColor: "rgba(100, 116, 139, 0.015)",
        labelColor: "rgba(100, 116, 139, 0.15)",
        bigNodeCore: "rgba(59, 130, 246, 0.5)",
        bigNodeGlow: "rgba(59, 130, 246, 0.08)",
      }
    }

    // --- Resize handler ---
    let w, h, dpr, nodeCount
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      nodeCount = Math.round(NODE_COUNT_BASE * (w / 1920))
      nodeCount = Math.max(20, Math.min(nodeCount, 80))
    }
    resize()

    // --- Create node particles ---
    let nodes = []
    function spawnNodes() {
      nodes = []
      for (let i = 0; i < nodeCount; i++) {
        const isBig = Math.random() < 0.12
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          baseRadius: isBig ? 2.5 + Math.random() * 1.5 : 1 + Math.random() * 1.2,
          isBig,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.0008 + Math.random() * 0.001,
          label: isBig && Math.random() < 0.6 ? HEX_LABELS[Math.floor(Math.random() * HEX_LABELS.length)] : null,
        })
      }
    }
    spawnNodes()

    // --- Data pulses travelling along connections ---
    let pulses = []
    function maybeSpawnPulse(fromNode, toNode) {
      if (pulses.length > 15) return
      if (Math.random() > 0.0008) return
      pulses.push({
        from: fromNode,
        to: toNode,
        t: 0,
        speed: 0.3 + Math.random() * 0.4,
        size: 1.5 + Math.random(),
      })
    }

    // --- Sweep angle ---
    let sweepAngle = 0

    // --- Pre-render glow sprites (will be regenerated on theme change) ---
    let colors = getThemeColors()
    let glowSmall = createGlowSprite(6, colors.nodeGlow)
    let glowBig = createGlowSprite(10, colors.bigNodeGlow)
    let lastThemeCheck = 0

    // --- Animation loop ---
    let lastTime = performance.now()

    function animate(now) {
      const dt = Math.min(now - lastTime, 40) // cap at 40ms (25fps min)
      lastTime = now

      // Periodically re-detect theme (every 2 seconds)
      if (now - lastThemeCheck > 2000) {
        const newColors = getThemeColors()
        if (newColors.nodeCore !== colors.nodeCore) {
          colors = newColors
          glowSmall = createGlowSprite(6, colors.nodeGlow)
          glowBig = createGlowSprite(10, colors.bigNodeGlow)
        }
        lastThemeCheck = now
      }

      ctx.clearRect(0, 0, w, h)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // -- Radar sweep --
      sweepAngle += SWEEP_SPEED * dt
      const sweepCx = w * 0.65
      const sweepCy = h * 0.4
      const sweepR = Math.max(w, h) * 0.8
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(sweepCx, sweepCy)
      ctx.arc(sweepCx, sweepCy, sweepR, sweepAngle, sweepAngle + 0.35)
      ctx.closePath()
      const sweepGrad = ctx.createRadialGradient(sweepCx, sweepCy, 0, sweepCx, sweepCy, sweepR)
      sweepGrad.addColorStop(0, colors.sweepColor)
      sweepGrad.addColorStop(1, "transparent")
      ctx.fillStyle = sweepGrad
      ctx.fill()
      ctx.restore()

      // -- Update nodes --
      for (const node of nodes) {
        node.x += node.vx * (dt * 0.06)
        node.y += node.vy * (dt * 0.06)
        node.pulsePhase += node.pulseSpeed * dt

        // Mouse repulsion
        const dmx = node.x - mx
        const dmy = node.y - my
        const distMouse = Math.sqrt(dmx * dmx + dmy * dmy)
        if (distMouse < MOUSE_REPEL_DIST && distMouse > 0) {
          const force = (1 - distMouse / MOUSE_REPEL_DIST) * MOUSE_REPEL_FORCE
          node.vx += (dmx / distMouse) * force * 0.02
          node.vy += (dmy / distMouse) * force * 0.02
        }

        // Damping
        node.vx *= 0.998
        node.vy *= 0.998

        // Soft boundary wrapping
        if (node.x < -20) node.x = w + 20
        if (node.x > w + 20) node.x = -20
        if (node.y < -20) node.y = h + 20
        if (node.y > h + 20) node.y = -20
      }

      // -- Draw connections + spawn pulses --
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DIST) {
            const alpha = 1 - dist / CONNECTION_DIST
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = alpha > 0.5 ? colors.lineActive : colors.lineBase
            ctx.lineWidth = alpha > 0.5 ? 0.8 : 0.4
            ctx.globalAlpha = alpha
            ctx.stroke()
            ctx.globalAlpha = 1

            // Maybe spawn a data pulse
            maybeSpawnPulse(a, b)
          }
        }
      }

      // -- Update & draw data pulses --
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += p.speed * dt * 0.001
        if (p.t >= 1) {
          pulses.splice(i, 1)
          continue
        }
        const px = p.from.x + (p.to.x - p.from.x) * p.t
        const py = p.from.y + (p.to.y - p.from.y) * p.t

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = colors.pulseColor
        ctx.fill()
      }

      // -- Draw nodes --
      for (const node of nodes) {
        const pulse = 0.7 + 0.3 * Math.sin(node.pulsePhase)
        const r = node.baseRadius * pulse

        // Glow sprite
        const sprite = node.isBig ? glowBig : glowSmall
        const spriteSize = r * 12
        ctx.drawImage(sprite, node.x - spriteSize / 2, node.y - spriteSize / 2, spriteSize, spriteSize)

        // Core dot
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = node.isBig ? colors.bigNodeCore : colors.nodeCore
        ctx.fill()

        // Hex label
        if (node.label) {
          ctx.font = "9px 'JetBrains Mono', 'Fira Code', monospace"
          ctx.fillStyle = colors.labelColor
          ctx.textAlign = "center"
          ctx.fillText(node.label, node.x, node.y - r * 3 - 4)
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    // --- Event listeners ---
    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    function handleMouseLeave() {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }
    function handleResize() {
      resize()
      // Re-distribute nodes that ended up outside new bounds
      for (const n of nodes) {
        if (n.x > w) n.x = Math.random() * w
        if (n.y > h) n.y = Math.random() * h
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove, { passive: true })
    canvas.addEventListener("mouseleave", handleMouseLeave, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const cleanup = initAndAnimate()
    return cleanup
  }, [initAndAnimate])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  )
}
