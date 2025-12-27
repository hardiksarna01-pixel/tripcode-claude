import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';

// Toast Context
const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  info: () => {},
  loading: () => {},
  promise: () => {},
});

export const useToast = () => useContext(ToastContext);

/**
 * ToastProvider Component
 * Context provider for toast notifications
 */
export const ToastProvider = ({
  children,
  position = 'top-right',
  maxToasts = 5,
  defaultDuration = 5000,
}) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = toast.id || `toast-${Date.now()}-${Math.random()}`;
    const duration = toast.duration ?? defaultDuration;

    setToasts((prev) => {
      const newToasts = [...prev, { ...toast, id }];
      // Limit number of toasts
      if (newToasts.length > maxToasts) {
        return newToasts.slice(-maxToasts);
      }
      return newToasts;
    });

    // Auto-remove after duration (unless persistent)
    if (duration > 0 && !toast.persistent) {
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [defaultDuration, maxToasts, removeToast]);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, duration: 8000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const loading = useCallback((message, options = {}) => {
    return addToast({ type: 'loading', message, persistent: true, ...options });
  }, [addToast]);

  const promise = useCallback(async (promiseFn, messages, options = {}) => {
    const id = loading(messages.loading || 'Loading...', options);

    try {
      const result = await promiseFn;
      removeToast(id);
      success(messages.success || 'Success!', options);
      return result;
    } catch (err) {
      removeToast(id);
      error(messages.error || 'Something went wrong', options);
      throw err;
    }
  }, [loading, success, error, removeToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        loading,
        promise,
      }}
    >
      {children}
      <ToastContainer position={position} />
    </ToastContext.Provider>
  );
};

/**
 * ToastContainer Component
 * Container for displaying toasts
 */
const ToastContainer = ({ position = 'top-right' }) => {
  const { toasts, removeToast } = useToast();

  // Position styles
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-[100] ${positions[position]} flex flex-col gap-3 pointer-events-none`}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Toast Component
 * Individual toast notification
 */
const Toast = ({
  id,
  type = 'info',
  message,
  title,
  description,
  action,
  actionLabel,
  onAction,
  onClose,
  closable = true,
  className = '',
  ...props
}) => {
  // Type configurations
  const types = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    loading: {
      icon: Loader2,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      animate: true,
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        pointer-events-auto
        flex items-start gap-3 w-full max-w-sm p-4
        bg-white rounded-xl shadow-lg border ${config.borderColor}
        animate-in slide-in-from-right-full duration-300
        ${className}
      `}
      role="alert"
      {...props}
    >
      {/* Icon */}
      <Icon
        className={`w-5 h-5 flex-shrink-0 ${config.iconColor} ${config.animate ? 'animate-spin' : ''}`}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-medium text-gray-900">{title}</p>
        )}
        <p className={`text-sm ${title ? 'text-gray-600 mt-0.5' : 'text-gray-900'}`}>
          {message || description}
        </p>

        {/* Action button */}
        {(action || (actionLabel && onAction)) && (
          <button
            onClick={onAction}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {action || actionLabel}
          </button>
        )}
      </div>

      {/* Close button */}
      {closable && type !== 'loading' && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 -m-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

/**
 * Standalone toast function
 * For use outside of React components
 */
let toastFunctions = null;

export const setToastFunctions = (functions) => {
  toastFunctions = functions;
};

export const toast = {
  success: (message, options) => toastFunctions?.success(message, options),
  error: (message, options) => toastFunctions?.error(message, options),
  warning: (message, options) => toastFunctions?.warning(message, options),
  info: (message, options) => toastFunctions?.info(message, options),
  loading: (message, options) => toastFunctions?.loading(message, options),
  promise: (promise, messages, options) => toastFunctions?.promise(promise, messages, options),
  dismiss: (id) => toastFunctions?.removeToast(id),
};

export default Toast;
