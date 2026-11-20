/**
 * LifeTools — Travel, Navigation & Planning IndexedDB Storage Engine
 * Database: lifetools_travel_db (v1)
 * Guarantees 100% local, client-side persistence for trips, itineraries,
 * packing lists, travel documents, hotel bookings, flights, and expenses.
 */

import {
  TripPlan,
  ItineraryActivity,
  PackingItem,
  TravelDocumentRecord,
  HotelBookingRecord,
  FlightRecord,
  TravelExpenseRecord,
  TravelJournalEntry,
  EmergencyTravelCardData
} from '../types/travel';

const DB_NAME = 'lifetools_travel_db';
const DB_VERSION = 1;

type TravelStoreName =
  | 'trips'
  | 'itineraries'
  | 'packing_lists'
  | 'travel_documents'
  | 'hotel_bookings'
  | 'flight_records'
  | 'travel_expenses'
  | 'travel_journal'
  | 'emergency_cards';

// In-memory fallback for private/incognito browsing
const memoryFallback = {
  trips: [] as TripPlan[],
  itineraries: [] as ItineraryActivity[],
  packing_lists: [] as PackingItem[],
  travel_documents: [] as TravelDocumentRecord[],
  hotel_bookings: [] as HotelBookingRecord[],
  flight_records: [] as FlightRecord[],
  travel_expenses: [] as TravelExpenseRecord[],
  travel_journal: [] as TravelJournalEntry[],
  emergency_cards: [] as EmergencyTravelCardData[]
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

      const stores: { name: TravelStoreName; indexName?: string; indexPath?: string }[] = [
        { name: 'trips', indexName: 'by_date', indexPath: 'startDate' },
        { name: 'itineraries', indexName: 'by_trip', indexPath: 'tripId' },
        { name: 'packing_lists', indexName: 'by_trip', indexPath: 'tripId' },
        { name: 'travel_documents', indexName: 'by_type', indexPath: 'documentType' },
        { name: 'hotel_bookings', indexName: 'by_date', indexPath: 'checkInDate' },
        { name: 'flight_records', indexName: 'by_date', indexPath: 'departureTime' },
        { name: 'travel_expenses', indexName: 'by_trip', indexPath: 'tripId' },
        { name: 'travel_journal', indexName: 'by_trip', indexPath: 'tripId' },
        { name: 'emergency_cards' }
      ];

      for (const item of stores) {
        if (!db.objectStoreNames.contains(item.name)) {
          const store = db.createObjectStore(item.name, { keyPath: 'id' });
          if (item.indexName && item.indexPath) {
            store.createIndex(item.indexName, item.indexPath, { unique: false });
          }
        }
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
}

async function performTx<T>(
  storeName: TravelStoreName,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => Promise<T>
): Promise<T> {
  try {
    const db = await openDB();
    return new Promise<T>((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);

      callback(store)
        .then((res) => {
          tx.oncomplete = () => resolve(res);
        })
        .catch(reject);

      tx.onerror = () => reject(tx.error);
    });
  } catch {
    throw new Error('IDB_FALLBACK');
  }
}

