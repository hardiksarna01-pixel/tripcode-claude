import React from 'react';
import { Search, FileX, Inbox, AlertCircle, WifiOff, FolderOpen, Users, ShoppingCart, Calendar, Plane, CreditCard, FileText } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState Component
 * Display placeholder content when no data is available
 */
const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionText,
  onAction,
  secondaryAction,
  secondaryActionText,
  onSecondaryAction,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  // Size variants
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'w-12 h-12',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-12',
      icon: 'w-16 h-16',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      icon: 'w-20 h-20',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sizeConfig.container} ${className}`}
      {...props}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4 p-4 bg-gray-100 rounded-full">
          <div className={`${sizeConfig.icon} text-gray-400`}>{icon}</div>
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className={`font-semibold text-gray-900 mb-2 ${sizeConfig.title}`}>
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className={`text-gray-500 max-w-sm mx-auto mb-6 ${sizeConfig.description}`}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || actionText || secondaryAction || secondaryActionText) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {(action || actionText) && (
            <Button
              variant="primary"
              onClick={onAction}
            >
              {action || actionText}
            </Button>
          )}
          {(secondaryAction || secondaryActionText) && (
            <Button
              variant="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryAction || secondaryActionText}
            </Button>
          )}
        </div>
      )}

      {/* Custom content */}
      {children}
    </div>
  );
};

/**
 * Pre-configured empty state variants
 */

// No search results
export const NoSearchResults = ({ searchTerm, onClear, ...props }) => (
  <EmptyState
    icon={<Search className="w-full h-full" />}
    title="No results found"
    description={
      searchTerm
        ? `We couldn't find any matches for "${searchTerm}". Try adjusting your search.`
        : 'No results match your current filters. Try adjusting your criteria.'
    }
    actionText={onClear ? 'Clear search' : undefined}
    onAction={onClear}
    {...props}
  />
);

// No data
export const NoData = ({ entityName = 'items', onAdd, ...props }) => (
  <EmptyState
    icon={<Inbox className="w-full h-full" />}
    title={`No ${entityName} yet`}
    description={`You haven't added any ${entityName} yet. Get started by creating your first one.`}
    actionText={onAdd ? `Add ${entityName.slice(0, -1) || entityName}` : undefined}
    onAction={onAdd}
    {...props}
  />
);

// Error state
export const ErrorState = ({ message, onRetry, ...props }) => (
  <EmptyState
    icon={<AlertCircle className="w-full h-full text-red-400" />}
    title="Something went wrong"
    description={message || 'An error occurred while loading the data. Please try again.'}
    actionText={onRetry ? 'Try again' : undefined}
    onAction={onRetry}
    {...props}
  />
);

// Offline state
export const OfflineState = ({ onRetry, ...props }) => (
  <EmptyState
    icon={<WifiOff className="w-full h-full" />}
    title="You're offline"
    description="Please check your internet connection and try again."
    actionText={onRetry ? 'Retry' : undefined}
    onAction={onRetry}
    {...props}
  />
);

// No files
export const NoFiles = ({ onUpload, ...props }) => (
  <EmptyState
    icon={<FolderOpen className="w-full h-full" />}
    title="No files"
    description="Upload files to get started. Drag and drop or click to browse."
    actionText={onUpload ? 'Upload files' : undefined}
    onAction={onUpload}
    {...props}
  />
);

// Travel-specific empty states

// No bookings
export const NoBookings = ({ onSearch, ...props }) => (
  <EmptyState
    icon={<Plane className="w-full h-full" />}
    title="No bookings yet"
    description="Start exploring destinations and book your next adventure."
    actionText={onSearch ? 'Search flights' : undefined}
    onAction={onSearch}
    {...props}
  />
);

// No customers
export const NoCustomers = ({ onAdd, ...props }) => (
  <EmptyState
    icon={<Users className="w-full h-full" />}
    title="No customers yet"
    description="Your customer list is empty. Add your first customer to get started."
    actionText={onAdd ? 'Add customer' : undefined}
    onAction={onAdd}
    {...props}
  />
);

// Empty cart
export const EmptyCart = ({ onBrowse, ...props }) => (
  <EmptyState
    icon={<ShoppingCart className="w-full h-full" />}
    title="Your cart is empty"
    description="Looks like you haven't added anything to your cart yet."
    actionText={onBrowse ? 'Browse flights' : undefined}
    onAction={onBrowse}
    {...props}
  />
);

// No upcoming trips
export const NoUpcomingTrips = ({ onSearch, ...props }) => (
  <EmptyState
    icon={<Calendar className="w-full h-full" />}
    title="No upcoming trips"
    description="You don't have any trips scheduled. Plan your next adventure now!"
    actionText={onSearch ? 'Plan a trip' : undefined}
    onAction={onSearch}
    {...props}
  />
);

// No transactions
export const NoTransactions = ({ onAdd, ...props }) => (
  <EmptyState
    icon={<CreditCard className="w-full h-full" />}
    title="No transactions yet"
    description="Your transaction history is empty. Transactions will appear here once you make a booking."
    actionText={onAdd ? 'Add funds' : undefined}
    onAction={onAdd}
    {...props}
  />
);

// No invoices
export const NoInvoices = ({ ...props }) => (
  <EmptyState
    icon={<FileText className="w-full h-full" />}
    title="No invoices"
    description="Invoices will appear here once bookings are completed."
    {...props}
  />
);

// No documents
export const NoDocuments = ({ onUpload, ...props }) => (
  <EmptyState
    icon={<FileX className="w-full h-full" />}
    title="No documents"
    description="Upload documents to keep track of important travel information."
    actionText={onUpload ? 'Upload document' : undefined}
    onAction={onUpload}
    {...props}
  />
);

export default EmptyState;
