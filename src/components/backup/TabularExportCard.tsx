import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle2,
  Table,
  CheckSquare,
  DollarSign,
  Activity,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { BackupCategoryCounts } from '../../types/backup';
import { workspaceDB } from '../../utils/workspaceDB';
import {
  generateExpensesCsv,
  generateTasksCsv,
  generateNotesCsv,
  generateHabitsCsv,
  generateReadableTxtSummary
} from '../../utils/tabularBackup';
import { collectBackupPayload, recordBackupHistory } from '../../utils/backupManager';

interface TabularExportCardProps {
  counts: BackupCategoryCounts;
  onExport?: () => void;
}

export const TabularExportCard: React.FC<TabularExportCardProps> = ({
  counts,
  onExport
}) => {
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const triggerDownload = (content: string, filename: string, type: 'csv' | 'txt') => {
    const mime = type === 'csv' ? 'text/csv;charset=utf-8;' : 'text/plain;charset=utf-8;';
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Record in backup history
    recordBackupHistory({
      date: new Date().toISOString(),
      format: type,
      isEncrypted: false,
      sizeBytes: blob.size,
      totalRecords: 1, // specific subset
      categories: [filename.replace(/\.csv|\.txt/i, '')],
      status: 'success'
    });

    if (onExport) {
      onExport();
    }
  };

  const handleExportExpensesCsv = async () => {
    setDownloadingKey('expenses');
    try {
      const expenses = await workspaceDB.getExpenses();
      const csv = generateExpensesCsv(expenses);
      const dateStr = new Date().toISOString().slice(0, 10);
      triggerDownload(csv, `lifetools_expenses_${dateStr}.csv`, 'csv');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleExportTasksCsv = async () => {
    setDownloadingKey('tasks');
    try {
      const tasks = await workspaceDB.getTasks();
      const csv = generateTasksCsv(tasks);
      const dateStr = new Date().toISOString().slice(0, 10);
      triggerDownload(csv, `lifetools_tasks_${dateStr}.csv`, 'csv');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleExportNotesCsv = async () => {
    setDownloadingKey('notes');
    try {
      const notes = await workspaceDB.getNotes();
      const csv = generateNotesCsv(notes);
      const dateStr = new Date().toISOString().slice(0, 10);
      triggerDownload(csv, `lifetools_notes_${dateStr}.csv`, 'csv');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleExportHabitsCsv = async () => {
    setDownloadingKey('habits');
    try {
      const habits = await workspaceDB.getHabits();
      const csv = generateHabitsCsv(habits);
      const dateStr = new Date().toISOString().slice(0, 10);
      triggerDownload(csv, `lifetools_habits_${dateStr}.csv`, 'csv');
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleExportReadableTxt = async () => {
    setDownloadingKey('txt');
    try {
      const payload = await collectBackupPayload();
      const txt = generateReadableTxtSummary(payload);
      const dateStr = new Date().toISOString().slice(0, 10);
      triggerDownload(txt, `lifetools_summary_${dateStr}.txt`, 'txt');
    } finally {
      setDownloadingKey(null);
    }
  };

  const exportOptions = [
    {
      id: 'expenses',
      title: 'Expenses CSV',
      description: 'Transaction records, dates, amounts, categories, and payment methods.',
      format: 'CSV (Comma Separated)',
      compatibility: 'Microsoft Excel, Google Sheets, Apple Numbers',
      count: counts.expenses,
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      action: handleExportExpensesCsv
    },
    {
      id: 'tasks',
      title: 'Tasks & To-Dos CSV',
      description: 'Task titles, priorities, completion status, due dates, and categories.',
      format: 'CSV (Comma Separated)',
      compatibility: 'Notion, Todoist, Spreadsheets, Asana',
      count: counts.tasks,
      icon: CheckSquare,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40',
      action: handleExportTasksCsv
    },
    {
      id: 'notes',
      title: 'Notes & Memos CSV',
      description: 'Note headlines, categories, pinned status, dates, and full text content.',
      format: 'CSV (Comma Separated)',
      compatibility: 'Obsidian, Logseq, Excel, Notion',
      count: counts.notes,
      icon: FileSpreadsheet,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40',
      action: handleExportNotesCsv
    },
    {
      id: 'habits',
      title: 'Habit Tracking CSV',
      description: 'Habit names, frequencies, streak lengths, and check-in counts.',
      format: 'CSV (Comma Separated)',
      compatibility: 'Google Sheets, Power BI, Excel',
      count: counts.habits,
      icon: Activity,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
      action: handleExportHabitsCsv
    },
    {
      id: 'txt',
      title: 'Human-Readable TXT Summary',
      description: 'A beautifully structured plain-text document covering all notes, tasks, expenses, and habits.',
      format: 'TXT (Plain Text Markdown)',
      compatibility: 'Any text editor, Notepad, TextEdit, VS Code',
      count: counts.notes + counts.tasks + counts.expenses + counts.habits,
      icon: FileText,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40',
      action: handleExportReadableTxt
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Table className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          Tabular & Readable Formats
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Export individual collections directly into formats ready for spreadsheet software,
          data analysis, and external note-taking tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exportOptions.map((opt) => {
          const Icon = opt.icon;
          const isLoading = downloadingKey === opt.id;
          return (
            <div
              key={opt.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl ${opt.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {opt.count} {opt.count === 1 ? 'record' : 'records'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {opt.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {opt.description}
                </p>

                <div className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Compatible with:</span>{' '}
                  {opt.compatibility}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {opt.format}
                </span>
                <button
                  type="button"
                  onClick={opt.action}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
