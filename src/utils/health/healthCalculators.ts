/**
 * Scientific Health & Body Composition Calculation Utilities
 * Validated formulas for BMI, Ideal Weight, BMR, TDEE, Body Fat %,
 * Waist Ratios, Hydration, Protein, Heart Rate Zones, and Gestational Estimators.
 */

export interface BmiResult {
  bmi: number;
  prime: number;
  ponderalIndex: number;
  category: string;
  categoryColor: string;
  asianCategory: string;
  healthyWeightRangeKg: [number, number];
  healthyWeightRangeLbs: [number, number];
  differenceToNormalKg: number;
}

/**
 * Calculates Comprehensive BMI, BMI Prime, Ponderal Index, and Healthy Ranges.
 */
export function calculateBmi(weightKg: number, heightCm: number): BmiResult | null {
  if (weightKg <= 0 || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const prime = bmi / 25;
  const ponderalIndex = weightKg / (heightM * heightM * heightM);

  let category = '';
  let categoryColor = '';
  if (bmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-sky-500';
  } else if (bmi < 24.9) {
    category = 'Normal weight';
    categoryColor = 'text-emerald-500';
  } else if (bmi < 29.9) {
    category = 'Overweight';
    categoryColor = 'text-amber-500';
  } else if (bmi < 34.9) {
    category = 'Obesity Class I';
    categoryColor = 'text-orange-500';
  } else if (bmi < 39.9) {
    category = 'Obesity Class II';
    categoryColor = 'text-rose-500';
  } else {
    category = 'Obesity Class III (Severe)';
    categoryColor = 'text-red-600';
  }

  // Asian population specific thresholds (WHO Western Pacific / Asian cutoffs)
  let asianCategory = '';
  if (bmi < 18.5) asianCategory = 'Underweight';
  else if (bmi < 23) asianCategory = 'Normal Healthy Range';
  else if (bmi < 27.5) asianCategory = 'Overweight (Increased Risk)';
  else asianCategory = 'Obese (High Risk)';

  const minNormalKg = 18.5 * (heightM * heightM);
  const maxNormalKg = 24.9 * (heightM * heightM);

  let diff = 0;
  if (weightKg < minNormalKg) diff = weightKg - minNormalKg;
  else if (weightKg > maxNormalKg) diff = weightKg - maxNormalKg;

  return {
    bmi: Math.round(bmi * 10) / 10,
    prime: Math.round(prime * 100) / 100,
    ponderalIndex: Math.round(ponderalIndex * 10) / 10,
    category,
    categoryColor,
    asianCategory,
    healthyWeightRangeKg: [Math.round(minNormalKg * 10) / 10, Math.round(maxNormalKg * 10) / 10],
    healthyWeightRangeLbs: [
      Math.round(minNormalKg * 2.20462 * 10) / 10,
      Math.round(maxNormalKg * 2.20462 * 10) / 10
    ],
    differenceToNormalKg: Math.round(diff * 10) / 10
  };
}

export interface IdealWeightResult {
  devineKg: number;
  robinsonKg: number;
  millerKg: number;
  hamwiKg: number;
  averageKg: number;
  devineLbs: number;
  robinsonLbs: number;
  millerLbs: number;
  hamwiLbs: number;
  averageLbs: number;
}

/**
 * Calculates Ideal Body Weight (IBW) using standard clinical formulas:
 * Devine (1974), Robinson (1983), Miller (1983), Hamwi (1964).
 */
export function calculateIdealWeight(gender: 'male' | 'female', heightCm: number): IdealWeightResult | null {
  if (heightCm < 120 || heightCm > 250) return null;
  const inchesOver5Ft = (heightCm / 2.54) - 60;
  const effectiveInches = Math.max(0, inchesOver5Ft);

  let devine = 0;
  let robinson = 0;
  let miller = 0;
  let hamwi = 0;

  if (gender === 'male') {
    devine = 50.0 + 2.3 * effectiveInches;
    robinson = 52.0 + 1.9 * effectiveInches;
    miller = 56.2 + 1.41 * effectiveInches;
    hamwi = 48.0 + 2.7 * effectiveInches;
  } else {
    devine = 45.5 + 2.3 * effectiveInches;
    robinson = 49.0 + 1.7 * effectiveInches;
    miller = 53.1 + 1.36 * effectiveInches;
    hamwi = 45.5 + 2.2 * effectiveInches;
  }

  const avg = (devine + robinson + miller + hamwi) / 4;

  return {
    devineKg: Math.round(devine * 10) / 10,
    robinsonKg: Math.round(robinson * 10) / 10,
    millerKg: Math.round(miller * 10) / 10,
    hamwiKg: Math.round(hamwi * 10) / 10,
    averageKg: Math.round(avg * 10) / 10,
    devineLbs: Math.round(devine * 2.20462 * 10) / 10,
    robinsonLbs: Math.round(robinson * 2.20462 * 10) / 10,
    millerLbs: Math.round(miller * 2.20462 * 10) / 10,
    hamwiLbs: Math.round(hamwi * 2.20462 * 10) / 10,
    averageLbs: Math.round(avg * 2.20462 * 10) / 10
  };
}

export interface BmrResult {
  mifflinStJeor: number;
  harrisBenedict: number;
  katchMcArdle?: number;
}

/**
 * Calculates Basal Metabolic Rate (BMR) in kcal/day.
 */
export function calculateBmr(
  gender: 'male' | 'female',
  age: number,
  weightKg: number,
  heightCm: number,
  bodyFatPercent?: number
): BmrResult | null {
  if (age <= 0 || weightKg <= 0 || heightCm <= 0) return null;

  // Mifflin-St Jeor Formula
  const mifflin =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  // Revised Harris-Benedict Formula (Roza & Shizgal 1984)
  const harris =
    gender === 'male'
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * age;

  let katch: number | undefined;
  if (bodyFatPercent !== undefined && bodyFatPercent > 0 && bodyFatPercent < 70) {
    const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
    katch = 370 + 21.6 * leanMassKg;
  }

  return {
    mifflinStJeor: Math.round(mifflin),
    harrisBenedict: Math.round(harris),
    katchMcArdle: katch ? Math.round(katch) : undefined
  };
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { multiplier: number; label: string; desc: string }> = {
  sedentary: { multiplier: 1.2, label: 'Sedentary', desc: 'Little to no exercise, desk work' },
  light: { multiplier: 1.375, label: 'Lightly Active', desc: 'Light exercise 1-3 days per week' },
  moderate: { multiplier: 1.55, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days per week' },
  heavy: { multiplier: 1.725, label: 'Very Active', desc: 'Hard exercise 6-7 days per week' },
  athlete: { multiplier: 1.9, label: 'Extremely Active', desc: 'Intense training / physical labor daily' }
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTdee(bmr: number, activity: ActivityLevel): number {
  const multi = ACTIVITY_MULTIPLIERS[activity]?.multiplier || 1.2;
  return Math.round(bmr * multi);
}

export interface BodyFatResult {
  bodyFatPercent: number;
  fatMassKg: number;
  leanMassKg: number;
  category: string;
}

/**
 * Estimates Body Fat Percentage using the US Navy Circumference Method.
 */
export function calculateBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number,
  weightKg?: number
): BodyFatResult | null {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) return null;
  let bf = 0;

  if (gender === 'male') {
    if (waistCm <= neckCm) return null;
    bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    if (!hipCm || hipCm <= 0 || waistCm + hipCm <= neckCm) return null;
    bf =
      495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
  }

  bf = Math.max(3, Math.min(65, bf));
  const roundedBf = Math.round(bf * 10) / 10;

  let category = '';
  if (gender === 'male') {
    if (bf < 6) category = 'Essential Fat';
    else if (bf < 14) category = 'Athletes';
    else if (bf < 18) category = 'Fitness';
    else if (bf < 25) category = 'Average';
    else category = 'Obese';
  } else {
    if (bf < 14) category = 'Essential Fat';
    else if (bf < 21) category = 'Athletes';
    else if (bf < 25) category = 'Fitness';
    else if (bf < 32) category = 'Average';
    else category = 'Obese';
  }

  let fatMassKg = 0;
  let leanMassKg = 0;
  if (weightKg && weightKg > 0) {
    fatMassKg = Math.round(weightKg * (bf / 100) * 10) / 10;
    leanMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;
  }

  return {
    bodyFatPercent: roundedBf,
    fatMassKg,
    leanMassKg,
    category
  };
}

/**
 * Waist-to-Height Ratio (WHtR).
 */
export function calculateWhtr(waistCm: number, heightCm: number): { ratio: number; category: string } | null {
  if (waistCm <= 0 || heightCm <= 0) return null;
  const ratio = Math.round((waistCm / heightCm) * 100) / 100;
  let category = '';
  if (ratio < 0.4) category = 'Extremely Slim / Underweight';
  else if (ratio <= 0.49) category = 'Healthy (Low Risk)';
  else if (ratio <= 0.59) category = 'Overweight (Increased Health Risk)';
  else category = 'High Risk (Abdominal Obesity)';

  return { ratio, category };
}

/**
 * Waist-to-Hip Ratio (WHR).
 */
export function calculateWhr(
  gender: 'male' | 'female',
  waistCm: number,
  hipCm: number
): { ratio: number; riskLevel: string } | null {
  if (waistCm <= 0 || hipCm <= 0) return null;
  const ratio = Math.round((waistCm / hipCm) * 100) / 100;
  let riskLevel = '';
  if (gender === 'male') {
    if (ratio < 0.9) riskLevel = 'Low Risk';
    else if (ratio <= 0.99) riskLevel = 'Moderate Risk';
    else riskLevel = 'High Risk';
  } else {
    if (ratio < 0.8) riskLevel = 'Low Risk';
    else if (ratio <= 0.85) riskLevel = 'Moderate Risk';
    else riskLevel = 'High Risk';
  }
  return { ratio, riskLevel };
}

/**
 * Daily Water Intake Recommendation.
 */
export function calculateWaterIntake(
  weightKg: number,
  exerciseMinutesPerDay: number = 0,
  climate: 'temperate' | 'hot' = 'temperate'
): { liters: number; glasses8oz: number } {
  let ml = weightKg * 35; // Standard 35 ml per kg body weight
  ml += (exerciseMinutesPerDay / 30) * 350; // Add 350ml per 30 mins exercise
  if (climate === 'hot') ml += 500; // Add 500ml for hot weather
  const liters = Math.round((ml / 1000) * 10) / 10;
  const glasses8oz = Math.round(ml / 240);
  return { liters, glasses8oz };
}

/**
 * Daily Protein Intake Recommendation.
 */
export function calculateProteinNeeds(
  weightKg: number,
  goal: 'sedentary' | 'maintenance' | 'endurance' | 'muscle_gain' | 'fat_loss'
): { gramsMin: number; gramsMax: number; desc: string } {
  let minFactor = 0.8;
  let maxFactor = 1.0;
  let desc = '';

  switch (goal) {
    case 'sedentary':
      minFactor = 0.8;
      maxFactor = 1.0;
      desc = 'Baseline RDA to prevent deficiency in non-active individuals';
      break;
    case 'maintenance':
      minFactor = 1.0;
      maxFactor = 1.4;
      desc = 'Healthy active adults with moderate lifestyle movement';
      break;
    case 'endurance':
      minFactor = 1.2;
      maxFactor = 1.6;
      desc = 'Runners, cyclists, and stamina endurance athletes';
      break;
    case 'muscle_gain':
      minFactor = 1.6;
      maxFactor = 2.2;
      desc = 'Resistance training and hypertrophy muscle building';
      break;
    case 'fat_loss':
      minFactor = 1.8;
      maxFactor = 2.4;
      desc = 'Caloric deficit muscle retention and satiety optimization';
      break;
  }

  return {
    gramsMin: Math.round(weightKg * minFactor),
    gramsMax: Math.round(weightKg * maxFactor),
    desc
  };
}

/**
 * Heart Rate Training Zones (Karvonen & Tanaka Formulas).
 */
export interface HeartRateZones {
  maxHr: number;
  restingHr: number;
  reserveHr: number;
  zones: {
    zone: number;
    name: string;
    intensity: string;
    hrMin: number;
    hrMax: number;
    benefit: string;
  }[];
}

export function calculateHeartRateZones(age: number, restingHr: number = 70): HeartRateZones | null {
  if (age <= 10 || age > 110) return null;
  // Tanaka formula (2001): 208 - 0.7 * age (more accurate than 220 - age)
  const maxHr = Math.round(208 - 0.7 * age);
  const reserve = maxHr - restingHr;

  const zoneBands = [
    { zone: 1, name: 'Very Light / Active Recovery', pctMin: 0.5, pctMax: 0.6, benefit: 'Warm up, recovery, improves basic endurance' },
    { zone: 2, name: 'Light / Aerobic Fat Burn', pctMin: 0.6, pctMax: 0.7, benefit: 'Fat burning, mitochondrial density, base endurance' },
    { zone: 3, name: 'Moderate / Aerobic Tempo', pctMin: 0.7, pctMax: 0.8, benefit: 'Improves cardiovascular capacity, aerobic fitness' },
    { zone: 4, name: 'Hard / Anaerobic Threshold', pctMin: 0.8, pctMax: 0.9, benefit: 'High-speed endurance, lactate threshold tolerance' },
    { zone: 5, name: 'Maximum / Neuromuscular', pctMin: 0.9, pctMax: 1.0, benefit: 'Peak sprint performance, neuromuscular power' }
  ];

  const zones = zoneBands.map((b) => ({
    zone: b.zone,
    name: b.name,
    intensity: `${Math.round(b.pctMin * 100)}% - ${Math.round(b.pctMax * 100)}%`,
    hrMin: Math.round(restingHr + reserve * b.pctMin),
    hrMax: Math.round(restingHr + reserve * b.pctMax),
    benefit: b.benefit
  }));

  return {
    maxHr,
    restingHr,
    reserveHr: reserve,
    zones
  };
}

/**
 * Pregnancy Due Date Calculator using Naegele's Rule.
 * Estimated 280 days (40 weeks) from the first day of the Last Menstrual Period (LMP).
 */
export interface PregnancyDueDateResult {
  estimatedDueDate: string; // YYYY-MM-DD
  estimatedConceptionDate: string; // YYYY-MM-DD
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  currentTrimester: 1 | 2 | 3;
  daysRemaining: number;
  disclaimer: string;
}

export function calculatePregnancyDueDate(
  lastMenstrualPeriodDate: string,
  cycleLengthDays: number = 28
): PregnancyDueDateResult | null {
  const lmp = new Date(lastMenstrualPeriodDate);
  if (isNaN(lmp.getTime())) return null;

  // Naegele's rule adjusted for cycle length: LMP + 280 days + (cycleLength - 28)
  const cycleDiff = cycleLengthDays - 28;
  const dueDateMs = lmp.getTime() + (280 + cycleDiff) * 24 * 60 * 60 * 1000;
  const dueDate = new Date(dueDateMs);

  const conceptionDateMs = lmp.getTime() + (14 + cycleDiff) * 24 * 60 * 60 * 1000;
  const conceptionDate = new Date(conceptionDateMs);

  const today = new Date();
  const elapsedDays = Math.max(0, Math.floor((today.getTime() - lmp.getTime()) / (24 * 60 * 60 * 1000)));
  const weeks = Math.floor(elapsedDays / 7);
  const days = elapsedDays % 7;

  let trimester: 1 | 2 | 3 = 1;
  if (weeks >= 28) trimester = 3;
  else if (weeks >= 14) trimester = 2;

  const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));

  return {
    estimatedDueDate: dueDate.toISOString().split('T')[0],
    estimatedConceptionDate: conceptionDate.toISOString().split('T')[0],
    gestationalAgeWeeks: weeks,
    gestationalAgeDays: days,
    currentTrimester: trimester,
    daysRemaining,
    disclaimer:
      'Approximation only based on standard 40-week gestational model. Only approximately 4% of babies are born on their exact due date. Please consult your obstetrician or midwife for clinical evaluations and ultrasound dating.'
  };
}

