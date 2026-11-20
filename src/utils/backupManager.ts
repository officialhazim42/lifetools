/**
 * Universal Backup & Restore Manager for LifeTools
 * Coordinates IndexedDB, LocalStorage, Web Crypto encryption, ZIP packing, and safe validation.
 */

import {
  BackupCategoryCounts,
  BackupCategoryKey,
  BackupMetadata,
  UniversalBackupPayload,
  EncryptedBackupContainer,
  BackupHistoryEntry,
  RestoreMode,
  RestoreValidationResult,
  BackupReminderConfig,
  BACKUP_STORAGE_KEYS
} from '../types/backup';
import { workspaceDB } from './workspaceDB';
import { communicationDB } from './communicationDB';
import { healthDB } from './healthDB';
import { travelDB } from './travelDB';
import { householdDB } from './householdDB';
import { SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS } from '../types/settings';
import { TEMPLATE_STORAGE_KEYS } from '../types/templates';
import { storage } from './storage';
import {
  computeSHA256,
  encryptBackupPayload,
  decryptBackupPayload
} from './cryptoBackup';
import { createZipArchive, extractZipArchive } from './zipEngine';
import {
  generateExpensesCsv,
  generateTasksCsv,
  generateNotesCsv,
  generateHabitsCsv,
  generateReadableTxtSummary
} from './tabularBackup';

const CURRENT_APP_VERSION = '1.2.0';
const CURRENT_SCHEMA_VERSION = 2;

// Tool-specific local storage prefix patterns
const TOOL_STORAGE_PREFIXES = [
  'lifetools_',
  'lt_',
  'car_',
  'age_calc_',
  'grocery_',
  'checklist_',
  'study_',
  'flashcard_',
  'timetable_',
  'meeting_',
  'routine_',
  'packing_'
];

/**
 * Collects all custom tool storage items from LocalStorage.
 */
function collectToolStorage(): Record<string, any> {
  const result: Record<string, any> = {};
  if (typeof window === 'undefined' || !window.localStorage) return result;

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Skip system settings and history keys
      if (
        key === SETTINGS_STORAGE_KEY ||
        key === 'lifetools-favorites' ||
        key === 'lifetools-recent' ||
        key === 'lifetools-theme' ||
        key === BACKUP_STORAGE_KEYS.HISTORY ||
        key === BACKUP_STORAGE_KEYS.REMINDERS
      ) {
        continue;
      }

      const isToolKey = TOOL_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));
      if (isToolKey) {
        try {
          result[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          result[key] = localStorage.getItem(key);
        }
      }
    }
  } catch {
    // ignore
  }

  return result;
}

/**
 * Counts actual records across all stored collections.
 */
export async function getStoredRecordCounts(): Promise<BackupCategoryCounts> {
  let notes = 0;
  let tasks = 0;
  let expenses = 0;
  let habits = 0;
  let goals = 0;
  let events = 0;

  try {
    const stats = await workspaceDB.getStats();
    notes = stats.totalNotes;
    tasks = stats.totalTasks;
    expenses = (await workspaceDB.getExpenses()).length;
    habits = (await workspaceDB.getHabits()).length;
    goals = (await workspaceDB.getGoals()).length;
    events = (await workspaceDB.getEvents()).length;
  } catch {
    // fallback
  }

  let favorites = 0;
  let recent = 0;
  let settings = 0;

  try {
    const favs = JSON.parse(localStorage.getItem('lifetools-favorites') || '[]');
    favorites = Array.isArray(favs) ? favs.length : 0;

    const recs = JSON.parse(localStorage.getItem('lifetools-recent') || '[]');
    recent = Array.isArray(recs) ? recs.length : 0;

    if (localStorage.getItem(SETTINGS_STORAGE_KEY)) {
      settings = 1;
    }
  } catch {
    // ignore
  }

  const toolStorage = Object.keys(collectToolStorage()).length;

  let documents = 0;
  try {
    const docs = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEYS.DRAFTS) || '[]');
    documents = Array.isArray(docs) ? docs.length : 0;
  } catch {
    // ignore
  }

  let communication = 0;
  try {
    const commStats = await communicationDB.getStats();
    communication =
      commStats.totalContacts +
      commStats.totalDrafts +
      commStats.totalReminders +
      commStats.totalNotes +
      commStats.totalMeetings +
      commStats.totalQuickReplies;
  } catch {
    // ignore
  }

  let health = 0;
  try {
    const { hasEmergencyCard, ...statsCounts } = await healthDB.getStats();
    health =
      Object.values(statsCounts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) +
      (hasEmergencyCard ? 1 : 0);
  } catch {
    // ignore
  }

  let travel = 0;
  try {
    const { hasEmergencyCard, ...statsCounts } = await travelDB.getStats();
    travel =
      Object.values(statsCounts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) +
      (hasEmergencyCard ? 1 : 0);
  } catch {
    // ignore
  }

  let home = 0;
  try {
    const stats = await householdDB.getStats();
    home = stats.total;
  } catch {
    // ignore
  }

  return {
    notes,
    tasks,
    expenses,
    habits,
    goals,
    events,
    favorites,
    recent,
    settings,
    toolStorage,
    documents,
    communication,
    health,
    travel,
    home
  };
}

