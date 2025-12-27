import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * A versatile button component with multiple variants, sizes, and states
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  // Size variants
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2',
    xl: 'px-6 py-3.5 text-base gap-2.5',
  };

  // Variant styles
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-sm hover:shadow',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm hover:shadow',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-500 shadow-sm hover:shadow',
    info: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 focus:ring-sky-500 shadow-sm hover:shadow',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500 bg-transparent',
    'outline-secondary': 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500 bg-transparent',
    'outline-danger': 'border-2 border-red-600 text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500 bg-transparent',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500 bg-transparent',
    'ghost-primary': 'text-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500 bg-transparent',
    'ghost-danger': 'text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500 bg-transparent',
    link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500 bg-transparent p-0',
    dark: 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 focus:ring-gray-500 shadow-sm hover:shadow',
  };

  // Icon sizes
  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-5 h-5',
  };

  const classes = `
    ${baseStyles}
    ${sizes[size]}
    ${variants[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : leftIcon ? (
        <span className={iconSizes[size]}>{leftIcon}</span>
      ) : null}

      {children}

      {!loading && rightIcon && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * IconButton Component
 * A circular button for icon-only actions
 */
export const IconButton = forwardRef(({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  ...props
}, ref) => {
  const sizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      className={`${sizes[size]} rounded-full ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <span className={iconSizes[size]}>{icon}</span>
    </Button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * ButtonGroup Component
 * Groups multiple buttons together
 */
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-lg shadow-sm ${className}`} role="group">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        return React.cloneElement(child, {
          className: `
            ${child.props.className || ''}
            ${!isFirst ? '-ml-px' : ''}
            ${isFirst ? 'rounded-r-none' : isLast ? 'rounded-l-none' : 'rounded-none'}
          `.trim(),
        });
      })}
    </div>
  );
};

export default Button;
