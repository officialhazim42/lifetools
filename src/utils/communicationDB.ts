/**
 * IndexedDB Database for Communication & Social Organizer
 * Database: lifetools_communication_db (Version: 1)
 * Object stores: contacts, drafts, reminders, notes, meeting_followups, quick_replies
 * Features robust in-memory fallback if IndexedDB is blocked.
 */

import {
  ImportantContact,
  MessageDraft,
  CommunicationReminder,
  CommunicationNote,
  MeetingFollowUp,
  QuickReplyTemplate
} from '../types/communication';

const DB_NAME = 'lifetools_communication_db';
const DB_VERSION = 1;

// In-memory fallback
const memoryFallback: {
  contacts: ImportantContact[];
  drafts: MessageDraft[];
  reminders: CommunicationReminder[];
  notes: CommunicationNote[];
  meeting_followups: MeetingFollowUp[];
  quick_replies: QuickReplyTemplate[];
} = {
  contacts: [],
  drafts: [],
  reminders: [],
  notes: [],
  meeting_followups: [],
  quick_replies: []
};

const isIDBAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
};

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (!isIDBAvailable()) {
      return reject(new Error('IndexedDB is not available.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('contacts')) {
        const store = db.createObjectStore('contacts', { keyPath: 'id' });
        store.createIndex('by_relationship', 'relationship');
        store.createIndex('by_isVip', 'isVip');
      }

      if (!db.objectStoreNames.contains('drafts')) {
        const store = db.createObjectStore('drafts', { keyPath: 'id' });
        store.createIndex('by_channel', 'channel');
        store.createIndex('by_updatedAt', 'updatedAt');
      }

      if (!db.objectStoreNames.contains('reminders')) {
        const store = db.createObjectStore('reminders', { keyPath: 'id' });
        store.createIndex('by_targetDate', 'targetDate');
        store.createIndex('by_status', 'status');
      }

      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', { keyPath: 'id' });
        store.createIndex('by_date', 'date');
      }

      if (!db.objectStoreNames.contains('meeting_followups')) {
        const store = db.createObjectStore('meeting_followups', { keyPath: 'id' });
        store.createIndex('by_date', 'meetingDate');
      }

      if (!db.objectStoreNames.contains('quick_replies')) {
        const store = db.createObjectStore('quick_replies', { keyPath: 'id' });
        store.createIndex('by_category', 'category');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

// Generic transaction helpers
async function performTx<T>(
  storeName: 'contacts' | 'drafts' | 'reminders' | 'notes' | 'meeting_followups' | 'quick_replies',
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => Promise<T>
): Promise<T> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      action(store)
        .then((result) => {
          tx.oncomplete = () => resolve(result);
        })
        .catch(reject);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Return fallback logic below in callers
    throw new Error('IDB_FALLBACK');
  }
}

