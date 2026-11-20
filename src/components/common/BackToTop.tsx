import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollActivity } from '../../hooks/useScrollActivity';

export const BackToTop: React.FC = () => {
  const { isScrolling, isAtTop } = useScrollActivity(2800);
  const [isHovered, setIsHovered] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Visible when actively scrolling or hovered, but strictly hidden when at top
  const isVisible = !isAtTop && (isScrolling || isHovered);

  return (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        // Delay resetting hover on touch devices to allow click
        setTimeout(() => setIsHovered(false), 1500);
      }}
      aria-label="Scroll back to top"
      title="Back to Top"
      className={`fixed bottom-5 right-5 z-40 p-3 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 shadow-elevated transition-all duration-300 motion-reduce:transition-none hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="sr-only">Back to top</span>
    </button>
  );
};
export default BackToTop;
