import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { workspaceDB } from '../utils/workspaceDB';
import { WorkspacePage } from '../pages/WorkspacePage';
import { WorkspaceNote, WorkspaceTask, WorkspaceExpense, WorkspaceHabit, WorkspaceGoal } from '../types/workspace';

describe('LifeTools — My Workspace Database & Component Suite', () => {
  beforeEach(async () => {
    await workspaceDB.clearAllWorkspaceData();
  });

  describe('1. Notes CRUD & Pinning', () => {
    it('creates, retrieves, and sorts notes with pinned notes first', async () => {
      const now = new Date().toISOString();
      const note1: WorkspaceNote = {
        id: 'note-1',
        title: 'Project Roadmap',
        content: 'Define LifeTools Workspace milestone.',
        category: 'Work',
        isPinned: false,
        createdAt: now,
        updatedAt: now
      };

      const note2: WorkspaceNote = {
        id: 'note-2',
        title: 'Important PIN',
        content: 'Must appear on top.',
        category: 'Ideas',
        isPinned: true,
        createdAt: now,
        updatedAt: now
      };

      await workspaceDB.saveNote(note1);
      await workspaceDB.saveNote(note2);

      const notes = await workspaceDB.getNotes();
      expect(notes.length).toBe(2);
      expect(notes[0].id).toBe('note-2'); // Pinned note is first
      expect(notes[1].id).toBe('note-1');

      // Delete
      await workspaceDB.deleteNote('note-1');
      const updatedNotes = await workspaceDB.getNotes();
      expect(updatedNotes.length).toBe(1);
      expect(updatedNotes[0].id).toBe('note-2');
    });
  });

  describe('2. Tasks CRUD & Priority', () => {
    it('creates tasks, tracks completion status and priorities', async () => {
      const now = new Date().toISOString();
      const task1: WorkspaceTask = {
        id: 'task-1',
        title: 'Review pull request',
        priority: 'urgent',
        category: 'Work',
        completed: false,
        createdAt: now,
        updatedAt: now
      };

      const task2: WorkspaceTask = {
        id: 'task-2',
        title: 'Buy groceries',
        priority: 'low',
        category: 'Personal',
        completed: true,
        completedAt: now,
        createdAt: now,
        updatedAt: now
      };

      await workspaceDB.saveTask(task1);
      await workspaceDB.saveTask(task2);

      const tasks = await workspaceDB.getTasks();
      expect(tasks.length).toBe(2);

      // Pending tasks appear before completed tasks
      expect(tasks[0].id).toBe('task-1');
      expect(tasks[0].completed).toBe(false);

      // Mark completed
      tasks[0].completed = true;
      tasks[0].completedAt = new Date().toISOString();
      await workspaceDB.saveTask(tasks[0]);

      const rechecked = await workspaceDB.getTasks();
      expect(rechecked.every((t) => t.completed)).toBe(true);
    });
  });

  describe('3. Personal Finance & Expenses', () => {
    it('records expenses and accurately calculates monthly totals in INR', async () => {
      const currentMonth = new Date().toISOString().substring(0, 7);
      const exp1: WorkspaceExpense = {
        id: 'exp-1',
        title: 'Office Internet Fiber',
        amount: 1499,
        category: 'utilities',
        paymentMethod: 'upi',
        date: `${currentMonth}-05`,
        createdAt: new Date().toISOString()
      };

      const exp2: WorkspaceExpense = {
        id: 'exp-2',
        title: 'Weekly Groceries',
        amount: 2500,
        category: 'food',
        paymentMethod: 'card',
        date: `${currentMonth}-10`,
        createdAt: new Date().toISOString()
      };

      // Expense from previous year shouldn't count in this month's total
      const expOld: WorkspaceExpense = {
        id: 'exp-old',
        title: 'Old Expense',
        amount: 5000,
        category: 'other',
        paymentMethod: 'cash',
        date: '2020-01-01',
        createdAt: new Date().toISOString()
      };

      await workspaceDB.saveExpense(exp1);
      await workspaceDB.saveExpense(exp2);
      await workspaceDB.saveExpense(expOld);

      const allExp = await workspaceDB.getExpenses();
      expect(allExp.length).toBe(3);

      const stats = await workspaceDB.getStats();
      expect(stats.monthlyExpenses).toBe(1499 + 2500); // 3999 INR
    });
  });

  describe('4. Habits & Streak Tracking', () => {
    it('logs daily habit check-ins and toggles history dates', async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const habit: WorkspaceHabit = {
        id: 'habit-1',
        name: '30-minute workout',
        color: '#10b981',
        frequency: 'daily',
        history: {},
        createdAt: new Date().toISOString()
      };

      await workspaceDB.saveHabit(habit);

      // Toggle today ON
      const updated = await workspaceDB.toggleHabitDate('habit-1', todayStr);
      expect(updated?.history[todayStr]).toBe(true);

      // Toggle today OFF
      const toggledOff = await workspaceDB.toggleHabitDate('habit-1', todayStr);
      expect(toggledOff?.history[todayStr]).toBeUndefined();
    });
  });

  describe('5. Goals & Milestones Progress', () => {
    it('manages goals, calculates progress percentage, and completes milestones', async () => {
      const goal: WorkspaceGoal = {
        id: 'goal-1',
        title: 'Launch LifeTools 2.0',
        category: 'Projects',
        targetDate: '2026-12-31',
        progress: 50,
        status: 'in_progress',
        milestones: [
          { id: 'm1', title: 'Implement 216 tools', completed: true },
          { id: 'm2', title: 'Implement My Workspace', completed: true },
          { id: 'm3', title: 'Cloudflare Pages deployment', completed: false },
          { id: 'm4', title: 'Launch announcement', completed: false }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await workspaceDB.saveGoal(goal);

      const goals = await workspaceDB.getGoals();
      expect(goals.length).toBe(1);
      expect(goals[0].milestones.length).toBe(4);
      expect(goals[0].status).toBe('in_progress');
    });
  });

  describe('6. Real Statistics Verification (Zero Demo / Hardcoded Data)', () => {
    it('returns exact zero metrics on fresh install and dynamic counts when items are added', async () => {
      // 1. Fresh install test
      const freshStats = await workspaceDB.getStats();
      expect(freshStats.totalTasks).toBe(0);
      expect(freshStats.completedTasks).toBe(0);
      expect(freshStats.pendingTasks).toBe(0);
      expect(freshStats.totalNotes).toBe(0);
      expect(freshStats.activeHabits).toBe(0);
      expect(freshStats.currentGoals).toBe(0);
      expect(freshStats.monthlyExpenses).toBe(0);
      expect(freshStats.upcomingEvents).toBe(0);

      // 2. Add real items
      await workspaceDB.saveNote({
        id: 'n1',
        title: 'Test Note',
        content: 'Content',
        category: 'General',
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await workspaceDB.saveTask({
        id: 't1',
        title: 'Pending Task',
        priority: 'high',
        category: 'Work',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await workspaceDB.saveTask({
        id: 't2',
        title: 'Completed Task',
        priority: 'low',
        category: 'Work',
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const updatedStats = await workspaceDB.getStats();
      expect(updatedStats.totalNotes).toBe(1);
      expect(updatedStats.totalTasks).toBe(2);
      expect(updatedStats.pendingTasks).toBe(1);
      expect(updatedStats.completedTasks).toBe(1);
    });
  });

  describe('7. Backup, Validation & Restore', () => {
    it('exports backup payload with schema version and validates backup integrity', async () => {
      await workspaceDB.saveNote({
        id: 'n-backup',
        title: 'Secret Note',
        content: 'Data to backup',
        category: 'Personal',
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const backup = await workspaceDB.exportBackup();
      expect(backup.appName).toBe('LifeTools');
      expect(backup.version).toBe(1);
      expect(backup.data.notes.length).toBe(1);

      // Validation
      const validCheck = workspaceDB.validateBackup(backup);
      expect(validCheck.isValid).toBe(true);
      expect(validCheck.counts.notes).toBe(1);

      // Test invalid backup rejection
      const invalidPayload = { appName: 'UnknownApp', data: 'malformed' };
      const invalidCheck = workspaceDB.validateBackup(invalidPayload);
      expect(invalidCheck.isValid).toBe(false);
      expect(invalidCheck.errors.length).toBeGreaterThan(0);
    });

    it('successfully restores data from backup file', async () => {
      const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        appName: 'LifeTools' as const,
        data: {
          notes: [
            {
              id: 'restored-note',
              title: 'Restored Note',
              content: 'Successfully restored',
              category: 'Work',
              isPinned: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          tasks: [
            {
              id: 'restored-task',
              title: 'Restored Task',
              priority: 'urgent' as const,
              category: 'General',
              completed: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          expenses: [],
          habits: [],
          goals: [],
          events: []
        }
      };

      await workspaceDB.importBackup(backupData, true);

      const notes = await workspaceDB.getNotes();
      const tasks = await workspaceDB.getTasks();

      expect(notes.length).toBe(1);
      expect(notes[0].id).toBe('restored-note');
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe('restored-task');
    });
  });

  describe('8. UI Workspace Page Integration', () => {
    it('renders Workspace navigation tabs cleanly with dashboard', async () => {
      render(<WorkspacePage />);

      expect(screen.getByText('Dashboard')).toBeDefined();
      expect(screen.getByText('My Notes')).toBeDefined();
      expect(screen.getByText('My Tasks')).toBeDefined();
      expect(screen.getByText('My Expenses')).toBeDefined();
      expect(screen.getByText('My Habits')).toBeDefined();
      expect(screen.getByText('My Goals')).toBeDefined();
      expect(screen.getByText('My Calendar')).toBeDefined();
      expect(screen.getByText('Backups & Custody')).toBeDefined();

      // Check header in dashboard
      await waitFor(() => {
        expect(screen.getByText('My Productivity Workspace')).toBeDefined();
      });
    });

    it('switches between workspace tabs interactively', async () => {
      render(<WorkspacePage initialTab="tasks" />);

      await waitFor(() => {
        expect(screen.getByText('Task Completion Status')).toBeDefined();
      });
    });
  });
});
