import React, { useState, useRef, useEffect, cloneElement } from 'react';
import { X } from 'lucide-react';

/**
 * Popover Component
 * Floating content panel
 */
const Popover = ({
  children,
  trigger,
  content,
  title,
  position = 'bottom',
  align = 'center',
  showArrow = true,
  showCloseButton = false,
  closeOnClickOutside = true,
  closeOnEscape = true,
  triggerOn = 'click',
  offset = 8,
  isOpen: controlledOpen,
  onOpenChange,
  className = '',
  contentClassName = '',
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (value) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  // Position calculations
  const getPositionStyles = () => {
    const positions = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2',
    };

    const alignments = {
      start: {
        horizontal: 'left-0',
        vertical: 'top-0',
      },
      center: {
        horizontal: 'left-1/2 -translate-x-1/2',
        vertical: 'top-1/2 -translate-y-1/2',
      },
      end: {
        horizontal: 'right-0',
        vertical: 'bottom-0',
      },
    };

    const isHorizontal = position === 'left' || position === 'right';
    const alignKey = isHorizontal ? 'vertical' : 'horizontal';

    return `${positions[position]} ${alignments[align][alignKey]}`;
  };

  // Arrow styles
  const getArrowStyles = () => {
    const arrows = {
      top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
      bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
      left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
      right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
    };

    return arrows[position];
  };

  // Close on outside click
  useEffect(() => {
    if (!closeOnClickOutside) return;

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeOnClickOutside]);

  // Close on escape
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape]);

  // Trigger events
  const triggerProps = {
    ref: triggerRef,
    'aria-expanded': isOpen,
    'aria-haspopup': 'dialog',
  };

  if (triggerOn === 'click') {
    triggerProps.onClick = (e) => {
      setIsOpen(!isOpen);
      trigger.props.onClick?.(e);
    };
  } else if (triggerOn === 'hover') {
    triggerProps.onMouseEnter = () => setIsOpen(true);
    triggerProps.onMouseLeave = () => setIsOpen(false);
  }

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {cloneElement(trigger, triggerProps)}

      {isOpen && (
        <div
          ref={popoverRef}
          className={`
            absolute z-50
            ${getPositionStyles()}
          `}
          onMouseEnter={triggerOn === 'hover' ? () => setIsOpen(true) : undefined}
          onMouseLeave={triggerOn === 'hover' ? () => setIsOpen(false) : undefined}
        >
          {/* Popover content */}
          <div
            className={`
              bg-white rounded-xl shadow-lg border border-gray-200
              animate-in fade-in zoom-in-95 duration-150
              ${contentClassName}
            `}
            role="dialog"
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                {title && (
                  <h3 className="font-medium text-gray-900">{title}</h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 -m-1 ml-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className={title || showCloseButton ? '' : ''}>
              {typeof content === 'function' ? content({ close: () => setIsOpen(false) }) : content}
            </div>

            {children}
          </div>

          {/* Arrow */}
          {showArrow && (
            <div
              className={`
                absolute w-0 h-0
                border-8 border-white
                ${getArrowStyles()}
              `}
            />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * PopoverTrigger Component
 * Explicit trigger component
 */
export const PopoverTrigger = React.forwardRef(({ children, ...props }, ref) => {
  return cloneElement(children, { ref, ...props });
});

PopoverTrigger.displayName = 'PopoverTrigger';

/**
 * PopoverContent Component
 * Popover body content
 */
export const PopoverContent = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * PopoverFooter Component
 * Popover footer with actions
 */
export const PopoverFooter = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl flex items-center justify-end gap-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * HoverCard Component
 * Popover that opens on hover
 */
export const HoverCard = ({
  children,
  trigger,
  delay = 200,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const popoverRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {trigger}

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 top-full mt-2 left-1/2 -translate-x-1/2"
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-in fade-in zoom-in-95 duration-150">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * InfoPopover Component
 * Information icon with popover
 */
export const InfoPopover = ({
  content,
  title,
  size = 'sm',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <Popover
      trigger={
        <button
          type="button"
          className={`inline-flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none ${className}`}
        >
          <svg
            className={sizes[size]}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      }
      content={<PopoverContent>{content}</PopoverContent>}
      title={title}
      position="top"
      {...props}
    />
  );
};

/**
 * ConfirmPopover Component
 * Confirmation popover with actions
 */
export const ConfirmPopover = ({
  trigger,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
  ...props
}) => {
  const variants = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  return (
    <Popover
      trigger={trigger}
      title={title}
      showCloseButton
      content={({ close }) => (
        <>
          {message && (
            <PopoverContent>
              <p className="text-sm text-gray-600">{message}</p>
            </PopoverContent>
          )}
          <PopoverFooter>
            <button
              onClick={() => {
                onCancel?.();
                close();
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm?.();
                close();
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${variants[variant]}`}
            >
              {confirmText}
            </button>
          </PopoverFooter>
        </>
      )}
      {...props}
    />
  );
};

export default Popover;
