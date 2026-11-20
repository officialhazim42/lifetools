import React, { useState, useEffect } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { useRecentTools } from '../../context/RecentToolsContext';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { workspaceDB } from '../../utils/workspaceDB';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  ShieldCheck,
  Trash2,
  Download,
  Database,
  Lock,
  FileText,
  Star,
  Clock,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export const PrivacySecuritySection: React.FC = () => {
  const { favorites } = useFavorites();
  const { recentTools, clearRecentTools } = useRecentTools();
  const { showToast } = useToast();
  const { settings } = useSettings();

  // Storage metrics state
  const [dbCounts, setDbCounts] = useState({
    notes: 0,
    tasks: 0,
    expenses: 0,
    habits: 0,
    goals: 0,
    events: 0
  });

  const [showPrivacyInfoModal, setShowPrivacyInfoModal] = useState(false);
  const [showStorageBreakdownModal, setShowStorageBreakdownModal] = useState(false);

  // Dialog states
  const [activeDialog, setActiveDialog] = useState<
    'favorites' | 'recent' | 'workspace' | 'notes' | null
  >(null);

  const refreshCounts = async () => {
    try {
      const [notes, tasks, expenses, habits, goals, events] = await Promise.all([
        workspaceDB.getNotes(),
        workspaceDB.getTasks(),
        workspaceDB.getExpenses(),
        workspaceDB.getHabits(),
        workspaceDB.getGoals(),
        workspaceDB.getEvents()
      ]);
      setDbCounts({
        notes: notes.length,
        tasks: tasks.length,
        expenses: expenses.length,
        habits: habits.length,
        goals: goals.length,
        events: events.length
      });
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  // Handlers
  const handleClearFavorites = () => {
    try {
      localStorage.removeItem('lifetools-favorites');
      window.dispatchEvent(new Event('storage'));
      showToast('All bookmarked favorites have been cleared.', 'info');
      setActiveDialog(null);
      // reload or trigger state refresh
      setTimeout(() => window.location.reload(), 400);
    } catch {
      showToast('Failed to clear favorites.', 'error');
    }
  };

  const handleClearRecent = () => {
    try {
      clearRecentTools();
      showToast('Recently used tools history cleared.', 'info');
      setActiveDialog(null);
    } catch {
      showToast('Failed to clear recent history.', 'error');
    }
  };

  const handleClearWorkspace = async () => {
    try {
      await workspaceDB.clearAllWorkspaceData();
      await refreshCounts();
      showToast('All Workspace data has been permanently cleared.', 'info');
      setActiveDialog(null);
    } catch {
      showToast('Failed to clear workspace data.', 'error');
    }
  };

  const handleClearNotes = async () => {
    try {
      await workspaceDB.clearNotes();
      await refreshCounts();
      showToast('Local notes have been cleared.', 'info');
      setActiveDialog(null);
    } catch {
      showToast('Failed to clear notes.', 'error');
    }
  };

  const handleExportAllData = async () => {
    try {
      const workspaceBackup = await workspaceDB.exportBackup();
      const unifiedBackup = {
        appName: 'LifeTools',
        exportedAt: new Date().toISOString(),
        version: '1.2.0',
        settings,
        favorites: JSON.parse(localStorage.getItem('lifetools-favorites') || '[]'),
        recentTools: JSON.parse(localStorage.getItem('lifetools-recent') || '[]'),
        workspace: workspaceBackup.data
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(unifiedBackup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `lifetools_full_data_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('Complete personal data archive exported successfully.', 'success');
    } catch (err: any) {
      showToast('Export failed: ' + err.message, 'error');
    }
  };

  const totalWorkspaceItems =
    dbCounts.notes +
    dbCounts.tasks +
    dbCounts.expenses +
    dbCounts.habits +
    dbCounts.goals +
    dbCounts.events;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-emerald-500" />
          Privacy & Security
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage local device storage, wipe sensitive cached data, and export complete personal archives.
        </p>
      </div>

      {/* Security Architecture Guarantee Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
            Zero-Server Security Model
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
          LifeTools is 100% client-side. We do not operate user databases, telemetry trackers, or cloud analytics. All notes, financial ledgers, calculations, and task lists live solely inside your browser's local sandbox.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowPrivacyInfoModal(true)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            View Complete Privacy Manifesto
          </button>
          <button
            type="button"
            onClick={() => setShowStorageBreakdownModal(true)}
            className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer flex items-center gap-1"
          >
            <Database className="w-3.5 h-3.5" />
            Inspect Local Storage Allocation
          </button>
        </div>
      </div>

      {/* Unified Personal Data Export */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              Unified Personal Data Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              Export an unencrypted, portable JSON archive containing your configured settings, favorites, recent tools, notes, tasks, expenses, habits, goals, and calendar events.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportAllData}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            Export Everything (JSON)
          </button>
        </div>
      </div>

      {/* Destructive Storage Operations (with Confirmations) */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Data Deletion & Cleanup Controls
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Permanently remove cached preferences or structured workspace entries from this device. All destructive operations require confirmation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Clear Favorites */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                Clear Favorites
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {favorites.length} bookmarked {favorites.length === 1 ? 'tool' : 'tools'}
              </div>
            </div>
            <button
              type="button"
              disabled={favorites.length === 0}
              onClick={() => setActiveDialog('favorites')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Clear Recently Used */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Clear Recently Used
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {recentTools.length} recent tool logs
              </div>
            </div>
            <button
              type="button"
              disabled={recentTools.length === 0}
              onClick={() => setActiveDialog('recent')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Clear Local Notes */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                Clear Local Notes
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {dbCounts.notes} notes in IndexedDB
              </div>
            </div>
            <button
              type="button"
              disabled={dbCounts.notes === 0}
              onClick={() => setActiveDialog('notes')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Clear All Workspace Data */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/30 dark:bg-rose-950/20 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <Trash2 className="w-3.5 h-3.5" />
                Clear All Workspace
              </div>
              <div className="text-[11px] text-rose-500/80 mt-0.5">
                {totalWorkspaceItems} total records across 6 stores
              </div>
            </div>
            <button
              type="button"
              disabled={totalWorkspaceItems === 0}
              onClick={() => setActiveDialog('workspace')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
            >
              Wipe
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={activeDialog === 'favorites'}
        title="Clear All Favorites?"
        message="This will remove all starred tools from your bookmarks. You will start with an empty Favorites list."
        confirmText="Yes, Clear Favorites"
        isDanger={true}
        onConfirm={handleClearFavorites}
        onCancel={() => setActiveDialog(null)}
      />

      <ConfirmDialog
        isOpen={activeDialog === 'recent'}
        title="Clear Recently Used History?"
        message="This will erase your recent tools activity log. You will start with a fresh history."
        confirmText="Yes, Clear History"
        isDanger={true}
        onConfirm={handleClearRecent}
        onCancel={() => setActiveDialog(null)}
      />

      <ConfirmDialog
        isOpen={activeDialog === 'notes'}
        title="Clear All Local Notes?"
        message="This will permanently delete all notes saved in My Notes from this browser. This action cannot be undone."
        confirmText="Yes, Delete Notes"
        isDanger={true}
        onConfirm={handleClearNotes}
        onCancel={() => setActiveDialog(null)}
      />

      <ConfirmDialog
        isOpen={activeDialog === 'workspace'}
        title="Wipe Entire Workspace Data?"
        message="This will permanently delete all Notes, Tasks, Expenses, Habits, Goals, and Calendar entries from IndexedDB on this device. Make sure you have exported a backup first."
        confirmText="Yes, Wipe Workspace"
        isDanger={true}
        onConfirm={handleClearWorkspace}
        onCancel={() => setActiveDialog(null)}
      />

      {/* Privacy Manifesto Modal */}
      {showPrivacyInfoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowPrivacyInfoModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                LifeTools Privacy Manifesto
              </h3>
              <button
                type="button"
                onClick={() => setShowPrivacyInfoModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
              <p>
                <strong>Privacy by Architecture:</strong> LifeTools does not transmit personal data, uploaded photos, PDF pages, secret passwords, or notes to any remote server. Everything is evaluated locally on your device.
              </p>
              <p>
                <strong>No Mandatory Accounts:</strong> You will never be asked to sign up with an email address, link a phone number, or log in with social media.
              </p>
              <p>
                <strong>No Third-Party Ad Pixels:</strong> We do not inject Google Tag Manager, Facebook Pixel, Hotjar, or telemetry scripts.
              </p>
              <p>
                <strong>Full Data Portability:</strong> Every financial ledger and workspace module provides instant CSV and JSON export options so you retain total custody.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacyInfoModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Storage Breakdown Modal */}
      {showStorageBreakdownModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowStorageBreakdownModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-500" />
                Local Storage Allocation
              </h3>
              <button
                type="button"
                onClick={() => setShowStorageBreakdownModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">localStorage (Settings)</span>
                <span className="font-semibold text-emerald-500">Active</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">localStorage (Favorites)</span>
                <span className="font-semibold">{favorites.length} entries</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">localStorage (Recent)</span>
                <span className="font-semibold">{recentTools.length} entries</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">IndexedDB (Notes)</span>
                <span className="font-semibold">{dbCounts.notes} notes</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">IndexedDB (Tasks)</span>
                <span className="font-semibold">{dbCounts.tasks} tasks</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">IndexedDB (Expenses)</span>
                <span className="font-semibold">{dbCounts.expenses} records</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">IndexedDB (Habits)</span>
                <span className="font-semibold">{dbCounts.habits} habits</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-mono text-slate-500">IndexedDB (Goals)</span>
                <span className="font-semibold">{dbCounts.goals} goals</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-mono text-slate-500">IndexedDB (Events)</span>
                <span className="font-semibold">{dbCounts.events} events</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowStorageBreakdownModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