/**
 * Gathers complete or selective data into a UniversalBackupPayload.
 */
export async function collectBackupPayload(
  selectedCategories?: BackupCategoryKey[]
): Promise<UniversalBackupPayload> {
  const isSelected = (key: BackupCategoryKey) =>
    !selectedCategories || selectedCategories.includes(key);

  const [notes, tasks, expenses, habits, goals, events] = await Promise.all([
    isSelected('notes') ? workspaceDB.getNotes() : Promise.resolve([]),
    isSelected('tasks') ? workspaceDB.getTasks() : Promise.resolve([]),
    isSelected('expenses') ? workspaceDB.getExpenses() : Promise.resolve([]),
    isSelected('habits') ? workspaceDB.getHabits() : Promise.resolve([]),
    isSelected('goals') ? workspaceDB.getGoals() : Promise.resolve([]),
    isSelected('events') ? workspaceDB.getEvents() : Promise.resolve([])
  ]);

  const favorites = isSelected('favorites')
    ? JSON.parse(localStorage.getItem('lifetools-favorites') || '[]')
    : [];

  const recent = isSelected('recent')
    ? JSON.parse(localStorage.getItem('lifetools-recent') || '[]')
    : [];

  const settings = isSelected('settings')
    ? JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || JSON.stringify(DEFAULT_SETTINGS))
    : undefined;

  const toolStorage = isSelected('toolStorage') ? collectToolStorage() : {};

  const documents = isSelected('documents')
    ? JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEYS.DRAFTS) || '[]')
    : [];

  const communication = isSelected('communication')
    ? await communicationDB.exportAll()
    : undefined;

  const health = isSelected('health')
    ? await healthDB.exportAll()
    : undefined;

  const travel = isSelected('travel')
    ? await travelDB.exportAll()
    : undefined;

  const home = isSelected('home')
    ? await householdDB.exportAll()
    : undefined;

  const healthCount = health
    ? Object.values(health).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : (arr ? 1 : 0)), 0)
    : 0;

  const travelCount = travel
    ? Object.values(travel).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : (arr ? 1 : 0)), 0)
    : 0;

  const homeCount = home
    ? Object.values(home).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : (arr ? 1 : 0)), 0)
    : 0;

  const commCount = communication
    ? communication.contacts.length +
      communication.drafts.length +
      communication.reminders.length +
      communication.notes.length +
      communication.meeting_followups.length +
      communication.quick_replies.length
    : 0;

  const categoryCounts: BackupCategoryCounts = {
    notes: notes.length,
    tasks: tasks.length,
    expenses: expenses.length,
    habits: habits.length,
    goals: goals.length,
    events: events.length,
    favorites: favorites.length,
    recent: recent.length,
    settings: settings ? 1 : 0,
    toolStorage: Object.keys(toolStorage).length,
    documents: documents.length,
    communication: commCount,
    health: healthCount,
    travel: travelCount,
    home: homeCount
  };

  const totalRecords = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  const dataPayload: UniversalBackupPayload['data'] = {};
  if (isSelected('notes')) dataPayload.notes = notes;
  if (isSelected('tasks')) dataPayload.tasks = tasks;
  if (isSelected('expenses')) dataPayload.expenses = expenses;
  if (isSelected('habits')) dataPayload.habits = habits;
  if (isSelected('goals')) dataPayload.goals = goals;
  if (isSelected('events')) dataPayload.events = events;
  if (isSelected('favorites')) dataPayload.favorites = favorites;
  if (isSelected('recent')) dataPayload.recent = recent;
  if (isSelected('settings')) dataPayload.settings = settings;
  if (isSelected('toolStorage')) dataPayload.toolStorage = toolStorage;
  if (isSelected('documents')) dataPayload.documents = documents;
  if (isSelected('communication') && communication) dataPayload.communication = communication;
  if (isSelected('health') && health) dataPayload.health = health;
  if (isSelected('travel') && travel) dataPayload.travel = travel;
  if (isSelected('home') && home) dataPayload.home = home;

  // Calculate cryptographic SHA-256 integrity checksum over data
  const dataString = JSON.stringify(dataPayload);
  const checksum = await computeSHA256(dataString);

  const manifest: BackupMetadata = {
    appName: 'LifeTools',
    version: CURRENT_APP_VERSION,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    format: 'json',
    isEncrypted: false,
    checksum,
    categoryCounts,
    totalRecords
  };

  return {
    manifest,
    data: dataPayload
  };
}

