export interface BackupCategoryCounts {
  notes: number;
  tasks: number;
  expenses: number;
  habits: number;
  goals: number;
  events: number;
  favorites: number;
  recent: number;
  settings: number;
  toolStorage: number;
  documents?: number;
  communication?: number;
  health?: number;
  travel?: number;
  home?: number;
}

export type BackupCategoryKey = keyof BackupCategoryCounts;

export interface BackupMetadata {
  appName: 'LifeTools';
  version: string;
  schemaVersion: number;
  exportedAt: string; // ISO date
  format: 'json' | 'zip';
  isEncrypted: boolean;
  checksum?: string; // SHA-256 hash of raw data payload
  encryption?: {
    algorithm: 'AES-GCM';
    kdf: 'PBKDF2';
    iterations: number;
    salt: string; // Base64
    iv: string; // Base64
  };
  categoryCounts: BackupCategoryCounts;
  totalRecords: number;
}

export interface UniversalBackupPayload {
  manifest: BackupMetadata;
  data: {
    notes?: any[];
    tasks?: any[];
    expenses?: any[];
    habits?: any[];
    goals?: any[];
    events?: any[];
    favorites?: string[];
    recent?: any[];
    settings?: any;
    toolStorage?: Record<string, any>;
    documents?: any[];
    communication?: any;
    health?: any;
    travel?: any;
    home?: any;
  };
}

export interface EncryptedBackupContainer {
  lifeToolsEncryptedBackup: true;
  manifest: BackupMetadata;
  ciphertext: string; // Base64 encoded AES-GCM ciphertext
}

export interface BackupHistoryEntry {
  id: string;
  date: string;
  format: 'json' | 'zip' | 'csv' | 'txt';
  isEncrypted: boolean;
  sizeBytes: number;
  totalRecords: number;
  categories: string[];
  status: 'success' | 'failed';
}

export type RestoreMode = 'merge' | 'replace' | 'selective';

export interface RestoreValidationResult {
  isValid: boolean;
  isEncrypted: boolean;
  errors: string[];
  warnings: string[];
  manifest?: BackupMetadata;
  payload?: UniversalBackupPayload;
  encryptedContainer?: EncryptedBackupContainer;
  categoryCounts: BackupCategoryCounts;
  totalRecords: number;
  estimatedSize: number;
  conflicts: {
    existingRecords: number;
    incomingRecords: number;
    overlapCount: number;
  };
}

export type BackupReminderFrequency = 'weekly' | 'monthly' | 'manual';

export interface BackupReminderConfig {
  frequency: BackupReminderFrequency;
  lastBackupDate: string | null;
  lastReminderShown: string | null;
}

export const BACKUP_STORAGE_KEYS = {
  HISTORY: 'lifetools-backup-history',
  REMINDERS: 'lifetools-backup-reminder-config'
};
