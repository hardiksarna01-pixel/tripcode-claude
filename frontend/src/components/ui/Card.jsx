import React from 'react';

/**
 * Card Component
 * A versatile card container with multiple variants and sections
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}) => {
  // Variant styles
  const variants = {
    default: 'bg-white shadow-md',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg',
    flat: 'bg-gray-50',
    ghost: 'bg-transparent',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-700 text-white',
    dark: 'bg-gray-900 text-white',
  };

  // Padding sizes
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  // Hover and clickable states
  const interactiveStyles = `
    ${hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''}
    ${clickable ? 'cursor-pointer active:scale-[0.99]' : ''}
  `;

  return (
    <div
      className={`
        rounded-xl overflow-hidden transition-all duration-200
        ${variants[variant]}
        ${paddings[padding]}
        ${interactiveStyles}
        ${className}
      `}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardHeader Component
 * Header section for cards with title and actions
 */
export const CardHeader = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${className}`}
      {...props}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
        {children}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

/**
 * CardBody Component
 * Main content area for cards
 */
export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * CardFooter Component
 * Footer section for cards with actions
 */
export const CardFooter = ({
  children,
  align = 'right',
  className = '',
  ...props
}) => {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`flex items-center gap-3 pt-4 mt-4 border-t border-gray-100 ${alignments[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CardDivider Component
 * Horizontal divider for card sections
 */
export const CardDivider = ({ className = '' }) => (
  <hr className={`border-gray-100 my-4 ${className}`} />
);

/**
 * StatCard Component
 * Specialized card for displaying statistics
 */
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor = 'blue',
  trend,
  className = '',
  ...props
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    sky: 'bg-sky-100 text-sky-600',
  };

  return (
    <Card variant="default" padding="md" className={className} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {(change || trend) && (
            <div className="flex items-center gap-2 mt-2">
              {change && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
                  {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : ''} {change}
                </span>
              )}
              {trend && (
                <span className="text-sm text-gray-500">{trend}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${iconColors[iconColor]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * FeatureCard Component
 * Card for displaying features with icon
 */
export const FeatureCard = ({
  icon,
  title,
  description,
  iconColor = 'blue',
  className = '',
  ...props
}) => {
  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <Card
      variant="bordered"
      padding="md"
      hover
      className={`text-center ${className}`}
      {...props}
    >
      {icon && (
        <div className={`inline-flex p-4 rounded-2xl mb-4 ${iconColors[iconColor]}`}>
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </Card>
  );
};

/**
 * ImageCard Component
 * Card with image header
 */
export const ImageCard = ({
  image,
  imageAlt,
  title,
  description,
  footer,
  aspectRatio = '16/9',
  className = '',
  ...props
}) => {
  return (
    <Card variant="default" padding="none" className={className} {...props}>
      <div className="relative overflow-hidden" style={{ aspectRatio }}>
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
        {footer && (
          <div className="mt-4 pt-4 border-t border-gray-100">{footer}</div>
        )}
      </div>
    </Card>
  );
};

export default Card;
