/**
 * Nutrition, Macronutrient & Dietary Calculation Utilities
 * Validated formulas for macro splits, portion conversions, calorie deficit/surplus,
 * fiber/sugar guidelines, and nutrition label analysis.
 */

export interface MacroDistribution {
  carbsPercent: number;
  proteinPercent: number;
  fatPercent: number;
  carbsGrams: number;
  proteinGrams: number;
  fatGrams: number;
  totalCalories: number;
}

/**
 * Calculates macronutrient gram distributions from daily calorie targets.
 * 1g Carbs = 4 kcal, 1g Protein = 4 kcal, 1g Fat = 9 kcal.
 */
export function calculateMacros(
  calories: number,
  carbsPct: number,
  proteinPct: number,
  fatPct: number
): MacroDistribution {
  const normTotal = carbsPct + proteinPct + fatPct || 100;
  const cP = carbsPct / normTotal;
  const pP = proteinPct / normTotal;
  const fP = fatPct / normTotal;

  const carbsKcal = calories * cP;
  const proteinKcal = calories * pP;
  const fatKcal = calories * fP;

  return {
    carbsPercent: Math.round(cP * 100),
    proteinPercent: Math.round(pP * 100),
    fatPercent: Math.round(fP * 100),
    carbsGrams: Math.round(carbsKcal / 4),
    proteinGrams: Math.round(proteinKcal / 4),
    fatGrams: Math.round(fatKcal / 9),
    totalCalories: calories
  };
}

export type MacroDietPreset = 'balanced' | 'low_carb' | 'keto' | 'high_protein' | 'zone';

export const MACRO_PRESETS: Record<MacroDietPreset, { name: string; carbs: number; protein: number; fat: number }> = {
  balanced: { name: 'Balanced Standard (50C / 20P / 30F)', carbs: 50, protein: 20, fat: 30 },
  low_carb: { name: 'Low Carb (25C / 40P / 35F)', carbs: 25, protein: 40, fat: 35 },
  keto: { name: 'Ketogenic (5C / 25P / 70F)', carbs: 5, protein: 25, fat: 70 },
  high_protein: { name: 'High Protein Bodybuilding (40C / 35P / 25F)', carbs: 40, protein: 35, fat: 25 },
  zone: { name: 'Zone Diet (40C / 30P / 30F)', carbs: 40, protein: 30, fat: 30 }
};

/**
 * Calorie Deficit Projection for Weight Loss.
 * 1 kg of fat ~ 7,700 kcal (or 1 lb of fat ~ 3,500 kcal).
 */
export interface CalorieDeficitProjection {
  maintenanceCalories: number;
  dailyDeficit: number;
  targetDailyCalories: number;
  weeklyWeightLossKg: number;
  weeklyWeightLossLbs: number;
  daysToGoal: number;
  projectedGoalDate: string;
  safetyRating: 'safe_gradual' | 'moderate' | 'aggressive' | 'extreme_unsafe';
}

export function calculateCalorieDeficit(
  tdee: number,
  targetLossKg: number,
  deficitKcal: number
): CalorieDeficitProjection {
  const dailyDeficit = Math.max(100, Math.min(1500, deficitKcal));
  const targetCalories = Math.max(1200, tdee - dailyDeficit);

  // 1 kg body fat = 7700 kcal
  const weeklyLossKg = Math.round(((dailyDeficit * 7) / 7700) * 100) / 100;
  const weeklyLossLbs = Math.round(weeklyLossKg * 2.20462 * 100) / 100;

  const totalKcalNeeded = targetLossKg * 7700;
  const days = Math.round(totalKcalNeeded / dailyDeficit);

  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + days);

  let safetyRating: CalorieDeficitProjection['safetyRating'] = 'safe_gradual';
  if (dailyDeficit <= 350) safetyRating = 'safe_gradual';
  else if (dailyDeficit <= 600) safetyRating = 'moderate';
  else if (dailyDeficit <= 1000) safetyRating = 'aggressive';
  else safetyRating = 'extreme_unsafe';

  return {
    maintenanceCalories: tdee,
    dailyDeficit,
    targetDailyCalories: targetCalories,
    weeklyWeightLossKg: weeklyLossKg,
    weeklyWeightLossLbs: weeklyLossLbs,
    daysToGoal: days,
    projectedGoalDate: goalDate.toISOString().split('T')[0],
    safetyRating
  };
}

/**
 * Common Cooking & Portion Conversions.
 */
export const PORTION_CONVERSIONS = [
  { from: 'Cup (Liquid)', to: 'Milliliters (mL)', factor: 240 },
  { from: 'Tablespoon (tbsp)', to: 'Teaspoons (tsp)', factor: 3 },
  { from: 'Tablespoon (tbsp)', to: 'Milliliters (mL)', factor: 15 },
  { from: 'Teaspoon (tsp)', to: 'Milliliters (mL)', factor: 5 },
  { from: 'Ounces (oz)', to: 'Grams (g)', factor: 28.3495 },
  { from: 'Pounds (lbs)', to: 'Grams (g)', factor: 453.592 }
];

export const HAND_PORTION_GUIDES = [
  { part: 'Palm of hand', represents: 'Protein (Chicken, Fish, Tofu, Meat)', equivalent: '~85g - 110g (20-30g protein)' },
  { part: 'Fist', represents: 'Vegetables & Leafy greens', equivalent: '~1 cup / 150g' },
  { part: 'Cupped hand', represents: 'Carbohydrates (Rice, Grains, Pasta, Fruit)', equivalent: '~1/2 cup cooked / 30-40g carbs' },
  { part: 'Thumb', represents: 'Fats (Oils, Butter, Nut butters, Seeds)', equivalent: '~1 tablespoon (10-14g fat)' }
];
