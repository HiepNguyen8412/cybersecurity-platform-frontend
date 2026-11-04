import { memo } from "react"
import CyberParticles from "../effects/CyberParticles"

/**
 * CyberBackground
 * 
 * Clean, calm, GPU-accelerated ambient backdrop.
 * Provides soft optical depth with gentle illumination (Linear / Stripe / Vercel aesthetic).
 * Strictly zero tacky radar HUDs, zero laser sweeps, zero AI-clichés.
 */
export const CyberBackground = memo(function CyberBackground({
  showGrid = true,
  showGlow = true,
  showParticles = true,
  className = "",
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Canvas Void */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#0b0f19] cyberpunk:bg-[#040a1a] transition-colors duration-300" />

      {/* 2. Soft Ambient Lighting Aurora Orbs */}
      {showGlow && (
        <>
          {/* Top-Center Luminous Spotlight (Soft Blue & Indigo) */}
          <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 w-[1100px] h-[500px] rounded-full blur-[140px] opacity-60 dark:opacity-40 cyberpunk:opacity-60 bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent dark:from-[#3b82f6]/20 dark:via-[#1d4ed8]/10 dark:to-transparent pointer-events-none animate-pulse-gentle" />

          {/* Top-Left Ambient Orb */}
          <div className="absolute -top-[40px] -left-[60px] w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 dark:opacity-25 bg-gradient-to-br from-sky-400/10 via-blue-500/5 to-transparent dark:from-[#2563eb]/18 dark:to-transparent pointer-events-none" />

          {/* Bottom-Right Soft Ambient Orb */}
          <div className="absolute bottom-[5%] -right-[80px] w-[600px] h-[600px] rounded-full blur-[140px] opacity-35 dark:opacity-20 bg-gradient-to-tl from-indigo-400/10 via-blue-400/5 to-transparent dark:from-[#3b82f6]/15 dark:to-transparent pointer-events-none" />
        </>
      )}

      {/* 3. Subtle Widescreen Grid (Quiet & Non-Intrusive) */}
      {showGrid && (
        <div className="absolute inset-0 cyber-ambient-grid opacity-35 dark:opacity-25 [mask-image:radial-gradient(ellipse_at_center,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0.75)_60%,rgba(0,0,0,0.95)_100%)]" />
      )}

      {/* 4. Interactive Subtle Ambient Particles */}
      {showParticles && <CyberParticles ambientCount={8} followerCount={2} />}

      {/* 5. Natural Depth Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(15,23,42,0.08)_80%,rgba(11,15,25,0.4)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(11,15,25,0.4)_80%,rgba(5,10,20,0.7)_100%)] pointer-events-none" />
    </div>
  )
})

export default CyberBackground
