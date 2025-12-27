import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Progress Component
 * Linear progress bar
 */
const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  animated = false,
  striped = false,
  indeterminate = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Size variants
  const sizes = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };

  // Color variants
  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500',
  };

  // Determine color based on value (for auto coloring)
  const getAutoColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const barColor = variant === 'auto' ? getAutoColor() : variants[variant];

  return (
    <div className={className} {...props}>
      {/* Label */}
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-gray-500">
            {indeterminate ? '' : `${Math.round(percentage)}%`}
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div
        className={`overflow-hidden rounded-full bg-gray-200 ${sizes[size]}`}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={`
            h-full rounded-full transition-all duration-300 ease-out
            ${barColor}
            ${striped ? 'bg-stripes' : ''}
            ${animated ? 'animate-progress-stripes' : ''}
            ${indeterminate ? 'animate-indeterminate w-1/3' : ''}
          `}
          style={indeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * CircularProgress Component
 * Circular/radial progress indicator
 */
export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  strokeWidth,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Size configurations
  const sizes = {
    xs: { size: 24, stroke: 3, fontSize: 'text-[8px]' },
    sm: { size: 32, stroke: 3, fontSize: 'text-xs' },
    md: { size: 48, stroke: 4, fontSize: 'text-sm' },
    lg: { size: 64, stroke: 5, fontSize: 'text-base' },
    xl: { size: 80, stroke: 6, fontSize: 'text-lg' },
    '2xl': { size: 96, stroke: 8, fontSize: 'text-xl' },
  };

  const sizeConfig = sizes[size];
  const actualStrokeWidth = strokeWidth || sizeConfig.stroke;
  const radius = (sizeConfig.size - actualStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  // Color variants
  const variants = {
    primary: 'text-blue-600',
    success: 'text-green-500',
    warning: 'text-amber-500',
    danger: 'text-red-500',
    info: 'text-sky-500',
    purple: 'text-purple-500',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <svg
        className="transform -rotate-90"
        width={sizeConfig.size}
        height={sizeConfig.size}
      >
        {/* Background circle */}
        <circle
          className="text-gray-200"
          strokeWidth={actualStrokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={sizeConfig.size / 2}
          cy={sizeConfig.size / 2}
        />
        {/* Progress circle */}
        <circle
          className={`${variants[variant]} transition-all duration-300 ease-out`}
          strokeWidth={actualStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={sizeConfig.size / 2}
          cy={sizeConfig.size / 2}
        />
      </svg>

      {/* Value label */}
      {showValue && (
        <span className={`absolute font-semibold text-gray-700 ${sizeConfig.fontSize}`}>
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

/**
 * ProgressSteps Component
 * Step progress indicator
 */
export const ProgressSteps = ({
  steps,
  currentStep,
  variant = 'default',
  className = '',
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`} {...props}>
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id || index}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full
                  text-sm font-medium transition-all
                  ${isComplete
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                      ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {isComplete ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {step.label && (
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${isCurrent ? 'text-blue-600' : isComplete ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </span>
              )}
            </div>

            {/* Connector */}
            {!isLast && (
              <div
                className={`
                  flex-1 h-0.5 mx-2
                  ${isComplete ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/**
 * Spinner Component
 * Loading spinner
 */
export const Spinner = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label = 'Loading...',
  ...props
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variants = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <svg
      className={`animate-spin ${sizes[size]} ${variants[variant]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * LoadingOverlay Component
 * Full-screen or container loading overlay
 */
export const LoadingOverlay = ({
  loading = false,
  label = 'Loading...',
  blur = true,
  className = '',
  children,
}) => {
  if (!loading) return children;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          bg-white/80 z-10
          ${blur ? 'backdrop-blur-sm' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * SkeletonLoader Component
 * Page-level loading skeleton
 */
export const PageLoader = ({ className = '' }) => (
  <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
    <div className="flex flex-col items-center gap-3">
      <Spinner size="xl" />
      <p className="text-gray-500">Loading...</p>
    </div>
  </div>
);

export default Progress;
