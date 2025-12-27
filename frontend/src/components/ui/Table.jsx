import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { IconButton } from './Button';
import Badge from './Badge';

/**
 * Table Component
 * A feature-rich table with sorting, selection, and responsive design
 */
const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  sortable = false,
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  onSort,
  striped = true,
  hoverable = true,
  compact = false,
  bordered = false,
  stickyHeader = false,
  className = '',
  rowClassName,
  onRowClick,
  keyField = 'id',
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle sorting
  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;

    let direction = 'asc';
    if (sortConfig.key === column.key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key: column.key, direction });
    onSort?.({ key: column.key, direction });
  };

  // Get sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || onSort) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, onSort]);

  // Check if all rows are selected
  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && !allSelected;

  // Cell padding based on compact mode
  const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-4';
  const headerPadding = compact ? 'px-4 py-3' : 'px-6 py-4';

  // Render sort icon
  const renderSortIcon = (column) => {
    if (!sortable || !column.sortable) return null;

    if (sortConfig.key === column.key) {
      return sortConfig.direction === 'asc' ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
  };

  // Render cell content
  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row, column);
    }
    return row[column.key];
  };

  return (
    <div className={`overflow-hidden ${bordered ? 'border border-gray-200 rounded-xl' : ''} ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200" {...props}>
          {/* Table Header */}
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {/* Selection checkbox column */}
              {selectable && (
                <th className={`${headerPadding} w-12`}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => el && (el.indeterminate = someSelected)}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${headerPadding}
                    text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                    ${sortable && column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.width ? `w-[${column.width}]` : ''}
                  `}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => handleSort(column)}
                >
                  <div className={`flex items-center gap-2 ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : ''}`}>
                    {column.header}
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading state
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {selectable && (
                    <td className={cellPadding}>
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cellPadding}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-16 text-center"
                >
                  {emptyIcon && <div className="flex justify-center mb-4 text-gray-400">{emptyIcon}</div>}
                  <p className="text-gray-500">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              // Data rows
              sortedData.map((row, rowIndex) => {
                const rowKey = row[keyField] || rowIndex;
                const isSelected = selectedRows.includes(rowKey);

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={`
                      ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                      ${hoverable ? 'hover:bg-blue-50/50' : ''}
                      ${isSelected ? 'bg-blue-50' : ''}
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName || ''}
                      transition-colors
                    `}
                  >
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className={cellPadding} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => onRowSelect?.(rowKey, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`
                          ${cellPadding}
                          text-sm text-gray-900
                          ${column.align === 'center' ? 'text-center' : ''}
                          ${column.align === 'right' ? 'text-right' : ''}
                          ${column.truncate ? 'max-w-xs truncate' : ''}
                        `}
                      >
                        {renderCell(row, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Pagination Component
 * Pagination controls for tables
 */
export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
  showFirstLast = true,
  siblingCount = 1,
  className = '',
  ...props
}) => {
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const leftSibling = Math.max(1, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages, currentPage + siblingCount);

    // Always show first page
    if (leftSibling > 1) {
      pages.push(1);
      if (leftSibling > 2) pages.push('...');
    }

    // Show sibling pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    // Always show last page
    if (rightSibling < totalPages) {
      if (rightSibling < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 ${className}`}
      {...props}
    >
      {/* Page size selector and item count */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}

        {showItemCount && totalItems > 0 && (
          <span>
            Showing {startItem} to {endItem} of {totalItems} results
          </span>
        )}
      </div>

      {/* Page navigation */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* First page button */}
        {showFirstLast && (
          <IconButton
            icon={<ChevronsLeft />}
            size="sm"
            variant="ghost"
            onClick={() => onPageChange?.(1)}
            disabled={currentPage === 1}
            label="First page"
          />
        )}

        {/* Previous button */}
        <IconButton
          icon={<ChevronLeft />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
          label="Previous page"
        />

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`
                  min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next button */}
        <IconButton
          icon={<ChevronRight />}
          size="sm"
          variant="ghost"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
          label="Next page"
        />

        {/* Last page button */}
        {showFirstLast && (
          <IconButton
            icon={<ChevronsRight />}
            size="sm"
            variant="ghost"
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage === totalPages}
            label="Last page"
          />
        )}
      </nav>
    </div>
  );
};

/**
 * ActionCell Component
 * Dropdown actions for table rows
 */
export const ActionCell = ({ actions, row }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <IconButton
        icon={<MoreHorizontal />}
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        label="Actions"
      />

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                  setIsOpen(false);
                }}
                disabled={action.disabled}
                className={`
                  w-full flex items-center gap-2 px-4 py-2 text-sm text-left
                  ${action.variant === 'danger' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  transition-colors
                `}
              >
                {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * DataTable Component
 * Table with built-in pagination
 */
export const DataTable = ({
  columns,
  data,
  loading,
  pageSize: initialPageSize = 10,
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Table
        columns={columns}
        data={paginatedData}
        loading={loading}
        bordered={false}
        {...props}
      />
      {!loading && data.length > 0 && (
        <div className="border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
