import React from 'react';

/**
 * Skeleton Component
 * Loading placeholder with pulse animation
 */
const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  animation = 'pulse',
  count = 1,
  ...props
}) => {
  // Variant styles
  const variants = {
    rectangular: 'rounded',
    rounded: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  // Animation styles
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-200 ${variants[variant]} ${animations[animation]} ${className}`}
            style={style}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-200 ${variants[variant]} ${animations[animation]} ${className}`}
      style={style}
      {...props}
    />
  );
};

/**
 * SkeletonText Component
 * Text line skeleton with random widths
 */
export const SkeletonText = ({
  lines = 3,
  className = '',
  lastLineWidth = '60%',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

/**
 * SkeletonAvatar Component
 * Circular avatar skeleton
 */
export const SkeletonAvatar = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizes[size]} ${className}`}
      {...props}
    />
  );
};

/**
 * SkeletonButton Component
 * Button placeholder skeleton
 */
export const SkeletonButton = ({
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return (
    <Skeleton
      variant="rounded"
      className={`${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    />
  );
};

/**
 * SkeletonCard Component
 * Card layout skeleton
 */
export const SkeletonCard = ({
  hasImage = false,
  imageHeight = '200px',
  lines = 3,
  hasAction = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden shadow-md ${className}`}
      {...props}
    >
      {hasImage && (
        <Skeleton height={imageHeight} className="w-full" />
      )}
      <div className="p-4 space-y-4">
        <Skeleton variant="text" className="h-6 w-3/4" />
        <SkeletonText lines={lines} />
        {hasAction && (
          <div className="flex gap-2 pt-2">
            <SkeletonButton size="sm" />
            <SkeletonButton size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * SkeletonTable Component
 * Table rows skeleton
 */
export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  hasCheckbox = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`overflow-hidden ${className}`} {...props}>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            {hasCheckbox && (
              <th className="px-6 py-4">
                <Skeleton variant="rounded" className="w-4 h-4" />
              </th>
            )}
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-6 py-4">
                <Skeleton variant="text" className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {hasCheckbox && (
                <td className="px-6 py-4">
                  <Skeleton variant="rounded" className="w-4 h-4" />
                </td>
              )}
              {[...Array(columns)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton
                    variant="text"
                    className="h-4"
                    style={{ width: `${Math.random() * 40 + 40}%` }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * SkeletonList Component
 * List items skeleton
 */
export const SkeletonList = ({
  items = 3,
  hasAvatar = false,
  avatarSize = 'md',
  lines = 2,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          {hasAvatar && <SkeletonAvatar size={avatarSize} />}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-1/2" />
            {lines > 1 && (
              <Skeleton variant="text" className="h-3 w-3/4" />
            )}
            {lines > 2 && (
              <Skeleton variant="text" className="h-3 w-1/3" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * SkeletonStats Component
 * Statistics cards skeleton
 */
export const SkeletonStats = ({
  count = 4,
  className = '',
  ...props
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`} {...props}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" className="h-4 w-1/2" />
              <Skeleton variant="text" className="h-8 w-3/4" />
              <Skeleton variant="text" className="h-3 w-1/3" />
            </div>
            <Skeleton variant="rounded" className="w-12 h-12" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * SkeletonFlightCard Component
 * Flight search result skeleton
 */
export const SkeletonFlightCard = ({
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-md ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        {/* Airline info */}
        <div className="flex items-center gap-3">
          <Skeleton variant="rounded" className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        </div>

        {/* Flight times */}
        <div className="flex items-center gap-8">
          <div className="text-center space-y-1">
            <Skeleton variant="text" className="h-6 w-16 mx-auto" />
            <Skeleton variant="text" className="h-3 w-12 mx-auto" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton variant="text" className="h-3 w-20" />
            <Skeleton className="h-0.5 w-24 my-2" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
          <div className="text-center space-y-1">
            <Skeleton variant="text" className="h-6 w-16 mx-auto" />
            <Skeleton variant="text" className="h-3 w-12 mx-auto" />
          </div>
        </div>

        {/* Price */}
        <div className="text-right space-y-2">
          <Skeleton variant="text" className="h-6 w-20 ml-auto" />
          <Skeleton variant="text" className="h-3 w-16 ml-auto" />
          <SkeletonButton size="sm" className="ml-auto" />
        </div>
      </div>
    </div>
  );
};

/**
 * SkeletonProfile Component
 * Profile page skeleton
 */
export const SkeletonProfile = ({
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonAvatar size="2xl" />
        <div className="space-y-2">
          <Skeleton variant="text" className="h-6 w-48" />
          <Skeleton variant="text" className="h-4 w-32" />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" className="h-4 w-24" />
            <Skeleton variant="rounded" className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
