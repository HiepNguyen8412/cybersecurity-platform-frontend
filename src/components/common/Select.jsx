import { forwardRef } from "react"
import { ChevronDown, AlertCircle } from "lucide-react"

/**
 * Reusable Select component.
 */
const Select = forwardRef(function Select(
  {
    id,
    label,
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder = "Select an option",
    helperText,
    errorMessage,
    disabled = false,
    required = false,
    size = "md",
    className = "",
    wrapperClassName = "",
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  const isError = Boolean(errorMessage)

  const sizeStyles = {
    sm: "text-xs pl-2.5 pr-8 py-1.5 h-8",
    md: "text-sm pl-3.5 pr-9 py-2 h-9",
    lg: "text-base pl-4 pr-10 py-2.5 h-11",
  }

  let stateStyles = "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  if (isError) {
    stateStyles = "border-rose-400 text-rose-950 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
  }

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${wrapperClassName}`.trim()}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-slate-700 tracking-wide flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={isError}
          className={`
            w-full appearance-none rounded-lg border bg-white text-slate-900 transition-all duration-150
            outline-none cursor-pointer
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${sizeStyles[size] || sizeStyles.md}
            ${stateStyles}
            ${className}
          `.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
          {isError ? (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {isError && (
        <p className="text-xs text-rose-600 mt-1">{errorMessage}</p>
      )}

      {!isError && helperText && (
        <p className="text-xs text-slate-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select
