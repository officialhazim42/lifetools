import React from 'react';
import {
  Download,
  Upload,
  Calendar,
  HardDrive,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileArchive,
  Lock
} from 'lucide-react';
import { BackupCategoryCounts } from '../../types/backup';

interface BackupDashboardProps {
  lastBackupDate: string | null;
  counts: BackupCategoryCounts;
  totalRecords: number;
  estimatedSizeBytes: number;
  onNavigateToCreate: () => void;
  onNavigateToRestore: () => void;
}

export const BackupDashboard: React.FC<BackupDashboardProps> = ({
  lastBackupDate,
  counts,
  totalRecords,
  estimatedSizeBytes,
  onNavigateToCreate,
  onNavigateToRestore
}) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formattedDate = lastBackupDate
    ? new Date(lastBackupDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Never';

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Last Backup Date */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Last Backup Created
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Total Stored Records */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Total Stored Records
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {totalRecords}
            </span>
          </div>
        </div>

        {/* Estimated Backup Size */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Estimated Archive Size
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {formatBytes(estimatedSizeBytes)}
            </span>
          </div>
        </div>

        {/* Backup Status */}
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
              Storage Health
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 100% Operational
            </span>
          </div>
        </div>
      </div>

      {/* Two Prominent Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Action 1: Create Backup */}
        <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-white to-transparent dark:from-emerald-950/30 dark:via-slate-900 dark:to-transparent rounded-2xl border-2 border-emerald-500/30 p-6 flex flex-col justify-between space-y-5 shadow-sm">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Create Data Backup
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Export your personal notes, tasks, expenses, habit tracking streaks, goals, calendar items, preferences, and custom checklists into a secure, portable file.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">JSON Archive</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">ZIP Package</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">AES-256-GCM Password Encryption</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToCreate}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Create Universal Backup</span>
          </button>
        </div>

        {/* Action 2: Restore Backup */}
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 via-white to-transparent dark:from-indigo-950/30 dark:via-slate-900 dark:to-transparent rounded-2xl border-2 border-indigo-500/30 p-6 flex flex-col justify-between space-y-5 shadow-sm">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Restore from Backup
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Import and restore data from a previously generated JSON or ZIP backup. Choose between non-destructive safe Merge, clean Replace, or Selective Category restoration.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Safe Merge</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Conflict Detection</span>
              <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Full Data Preview</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToRestore}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Restore From Archive</span>
          </button>
        </div>
      </div>

      {/* Available Data Breakdown Table */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs text-slate-400">
          Stored Data Breakdown across Collections
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { label: 'My Notes', count: counts.notes, store: 'IndexedDB' },
            { label: 'My Tasks', count: counts.tasks, store: 'IndexedDB' },
            { label: 'My Expenses', count: counts.expenses, store: 'IndexedDB' },
            { label: 'My Habits', count: counts.habits, store: 'IndexedDB' },
            { label: 'My Goals', count: counts.goals, store: 'IndexedDB' },
            { label: 'Calendar Events', count: counts.events, store: 'IndexedDB' },
            { label: 'Favorites', count: counts.favorites, store: 'LocalStorage' },
            { label: 'Recent Tools', count: counts.recent, store: 'LocalStorage' },
            { label: 'Settings Profile', count: counts.settings, store: 'LocalStorage' },
            { label: 'Tool Storage', count: counts.toolStorage, store: 'LocalStorage' }
          ].map((item) => (
            <div
              key={item.label}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40"
            >
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate font-medium">
                {item.label}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {item.count}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.store}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
