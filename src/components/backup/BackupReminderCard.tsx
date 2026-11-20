import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  ShieldAlert,
  CheckCircle2,
  Settings2
} from 'lucide-react';
import { BackupReminderConfig, BackupReminderFrequency } from '../../types/backup';
import {
  getReminderConfig,
  updateReminderConfig,
  isBackupReminderDue
} from '../../utils/backupManager';

interface BackupReminderCardProps {
  onConfigChanged?: () => void;
}

export const BackupReminderCard: React.FC<BackupReminderCardProps> = ({
  onConfigChanged
}) => {
  const [config, setConfig] = useState<BackupReminderConfig>(getReminderConfig());
  const [isDue, setIsDue] = useState<boolean>(isBackupReminderDue());

  useEffect(() => {
    setConfig(getReminderConfig());
    setIsDue(isBackupReminderDue());
  }, []);

  const handleFrequencyChange = (freq: BackupReminderFrequency) => {
    updateReminderConfig({ frequency: freq });
    setConfig((prev) => ({ ...prev, frequency: freq }));
    setIsDue(isBackupReminderDue());
    if (onConfigChanged) {
      onConfigChanged();
    }
  };

  const getNextBackupDueDate = (): string => {
    if (config.frequency === 'manual' || !config.lastBackupDate) {
      return 'Manual Schedule';
    }
    const lastDate = new Date(config.lastBackupDate);
    const daysToAdd = config.frequency === 'weekly' ? 7 : 30;
    const nextDate = new Date(lastDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return nextDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-500" />
            Backup Reminders & Frequency
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure periodic reminders so you never forget to safeguard your local workspace data.
          </p>
        </div>

        {isDue && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold animate-pulse">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Backup Due!
          </div>
        )}
      </div>

      {isDue && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold">A scheduled backup is recommended</p>
            <p>
              It has been over{' '}
              {config.frequency === 'weekly' ? '7 days' : '30 days'} since your last recorded backup.
              Safeguard your recent notes, tasks, and expenses by downloading a fresh archive.
            </p>
          </div>
        </div>
      )}

      {/* Frequency selector buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 'weekly' as BackupReminderFrequency,
            title: 'Weekly Reminder',
            desc: 'Prompts every 7 days. Ideal for active daily productivity and tracking.'
          },
          {
            id: 'monthly' as BackupReminderFrequency,
            title: 'Monthly Reminder',
            desc: 'Prompts every 30 days. Balanced protection for casual users.'
          },
          {
            id: 'manual' as BackupReminderFrequency,
            title: 'Manual Only',
            desc: 'No reminders. Back up your data on-demand whenever you choose.'
          }
        ].map((item) => {
          const isSelected = config.frequency === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleFrequencyChange(item.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.title}
                </span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Last Successful Backup</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {config.lastBackupDate
              ? new Date(config.lastBackupDate).toLocaleDateString()
              : 'Never'}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">Next Recommended Date</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono">
            {getNextBackupDueDate()}
          </span>
        </div>
      </div>
    </div>
  );
};
