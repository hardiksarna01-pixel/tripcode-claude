import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumb Component
 * Navigation breadcrumb trail
 */
const Breadcrumb = ({
  items,
  separator = 'chevron',
  showHome = true,
  homeHref = '/',
  homeLabel = 'Home',
  maxItems = 0,
  className = '',
  ...props
}) => {
  // Separator variants
  const separators = {
    chevron: <ChevronRight className="w-4 h-4 text-gray-400" />,
    slash: <span className="text-gray-400">/</span>,
    arrow: <span className="text-gray-400">→</span>,
    dot: <span className="text-gray-400">•</span>,
  };

  // Process items for truncation
  let displayItems = [...items];
  const shouldTruncate = maxItems > 0 && items.length > maxItems;

  if (shouldTruncate) {
    const keepFirst = 1;
    const keepLast = maxItems - keepFirst - 1;
    displayItems = [
      items[0],
      { label: '...', truncated: true },
      ...items.slice(-keepLast),
    ];
  }

  const separatorElement = typeof separator === 'string' ? separators[separator] : separator;

  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        {/* Home link */}
        {showHome && (
          <>
            <li>
              <Link
                to={homeHref}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={homeLabel}
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">{homeLabel}</span>
              </Link>
            </li>
            <li className="flex items-center" aria-hidden="true">
              {separatorElement}
            </li>
          </>
        )}

        {/* Breadcrumb items */}
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isTruncated = item.truncated;

          return (
            <React.Fragment key={item.label + index}>
              <li className="flex items-center">
                {isTruncated ? (
                  <span
                    className="text-gray-400 cursor-default"
                    title="..."
                  >
                    ...
                  </span>
                ) : isLast ? (
                  <span
                    className="font-medium text-gray-900 max-w-xs truncate"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <Link
                    to={item.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors max-w-xs truncate"
                  >
                    {item.label}
                  </Link>
                ) : item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className="text-gray-500 hover:text-gray-700 transition-colors max-w-xs truncate"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-gray-500 max-w-xs truncate">
                    {item.label}
                  </span>
                )}
              </li>

              {/* Separator */}
              {!isLast && (
                <li className="flex items-center" aria-hidden="true">
                  {separatorElement}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * BreadcrumbItem Component
 * For building breadcrumbs programmatically
 */
export const BreadcrumbItem = ({
  label,
  href,
  onClick,
  isCurrent = false,
  icon,
  className = '',
}) => {
  const content = (
    <>
      {icon && <span className="w-4 h-4 mr-1">{icon}</span>}
      {label}
    </>
  );

  if (isCurrent) {
    return (
      <span
        className={`font-medium text-gray-900 ${className}`}
        aria-current="page"
      >
        {content}
      </span>
    );
  }

  if (href) {
    return (
      <Link
        to={href}
        className={`text-gray-500 hover:text-gray-700 transition-colors ${className}`}
      >
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`text-gray-500 hover:text-gray-700 transition-colors ${className}`}
      >
        {content}
      </button>
    );
  }

  return <span className={`text-gray-500 ${className}`}>{content}</span>;
};

/**
 * PageHeader Component
 * Header with breadcrumb and title
 */
export const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  backHref,
  onBack,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-4" />
      )}

      {/* Header content */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Back button */}
          {(backHref || onBack) && (
            <Link
              to={backHref || '#'}
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
          )}

          <div>
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {/* Subtitle */}
            {subtitle && (
              <p className="mt-1 text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default Breadcrumb;
