import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  HardDrive,
  Layers,
  Smartphone,
  ShieldAlert,
  CheckCircle,
  RefreshCw,
  Database,
  Info
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const OfflineStorageSection: React.FC = () => {
  const { showToast } = useToast();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [cacheCount, setCacheCount] = useState<number | null>(null);
  const [cacheNames, setCacheNames] = useState<string[]>([]);
  const [storageEstimate, setStorageEstimate] = useState<{
    usage: number;
    quota: number;
    percent: number;
  } | null>(null);
  const [isPersisted, setIsPersisted] = useState<boolean | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check PWA display mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsPwaInstalled(isStandalone);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const inspectStorage = async () => {
    setIsRefreshing(true);
    try {
      // 1. Storage quota estimation
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        const usage = est.usage || 0;
        const quota = est.quota || 0;
        const percent = quota > 0 ? (usage / quota) * 100 : 0;
        setStorageEstimate({ usage, quota, percent });
      }

      // 2. Persisted status
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persisted) {
        const persisted = await navigator.storage.persisted();
        setIsPersisted(persisted);
      }

      // 3. Cache Storage inspection
      if (typeof window !== 'undefined' && 'caches' in window) {
        const keys = await window.caches.keys();
        setCacheNames(keys);
        let totalItems = 0;
        for (const key of keys) {
          const cache = await window.caches.open(key);
          const reqs = await cache.keys();
          totalItems += reqs.length;
        }
        setCacheCount(totalItems);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    inspectStorage();
  }, []);

  const handleRequestPersistence = async () => {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        const granted = await navigator.storage.persist();
        setIsPersisted(granted);
        if (granted) {
          showToast('Persistent storage granted by browser.', 'success');
        } else {
          showToast('Persistent storage not granted. Browser may evict on low disk.', 'info');
        }
      } catch {
        showToast('Storage persistence request failed.', 'error');
      }
    } else {
      showToast('Storage persistence API is not supported in this browser.', 'info');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-500" />
            Offline & Storage
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor real-time connection status, Service Worker asset caching, and browser storage quotas.
          </p>
        </div>

        <button
          type="button"
          onClick={inspectStorage}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Online / Offline & PWA Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Network State */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isOnline
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
              }`}
            >
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Live Connectivity
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {isOnline ? 'Connected (Online)' : 'Disconnected (Offline Mode)'}
              </span>
            </div>
          </div>
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isOnline ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-amber-500 ring-4 ring-amber-500/20'
            }`}
          />
        </div>

        {/* PWA App Status */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                PWA Desktop/Mobile App
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {isPwaInstalled ? 'Installed as App' : 'Running in Browser'}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {isPwaInstalled ? 'Standalone' : 'Browser Tab'}
          </span>
        </div>
      </div>

      {/* Storage Quota Estimation */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              Browser Storage Quota Estimate
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Approximate space allocated to this origin by your browser for IndexedDB, Service Worker caches, and settings.
            </p>
          </div>
          {storageEstimate && (
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 self-start sm:self-auto">
              {formatBytes(storageEstimate.usage)} used ({storageEstimate.percent.toFixed(2)}%)
            </span>
          )}
        </div>

        {storageEstimate ? (
          <div className="space-y-2">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(1, Math.min(100, storageEstimate.percent))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Used: {formatBytes(storageEstimate.usage)}</span>
              <span>Available Quota: {formatBytes(storageEstimate.quota)}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">
            Storage estimation API not available or computing...
          </div>
        )}

        {/* Persistence Status */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Persistence Mode:</span>
            {isPersisted ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Persistent (Protected from eviction)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                Best-Effort (May be evicted on extreme disk pressure)
              </span>
            )}
          </div>

          {!isPersisted && (
            <button
              type="button"
              onClick={handleRequestPersistence}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors self-start sm:self-auto cursor-pointer"
            >
              Request Persistent Storage
            </button>
          )}
        </div>
      </div>

      {/* Service Worker Cache Information */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Service Worker Cache Storage
            </h3>
          </div>
          {cacheCount !== null && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              {cacheCount} Cached Assets
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Pre-cached static HTML, CSS bundles, JavaScript modules, fonts, and icons ensure that all 216 tools load in milliseconds and remain operational without an internet connection.
        </p>

        {cacheNames.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {cacheNames.map((name) => (
              <span
                key={name}
                className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Critical Storage Education / Disclaimer */}
      <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/40 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Important Browser Storage Limitations
        </div>
        <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
          Browser-based storage (LocalStorage and IndexedDB) is tied directly to your browser profile on this machine. If you clear your browser cookies and site data, or if your operating system experiences critically low hard drive space, the browser may evict local records. <strong>Storage is never permanently guaranteed by browsers</strong>. We strongly recommend periodically using the <strong>Export Backup</strong> feature to download a permanent JSON copy of your records.
        </p>
      </div>
    </div>
  );
};
