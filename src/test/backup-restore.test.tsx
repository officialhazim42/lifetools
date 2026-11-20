import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { computeSHA256, encryptBackupPayload, decryptBackupPayload } from '../utils/cryptoBackup';
import { createZipArchive, extractZipArchive } from '../utils/zipEngine';
import {
  generateExpensesCsv,
  generateTasksCsv,
  generateNotesCsv,
  generateHabitsCsv,
  generateReadableTxtSummary
} from '../utils/tabularBackup';
import {
  getStoredRecordCounts,
  collectBackupPayload,
  createUniversalBackup,
  validateBackupFile,
  unlockEncryptedBackup,
  executeRestore,
  getBackupHistory,
  recordBackupHistory,
  clearBackupHistory,
  getReminderConfig,
  updateReminderConfig,
  isBackupReminderDue
} from '../utils/backupManager';
import { workspaceDB } from '../utils/workspaceDB';
import { BackupDashboard } from '../components/backup/BackupDashboard';
import { CreateBackupCard } from '../components/backup/CreateBackupCard';
import { RestoreBackupCard } from '../components/backup/RestoreBackupCard';
import { TabularExportCard } from '../components/backup/TabularExportCard';
import { BackupRestorePage } from '../pages/BackupRestorePage';
import { UniversalBackupPayload } from '../types/backup';

