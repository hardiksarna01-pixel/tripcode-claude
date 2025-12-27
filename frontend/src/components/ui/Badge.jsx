import React from 'react';

/**
 * Badge Component
 * A versatile badge/tag component for status indicators and labels
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  dot = false,
  dotColor,
  removable = false,
  onRemove,
  icon,
  className = '',
  ...props
}) => {
  // Size variants
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  // Variant styles
  const variants = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-sky-100 text-sky-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    // Solid variants
    'primary-solid': 'bg-blue-600 text-white',
    'secondary-solid': 'bg-gray-600 text-white',
    'success-solid': 'bg-green-600 text-white',
    'danger-solid': 'bg-red-600 text-white',
    'warning-solid': 'bg-amber-500 text-white',
    'info-solid': 'bg-sky-500 text-white',
    // Outline variants
    'primary-outline': 'border border-blue-500 text-blue-600 bg-transparent',
    'secondary-outline': 'border border-gray-400 text-gray-600 bg-transparent',
    'success-outline': 'border border-green-500 text-green-600 bg-transparent',
    'danger-outline': 'border border-red-500 text-red-600 bg-transparent',
    'warning-outline': 'border border-amber-500 text-amber-600 bg-transparent',
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Dot color styles
  const dotColors = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    busy: 'bg-red-400',
    away: 'bg-amber-400',
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${sizes[size]}
        ${variants[variant]}
        ${roundedStyles[rounded]}
        ${className}
      `}
      {...props}
    >
      {/* Status dot */}
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full mr-1.5
            ${dotColors[dotColor || 'primary']}
          `}
        />
      )}

      {/* Icon */}
      {icon && (
        <span className="mr-1 -ml-0.5">{icon}</span>
      )}

      {/* Content */}
      {children}

      {/* Remove button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black/10 focus:outline-none"
          aria-label="Remove"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

/**
 * StatusBadge Component
 * Pre-configured badge for common status values
 */
export const StatusBadge = ({ status, className = '', ...props }) => {
  const statusConfig = {
    // General statuses
    active: { variant: 'success', label: 'Active', dot: true, dotColor: 'online' },
    inactive: { variant: 'secondary', label: 'Inactive', dot: true, dotColor: 'offline' },
    pending: { variant: 'warning', label: 'Pending', dot: true, dotColor: 'away' },
    suspended: { variant: 'danger', label: 'Suspended', dot: true, dotColor: 'busy' },

    // Order/Booking statuses
    confirmed: { variant: 'success', label: 'Confirmed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    completed: { variant: 'success-solid', label: 'Completed' },
    processing: { variant: 'info', label: 'Processing' },
    failed: { variant: 'danger', label: 'Failed' },
    refunded: { variant: 'purple', label: 'Refunded' },

    // Payment statuses
    paid: { variant: 'success', label: 'Paid' },
    unpaid: { variant: 'warning', label: 'Unpaid' },
    overdue: { variant: 'danger', label: 'Overdue' },
    partial: { variant: 'info', label: 'Partial' },

    // User statuses
    online: { variant: 'success', label: 'Online', dot: true, dotColor: 'online' },
    offline: { variant: 'secondary', label: 'Offline', dot: true, dotColor: 'offline' },
    away: { variant: 'warning', label: 'Away', dot: true, dotColor: 'away' },
    busy: { variant: 'danger', label: 'Busy', dot: true, dotColor: 'busy' },

    // Approval statuses
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'danger', label: 'Rejected' },
    'pending-approval': { variant: 'warning', label: 'Pending Approval' },
    'under-review': { variant: 'info', label: 'Under Review' },

    // DNS/Domain statuses
    'pending-dns': { variant: 'warning', label: 'Pending DNS' },
    verified: { variant: 'success', label: 'Verified' },

    // Default
    default: { variant: 'secondary', label: status },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.default;

  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      dotColor={config.dotColor}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

/**
 * CountBadge Component
 * Notification-style count badge
 */
export const CountBadge = ({
  count,
  max = 99,
  showZero = false,
  variant = 'danger-solid',
  size = 'sm',
  className = '',
  ...props
}) => {
  if (!showZero && count === 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <Badge
      variant={variant}
      size={size}
      rounded="full"
      className={`min-w-[1.25rem] justify-center ${className}`}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};

/**
 * BadgeGroup Component
 * Container for multiple badges
 */
export const BadgeGroup = ({
  children,
  max = 3,
  className = '',
  ...props
}) => {
  const badges = React.Children.toArray(children);
  const visible = badges.slice(0, max);
  const remaining = badges.length - max;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} {...props}>
      {visible}
      {remaining > 0 && (
        <Badge variant="secondary" size="sm">
          +{remaining} more
        </Badge>
      )}
    </div>
  );
};

export default Badge;
