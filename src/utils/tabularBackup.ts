/**
 * Tabular (CSV) and Plain Text (TXT) Exporters for LifeTools Backups
 */

import { UniversalBackupPayload } from '../types/backup';

function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(cells: any[]): string {
  return cells.map(escapeCsvCell).join(',');
}

/**
 * Generates structured CSV for My Expenses.
 */
export function generateExpensesCsv(expenses: any[]): string {
  const headers = ['Date', 'Title', 'Amount', 'Currency', 'Category', 'Payment Method', 'Notes', 'Created At'];
  const rows = (expenses || []).map((e) => [
    e.date || '',
    e.title || '',
    e.amount !== undefined ? e.amount : '',
    e.currency || 'INR',
    e.category || '',
    e.paymentMethod || '',
    e.notes || '',
    e.createdAt || ''
  ]);

  return [toCsvRow(headers), ...rows.map(toCsvRow)].join('\r\n');
}

/**
 * Generates structured CSV for My Tasks.
 */
export function generateTasksCsv(tasks: any[]): string {
  const headers = ['Title', 'Priority', 'Status', 'Due Date', 'Category', 'Description', 'Created At'];
  const rows = (tasks || []).map((t) => [
    t.title || '',
    t.priority || 'Medium',
    t.completed ? 'Completed' : 'Pending',
    t.dueDate || '',
    t.category || '',
    t.description || '',
    t.createdAt || ''
  ]);

  return [toCsvRow(headers), ...rows.map(toCsvRow)].join('\r\n');
}

/**
 * Generates structured CSV for My Notes.
 */
export function generateNotesCsv(notes: any[]): string {
  const headers = ['Title', 'Category', 'Pinned', 'Color', 'Created At', 'Updated At', 'Content'];
  const rows = (notes || []).map((n) => [
    n.title || '',
    n.category || '',
    n.pinned ? 'Yes' : 'No',
    n.color || 'default',
    n.createdAt || '',
    n.updatedAt || '',
    n.content || ''
  ]);

  return [toCsvRow(headers), ...rows.map(toCsvRow)].join('\r\n');
}

/**
 * Generates structured CSV for My Habits.
 */
export function generateHabitsCsv(habits: any[]): string {
  const headers = ['Habit Title', 'Category', 'Frequency', 'Target Days Per Week', 'Current Streak', 'Best Streak', 'Total Checkins'];
  const rows = (habits || []).map((h) => [
    h.title || '',
    h.category || '',
    h.frequency || 'daily',
    h.targetDaysPerWeek !== undefined ? h.targetDaysPerWeek : 7,
    h.streak || 0,
    h.bestStreak || 0,
    Array.isArray(h.completedDates) ? h.completedDates.length : 0
  ]);

  return [toCsvRow(headers), ...rows.map(toCsvRow)].join('\r\n');
}

/**
 * Generates a human-readable Plain Text (TXT) document summarizing all user data.
 */
export function generateReadableTxtSummary(payload: UniversalBackupPayload): string {
  const { manifest, data } = payload;
  const lines: string[] = [];

  lines.push('================================================================');
  lines.push('              LIFETOOLS UNIVERSAL DATA ARCHIVE                  ');
  lines.push('================================================================');
  lines.push(`Exported On:   ${manifest.exportedAt}`);
  lines.push(`App Version:   LifeTools ${manifest.version}`);
  lines.push(`Total Records: ${manifest.totalRecords}`);
  lines.push('Platform:      https://lifetools.app (Zero-Server, 100% Client-Side)');
  lines.push('----------------------------------------------------------------\n');

  // Notes
  if (data.notes && data.notes.length > 0) {
    lines.push(`## MY NOTES (${data.notes.length} Records)`);
    lines.push('----------------------------------------------------------------');
    data.notes.forEach((note, idx) => {
      lines.push(`[Note ${idx + 1}] ${note.title} ${note.pinned ? '(★ Pinned)' : ''}`);
      lines.push(`Category: ${note.category || 'General'} | Created: ${note.createdAt}`);
      lines.push(`${note.content}\n`);
    });
  }

  // Tasks
  if (data.tasks && data.tasks.length > 0) {
    lines.push(`## MY TASKS (${data.tasks.length} Records)`);
    lines.push('----------------------------------------------------------------');
    data.tasks.forEach((task, idx) => {
      const status = task.completed ? '[X] COMPLETED' : '[ ] PENDING';
      lines.push(`${idx + 1}. ${status} ${task.title} (Priority: ${task.priority})`);
      if (task.dueDate) lines.push(`   Due: ${task.dueDate}`);
      if (task.category) lines.push(`   Category: ${task.category}`);
      if (task.description) lines.push(`   Details: ${task.description}`);
      lines.push('');
    });
  }

  // Expenses
  if (data.expenses && data.expenses.length > 0) {
    lines.push(`## MY EXPENSES (${data.expenses.length} Records)`);
    lines.push('----------------------------------------------------------------');
    let totalSum = 0;
    data.expenses.forEach((e) => {
      const amt = Number(e.amount) || 0;
      totalSum += amt;
      lines.push(`- ${e.date || ''} | ${e.currency || 'INR'} ${amt.toFixed(2)} | ${e.title} (${e.category}) [${e.paymentMethod || 'UPI'}]`);
    });
    lines.push(`\nTotal Recorded Expenses: INR ${totalSum.toFixed(2)}\n`);
  }

  // Habits
  if (data.habits && data.habits.length > 0) {
    lines.push(`## MY HABITS (${data.habits.length} Records)`);
    lines.push('----------------------------------------------------------------');
    data.habits.forEach((h) => {
      lines.push(`- ${h.title} (${h.category || 'Personal'})`);
      lines.push(`  Current Streak: ${h.streak || 0} days | Best Streak: ${h.bestStreak || 0} days`);
      lines.push(`  Total Check-ins: ${Array.isArray(h.completedDates) ? h.completedDates.length : 0}`);
    });
    lines.push('');
  }

  // Goals
  if (data.goals && data.goals.length > 0) {
    lines.push(`## MY GOALS (${data.goals.length} Records)`);
    lines.push('----------------------------------------------------------------');
    data.goals.forEach((g) => {
      lines.push(`- ${g.title} [${g.progress}% Complete] Status: ${g.status}`);
      if (g.targetDate) lines.push(`  Target Date: ${g.targetDate}`);
    });
    lines.push('');
  }

  // Events
  if (data.events && data.events.length > 0) {
    lines.push(`## CALENDAR EVENTS (${data.events.length} Records)`);
    lines.push('----------------------------------------------------------------');
    data.events.forEach((ev) => {
      lines.push(`- ${ev.date} ${ev.time || ''} | ${ev.title} (${ev.category})`);
    });
    lines.push('');
  }

  lines.push('================================================================');
  lines.push('LifeTools — Everything You Need. All in One Place.');
  lines.push('================================================================');

  return lines.join('\n');
}
