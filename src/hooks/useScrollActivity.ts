import { useState, useEffect, useRef } from 'react';

export interface ScrollActivityState {
  isScrolling: boolean;
  isAtTop: boolean;
  scrollY: number;
}

export function useScrollActivity(inactivityDelay: number = 2800): ScrollActivityState {
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [scrollY, setScrollY] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      const initialY = window.scrollY;
      setScrollY(initialY);
      setIsAtTop(initialY <= 60);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsAtTop(currentScrollY <= 60);
      setIsScrolling(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, inactivityDelay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inactivityDelay]);

  return { isScrolling, isAtTop, scrollY };
}
