import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';

/**
 * Select Component
 * Custom select dropdown with search and multi-select support
 */
const Select = forwardRef(({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  searchable = false,
  clearable = false,
  multiple = false,
  size = 'md',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const inputId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  // Size variants
  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3 px-4 text-base',
  };

  // Filter options by search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  // Get selected option(s)
  const getSelectedOptions = () => {
    if (multiple) {
      return options.filter((opt) => value?.includes(opt.value));
    }
    return options.find((opt) => opt.value === value);
  };

  const selectedOptions = getSelectedOptions();

  // Handle option click
  const handleSelect = (option) => {
    if (option.disabled) return;

    if (multiple) {
      const newValue = value?.includes(option.value)
        ? value.filter((v) => v !== option.value)
        : [...(value || []), option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : null);
  };

  // Remove single item in multi-select
  const handleRemoveItem = (e, optionValue) => {
    e.stopPropagation();
    if (multiple) {
      onChange?.(value.filter((v) => v !== optionValue));
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Display value
  const renderValue = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemoveItem(e, opt.value)}
                className="hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      );
    }

    if (!multiple && selectedOptions) {
      return (
        <span className="flex items-center gap-2">
          {selectedOptions.icon && <span className="w-5 h-5">{selectedOptions.icon}</span>}
          {selectedOptions.label}
        </span>
      );
    }

    return <span className="text-gray-400">{placeholder}</span>;
  };

  const hasValue = multiple ? value?.length > 0 : value !== null && value !== undefined;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
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

      {/* Select trigger */}
      <button
        ref={ref}
        type="button"
        id={inputId}
        name={name}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          relative w-full flex items-center justify-between gap-2
          bg-white border rounded-lg text-left
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${sizes[size]}
          ${disabled
            ? 'bg-gray-50 cursor-not-allowed text-gray-500'
            : 'cursor-pointer hover:border-gray-400'
          }
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
        `}
        {...props}
      >
        <div className="flex-1 min-w-0 truncate">{renderValue()}</div>

        <div className="flex items-center gap-1">
          {/* Clear button */}
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Dropdown arrow */}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          role="listbox"
        >
          {/* Search input */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="max-h-60 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = multiple
                  ? value?.includes(option.value)
                  : value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={isSelected}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm
                      transition-colors
                      ${option.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {/* Checkbox for multi-select */}
                    {multiple && (
                      <div
                        className={`
                          w-4 h-4 rounded border flex items-center justify-center
                          ${isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-300'
                          }
                        `}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}

                    {/* Option icon */}
                    {option.icon && (
                      <span className="w-5 h-5 flex-shrink-0">{option.icon}</span>
                    )}

                    {/* Option content */}
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {option.description}
                        </div>
                      )}
                    </div>

                    {/* Check mark for single select */}
                    {!multiple && isSelected && (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Helper text / Error */}
      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/**
 * NativeSelect Component
 * Simple native select element
 */
export const NativeSelect = forwardRef(({
  options = [],
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3 px-4 text-base',
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <select
        ref={ref}
        disabled={disabled}
        required={required}
        className={`
          block w-full rounded-lg border bg-white
          appearance-none cursor-pointer
          pr-10 bg-no-repeat bg-right
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${sizes[size]}
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
        }}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

NativeSelect.displayName = 'NativeSelect';

export default Select;
