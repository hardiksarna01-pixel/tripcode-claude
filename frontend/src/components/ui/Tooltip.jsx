import React, { useState, useRef, useEffect, cloneElement } from 'react';

/**
 * Tooltip Component
 * Informational popup on hover/focus
 */
const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  arrow = true,
  maxWidth = 250,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Position calculations
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top, left;

    switch (position) {
      case 'top':
        top = trigger.top + scrollY - tooltip.height - 8;
        left = trigger.left + scrollX + trigger.width / 2 - tooltip.width / 2;
        break;
      case 'bottom':
        top = trigger.bottom + scrollY + 8;
        left = trigger.left + scrollX + trigger.width / 2 - tooltip.width / 2;
        break;
      case 'left':
        top = trigger.top + scrollY + trigger.height / 2 - tooltip.height / 2;
        left = trigger.left + scrollX - tooltip.width - 8;
        break;
      case 'right':
        top = trigger.top + scrollY + trigger.height / 2 - tooltip.height / 2;
        left = trigger.right + scrollX + 8;
        break;
      default:
        top = trigger.top + scrollY - tooltip.height - 8;
        left = trigger.left + scrollX + trigger.width / 2 - tooltip.width / 2;
    }

    // Keep tooltip within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltip.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltip.width - padding;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);

      return () => {
        window.removeEventListener('scroll', calculatePosition);
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isVisible]);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Arrow position styles
  const arrowStyles = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-r-transparent',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-l-transparent',
  };

  if (!content) {
    return children;
  }

  return (
    <>
      {/* Trigger element */}
      {cloneElement(children, {
        ref: triggerRef,
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip,
        'aria-describedby': isVisible ? 'tooltip' : undefined,
      })}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={`
            fixed z-50 px-3 py-2
            text-sm text-white bg-gray-900 rounded-lg shadow-lg
            animate-in fade-in zoom-in-95 duration-150
            ${className}
          `}
          style={{
            top: coords.top,
            left: coords.left,
            maxWidth,
          }}
          {...props}
        >
          {content}

          {/* Arrow */}
          {arrow && (
            <div
              className={`
                absolute w-0 h-0
                border-4 border-gray-900
                ${arrowStyles[position]}
              `}
            />
          )}
        </div>
      )}
    </>
  );
};

/**
 * TooltipTrigger Component
 * Wrapper for tooltip trigger element
 */
export const TooltipTrigger = React.forwardRef(({ children, ...props }, ref) => {
  return cloneElement(children, { ref, ...props });
});

TooltipTrigger.displayName = 'TooltipTrigger';

/**
 * InfoTooltip Component
 * Information icon with tooltip
 */
export const InfoTooltip = ({
  content,
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
    <Tooltip content={content} {...props}>
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
    </Tooltip>
  );
};

/**
 * HelpText Component
 * Text label with tooltip help
 */
export const HelpText = ({
  children,
  help,
  className = '',
  ...props
}) => {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {children}
      <InfoTooltip content={help} {...props} />
    </span>
  );
};

export default Tooltip;