/**
 * Creates and downloads a complete or selective backup in JSON, ZIP, CSV, or TXT format.
 */
export async function createUniversalBackup(options: {
  format: 'json' | 'zip' | 'csv' | 'txt';
  isEncrypted?: boolean;
  password?: string;
  selectedCategories?: BackupCategoryKey[];
}): Promise<{
  blob: Blob;
  filename: string;
  sizeBytes: number;
  totalRecords: number;
  checksum?: string;
}> {
  const { format, isEncrypted, password, selectedCategories } = options;
  const payload = await collectBackupPayload(selectedCategories);
  const dateStr = new Date().toISOString().slice(0, 10);
  let blob: Blob;
  let filename: string;

  if (format === 'json') {
    if (isEncrypted && password) {
      // Password encrypted backup container
      payload.manifest.isEncrypted = true;
      payload.manifest.format = 'json';
      const plaintext = JSON.stringify(payload);
      const encResult = await encryptBackupPayload(plaintext, password);

      payload.manifest.encryption = {
        algorithm: 'AES-GCM',
        kdf: 'PBKDF2',
        iterations: encResult.iterations,
        salt: encResult.salt,
        iv: encResult.iv
      };

      const encryptedContainer: EncryptedBackupContainer = {
        lifeToolsEncryptedBackup: true,
        manifest: payload.manifest,
        ciphertext: encResult.ciphertext
      };

      const jsonStr = JSON.stringify(encryptedContainer, null, 2);
      blob = new Blob([jsonStr], { type: 'application/json' });
      filename = `lifetools_encrypted_backup_${dateStr}.json`;
    } else {
      // Standard unencrypted JSON
      payload.manifest.format = 'json';
      const jsonStr = JSON.stringify(payload, null, 2);
      blob = new Blob([jsonStr], { type: 'application/json' });
      filename = `lifetools_backup_${dateStr}.json`;
    }
  } else if (format === 'zip') {
    payload.manifest.format = 'zip';
    const jsonStr = JSON.stringify(payload, null, 2);
    const manifestStr = JSON.stringify(payload.manifest, null, 2);

    const zipFiles = [
      { name: 'manifest.json', content: manifestStr },
      { name: 'lifetools_data.json', content: jsonStr },
      { name: 'exports/expenses.csv', content: generateExpensesCsv(payload.data.expenses || []) },
      { name: 'exports/tasks.csv', content: generateTasksCsv(payload.data.tasks || []) },
      { name: 'exports/notes.csv', content: generateNotesCsv(payload.data.notes || []) },
      { name: 'exports/habits.csv', content: generateHabitsCsv(payload.data.habits || []) },
      { name: 'README.txt', content: generateReadableTxtSummary(payload) }
    ];

    const zipBytes = createZipArchive(zipFiles);
    blob = new Blob([zipBytes as BlobPart], { type: 'application/zip' });
    filename = `lifetools_archive_${dateStr}.zip`;
  } else if (format === 'csv') {
    // Generate multi-file ZIP with all CSV spreadsheets
    const zipFiles = [
      { name: 'expenses.csv', content: generateExpensesCsv(payload.data.expenses || []) },
      { name: 'tasks.csv', content: generateTasksCsv(payload.data.tasks || []) },
      { name: 'notes.csv', content: generateNotesCsv(payload.data.notes || []) },
      { name: 'habits.csv', content: generateHabitsCsv(payload.data.habits || []) }
    ];
    const zipBytes = createZipArchive(zipFiles);
    blob = new Blob([zipBytes as BlobPart], { type: 'application/zip' });
    filename = `lifetools_csv_spreadsheets_${dateStr}.zip`;
  } else {
    // Plain text export
    const txtContent = generateReadableTxtSummary(payload);
    blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    filename = `lifetools_summary_${dateStr}.txt`;
  }

  // Record into local backup history
  recordBackupHistory({
    date: new Date().toISOString(),
    format,
    isEncrypted: !!isEncrypted,
    sizeBytes: blob.size,
    totalRecords: payload.manifest.totalRecords,
    categories: Object.keys(payload.data),
    status: 'success'
  });

  // Update last backup date in reminder config
  const reminderConfig = getReminderConfig();
  updateReminderConfig({ lastBackupDate: new Date().toISOString() });

  return {
    blob,
    filename,
    sizeBytes: blob.size,
    totalRecords: payload.manifest.totalRecords,
    checksum: payload.manifest.checksum
  };
}

