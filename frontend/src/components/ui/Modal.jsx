import React, { useEffect, useRef, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import Button from './Button';

/**
 * Modal Component
 * A versatile modal dialog with animations and accessibility features
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
  overlayClassName = '',
  preventScroll = true,
  centered = true,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Size variants
  const sizes = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose?.();
    }
  }, [closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose?.();
    }
  };

  // Focus management and scroll lock
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();

      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        if (preventScroll) {
          document.body.style.overflow = '';
        }
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, handleEscape, preventScroll]);

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 overflow-y-auto
        animate-in fade-in duration-200
      `}
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-200
          ${overlayClassName}
        `}
        onClick={handleOverlayClick}
      />

      {/* Modal container */}
      <div
        className={`
          flex min-h-full
          ${centered ? 'items-center' : 'items-start pt-20'}
          justify-center p-4
        `}
        onClick={handleOverlayClick}
      >
        {/* Modal content */}
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`
            relative w-full ${sizes[size]}
            bg-white rounded-2xl shadow-2xl
            transform transition-all duration-200
            animate-in zoom-in-95 slide-in-from-bottom-4
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 pb-0">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -m-2 ml-4 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ConfirmModal Component
 * Pre-configured modal for confirmation dialogs
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
  ...props
}) => {
  const variants = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      buttonVariant: 'danger',
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
      buttonVariant: 'warning',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      buttonVariant: 'primary',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      buttonVariant: 'success',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      {...props}
    >
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full ${config.iconBg} mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <div className="flex gap-3 mt-6">
        <Button
          variant="secondary"
          fullWidth
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={config.buttonVariant}
          fullWidth
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

/**
 * AlertModal Component
 * Pre-configured modal for alert messages
 */
export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  variant = 'info',
  ...props
}) => {
  const variants = {
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      {...props}
    >
      <div className="text-center">
        <div className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full ${config.iconBg} mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
      <Button
        variant="primary"
        fullWidth
        className="mt-6"
        onClick={onClose}
      >
        {buttonText}
      </Button>
    </Modal>
  );
};

/**
 * FormModal Component
 * Modal wrapper optimized for forms
 */
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  loading = false,
  size = 'md',
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size={size}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            form="modal-form"
          >
            {submitText}
          </Button>
        </>
      }
      {...props}
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

/**
 * ImageModal Component
 * Modal for displaying images
 */
export const ImageModal = ({
  isOpen,
  onClose,
  src,
  alt,
  caption,
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      className="bg-black"
      {...props}
    >
      <div className="flex flex-col items-center">
        <img
          src={src}
          alt={alt}
          className="max-h-[70vh] object-contain rounded-lg"
        />
        {caption && (
          <p className="mt-4 text-center text-white/80">{caption}</p>
        )}
      </div>
    </Modal>
  );
};

export default Modal;
