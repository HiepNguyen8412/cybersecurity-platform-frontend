import { memo } from "react"

/**
 * CyberBackground
 *
 * Calm archival paper (Light) / Deep Obsidian (Dark) backdrop with an optional
 * ultra-subtle architectural hairline grid. Zero particles, zero blur blobs.
 */
export const CyberBackground = memo(function CyberBackground({
  showGrid = true,
  showGlow = false,
  className = "",
}) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`.trim()}
      aria-hidden="true"
    >
      {/* 1. Base Canvas Surface */}
      <div className="absolute inset-0 bg-[#FAF9F6] dark:bg-[#0B0E14] transition-colors duration-200" />

      {/* 2. Ultra-Quiet Top Falloff (No blur orbs) */}
      {showGlow && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(29,78,216,0.03),transparent_70%)] dark:bg-[radial-gradient(ellipse_75%_45%_at_50%_0%,rgba(59,130,246,0.045),transparent_70%)]" />
      )}

      {/* 3. Architectural Hairline Grid (~0.04 opacity) */}
      {showGrid && (
        <div className="absolute inset-0 cyber-ambient-grid opacity-100 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_35%,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0.35)_70%,transparent_100%)]" />
      )}
    </div>
  )
})

export default CyberBackground
