import { forwardRef, useEffect, useId, useRef } from "react"
import { Check, Minus } from "lucide-react"

/**
 * Reusable Checkbox component with Editorial Light & Deep Obsidian Dark theming.
 */
const Checkbox = forwardRef(function Checkbox(
  {
    id,
    name,
    label,
    description,
    checked = false,
    indeterminate = false,
    onChange,
    disabled = false,
    required = false,
    errorMessage,
    className = "",
    wrapperClassName = "",
    ...props
  },
  ref
) {
  const generatedId = useId()
  const innerRef = useRef(null)
  const resolvedRef = ref || innerRef
  const checkboxId =
    id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : generatedId)
  const checkboxName = name || checkboxId

  useEffect(() => {
    if (resolvedRef && typeof resolvedRef !== "function" && resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate
    }
  }, [indeterminate, resolvedRef])

  return (
    <div className={`flex flex-col space-y-1 ${wrapperClassName}`.trim()}>
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={resolvedRef}
            id={checkboxId}
            name={checkboxName}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="peer sr-only"
            {...props}
          />

          <div
            className={`
              h-4.5 w-4.5 rounded border transition-all duration-150 flex items-center justify-center
              peer-focus-visible:ring-2 peer-focus-visible:ring-[#1D4ED8] dark:peer-focus-visible:ring-[#3B82F6] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#FAF9F6] dark:peer-focus-visible:ring-offset-[#0B0E14]
              ${
                checked || indeterminate
                  ? "bg-[#1D4ED8] dark:bg-[#2563EB] border-[#1D4ED8] dark:border-[#3B82F6] text-white"
                  : "bg-white dark:bg-[#121722] border-[#D0CCC3] dark:border-white/[0.16] hover:border-[#94A3B8] dark:hover:border-white/[0.28]"
              }
              ${errorMessage ? "border-rose-500 dark:border-rose-500" : ""}
              ${className}
            `.trim()}
          >
            {checked && !indeterminate && <Check className="h-3 w-3 stroke-[3]" />}
            {indeterminate && <Minus className="h-3 w-3 stroke-[3]" />}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col text-sm">
            {label && (
              <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                {label}
                {required && <span className="text-rose-500 ml-0.5">*</span>}
              </span>
            )}
            {description && (
              <span className="text-xs text-[#475569] dark:text-[#94A3B8] leading-normal mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>

      {errorMessage && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 pl-7">{errorMessage}</p>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox
