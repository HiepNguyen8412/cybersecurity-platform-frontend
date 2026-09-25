import { useState } from "react"
import { User } from "lucide-react"

/**
 * Reusable Avatar component with initials fallback, image loading error handling,
 * and status indicators.
 */
export function Avatar({
  src,
  alt = "User avatar",
  name = "",
  size = "md",
  status = null,
  className = "",
  ...props
}) {
  const [imageError, setImageError] = useState(false)

  // Compute initials from name
  const getInitials = (str) => {
    if (!str) return ""
    const parts = str.trim().split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const sizeStyles = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-14 w-14 text-lg",
  }

  const iconSizes = {
    xs: "h-3.5 w-3.5",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
  }

  const statusStyles = {
    online: "bg-emerald-500",
    offline: "bg-slate-400",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  }

  const statusPositions = {
    xs: "h-1.5 w-1.5 ring-1 ring-white",
    sm: "h-2 w-2 ring-1.5 ring-white",
    md: "h-2.5 w-2.5 ring-2 ring-white",
    lg: "h-3 w-3 ring-2 ring-white",
    xl: "h-3.5 w-3.5 ring-2 ring-white",
  }

  const initials = getInitials(name)
  const hasImage = src && !imageError

  return (
    <div className={`relative inline-flex shrink-0 ${className}`.trim()} {...props}>
      <div
        className={`flex items-center justify-center rounded-full font-semibold overflow-hidden select-none bg-blue-100 text-blue-700 border border-slate-200/80 ${sizeStyles[size] || sizeStyles.md}`}
      >
        {hasImage ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <User className={`${iconSizes[size] || iconSizes.md} text-slate-500`} />
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ${statusStyles[status] || statusStyles.online} ${statusPositions[size] || statusPositions.md}`}
          aria-label={`Status: ${status}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  )
}

export default Avatar
