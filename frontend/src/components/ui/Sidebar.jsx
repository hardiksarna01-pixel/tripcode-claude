import React, { useState, createContext, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X, ExternalLink } from 'lucide-react';

// Sidebar Context
const SidebarContext = createContext({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapse: () => {},
  toggleMobile: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

/**
 * SidebarProvider Component
 * Context provider for sidebar state
 */
export const SidebarProvider = ({ children, defaultCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        toggleMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * Sidebar Component
 * Responsive sidebar navigation
 */
const Sidebar = ({
  children,
  logo,
  footer,
  width = 256,
  collapsedWidth = 72,
  className = '',
  ...props
}) => {
  const { isCollapsed, isMobileOpen, toggleMobile } = useSidebar();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          lg:relative lg:z-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
        style={{
          width: isCollapsed ? collapsedWidth : width,
        }}
        {...props}
      >
        {/* Header / Logo */}
        {logo && (
          <div className={`
            flex items-center h-16 px-4 border-b border-gray-100
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            {logo}
          </div>
        )}

        {/* Mobile close button */}
        <button
          onClick={toggleMobile}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Navigation content */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`
            border-t border-gray-100 p-4
            ${isCollapsed ? 'px-2' : ''}
          `}>
            {footer}
          </div>
        )}
      </aside>
    </>
  );
};

/**
 * SidebarSection Component
 * Grouping for navigation items
 */
export const SidebarSection = ({
  title,
  children,
  className = '',
}) => {
  const { isCollapsed } = useSidebar();

  return (
    <div className={`mb-6 ${className}`}>
      {title && !isCollapsed && (
        <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <nav className="space-y-1 px-2">
        {children}
      </nav>
    </div>
  );
};

/**
 * SidebarItem Component
 * Individual navigation item
 */
export const SidebarItem = ({
  href,
  icon,
  label,
  badge,
  active,
  disabled = false,
  external = false,
  onClick,
  className = '',
  ...props
}) => {
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  // Auto-detect active state from URL
  const isActive = active !== undefined
    ? active
    : href && location.pathname.startsWith(href);

  const content = (
    <>
      {/* Icon */}
      {icon && (
        <span className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          {icon}
        </span>
      )}

      {/* Label */}
      {!isCollapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}

      {/* Badge */}
      {badge !== undefined && !isCollapsed && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
          {badge}
        </span>
      )}

      {/* External link indicator */}
      {external && !isCollapsed && (
        <ExternalLink className="w-4 h-4 text-gray-400" />
      )}
    </>
  );

  const itemClasses = `
    flex items-center gap-3 px-3 py-2.5 rounded-lg
    text-sm font-medium transition-colors
    ${isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isCollapsed ? 'justify-center' : ''}
    ${className}
  `;

  if (disabled) {
    return (
      <span className={itemClasses} title={isCollapsed ? label : undefined}>
        {content}
      </span>
    );
  }

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClasses}
          title={isCollapsed ? label : undefined}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        to={href}
        className={itemClasses}
        title={isCollapsed ? label : undefined}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={itemClasses}
      title={isCollapsed ? label : undefined}
      {...props}
    >
      {content}
    </button>
  );
};

/**
 * SidebarSubmenu Component
 * Expandable submenu
 */
export const SidebarSubmenu = ({
  icon,
  label,
  children,
  defaultOpen = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  // Auto-open if any child is active
  const hasActiveChild = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child) && child.props.href) {
      return location.pathname.startsWith(child.props.href);
    }
    return false;
  });

  React.useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  if (isCollapsed) {
    // Show only icon when collapsed
    return (
      <div className="relative group">
        <button
          className="flex items-center justify-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50"
          title={label}
        >
          {icon && <span className="w-5 h-5">{icon}</span>}
        </button>

        {/* Tooltip submenu on hover */}
        <div className="absolute left-full top-0 ml-2 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
            {label}
          </p>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
          text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors
          ${hasActiveChild ? 'bg-gray-50' : ''}
        `}
      >
        {icon && <span className="w-5 h-5 text-gray-500">{icon}</span>}
        <span className="flex-1 text-left">{label}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </span>
      </button>

      {/* Submenu items */}
      {isOpen && (
        <div className="mt-1 ml-5 pl-4 border-l-2 border-gray-100 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * SidebarToggle Component
 * Button to toggle sidebar collapse
 */
export const SidebarToggle = ({ className = '' }) => {
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <button
      onClick={toggleCollapse}
      className={`
        hidden lg:flex items-center justify-center
        w-8 h-8 rounded-lg
        text-gray-500 hover:text-gray-700 hover:bg-gray-100
        transition-colors
        ${className}
      `}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <ChevronRight
        className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
      />
    </button>
  );
};

/**
 * MobileMenuButton Component
 * Button to open mobile sidebar
 */
export const MobileMenuButton = ({ className = '' }) => {
  const { toggleMobile } = useSidebar();

  return (
    <button
      onClick={toggleMobile}
      className={`lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${className}`}
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
};

/**
 * SidebarDivider Component
 * Horizontal divider
 */
export const SidebarDivider = ({ className = '' }) => (
  <hr className={`my-4 mx-4 border-gray-100 ${className}`} />
);

export default Sidebar;
