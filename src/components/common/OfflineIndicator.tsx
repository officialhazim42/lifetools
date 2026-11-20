import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnectedToast, setShowReconnectedToast] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      setDismissed(false);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedToast(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnectedToast) {
    return (
      <aside
        aria-label="Network status notification"
        className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fadeIn border border-emerald-500"
      >
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>You are back online. All features remain synchronized locally.</span>
        <button
          onClick={() => setShowReconnectedToast(false)}
          className="text-white/80 hover:text-white p-0.5 ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  if (!isOnline && !dismissed) {
    return (
      <aside
        aria-label="Offline mode active notification"
        className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 text-xs font-medium sticky top-0 z-40 shadow-sm flex items-center justify-between transition"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1 justify-center text-center">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
          <span>
            <strong>Offline Mode Active:</strong> LifeTools executes 100% in your browser. All 216 digital tools, calculators, and converters remain fully functional without internet.
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            <ShieldCheck className="w-3 h-3" /> Zero Server Sync
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/80 hover:text-white p-1 ml-2 rounded transition"
          title="Dismiss offline notification"
        >
          <X className="w-4 h-4" />
        </button>
      </aside>
    );
  }

  return null;
};