export const communicationDB = {
  // --- Contacts ---
  async getContacts(): Promise<ImportantContact[]> {
    try {
      return await performTx('contacts', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.contacts];
    }
  },

  async saveContact(contact: ImportantContact): Promise<void> {
    try {
      await performTx('contacts', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(contact);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.contacts.findIndex((c) => c.id === contact.id);
      if (idx >= 0) memoryFallback.contacts[idx] = contact;
      else memoryFallback.contacts.push(contact);
    }
  },

  async deleteContact(id: string): Promise<void> {
    try {
      await performTx('contacts', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.contacts = memoryFallback.contacts.filter((c) => c.id !== id);
    }
  },

  // --- Drafts ---
  async getDrafts(): Promise<MessageDraft[]> {
    try {
      return await performTx('drafts', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.drafts];
    }
  },

  async saveDraft(draft: MessageDraft): Promise<void> {
    try {
      await performTx('drafts', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(draft);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.drafts.findIndex((d) => d.id === draft.id);
      if (idx >= 0) memoryFallback.drafts[idx] = draft;
      else memoryFallback.drafts.push(draft);
    }
  },

  async deleteDraft(id: string): Promise<void> {
    try {
      await performTx('drafts', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.drafts = memoryFallback.drafts.filter((d) => d.id !== id);
    }
  },

  // --- Reminders ---
  async getReminders(): Promise<CommunicationReminder[]> {
    try {
      return await performTx('reminders', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.reminders];
    }
  },

  async saveReminder(reminder: CommunicationReminder): Promise<void> {
    try {
      await performTx('reminders', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(reminder);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.reminders.findIndex((r) => r.id === reminder.id);
      if (idx >= 0) memoryFallback.reminders[idx] = reminder;
      else memoryFallback.reminders.push(reminder);
    }
  },

  async deleteReminder(id: string): Promise<void> {
    try {
      await performTx('reminders', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.reminders = memoryFallback.reminders.filter((r) => r.id !== id);
    }
  },

  // --- Notes ---
  async getNotes(): Promise<CommunicationNote[]> {
    try {
      return await performTx('notes', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.notes];
    }
  },

  async saveNote(note: CommunicationNote): Promise<void> {
    try {
      await performTx('notes', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(note);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.notes.findIndex((n) => n.id === note.id);
      if (idx >= 0) memoryFallback.notes[idx] = note;
      else memoryFallback.notes.push(note);
    }
  },

  async deleteNote(id: string): Promise<void> {
    try {
      await performTx('notes', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.notes = memoryFallback.notes.filter((n) => n.id !== id);
    }
  },

  // --- Meeting Followups ---
  async getMeetingFollowUps(): Promise<MeetingFollowUp[]> {
    try {
      return await performTx('meeting_followups', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.meeting_followups];
    }
  },

  async saveMeetingFollowUp(meeting: MeetingFollowUp): Promise<void> {
    try {
      await performTx('meeting_followups', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(meeting);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.meeting_followups.findIndex((m) => m.id === meeting.id);
      if (idx >= 0) memoryFallback.meeting_followups[idx] = meeting;
      else memoryFallback.meeting_followups.push(meeting);
    }
  },

  async deleteMeetingFollowUp(id: string): Promise<void> {
    try {
      await performTx('meeting_followups', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.meeting_followups = memoryFallback.meeting_followups.filter((m) => m.id !== id);
    }
  },

  // --- Quick Replies ---
  async getQuickReplies(): Promise<QuickReplyTemplate[]> {
    try {
      return await performTx('quick_replies', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.quick_replies];
    }
  },

  async saveQuickReply(reply: QuickReplyTemplate): Promise<void> {
    try {
      await performTx('quick_replies', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(reply);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.quick_replies.findIndex((q) => q.id === reply.id);
      if (idx >= 0) memoryFallback.quick_replies[idx] = reply;
      else memoryFallback.quick_replies.push(reply);
    }
  },

  async deleteQuickReply(id: string): Promise<void> {
    try {
      await performTx('quick_replies', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.quick_replies = memoryFallback.quick_replies.filter((q) => q.id !== id);
    }
  },

  // --- Stats and Bulk Export/Restore ---
  async getStats(): Promise<{
    totalContacts: number;
    totalDrafts: number;
    totalReminders: number;
    totalNotes: number;
    totalMeetings: number;
    totalQuickReplies: number;
  }> {
    const [c, d, r, n, m, q] = await Promise.all([
      this.getContacts(),
      this.getDrafts(),
      this.getReminders(),
      this.getNotes(),
      this.getMeetingFollowUps(),
      this.getQuickReplies()
    ]);
    return {
      totalContacts: c.length,
      totalDrafts: d.length,
      totalReminders: r.length,
      totalNotes: n.length,
      totalMeetings: m.length,
      totalQuickReplies: q.length
    };
  },

  async exportAll(): Promise<{
    contacts: ImportantContact[];
    drafts: MessageDraft[];
    reminders: CommunicationReminder[];
    notes: CommunicationNote[];
    meeting_followups: MeetingFollowUp[];
    quick_replies: QuickReplyTemplate[];
  }> {
    const [contacts, drafts, reminders, notes, meeting_followups, quick_replies] = await Promise.all([
      this.getContacts(),
      this.getDrafts(),
      this.getReminders(),
      this.getNotes(),
      this.getMeetingFollowUps(),
      this.getQuickReplies()
    ]);
    return { contacts, drafts, reminders, notes, meeting_followups, quick_replies };
  },

  async restoreAll(
    payload: {
      contacts?: ImportantContact[];
      drafts?: MessageDraft[];
      reminders?: CommunicationReminder[];
      notes?: CommunicationNote[];
      meeting_followups?: MeetingFollowUp[];
      quick_replies?: QuickReplyTemplate[];
    },
    mode: 'merge' | 'replace' = 'merge'
  ): Promise<void> {
    if (mode === 'replace') {
      const [c, d, r, n, m, q] = await Promise.all([
        this.getContacts(),
        this.getDrafts(),
        this.getReminders(),
        this.getNotes(),
        this.getMeetingFollowUps(),
        this.getQuickReplies()
      ]);
      await Promise.all([
        ...c.map((item) => this.deleteContact(item.id)),
        ...d.map((item) => this.deleteDraft(item.id)),
        ...r.map((item) => this.deleteReminder(item.id)),
        ...n.map((item) => this.deleteNote(item.id)),
        ...m.map((item) => this.deleteMeetingFollowUp(item.id)),
        ...q.map((item) => this.deleteQuickReply(item.id))
      ]);
    }

    if (payload.contacts) {
      for (const item of payload.contacts) await this.saveContact(item);
    }
    if (payload.drafts) {
      for (const item of payload.drafts) await this.saveDraft(item);
    }
    if (payload.reminders) {
      for (const item of payload.reminders) await this.saveReminder(item);
    }
    if (payload.notes) {
      for (const item of payload.notes) await this.saveNote(item);
    }
    if (payload.meeting_followups) {
      for (const item of payload.meeting_followups) await this.saveMeetingFollowUp(item);
    }
    if (payload.quick_replies) {
      for (const item of payload.quick_replies) await this.saveQuickReply(item);
    }
  }
};