/**
 * Ovulation and Fertile Window Estimator.
 */
export interface OvulationResult {
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  cycleLength: number;
  disclaimer: string;
}

export function calculateOvulationWindow(
  lastPeriodDate: string,
  cycleLengthDays: number = 28,
  lutealPhaseDays: number = 14
): OvulationResult | null {
  const lmp = new Date(lastPeriodDate);
  if (isNaN(lmp.getTime())) return null;

  // Ovulation occurs approximately (cycleLength - lutealPhase) days after LMP
  const ovulationDayOffset = Math.max(1, cycleLengthDays - lutealPhaseDays);
  const ovulationMs = lmp.getTime() + ovulationDayOffset * 24 * 60 * 60 * 1000;
  const ovulationDate = new Date(ovulationMs);

  // Fertile window: 5 days prior to ovulation through 1 day after
  const fertileStart = new Date(ovulationMs - 5 * 24 * 60 * 60 * 1000);
  const fertileEnd = new Date(ovulationMs + 1 * 24 * 60 * 60 * 1000);

  const nextPeriod = new Date(lmp.getTime() + cycleLengthDays * 24 * 60 * 60 * 1000);

  return {
    nextPeriodDate: nextPeriod.toISOString().split('T')[0],
    ovulationDate: ovulationDate.toISOString().split('T')[0],
    fertileWindowStart: fertileStart.toISOString().split('T')[0],
    fertileWindowEnd: fertileEnd.toISOString().split('T')[0],
    cycleLength: cycleLengthDays,
    disclaimer:
      'Calculated based on average hormonal cycle patterns. Natural biological variation, stress, and hormonal shifts can alter ovulation dates significantly. Do NOT use this tool as a form of contraception.'
  };
}
