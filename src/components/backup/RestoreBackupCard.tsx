import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Layers,
  Trash2,
  Sliders,
  CheckSquare,
  Square,
  ShieldCheck,
  FileArchive,
  FileCode,
  ArrowRight,
  Database
} from 'lucide-react';
import {
  RestoreValidationResult,
  RestoreMode,
  BackupCategoryKey,
  BackupCategoryCounts
} from '../../types/backup';
import {
  validateBackupFile,
  unlockEncryptedBackup,
  executeRestore
} from '../../utils/backupManager';

interface RestoreBackupCardProps {
  onRestoreComplete?: () => void;
}

export const RestoreBackupCard: React.FC<RestoreBackupCardProps> = ({
  onRestoreComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<RestoreValidationResult | null>(null);

  // Decryption state
  const [password, setPassword] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Restore options state
  const [restoreMode, setRestoreMode] = useState<RestoreMode>('merge');
  const [confirmReplace, setConfirmReplace] = useState(false);
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

  // Execution state
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreSummary, setRestoreSummary] = useState<{
    restoredCounts: BackupCategoryCounts;
    conflictsResolved: number;
    mode: RestoreMode;
  } | null>(null);
  const [restoreError, setRestoreError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (selectedFile: File) => {
    setFile(selectedFile);
    setValidationResult(null);
    setPassword('');
    setDecryptError('');
    setRestoreSummary(null);
    setRestoreError('');
    setIsValidating(true);

    try {
      let content: string | Uint8Array;
      if (selectedFile.name.toLowerCase().endsWith('.zip')) {
        const buffer = await selectedFile.arrayBuffer();
        content = new Uint8Array(buffer);
      } else {
        content = await selectedFile.text();
      }

      const result = await validateBackupFile(content, selectedFile.name);
      setValidationResult(result);
    } catch (err: any) {
      setValidationResult({
        isValid: false,
        isEncrypted: false,
        errors: [err.message || 'Failed to read backup file.'],
        warnings: [],
        categoryCounts: {
          notes: 0,
          tasks: 0,
          expenses: 0,
          habits: 0,
          goals: 0,
          events: 0,
          favorites: 0,
          recent: 0,
          settings: 0,
          toolStorage: 0,
          documents: 0,
          communication: 0,
          health: 0,
          travel: 0,
          home: 0
        },
        totalRecords: 0,
        estimatedSize: selectedFile.size,
        conflicts: {
          existingRecords: 0,
          incomingRecords: 0,
          overlapCount: 0
        }
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleUnlockEncrypted = async () => {
    if (!validationResult || !validationResult.encryptedContainer) return;
    if (!password) {
      setDecryptError('Please enter the backup password.');
      return;
    }

    setIsDecrypting(true);
    setDecryptError('');

    try {
      const unlockedResult = await unlockEncryptedBackup(
        validationResult.encryptedContainer,
        password
      );

      if (!unlockedResult.isValid) {
        setDecryptError(unlockedResult.errors.join(' '));
      } else {
        setValidationResult(unlockedResult);
      }
    } catch (err: any) {
      setDecryptError(err.message || 'Decryption failed. Incorrect password.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const toggleCategory = (key: BackupCategoryKey) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const selectAll = () => {
    const updated = { ...selectedCategories };
    (Object.keys(updated) as BackupCategoryKey[]).forEach((k) => (updated[k] = true));
    setSelectedCategories(updated);
  };

  const deselectAll = () => {
    const updated = { ...selectedCategories };
    (Object.keys(updated) as BackupCategoryKey[]).forEach((k) => (updated[k] = false));
    setSelectedCategories(updated);
  };

  const handleApplyRestore = async () => {
    if (!validationResult || !validationResult.payload) return;

    if (restoreMode === 'replace' && !confirmReplace) {
      setRestoreError('You must explicitly confirm before replacing existing data.');
      return;
    }

    const selectedKeys = (Object.keys(selectedCategories) as BackupCategoryKey[]).filter(
      (k) => selectedCategories[k]
    );

    if (selectedKeys.length === 0) {
      setRestoreError('Please select at least one category to restore.');
      return;
    }

    setIsRestoring(true);
    setRestoreError('');

    try {
      const result = await executeRestore(
        validationResult.payload,
        restoreMode,
        selectedKeys
      );

      setRestoreSummary({
        restoredCounts: result.restoredCounts,
        conflictsResolved: result.conflictsResolved,
        mode: restoreMode
      });

      if (onRestoreComplete) {
        onRestoreComplete();
      }
    } catch (err: any) {
      setRestoreError(err.message || 'Restoration failed.');
    } finally {
      setIsRestoring(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setValidationResult(null);
    setPassword('');
    setDecryptError('');
    setRestoreSummary(null);
    setRestoreError('');
    setConfirmReplace(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const categoryLabels: Record<BackupCategoryKey, string> = {
    notes: 'My Notes',
    tasks: 'My Tasks',
    expenses: 'My Expenses',
    habits: 'My Habits',
    goals: 'My Goals',
    events: 'Calendar Events',
    favorites: 'Bookmarked Tools',
    recent: 'Recently Used',
    settings: 'App Settings',
    toolStorage: 'Custom Tool Data',
    documents: 'Saved Document Drafts',
    communication: 'Communication & Contacts',
    health: 'Health & Wellness Records',
    travel: 'Travel & Navigation',
    home: 'Home & Household'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Restore From Backup
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Safely inspect, validate, and restore your notes, tasks, expenses, and settings from a
            LifeTools backup file (.json or .zip).
          </p>
        </div>
        {file && (
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start"
          >
            Load Another File
          </button>
        )}
      </div>

      {/* 1. Upload & Drag-and-Drop Area */}
      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-950/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.zip"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
            className="hidden"
          />
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Click to upload or drag & drop your backup file
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Supports standard LifeTools Universal Backup JSON files and ZIP packages.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5" /> .JSON
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FileArchive className="w-3.5 h-3.5" /> .ZIP
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> AES-256 Encrypted
            </span>
          </div>
        </div>
      )}

      {/* Validation in progress */}
      {isValidating && (
        <div className="p-8 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Verifying cryptographic integrity & inspecting archive contents...
          </p>
        </div>
      )}

      {/* Validation Failed */}
      {validationResult && !validationResult.isValid && !validationResult.isEncrypted && (
        <div className="p-5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            Invalid or Corrupted Backup File
          </div>
          <ul className="text-xs text-rose-700 dark:text-rose-400 list-disc list-inside space-y-1">
            {validationResult.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Encrypted File - Password Needed */}
      {validationResult && validationResult.isEncrypted && !validationResult.payload && (
        <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Password Protected Backup Detected
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This backup was encrypted with AES-256-GCM. Please enter your password to unlock.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlockEncrypted();
              }}
              placeholder="Enter backup password..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleUnlockEncrypted}
              disabled={isDecrypting || !password}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDecrypting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Decrypting...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock & Inspect</span>
                </>
              )}
            </button>
          </div>

          {decryptError && (
            <div className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{decryptError}</span>
            </div>
          )}
        </div>
      )}

      {/* Pre-Restore Inspection & Options (When payload is ready) */}
      {validationResult && validationResult.isValid && validationResult.payload && !restoreSummary && (
        <div className="space-y-6">
          {/* Manifest Inspector Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Archive Verified: {file?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Validated
                </span>
                {validationResult.isEncrypted && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Decrypted
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Export Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {validationResult.manifest?.exportedAt
                    ? new Date(validationResult.manifest.exportedAt).toLocaleDateString()
                    : 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total In Backup</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {validationResult.totalRecords} records
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">App Version</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  v{validationResult.manifest?.version || '1.0.0'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Integrity Checksum</span>
                <span
                  className="font-mono text-slate-800 dark:text-slate-200 truncate block"
                  title={validationResult.manifest?.checksum}
                >
                  {validationResult.manifest?.checksum
                    ? `${validationResult.manifest.checksum.slice(0, 10)}...`
                    : 'None'}
                </span>
              </div>
            </div>

            {/* Overlap / Conflict Notice */}
            {validationResult.conflicts.overlapCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Potential Overlap Detected:</strong> You already have{' '}
                  <span className="font-bold">{validationResult.conflicts.existingRecords}</span>{' '}
                  local records. This backup contains{' '}
                  <span className="font-bold">{validationResult.conflicts.incomingRecords}</span>{' '}
                  records. Choose a restoration mode below to manage how existing and incoming items
                  are handled.
                </div>
              </div>
            )}
          </div>

          {/* 2. Choose Restore Mode */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">
              Choose Restoration Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Merge Mode */}
              <div
                onClick={() => setRestoreMode('merge')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  restoreMode === 'merge'
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Merge (Recommended)
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Appends all incoming items safely. Duplicate IDs are automatically re-keyed so
                  no existing notes, tasks, or habits are ever overwritten or lost.
                </p>
              </div>

              {/* Replace Mode */}
              <div
                onClick={() => setRestoreMode('replace')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  restoreMode === 'replace'
                    ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-2 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Replace & Overwrite
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Clears selected local collections and replaces them entirely with the incoming
                  backup. Requires explicit danger confirmation.
                </p>
              </div>
            </div>

            {/* Replace Warning Confirmation */}
            {restoreMode === 'replace' && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-2">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Caution: Existing Local Data Will Be Erased!
                </div>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={confirmReplace}
                    onChange={(e) => setConfirmReplace(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <span>
                    I understand that this action is irreversible and existing records in selected
                    categories will be replaced.
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* 3. Selective Categories Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">
                Select Categories to Restore
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAll}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="font-medium text-slate-500 hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(validationResult.categoryCounts) as BackupCategoryKey[]).map((key) => {
                const count = validationResult.categoryCounts[key] || 0;
                const isChecked = !!selectedCategories[key];
                return (
                  <div
                    key={key}
                    onClick={() => toggleCategory(key)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none text-xs transition-colors ${
                      isChecked
                        ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10'
                        : 'border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {categoryLabels[key] || key}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {restoreError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{restoreError}</span>
            </div>
          )}

          {/* Apply Restore Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleApplyRestore}
              disabled={isRestoring || (restoreMode === 'replace' && !confirmReplace)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRestoring ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Restoring Data...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Restoration</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Restore Complete Summary */}
      {restoreSummary && (
        <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold text-base">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Data Restored Successfully!
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Your application state has been updated using <strong>{restoreSummary.mode}</strong> mode.
            {restoreSummary.conflictsResolved > 0 && (
              <span> {restoreSummary.conflictsResolved} duplicate IDs were safely re-keyed to prevent data loss.</span>
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            {Object.entries(restoreSummary.restoredCounts).map(([k, val]) => {
              if (val === 0) return null;
              return (
                <div
                  key={k}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 text-center"
                >
                  <span className="text-slate-400 block text-[11px]">
                    {categoryLabels[k as BackupCategoryKey] || k}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    +{val}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={resetAll}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Done / Restore Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
