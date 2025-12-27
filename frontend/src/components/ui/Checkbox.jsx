import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';

/**
 * Checkbox Component
 * Custom styled checkbox with label support
 */
const Checkbox = forwardRef(({
  label,
  description,
  checked = false,
  indeterminate = false,
  onChange,
  disabled = false,
  error,
  size = 'md',
  className = '',
  id,
  name,
  value,
  ...props
}, ref) => {
  const inputId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Size variants
  const sizes = {
    sm: {
      box: 'w-4 h-4',
      icon: 'w-3 h-3',
      label: 'text-sm',
      description: 'text-xs',
    },
    md: {
      box: 'w-5 h-5',
      icon: 'w-3.5 h-3.5',
      label: 'text-sm',
      description: 'text-sm',
    },
    lg: {
      box: 'w-6 h-6',
      icon: 'w-4 h-4',
      label: 'text-base',
      description: 'text-sm',
    },
  };

  const sizeConfig = sizes[size];
  const isChecked = checked || indeterminate;

  return (
    <div className={`relative flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          aria-describedby={description ? `${inputId}-description` : undefined}
          {...props}
        />

        {/* Custom checkbox */}
        <div
          className={`
            ${sizeConfig.box}
            flex items-center justify-center rounded
            border transition-all duration-150 cursor-pointer
            ${disabled
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
              : isChecked
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-gray-300 hover:border-blue-500'
            }
            ${error ? 'border-red-500' : ''}
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2
          `}
          onClick={() => !disabled && onChange?.({ target: { checked: !checked, name, value } })}
        >
          {checked && <Check className={`${sizeConfig.icon} text-white`} strokeWidth={3} />}
          {indeterminate && !checked && <Minus className={`${sizeConfig.icon} text-white`} strokeWidth={3} />}
        </div>
      </div>

      {/* Label and description */}
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={inputId}
              className={`
                ${sizeConfig.label} font-medium cursor-pointer
                ${disabled ? 'text-gray-400' : 'text-gray-900'}
              `}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${inputId}-description`}
              className={`${sizeConfig.description} text-gray-500 mt-0.5`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

/**
 * CheckboxGroup Component
 * Group of checkboxes
 */
export const CheckboxGroup = ({
  label,
  options = [],
  value = [],
  onChange,
  error,
  helperText,
  disabled = false,
  direction = 'vertical',
  className = '',
  ...props
}) => {
  const handleChange = (optionValue, checked) => {
    if (checked) {
      onChange?.([...value, optionValue]);
    } else {
      onChange?.(value.filter((v) => v !== optionValue));
    }
  };

  return (
    <fieldset className={className} {...props}>
      {label && (
        <legend className="text-sm font-medium text-gray-700 mb-3">
          {label}
        </legend>
      )}

      <div
        className={`
          flex gap-3
          ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
      >
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            description={option.description}
            checked={value.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            disabled={disabled || option.disabled}
            name={option.value}
            value={option.value}
          />
        ))}
      </div>

      {(helperText || error) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </fieldset>
  );
};

/**
 * Radio Component
 * Custom styled radio button
 */
export const Radio = forwardRef(({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  error,
  size = 'md',
  className = '',
  id,
  name,
  value,
  ...props
}, ref) => {
  const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  const sizes = {
    sm: {
      box: 'w-4 h-4',
      dot: 'w-1.5 h-1.5',
      label: 'text-sm',
      description: 'text-xs',
    },
    md: {
      box: 'w-5 h-5',
      dot: 'w-2 h-2',
      label: 'text-sm',
      description: 'text-sm',
    },
    lg: {
      box: 'w-6 h-6',
      dot: 'w-2.5 h-2.5',
      label: 'text-base',
      description: 'text-sm',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`relative flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          aria-describedby={description ? `${inputId}-description` : undefined}
          {...props}
        />

        {/* Custom radio */}
        <div
          className={`
            ${sizeConfig.box}
            flex items-center justify-center rounded-full
            border-2 transition-all duration-150 cursor-pointer
            ${disabled
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
              : checked
                ? 'border-blue-600'
                : 'border-gray-300 hover:border-blue-500'
            }
            ${error ? 'border-red-500' : ''}
            peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2
          `}
          onClick={() => !disabled && onChange?.({ target: { checked: true, name, value } })}
        >
          {checked && (
            <div className={`${sizeConfig.dot} rounded-full bg-blue-600`} />
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={inputId}
              className={`
                ${sizeConfig.label} font-medium cursor-pointer
                ${disabled ? 'text-gray-400' : 'text-gray-900'}
              `}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              id={`${inputId}-description`}
              className={`${sizeConfig.description} text-gray-500 mt-0.5`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

/**
 * RadioGroup Component
 * Group of radio buttons
 */
export const RadioGroup = ({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  direction = 'vertical',
  name,
  className = '',
  ...props
}) => {
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <fieldset className={className} role="radiogroup" {...props}>
      {label && (
        <legend className="text-sm font-medium text-gray-700 mb-3">
          {label}
        </legend>
      )}

      <div
        className={`
          flex gap-3
          ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            description={option.description}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
            disabled={disabled || option.disabled}
            name={groupName}
            value={option.value}
          />
        ))}
      </div>

      {(helperText || error) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </fieldset>
  );
};

/**
 * Switch Component
 * Toggle switch
 */
export const Switch = forwardRef(({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <button
        ref={ref}
        type="button"
        role="switch"
        id={inputId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.({ target: { checked: !checked, name } })}
        className={`
          relative inline-flex flex-shrink-0
          ${sizeConfig.track}
          rounded-full cursor-pointer
          transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        `}
        {...props}
      >
        <span
          className={`
            ${sizeConfig.thumb}
            pointer-events-none inline-block rounded-full bg-white shadow
            transform transition duration-200 ease-in-out
            ${checked ? sizeConfig.translate : 'translate-x-0.5'}
          `}
          style={{ marginTop: '0.5px' }}
        />
      </button>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label
              htmlFor={inputId}
              className={`text-sm font-medium cursor-pointer ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export default Checkbox;
