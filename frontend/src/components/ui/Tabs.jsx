import React, { useState, useRef, useEffect } from 'react';

/**
 * Tabs Component
 * Tabbed navigation with multiple variants
 */
const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);

  const currentTab = activeTab !== undefined ? activeTab : selectedTab;

  // Update indicator position for underline variant
  useEffect(() => {
    if (variant === 'underline') {
      const activeIndex = tabs.findIndex((tab) => tab.id === currentTab);
      const activeTabEl = tabsRef.current[activeIndex];
      if (activeTabEl) {
        setIndicatorStyle({
          left: activeTabEl.offsetLeft,
          width: activeTabEl.offsetWidth,
        });
      }
    }
  }, [currentTab, tabs, variant]);

  const handleTabChange = (tabId) => {
    if (activeTab === undefined) {
      setSelectedTab(tabId);
    }
    onChange?.(tabId);
  };

  // Size variants
  const sizes = {
    sm: 'text-sm py-2 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-5',
  };

  // Variant styles
  const getTabStyles = (isActive, isDisabled) => {
    const baseStyles = `
      ${sizes[size]}
      font-medium transition-all duration-200
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    const variants = {
      default: {
        container: 'bg-gray-100 p-1 rounded-lg',
        tab: `
          rounded-md
          ${isActive
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
        `,
      },
      pills: {
        container: 'gap-2',
        tab: `
          rounded-full
          ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }
        `,
      },
      underline: {
        container: 'border-b border-gray-200',
        tab: `
          relative border-b-2 -mb-px rounded-none
          ${isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }
        `,
      },
      boxed: {
        container: 'border border-gray-200 rounded-lg p-1 bg-gray-50',
        tab: `
          rounded-md
          ${isActive
            ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
            : 'text-gray-600 hover:text-gray-900'
          }
        `,
      },
      soft: {
        container: 'gap-2',
        tab: `
          rounded-lg
          ${isActive
            ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }
        `,
      },
    };

    return `${baseStyles} ${variants[variant].tab}`;
  };

  const containerStyles = {
    default: 'bg-gray-100 p-1 rounded-lg',
    pills: 'gap-2',
    underline: 'border-b border-gray-200 gap-0',
    boxed: 'border border-gray-200 rounded-lg p-1 bg-gray-50',
    soft: 'gap-2',
  };

  return (
    <div className={className} {...props}>
      {/* Tab list */}
      <div
        className={`
          relative flex items-center
          ${containerStyles[variant]}
          ${fullWidth ? '' : 'inline-flex'}
        `}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) => {
          const isActive = currentTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              ref={(el) => (tabsRef.current[index] = el)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
              className={`
                ${getTabStyles(isActive, isDisabled)}
                ${fullWidth ? 'flex-1' : ''}
                flex items-center justify-center gap-2
              `}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`
                    ml-1 px-2 py-0.5 text-xs rounded-full
                    ${isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Animated indicator for underline variant */}
        {variant === 'underline' && (
          <div
            className="absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300"
            style={indicatorStyle}
          />
        )}
      </div>

      {/* Tab panels */}
      {children && (
        <div className="mt-4">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.props.id === currentTab) {
              return (
                <div
                  role="tabpanel"
                  id={`tabpanel-${child.props.id}`}
                  aria-labelledby={child.props.id}
                  tabIndex={0}
                >
                  {child}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

/**
 * TabPanel Component
 * Content panel for tabs
 */
export const TabPanel = ({ id, children, className = '', ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

/**
 * VerticalTabs Component
 * Vertical tab navigation
 */
export const VerticalTabs = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  children,
  ...props
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTab || tabs[0]?.id);
  const currentTab = activeTab !== undefined ? activeTab : selectedTab;

  const handleTabChange = (tabId) => {
    if (activeTab === undefined) {
      setSelectedTab(tabId);
    }
    onChange?.(tabId);
  };

  return (
    <div className={`flex gap-6 ${className}`} {...props}>
      {/* Sidebar navigation */}
      <nav className="w-56 flex-shrink-0">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const isDisabled = tab.disabled;

            return (
              <li key={tab.id}>
                <button
                  onClick={() => !isDisabled && handleTabChange(tab.id)}
                  disabled={isDisabled}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                    text-sm font-medium transition-colors text-left
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
                  <span className="flex-1">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`
                        px-2 py-0.5 text-xs rounded-full
                        ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}
                      `}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.props.id === currentTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

/**
 * StepTabs Component
 * Step-style tabs for wizards/flows
 */
export const StepTabs = ({
  steps,
  currentStep,
  onChange,
  clickable = true,
  className = '',
  ...props
}) => {
  return (
    <nav aria-label="Progress" className={className} {...props}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = clickable && (isComplete || isCurrent);

          return (
            <li
              key={step.id}
              className={`relative ${index !== steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex items-center">
                {/* Step indicator */}
                <button
                  onClick={() => isClickable && onChange?.(index)}
                  disabled={!isClickable}
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full
                    transition-all duration-200
                    ${isComplete
                      ? 'bg-blue-600 text-white'
                      : isCurrent
                        ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }
                    ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : 'cursor-default'}
                  `}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </button>

                {/* Connector line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-0.5 mx-4
                      ${isComplete ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>

              {/* Step label */}
              <div className="absolute -bottom-6 left-0 w-max">
                <p
                  className={`
                    text-xs font-medium
                    ${isCurrent ? 'text-blue-600' : isComplete ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Tabs;
