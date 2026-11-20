/**
 * Fitness, Running & Strength Training Utilities
 * Validated formulas for running pace/distance, walking cadence,
 * steps-to-distance, MET exercise calorie expenditure, and One Rep Max (1RM).
 */

export interface RunningPaceResult {
  paceMinPerKm: number;
  paceSecPerKm: number;
  paceMinPerMile: number;
  paceSecPerMile: number;
  speedKmh: number;
  speedMph: number;
  formattedPaceKm: string;
  formattedPaceMile: string;
}

/**
 * Calculates Running Pace and Speed from distance and time.
 */
export function calculateRunningPace(
  distance: number,
  unit: 'km' | 'miles',
  hours: number,
  minutes: number,
  seconds: number
): RunningPaceResult | null {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if (distance <= 0 || totalSeconds <= 0) return null;

  const distanceKm = unit === 'km' ? distance : distance * 1.60934;
  const distanceMiles = unit === 'miles' ? distance : distance / 1.60934;

  const secPerKm = totalSeconds / distanceKm;
  const secPerMile = totalSeconds / distanceMiles;

  const minKm = Math.floor(secPerKm / 60);
  const remainingSecKm = Math.round(secPerKm % 60);

  const minMile = Math.floor(secPerMile / 60);
  const remainingSecMile = Math.round(secPerMile % 60);

  const speedKmh = Math.round((distanceKm / (totalSeconds / 3600)) * 100) / 100;
  const speedMph = Math.round((distanceMiles / (totalSeconds / 3600)) * 100) / 100;

  return {
    paceMinPerKm: minKm,
    paceSecPerKm: remainingSecKm,
    paceMinPerMile: minMile,
    paceSecPerMile: remainingSecMile,
    speedKmh,
    speedMph,
    formattedPaceKm: `${minKm}:${remainingSecKm < 10 ? '0' : ''}${remainingSecKm} /km`,
    formattedPaceMile: `${minMile}:${remainingSecMile < 10 ? '0' : ''}${remainingSecMile} /mi`
  };
}

/**
 * Calculates Steps to Distance based on user height and gender.
 * Average stride length: Women = height * 0.413; Men = height * 0.415.
 */
export function calculateStepsToDistance(
  steps: number,
  heightCm: number = 175,
  gender: 'male' | 'female' = 'male'
): { distanceKm: number; distanceMiles: number; strideLengthCm: number; estimatedCalories: number } {
  if (steps <= 0) return { distanceKm: 0, distanceMiles: 0, strideLengthCm: 0, estimatedCalories: 0 };
  const strideFactor = gender === 'female' ? 0.413 : 0.415;
  const strideLengthCm = Math.round(heightCm * strideFactor * 10) / 10;

  const distanceMeters = (steps * strideLengthCm) / 100;
  const distanceKm = Math.round((distanceMeters / 1000) * 100) / 100;
  const distanceMiles = Math.round((distanceKm / 1.60934) * 100) / 100;

  // Approximate calorie burn for walking ~ 0.04 - 0.05 kcal per step
  const estimatedCalories = Math.round(steps * 0.042);

  return {
    distanceKm,
    distanceMiles,
    strideLengthCm,
    estimatedCalories
  };
}

/**
 * Standard Metabolic Equivalent of Task (MET) table for physical activities.
 * Calories = MET * weightKg * durationHours.
 */
export interface ExerciseActivity {
  id: string;
  name: string;
  category: string;
  met: number;
}

