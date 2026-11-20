/**
 * LifeTools — Health, Fitness & Wellness IndexedDB Storage Engine
 * Database: lifetools_health_db (v1)
 * Guarantees 100% local, client-side persistence for sensitive health records.
 */

import {
  HealthJournalEntry,
  MedicationSchedule,
  AppointmentReminder,
  MedicalReport,
  BloodPressureLog,
  BloodSugarLog,
  WeightLog,
  BodyMeasurements,
  HealthNote,
  EmergencyMedicalCardData,
  WorkoutLog,
  FoodDiaryEntry,
  SleepLogEntry,
  MoodLogEntry,
  WellnessHabitEntry
} from '../types/health';

const DB_NAME = 'lifetools_health_db';
const DB_VERSION = 1;

type HealthStoreName =
  | 'health_journal'
  | 'medications'
  | 'appointments'
  | 'medical_reports'
  | 'blood_pressure_logs'
  | 'blood_sugar_logs'
  | 'weight_logs'
  | 'body_measurements'
  | 'health_notes'
  | 'emergency_cards'
  | 'workout_logs'
  | 'food_logs'
  | 'sleep_logs'
  | 'mood_logs'
  | 'wellness_habits';

// In-memory fallback
const memoryFallback = {
  health_journal: [] as HealthJournalEntry[],
  medications: [] as MedicationSchedule[],
  appointments: [] as AppointmentReminder[],
  medical_reports: [] as MedicalReport[],
  blood_pressure_logs: [] as BloodPressureLog[],
  blood_sugar_logs: [] as BloodSugarLog[],
  weight_logs: [] as WeightLog[],
  body_measurements: [] as BodyMeasurements[],
  health_notes: [] as HealthNote[],
  emergency_cards: [] as EmergencyMedicalCardData[],
  workout_logs: [] as WorkoutLog[],
  food_logs: [] as FoodDiaryEntry[],
  sleep_logs: [] as SleepLogEntry[],
  mood_logs: [] as MoodLogEntry[],
  wellness_habits: [] as WellnessHabitEntry[]
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

      const stores: { name: HealthStoreName; indexName?: string; indexPath?: string }[] = [
        { name: 'health_journal', indexName: 'by_date', indexPath: 'date' },
        { name: 'medications', indexName: 'by_active', indexPath: 'isActive' },
        { name: 'appointments', indexName: 'by_date', indexPath: 'appointmentDate' },
        { name: 'medical_reports', indexName: 'by_date', indexPath: 'reportDate' },
        { name: 'blood_pressure_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'blood_sugar_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'weight_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'body_measurements', indexName: 'by_date', indexPath: 'date' },
        { name: 'health_notes', indexName: 'by_category', indexPath: 'category' },
        { name: 'emergency_cards' },
        { name: 'workout_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'food_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'sleep_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'mood_logs', indexName: 'by_date', indexPath: 'date' },
        { name: 'wellness_habits' }
      ];

      for (const item of stores) {
        if (!db.objectStoreNames.contains(item.name)) {
          const store = db.createObjectStore(item.name, { keyPath: 'id' });
          if (item.indexName && item.indexPath) {
            store.createIndex(item.indexName, item.indexPath);
          }
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

async function performTx<T>(
  storeName: HealthStoreName,
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
    throw new Error('IDB_FALLBACK');
  }
}

export const healthDB = {
  // --- Blood Pressure Logs ---
  async getBpLogs(): Promise<BloodPressureLog[]> {
    try {
      return await performTx('blood_pressure_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.blood_pressure_logs];
    }
  },

  async saveBpLog(log: BloodPressureLog): Promise<void> {
    try {
      await performTx('blood_pressure_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(log);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.blood_pressure_logs.findIndex((l) => l.id === log.id);
      if (idx >= 0) memoryFallback.blood_pressure_logs[idx] = log;
      else memoryFallback.blood_pressure_logs.push(log);
    }
  },

  async deleteBpLog(id: string): Promise<void> {
    try {
      await performTx('blood_pressure_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.blood_pressure_logs = memoryFallback.blood_pressure_logs.filter((l) => l.id !== id);
    }
  },

  // --- Blood Sugar Logs ---
  async getSugarLogs(): Promise<BloodSugarLog[]> {
    try {
      return await performTx('blood_sugar_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.blood_sugar_logs];
    }
  },

  async saveSugarLog(log: BloodSugarLog): Promise<void> {
    try {
      await performTx('blood_sugar_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(log);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.blood_sugar_logs.findIndex((l) => l.id === log.id);
      if (idx >= 0) memoryFallback.blood_sugar_logs[idx] = log;
      else memoryFallback.blood_sugar_logs.push(log);
    }
  },

  async deleteSugarLog(id: string): Promise<void> {
    try {
      await performTx('blood_sugar_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.blood_sugar_logs = memoryFallback.blood_sugar_logs.filter((l) => l.id !== id);
    }
  },

  // --- Weight Logs ---
  async getWeightLogs(): Promise<WeightLog[]> {
    try {
      return await performTx('weight_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.weight_logs];
    }
  },

  async saveWeightLog(log: WeightLog): Promise<void> {
    try {
      await performTx('weight_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(log);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.weight_logs.findIndex((l) => l.id === log.id);
      if (idx >= 0) memoryFallback.weight_logs[idx] = log;
      else memoryFallback.weight_logs.push(log);
    }
  },

  async deleteWeightLog(id: string): Promise<void> {
    try {
      await performTx('weight_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.weight_logs = memoryFallback.weight_logs.filter((l) => l.id !== id);
    }
  },

  // --- Body Measurements ---
  async getMeasurements(): Promise<BodyMeasurements[]> {
    try {
      return await performTx('body_measurements', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.body_measurements];
    }
  },

  async saveMeasurement(item: BodyMeasurements): Promise<void> {
    try {
      await performTx('body_measurements', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.body_measurements.findIndex((m) => m.id === item.id);
      if (idx >= 0) memoryFallback.body_measurements[idx] = item;
      else memoryFallback.body_measurements.push(item);
    }
  },

  async deleteMeasurement(id: string): Promise<void> {
    try {
      await performTx('body_measurements', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.body_measurements = memoryFallback.body_measurements.filter((m) => m.id !== id);
    }
  },

  // --- Medications ---
  async getMedications(): Promise<MedicationSchedule[]> {
    try {
      return await performTx('medications', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.medications];
    }
  },

  async saveMedication(item: MedicationSchedule): Promise<void> {
    try {
      await performTx('medications', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.medications.findIndex((m) => m.id === item.id);
      if (idx >= 0) memoryFallback.medications[idx] = item;
      else memoryFallback.medications.push(item);
    }
  },

  async deleteMedication(id: string): Promise<void> {
    try {
      await performTx('medications', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.medications = memoryFallback.medications.filter((m) => m.id !== id);
    }
  },

  // --- Appointments ---
  async getAppointments(): Promise<AppointmentReminder[]> {
    try {
      return await performTx('appointments', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.appointments];
    }
  },

  async saveAppointment(item: AppointmentReminder): Promise<void> {
    try {
      await performTx('appointments', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.appointments.findIndex((a) => a.id === item.id);
      if (idx >= 0) memoryFallback.appointments[idx] = item;
      else memoryFallback.appointments.push(item);
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      await performTx('appointments', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.appointments = memoryFallback.appointments.filter((a) => a.id !== id);
    }
  },

  // --- Medical Reports ---
  async getReports(): Promise<MedicalReport[]> {
    try {
      return await performTx('medical_reports', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.medical_reports];
    }
  },

  async saveReport(report: MedicalReport): Promise<void> {
    try {
      await performTx('medical_reports', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(report);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.medical_reports.findIndex((r) => r.id === report.id);
      if (idx >= 0) memoryFallback.medical_reports[idx] = report;
      else memoryFallback.medical_reports.push(report);
    }
  },

  async deleteReport(id: string): Promise<void> {
    try {
      await performTx('medical_reports', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.medical_reports = memoryFallback.medical_reports.filter((r) => r.id !== id);
    }
  },

  // --- Health Journal ---
  async getJournalEntries(): Promise<HealthJournalEntry[]> {
    try {
      return await performTx('health_journal', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.health_journal];
    }
  },

  async saveJournalEntry(entry: HealthJournalEntry): Promise<void> {
    try {
      await performTx('health_journal', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(entry);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.health_journal.findIndex((j) => j.id === entry.id);
      if (idx >= 0) memoryFallback.health_journal[idx] = entry;
      else memoryFallback.health_journal.push(entry);
    }
  },

  async deleteJournalEntry(id: string): Promise<void> {
    try {
      await performTx('health_journal', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.health_journal = memoryFallback.health_journal.filter((j) => j.id !== id);
    }
  },

  // --- Health Notes ---
  async getHealthNotes(): Promise<HealthNote[]> {
    try {
      return await performTx('health_notes', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.health_notes];
    }
  },

  async saveHealthNote(note: HealthNote): Promise<void> {
    try {
      await performTx('health_notes', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(note);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.health_notes.findIndex((n) => n.id === note.id);
      if (idx >= 0) memoryFallback.health_notes[idx] = note;
      else memoryFallback.health_notes.push(note);
    }
  },

  async deleteHealthNote(id: string): Promise<void> {
    try {
      await performTx('health_notes', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.health_notes = memoryFallback.health_notes.filter((n) => n.id !== id);
    }
  },

  // --- Emergency Medical Card ---
  async getEmergencyCard(): Promise<EmergencyMedicalCardData | null> {
    try {
      return await performTx('emergency_cards', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.get('primary_emergency_card');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return memoryFallback.emergency_cards[0] || null;
    }
  },

  async saveEmergencyCard(card: EmergencyMedicalCardData): Promise<void> {
    const toSave = { ...card, id: 'primary_emergency_card' };
    try {
      await performTx('emergency_cards', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(toSave);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.emergency_cards[0] = toSave;
    }
  },

  // --- Workouts ---
  async getWorkouts(): Promise<WorkoutLog[]> {
    try {
      return await performTx('workout_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.workout_logs];
    }
  },

  async saveWorkout(log: WorkoutLog): Promise<void> {
    try {
      await performTx('workout_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(log);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.workout_logs.findIndex((w) => w.id === log.id);
      if (idx >= 0) memoryFallback.workout_logs[idx] = log;
      else memoryFallback.workout_logs.push(log);
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    try {
      await performTx('workout_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.workout_logs = memoryFallback.workout_logs.filter((w) => w.id !== id);
    }
  },

  // --- Food Diary Logs ---
  async getFoodLogs(): Promise<FoodDiaryEntry[]> {
    try {
      return await performTx('food_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.food_logs];
    }
  },

  async saveFoodLog(item: FoodDiaryEntry): Promise<void> {
    try {
      await performTx('food_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.food_logs.findIndex((f) => f.id === item.id);
      if (idx >= 0) memoryFallback.food_logs[idx] = item;
      else memoryFallback.food_logs.push(item);
    }
  },

  async deleteFoodLog(id: string): Promise<void> {
    try {
      await performTx('food_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.food_logs = memoryFallback.food_logs.filter((f) => f.id !== id);
    }
  },

  // --- Sleep Logs ---
  async getSleepLogs(): Promise<SleepLogEntry[]> {
    try {
      return await performTx('sleep_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.sleep_logs];
    }
  },

  async saveSleepLog(item: SleepLogEntry): Promise<void> {
    try {
      await performTx('sleep_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.sleep_logs.findIndex((s) => s.id === item.id);
      if (idx >= 0) memoryFallback.sleep_logs[idx] = item;
      else memoryFallback.sleep_logs.push(item);
    }
  },

  async deleteSleepLog(id: string): Promise<void> {
    try {
      await performTx('sleep_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.sleep_logs = memoryFallback.sleep_logs.filter((s) => s.id !== id);
    }
  },

  // --- Mood Logs ---
  async getMoodLogs(): Promise<MoodLogEntry[]> {
    try {
      return await performTx('mood_logs', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.mood_logs];
    }
  },

  async saveMoodLog(item: MoodLogEntry): Promise<void> {
    try {
      await performTx('mood_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.mood_logs.findIndex((m) => m.id === item.id);
      if (idx >= 0) memoryFallback.mood_logs[idx] = item;
      else memoryFallback.mood_logs.push(item);
    }
  },

  async deleteMoodLog(id: string): Promise<void> {
    try {
      await performTx('mood_logs', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.mood_logs = memoryFallback.mood_logs.filter((m) => m.id !== id);
    }
  },

  // --- Wellness Habits ---
  async getHabits(): Promise<WellnessHabitEntry[]> {
    try {
      return await performTx('wellness_habits', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.wellness_habits];
    }
  },

  async saveHabit(habit: WellnessHabitEntry): Promise<void> {
    try {
      await performTx('wellness_habits', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(habit);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.wellness_habits.findIndex((h) => h.id === habit.id);
      if (idx >= 0) memoryFallback.wellness_habits[idx] = habit;
      else memoryFallback.wellness_habits.push(habit);
    }
  },

  async deleteHabit(id: string): Promise<void> {
    try {
      await performTx('wellness_habits', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.wellness_habits = memoryFallback.wellness_habits.filter((h) => h.id !== id);
    }
  },

  // --- Aggregate Stats & Export/Restore ---
  async getStats(): Promise<{
    bpLogs: number;
    sugarLogs: number;
    weightLogs: number;
    measurements: number;
    medications: number;
    appointments: number;
    reports: number;
    journal: number;
    notes: number;
    workouts: number;
    foods: number;
    sleep: number;
    mood: number;
    habits: number;
    hasEmergencyCard: boolean;
  }> {
    const [bp, sugar, wt, meas, meds, appts, reps, jrnl, nts, wouts, fds, slp, md, hb, card] =
      await Promise.all([
        this.getBpLogs(),
        this.getSugarLogs(),
        this.getWeightLogs(),
        this.getMeasurements(),
        this.getMedications(),
        this.getAppointments(),
        this.getReports(),
        this.getJournalEntries(),
        this.getHealthNotes(),
        this.getWorkouts(),
        this.getFoodLogs(),
        this.getSleepLogs(),
        this.getMoodLogs(),
        this.getHabits(),
        this.getEmergencyCard()
      ]);

    return {
      bpLogs: bp.length,
      sugarLogs: sugar.length,
      weightLogs: wt.length,
      measurements: meas.length,
      medications: meds.length,
      appointments: appts.length,
      reports: reps.length,
      journal: jrnl.length,
      notes: nts.length,
      workouts: wouts.length,
      foods: fds.length,
      sleep: slp.length,
      mood: md.length,
      habits: hb.length,
      hasEmergencyCard: card !== null
    };
  },

  async exportAll(): Promise<Record<string, any>> {
    const [bp, sugar, wt, meas, meds, appts, reps, jrnl, nts, wouts, fds, slp, md, hb, card] =
      await Promise.all([
        this.getBpLogs(),
        this.getSugarLogs(),
        this.getWeightLogs(),
        this.getMeasurements(),
        this.getMedications(),
        this.getAppointments(),
        this.getReports(),
        this.getJournalEntries(),
        this.getHealthNotes(),
        this.getWorkouts(),
        this.getFoodLogs(),
        this.getSleepLogs(),
        this.getMoodLogs(),
        this.getHabits(),
        this.getEmergencyCard()
      ]);

    return {
      blood_pressure_logs: bp,
      blood_sugar_logs: sugar,
      weight_logs: wt,
      body_measurements: meas,
      medications: meds,
      appointments: appts,
      medical_reports: reps,
      health_journal: jrnl,
      health_notes: nts,
      workout_logs: wouts,
      food_logs: fds,
      sleep_logs: slp,
      mood_logs: md,
      wellness_habits: hb,
      emergency_card: card
    };
  },

  async restoreAll(payload: Record<string, any>, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
    if (mode === 'replace') {
      const [bp, sugar, wt, meas, meds, appts, reps, jrnl, nts, wouts, fds, slp, md, hb] =
        await Promise.all([
          this.getBpLogs(),
          this.getSugarLogs(),
          this.getWeightLogs(),
          this.getMeasurements(),
          this.getMedications(),
          this.getAppointments(),
          this.getReports(),
          this.getJournalEntries(),
          this.getHealthNotes(),
          this.getWorkouts(),
          this.getFoodLogs(),
          this.getSleepLogs(),
          this.getMoodLogs(),
          this.getHabits()
        ]);

      await Promise.all([
        ...bp.map((i) => this.deleteBpLog(i.id)),
        ...sugar.map((i) => this.deleteSugarLog(i.id)),
        ...wt.map((i) => this.deleteWeightLog(i.id)),
        ...meas.map((i) => this.deleteMeasurement(i.id)),
        ...meds.map((i) => this.deleteMedication(i.id)),
        ...appts.map((i) => this.deleteAppointment(i.id)),
        ...reps.map((i) => this.deleteReport(i.id)),
        ...jrnl.map((i) => this.deleteJournalEntry(i.id)),
        ...nts.map((i) => this.deleteHealthNote(i.id)),
        ...wouts.map((i) => this.deleteWorkout(i.id)),
        ...fds.map((i) => this.deleteFoodLog(i.id)),
        ...slp.map((i) => this.deleteSleepLog(i.id)),
        ...md.map((i) => this.deleteMoodLog(i.id)),
        ...hb.map((i) => this.deleteHabit(i.id))
      ]);
    }

    if (Array.isArray(payload.blood_pressure_logs)) {
      for (const item of payload.blood_pressure_logs) await this.saveBpLog(item);
    }
    if (Array.isArray(payload.blood_sugar_logs)) {
      for (const item of payload.blood_sugar_logs) await this.saveSugarLog(item);
    }
    if (Array.isArray(payload.weight_logs)) {
      for (const item of payload.weight_logs) await this.saveWeightLog(item);
    }
    if (Array.isArray(payload.body_measurements)) {
      for (const item of payload.body_measurements) await this.saveMeasurement(item);
    }
    if (Array.isArray(payload.medications)) {
      for (const item of payload.medications) await this.saveMedication(item);
    }
    if (Array.isArray(payload.appointments)) {
      for (const item of payload.appointments) await this.saveAppointment(item);
    }
    if (Array.isArray(payload.medical_reports)) {
      for (const item of payload.medical_reports) await this.saveReport(item);
    }
    if (Array.isArray(payload.health_journal)) {
      for (const item of payload.health_journal) await this.saveJournalEntry(item);
    }
    if (Array.isArray(payload.health_notes)) {
      for (const item of payload.health_notes) await this.saveHealthNote(item);
    }
    if (Array.isArray(payload.workout_logs)) {
      for (const item of payload.workout_logs) await this.saveWorkout(item);
    }
    if (Array.isArray(payload.food_logs)) {
      for (const item of payload.food_logs) await this.saveFoodLog(item);
    }
    if (Array.isArray(payload.sleep_logs)) {
      for (const item of payload.sleep_logs) await this.saveSleepLog(item);
    }
    if (Array.isArray(payload.mood_logs)) {
      for (const item of payload.mood_logs) await this.saveMoodLog(item);
    }
    if (Array.isArray(payload.wellness_habits)) {
      for (const item of payload.wellness_habits) await this.saveHabit(item);
    }
    if (payload.emergency_card) {
      await this.saveEmergencyCard(payload.emergency_card);
    }
  }
};
