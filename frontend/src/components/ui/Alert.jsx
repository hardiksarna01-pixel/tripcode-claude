import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X, ChevronRight } from 'lucide-react';

/**
 * Alert Component
 * Contextual feedback messages for user actions
 */
const Alert = ({
  variant = 'info',
  title,
  children,
  icon,
  closable = false,
  onClose,
  action,
  actionLabel,
  onAction,
  bordered = true,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Variant configurations
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800',
      textColor: 'text-blue-700',
      actionColor: 'text-blue-700 hover:text-blue-800',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
      textColor: 'text-green-700',
      actionColor: 'text-green-700 hover:text-green-800',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-800',
      textColor: 'text-amber-700',
      actionColor: 'text-amber-700 hover:text-amber-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
      textColor: 'text-red-700',
      actionColor: 'text-red-700 hover:text-red-800',
    },
    neutral: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: Info,
      iconColor: 'text-gray-500',
      titleColor: 'text-gray-800',
      textColor: 'text-gray-700',
      actionColor: 'text-gray-700 hover:text-gray-800',
    },
  };

  const config = variants[variant] || variants.info;
  const Icon = icon || config.icon;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className={`
        rounded-lg p-4 ${config.bg}
        ${bordered ? `border ${config.border}` : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex">
        {/* Icon */}
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />

        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </h3>
          )}
          {children && (
            <div className={`${title ? 'mt-1' : ''} text-sm ${config.textColor}`}>
              {children}
            </div>
          )}

          {/* Action */}
          {(action || (actionLabel && onAction)) && (
            <div className="mt-3">
              <button
                onClick={onAction}
                className={`text-sm font-medium ${config.actionColor} inline-flex items-center gap-1`}
              >
                {action || actionLabel}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Close button */}
        {closable && (
          <button
            onClick={handleClose}
            className={`ml-3 flex-shrink-0 p-1 -m-1 rounded-lg ${config.textColor} hover:bg-black/5 transition-colors`}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * AlertTitle Component
 * Title for alert content
 */
export const AlertTitle = ({ children, className = '' }) => (
  <h3 className={`text-sm font-medium ${className}`}>{children}</h3>
);

/**
 * AlertDescription Component
 * Description text for alerts
 */
export const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

/**
 * Banner Component
 * Full-width alert banner for important messages
 */
export const Banner = ({
  variant = 'info',
  children,
  closable = false,
  onClose,
  action,
  actionLabel,
  onAction,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-600 text-white',
    neutral: 'bg-gray-800 text-white',
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      role="alert"
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-1">
            <p className="text-sm font-medium">{children}</p>
          </div>

          <div className="flex items-center gap-3">
            {(action || (actionLabel && onAction)) && (
              <button
                onClick={onAction}
                className="text-sm font-medium underline hover:no-underline"
              >
                {action || actionLabel}
              </button>
            )}

            {closable && (
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Callout Component
 * Highlighted content block with icon
 */
export const Callout = ({
  variant = 'info',
  title,
  children,
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      icon: Info,
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      titleColor: 'text-green-900',
      textColor: 'text-green-800',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-l-4 border-amber-500',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-500',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      titleColor: 'text-red-900',
      textColor: 'text-red-800',
    },
    tip: {
      bg: 'bg-purple-50',
      border: 'border-l-4 border-purple-500',
      icon: Info,
      iconColor: 'text-purple-500',
      titleColor: 'text-purple-900',
      textColor: 'text-purple-800',
    },
  };

  const config = variants[variant] || variants.info;
  const Icon = icon || config.icon;

  return (
    <div
      className={`${config.bg} ${config.border} rounded-r-lg p-4 ${className}`}
      {...props}
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
        <div>
          {title && (
            <h4 className={`font-medium ${config.titleColor} mb-1`}>{title}</h4>
          )}
          <div className={`text-sm ${config.textColor}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * InlineAlert Component
 * Compact inline alert for form fields
 */
export const InlineAlert = ({
  variant = 'error',
  children,
  className = '',
  ...props
}) => {
  const variants = {
    error: 'text-red-600',
    warning: 'text-amber-600',
    success: 'text-green-600',
    info: 'text-blue-600',
  };

  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <p
      role="alert"
      className={`flex items-center gap-1.5 text-sm ${variants[variant]} ${className}`}
      {...props}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {children}
    </p>
  );
};

export default Alert;
