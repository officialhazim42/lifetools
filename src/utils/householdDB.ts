/**
 * LifeTools — Home, Household & Property IndexedDB Storage Engine
 * Database: lifetools_household_db (v1)
 * Guarantees 100% local, client-side persistence for chores, inventories,
 * shopping lists, maintenance, reminders, repair expenses, and properties.
 */

import {
  HouseholdChore,
  InventoryItem,
  HouseholdShoppingItem,
  HomeMaintenanceRecord,
  HomeReminder,
  HomeRepairExpense,
  PropertyExpense,
  PropertyRecord
} from '../types/household';

const DB_NAME = 'lifetools_household_db';
const DB_VERSION = 1;

type HouseholdStoreName =
  | 'chores'
  | 'inventories'
  | 'shopping_lists'
  | 'maintenance_records'
  | 'reminders'
  | 'repair_expenses'
  | 'property_expenses'
  | 'property_records';

// In-memory fallback for environments with blocked storage
const memoryFallback = {
  chores: [] as HouseholdChore[],
  inventories: [] as InventoryItem[],
  shopping_lists: [] as HouseholdShoppingItem[],
  maintenance_records: [] as HomeMaintenanceRecord[],
  reminders: [] as HomeReminder[],
  repair_expenses: [] as HomeRepairExpense[],
  property_expenses: [] as PropertyExpense[],
  property_records: [] as PropertyRecord[]
};

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('chores')) {
        db.createObjectStore('chores', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('inventories')) {
        const store = db.createObjectStore('inventories', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('shopping_lists')) {
        const store = db.createObjectStore('shopping_lists', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('maintenance_records')) {
        const store = db.createObjectStore('maintenance_records', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('reminders')) {
        const store = db.createObjectStore('reminders', { keyPath: 'id' });
        store.createIndex('type', 'type', { unique: false });
      }
      if (!db.objectStoreNames.contains('repair_expenses')) {
        const store = db.createObjectStore('repair_expenses', { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
      }
      if (!db.objectStoreNames.contains('property_expenses')) {
        const store = db.createObjectStore('property_expenses', { keyPath: 'id' });
        store.createIndex('propertyId', 'propertyId', { unique: false });
      }
      if (!db.objectStoreNames.contains('property_records')) {
        db.createObjectStore('property_records', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

async function getAllFromStore<T>(storeName: HouseholdStoreName): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [...(memoryFallback[storeName] as unknown as T[])];
  }
}

async function putToStore<T extends { id: string }>(storeName: HouseholdStoreName, item: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = memoryFallback[storeName] as any[];
    const idx = list.findIndex(x => x.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
  }
}

async function deleteFromStore(storeName: HouseholdStoreName, id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const list = memoryFallback[storeName] as any[];
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
  }
}

async function clearStore(storeName: HouseholdStoreName): Promise<void> {
  try {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    (memoryFallback[storeName] as any[]).length = 0;
  }
}

export const householdDB = {
  // Chores
  getChores: () => getAllFromStore<HouseholdChore>('chores'),
  saveChore: (chore: HouseholdChore) => putToStore<HouseholdChore>('chores', chore),
  deleteChore: (id: string) => deleteFromStore('chores', id),
  async toggleChoreCompletion(id: string): Promise<void> {
    const chores = await householdDB.getChores();
    const chore = chores.find(c => c.id === id);
    if (chore) {
      chore.isCompleted = !chore.isCompleted;
      chore.completedAt = chore.isCompleted ? new Date().toISOString() : undefined;
      await householdDB.saveChore(chore);
    }
  },

  // Inventories (pantry, fridge, home assets, groceries)
  getInventories: () => getAllFromStore<InventoryItem>('inventories'),
  getInventoryByCategory: async (category: InventoryItem['category']) => {
    const all = await householdDB.getInventories();
    return all.filter(i => i.category === category);
  },
  saveInventoryItem: (item: InventoryItem) => putToStore<InventoryItem>('inventories', item),
  deleteInventoryItem: (id: string) => deleteFromStore('inventories', id),

  // Shopping List
  getShoppingItems: () => getAllFromStore<HouseholdShoppingItem>('shopping_lists'),
  saveShoppingItem: (item: HouseholdShoppingItem) => putToStore<HouseholdShoppingItem>('shopping_lists', item),
  deleteShoppingItem: (id: string) => deleteFromStore('shopping_lists', id),
  async toggleShoppingItem(id: string): Promise<void> {
    const items = await householdDB.getShoppingItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.isPurchased = !item.isPurchased;
      await householdDB.saveShoppingItem(item);
    }
  },

  // Maintenance Records
  getMaintenanceRecords: () => getAllFromStore<HomeMaintenanceRecord>('maintenance_records'),
  saveMaintenanceRecord: (record: HomeMaintenanceRecord) => putToStore<HomeMaintenanceRecord>('maintenance_records', record),
  deleteMaintenanceRecord: (id: string) => deleteFromStore('maintenance_records', id),

  // Reminders
  getReminders: () => getAllFromStore<HomeReminder>('reminders'),
  saveReminder: (reminder: HomeReminder) => putToStore<HomeReminder>('reminders', reminder),
  deleteReminder: (id: string) => deleteFromStore('reminders', id),
  async toggleReminderResolved(id: string): Promise<void> {
    const reminders = await householdDB.getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      reminder.isResolved = !reminder.isResolved;
      await householdDB.saveReminder(reminder);
    }
  },

  // Repair Expenses
  getRepairExpenses: () => getAllFromStore<HomeRepairExpense>('repair_expenses'),
  saveRepairExpense: (expense: HomeRepairExpense) => putToStore<HomeRepairExpense>('repair_expenses', expense),
  deleteRepairExpense: (id: string) => deleteFromStore('repair_expenses', id),

  // Property Expenses
  getPropertyExpenses: () => getAllFromStore<PropertyExpense>('property_expenses'),
  savePropertyExpense: (expense: PropertyExpense) => putToStore<PropertyExpense>('property_expenses', expense),
  deletePropertyExpense: (id: string) => deleteFromStore('property_expenses', id),

  // Property Records
  getPropertyRecords: () => getAllFromStore<PropertyRecord>('property_records'),
  savePropertyRecord: (property: PropertyRecord) => putToStore<PropertyRecord>('property_records', property),
  deletePropertyRecord: (id: string) => deleteFromStore('property_records', id),

  // Convenience Aliases for tools
  getChoresList: () => householdDB.getChores(),
  saveChoreItem: (item: HouseholdChore) => householdDB.saveChore(item),
  deleteChoreItem: (id: string) => householdDB.deleteChore(id),

  // Stats & Universal Backup
  async getStats() {
    const [
      chores,
      inventories,
      shopping,
      maintenance,
      reminders,
      repairs,
      propExpenses,
      properties
    ] = await Promise.all([
      householdDB.getChores(),
      householdDB.getInventories(),
      householdDB.getShoppingItems(),
      householdDB.getMaintenanceRecords(),
      householdDB.getReminders(),
      householdDB.getRepairExpenses(),
      householdDB.getPropertyExpenses(),
      householdDB.getPropertyRecords()
    ]);

    const total =
      chores.length +
      inventories.length +
      shopping.length +
      maintenance.length +
      reminders.length +
      repairs.length +
      propExpenses.length +
      properties.length;

    return {
      chores: chores.length,
      inventories: inventories.length,
      shopping: shopping.length,
      maintenance: maintenance.length,
      reminders: reminders.length,
      repairs: repairs.length,
      propertyExpenses: propExpenses.length,
      properties: properties.length,
      total
    };
  },

  async exportAll() {
    const [
      chores,
      inventories,
      shopping_lists,
      maintenance_records,
      reminders,
      repair_expenses,
      property_expenses,
      property_records
    ] = await Promise.all([
      householdDB.getChores(),
      householdDB.getInventories(),
      householdDB.getShoppingItems(),
      householdDB.getMaintenanceRecords(),
      householdDB.getReminders(),
      householdDB.getRepairExpenses(),
      householdDB.getPropertyExpenses(),
      householdDB.getPropertyRecords()
    ]);

    return {
      chores,
      inventories,
      shopping_lists,
      maintenance_records,
      reminders,
      repair_expenses,
      property_expenses,
      property_records
    };
  },

  async restoreAll(data: any, mode: 'merge' | 'replace' = 'replace'): Promise<void> {
    if (!data) return;

    if (mode === 'replace') {
      await Promise.all([
        clearStore('chores'),
        clearStore('inventories'),
        clearStore('shopping_lists'),
        clearStore('maintenance_records'),
        clearStore('reminders'),
        clearStore('repair_expenses'),
        clearStore('property_expenses'),
        clearStore('property_records')
      ]);
    }

    const tasks: Promise<any>[] = [];

    if (Array.isArray(data.chores)) {
      for (const item of data.chores) tasks.push(putToStore('chores', item));
    }
    if (Array.isArray(data.inventories)) {
      for (const item of data.inventories) tasks.push(putToStore('inventories', item));
    }
    if (Array.isArray(data.shopping_lists)) {
      for (const item of data.shopping_lists) tasks.push(putToStore('shopping_lists', item));
    }
    if (Array.isArray(data.maintenance_records)) {
      for (const item of data.maintenance_records) tasks.push(putToStore('maintenance_records', item));
    }
    if (Array.isArray(data.reminders)) {
      for (const item of data.reminders) tasks.push(putToStore('reminders', item));
    }
    if (Array.isArray(data.repair_expenses)) {
      for (const item of data.repair_expenses) tasks.push(putToStore('repair_expenses', item));
    }
    if (Array.isArray(data.property_expenses)) {
      for (const item of data.property_expenses) tasks.push(putToStore('property_expenses', item));
    }
    if (Array.isArray(data.property_records)) {
      for (const item of data.property_records) tasks.push(putToStore('property_records', item));
    }

    await Promise.all(tasks);
  }
};