/**
 * Validates a candidate backup file (JSON or ZIP) prior to restoration.
 */
export async function validateBackupFile(
  content: string | Uint8Array,
  fileName: string
): Promise<RestoreValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const emptyCounts: BackupCategoryCounts = {
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
  };

  const emptyConflicts = {
    existingRecords: 0,
    incomingRecords: 0,
    overlapCount: 0
  };

  try {
    let payloadText = '';

    // Check if input is a ZIP file (starts with PK\x03\x04 or has zip extension)
    const isZip =
      fileName.toLowerCase().endsWith('.zip') ||
      (content instanceof Uint8Array &&
        content.length > 4 &&
        content[0] === 0x50 &&
        content[1] === 0x4b);

    if (isZip) {
      const zipBytes =
        content instanceof Uint8Array ? content : new TextEncoder().encode(content);
      const extracted = extractZipArchive(zipBytes);
      const dataFile = extracted.find(
        (f) => f.name === 'lifetools_data.json' || f.name.endsWith('.json')
      );

      if (!dataFile) {
        return {
          isValid: false,
          isEncrypted: false,
          errors: ['Invalid ZIP archive: Missing "lifetools_data.json" backup file.'],
          warnings,
          categoryCounts: emptyCounts,
          totalRecords: 0,
          estimatedSize: zipBytes.byteLength,
          conflicts: emptyConflicts
        };
      }
      payloadText = dataFile.text();
    } else {
      payloadText =
        typeof content === 'string' ? content : new TextDecoder().decode(content);
    }

    const parsed = JSON.parse(payloadText);

    // 1. Detect Encrypted Backup Container
    if (parsed.lifeToolsEncryptedBackup === true) {
      if (!parsed.manifest || !parsed.ciphertext || !parsed.manifest.encryption) {
        errors.push('Malformed encrypted backup: Missing cryptographic parameters.');
        return {
          isValid: false,
          isEncrypted: true,
          errors,
          warnings,
          categoryCounts: emptyCounts,
          totalRecords: 0,
          estimatedSize: payloadText.length,
          conflicts: emptyConflicts
        };
      }

      return {
        isValid: true,
        isEncrypted: true,
        errors: [],
        warnings: ['Password required to unlock this encrypted backup.'],
        manifest: parsed.manifest,
        encryptedContainer: parsed as EncryptedBackupContainer,
        categoryCounts: parsed.manifest.categoryCounts || emptyCounts,
        totalRecords: parsed.manifest.totalRecords || 0,
        estimatedSize: payloadText.length,
        conflicts: emptyConflicts
      };
    }

    // 2. Validate Standard UniversalBackupPayload
    if (!parsed || typeof parsed !== 'object') {
      errors.push('Invalid file: Root element must be a valid JSON object.');
      return {
        isValid: false,
        isEncrypted: false,
        errors,
        warnings,
        categoryCounts: emptyCounts,
        totalRecords: 0,
        estimatedSize: payloadText.length,
        conflicts: emptyConflicts
      };
    }

    // Legacy Workspace Backup compatibility check
    let normalizedPayload: UniversalBackupPayload;
    if (parsed.appName === 'LifeTools' && parsed.data && !parsed.manifest) {
      normalizedPayload = {
        manifest: {
          appName: 'LifeTools',
          version: '1.0.0',
          schemaVersion: 1,
          exportedAt: parsed.exportedAt || new Date().toISOString(),
          format: 'json',
          isEncrypted: false,
          categoryCounts: {
            notes: (parsed.data.notes || []).length,
            tasks: (parsed.data.tasks || []).length,
            expenses: (parsed.data.expenses || []).length,
            habits: (parsed.data.habits || []).length,
            goals: (parsed.data.goals || []).length,
            events: (parsed.data.events || []).length,
            favorites: 0,
            recent: 0,
            settings: 0,
            toolStorage: 0
          },
          totalRecords: 0
        },
        data: parsed.data
      };
      warnings.push('Legacy backup format detected (v1.0.0). Upgrading to Universal schema.');
    } else if (parsed.manifest && parsed.data) {
      normalizedPayload = parsed as UniversalBackupPayload;
    } else {
      errors.push('Unrecognized format: Missing LifeTools backup manifest and data.');
      return {
        isValid: false,
        isEncrypted: false,
        errors,
        warnings,
        categoryCounts: emptyCounts,
        totalRecords: 0,
        estimatedSize: payloadText.length,
        conflicts: emptyConflicts
      };
    }

    // Origin verification
    if (normalizedPayload.manifest.appName !== 'LifeTools') {
      errors.push(`Invalid backup origin: "${normalizedPayload.manifest.appName}".`);
    }

    // Structure and types validation
    const counts: BackupCategoryCounts = {
      notes: Array.isArray(normalizedPayload.data.notes) ? normalizedPayload.data.notes.length : 0,
      tasks: Array.isArray(normalizedPayload.data.tasks) ? normalizedPayload.data.tasks.length : 0,
      expenses: Array.isArray(normalizedPayload.data.expenses)
        ? normalizedPayload.data.expenses.length
        : 0,
      habits: Array.isArray(normalizedPayload.data.habits) ? normalizedPayload.data.habits.length : 0,
      goals: Array.isArray(normalizedPayload.data.goals) ? normalizedPayload.data.goals.length : 0,
      events: Array.isArray(normalizedPayload.data.events) ? normalizedPayload.data.events.length : 0,
      favorites: Array.isArray(normalizedPayload.data.favorites)
        ? normalizedPayload.data.favorites.length
        : 0,
      recent: Array.isArray(normalizedPayload.data.recent) ? normalizedPayload.data.recent.length : 0,
      settings: normalizedPayload.data.settings ? 1 : 0,
      toolStorage: normalizedPayload.data.toolStorage
        ? Object.keys(normalizedPayload.data.toolStorage).length
        : 0,
      documents: Array.isArray(normalizedPayload.data.documents)
        ? normalizedPayload.data.documents.length
        : 0,
      communication: normalizedPayload.data.communication
        ? Object.values(normalizedPayload.data.communication).reduce(
            (s: number, a: any) => s + (Array.isArray(a) ? a.length : 0),
            0
          )
        : 0,
      health: normalizedPayload.data.health
        ? Object.values(normalizedPayload.data.health).reduce(
            (s: number, a: any) => s + (Array.isArray(a) ? a.length : 0),
            0
          )
        : 0,
      travel: normalizedPayload.data.travel
        ? Object.values(normalizedPayload.data.travel).reduce(
            (s: number, a: any) => s + (Array.isArray(a) ? a.length : (a ? 1 : 0)),
            0
          )
        : 0,
      home: normalizedPayload.data.home
        ? Object.values(normalizedPayload.data.home).reduce(
            (s: number, a: any) => s + (Array.isArray(a) ? a.length : (a ? 1 : 0)),
            0
          )
        : 0
    };

    const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);

    // Integrity Checksum verification (if present)
    if (normalizedPayload.manifest.checksum) {
      const dataString = JSON.stringify(normalizedPayload.data);
      const computed = await computeSHA256(dataString);
      if (computed !== normalizedPayload.manifest.checksum) {
        warnings.push('Integrity warning: Checksum mismatch. Data may have been manually edited.');
      }
    }

    // Conflict analysis against existing IndexedDB records
    const existingCounts = await getStoredRecordCounts();
    const existingTotal = Object.values(existingCounts).reduce((a, b) => a + b, 0);

    // Overlap estimation
    let overlapCount = 0;
    try {
      const existingNotes = await workspaceDB.getNotes();
      const existingIds = new Set(existingNotes.map((n) => n.id));
      (normalizedPayload.data.notes || []).forEach((n: any) => {
        if (existingIds.has(n.id)) overlapCount++;
      });
    } catch {}

    return {
      isValid: errors.length === 0,
      isEncrypted: false,
      errors,
      warnings,
      manifest: normalizedPayload.manifest,
      payload: normalizedPayload,
      categoryCounts: counts,
      totalRecords,
      estimatedSize: payloadText.length,
      conflicts: {
        existingRecords: existingTotal,
        incomingRecords: totalRecords,
        overlapCount
      }
    };
  } catch (err: any) {
    return {
      isValid: false,
      isEncrypted: false,
      errors: [`Failed to parse backup file: ${err.message || 'Corrupted file'}`],
      warnings,
      categoryCounts: emptyCounts,
      totalRecords: 0,
      estimatedSize: 0,
      conflicts: emptyConflicts
    };
  }
}