export const travelDB = {
  // --- Trips ---
  async getTrips(): Promise<TripPlan[]> {
    try {
      return await performTx('trips', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.trips];
    }
  },

  async saveTrip(trip: TripPlan): Promise<void> {
    try {
      await performTx('trips', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(trip);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.trips.findIndex((t) => t.id === trip.id);
      if (idx >= 0) memoryFallback.trips[idx] = trip;
      else memoryFallback.trips.push(trip);
    }
  },

  async deleteTrip(id: string): Promise<void> {
    try {
      await performTx('trips', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.trips = memoryFallback.trips.filter((t) => t.id !== id);
    }
  },

  // --- Itineraries ---
  async getItineraries(tripId?: string): Promise<ItineraryActivity[]> {
    try {
      const all = await performTx('itineraries', 'readonly', (store) => {
        return new Promise<ItineraryActivity[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
      return tripId ? all.filter((a) => a.tripId === tripId) : all;
    } catch {
      return tripId
        ? memoryFallback.itineraries.filter((a) => a.tripId === tripId)
        : [...memoryFallback.itineraries];
    }
  },

  async saveItinerary(item: ItineraryActivity): Promise<void> {
    try {
      await performTx('itineraries', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.itineraries.findIndex((a) => a.id === item.id);
      if (idx >= 0) memoryFallback.itineraries[idx] = item;
      else memoryFallback.itineraries.push(item);
    }
  },

  async deleteItinerary(id: string): Promise<void> {
    try {
      await performTx('itineraries', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.itineraries = memoryFallback.itineraries.filter((a) => a.id !== id);
    }
  },

  // --- Packing Lists ---
  async getPackingItems(tripId?: string): Promise<PackingItem[]> {
    try {
      const all = await performTx('packing_lists', 'readonly', (store) => {
        return new Promise<PackingItem[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
      return tripId ? all.filter((p) => p.tripId === tripId) : all;
    } catch {
      return tripId
        ? memoryFallback.packing_lists.filter((p) => p.tripId === tripId)
        : [...memoryFallback.packing_lists];
    }
  },

  async savePackingItem(item: PackingItem): Promise<void> {
    try {
      await performTx('packing_lists', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.packing_lists.findIndex((p) => p.id === item.id);
      if (idx >= 0) memoryFallback.packing_lists[idx] = item;
      else memoryFallback.packing_lists.push(item);
    }
  },

  async deletePackingItem(id: string): Promise<void> {
    try {
      await performTx('packing_lists', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.packing_lists = memoryFallback.packing_lists.filter((p) => p.id !== id);
    }
  },

  // --- Travel Documents ---
  async getDocuments(): Promise<TravelDocumentRecord[]> {
    try {
      return await performTx('travel_documents', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return [...memoryFallback.travel_documents];
    }
  },

  async saveDocument(doc: TravelDocumentRecord): Promise<void> {
    try {
      await performTx('travel_documents', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(doc);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.travel_documents.findIndex((d) => d.id === doc.id);
      if (idx >= 0) memoryFallback.travel_documents[idx] = doc;
      else memoryFallback.travel_documents.push(doc);
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      await performTx('travel_documents', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.travel_documents = memoryFallback.travel_documents.filter((d) => d.id !== id);
    }
  },

  // --- Hotel Bookings ---
  async getHotels(tripId?: string): Promise<HotelBookingRecord[]> {
    try {
      const all = await performTx('hotel_bookings', 'readonly', (store) => {
        return new Promise<HotelBookingRecord[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
      return tripId ? all.filter((h) => h.tripId === tripId) : all;
    } catch {
      return tripId
        ? memoryFallback.hotel_bookings.filter((h) => h.tripId === tripId)
        : [...memoryFallback.hotel_bookings];
    }
  },

  async saveHotel(hotel: HotelBookingRecord): Promise<void> {
    try {
      await performTx('hotel_bookings', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(hotel);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.hotel_bookings.findIndex((h) => h.id === hotel.id);
      if (idx >= 0) memoryFallback.hotel_bookings[idx] = hotel;
      else memoryFallback.hotel_bookings.push(hotel);
    }
  },

  async deleteHotel(id: string): Promise<void> {
    try {
      await performTx('hotel_bookings', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.hotel_bookings = memoryFallback.hotel_bookings.filter((h) => h.id !== id);
    }
  },

  // --- Flight Records ---
  async getFlights(tripId?: string): Promise<FlightRecord[]> {
    try {
      const all = await performTx('flight_records', 'readonly', (store) => {
        return new Promise<FlightRecord[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
      return tripId ? all.filter((f) => f.tripId === tripId) : all;
    } catch {
      return tripId
        ? memoryFallback.flight_records.filter((f) => f.tripId === tripId)
        : [...memoryFallback.flight_records];
    }
  },

  async saveFlight(flight: FlightRecord): Promise<void> {
    try {
      await performTx('flight_records', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(flight);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.flight_records.findIndex((f) => f.id === flight.id);
      if (idx >= 0) memoryFallback.flight_records[idx] = flight;
      else memoryFallback.flight_records.push(flight);
    }
  },

  async deleteFlight(id: string): Promise<void> {
    try {
      await performTx('flight_records', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.flight_records = memoryFallback.flight_records.filter((f) => f.id !== id);
    }
  },

  // --- Travel Expenses ---
  async getExpenses(tripId?: string): Promise<TravelExpenseRecord[]> {
    try {
      const all = await performTx('travel_expenses', 'readonly', (store) => {
        return new Promise<TravelExpenseRecord[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
      return tripId ? all.filter((e) => e.tripId === tripId) : all;
    } catch {
      return tripId
        ? memoryFallback.travel_expenses.filter((e) => e.tripId === tripId)
        : [...memoryFallback.travel_expenses];
    }
  },

  async saveExpense(expense: TravelExpenseRecord): Promise<void> {
    try {
      await performTx('travel_expenses', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(expense);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.travel_expenses.findIndex((e) => e.id === expense.id);
      if (idx >= 0) memoryFallback.travel_expenses[idx] = expense;
      else memoryFallback.travel_expenses.push(expense);
    }
  },

  async deleteExpense(id: string): Promise<void> {
    try {
      await performTx('travel_expenses', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.travel_expenses = memoryFallback.travel_expenses.filter((e) => e.id !== id);
    }
  },

  // --- Travel Journal ---
  async getJournalEntries(tripId?: string): Promise<TravelJournalEntry[]> {
    try {
      const all = await performTx('travel_journal', 'readonly', (store) => {
        return new Promise<TravelJournalEntry[]>((resolve, reject) => {
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => reject(req.error);
        });
      });
      return tripId ? all.filter((j) => j.tripId === tripId) : all;
    } catch {
      return tripId
        ? memoryFallback.travel_journal.filter((j) => j.tripId === tripId)
        : [...memoryFallback.travel_journal];
    }
  },

  async saveJournalEntry(entry: TravelJournalEntry): Promise<void> {
    try {
      await performTx('travel_journal', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.put(entry);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      const idx = memoryFallback.travel_journal.findIndex((j) => j.id === entry.id);
      if (idx >= 0) memoryFallback.travel_journal[idx] = entry;
      else memoryFallback.travel_journal.push(entry);
    }
  },

  async deleteJournalEntry(id: string): Promise<void> {
    try {
      await performTx('travel_journal', 'readwrite', (store) => {
        return new Promise<void>((resolve, reject) => {
          const req = store.delete(id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      memoryFallback.travel_journal = memoryFallback.travel_journal.filter((j) => j.id !== id);
    }
  },

  // --- Emergency Travel Card ---
  async getEmergencyCard(): Promise<EmergencyTravelCardData | null> {
    try {
      return await performTx('emergency_cards', 'readonly', (store) => {
        return new Promise((resolve, reject) => {
          const req = store.get('primary_travel_emergency_card');
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
      });
    } catch {
      return memoryFallback.emergency_cards[0] || null;
    }
  },

  async saveEmergencyCard(card: EmergencyTravelCardData): Promise<void> {
    const toSave = { ...card, id: 'primary_travel_emergency_card' };
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

  // --- Aggregate Stats & Export/Restore ---
  async getStats(): Promise<{
    trips: number;
    itineraries: number;
    packingItems: number;
    documents: number;
    hotels: number;
    flights: number;
    expenses: number;
    journal: number;
    hasEmergencyCard: boolean;
  }> {
    const [trips, itins, pack, docs, hotels, flights, expenses, journal, card] =
      await Promise.all([
        this.getTrips(),
        this.getItineraries(),
        this.getPackingItems(),
        this.getDocuments(),
        this.getHotels(),
        this.getFlights(),
        this.getExpenses(),
        this.getJournalEntries(),
        this.getEmergencyCard()
      ]);

    return {
      trips: trips.length,
      itineraries: itins.length,
      packingItems: pack.length,
      documents: docs.length,
      hotels: hotels.length,
      flights: flights.length,
      expenses: expenses.length,
      journal: journal.length,
      hasEmergencyCard: card !== null
    };
  },

  async exportAll(): Promise<Record<string, any>> {
    const [trips, itins, pack, docs, hotels, flights, expenses, journal, card] =
      await Promise.all([
        this.getTrips(),
        this.getItineraries(),
        this.getPackingItems(),
        this.getDocuments(),
        this.getHotels(),
        this.getFlights(),
        this.getExpenses(),
        this.getJournalEntries(),
        this.getEmergencyCard()
      ]);

    return {
      trips,
      itineraries: itins,
      packing_lists: pack,
      travel_documents: docs,
      hotel_bookings: hotels,
      flight_records: flights,
      travel_expenses: expenses,
      travel_journal: journal,
      emergency_card: card
    };
  },

  async restoreAll(payload: Record<string, any>, mode: 'merge' | 'replace' = 'merge'): Promise<void> {
    if (mode === 'replace') {
      const [trips, itins, pack, docs, hotels, flights, expenses, journal] =
        await Promise.all([
          this.getTrips(),
          this.getItineraries(),
          this.getPackingItems(),
          this.getDocuments(),
          this.getHotels(),
          this.getFlights(),
          this.getExpenses(),
          this.getJournalEntries()
        ]);

      await Promise.all([
        ...trips.map((i) => this.deleteTrip(i.id)),
        ...itins.map((i) => this.deleteItinerary(i.id)),
        ...pack.map((i) => this.deletePackingItem(i.id)),
        ...docs.map((i) => this.deleteDocument(i.id)),
        ...hotels.map((i) => this.deleteHotel(i.id)),
        ...flights.map((i) => this.deleteFlight(i.id)),
        ...expenses.map((i) => this.deleteExpense(i.id)),
        ...journal.map((i) => this.deleteJournalEntry(i.id))
      ]);
    }

    if (payload.trips && Array.isArray(payload.trips)) {
      for (const item of payload.trips) await this.saveTrip(item);
    }
    if (payload.itineraries && Array.isArray(payload.itineraries)) {
      for (const item of payload.itineraries) await this.saveItinerary(item);
    }
    if (payload.packing_lists && Array.isArray(payload.packing_lists)) {
      for (const item of payload.packing_lists) await this.savePackingItem(item);
    }
    if (payload.travel_documents && Array.isArray(payload.travel_documents)) {
      for (const item of payload.travel_documents) await this.saveDocument(item);
    }
    if (payload.hotel_bookings && Array.isArray(payload.hotel_bookings)) {
      for (const item of payload.hotel_bookings) await this.saveHotel(item);
    }
    if (payload.flight_records && Array.isArray(payload.flight_records)) {
      for (const item of payload.flight_records) await this.saveFlight(item);
    }
    if (payload.travel_expenses && Array.isArray(payload.travel_expenses)) {
      for (const item of payload.travel_expenses) await this.saveExpense(item);
    }
    if (payload.travel_journal && Array.isArray(payload.travel_journal)) {
      for (const item of payload.travel_journal) await this.saveJournalEntry(item);
    }
    if (payload.emergency_card && typeof payload.emergency_card === 'object') {
      await this.saveEmergencyCard(payload.emergency_card);
    }
  },

  // Aliases for convenience
  async getHotelBookings(tripId?: string): Promise<HotelBookingRecord[]> {
    return this.getHotels(tripId);
  },
  async saveHotelBooking(hotel: HotelBookingRecord): Promise<void> {
    return this.saveHotel(hotel);
  },
  async deleteHotelBooking(id: string): Promise<void> {
    return this.deleteHotel(id);
  },
  async getFlightRecords(tripId?: string): Promise<FlightRecord[]> {
    return this.getFlights(tripId);
  },
  async saveFlightRecord(flight: FlightRecord): Promise<void> {
    return this.saveFlight(flight);
  },
  async deleteFlightRecord(id: string): Promise<void> {
    return this.deleteFlight(id);
  },
  async getTravelExpenses(tripId?: string): Promise<TravelExpenseRecord[]> {
    return this.getExpenses(tripId);
  },
  async saveTravelExpense(expense: TravelExpenseRecord): Promise<void> {
    return this.saveExpense(expense);
  },
  async deleteTravelExpense(id: string): Promise<void> {
    return this.deleteExpense(id);
  }
};
