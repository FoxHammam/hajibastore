import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Threshold for intersection (0.0 to 1.0)
 * @param {string} options.rootMargin - Margin around the root element
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export const useScrollAnimation = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally disconnect after first visibility to improve performance
          // observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isVisible];
};

