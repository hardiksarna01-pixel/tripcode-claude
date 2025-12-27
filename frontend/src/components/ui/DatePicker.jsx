import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * DatePicker Component
 * Custom date picker with calendar dropdown
 */
const DatePicker = forwardRef(({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  helperText,
  disabled = false,
  required = false,
  clearable = true,
  minDate,
  maxDate,
  format = 'YYYY-MM-DD',
  size = 'md',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);

  const inputId = id || name || `datepicker-${Math.random().toString(36).substr(2, 9)}`;

  // Size variants
  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2.5 px-4 text-sm',
    lg: 'py-3 px-4 text-base',
  };

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD-MM-YYYY':
        return `${day}-${month}-${year}`;
      case 'YYYY-MM-DD':
      default:
        return `${year}-${month}-${day}`;
    }
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];
    onChange?.(dateString);
    setIsOpen(false);
  };

  // Handle month navigation
  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  // Check if date is disabled
  const isDateDisabled = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  // Check if date is selected
  const isDateSelected = (day) => {
    if (!value) return false;
    const selected = new Date(value);
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isDisabled = isDateDisabled(day);
      const isSelected = isDateSelected(day);
      const isTodayDate = isToday(day);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
          className={`
            h-9 w-9 rounded-full text-sm font-medium
            transition-colors duration-150
            ${isDisabled
              ? 'text-gray-300 cursor-not-allowed'
              : isSelected
                ? 'bg-blue-600 text-white'
                : isTodayDate
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  // Clear value
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
  };

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

      {/* Input trigger */}
      <button
        ref={ref}
        type="button"
        id={inputId}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full flex items-center gap-2
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
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value ? formatDate(value) : placeholder}
        </span>

        {/* Clear button */}
        {clearable && value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            aria-label="Clear date"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72">
          {/* Month/Year header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="h-9 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays()}
          </div>

          {/* Today button */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setCurrentMonth(new Date());
                handleDateSelect(new Date().getDate());
              }}
              className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
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

DatePicker.displayName = 'DatePicker';

/**
 * DateRangePicker Component
 * Select date range
 */
export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  error,
  helperText,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <DatePicker
          value={startDate}
          onChange={onStartDateChange}
          placeholder="Start date"
          maxDate={endDate}
          disabled={disabled}
          className="flex-1"
          {...props}
        />
        <span className="text-gray-400">to</span>
        <DatePicker
          value={endDate}
          onChange={onEndDateChange}
          placeholder="End date"
          minDate={startDate}
          disabled={disabled}
          className="flex-1"
          {...props}
        />
      </div>

      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

/**
 * TimePicker Component
 * Simple time picker
 */
export const TimePicker = forwardRef(({
  value,
  onChange,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  use24Hour = false,
  minuteStep = 15,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type="time"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        step={minuteStep * 60}
        className={`
          block w-full rounded-lg border px-4 py-2.5 text-sm
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
        `}
        {...props}
      />

      {(helperText || error) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

TimePicker.displayName = 'TimePicker';

export default DatePicker;
