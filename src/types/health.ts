/**
 * LifeTools — Health, Fitness & Wellness Domain Types
 * 100% Client-side data models for health records, fitness, nutrition, and wellness.
 */

export interface HealthJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  title: string;
  notes: string;
  symptoms?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
  energyLevel?: number; // 1 - 5
  createdAt: string;
}

export interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Once daily", "Twice daily", "As needed"
  times?: string[]; // e.g. ["08:00", "20:00"]
  instructions?: string; // e.g. "Take after food"
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export interface AppointmentReminder {
  id: string;
  providerName: string;
  specialty: string;
  clinicLocation?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime?: string; // HH:MM
  reason?: string;
  prepInstructions?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  reportDate: string; // YYYY-MM-DD
  category: 'blood' | 'radiology' | 'pathology' | 'cardiac' | 'dental' | 'vision' | 'general';
  doctor?: string;
  facility?: string;
  keyFindings: string;
  normalRangeNotes?: string;
  createdAt: string;
}

export interface BloodPressureLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  systolic: number; // mmHg
  diastolic: number; // mmHg
  pulse?: number; // bpm
  arm?: 'left' | 'right';
  posture?: 'sitting' | 'standing' | 'lying';
  category: 'Normal' | 'Elevated' | 'Hypertension Stage 1' | 'Hypertension Stage 2' | 'Hypertensive Crisis';
  notes?: string;
  createdAt: string;
}

export interface BloodSugarLog {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  level: number; // mg/dL or mmol/L
  unit: 'mg/dL' | 'mmol/L';
  timing: 'fasting' | 'pre_meal' | 'post_meal_1h' | 'post_meal_2h' | 'bedtime' | 'random';
  notes?: string;
  createdAt: string;
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number;
  unit: 'kg' | 'lbs';
  bodyFatPercent?: number;
  bmi?: number;
  notes?: string;
  createdAt: string;
}

export interface BodyMeasurements {
  id: string;
  date: string; // YYYY-MM-DD
  unit: 'cm' | 'in';
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  neck?: number;
  notes?: string;
  createdAt: string;
}

export interface HealthNote {
  id: string;
  title: string;
  category: 'doctor_questions' | 'allergies' | 'family_history' | 'vaccines' | 'general';
  content: string;
  date: string;
  createdAt: string;
}

export interface EmergencyMedicalCardData {
  id?: string;
  fullName: string;
  dateOfBirth: string;
  bloodType: string;
  primaryEmergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  secondaryEmergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  organDonor: boolean;
  physicianName?: string;
  physicianPhone?: string;
  hospitalPreference?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  additionalNotes?: string;
  updatedAt: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  workoutTitle: string;
  category: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'custom';
  durationMinutes: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weightKg?: number;
  }[];
  perceivedExertion: number; // 1-10
  notes?: string;
  createdAt: string;
}

export interface FoodDiaryEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  portion: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  sugarGrams?: number;
  notes?: string;
  createdAt: string;
}

export interface SleepLogEntry {
  id: string;
  date: string;
  bedtime: string; // HH:MM
  wakeTime: string; // HH:MM
  durationMinutes: number;
  sleepQuality: number; // 1-5
  latencyMinutes?: number;
  awakeningsCount?: number;
  notes?: string;
  createdAt: string;
}

export interface MoodLogEntry {
  id: string;
  date: string;
  moodRating: number; // 1-5 (Terrible, Bad, Neutral, Good, Great)
  emotions: string[];
  energyLevel: number; // 1-5
  stressLevel: number; // 1-5
  reflections?: string;
  triggers?: string;
  createdAt: string;
}

export interface WellnessHabitEntry {
  id: string;
  name: string;
  category: 'hydration' | 'movement' | 'mindfulness' | 'nutrition' | 'sleep' | 'selfcare';
  targetDaysPerWeek: number;
  completedDates: string[]; // ['2026-11-20', ...]
  streak: number;
  createdAt: string;
}
