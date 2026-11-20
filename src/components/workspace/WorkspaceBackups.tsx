import React, { useState } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import { WorkspaceBackupPayload } from '../../types/workspace';
import {
  Download,
  Upload,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  FileText,
  CheckCircle2,
  X,
  FileCheck,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';

export const WorkspaceBackups: React.FC = () => {
  // Export selection options
  const [exportSelections, setExportSelections] = useState({
    notes: true,
    tasks: true,
    expenses: true,
    habits: true,
    goals: true,
    events: true
  });

  // Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedPayload, setParsedPayload] = useState<WorkspaceBackupPayload | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    counts: Record<string, number>;
  } | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleExportOption = (key: keyof typeof exportSelections) => {
    setExportSelections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportBackup = async () => {
    try {
      const backup = await workspaceDB.exportBackup(exportSelections);
      const jsonString = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `lifetools-workspace-backup-${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage('Backup successfully generated and downloaded!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(`Failed to export backup: ${err.message}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setValidationResult(null);
    setParsedPayload(null);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const result = workspaceDB.validateBackup(parsed);
        setValidationResult(result);
        if (result.isValid) {
          setParsedPayload(parsed);
        } else {
          setParsedPayload(null);
        }
      } catch (err: any) {
        setValidationResult({
          isValid: false,
          errors: ['File is not valid JSON format.'],
          counts: { notes: 0, tasks: 0, expenses: 0, habits: 0, goals: 0, events: 0 }
        });
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!parsedPayload || !validationResult?.isValid) return;

    if (
      replaceExisting &&
      !window.confirm(
        'WARNING: This will erase all existing workspace data and replace it with the backup. Are you sure you want to proceed?'
      )
    ) {
      return;
    }

    setIsImporting(true);
    try {
      await workspaceDB.importBackup(parsedPayload, replaceExisting);
      setSuccessMessage('Workspace backup imported successfully!');
      setImportFile(null);
      setParsedPayload(null);
      setValidationResult(null);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(`Import error: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearAll = async () => {
    const confirmation = window.prompt(
      'DANGER: To delete ALL your workspace notes, tasks, expenses, habits, goals, and calendar events, type "DELETE" below:'
    );

    if (confirmation === 'DELETE') {
      await workspaceDB.clearAllWorkspaceData();
      setSuccessMessage('All workspace data has been cleared.');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-500" />
          My Backups & Data Custody
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Export your complete workspace as a single portable JSON file, restore previous backups, or purge data.
        </p>
      </div>

      {/* Universal Backup & Restore System Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              Universal Backup & Restore Hub
            </span>
            <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-600 text-white">
              Full Suite
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Export all application data including custom tool storage, favorites, settings, AES-256 encryption, and ZIP bundles.
          </p>
        </div>
        <a
          href="#/backup"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>Open Universal Backup</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Privacy Guarantee Pill */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white">100% Local Backup Processing:</strong>{' '}
          Backups are assembled directly in your browser's memory and saved straight to your computer's Downloads folder. Your personal data is never transmitted to any cloud or third-party server.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EXPORT SECTION */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Export Workspace Data
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your workspace data into a standardized JSON file format compatible with LifeTools.
            </p>

            {/* Selective Export Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Selective Export:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    { key: 'notes', label: 'Notes' },
                    { key: 'tasks', label: 'Tasks' },
                    { key: 'expenses', label: 'Expenses' },
                    { key: 'habits', label: 'Habits' },
                    { key: 'goals', label: 'Goals' },
                    { key: 'events', label: 'Calendar Events' },
                  ] as const
                ).map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={exportSelections[opt.key]}
                      onChange={() => toggleExportOption(opt.key)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup JSON File</span>
          </button>
        </div>

        {/* IMPORT SECTION */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Restore From Backup
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore your notes, tasks, expenses, and goals from a previously exported LifeTools JSON backup file.
            </p>

            {/* File Upload Box */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-4 text-center hover:border-indigo-500 transition cursor-pointer relative">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <FileCheck className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block">
                {importFile ? importFile.name : 'Click or drop JSON backup here'}
              </span>
              <span className="text-[10px] text-slate-400">
                Validated locally before any data is modified
              </span>
            </div>

            {/* Validation Feedback */}
            {validationResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  validationResult.isValid
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {validationResult.isValid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Valid LifeTools Backup Detected
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Invalid Backup File
                    </>
                  )}
                </div>

                {validationResult.isValid ? (
                  <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1">
                    <span>Notes: {validationResult.counts.notes}</span>
                    <span>Tasks: {validationResult.counts.tasks}</span>
                    <span>Expenses: {validationResult.counts.expenses}</span>
                    <span>Habits: {validationResult.counts.habits}</span>
                    <span>Goals: {validationResult.counts.goals}</span>
                    <span>Events: {validationResult.counts.events}</span>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {validationResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Overwrite mode toggle */}
            {validationResult?.isValid && (
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span className="text-slate-600 dark:text-slate-300">
                  Replace all existing workspace data (otherwise merge)
                </span>
              </label>
            )}
          </div>

          <button
            onClick={handleExecuteImport}
            disabled={!validationResult?.isValid || isImporting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isImporting ? 'Restoring Data...' : 'Restore Backup Now'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Clear All Workspace Data
          </h4>
          <p className="text-xs text-red-600/80 dark:text-red-400 mt-0.5">
            Permanently delete all notes, tasks, expenses, habits, goals, and calendar items from this device.
          </p>
        </div>

        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0"
        >
          Purge All Workspace Data
        </button>
      </div>
    </div>
  );
};