describe('LifeTools — Universal Backup & Restore System', () => {
  beforeEach(async () => {
    localStorage.clear();
    await workspaceDB.clearAllWorkspaceData();
  });

  describe('1. Web Crypto & Security Engine', () => {
    it('computes consistent SHA-256 checksums', async () => {
      const data = JSON.stringify({ hello: 'LifeTools', version: '1.2.0' });
      const hash1 = await computeSHA256(data);
      const hash2 = await computeSHA256(data);

      expect(hash1).toBeDefined();
      expect(hash1.length).toBe(64); // 256 bits = 64 hex chars
      expect(hash1).toBe(hash2);
    });

    it('encrypts and decrypts payload using PBKDF2 and AES-256-GCM', async () => {
      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: new Date().toISOString(),
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 1,
            expenses: 0,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 2
        },
        data: {
          notes: [{ id: 'n1', title: 'Secret Note', content: 'Top secret data' }]
        }
      };

      const password = 'SuperSecurePassword123!';
      const encrypted = await encryptBackupPayload(payload, password);

      expect(encrypted.lifeToolsEncryptedBackup).toBe(true);
      expect(encrypted.manifest.isEncrypted).toBe(true);
      expect(encrypted.manifest.encryption?.algorithm).toBe('AES-GCM');
      expect(encrypted.manifest.encryption?.iterations).toBe(100000);
      expect(encrypted.ciphertext).toBeDefined();
      expect(encrypted.ciphertext.length).toBeGreaterThan(20);

      // Successfully decrypt with correct password
      const decrypted = await decryptBackupPayload(encrypted, password);
      expect(decrypted.data.notes?.[0].title).toBe('Secret Note');
      expect(decrypted.data.notes?.[0].content).toBe('Top secret data');
    });

    it('rejects decryption with an incorrect password', async () => {
      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: new Date().toISOString(),
          format: 'json',
          isEncrypted: false,
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
            toolStorage: 0
          },
          totalRecords: 0
        },
        data: {}
      };

      const encrypted = await encryptBackupPayload(payload, 'RightPassword');
      await expect(decryptBackupPayload(encrypted, 'WrongPassword')).rejects.toThrow();
    });
  });

  describe('2. Zero-Dependency ZIP Engine', () => {
    it('creates and extracts ZIP archives with exact byte preservation', () => {
      const file1Content = 'Hello LifeTools Universal ZIP Archive!';
      const file2Content = JSON.stringify({ app: 'LifeTools', status: 'verified' });

      const files = [
        { name: 'hello.txt', data: new TextEncoder().encode(file1Content) },
        { name: 'data.json', data: new TextEncoder().encode(file2Content) }
      ];

      const zipBytes = createZipArchive(files);
      expect(zipBytes.length).toBeGreaterThan(100);
      // PKWARE signature 'PK\x03\x04'
      expect(zipBytes[0]).toBe(0x50);
      expect(zipBytes[1]).toBe(0x4b);
      expect(zipBytes[2]).toBe(0x03);
      expect(zipBytes[3]).toBe(0x04);

      // Unpack
      const extracted = extractZipArchive(zipBytes);
      expect(extracted.length).toBe(2);

      const f1 = extracted.find((f) => f.name === 'hello.txt');
      const f2 = extracted.find((f) => f.name === 'data.json');

      expect(f1).toBeDefined();
      expect(f1?.text()).toBe(file1Content);

      expect(f2).toBeDefined();
      expect(f2?.text()).toBe(file2Content);
    });
  });

  describe('3. Tabular & Plain Text Exporters', () => {
    it('generates properly formatted and escaped CSV for expenses and tasks', () => {
      const expenses = [
        {
          date: '2026-11-20',
          title: 'Books, Supplies & Hardware',
          amount: 1450.5,
          currency: 'INR',
          category: 'Education',
          paymentMethod: 'UPI',
          notes: 'Bought "Clean Code" & notebook',
          createdAt: '2026-11-20T10:00:00Z'
        }
      ];

      const csv = generateExpensesCsv(expenses);
      expect(csv).toContain('Date,Title,Amount,Currency,Category,Payment Method,Notes,Created At');
      expect(csv).toContain('"Books, Supplies & Hardware"');
      expect(csv).toContain('"Bought ""Clean Code"" & notebook"');
      expect(csv).toContain('1450.5');

      const tasks = [
        {
          title: 'Review backup manifest',
          priority: 'High',
          completed: false,
          dueDate: '2026-11-21',
          category: 'Work',
          description: 'Ensure checksum is valid',
          createdAt: '2026-11-20T10:00:00Z'
        }
      ];

      const tasksCsv = generateTasksCsv(tasks);
      expect(tasksCsv).toContain('Title,Priority,Status,Due Date,Category,Description,Created At');
      expect(tasksCsv).toContain('Review backup manifest');
      expect(tasksCsv).toContain('Pending');
    });

    it('generates readable plain text markdown summary', () => {
      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: '2026-11-20T12:00:00Z',
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 1,
            expenses: 1,
            habits: 1,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 4
        },
        data: {
          notes: [{ id: 'n1', title: 'My Goals for 2026', content: 'Launch LifeTools 2.0', createdAt: '2026-11-20' }],
          tasks: [{ id: 't1', title: 'Finish unit tests', priority: 'High', completed: true }],
          expenses: [{ id: 'e1', title: 'Domain renewal', amount: 1200, currency: 'INR' }],
          habits: [{ id: 'h1', title: 'Morning Walk', frequency: 'daily', streak: 12 }]
        }
      };

      const txt = generateReadableTxtSummary(payload);
      expect(txt).toContain('LIFETOOLS UNIVERSAL DATA ARCHIVE');
      expect(txt).toContain('## MY NOTES (1 Records)');
      expect(txt).toContain('My Goals for 2026');
      expect(txt).toContain('## MY TASKS (1 Records)');
      expect(txt).toContain('Finish unit tests');
      expect(txt).toContain('## MY EXPENSES (1 Records)');
      expect(txt).toContain('Domain renewal');
      expect(txt).toContain('## MY HABITS (1 Records)');
      expect(txt).toContain('Morning Walk');
    });
  });

  describe('4. Universal Backup Collection & File Validation', () => {
    it('collects all stored records and computes cryptographic manifest', async () => {
      // Seed data into IndexedDB
      await workspaceDB.saveNote({
        id: 'note-a',
        title: 'Alpha Note',
        content: 'Content A',
        category: 'Personal',
        isPinned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await workspaceDB.saveTask({
        id: 'task-a',
        title: 'Alpha Task',
        completed: false,
        priority: 'high',
        category: 'Work',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Seed localStorage
      localStorage.setItem('lifetools-favorites', JSON.stringify(['calculator', 'unit-converter']));

      const counts = await getStoredRecordCounts();
      expect(counts.notes).toBe(1);
      expect(counts.tasks).toBe(1);
      expect(counts.favorites).toBe(2);

      const payload = await collectBackupPayload();
      expect(payload.manifest.appName).toBe('LifeTools');
      expect(payload.manifest.totalRecords).toBeGreaterThanOrEqual(4);
      expect(payload.manifest.checksum).toBeDefined();
      expect(payload.data.notes?.length).toBe(1);
      expect(payload.data.tasks?.length).toBe(1);
    });

    it('validates standard JSON backup files and calculates conflicts', async () => {
      await workspaceDB.saveNote({
        id: 'note-existing',
        title: 'Existing Note',
        content: 'Existing content',
        category: 'Personal',
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: new Date().toISOString(),
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 0,
            expenses: 0,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 1
        },
        data: {
          notes: [
            {
              id: 'note-incoming',
              title: 'Incoming Note',
              content: 'Incoming content',
              category: 'Work',
              isPinned: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ]
        }
      };

      const result = await validateBackupFile(JSON.stringify(payload), 'backup.json');
      expect(result.isValid).toBe(true);
      expect(result.isEncrypted).toBe(false);
      expect(result.totalRecords).toBe(1);
      expect(result.conflicts.existingRecords).toBeGreaterThanOrEqual(1);
      expect(result.conflicts.incomingRecords).toBe(1);
    });

    it('validates encrypted backup container and unlocks it with password', async () => {
      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: new Date().toISOString(),
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 0,
            expenses: 0,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 1
        },
        data: {
          notes: [{ id: 'n-secure', title: 'Protected Note', content: 'Secret' }]
        }
      };

      const password = 'VaultPassword42!';
      const encryptedContainer = await encryptBackupPayload(payload, password);

      const validation = await validateBackupFile(JSON.stringify(encryptedContainer), 'vault.json');
      expect(validation.isValid).toBe(true);
      expect(validation.isEncrypted).toBe(true);
      expect(validation.encryptedContainer).toBeDefined();

      // Unlock with correct password
      const unlocked = await unlockEncryptedBackup(validation.encryptedContainer!, password);
      expect(unlocked.isValid).toBe(true);
      expect(unlocked.payload).toBeDefined();
      expect(unlocked.payload?.data.notes?.[0].title).toBe('Protected Note');

      // Attempt unlock with wrong password
      const failedUnlock = await unlockEncryptedBackup(validation.encryptedContainer!, 'WrongKey');
      expect(failedUnlock.isValid).toBe(false);
      expect(failedUnlock.errors[0]).toContain('Incorrect password');
    });
  });

  describe('5. Restore Modes: Merge vs Replace vs Selective', () => {
    it('Merge mode: restores incoming items and resolves conflicting IDs without overwriting existing data', async () => {
      // 1. Seed existing note
      await workspaceDB.saveNote({
        id: 'shared-id',
        title: 'Original User Note',
        content: 'I must not be deleted!',
        category: 'Personal',
        isPinned: false,
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z'
      });

      // 2. Incoming payload with duplicate ID 'shared-id'
      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: '2026-11-20T00:00:00Z',
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 0,
            expenses: 0,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 1
        },
        data: {
          notes: [
            {
              id: 'shared-id',
              title: 'Incoming Conflicting Note',
              content: 'I should be safely re-keyed',
              category: 'Work',
              isPinned: false,
              createdAt: '2026-11-20T00:00:00Z',
              updatedAt: '2026-11-20T00:00:00Z'
            }
          ]
        }
      };

      const result = await executeRestore(payload, 'merge');
      expect(result.restoredCounts.notes).toBe(1);
      expect(result.conflictsResolved).toBe(1);

      // Verify BOTH notes now exist in DB
      const notes = await workspaceDB.getNotes();
      expect(notes.length).toBe(2);

      const original = notes.find((n) => n.id === 'shared-id');
      expect(original).toBeDefined();
      expect(original?.title).toBe('Original User Note');

      const rekeyed = notes.find((n) => n.id.startsWith('shared-id_restored_'));
      expect(rekeyed).toBeDefined();
      expect(rekeyed?.title).toBe('Incoming Conflicting Note');
    });

    it('Replace mode: clears selected existing data and replaces with incoming payload', async () => {
      // Seed existing note
      await workspaceDB.saveNote({
        id: 'old-note',
        title: 'Old Deprecated Note',
        content: 'Old',
        category: 'Personal',
        isPinned: false,
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z'
      });

      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: '2026-11-20T00:00:00Z',
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 0,
            expenses: 0,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 1
        },
        data: {
          notes: [
            {
              id: 'new-clean-note',
              title: 'Fresh Restored Note',
              content: 'Clean state',
              category: 'Fresh',
              isPinned: false,
              createdAt: '2026-11-20T00:00:00Z',
              updatedAt: '2026-11-20T00:00:00Z'
            }
          ]
        }
      };

      const result = await executeRestore(payload, 'replace');
      expect(result.restoredCounts.notes).toBe(1);

      const notes = await workspaceDB.getNotes();
      expect(notes.length).toBe(1);
      expect(notes[0].id).toBe('new-clean-note');
      expect(notes[0].title).toBe('Fresh Restored Note');
    });

    it('Selective mode: only restores specified categories', async () => {
      const payload: UniversalBackupPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.2.0',
          schemaVersion: 2,
          exportedAt: '2026-11-20T00:00:00Z',
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: 1,
            tasks: 1,
            expenses: 0,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 2
        },
        data: {
          notes: [{ id: 'selective-note', title: 'Target Note', content: 'Restore Me' }],
          tasks: [{ id: 'selective-task', title: 'Ignore Me', completed: false }]
        }
      };

      // Only select 'notes'
      const result = await executeRestore(payload, 'selective', ['notes']);
      expect(result.restoredCounts.notes).toBe(1);
      expect(result.restoredCounts.tasks).toBe(0);

      const notes = await workspaceDB.getNotes();
      const tasks = await workspaceDB.getTasks();

      expect(notes.length).toBe(1);
      expect(tasks.length).toBe(0);
    });
  });

  describe('6. Backup History & Reminder Tracking', () => {
    it('manages local backup history entries and clears on command', () => {
      expect(getBackupHistory().length).toBe(0);

      recordBackupHistory({
        date: new Date().toISOString(),
        format: 'zip',
        isEncrypted: true,
        sizeBytes: 24500,
        totalRecords: 15,
        categories: ['notes', 'tasks', 'expenses'],
        status: 'success'
      });

      const history = getBackupHistory();
      expect(history.length).toBe(1);
      expect(history[0].format).toBe('zip');
      expect(history[0].isEncrypted).toBe(true);

      clearBackupHistory();
      expect(getBackupHistory().length).toBe(0);
    });

    it('configures reminder schedule and accurately calculates due status', () => {
      // Default is weekly
      const conf = getReminderConfig();
      expect(conf.frequency).toBe('weekly');

      // Never backed up -> due
      expect(isBackupReminderDue()).toBe(true);

      // Backed up today -> not due
      updateReminderConfig({ lastBackupDate: new Date().toISOString() });
      expect(isBackupReminderDue()).toBe(false);

      // Backed up 10 days ago with weekly frequency -> due
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      updateReminderConfig({ lastBackupDate: tenDaysAgo, frequency: 'weekly' });
      expect(isBackupReminderDue()).toBe(true);

      // Change frequency to manual -> never due
      updateReminderConfig({ frequency: 'manual' });
      expect(isBackupReminderDue()).toBe(false);
    });
  });

  describe('7. React UI Components & Page Suite', () => {
    it('renders BackupDashboard with real metrics and handles navigation callbacks', () => {
      const onNavigateToCreate = vi.fn();
      const onNavigateToRestore = vi.fn();

      render(
        <BackupDashboard
          lastBackupDate="2026-11-20T10:00:00Z"
          counts={{
            notes: 5,
            tasks: 10,
            expenses: 3,
            habits: 2,
            goals: 1,
            events: 4,
            favorites: 6,
            recent: 8,
            settings: 1,
            toolStorage: 12
          }}
          totalRecords={52}
          estimatedSizeBytes={14560}
          onNavigateToCreate={onNavigateToCreate}
          onNavigateToRestore={onNavigateToRestore}
        />
      );

      expect(screen.getByText('Total Stored Records')).toBeInTheDocument();
      expect(screen.getByText('52')).toBeInTheDocument();
      expect(screen.getByText('Create Universal Backup')).toBeInTheDocument();
      expect(screen.getByText('Restore From Archive')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Create Universal Backup'));
      expect(onNavigateToCreate).toHaveBeenCalled();

      fireEvent.click(screen.getByText('Restore From Archive'));
      expect(onNavigateToRestore).toHaveBeenCalled();
    });

    it('renders CreateBackupCard and toggles encryption inputs', () => {
      render(
        <CreateBackupCard
          counts={{
            notes: 2,
            tasks: 3,
            expenses: 1,
            habits: 0,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 1,
            toolStorage: 0
          }}
        />
      );

      expect(screen.getByText('1. Choose Backup Format')).toBeInTheDocument();
      expect(screen.getByText('JSON Archive')).toBeInTheDocument();
      expect(screen.getByText('ZIP Package')).toBeInTheDocument();

      // Toggle encryption switch
      const toggle = screen.getByRole('switch');
      expect(screen.queryByPlaceholderText('Enter a secure password...')).not.toBeInTheDocument();

      fireEvent.click(toggle);
      expect(screen.getByPlaceholderText('Enter a secure password...')).toBeInTheDocument();
      expect(screen.getByText(/CRITICAL WARNING/i)).toBeInTheDocument();
    });

    it('renders TabularExportCard with 1-click download options', () => {
      render(
        <TabularExportCard
          counts={{
            notes: 4,
            tasks: 8,
            expenses: 12,
            habits: 3,
            goals: 0,
            events: 0,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          }}
        />
      );

      expect(screen.getByText('Tabular & Readable Formats')).toBeInTheDocument();
      expect(screen.getByText('Expenses CSV')).toBeInTheDocument();
      expect(screen.getByText('Tasks & To-Dos CSV')).toBeInTheDocument();
      expect(screen.getByText('Notes & Memos CSV')).toBeInTheDocument();
      expect(screen.getByText('Human-Readable TXT Summary')).toBeInTheDocument();
    });

    it('renders BackupRestorePage and switches between tabs seamlessly', async () => {
      render(<BackupRestorePage initialTab="dashboard" />);

      expect(screen.getByText('Universal Backup & Restore System')).toBeInTheDocument();
      expect(screen.getByText('100% Client-Side Custody')).toBeInTheDocument();

      // Switch to 'create' tab
      const createTab = screen.getByRole('button', { name: /^Create Backup$/i });
      fireEvent.click(createTab);

      await waitFor(() => {
        expect(screen.getByText('1. Choose Backup Format')).toBeInTheDocument();
      });

      // Switch to 'exports' tab
      const exportsTab = screen.getByRole('button', { name: /Tabular & CSV/i });
      fireEvent.click(exportsTab);

      await waitFor(() => {
        expect(screen.getByText('Tabular & Readable Formats')).toBeInTheDocument();
      });
    });
  });
});
