import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Drawer Component
 * Slide-in panel from edge of screen
 */
const Drawer = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  position = 'right',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
  overlayClassName = '',
  preventScroll = true,
  ...props
}) => {
  const drawerRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Size configurations
  const sizes = {
    xs: 'w-64',
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
    xl: 'w-[640px]',
    full: 'w-full',
  };

  // Position styles
  const positions = {
    left: {
      container: 'left-0 inset-y-0',
      enter: '-translate-x-full',
      leave: 'translate-x-0',
    },
    right: {
      container: 'right-0 inset-y-0',
      enter: 'translate-x-full',
      leave: 'translate-x-0',
    },
    top: {
      container: 'top-0 inset-x-0',
      enter: '-translate-y-full',
      leave: 'translate-y-0',
      size: 'h-auto max-h-[80vh]',
    },
    bottom: {
      container: 'bottom-0 inset-x-0',
      enter: 'translate-y-full',
      leave: 'translate-y-0',
      size: 'h-auto max-h-[80vh]',
    },
  };

  const posConfig = positions[position];
  const isHorizontal = position === 'left' || position === 'right';

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
      drawerRef.current?.focus();

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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
          ${overlayClassName}
        `}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer container */}
      <div
        className={`
          fixed ${posConfig.container}
          ${isHorizontal ? 'flex' : ''}
        `}
      >
        {/* Drawer panel */}
        <div
          ref={drawerRef}
          tabIndex={-1}
          className={`
            relative flex flex-col
            ${isHorizontal ? `h-full ${sizes[size]}` : `w-full ${posConfig.size || ''}`}
            bg-white shadow-2xl
            transform transition-transform duration-300 ease-out
            ${isOpen ? posConfig.leave : posConfig.enter}
            ${className}
          `}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                {title && (
                  <h2
                    id="drawer-title"
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
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Sheet Component
 * Alias for Drawer with bottom position
 */
export const Sheet = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  ...props
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="bottom"
      size="full"
      title={title}
      className={`rounded-t-2xl ${className}`}
      {...props}
    >
      {children}
    </Drawer>
  );
};

/**
 * SlideOver Component
 * Right-side drawer variant
 */
export const SlideOver = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  footer,
  size = 'md',
  ...props
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      title={title}
      subtitle={subtitle}
      footer={footer}
      size={size}
      {...props}
    >
      {children}
    </Drawer>
  );
};

export default Drawer;
