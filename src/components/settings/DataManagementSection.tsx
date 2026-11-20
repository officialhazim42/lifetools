import React, { useState, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  FileCode2,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Clock,
  Database,
  ArrowRight
} from 'lucide-react';

export const DataManagementSection: React.FC = () => {
  const { settings, resetToDefaults, exportSettings, importSettings, isDirty } = useSettings();
  const { showToast } = useToast();
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = importSettings(text);
        if (res.success) {
          showToast('Settings configuration imported successfully!', 'success');
        } else {
          showToast(res.error || 'Failed to import settings file.', 'error');
        }
      } catch {
        showToast('Malformed JSON file.', 'error');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setIsResetDialogOpen(false);
    showToast('All settings restored to factory defaults.', 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-500" />
            Data Management
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Import, export, and reset your personalized configuration file.
          </p>
        </div>

        {/* Universal Backup & Restore System Hub Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              Universal Backup & Restore System
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
              Full Custody
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Need to export or restore all workspace notes, to-dos, financial expenses, habit streaks,
            and custom tool data? Access encrypted AES-256 exports, ZIP packages, and tabular CSV files.
          </p>
        </div>
        <a
          href="#/backup"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>Open Backup System</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 self-start sm:self-auto">
          {isDirty ? (
            <>
              <Save className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Saving changes...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Saved automatically</span>
            </>
          )}
        </div>
      </div>

      {/* Settings Backup & Restore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Export Settings */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              Export Settings Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Download your appearance, regional formats, notification channels, and personalization options as a lightweight JSON file.
            </p>
          </div>

          <button
            type="button"
            onClick={exportSettings}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Settings JSON
          </button>
        </div>

        {/* Import Settings */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-sky-500" />
              Import Settings Profile
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Restore your customized settings from an existing LifeTools settings JSON file.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Settings JSON
            </button>
          </div>
        </div>
      </div>

      {/* Factory Reset to Defaults */}
      <div className="p-5 sm:p-6 bg-rose-50/40 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Reset All Preferences to Defaults
            </h3>
            <p className="text-xs text-rose-900/80 dark:text-rose-300/80 max-w-xl leading-relaxed">
              Restore factory appearance, regional formats, and notifications. This only resets settings preferences and will NOT erase your saved notes, tasks, or financial ledger.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsResetDialogOpen(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-rose-600/20 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Reset Settings
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Reset Settings to Defaults?"
        message="This will reset theme, font scaling, currency, and notifications to their original settings. Your workspace notes and tasks will remain untouched."
        confirmText="Yes, Reset Settings"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
};
