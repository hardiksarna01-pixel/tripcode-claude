import React from 'react';

/**
 * Container Component
 * Responsive container with max-width
 */
export const Container = ({
  children,
  size = 'default',
  padding = true,
  centered = true,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'max-w-screen-xs',
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    default: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${centered ? 'mx-auto' : ''}
        ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Grid Component
 * CSS Grid layout
 */
export const Grid = ({
  children,
  cols = 1,
  gap = 4,
  className = '',
  ...props
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  };

  const gapClasses = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
  };

  return (
    <div
      className={`grid ${colsClasses[cols] || `grid-cols-${cols}`} ${gapClasses[gap] || `gap-${gap}`} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * GridItem Component
 * Grid child with span control
 */
export const GridItem = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        ${colSpan > 1 ? `col-span-${colSpan}` : ''}
        ${rowSpan > 1 ? `row-span-${rowSpan}` : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Flex Component
 * Flexbox layout
 */
export const Flex = ({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  gap = 0,
  className = '',
  ...props
}) => {
  const directions = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse',
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={`
        flex
        ${directions[direction]}
        ${alignments[align]}
        ${justifications[justify]}
        ${wrap ? 'flex-wrap' : 'flex-nowrap'}
        ${gap > 0 ? `gap-${gap}` : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Stack Component
 * Vertical or horizontal stack
 */
export const Stack = ({
  children,
  direction = 'vertical',
  spacing = 4,
  align = 'stretch',
  className = '',
  divider = false,
  ...props
}) => {
  const spacingClasses = {
    0: 'space-y-0',
    1: 'space-y-1',
    2: 'space-y-2',
    3: 'space-y-3',
    4: 'space-y-4',
    5: 'space-y-5',
    6: 'space-y-6',
    8: 'space-y-8',
    10: 'space-y-10',
  };

  const horizontalSpacingClasses = {
    0: 'space-x-0',
    1: 'space-x-1',
    2: 'space-x-2',
    3: 'space-x-3',
    4: 'space-x-4',
    5: 'space-x-5',
    6: 'space-x-6',
    8: 'space-x-8',
    10: 'space-x-10',
  };

  const alignClasses = {
    start: direction === 'horizontal' ? 'items-start' : 'items-start',
    center: 'items-center',
    end: direction === 'horizontal' ? 'items-end' : 'items-end',
    stretch: 'items-stretch',
  };

  const isHorizontal = direction === 'horizontal';
  const spaceClass = isHorizontal
    ? horizontalSpacingClasses[spacing]
    : spacingClasses[spacing];

  if (divider) {
    const items = React.Children.toArray(children);
    return (
      <div
        className={`
          flex ${isHorizontal ? 'flex-row' : 'flex-col'}
          ${alignClasses[align]}
          ${className}
        `}
        {...props}
      >
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < items.length - 1 && (
              <Divider
                orientation={isHorizontal ? 'vertical' : 'horizontal'}
                className={isHorizontal ? `mx-${spacing}` : `my-${spacing}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`
        flex ${isHorizontal ? 'flex-row' : 'flex-col'}
        ${spaceClass}
        ${alignClasses[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * HStack Component
 * Horizontal stack
 */
export const HStack = ({ children, spacing = 4, align = 'center', ...props }) => (
  <Stack direction="horizontal" spacing={spacing} align={align} {...props}>
    {children}
  </Stack>
);

/**
 * VStack Component
 * Vertical stack
 */
export const VStack = ({ children, spacing = 4, align = 'stretch', ...props }) => (
  <Stack direction="vertical" spacing={spacing} align={align} {...props}>
    {children}
  </Stack>
);

/**
 * Divider Component
 * Horizontal or vertical divider
 */
export const Divider = ({
  orientation = 'horizontal',
  variant = 'solid',
  label,
  className = '',
  ...props
}) => {
  const variants = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (label) {
    return (
      <div className={`flex items-center ${className}`} {...props}>
        <div className={`flex-1 border-t border-gray-200 ${variants[variant]}`} />
        <span className="px-4 text-sm text-gray-500">{label}</span>
        <div className={`flex-1 border-t border-gray-200 ${variants[variant]}`} />
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={`border-l border-gray-200 ${variants[variant]} h-full ${className}`}
        {...props}
      />
    );
  }

  return (
    <hr
      className={`border-t border-gray-200 ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

/**
 * Spacer Component
 * Flexible space filler
 */
export const Spacer = ({ size, className = '', ...props }) => {
  if (size) {
    return <div className={`h-${size} w-${size} ${className}`} {...props} />;
  }
  return <div className={`flex-1 ${className}`} {...props} />;
};

/**
 * Box Component
 * Generic layout box
 */
export const Box = ({
  children,
  as: Component = 'div',
  className = '',
  ...props
}) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

/**
 * Center Component
 * Center content
 */
export const Center = ({ children, className = '', ...props }) => (
  <div
    className={`flex items-center justify-center ${className}`}
    {...props}
  >
    {children}
  </div>
);

/**
 * AspectRatio Component
 * Maintain aspect ratio
 */
export const AspectRatio = ({
  children,
  ratio = '16/9',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
      {...props}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};

/**
 * Wrap Component
 * Wrapping flex container
 */
export const Wrap = ({
  children,
  spacing = 2,
  justify = 'start',
  align = 'start',
  className = '',
  ...props
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  };

  return (
    <div
      className={`
        flex flex-wrap gap-${spacing}
        ${justifyClasses[justify]}
        ${alignClasses[align]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Hide Component
 * Responsive visibility
 */
export const Hide = ({
  children,
  above,
  below,
  className = '',
  ...props
}) => {
  let hideClass = '';

  if (above) {
    hideClass = {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    }[above];
  }

  if (below) {
    hideClass = {
      sm: 'hidden sm:block',
      md: 'hidden md:block',
      lg: 'hidden lg:block',
      xl: 'hidden xl:block',
    }[below];
  }

  return (
    <div className={`${hideClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Show Component
 * Responsive visibility (opposite of Hide)
 */
export const Show = ({
  children,
  above,
  below,
  className = '',
  ...props
}) => {
  let showClass = '';

  if (above) {
    showClass = {
      sm: 'hidden sm:block',
      md: 'hidden md:block',
      lg: 'hidden lg:block',
      xl: 'hidden xl:block',
    }[above];
  }

  if (below) {
    showClass = {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    }[below];
  }

  return (
    <div className={`${showClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
