import { memo } from "react"
import CyberParticles from "../effects/CyberParticles"
import CyberSecurityVideoBanner from "../effects/CyberSecurityVideoBanner"

/**
 * CyberBackground
 * 
 * Enterprise-grade, GPU-accelerated cybersecurity ambient backdrop with soft optical diffusion.
 * Designed to provide deep, cinematic cybersecurity ambiance without visual clutter.
 * 
 * Features:
 * - Top Information Security Video Banner ("đoạn video về bảo mật thông tin, không có logo"):
 *   Native HTML5 video loop with procedural 60FPS fallback.
 * - Ambient Floating Cyber Orbs ("đốm sáng bay lởn vởn"): Gentle, organic bokeh particles.
 * - Interactive Cursor Followers ("đốm sáng di chuyển theo chuột"): Chained spring / LERP followers.
 * - Soft Diffusion & Blur: Elements are gently blurred to create atmospheric depth.
 * - Anti-Clutter Layout: Wide coordinates (64px/128px), zero phantom text stamps, and gentle ambient light sweeps.
 * - Radial Vignette: Smooth falloff towards center and edges so foreground content and cards remain crisp and readable.
 * - Stacking Context: Runs at z-0 with pointer-events-none, strictly non-intrusive.
 */
export const CyberBackground = memo(function CyberBackground({
  showGrid = true,
  showGlow = true,
  showScanline = false,
  showRadar = false,
  showParticles = true,
  showTopVideo = false,
  videoSrc = "/videos/cyber_security_top.webm",
  className = "",
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Canvas Void */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#0a0f1d] cyberpunk:bg-[#040a1a] transition-colors duration-300" />

      {/* 2. Top Information Security Video Stream Layer (Zero Logo, Seamless Loop) */}
      {showTopVideo && (
        <CyberSecurityVideoBanner
          videoSrc={videoSrc}
          threatLevel="ZERO-TRUST ACTIVE"
          systemStatus="ENCRYPTED TELEMETRY STREAM"
          opacity={0.32}
        />
      )}

      {/* 3. Concentric Radar Defense Target HUD (Soft-focused Background Watermark) */}
      {showRadar && (
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] pointer-events-none opacity-15 dark:opacity-10 cyberpunk:opacity-25 blur-[1.5px] transition-opacity">
          <svg viewBox="0 0 500 500" className="w-full h-full stroke-current text-indigo-500/40 dark:text-indigo-400/30 cyberpunk:text-cyan-400/50">
            {/* Concentric Defense Perimeter Circles */}
            <circle cx="250" cy="250" r="230" fill="none" strokeWidth="1" strokeDasharray="6 8" />
            <circle cx="250" cy="250" r="170" fill="none" strokeWidth="0.8" />
            <circle cx="250" cy="250" r="110" fill="none" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="250" cy="250" r="45" fill="none" strokeWidth="0.8" />
            <circle cx="250" cy="250" r="3" className="fill-current" />
            
            {/* Soft Cardinal Crosshair Rays */}
            <line x1="250" y1="15" x2="250" y2="485" strokeWidth="0.8" strokeOpacity="0.3" />
            <line x1="15" y1="250" x2="485" y2="250" strokeWidth="0.8" strokeOpacity="0.3" />
            <line x1="85" y1="85" x2="415" y2="415" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="3 5" />
            <line x1="85" y1="415" x2="415" y2="85" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="3 5" />
          </svg>
        </div>
      )}

      {/* 4. Circuit Nodes & Digital Defense Traces (Soft-focused Lower Watermark) */}
      {showRadar && (
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] pointer-events-none opacity-15 dark:opacity-10 cyberpunk:opacity-20 blur-[1.5px] transition-opacity">
          <svg viewBox="0 0 400 400" className="w-full h-full stroke-current text-blue-500/40 dark:text-blue-400/30 cyberpunk:text-cyan-400/50">
            <circle cx="200" cy="200" r="160" fill="none" strokeWidth="0.8" strokeDasharray="4 6" />
            <circle cx="200" cy="200" r="90" fill="none" strokeWidth="0.8" />
            <path d="M 40,200 L 160,200 L 240,120 L 340,120" fill="none" strokeWidth="1.2" />
            <circle cx="340" cy="120" r="3" className="fill-current" />
            <path d="M 120,360 L 120,280 L 200,200" fill="none" strokeWidth="1.2" strokeDasharray="3 4" />
            <circle cx="120" cy="360" r="2.5" className="fill-current" />
          </svg>
        </div>
      )}

      {/* 5. Atmospheric Aurora Depth Orbs (High-Luminance Cyber Glows with Ultra-Soft Diffusion) */}
      {showGlow && (
        <>
          {/* Top-Center Spotlight Conical Beam (Natural Ocean Sapphire & Emerald Aurora) */}
          <div className="absolute -top-[160px] left-1/2 -translate-x-1/2 w-[1100px] h-[500px] rounded-full blur-[140px] opacity-70 dark:opacity-55 cyberpunk:opacity-75 bg-gradient-to-b from-blue-500/18 via-emerald-500/12 to-transparent dark:from-[#2563eb]/22 dark:via-[#10b981]/14 dark:to-transparent cyberpunk:from-[#0084ff]/30 cyberpunk:via-[#00d2ff]/18 cyberpunk:to-transparent pointer-events-none animate-pulse-gentle" />

          {/* Top-Left Deep Marine Depth Orb */}
          <div className="absolute -top-[60px] -left-[80px] w-[550px] h-[550px] rounded-full blur-[130px] opacity-50 dark:opacity-35 cyberpunk:opacity-50 bg-gradient-to-br from-blue-500/12 via-indigo-400/8 to-transparent dark:from-[#1d4ed8]/25 dark:via-[#047857]/15 dark:to-transparent cyberpunk:from-[#1d4ed8]/28 cyberpunk:via-[#0284c7]/18 cyberpunk:to-transparent pointer-events-none" />

          {/* Bottom-Right Clear Sky & Mint Depth Orb */}
          <div className="absolute bottom-[2%] -right-[100px] w-[650px] h-[650px] rounded-full blur-[140px] opacity-45 dark:opacity-30 cyberpunk:opacity-45 bg-gradient-to-tl from-sky-400/12 via-emerald-400/8 to-transparent dark:from-[#0284c7]/22 dark:via-[#10b981]/15 dark:to-transparent cyberpunk:from-[#00a2ff]/24 cyberpunk:via-[#0369a1]/18 cyberpunk:to-transparent pointer-events-none" />
        </>
      )}

      {/* 6. Soft Diffusion Cyber Grid (Widescreen 64px / 128px Coordinates) */}
      {showGrid && (
        <div className="absolute inset-0 cyber-ambient-grid opacity-60 dark:opacity-50 cyberpunk:opacity-65 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.85)_55%,rgba(0,0,0,0.95)_100%)]" />
      )}

      {/* 7. Subtle Tactical HUD Crosshairs (Spaced 256px, low clutter) */}
      {showGrid && (
        <div className="absolute inset-0 cyber-hud-crosshairs opacity-40 dark:opacity-30 cyberpunk:opacity-45" />
      )}

      {/* 8. Soft Ambient Light Wave (Feathered, non-distracting telemetry shimmer) */}
      {showScanline && (
        <div className="absolute inset-0 cyber-telemetry-scanline opacity-60 dark:opacity-60 cyberpunk:opacity-75" />
      )}

      {/* 9. Interactive Cyber Particles & Cursor Followers (Gentle, low-density ambient depth) */}
      {showParticles && <CyberParticles ambientCount={10} followerCount={2} />}

      {/* 10. Cinematic Depth Vignette (Softens screen center for optimal text readability) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,9,13,0.3)_75%,rgba(3,8,22,0.6)_100%)] pointer-events-none" />
    </div>
  )
})

export default CyberBackground
