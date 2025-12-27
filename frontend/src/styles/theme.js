/**
 * Travel Portal Design System - Theme Configuration
 * Centralized design tokens for consistent styling across the application
 */

export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // Secondary Colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Accent Colors
    accent: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Success Colors
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    // Warning Colors
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    // Error/Danger Colors
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    // Info Colors
    info: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Neutral/Gray Colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Semantic Colors
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Spacing
  spacing: {
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Box Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Transitions
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Z-Index
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Animation Keyframes
  animations: {
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    fadeIn: 'fadeIn 0.2s ease-out',
    fadeOut: 'fadeOut 0.2s ease-in',
    slideInUp: 'slideInUp 0.3s ease-out',
    slideInDown: 'slideInDown 0.3s ease-out',
    slideInLeft: 'slideInLeft 0.3s ease-out',
    slideInRight: 'slideInRight 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    shake: 'shake 0.5s ease-in-out',
  },
};

// Component-specific styling presets
export const componentStyles = {
  // Button variants
  button: {
    base: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3 text-base',
      xl: 'px-6 py-3.5 text-base',
    },
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
      warning: 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-sm',
      info: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500 shadow-sm',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline',
    },
  },

  // Input variants
  input: {
    base: 'block w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:cursor-not-allowed',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base',
    },
    states: {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    },
  },

  // Card variants
  card: {
    base: 'bg-white rounded-xl overflow-hidden',
    variants: {
      default: 'shadow-md',
      bordered: 'border border-gray-200',
      elevated: 'shadow-lg',
      flat: 'shadow-none bg-gray-50',
    },
  },

  // Badge variants
  badge: {
    base: 'inline-flex items-center font-medium rounded-full',
    sizes: {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm',
    },
    variants: {
      primary: 'bg-blue-100 text-blue-800',
      secondary: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      danger: 'bg-red-100 text-red-800',
      warning: 'bg-amber-100 text-amber-800',
      info: 'bg-sky-100 text-sky-800',
      outline: 'border border-current bg-transparent',
    },
  },

  // Alert variants
  alert: {
    base: 'rounded-lg p-4',
    variants: {
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
      success: 'bg-green-50 text-green-800 border border-green-200',
      warning: 'bg-amber-50 text-amber-800 border border-amber-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
    },
  },
};

export default theme;
