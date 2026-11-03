import { useState, useRef, useEffect, memo } from "react"

/**
 * CyberSecurityVideoBanner
 * 
 * Cinematic, logo-free Information Security video stream banner for top header / hero.
 * Features:
 * - Native HTML5 Video playback with seamless loop for WebM/MP4 video files.
 * - Procedural 60FPS GPU Canvas video stream with ultra-smooth 1000ms optical cross-fade.
 * - Zero flash, zero black frame, zero layout shift.
 * - Scenes: 3D rotating cyber defense wireframe, concentric encryption radar, hexagonal firewall matrix, and real-time security telemetry.
 * - Zero logos (100% clean security graphics).
 * - Full content customization ("tinh chỉnh nội dung theo trang web") via props.
 */
export const CyberSecurityVideoBanner = memo(function CyberSecurityVideoBanner({
  videoSrc = "/videos/cyber_security_top.webm",
  height = "h-[360px] md:h-[440px]",
  threatLevel = "ZERO-TRUST DEFENDED",
  systemStatus = "ALL SYSTEMS NOMINAL // 0 BREACHES",
  showOverlayTelemetry = true,
  opacity = 0.35,
  className = "",
  lazyLoadVideo = true,
}) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(!lazyLoadVideo)
  const [canvasSuspended, setCanvasSuspended] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Defer heavy 13.5MB video request slightly on cold load so critical JS/fonts finish first
  useEffect(() => {
    if (!lazyLoadVideo || shouldLoadVideo) return

    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(() => setShouldLoadVideo(true), { timeout: 1500 })
      } else {
        setShouldLoadVideo(true)
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [lazyLoadVideo, shouldLoadVideo])

  // Gracefully suspend canvas animation 1.2s AFTER video is playing to complete the optical crossfade
  useEffect(() => {
    if (videoLoaded && !videoError) {
      const timer = setTimeout(() => {
        setCanvasSuspended(true)
      }, 1200)
      return () => clearTimeout(timer)
    }
    setCanvasSuspended(false)
  }, [videoLoaded, videoError])

  // Procedural Canvas Animation (active on load and during crossfade)
  useEffect(() => {
    if (canvasSuspended) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animId
    let w = 1920
    let h = 480
    let dpr = 1

    function resize() {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth || window.innerWidth
      h = canvas.clientHeight || 440
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    // Generate dynamic nodes
    const nodes = []
    for (let i = 0; i < 35; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2,
      })
    }

    let frame = 0
    function animate() {
      ctx.clearRect(0, 0, w, h)
      const t = frame * 0.02

      // Central Coordinates
      const cx = w * 0.5
      const cy = h * 0.52

      // 1. Concentric Holographic Defense Radar
      for (const r of [90, 160, 230]) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(0, 229, 255, 0.12)"
        ctx.lineWidth = 1
        ctx.setLineDash([4, 8])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // 2. Rotating Defense Perimeter Arcs
      ctx.beginPath()
      ctx.arc(cx, cy, 160, t, t + Math.PI * 0.6)
      ctx.strokeStyle = "rgba(0, 229, 255, 0.65)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, 160, t + Math.PI, t + Math.PI * 1.6)
      ctx.strokeStyle = "rgba(0, 132, 255, 0.65)"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(cx, cy, 210, -t * 0.8, -t * 0.8 + Math.PI * 0.75)
      ctx.strokeStyle = "rgba(56, 189, 248, 0.45)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // 3. Central Hexagonal Firewall Shield
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.3)
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3
        const hx = Math.cos(angle) * (48 + Math.sin(t * 2) * 4)
        const hy = Math.sin(angle) * (48 + Math.sin(t * 2) * 4)
        if (i === 0) ctx.moveTo(hx, hy)
        else ctx.lineTo(hx, hy)
      }
      ctx.closePath()
      ctx.fillStyle = "rgba(0, 162, 255, 0.1)"
      ctx.fill()
      ctx.strokeStyle = "rgba(0, 229, 255, 0.75)"
      ctx.lineWidth = 1.8
      ctx.stroke()

      // Core Luminous Point
      ctx.fillStyle = "#00e5ff"
      ctx.beginPath()
      ctx.arc(0, 0, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 4. Interconnected Security Nodes & Threat Vectors
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx
        n.y += n.vy
        if (n.x < 20 || n.x > w - 20) n.vx *= -1
        if (n.y < 20 || n.y > h - 20) n.vy *= -1

        ctx.fillStyle = "rgba(0, 229, 255, 0.7)"
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j]
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y)
          if (dist < 120) {
            ctx.strokeStyle = "rgba(0, 162, 255, " + (1 - dist / 120) * 0.2 + ")"
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(n2.x, n2.y)
            ctx.stroke()
          }
        }
      }

      // 5. Left Cyber Sphere Wireframe
      const gx = w * 0.16
      const gy = h * 0.52
      ctx.save()
      ctx.strokeStyle = "rgba(0, 162, 255, 0.25)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(gx, gy, 95, 0, Math.PI * 2)
      ctx.stroke()
      for (let step = 25; step <= 75; step += 25) {
        ctx.beginPath()
        ctx.ellipse(gx, gy, 95, step, t * 0.4, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()

      // 6. Horizontal Telemetry Scanline
      const scanY = (frame * 2.5) % h
      const scanGrad = ctx.createLinearGradient(0, scanY, w, scanY)
      scanGrad.addColorStop(0, "transparent")
      scanGrad.addColorStop(0.3, "rgba(0, 162, 255, 0.3)")
      scanGrad.addColorStop(0.5, "rgba(0, 229, 255, 0.7)")
      scanGrad.addColorStop(0.7, "rgba(0, 162, 255, 0.3)")
      scanGrad.addColorStop(1, "transparent")
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 1, w, 2)

      frame++
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [canvasSuspended])

  return (
    <div
      className={`absolute top-0 inset-x-0 ${height} pointer-events-none overflow-hidden select-none z-0 [mask-image:linear-gradient(to_bottom,black_25%,transparent_100%)] ${className}`}
      aria-hidden="true"
    >
      {/* 1. Procedural 60FPS High-Tech Canvas Layer (Active immediately, fades out smoothly when video is ready) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen filter blur-[0.4px] pointer-events-none"
        style={{
          opacity: videoLoaded ? 0 : opacity,
          transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* 2. Native HTML5 Video Layer (Silky-smooth 1000ms cross-fade in over the canvas) */}
      {videoSrc && !videoError && shouldLoadVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover mix-blend-screen filter blur-[0.5px] pointer-events-none"
          style={{
            opacity: videoLoaded ? opacity : 0,
            transition: "opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <source src={videoSrc} type="video/webm" />
          <source src={videoSrc.replace(/\.webm$/, ".mp4")} type="video/mp4" />
        </video>
      )}

      {/* 3. Subtle Cyber Telemetry HUD Overlay (Zero Logo, Pure Security Data) */}
      {showOverlayTelemetry && (
        <div className="absolute top-20 right-8 font-mono text-[10px] tracking-widest text-cyan-400/60 hidden xl:flex flex-col items-end gap-1 select-none pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-cyan-300 font-bold">{threatLevel}</span>
          </div>
          <span className="text-slate-400/50 text-[9px]">{systemStatus}</span>
        </div>
      )}

      {/* 4. Bottom Soft Dissolve Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030816] pointer-events-none" />
    </div>
  )
})

export default CyberSecurityVideoBanner
