import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, X } from 'lucide-react';

/**
 * Input Component
 * A versatile input component with validation states, icons, and helper text
 */
const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  helperText,
  disabled = false,
  required = false,
  readOnly = false,
  size = 'md',
  leftIcon,
  rightIcon,
  clearable = false,
  className = '',
  inputClassName = '',
  id,
  name,
  autoComplete,
  autoFocus,
  maxLength,
  minLength,
  pattern,
  min,
  max,
  step,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';

  // Size variants
  const sizes = {
    sm: {
      wrapper: 'h-9',
      input: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      iconPadding: leftIcon ? 'pl-9' : '',
    },
    md: {
      wrapper: 'h-11',
      input: 'px-4 py-2.5 text-sm',
      icon: 'w-5 h-5',
      iconPadding: leftIcon ? 'pl-11' : '',
    },
    lg: {
      wrapper: 'h-12',
      input: 'px-4 py-3 text-base',
      icon: 'w-5 h-5',
      iconPadding: leftIcon ? 'pl-12' : '',
    },
  };

  // State styles
  const getStateStyles = () => {
    if (error) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500 text-gray-900';
    }
    if (success) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500 text-gray-900';
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900';
  };

  const handleClear = () => {
    const event = { target: { value: '', name } };
    onChange?.(event);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const hasRightElement = clearable || isPassword || rightIcon || error || success;
  const rightPadding = hasRightElement ? 'pr-10' : '';

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className={`${sizes[size].icon} text-gray-400`}>
              {leftIcon}
            </span>
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          min={min}
          max={max}
          step={step}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          className={`
            block w-full rounded-lg border transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            read-only:bg-gray-50 read-only:cursor-default
            placeholder:text-gray-400
            ${sizes[size].input}
            ${sizes[size].iconPadding}
            ${rightPadding}
            ${getStateStyles()}
            ${inputClassName}
          `}
          {...props}
        />

        {/* Right icons container */}
        {hasRightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
            {/* Clear button */}
            {clearable && value && !disabled && !readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Password toggle */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Status icons */}
            {error && !isPassword && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {success && !error && !isPassword && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}

            {/* Custom right icon */}
            {rightIcon && !error && !success && !isPassword && (
              <span className={`${sizes[size].icon} text-gray-400`}>
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Helper text / Error message */}
      {(helperText || error) && (
        <p
          id={`${inputId}-helper`}
          className={`mt-1.5 text-sm ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * SearchInput Component
 * A specialized search input with search icon
 */
export const SearchInput = forwardRef(({
  placeholder = 'Search...',
  onSearch,
  ...props
}, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      leftIcon={<Search />}
      clearable
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

/**
 * TextArea Component
 * Multi-line text input
 */
export const TextArea = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  readOnly = false,
  rows = 4,
  resize = 'vertical',
  className = '',
  textareaClassName = '',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const getStateStyles = () => {
    if (error) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    }
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText ? `${inputId}-helper` : undefined}
        className={`
          block w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          placeholder:text-gray-400
          ${resizeClasses[resize]}
          ${getStateStyles()}
          ${textareaClassName}
        `}
        {...props}
      />

      {(helperText || error) && (
        <p
          id={`${inputId}-helper`}
          className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default Input;
