import {
  WorkspaceNote,
  WorkspaceTask,
  WorkspaceExpense,
  WorkspaceHabit,
  WorkspaceGoal,
  WorkspaceEvent,
  WorkspaceStats,
  WorkspaceBackupPayload
} from '../types/workspace';

const DB_NAME = 'lifetools_workspace_db';
const DB_VERSION = 1;
const SCHEMA_VERSION = 1;

// In-memory fallback if IndexedDB is blocked or unavailable
const memoryFallback: {
  notes: WorkspaceNote[];
  tasks: WorkspaceTask[];
  expenses: WorkspaceExpense[];
  habits: WorkspaceHabit[];
  goals: WorkspaceGoal[];
  events: WorkspaceEvent[];
} = {
  notes: [],
  tasks: [],
  expenses: [],
  habits: [],
  goals: [],
  events: []
};

// Check IndexedDB availability
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
      return reject(new Error('IndexedDB is not available in this environment.'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Notes store
      if (!db.objectStoreNames.contains('notes')) {
        const store = db.createObjectStore('notes', { keyPath: 'id' });
        store.createIndex('by_updatedAt', 'updatedAt');
        store.createIndex('by_category', 'category');
        store.createIndex('by_isPinned', 'isPinned');
      }

      // 2. Tasks store
      if (!db.objectStoreNames.contains('tasks')) {
        const store = db.createObjectStore('tasks', { keyPath: 'id' });
        store.createIndex('by_completed', 'completed');
        store.createIndex('by_priority', 'priority');
        store.createIndex('by_dueDate', 'dueDate');
        store.createIndex('by_category', 'category');
      }

      // 3. Expenses store
      if (!db.objectStoreNames.contains('expenses')) {
        const store = db.createObjectStore('expenses', { keyPath: 'id' });
        store.createIndex('by_date', 'date');
        store.createIndex('by_category', 'category');
      }

      // 4. Habits store
      if (!db.objectStoreNames.contains('habits')) {
        db.createObjectStore('habits', { keyPath: 'id' });
      }

      // 5. Goals store
      if (!db.objectStoreNames.contains('goals')) {
        const store = db.createObjectStore('goals', { keyPath: 'id' });
        store.createIndex('by_targetDate', 'targetDate');
        store.createIndex('by_status', 'status');
      }

      // 6. Events store
      if (!db.objectStoreNames.contains('events')) {
        const store = db.createObjectStore('events', { keyPath: 'id' });
        store.createIndex('by_date', 'date');
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

// Generic helper for transaction operations
async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return (memoryFallback as any)[storeName] || [];
  }
}

async function putInStore<T>(storeName: string, item: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const arr = (memoryFallback as any)[storeName] as any[];
    const key = (item as any).id;
    const idx = arr.findIndex((x) => x.id === key);
    if (idx >= 0) {
      arr[idx] = item;
    } else {
      arr.push(item);
    }
  }
}

async function deleteFromStore(storeName: string, id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const arr = (memoryFallback as any)[storeName] as any[];
    (memoryFallback as any)[storeName] = arr.filter((x) => x.id !== id);
  }
}

async function clearStore(storeName: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    (memoryFallback as any)[storeName] = [];
  }
}

// ==========================================
// PUBLIC WORKSPACE API
// ==========================================

