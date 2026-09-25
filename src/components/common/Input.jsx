import { forwardRef } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

/**
 * Reusable Input component supporting states: default, hover, focus, disabled, error, success.
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    type = "text",
    value,
    defaultValue,
    onChange,
    onClear,
    placeholder,
    helperText,
    errorMessage,
    successMessage,
    leftIcon = null,
    rightIcon = null,
    disabled = false,
    required = false,
    size = "md",
    className = "",
    wrapperClassName = "",
    clearable = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  const isError = Boolean(errorMessage)
  const isSuccess = Boolean(successMessage) && !isError

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 h-8",
    md: "text-sm px-3.5 py-2 h-9",
    lg: "text-base px-4 py-2.5 h-11",
  }

  // Border and focus state styles
  let stateStyles = "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  if (isError) {
    stateStyles = "border-rose-400 text-rose-950 focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
  } else if (isSuccess) {
    stateStyles = "border-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
  }

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${wrapperClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-slate-700 tracking-wide flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          aria-invalid={isError}
          aria-describedby={
            isError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          className={`
            w-full rounded-lg border bg-white text-slate-900 transition-all duration-150
            placeholder:text-slate-400 outline-none
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${sizeStyles[size] || sizeStyles.md}
            ${stateStyles}
            ${leftIcon ? "pl-9" : ""}
            ${rightIcon || clearable || isError || isSuccess ? "pr-9" : ""}
            ${className}
          `.trim()}
          {...props}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              aria-label="Clear input"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {isError && (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
          )}

          {isSuccess && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
          )}

          {rightIcon && !isError && !isSuccess && (
            <span className="text-slate-400 flex items-center">{rightIcon}</span>
          )}
        </div>
      </div>

      {isError && (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 flex items-center gap-1 mt-1">
          {errorMessage}
        </p>
      )}

      {isSuccess && (
        <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
          {successMessage}
        </p>
      )}

      {!isError && !isSuccess && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input