/**
 * Unlocks an encrypted backup container with password and returns validation result.
 */
export async function unlockEncryptedBackup(
  container: EncryptedBackupContainer,
  password: string
): Promise<RestoreValidationResult> {
  const emptyCounts: BackupCategoryCounts = {
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
  };
  const emptyConflicts = { existingRecords: 0, incomingRecords: 0, overlapCount: 0 };

  if (!container.manifest.encryption) {
    return {
      isValid: false,
      isEncrypted: true,
      errors: ['Encrypted container missing encryption parameters.'],
      warnings: [],
      categoryCounts: emptyCounts,
      totalRecords: 0,
      estimatedSize: 0,
      conflicts: emptyConflicts
    };
  }

  const { salt, iv, iterations } = container.manifest.encryption;
  try {
    const decryptedJson = await decryptBackupPayload(
      container.ciphertext,
      password,
      salt,
      iv,
      iterations
    );

    return validateBackupFile(decryptedJson, 'decrypted_backup.json');
  } catch (err: any) {
    return {
      isValid: false,
      isEncrypted: true,
      errors: [err.message || 'Incorrect password or corrupted encrypted backup.'],
      warnings: [],
      categoryCounts: emptyCounts,
      totalRecords: 0,
      estimatedSize: 0,
      conflicts: emptyConflicts
    };
  }
}

