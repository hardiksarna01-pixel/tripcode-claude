import React, { useState, useRef, useEffect, cloneElement } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Dropdown Component
 * Dropdown menu with items
 */
const Dropdown = ({
  children,
  trigger,
  align = 'left',
  position = 'bottom',
  className = '',
  menuClassName = '',
  closeOnSelect = true,
  disabled = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Alignment styles
  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  // Position styles
  const positions = {
    bottom: 'top-full mt-1',
    top: 'bottom-full mb-1',
    'bottom-start': 'top-full mt-1 left-0',
    'bottom-end': 'top-full mt-1 right-0',
    'top-start': 'bottom-full mb-1 left-0',
    'top-end': 'bottom-full mb-1 right-0',
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleItemClick = (callback) => {
    if (closeOnSelect) {
      setIsOpen(false);
    }
    callback?.();
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`} {...props}>
      {/* Trigger */}
      {cloneElement(trigger, {
        onClick: (e) => {
          if (!disabled) {
            setIsOpen(!isOpen);
            trigger.props.onClick?.(e);
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': isOpen,
      })}

      {/* Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 min-w-48 py-1
            bg-white rounded-lg shadow-lg border border-gray-200
            animate-in fade-in zoom-in-95 duration-150
            ${alignments[align]}
            ${positions[position]}
            ${menuClassName}
          `}
          role="menu"
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;

            if (child.type === DropdownItem || child.type === DropdownCheckboxItem) {
              return cloneElement(child, {
                onClick: () => handleItemClick(child.props.onClick),
              });
            }

            return child;
          })}
        </div>
      )}
    </div>
  );
};

/**
 * DropdownItem Component
 * Individual menu item
 */
export const DropdownItem = ({
  children,
  icon,
  shortcut,
  disabled = false,
  danger = false,
  onClick,
  href,
  className = '',
  ...props
}) => {
  const baseClasses = `
    w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
    transition-colors duration-150
    ${disabled
      ? 'text-gray-400 cursor-not-allowed'
      : danger
        ? 'text-red-600 hover:bg-red-50'
        : 'text-gray-700 hover:bg-gray-50'
    }
    ${className}
  `;

  const content = (
    <>
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      {shortcut && (
        <span className="text-xs text-gray-400 font-mono">{shortcut}</span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        role="menuitem"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      role="menuitem"
      {...props}
    >
      {content}
    </button>
  );
};

/**
 * DropdownCheckboxItem Component
 * Checkbox menu item
 */
export const DropdownCheckboxItem = ({
  children,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      className={`
        w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left
        transition-colors duration-150
        ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}
        ${className}
      `}
      role="menuitemcheckbox"
      aria-checked={checked}
      {...props}
    >
      <div
        className={`
          w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
          ${checked
            ? 'bg-blue-600 border-blue-600'
            : 'border-gray-300'
          }
        `}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span className="flex-1">{children}</span>
    </button>
  );
};

/**
 * DropdownDivider Component
 * Separator between items
 */
export const DropdownDivider = ({ className = '' }) => (
  <hr className={`my-1 border-gray-100 ${className}`} />
);

/**
 * DropdownLabel Component
 * Section label
 */
export const DropdownLabel = ({ children, className = '' }) => (
  <div className={`px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </div>
);

/**
 * DropdownGroup Component
 * Group of items
 */
export const DropdownGroup = ({ children, label, className = '' }) => (
  <div className={className} role="group" aria-label={label}>
    {label && <DropdownLabel>{label}</DropdownLabel>}
    {children}
  </div>
);

/**
 * ContextMenu Component
 * Right-click context menu
 */
export const ContextMenu = ({
  children,
  items,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleContextMenu = (e) => {
    if (disabled) return;
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div onContextMenu={handleContextMenu} className={className} {...props}>
      {children}

      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-48 py-1 bg-white rounded-lg shadow-lg border border-gray-200"
          style={{
            left: position.x,
            top: position.y,
          }}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.type === 'divider') {
              return <DropdownDivider key={index} />;
            }
            if (item.type === 'label') {
              return <DropdownLabel key={index}>{item.label}</DropdownLabel>;
            }
            return (
              <DropdownItem
                key={index}
                icon={item.icon}
                danger={item.danger}
                disabled={item.disabled}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick?.();
                }}
              >
                {item.label}
              </DropdownItem>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * MenuButton Component
 * Button with dropdown menu
 */
export const MenuButton = ({
  children,
  label,
  variant = 'secondary',
  size = 'md',
  icon,
  items = [],
  ...props
}) => {
  // Button styles
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <Dropdown
      trigger={
        <button
          className={`
            inline-flex items-center gap-2 rounded-lg font-medium
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${variants[variant]}
            ${sizes[size]}
          `}
        >
          {icon && <span className="w-4 h-4">{icon}</span>}
          {label}
          <ChevronDown className="w-4 h-4" />
        </button>
      }
      {...props}
    >
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <DropdownDivider key={index} />;
        }
        return (
          <DropdownItem
            key={index}
            icon={item.icon}
            danger={item.danger}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.label}
          </DropdownItem>
        );
      })}
      {children}
    </Dropdown>
  );
};

export default Dropdown;
