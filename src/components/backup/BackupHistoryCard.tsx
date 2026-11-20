import React, { useState } from 'react';
import {
  History,
  Trash2,
  Lock,
  Unlock,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { BackupHistoryEntry } from '../../types/backup';
import { clearBackupHistory } from '../../utils/backupManager';

interface BackupHistoryCardProps {
  history: BackupHistoryEntry[];
  onHistoryCleared?: () => void;
}

export const BackupHistoryCard: React.FC<BackupHistoryCardProps> = ({
  history,
  onHistoryCleared
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatBadge = (fmt: string) => {
    switch (fmt) {
      case 'json':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            <FileCode className="w-3 h-3" /> JSON
          </span>
        );
      case 'zip':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
            <FileArchive className="w-3 h-3" /> ZIP
          </span>
        );
      case 'csv':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <FileSpreadsheet className="w-3 h-3" /> CSV
          </span>
        );
      case 'txt':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
            <FileText className="w-3 h-3" /> TXT
          </span>
        );
      default:
        return <span className="uppercase text-xs font-mono">{fmt}</span>;
    }
  };

  const handleClearHistory = () => {
    clearBackupHistory();
    setShowClearConfirm(false);
    if (onHistoryCleared) {
      onHistoryCleared();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            Backup History Log
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Local activity log of exported backups and downloaded reports on this browser.
          </p>
        </div>

        {history.length > 0 && !showClearConfirm && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors self-start"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Log
          </button>
        )}

        {showClearConfirm && (
          <div className="flex items-center gap-2 self-start">
            <span className="text-xs text-rose-600 font-medium">Clear history?</span>
            <button
              type="button"
              onClick={handleClearHistory}
              className="text-xs font-bold text-white bg-rose-600 px-2.5 py-1 rounded-md hover:bg-rose-700"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShowClearConfirm(false)}
              className="text-xs text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="p-10 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Previous Backups Recorded
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Exports created on this machine will appear in this log for your records.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Security</th>
                <th className="py-3 px-3">Size</th>
                <th className="py-3 px-3">Scope / Items</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                    {new Date(entry.date).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getFormatBadge(entry.format)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {entry.isEncrypted ? (
                      <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                        <Lock className="w-3.5 h-3.5" /> AES-256
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatBytes(entry.sizeBytes)}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 truncate max-w-xs">
                    {entry.categories.join(', ')}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