/**
 * Executes restoration using Merge, Replace, or Selective Restore mode.
 */
export async function executeRestore(
  payload: UniversalBackupPayload,
  mode: RestoreMode,
  selectedCategories?: BackupCategoryKey[]
): Promise<{
  restoredCounts: BackupCategoryCounts;
  conflictsResolved: number;
}> {
  const isSelected = (key: BackupCategoryKey) =>
    !selectedCategories || selectedCategories.includes(key);

  const restoredCounts: BackupCategoryCounts = {
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
  };

  let conflictsResolved = 0;

  // 1. REPLACE MODE: Clear selected categories first
  if (mode === 'replace') {
    if (isSelected('notes')) await workspaceDB.clearNotes();
    if (isSelected('tasks')) {
      const all = await workspaceDB.getTasks();
      for (const t of all) await workspaceDB.deleteTask(t.id);
    }
    if (isSelected('expenses')) {
      const all = await workspaceDB.getExpenses();
      for (const e of all) await workspaceDB.deleteExpense(e.id);
    }
    if (isSelected('habits')) {
      const all = await workspaceDB.getHabits();
      for (const h of all) await workspaceDB.deleteHabit(h.id);
    }
    if (isSelected('goals')) {
      const all = await workspaceDB.getGoals();
      for (const g of all) await workspaceDB.deleteGoal(g.id);
    }
    if (isSelected('events')) {
      const all = await workspaceDB.getEvents();
      for (const ev of all) await workspaceDB.deleteEvent(ev.id);
    }
    if (isSelected('favorites')) {
      localStorage.removeItem('lifetools-favorites');
    }
    if (isSelected('recent')) {
      localStorage.removeItem('lifetools-recent');
    }
    if (isSelected('documents')) {
      localStorage.removeItem(TEMPLATE_STORAGE_KEYS.DRAFTS);
    }
    if (isSelected('communication')) {
      await communicationDB.restoreAll({}, 'replace');
    }
    if (isSelected('health')) {
      await healthDB.restoreAll({}, 'replace');
    }
  }

  // 2. RESTORE ENTITIES

  // Notes
  if (isSelected('notes') && Array.isArray(payload.data.notes)) {
    const existingNotes = await workspaceDB.getNotes();
    const existingIds = new Set(existingNotes.map((n) => n.id));

    for (const note of payload.data.notes) {
      if (!note || !note.title) continue;
      let targetId = note.id;

      if (mode === 'merge' && existingIds.has(targetId)) {
        // Resolve duplicate ID conflict while keeping timestamps
        targetId = `${note.id}_restored_${Date.now()}`;
        conflictsResolved++;
      }

      await workspaceDB.saveNote({
        ...note,
        id: targetId,
        updatedAt: note.updatedAt || new Date().toISOString()
      });
      restoredCounts.notes++;
    }
  }

  // Tasks
  if (isSelected('tasks') && Array.isArray(payload.data.tasks)) {
    const existingTasks = await workspaceDB.getTasks();
    const existingIds = new Set(existingTasks.map((t) => t.id));

    for (const task of payload.data.tasks) {
      if (!task || !task.title) continue;
      let targetId = task.id;

      if (mode === 'merge' && existingIds.has(targetId)) {
        targetId = `${task.id}_restored_${Date.now()}`;
        conflictsResolved++;
      }

      await workspaceDB.saveTask({
        ...task,
        id: targetId
      });
      restoredCounts.tasks++;
    }
  }

  // Expenses
  if (isSelected('expenses') && Array.isArray(payload.data.expenses)) {
    const existing = await workspaceDB.getExpenses();
    const existingIds = new Set(existing.map((e) => e.id));

    for (const expense of payload.data.expenses) {
      if (!expense || expense.amount === undefined) continue;
      let targetId = expense.id;

      if (mode === 'merge' && existingIds.has(targetId)) {
        targetId = `${expense.id}_restored_${Date.now()}`;
        conflictsResolved++;
      }

      await workspaceDB.saveExpense({
        ...expense,
        id: targetId
      });
      restoredCounts.expenses++;
    }
  }

  // Habits
  if (isSelected('habits') && Array.isArray(payload.data.habits)) {
    const existing = await workspaceDB.getHabits();
    const existingIds = new Set(existing.map((h) => h.id));

    for (const habit of payload.data.habits) {
      if (!habit || !habit.title) continue;
      let targetId = habit.id;

      if (mode === 'merge' && existingIds.has(targetId)) {
        targetId = `${habit.id}_restored_${Date.now()}`;
        conflictsResolved++;
      }

      await workspaceDB.saveHabit({
        ...habit,
        id: targetId
      });
      restoredCounts.habits++;
    }
  }

  // Goals
  if (isSelected('goals') && Array.isArray(payload.data.goals)) {
    const existing = await workspaceDB.getGoals();
    const existingIds = new Set(existing.map((g) => g.id));

    for (const goal of payload.data.goals) {
      if (!goal || !goal.title) continue;
      let targetId = goal.id;

      if (mode === 'merge' && existingIds.has(targetId)) {
        targetId = `${goal.id}_restored_${Date.now()}`;
        conflictsResolved++;
      }

      await workspaceDB.saveGoal({
        ...goal,
        id: targetId
      });
      restoredCounts.goals++;
    }
  }

  // Events
  if (isSelected('events') && Array.isArray(payload.data.events)) {
    const existing = await workspaceDB.getEvents();
    const existingIds = new Set(existing.map((ev) => ev.id));

    for (const event of payload.data.events) {
      if (!event || !event.title) continue;
      let targetId = event.id;

      if (mode === 'merge' && existingIds.has(targetId)) {
        targetId = `${event.id}_restored_${Date.now()}`;
        conflictsResolved++;
      }

      await workspaceDB.saveEvent({
        ...event,
        id: targetId
      });
      restoredCounts.events++;
    }
  }

  // Favorites
  if (isSelected('favorites') && Array.isArray(payload.data.favorites)) {
    if (mode === 'merge') {
      const current = JSON.parse(localStorage.getItem('lifetools-favorites') || '[]');
      const combined = Array.from(new Set([...current, ...payload.data.favorites]));
      localStorage.setItem('lifetools-favorites', JSON.stringify(combined));
      restoredCounts.favorites = combined.length;
    } else {
      localStorage.setItem('lifetools-favorites', JSON.stringify(payload.data.favorites));
      restoredCounts.favorites = payload.data.favorites.length;
    }
  }

  // Recently Used
  if (isSelected('recent') && Array.isArray(payload.data.recent)) {
    if (mode === 'merge') {
      const current = JSON.parse(localStorage.getItem('lifetools-recent') || '[]');
      const combined = [...current];
      const seen = new Set(current.map((c: any) => c.toolId));

      for (const r of payload.data.recent) {
        if (!seen.has(r.toolId)) {
          seen.add(r.toolId);
          combined.push(r);
        }
      }
      localStorage.setItem('lifetools-recent', JSON.stringify(combined.slice(0, 20)));
      restoredCounts.recent = combined.length;
    } else {
      localStorage.setItem('lifetools-recent', JSON.stringify(payload.data.recent.slice(0, 20)));
      restoredCounts.recent = payload.data.recent.length;
    }
  }

  // Settings
  if (isSelected('settings') && payload.data.settings) {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(payload.data.settings));
    restoredCounts.settings = 1;
  }

  // Tool-specific local storage
  if (isSelected('toolStorage') && payload.data.toolStorage) {
    for (const [key, val] of Object.entries(payload.data.toolStorage)) {
      try {
        localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        restoredCounts.toolStorage++;
      } catch {}
    }
  }

  // Saved Document Drafts
  if (isSelected('documents') && Array.isArray(payload.data.documents)) {
    if (mode === 'merge') {
      const current = JSON.parse(localStorage.getItem(TEMPLATE_STORAGE_KEYS.DRAFTS) || '[]');
      const existingIds = new Set(current.map((d: any) => d.id));
      const combined = [...current];

      for (const doc of payload.data.documents) {
        let targetId = doc.id;
        if (existingIds.has(targetId)) {
          targetId = `${doc.id}_restored_${Date.now()}`;
          conflictsResolved++;
        }
        combined.push({ ...doc, id: targetId });
      }
      localStorage.setItem(TEMPLATE_STORAGE_KEYS.DRAFTS, JSON.stringify(combined));
      restoredCounts.documents = combined.length;
    } else {
      localStorage.setItem(TEMPLATE_STORAGE_KEYS.DRAFTS, JSON.stringify(payload.data.documents));
      restoredCounts.documents = payload.data.documents.length;
    }
  }

  // Communication & Social Data
  if (isSelected('communication') && payload.data.communication) {
    await communicationDB.restoreAll(
      payload.data.communication,
      mode === 'replace' ? 'replace' : 'merge'
    );
    const stats = await communicationDB.getStats();
    restoredCounts.communication =
      stats.totalContacts +
      stats.totalDrafts +
      stats.totalReminders +
      stats.totalNotes +
      stats.totalMeetings +
      stats.totalQuickReplies;
  }

  // Health, Fitness & Wellness Data
  if (isSelected('health') && payload.data.health) {
    await healthDB.restoreAll(
      payload.data.health,
      mode === 'replace' ? 'replace' : 'merge'
    );
    const { hasEmergencyCard, ...statsCounts } = await healthDB.getStats();
    restoredCounts.health =
      Object.values(statsCounts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) +
      (hasEmergencyCard ? 1 : 0);
  }

  // Travel, Navigation & Planning Data
  if (isSelected('travel') && payload.data.travel) {
    await travelDB.restoreAll(
      payload.data.travel,
      mode === 'replace' ? 'replace' : 'merge'
    );
    const { hasEmergencyCard, ...statsCounts } = await travelDB.getStats();
    restoredCounts.travel =
      Object.values(statsCounts).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) +
      (hasEmergencyCard ? 1 : 0);
  }

  // Home, Household & Property Utilities Data
  if (isSelected('home') && payload.data.home) {
    await householdDB.restoreAll(
      payload.data.home,
      mode === 'replace' ? 'replace' : 'merge'
    );
    const stats = await householdDB.getStats();
    restoredCounts.home = stats.total;
  }

  return {
    restoredCounts,
    conflictsResolved
  };
}

