import { forwardRef, useId } from "react"
import { ChevronDown, AlertCircle } from "lucide-react"

/**
 * Reusable Select component with Editorial Light & Deep Obsidian Dark theming.
 */
const Select = forwardRef(function Select(
  {
    id,
    name,
    label,
    options = [],
    value,
    defaultValue,
    onChange,
    placeholder = "Chọn một tùy chọn",
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
  const generatedId = useId()
  const selectId =
    id || (typeof label === "string" ? label.toLowerCase().replace(/\s+/g, "-") : generatedId)
  const selectName = name || selectId
  const isError = Boolean(errorMessage)

  const sizeStyles = {
    sm: "text-xs pl-2.5 pr-8 py-1.5 h-8",
    md: "text-sm pl-3.5 pr-9 py-2 h-9",
    lg: "text-base pl-4 pr-10 py-2.5 h-11",
  }

  let stateStyles =
    "border-[#E5E2DC] dark:border-white/[0.12] focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-[#1D4ED8]/15 dark:focus:ring-[#3B82F6]/20"
  if (isError) {
    stateStyles =
      "border-rose-500 dark:border-rose-500/80 text-rose-900 dark:text-rose-200 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/15"
  }

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${wrapperClassName}`.trim()}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-wide flex items-center justify-between"
        >
          <span>
            {label}
            {required && (
              <span className="text-rose-500 ml-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          name={selectName}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={isError}
          className={`
            w-full appearance-none rounded-lg border bg-white dark:bg-[#121722] text-[#0F172A] dark:text-[#F1F5F9] transition-all duration-150
            outline-none cursor-pointer
            disabled:bg-[#F3F1EC] dark:disabled:bg-[#161C2A] disabled:text-[#94A3B8] dark:disabled:text-[#64748B] disabled:cursor-not-allowed
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

        <div className="pointer-events-none absolute right-3 flex items-center text-[#64748B] dark:text-[#94A3B8]">
          {isError ? (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {isError && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{errorMessage}</p>
      )}

      {!isError && helperText && (
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">{helperText}</p>
      )}
    </div>
  )
})

Select.displayName = "Select"

export default Select
