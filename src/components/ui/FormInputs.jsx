import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'

export const Input = forwardRef(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      onClear,
      error,
      disabled = false,
      icon: Icon,
      className = '',
      label,
      helperText,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const baseClass = `w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-0 transition ${
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
    } ${disabled ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : 'bg-white'} ${className}`

    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            {label}
            {props.required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${baseClass} ${Icon ? 'pl-12' : ''} ${
              type === 'password' ? 'pr-12' : ''
            } ${value && onClear ? 'pr-12' : ''}`}
            placeholder={placeholder}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          {value && onClear && type !== 'password' && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-neutral-500 text-sm mt-1">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const TextArea = forwardRef(
  (
    {
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      rows = 4,
      maxLength,
      label,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClass = `w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
    } ${disabled ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : 'bg-white'} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            {label}
            {props.required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={baseClass}
          placeholder={placeholder}
          {...props}
        />
        <div className="flex justify-between items-start mt-1">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {helperText && !error && <p className="text-neutral-500 text-sm">{helperText}</p>}
          {maxLength && (
            <p className="text-neutral-500 text-xs ml-auto">
              {value?.length || 0}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export const Select = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      error,
      disabled = false,
      placeholder,
      label,
      helperText,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClass = `w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
      error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
    } ${disabled ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed' : 'bg-white'}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-800 mb-2">
            {label}
            {props.required && <span className="text-red-600"> *</span>}
          </label>
        )}
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClass} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && <p className="text-neutral-500 text-sm mt-1">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export const Checkbox = forwardRef(
  (
    { checked, onChange, label, error, disabled = false, className = '', ...props },
    ref
  ) => (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-5 h-5 rounded border-2 ${
          error ? 'border-red-500' : 'border-neutral-300'
        } accent-green-600 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''}`}
        {...props}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  )
)

Checkbox.displayName = 'Checkbox'

export const Radio = forwardRef(
  (
    { checked, onChange, label, error, disabled = false, name, value, className = '', ...props },
    ref
  ) => (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        ref={ref}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`w-5 h-5 rounded-full border-2 ${
          error ? 'border-red-500' : 'border-neutral-300'
        } accent-green-600 cursor-pointer`}
        {...props}
      />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  )
)

Radio.displayName = 'Radio'

export const Toggle = forwardRef(
  (
    { checked, onChange, label, disabled = false, className = '', ...props },
    ref
  ) => (
    <label
      className={`flex items-center gap-3 cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
        {...props}
      />
      <div className="relative w-14 h-8 bg-neutral-300 rounded-full peer-checked:bg-green-600 transition after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition peer-checked:after:translate-x-6" />
      {label && <span className="text-sm font-medium">{label}</span>}
    </label>
  )
)

Toggle.displayName = 'Toggle'

export default {
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  Toggle
}