/**
 * Backup History Helpers.
 */
export function getBackupHistory(): BackupHistoryEntry[] {
  return storage.get<BackupHistoryEntry[]>(BACKUP_STORAGE_KEYS.HISTORY, []);
}

export function recordBackupHistory(entry: Omit<BackupHistoryEntry, 'id'>): void {
  const history = getBackupHistory();
  const newEntry: BackupHistoryEntry = {
    ...entry,
    id: `backup_${Date.now()}`
  };
  const updated = [newEntry, ...history].slice(0, 25);
  storage.set(BACKUP_STORAGE_KEYS.HISTORY, updated);
}

export function clearBackupHistory(): void {
  storage.remove(BACKUP_STORAGE_KEYS.HISTORY);
}

/**
 * Backup Reminder Helpers.
 */
export function getReminderConfig(): BackupReminderConfig {
  return storage.get<BackupReminderConfig>(BACKUP_STORAGE_KEYS.REMINDERS, {
    frequency: 'weekly',
    lastBackupDate: null,
    lastReminderShown: null
  });
}

export function updateReminderConfig(partial: Partial<BackupReminderConfig>): void {
  const current = getReminderConfig();
  storage.set(BACKUP_STORAGE_KEYS.REMINDERS, { ...current, ...partial });
}

export function isBackupReminderDue(): boolean {
  const config = getReminderConfig();
  if (config.frequency === 'manual') return false;

  const now = Date.now();
  const lastBackup = config.lastBackupDate ? new Date(config.lastBackupDate).getTime() : 0;
  const elapsedDays = (now - lastBackup) / (1000 * 60 * 60 * 24);

  if (config.frequency === 'weekly' && elapsedDays >= 7) return true;
  if (config.frequency === 'monthly' && elapsedDays >= 30) return true;

  return false;
}
