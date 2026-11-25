import { forwardRef, useState } from "react"
import { AlertCircle, CheckCircle2, X, Eye, EyeOff } from "lucide-react"

/**
 * Reusable Input component supporting states: default, hover, focus, disabled, error, success,
 * and built-in password visibility toggle across Editorial Light & Deep Obsidian Dark.
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
    showPasswordToggle = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  const isError = Boolean(errorMessage)
  const isSuccess = Boolean(successMessage) && !isError

  const isPasswordType = type === "password"
  const resolvedType = isPasswordType ? (showPassword ? "text" : "password") : type

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1.5 h-8",
    md: "text-sm px-3.5 py-2 h-9",
    lg: "text-base px-4 py-2.5 h-11",
  }

  let stateStyles =
    "border-[#E5E2DC] dark:border-white/[0.09] focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-600/15 dark:focus:ring-blue-500/20"
  if (isError) {
    stateStyles =
      "border-rose-400 dark:border-rose-500/70 text-rose-950 dark:text-rose-100 focus:border-rose-600 dark:focus:border-rose-400 focus:ring-2 focus:ring-rose-500/15"
  } else if (isSuccess) {
    stateStyles =
      "border-emerald-400 dark:border-emerald-500/70 focus:border-emerald-600 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
  }

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${wrapperClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] tracking-wide flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-[#64748B] dark:text-[#94A3B8]">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
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
            w-full rounded-xl border bg-white dark:bg-[#161C2A] text-[#0F172A] dark:text-[#F1F5F9] transition-all duration-150
            placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] outline-none shadow-2xs
            disabled:bg-[#F3F1EC] dark:disabled:bg-[#121722] disabled:text-[#94A3B8] dark:disabled:text-[#475569] disabled:cursor-not-allowed
            ${sizeStyles[size] || sizeStyles.md}
            ${stateStyles}
            ${leftIcon ? "pl-9" : ""}
            ${rightIcon || clearable || isError || isSuccess || (isPasswordType && showPasswordToggle) ? "pr-9" : ""}
            ${className}
          `.trim()}
          {...props}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] p-0.5 rounded cursor-pointer transition-colors"
              aria-label="Xóa nội dung"
              title="Xóa nội dung"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {isPasswordType && showPasswordToggle && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] p-0.5 rounded cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6]"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}

          {isError && (
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" aria-hidden="true" />
          )}

          {isSuccess && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
          )}

          {rightIcon && !isError && !isSuccess && !(isPasswordType && showPasswordToggle) && (
            <span className="text-[#64748B] dark:text-[#94A3B8] flex items-center">{rightIcon}</span>
          )}
        </div>
      </div>

      {isError && (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
          {errorMessage}
        </p>
      )}

      {isSuccess && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
          {successMessage}
        </p>
      )}

      {!isError && !isSuccess && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input
