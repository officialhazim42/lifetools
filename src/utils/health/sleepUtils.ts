/**
 * Sleep, Breathing & Clinical Reference Utilities
 * Ultradian 90-minute REM sleep cycles, bedtime calculations,
 * box breathing cadence, AHA blood pressure stages, and ADA blood sugar targets.
 */

export interface SleepCycleCalculation {
  targetWakeTime: string; // HH:MM
  cycles: {
    cycleCount: number;
    totalHours: number;
    bedtime: string; // HH:MM
    isOptimal: boolean;
    description: string;
  }[];
}

/**
 * Calculates optimal bedtimes based on 90-minute sleep cycles + 14-minute average sleep latency.
 */
export function calculateBedtimesForWakeTime(wakeTimeHHMM: string): SleepCycleCalculation | null {
  const parts = wakeTimeHHMM.split(':');
  if (parts.length !== 2) return null;
  const wakeHour = parseInt(parts[0], 10);
  const wakeMinute = parseInt(parts[1], 10);
  if (isNaN(wakeHour) || isNaN(wakeMinute)) return null;

  const wakeDate = new Date();
  wakeDate.setHours(wakeHour, wakeMinute, 0, 0);

  // Calculate 6, 5, 4, 3 sleep cycles backwards
  // Each cycle is 90 minutes (5400 seconds) + 14 minutes latency
  const cycleCounts = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

  const cycles = cycleCounts.map((count) => {
    const sleepDurationMs = count * 90 * 60 * 1000 + 14 * 60 * 1000;
    const bedtimeDate = new Date(wakeDate.getTime() - sleepDurationMs);

    const bh = bedtimeDate.getHours();
    const bm = bedtimeDate.getMinutes();
    const formattedBedtime = `${bh < 10 ? '0' : ''}${bh}:${bm < 10 ? '0' : ''}${bm}`;

    const totalHours = Math.round((count * 1.5) * 10) / 10;
    const isOptimal = count === 5 || count === 6; // 7.5h or 9h is standard for adults

    let description = '';
    if (count === 6) description = '9.0 hours of sleep (Full rejuvenation, optimal for athletes & recovery)';
    else if (count === 5) description = '7.5 hours of sleep (Recommended adult sweet spot)';
    else if (count === 4) description = '6.0 hours of sleep (Minimum recommended, acceptable short-term)';
    else description = '4.5 hours of sleep (Insufficient for full REM recovery)';

    return {
      cycleCount: count,
      totalHours,
      bedtime: formattedBedtime,
      isOptimal,
      description
    };
  });

  return {
    targetWakeTime: wakeTimeHHMM,
    cycles
  };
}

/**
 * Calculates optimal wake times if going to bed right now.
 */
export function calculateWakeTimesFromNow(sleepNowDate: Date = new Date()): {
  bedtime: string;
  wakeTimes: { cycles: number; hours: number; wakeTime: string; isOptimal: boolean }[];
} {
  const bh = sleepNowDate.getHours();
  const bm = sleepNowDate.getMinutes();
  const bedtime = `${bh < 10 ? '0' : ''}${bh}:${bm < 10 ? '0' : ''}${bm}`;

  // 14 min latency
  const startSleepMs = sleepNowDate.getTime() + 14 * 60 * 1000;

  const wakeTimes = [3, 4, 5, 6].map((count) => {
    const wakeDate = new Date(startSleepMs + count * 90 * 60 * 1000);
    const wh = wakeDate.getHours();
    const wm = wakeDate.getMinutes();
    const formattedWake = `${wh < 10 ? '0' : ''}${wh}:${wm < 10 ? '0' : ''}${wm}`;
    return {
      cycles: count,
      hours: count * 1.5,
      wakeTime: formattedWake,
      isOptimal: count === 5 || count === 6
    };
  });

  return { bedtime, wakeTimes };
}

/**
 * Blood Pressure AHA (American Heart Association) Classification.
 */
export function classifyBloodPressure(systolic: number, diastolic: number): {
  category: 'Normal' | 'Elevated' | 'Hypertension Stage 1' | 'Hypertension Stage 2' | 'Hypertensive Crisis';
  color: string;
  advice: string;
} {
  if (systolic > 180 || diastolic > 120) {
    return {
      category: 'Hypertensive Crisis',
      color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800',
      advice: 'EMERGENCY: Seek immediate medical attention or call emergency services if symptoms exist.'
    };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'Hypertension Stage 2',
      color: 'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800',
      advice: 'Blood pressure is high. Consult your doctor regarding lifestyle interventions or treatment.'
    };
  }
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
    return {
      category: 'Hypertension Stage 1',
      color: 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800',
      advice: 'Stage 1 high blood pressure. Lifestyle modifications (diet, exercise, sodium reduction) recommended.'
    };
  }
  if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: 'Elevated',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-800',
      advice: 'Elevated blood pressure without hypertension. Exercise and healthy diet can prevent progression.'
    };
  }
  return {
    category: 'Normal',
    color: 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800',
    advice: 'Blood pressure is within standard healthy parameters (Systolic < 120 and Diastolic < 80).'
  };
}

/**
 * Blood Glucose ADA (American Diabetes Association) Interpretation.
 */
export function classifyBloodSugar(
  level: number,
  unit: 'mg/dL' | 'mmol/L',
  timing: 'fasting' | 'pre_meal' | 'post_meal_1h' | 'post_meal_2h' | 'bedtime' | 'random'
): { status: string; color: string; notes: string } {
  // Normalize to mg/dL for comparison (1 mmol/L = 18.0182 mg/dL)
  const mgdl = unit === 'mmol/L' ? level * 18.0182 : level;

  if (timing === 'fasting') {
    if (mgdl < 70) {
      return { status: 'Low (Hypoglycemia)', color: 'text-amber-500', notes: 'Below standard fasting range. Monitor symptoms.' };
    } else if (mgdl <= 99) {
      return { status: 'Normal Fasting Range', color: 'text-emerald-500', notes: 'Standard healthy fasting level (70-99 mg/dL).' };
    } else if (mgdl <= 125) {
      return { status: 'Elevated (Pre-diabetes Indicator)', color: 'text-orange-500', notes: 'Impaired fasting glucose range (100-125 mg/dL).' };
    } else {
      return { status: 'High (Diabetes Indicator)', color: 'text-rose-500', notes: 'Fasting glucose >= 126 mg/dL. Requires clinical evaluation.' };
    }
  } else {
    // Post-prandial / random
    if (mgdl < 70) {
      return { status: 'Low (Hypoglycemia)', color: 'text-amber-500', notes: 'Below expected range.' };
    } else if (mgdl <= 140) {
      return { status: 'Normal Post-Meal Range', color: 'text-emerald-500', notes: 'Standard post-prandial range (<140 mg/dL 2 hours post-meal).' };
    } else if (mgdl <= 199) {
      return { status: 'Elevated Post-Meal', color: 'text-orange-500', notes: 'Impaired glucose tolerance (140-199 mg/dL).' };
    } else {
      return { status: 'High (Diabetes Indicator)', color: 'text-rose-500', notes: 'Post-meal glucose >= 200 mg/dL. Consult a physician.' };
    }
  }
}
