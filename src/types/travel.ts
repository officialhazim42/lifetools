/**
 * LifeTools — Travel, Navigation & Planning Domain Types
 * 100% Client-side data models for trips, itineraries, packing lists,
 * navigation coordinates, documents, hotel bookings, flight records, and expenses.
 */

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  travelersCount: number;
  estimatedBudget: number;
  currency: string;
  notes?: string;
  tags?: string[];
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  coverEmoji?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryActivity {
  id: string;
  tripId?: string;
  dayNumber: number; // 1, 2, 3...
  date?: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  title: string;
  location?: string;
  cost?: number;
  category: 'sightseeing' | 'food' | 'transit' | 'hotel' | 'flight' | 'activity' | 'other';
  notes?: string;
  isCompleted?: boolean;
}

export interface PackingItem {
  id: string;
  tripId?: string;
  category: 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'health' | 'gear' | 'miscellaneous';
  name: string;
  quantity: number;
  isPacked: boolean;
  weightGrams?: number;
  bagType: 'carry_on' | 'checked' | 'personal_item';
  essential?: boolean;
}

export interface PackingListTemplate {
  id: string;
  title: string;
  tripType: 'general' | 'international' | 'business' | 'camping' | 'beach' | 'winter';
  items: Omit<PackingItem, 'id' | 'tripId'>[];
  createdAt: string;
}

export interface TravelDocumentRecord {
  id: string;
  title: string;
  documentType: 'passport' | 'visa' | 'id_card' | 'driver_license' | 'insurance' | 'ticket' | 'other';
  documentNumber?: string;
  issuingCountry?: string;
  issueDate?: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD
  holderName: string;
  notes?: string;
  reminderDaysBefore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HotelBookingRecord {
  id: string;
  tripId?: string;
  hotelName: string;
  address?: string;
  city: string;
  checkInDate: string; // YYYY-MM-DD
  checkInTime?: string; // HH:MM
  checkOutDate: string; // YYYY-MM-DD
  checkOutTime?: string; // HH:MM
  confirmationNumber?: string;
  roomType?: string;
  totalCost?: number;
  currency?: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
}

export interface FlightRecord {
  id: string;
  tripId?: string;
  airline: string;
  flightNumber: string;
  departureAirport: string; // e.g. "JFK" or "London Heathrow"
  departureTerminal?: string;
  departureGate?: string;
  departureTime: string; // ISO or YYYY-MM-DDTHH:MM
  arrivalAirport: string;
  arrivalTerminal?: string;
  arrivalGate?: string;
  arrivalTime: string;
  bookingReference?: string;
  seatNumber?: string;
  boardingGroup?: string;
  notes?: string;
  createdAt: string;
}

export interface TravelExpenseRecord {
  id: string;
  tripId?: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: 'transport' | 'lodging' | 'food' | 'activities' | 'shopping' | 'emergency' | 'other';
  amount: number;
  currency: string;
  paidBy: string;
  splitAmong?: string[];
  receiptNotes?: string;
  createdAt: string;
}

export interface TravelJournalEntry {
  id: string;
  tripId?: string;
  date: string; // YYYY-MM-DD
  cityOrPlace: string;
  title: string;
  body: string;
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  rating?: number; // 1 to 5 stars
  highlights?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyTravelCardData {
  id?: string;
  travelerName: string;
  passportNumber?: string;
  nationality?: string;
  bloodType?: string;
  allergies?: string;
  homeCountryEmergencyPhone?: string;
  destinationEmbassyAddress?: string;
  destinationEmbassyPhone?: string;
  localEmergencyNumber?: string;
  insurancePolicyNumber?: string;
  insuranceEmergencyPhone?: string;
  localContactName?: string;
  localContactPhone?: string;
  notes?: string;
  updatedAt: string;
}

export interface CoordinateLocation {
  latitude: number;
  longitude: number;
  name?: string;
}
