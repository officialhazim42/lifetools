import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md' }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base' },
    md: { icon: 'w-8 h-8', text: 'text-xl' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl' }
  };

  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* SVG Geometric Monogram Logo */}
      <svg
        className={`${icon} shrink-0`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lt-brand-g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="lt-brand-g2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="15"
          className="fill-slate-900 stroke-slate-800 dark:fill-slate-900 dark:stroke-slate-700/80"
          strokeWidth="2"
        />
        {/* L Shape */}
        <path
          d="M 18 18 V 44 C 18 45.1 18.9 46 20 46 H 42 C 43.1 46 44 45.1 44 44 V 40 C 44 38.9 43.1 38 42 38 H 26 V 18 C 26 16.9 25.1 16 24 16 H 20 C 18.9 16 18 16.9 18 18 Z"
          fill="url(#lt-brand-g1)"
        />
        {/* T Shape */}
        <path
          d="M 28 20 C 28 18.9 28.9 18 30 18 H 46 C 47.1 18 48 18.9 48 20 V 24 C 48 25.1 47.1 26 46 26 H 41 V 34 C 41 35.1 40.1 36 39 36 H 35 C 33.9 36 33 35.1 33 34 V 26 H 30 C 28.9 26 28 25.1 28 24 V 20 Z"
          fill="url(#lt-brand-g2)"
        />
        {/* Accent dot */}
        <circle cx="43" cy="43" r="2.5" fill="#38BDF8" />
      </svg>

      {!iconOnly && (
        <span className={`${text} font-bold text-slate-900 dark:text-white flex items-center`}>
          Life<span className="text-emerald-600 dark:text-emerald-400">Tools</span>
        </span>
      )}
    </div>
  );
};