export const workspaceDB = {
  // NOTES
  async getNotes(): Promise<WorkspaceNote[]> {
    const notes = await getAllFromStore<WorkspaceNote>('notes');
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  },

  async saveNote(note: WorkspaceNote): Promise<void> {
    await putInStore('notes', note);
  },

  async deleteNote(id: string): Promise<void> {
    await deleteFromStore('notes', id);
  },

  // TASKS
  async getTasks(): Promise<WorkspaceTask[]> {
    const tasks = await getAllFromStore<WorkspaceTask>('tasks');
    return tasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  async saveTask(task: WorkspaceTask): Promise<void> {
    await putInStore('tasks', task);
  },

  async deleteTask(id: string): Promise<void> {
    await deleteFromStore('tasks', id);
  },

  // EXPENSES
  async getExpenses(): Promise<WorkspaceExpense[]> {
    const expenses = await getAllFromStore<WorkspaceExpense>('expenses');
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async saveExpense(expense: WorkspaceExpense): Promise<void> {
    await putInStore('expenses', expense);
  },

  async deleteExpense(id: string): Promise<void> {
    await deleteFromStore('expenses', id);
  },

  // HABITS
  async getHabits(): Promise<WorkspaceHabit[]> {
    const habits = await getAllFromStore<WorkspaceHabit>('habits');
    return habits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async saveHabit(habit: WorkspaceHabit): Promise<void> {
    await putInStore('habits', habit);
  },

  async deleteHabit(id: string): Promise<void> {
    await deleteFromStore('habits', id);
  },

  async toggleHabitDate(habitId: string, dateStr: string): Promise<WorkspaceHabit | null> {
    const habits = await this.getHabits();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return null;

    const newHistory = { ...habit.history };
    if (newHistory[dateStr]) {
      delete newHistory[dateStr];
    } else {
      newHistory[dateStr] = true;
    }

    const updated = { ...habit, history: newHistory };
    await this.saveHabit(updated);
    return updated;
  },

  // GOALS
  async getGoals(): Promise<WorkspaceGoal[]> {
    const goals = await getAllFromStore<WorkspaceGoal>('goals');
    return goals.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  },

  async saveGoal(goal: WorkspaceGoal): Promise<void> {
    await putInStore('goals', goal);
  },

  async deleteGoal(id: string): Promise<void> {
    await deleteFromStore('goals', id);
  },

  // EVENTS
  async getEvents(): Promise<WorkspaceEvent[]> {
    const events = await getAllFromStore<WorkspaceEvent>('events');
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async saveEvent(event: WorkspaceEvent): Promise<void> {
    await putInStore('events', event);
  },

  async deleteEvent(id: string): Promise<void> {
    await deleteFromStore('events', id);
  },

  // STATS (REAL USER NUMBERS ONLY, NEVER HARDCODED)
  async getStats(): Promise<WorkspaceStats> {
    const [tasks, notes, habits, goals, expenses, events] = await Promise.all([
      this.getTasks(),
      this.getNotes(),
      this.getHabits(),
      this.getGoals(),
      this.getExpenses(),
      this.getEvents()
    ]);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalNotes = notes.length;
    const activeHabits = habits.length;
    const currentGoals = goals.filter((g) => g.status === 'in_progress').length;

    // Monthly expenses for current month
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // 'YYYY-MM'
    const monthlyExpenses = expenses
      .filter((e) => e.date && e.date.startsWith(currentMonthPrefix))
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Upcoming events (today or later)
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingEvents = events.filter((e) => e.date >= todayStr).length;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      totalNotes,
      activeHabits,
      currentGoals,
      monthlyExpenses,
      upcomingEvents
    };
  },

  // BACKUP & RESTORE
  async exportBackup(selective?: {
    notes?: boolean;
    tasks?: boolean;
    expenses?: boolean;
    habits?: boolean;
    goals?: boolean;
    events?: boolean;
  }): Promise<WorkspaceBackupPayload> {
    const [notes, tasks, expenses, habits, goals, events] = await Promise.all([
      selective && selective.notes === false ? [] : this.getNotes(),
      selective && selective.tasks === false ? [] : this.getTasks(),
      selective && selective.expenses === false ? [] : this.getExpenses(),
      selective && selective.habits === false ? [] : this.getHabits(),
      selective && selective.goals === false ? [] : this.getGoals(),
      selective && selective.events === false ? [] : this.getEvents()
    ]);

    return {
      version: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      appName: 'LifeTools',
      data: {
        notes,
        tasks,
        expenses,
        habits,
        goals,
        events
      }
    };
  },

  validateBackup(payload: any): {
    isValid: boolean;
    errors: string[];
    counts: {
      notes: number;
      tasks: number;
      expenses: number;
      habits: number;
      goals: number;
      events: number;
    };
  } {
    const errors: string[] = [];
    const counts = { notes: 0, tasks: 0, expenses: 0, habits: 0, goals: 0, events: 0 };

    if (!payload || typeof payload !== 'object') {
      return { isValid: false, errors: ['Invalid file format: Expected a JSON object.'], counts };
    }

    if (payload.appName !== 'LifeTools') {
      errors.push('Unrecognized backup origin: Backup file was not generated by LifeTools.');
    }

    if (!payload.data || typeof payload.data !== 'object') {
      errors.push('Corrupted backup structure: Missing "data" section.');
      return { isValid: false, errors, counts };
    }

    const { notes, tasks, expenses, habits, goals, events } = payload.data;

    // Validate arrays
    if (notes) {
      if (!Array.isArray(notes)) errors.push('"notes" must be an array.');
      else counts.notes = notes.length;
    }
    if (tasks) {
      if (!Array.isArray(tasks)) errors.push('"tasks" must be an array.');
      else counts.tasks = tasks.length;
    }
    if (expenses) {
      if (!Array.isArray(expenses)) errors.push('"expenses" must be an array.');
      else counts.expenses = expenses.length;
    }
    if (habits) {
      if (!Array.isArray(habits)) errors.push('"habits" must be an array.');
      else counts.habits = habits.length;
    }
    if (goals) {
      if (!Array.isArray(goals)) errors.push('"goals" must be an array.');
      else counts.goals = goals.length;
    }
    if (events) {
      if (!Array.isArray(events)) errors.push('"events" must be an array.');
      else counts.events = events.length;
    }

    return {
      isValid: errors.length === 0,
      errors,
      counts
    };
  },

  async importBackup(payload: WorkspaceBackupPayload, replaceExisting: boolean): Promise<void> {
    const validation = this.validateBackup(payload);
    if (!validation.isValid) {
      throw new Error(`Invalid backup data: ${validation.errors.join('; ')}`);
    }

    const { notes = [], tasks = [], expenses = [], habits = [], goals = [], events = [] } =
      payload.data;

    if (replaceExisting) {
      await Promise.all([
        clearStore('notes'),
        clearStore('tasks'),
        clearStore('expenses'),
        clearStore('habits'),
        clearStore('goals'),
        clearStore('events')
      ]);
    }

    // Save imported records
    for (const note of notes) await this.saveNote(note);
    for (const task of tasks) await this.saveTask(task);
    for (const expense of expenses) await this.saveExpense(expense);
    for (const habit of habits) await this.saveHabit(habit);
    for (const goal of goals) await this.saveGoal(goal);
    for (const event of events) await this.saveEvent(event);
  },

  async clearAllWorkspaceData(): Promise<void> {
    await Promise.all([
      clearStore('notes'),
      clearStore('tasks'),
      clearStore('expenses'),
      clearStore('habits'),
      clearStore('goals'),
      clearStore('events')
    ]);
  },

  async clearNotes(): Promise<void> {
    await clearStore('notes');
  }
};
