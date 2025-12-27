import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * useDisclosure Hook
 * Manage open/close state for modals, drawers, etc.
 */
export const useDisclosure = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, onOpen, onClose, onToggle, setIsOpen };
};

/**
 * useDebounce Hook
 * Debounce a value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle Hook
 * Throttle a value
 */
export const useThrottle = (value, interval = 500) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);
      return () => clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
};

/**
 * useLocalStorage Hook
 * Persist state to localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * useMediaQuery Hook
 * Detect media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

/**
 * useBreakpoint Hook
 * Detect current breakpoint
 */
export const useBreakpoint = () => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: isLargeDesktop ? 'xl' : isDesktop ? 'lg' : isTablet ? 'md' : 'sm',
  };
};

/**
 * useClickOutside Hook
 * Detect clicks outside an element
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

/**
 * useKeyPress Hook
 * Detect key presses
 */
export const useKeyPress = (targetKey, handler, options = {}) => {
  const { ctrl, shift, alt, meta, preventDefault = true } = options;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const matchesKey = event.key.toLowerCase() === targetKey.toLowerCase();
      const matchesCtrl = ctrl ? event.ctrlKey : true;
      const matchesShift = shift ? event.shiftKey : true;
      const matchesAlt = alt ? event.altKey : true;
      const matchesMeta = meta ? event.metaKey : true;

      if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
        if (preventDefault) event.preventDefault();
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetKey, handler, ctrl, shift, alt, meta, preventDefault]);
};

/**
 * useHover Hook
 * Detect hover state
 */
export const useHover = () => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
};

/**
 * useFocus Hook
 * Detect focus state
 */
export const useFocus = () => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, []);

  return [ref, isFocused];
};

/**
 * useScrollPosition Hook
 * Track scroll position
 */
export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: 0,
    y: 0,
    direction: null,
  });

  const lastPosition = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY > lastPosition.current ? 'down' : 'up';
      lastPosition.current = currentY;

      setScrollPosition({
        x: window.scrollX,
        y: currentY,
        direction,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollPosition;
};

/**
 * useWindowSize Hook
 * Track window dimensions
 */
export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

/**
 * usePrevious Hook
 * Get previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * useToggle Hook
 * Toggle boolean state
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
};

/**
 * useCopyToClipboard Hook
 * Copy text to clipboard
 */
export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState(null);
  const [error, setError] = useState(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setError(null);
      return true;
    } catch (err) {
      setCopiedText(null);
      setError(err);
      return false;
    }
  }, []);

  return { copiedText, copy, error };
};

/**
 * useAsync Hook
 * Handle async operations
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    isIdle: status === 'idle',
  };
};

/**
 * usePagination Hook
 * Pagination state management
 */
export const usePagination = ({
  totalItems,
  initialPage = 1,
  initialPageSize = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const pagination = useMemo(() => ({
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex: (currentPage - 1) * pageSize,
    endIndex: Math.min(currentPage * pageSize, totalItems),
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  }), [currentPage, pageSize, totalPages, totalItems]);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changePageSize = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    ...pagination,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
  };
};

/**
 * useSelection Hook
 * Multi-selection state management
 */
export const useSelection = (items, keyField = 'id') => {
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const isSelected = useCallback((item) => {
    const key = typeof item === 'object' ? item[keyField] : item;
    return selectedKeys.has(key);
  }, [selectedKeys, keyField]);

  const select = useCallback((item) => {
    const key = typeof item === 'object' ? item[keyField] : item;
    setSelectedKeys((prev) => new Set([...prev, key]));
  }, [keyField]);

  const deselect = useCallback((item) => {
    const key = typeof item === 'object' ? item[keyField] : item;
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, [keyField]);

  const toggle = useCallback((item) => {
    if (isSelected(item)) {
      deselect(item);
    } else {
      select(item);
    }
  }, [isSelected, select, deselect]);

  const selectAll = useCallback(() => {
    const allKeys = items.map((item) =>
      typeof item === 'object' ? item[keyField] : item
    );
    setSelectedKeys(new Set(allKeys));
  }, [items, keyField]);

  const deselectAll = useCallback(() => {
    setSelectedKeys(new Set());
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedKeys.size === items.length) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [selectedKeys, items, selectAll, deselectAll]);

  return {
    selectedKeys: Array.from(selectedKeys),
    selectedCount: selectedKeys.size,
    isSelected,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    toggleAll,
    isAllSelected: selectedKeys.size === items.length && items.length > 0,
    isSomeSelected: selectedKeys.size > 0 && selectedKeys.size < items.length,
  };
};

export default {
  useDisclosure,
  useDebounce,
  useThrottle,
  useLocalStorage,
  useMediaQuery,
  useBreakpoint,
  useClickOutside,
  useKeyPress,
  useHover,
  useFocus,
  useScrollPosition,
  useWindowSize,
  usePrevious,
  useToggle,
  useCopyToClipboard,
  useAsync,
  usePagination,
  useSelection,
};