export const EXERCISE_MET_TABLE: ExerciseActivity[] = [
  { id: 'walk_brisk', name: 'Walking (Brisk, 3.5 mph / 5.6 km/h)', category: 'Walking', met: 4.3 },
  { id: 'walk_leisure', name: 'Walking (Casual, 2.5 mph / 4.0 km/h)', category: 'Walking', met: 3.0 },
  { id: 'run_slow', name: 'Running (Jogging, 5.0 mph / 8.0 km/h)', category: 'Running', met: 8.3 },
  { id: 'run_moderate', name: 'Running (6.0 mph / 9.6 km/h)', category: 'Running', met: 9.8 },
  { id: 'run_fast', name: 'Running (7.5 mph / 12.0 km/h)', category: 'Running', met: 11.8 },
  { id: 'cycle_moderate', name: 'Cycling (Leisure, 12-14 mph)', category: 'Cycling', met: 8.0 },
  { id: 'cycle_vigorous', name: 'Cycling (Fast, 14-16 mph)', category: 'Cycling', met: 10.0 },
  { id: 'swimming_freestyle', name: 'Swimming (Freestyle, Moderate)', category: 'Swimming', met: 7.0 },
  { id: 'swimming_vigorous', name: 'Swimming (Vigorous Laps)', category: 'Swimming', met: 10.0 },
  { id: 'weight_lifting_moderate', name: 'Weight Training (Moderate Effort)', category: 'Gym', met: 3.5 },
  { id: 'weight_lifting_vigorous', name: 'Weight Training (Powerlifting / Heavy)', category: 'Gym', met: 6.0 },
  { id: 'calisthenics', name: 'Calisthenics (Push-ups, Pull-ups, Sit-ups)', category: 'Gym', met: 8.0 },
  { id: 'circuit_training', name: 'HIIT / Circuit Training', category: 'Gym', met: 8.0 },
  { id: 'jump_rope', name: 'Jump Rope (Moderate Speed)', category: 'Cardio', met: 11.0 },
  { id: 'yoga_hatha', name: 'Yoga (Hatha / Relaxing)', category: 'Mind-Body', met: 2.5 },
  { id: 'yoga_power', name: 'Yoga (Power / Vinyasa)', category: 'Mind-Body', met: 4.0 },
  { id: 'pilates', name: 'Pilates', category: 'Mind-Body', met: 3.0 },
  { id: 'basketball', name: 'Basketball (Game)', category: 'Sports', met: 8.0 },
  { id: 'football', name: 'Football / Soccer', category: 'Sports', met: 10.0 },
  { id: 'badminton', name: 'Badminton (Singles)', category: 'Sports', met: 7.0 },
  { id: 'tennis', name: 'Tennis (Singles)', category: 'Sports', met: 8.0 },
  { id: 'rowing_moderate', name: 'Rowing Machine (Moderate)', category: 'Cardio', met: 7.0 }
];

export function calculateExerciseCalories(
  met: number,
  weightKg: number,
  durationMinutes: number
): number {
  if (met <= 0 || weightKg <= 0 || durationMinutes <= 0) return 0;
  const hours = durationMinutes / 60;
  return Math.round(met * weightKg * hours);
}

/**
 * One Rep Max (1RM) Calculations using Brzycki, Epley, Lander, and Lombardi formulas.
 */
export interface OneRepMaxResult {
  brzycki: number;
  epley: number;
  lander: number;
  lombardi: number;
  average: number;
  percentageTable: { percentage: number; weight: number; repsTarget: number }[];
}

export function calculateOneRepMax(weightKg: number, reps: number): OneRepMaxResult | null {
  if (weightKg <= 0 || reps <= 0 || reps > 30) return null;
  if (reps === 1) {
    return {
      brzycki: weightKg,
      epley: weightKg,
      lander: weightKg,
      lombardi: weightKg,
      average: weightKg,
      percentageTable: [95, 90, 85, 80, 75, 70, 65, 60].map((pct) => ({
        percentage: pct,
        weight: Math.round(weightKg * (pct / 100) * 10) / 10,
        repsTarget: Math.round((100 - pct) / 2.5) + 1
      }))
    };
  }

  // Brzycki: W / (1.0278 - 0.0278 * r)
  const brzycki = weightKg / (1.0278 - 0.0278 * reps);
  // Epley: W * (1 + r / 30)
  const epley = weightKg * (1 + reps / 30);
  // Lander: (100 * W) / (101.3 - 2.67123 * r)
  const lander = (100 * weightKg) / (101.3 - 2.67123 * reps);
  // Lombardi: W * (r ^ 0.10)
  const lombardi = weightKg * Math.pow(reps, 0.1);

  const avg = (brzycki + epley + lander + lombardi) / 4;
  const rounded1Rm = Math.round(avg * 10) / 10;

  const percentageTable = [95, 90, 85, 80, 75, 70, 65, 60].map((pct) => ({
    percentage: pct,
    weight: Math.round(rounded1Rm * (pct / 100) * 10) / 10,
    repsTarget: Math.round((100 - pct) / 2.5) + 1
  }));

  return {
    brzycki: Math.round(brzycki * 10) / 10,
    epley: Math.round(epley * 10) / 10,
    lander: Math.round(lander * 10) / 10,
    lombardi: Math.round(lombardi * 10) / 10,
    average: rounded1Rm,
    percentageTable
  };
}
