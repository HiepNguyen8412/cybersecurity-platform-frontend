import { forwardRef, useEffect, useRef } from "react"
import { Check, Minus } from "lucide-react"

/**
 * Reusable Checkbox component.
 */
const Checkbox = forwardRef(function Checkbox(
  {
    id,
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
  const innerRef = useRef(null)
  const resolvedRef = ref || innerRef
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  useEffect(() => {
    if (resolvedRef.current) {
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
              peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2
              ${
                checked || indeterminate
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white border-slate-300 hover:border-slate-400"
              }
              ${errorMessage ? "border-rose-500" : ""}
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
              <span className="font-medium text-slate-700 leading-tight">
                {label}
                {required && <span className="text-rose-500 ml-0.5">*</span>}
              </span>
            )}
            {description && (
              <span className="text-xs text-slate-500 leading-normal mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </label>

      {errorMessage && (
        <p className="text-xs text-rose-600 mt-1 pl-7">{errorMessage}</p>
      )}
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox
