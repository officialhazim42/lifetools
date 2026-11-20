import React, { useState, useEffect, useCallback } from 'react';
import { SEO } from '../components/common/SEO';
import { BackupDashboard } from '../components/backup/BackupDashboard';
import { CreateBackupCard } from '../components/backup/CreateBackupCard';
import { RestoreBackupCard } from '../components/backup/RestoreBackupCard';
import { TabularExportCard } from '../components/backup/TabularExportCard';
import { BackupHistoryCard } from '../components/backup/BackupHistoryCard';
import { BackupReminderCard } from '../components/backup/BackupReminderCard';
import { BackupCategoryCounts, BackupHistoryEntry } from '../types/backup';
import {
  getStoredRecordCounts,
  getBackupHistory,
  getReminderConfig,
  isBackupReminderDue
} from '../utils/backupManager';
import {
  ShieldCheck,
  Download,
  Upload,
  LayoutDashboard,
  FileSpreadsheet,
  History,
  Lock,
  HardDrive,
  Bell
} from 'lucide-react';

interface BackupRestorePageProps {
  initialTab?: string;
}

export type BackupTabId = 'dashboard' | 'create' | 'restore' | 'exports' | 'history';

export const BackupRestorePage: React.FC<BackupRestorePageProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<BackupTabId>(() => {
    if (
      initialTab === 'dashboard' ||
      initialTab === 'create' ||
      initialTab === 'restore' ||
      initialTab === 'exports' ||
      initialTab === 'history'
    ) {
      return initialTab;
    }
    return 'dashboard';
  });

  const [counts, setCounts] = useState<BackupCategoryCounts>({
    notes: 0,
    tasks: 0,
    expenses: 0,
    habits: 0,
    goals: 0,
    events: 0,
    favorites: 0,
    recent: 0,
    settings: 0,
    toolStorage: 0
  });

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [estimatedSizeBytes, setEstimatedSizeBytes] = useState<number>(0);
  const [history, setHistory] = useState<BackupHistoryEntry[]>([]);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [isReminderDue, setIsReminderDue] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      const currentCounts = await getStoredRecordCounts();
      setCounts(currentCounts);

      const total = Object.values(currentCounts).reduce((a, b) => a + b, 0);
      setTotalRecords(total);

      // Estimate ~280 bytes per average record + 1.5KB overhead
      setEstimatedSizeBytes(Math.max(1536, total * 280));

      const hist = getBackupHistory();
      setHistory(hist);

      const rem = getReminderConfig();
      setLastBackupDate(rem.lastBackupDate || (hist.length > 0 ? hist[0].date : null));

      setIsReminderDue(isBackupReminderDue());
    } catch {
      // fallback
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, activeTab]);

  useEffect(() => {
    if (
      initialTab &&
      ['dashboard', 'create', 'restore', 'exports', 'history'].includes(initialTab)
    ) {
      setActiveTab(initialTab as BackupTabId);
    }
  }, [initialTab]);

  const handleTabChange = (tabId: BackupTabId) => {
    setActiveTab(tabId);
    window.location.hash = `#/backup/${tabId}`;
  };

  const tabs: { id: BackupTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'create', label: 'Create Backup', icon: Download },
    { id: 'restore', label: 'Restore Backup', icon: Upload },
    { id: 'exports', label: 'Tabular & CSV', icon: FileSpreadsheet },
    {
      id: 'history',
      label: 'History & Reminders',
      icon: History,
      badge: isReminderDue ? 'Due' : history.length > 0 ? history.length : undefined
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      <SEO
        title="Universal Backup & Restore — Private Data Custody | LifeTools"
        description="Comprehensive client-side backup and restore system for LifeTools. Export your notes, tasks, expenses, and settings to JSON, ZIP, CSV, or AES-256 encrypted archives with zero server storage."
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Custody
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
              <Lock className="w-3.5 h-3.5" /> AES-256-GCM Encryption
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-100 border border-white/20">
              <HardDrive className="w-3.5 h-3.5" /> Zero Server Uploads
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Universal Backup & Restore System
          </h1>

          <p className="text-emerald-50 text-sm leading-relaxed">
            Your data belongs entirely to you. Export complete workspaces, notes, tasks, expenses,
            and personal configurations into open-standard JSON, ZIP bundles, or spreadsheets.
            Restore at any time with cryptographic verification and conflict resolution.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-emerald-400 dark:text-white' : 'text-slate-400'}`}
                />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      tab.badge === 'Due'
                        ? 'bg-amber-400 text-slate-900 animate-pulse'
                        : isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="min-h-[480px]">
        {activeTab === 'dashboard' && (
          <BackupDashboard
            lastBackupDate={lastBackupDate}
            counts={counts}
            totalRecords={totalRecords}
            estimatedSizeBytes={estimatedSizeBytes}
            onNavigateToCreate={() => handleTabChange('create')}
            onNavigateToRestore={() => handleTabChange('restore')}
          />
        )}

        {activeTab === 'create' && (
          <CreateBackupCard
            counts={counts}
            onBackupCreated={() => loadData()}
          />
        )}

        {activeTab === 'restore' && (
          <RestoreBackupCard
            onRestoreComplete={() => loadData()}
          />
        )}

        {activeTab === 'exports' && (
          <TabularExportCard
            counts={counts}
            onExport={() => loadData()}
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <BackupReminderCard onConfigChanged={() => loadData()} />
            <BackupHistoryCard
              history={history}
              onHistoryCleared={() => loadData()}
            />
          </div>
        )}
      </div>
    </div>
  );
};
