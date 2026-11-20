import React, { useState } from 'react';
import {
  Download,
  Shield,
  Lock,
  Unlock,
  CheckSquare,
  Square,
  FileCode,
  FileArchive,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Hash,
  Eye,
  EyeOff
} from 'lucide-react';
import { BackupCategoryCounts, BackupCategoryKey } from '../../types/backup';
import { createUniversalBackup, recordBackupHistory, updateReminderConfig } from '../../utils/backupManager';

interface CreateBackupCardProps {
  counts: BackupCategoryCounts;
  onBackupCreated?: () => void;
}

interface CategoryOption {
  key: BackupCategoryKey;
  label: string;
  description: string;
  count: number;
}

export const CreateBackupCard: React.FC<CreateBackupCardProps> = ({
  counts,
  onBackupCreated
}) => {
  const [format, setFormat] = useState<'json' | 'zip' | 'csv' | 'txt'>('json');
  const [selectedCategories, setSelectedCategories] = useState<Record<BackupCategoryKey, boolean>>({
    notes: true,
    tasks: true,
    expenses: true,
    habits: true,
    goals: true,
    events: true,
    favorites: true,
    recent: true,
    settings: true,
    toolStorage: true,
    documents: true,
    communication: true,
    health: true,
    travel: true,
    home: true
  });

  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    filename: string;
    size: string;
    checksum?: string;
  } | null>(null);

  const categoryOptions: CategoryOption[] = [
    { key: 'notes', label: 'My Notes', description: 'Workspace notes, rich text, and pinned entries', count: counts.notes },
    { key: 'tasks', label: 'My Tasks', description: 'To-dos, priorities, due dates, and checklist items', count: counts.tasks },
    { key: 'expenses', label: 'My Expenses', description: 'Personal finance expenses, amounts, and categories', count: counts.expenses },
    { key: 'habits', label: 'My Habits', description: 'Habit tracking streaks, frequencies, and logs', count: counts.habits },
    { key: 'goals', label: 'My Goals', description: 'Personal milestones, deadlines, and progress metrics', count: counts.goals },
    { key: 'events', label: 'My Calendar Events', description: 'Scheduled tasks, meetings, and calendar entries', count: counts.events },
    { key: 'favorites', label: 'Bookmarked Tools', description: 'Starred favorite tools across all categories', count: counts.favorites },
    { key: 'recent', label: 'Recently Used Tools', description: 'Usage history and quick launch access', count: counts.recent },
    { key: 'settings', label: 'Settings & Preferences', description: 'Theme, layout, regional currency, and app options', count: counts.settings },
    { key: 'toolStorage', label: 'Custom Tool Storage', description: 'Timetables, flashcards, grocery lists, and calculators', count: counts.toolStorage },
    { key: 'documents', label: 'Saved Document Drafts', description: 'Customized invoices, resumes, planners, and letters', count: counts.documents || 0 },
    { key: 'communication', label: 'Communication & Contacts', description: 'VIP contacts, message drafts, reminders, and notes', count: counts.communication || 0 },
    { key: 'health', label: 'Health & Wellness Records', description: 'Blood pressure, glucose logs, medications, and wellness history', count: counts.health || 0 },
    { key: 'travel', label: 'Travel & Navigation', description: 'Trips, itineraries, packing lists, bookings, and emergency cards', count: counts.travel || 0 },
    { key: 'home', label: 'Home & Household', description: 'Chores, inventories, shopping lists, maintenance, and property records', count: counts.home || 0 }
  ];

  const toggleCategory = (key: BackupCategoryKey) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectAll = () => {
    const updated = { ...selectedCategories };
    (Object.keys(updated) as BackupCategoryKey[]).forEach((k) => {
      updated[k] = true;
    });
    setSelectedCategories(updated);
  };

  const deselectAll = () => {
    const updated = { ...selectedCategories };
    (Object.keys(updated) as BackupCategoryKey[]).forEach((k) => {
      updated[k] = false;
    });
    setSelectedCategories(updated);
  };

  const selectedKeys = (Object.keys(selectedCategories) as BackupCategoryKey[]).filter(
    (k) => selectedCategories[k]
  );

  const selectedRecordCount = categoryOptions
    .filter((c) => selectedCategories[c.key])
    .reduce((sum, c) => sum + c.count, 0);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadBackup = async () => {
    setPasswordError('');

    if (selectedKeys.length === 0) {
      setPasswordError('Please select at least one data category to back up.');
      return;
    }

    if (isEncrypted) {
      if (!password || password.length < 6) {
        setPasswordError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError('Password confirmation does not match.');
        return;
      }
    }

    setIsGenerating(true);
    setSuccessInfo(null);

    try {
      const result = await createUniversalBackup({
        format,
        isEncrypted,
        password: isEncrypted ? password : undefined,
        selectedCategories: selectedKeys
      });

      // Trigger automatic browser file download
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Record in local history
      recordBackupHistory({
        date: new Date().toISOString(),
        format,
        isEncrypted,
        sizeBytes: result.sizeBytes,
        totalRecords: result.totalRecords,
        categories: selectedKeys,
        status: 'success'
      });

      // Update reminder tracker
      updateReminderConfig({ lastBackupDate: new Date().toISOString() });

      setSuccessInfo({
        filename: result.filename,
        size: formatBytes(result.sizeBytes),
        checksum: result.checksum
      });

      if (onBackupCreated) {
        onBackupCreated();
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to create backup.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Create Universal Backup
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Export your complete workspace, settings, and personal data directly from your browser.
          100% private and client-side.
        </p>
      </div>

      {/* 1. Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-900 dark:text-white block">
          1. Choose Backup Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'json',
              name: 'JSON Archive',
              tag: 'Recommended',
              desc: 'Official LifeTools Universal format with SHA-256 integrity checksum.',
              icon: FileCode,
              color: 'text-blue-500'
            },
            {
              id: 'zip',
              name: 'ZIP Package',
              tag: 'All-in-One',
              desc: 'Standard ZIP bundle containing JSON data, CSV spreadsheets & human summary.',
              icon: FileArchive,
              color: 'text-amber-500'
            },
            {
              id: 'csv',
              name: 'CSV Spreadsheets',
              tag: 'Excel / Sheets',
              desc: 'Expenses, tasks, notes, and habits organized in tabular comma-separated values.',
              icon: FileSpreadsheet,
              color: 'text-emerald-500'
            },
            {
              id: 'txt',
              name: 'Text Summary',
              tag: 'Human Readable',
              desc: 'Clean markdown text report readable in any text editor or note-taking tool.',
              icon: FileText,
              color: 'text-purple-500'
            }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = format === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormat(item.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-xs ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.tag}
                  </span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white text-sm">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selective Categories */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            2. Select Categories to Include ({selectedKeys.length} of {categoryOptions.length} Selected)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1"
            >
              Select All
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:underline px-2 py-1"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categoryOptions.map((cat) => {
            const isChecked = !!selectedCategories[cat.key];
            return (
              <div
                key={cat.key}
                onClick={() => toggleCategory(cat.key)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer select-none transition-colors ${
                  isChecked
                    ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
                }`}
              >
                <div className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950/50" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {cat.label}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {cat.count} {cat.count === 1 ? 'record' : 'records'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Password Protection & Encryption */}
      {(format === 'json' || format === 'zip') && (
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-500" />
              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-white block">
                  3. Encrypted Backup (AES-256-GCM)
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Protect your confidential data with high-grade password encryption.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isEncrypted}
              onClick={() => {
                setIsEncrypted(!isEncrypted);
                setPasswordError('');
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                isEncrypted ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEncrypted ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isEncrypted && (
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Backup Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a secure password..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password Recovery Warning */}
              <div className="flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-900/40">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">CRITICAL WARNING: </span>
                  Passwords are processed purely in your browser using PBKDF2 (100,000 rounds) and AES-256-GCM.
                  They are never sent to any server. If you forget or lose this password,{' '}
                  <span className="underline font-semibold">your backup cannot be recovered</span> by anyone.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {passwordError && (
        <div className="flex items-center gap-2 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl border border-rose-200 dark:border-rose-900/40">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}

      {/* Success Notification */}
      {successInfo && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Backup Archive Created & Downloaded Successfully!
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-4 pt-1">
            <span>
              <strong>File:</strong> {successInfo.filename}
            </span>
            <span>
              <strong>Size:</strong> {successInfo.size}
            </span>
            {successInfo.checksum && (
              <span className="font-mono truncate max-w-xs" title={successInfo.checksum}>
                <strong>SHA-256:</strong> {successInfo.checksum.slice(0, 16)}...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          Ready to export <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecordCount}</span>{' '}
          records across <span className="font-bold text-slate-800 dark:text-slate-200">{selectedKeys.length}</span>{' '}
          categories in <span className="font-semibold uppercase text-emerald-600 dark:text-emerald-400">{format}</span> format.
        </div>

        <button
          type="button"
          onClick={handleDownloadBackup}
          disabled={isGenerating || selectedKeys.length === 0}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Building Archive...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Generate & Download Backup</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
