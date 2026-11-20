import React, { useState, useRef } from 'react';
import { DEVELOPER_INFO } from '../../data/developerInfo';
import { DeveloperModal } from './DeveloperModal';
import { useScrollActivity } from '../../hooks/useScrollActivity';

export const DeveloperWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const { isScrolling } = useScrollActivity(2800);

  // Floating button is visible when actively scrolling or when user is hovering/interacting
  const isVisible = isScrolling || isHovered || isOpen;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    triggerButtonRef.current?.focus();
  };

  return (
    <>
      {/* Floating Trigger Button in BOTTOM-LEFT corner */}
      <button
        ref={triggerButtonRef}
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          setTimeout(() => setIsHovered(false), 1500);
        }}
        className={`fixed bottom-5 left-5 z-40 group p-1 rounded-full bg-slate-900/95 dark:bg-slate-900/95 border border-slate-700/80 shadow-elevated backdrop-blur-md transition-all duration-300 motion-reduce:transition-none hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          isVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        aria-label={`About Developer - ${DEVELOPER_INFO.fullName} (${DEVELOPER_INFO.username})`}
        title={`About Developer — ${DEVELOPER_INFO.fullName}`}
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-500/70 group-hover:ring-emerald-400 flex items-center justify-center bg-slate-950 transition-all">
          <img
            src={DEVELOPER_INFO.image}
            alt={DEVELOPER_INFO.fullName}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('Hazim')) {
                target.src = '/Hazim%20Bashir%20Dev.png';
              }
            }}
          />
        </div>
        <span className="sr-only">About Developer - Hazim Bashir ({DEVELOPER_INFO.username})</span>
      </button>

      {/* Developer Profile Modal */}
      <DeveloperModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
export default DeveloperWidget;
