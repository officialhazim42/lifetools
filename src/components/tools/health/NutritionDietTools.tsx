import React, { useState, useEffect } from 'react';
import {
  calculateMacros,
  MACRO_PRESETS,
  calculateCalorieDeficit,
  PORTION_CONVERSIONS,
  HAND_PORTION_GUIDES
} from '../../../utils/health/nutritionUtils';
import { healthDB } from '../../../utils/healthDB';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  Apple,
  Utensils,
  Plus,
  Trash2,
  Copy,
  PieChart,
  Scale,
  AlertCircle
} from 'lucide-react';

// ==========================================
// 1. Calorie Tracker
// ==========================================
export const CalorieTracker: React.FC = () => {
  const { showToast } = useToast();
  const [targetCalories, setTargetCalories] = useState(2000);
  const [foods, setFoods] = useState<
    { id: string; name: string; calories: number; meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' }[]
  >([
    { id: '1', name: 'Oatmeal with Berries', calories: 350, meal: 'Breakfast' },
    { id: '2', name: 'Grilled Chicken Salad', calories: 480, meal: 'Lunch' }
  ]);
  const [foodName, setFoodName] = useState('');
  const [calInput, setCalInput] = useState<number | ''>('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks'>('Lunch');

  const totalConsumed = foods.reduce((sum, f) => sum + f.calories, 0);
  const remaining = targetCalories - totalConsumed;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim() || !calInput) return;
    setFoods([
      ...foods,
      { id: Date.now().toString(), name: foodName.trim(), calories: Number(calInput), meal: mealType }
    ]);
    setFoodName('');
    setCalInput('');
    showToast('Food item logged', 'success');
  };

  const handleRemove = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Daily Calorie Target</span>
          <input
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(parseInt(e.target.value, 10) || 0)}
            className="text-lg font-bold bg-transparent text-slate-800 dark:text-slate-100 outline-none w-28"
          />
        </div>
        <div className="text-right">
          <span className="text-slate-400 block font-medium">Consumed vs Remaining</span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {totalConsumed} kcal / <span className={remaining < 0 ? 'text-rose-500' : 'text-emerald-500'}>{remaining} left</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
        <input
          type="text"
          placeholder="Food name (e.g. Greek Yogurt)"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
        />
        <input
          type="number"
          placeholder="Calories (kcal)"
          value={calInput}
          onChange={(e) => setCalInput(e.target.value === '' ? '' : parseFloat(e.target.value))}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
        />
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value as any)}
          className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snacks">Snacks</option>
        </select>
        <button
          type="submit"
          className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
        >
          Add Food
        </button>
      </form>

      <div className="space-y-2">
        {foods.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{f.name}</span>
              <span className="text-slate-400 block text-[11px]">{f.meal}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700 dark:text-slate-200">{f.calories} kcal</span>
              <button onClick={() => handleRemove(f.id)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 2. Food Nutrition Calculator (Scaling Servings)
// ==========================================
export const FoodNutritionCalculator: React.FC = () => {
  const [baseGrams, setBaseGrams] = useState(100);
  const [consumedGrams, setConsumedGrams] = useState(150);
  const [baseCalories, setBaseCalories] = useState(165); // e.g. 100g Chicken Breast
  const [baseProtein, setBaseProtein] = useState(31);
  const [baseCarbs, setBaseCarbs] = useState(0);
  const [baseFat, setBaseFat] = useState(3.6);

  const factor = baseGrams > 0 ? consumedGrams / baseGrams : 1;

  const totalCalories = Math.round(baseCalories * factor);
  const totalProtein = Math.round(baseProtein * factor * 10) / 10;
  const totalCarbs = Math.round(baseCarbs * factor * 10) / 10;
  const totalFat = Math.round(baseFat * factor * 10) / 10;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Base Reference (g)</label>
          <input
            type="number"
            value={baseGrams}
            onChange={(e) => setBaseGrams(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Portion Eaten (g)</label>
          <input
            type="number"
            value={consumedGrams}
            onChange={(e) => setConsumedGrams(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-bold"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Base Calories (kcal)</label>
          <input
            type="number"
            value={baseCalories}
            onChange={(e) => setBaseCalories(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Base Protein (g)</label>
          <input
            type="number"
            value={baseProtein}
            onChange={(e) => setBaseProtein(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Scaled Calories</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{totalCalories} kcal</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Protein</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{totalProtein} g</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Carbohydrates</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">{totalCarbs} g</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Fats</span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">{totalFat} g</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. Macronutrient Calculator
// ==========================================
export const MacronutrientCalculator: React.FC = () => {
  const [calories, setCalories] = useState(2200);
  const [preset, setPreset] = useState<keyof typeof MACRO_PRESETS>('balanced');

  const selected = MACRO_PRESETS[preset];
  const macros = calculateMacros(calories, selected.carbs, selected.protein, selected.fat);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Daily Calorie Target</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Dietary Macro Split</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            {Object.keys(MACRO_PRESETS).map((k) => (
              <option key={k} value={k}>
                {MACRO_PRESETS[k as keyof typeof MACRO_PRESETS].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-xs text-amber-500 block font-medium">Carbohydrates ({macros.carbsPercent}%)</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{macros.carbsGrams}g</span>
          <span className="text-[11px] text-slate-400">4 kcal/g</span>
        </div>
        <div>
          <span className="text-xs text-emerald-500 block font-medium">Protein ({macros.proteinPercent}%)</span>
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{macros.proteinGrams}g</span>
          <span className="text-[11px] text-slate-400">4 kcal/g</span>
        </div>
        <div>
          <span className="text-xs text-indigo-500 block font-medium">Fats ({macros.fatPercent}%)</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{macros.fatGrams}g</span>
          <span className="text-[11px] text-slate-400">9 kcal/g</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Protein Tracker
// ==========================================
export const ProteinTracker: React.FC = () => {
  const [goal, setGoal] = useState(140);
  const [current, setCurrent] = useState(85);

  const pct = Math.min(100, Math.round((current / goal) * 100));

  return (
    <div className="space-y-6 text-center">
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Target (g)</label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value, 10) || 1)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Current (g)</label>
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(parseInt(e.target.value, 10) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold text-emerald-600"
          />
        </div>
      </div>

      <div className="py-2">
        <span className="text-4xl font-black text-slate-900 dark:text-white">{current} / {goal} g</span>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden max-w-sm mx-auto mt-3">
          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-slate-400 mt-2 block">{pct}% of daily target achieved</span>
      </div>

      <div className="flex justify-center gap-2">
        {[10, 25, 30, 40].map((add) => (
          <button
            key={add}
            onClick={() => setCurrent((c) => c + add)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            +{add}g
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. Meal Planner
// ==========================================
export const MealPlanner: React.FC = () => {
  const [meals, setMeals] = useState({
    Breakfast: 'Greek yogurt with chia seeds, banana, and almonds',
    Lunch: 'Brown rice bowl with baked salmon, avocado, and steamed broccoli',
    Dinner: 'Grilled chicken breast with roasted sweet potato and mixed greens',
    Snacks: 'Apple slices with peanut butter or whey protein shake'
  });

  return (
    <div className="space-y-4">
      {Object.entries(meals).map(([meal, desc]) => (
        <div key={meal} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">{meal}</span>
          <textarea
            rows={2}
            value={desc}
            onChange={(e) => setMeals({ ...meals, [meal]: e.target.value })}
            className="w-full p-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg outline-none resize-none font-medium text-slate-700 dark:text-slate-200"
          />
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 6. Daily Food Diary
// ==========================================
export const DailyFoodDiary: React.FC = () => {
  const [entries, setEntries] = useState([
    { id: '1', time: '08:30', meal: 'Oats & Berries', energy: 'High', digestive: 'Normal' },
    { id: '2', time: '13:00', meal: 'Quinoa Veggie Salad', energy: 'Moderate', digestive: 'Good' }
  ]);
  const [mealText, setMealText] = useState('');

  const handleAdd = () => {
    if (!mealText.trim()) return;
    setEntries([
      ...entries,
      { id: Date.now().toString(), time: 'Now', meal: mealText.trim(), energy: 'Good', digestive: 'Normal' }
    ]);
    setMealText('');
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Log food & how you felt..."
          value={mealText}
          onChange={(e) => setMealText(e.target.value)}
          className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
        />
        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg">
          Log
        </button>
      </div>

      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{e.meal}</span>
              <span className="text-slate-400 block text-[11px]">{e.time} • Energy: {e.energy}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">{e.digestive}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. Portion Size Converter
// ==========================================
export const PortionSizeConverter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Visual Hand Portion Guide</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {HAND_PORTION_GUIDES.map((g, i) => (
            <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block">{g.part}</span>
              <span className="text-slate-700 dark:text-slate-200 font-medium block mt-0.5">{g.represents}</span>
              <span className="text-[11px] text-slate-400 block mt-1">{g.equivalent}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Standard Cooking Measurement Multipliers</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {PORTION_CONVERSIONS.map((c, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block">1 {c.from}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">≈ {c.factor} {c.to}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. Recipe Nutrition Estimator
// ==========================================
export const RecipeNutritionEstimator: React.FC = () => {
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState([
    { name: 'Rolled Oats (2 cups)', kcal: 600, protein: 20 },
    { name: 'Almond Milk (2 cups)', kcal: 120, protein: 4 },
    { name: 'Chia Seeds (2 tbsp)', kcal: 130, protein: 4 },
    { name: 'Honey (2 tbsp)', kcal: 130, protein: 0 }
  ]);

  const totalKcal = ingredients.reduce((a, b) => a + b.kcal, 0);
  const perServingKcal = servings > 0 ? Math.round(totalKcal / servings) : 0;
  const totalProtein = ingredients.reduce((a, b) => a + b.protein, 0);
  const perServingProtein = servings > 0 ? Math.round((totalProtein / servings) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Number of Servings</label>
        <input
          type="number"
          min="1"
          value={servings}
          onChange={(e) => setServings(parseInt(e.target.value, 10) || 1)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 text-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Per Serving Calories</span>
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{perServingKcal} kcal</span>
          <span className="text-[11px] text-slate-400">Total Recipe: {totalKcal} kcal</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Per Serving Protein</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 block">{perServingProtein} g</span>
          <span className="text-[11px] text-slate-400">Total Recipe: {totalProtein} g</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. Calorie Deficit Calculator
// ==========================================
export const CalorieDeficitCalculator: React.FC = () => {
  const [tdee, setTdee] = useState(2300);
  const [targetLossKg, setTargetLossKg] = useState(5);
  const [deficit, setDeficit] = useState(500);

  const proj = calculateCalorieDeficit(tdee, targetLossKg, deficit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Maintenance TDEE (kcal)</label>
          <input
            type="number"
            value={tdee}
            onChange={(e) => setTdee(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weight Loss Goal (kg)</label>
          <input
            type="number"
            value={targetLossKg}
            onChange={(e) => setTargetLossKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Daily Deficit (kcal)</label>
          <input
            type="number"
            value={deficit}
            onChange={(e) => setDeficit(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Target Daily Intake</span>
          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{proj.targetDailyCalories} kcal/day</div>
          <span className="text-xs text-slate-500">Estimated ~{proj.weeklyWeightLossKg} kg / week loss</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-center">
          <div>
            <span className="text-slate-400 block">Days to Reach Goal</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{proj.daysToGoal} Days</span>
          </div>
          <div>
            <span className="text-slate-400 block">Projected Goal Date</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{proj.projectedGoalDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. Calorie Surplus Calculator
// ==========================================
export const CalorieSurplusCalculator: React.FC = () => {
  const [tdee, setTdee] = useState(2200);
  const [surplus, setSurplus] = useState(300);

  const target = tdee + surplus;
  const weeklyGainKg = Math.round(((surplus * 7) / 7700) * 100) / 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Maintenance Calories (TDEE)</label>
          <input
            type="number"
            value={tdee}
            onChange={(e) => setTdee(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Surplus (+200 to +500 kcal)</label>
          <input
            type="number"
            value={surplus}
            onChange={(e) => setSurplus(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">Lean Bulking Daily Target</span>
        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{target} kcal/day</div>
        <p className="text-xs text-slate-500">Estimated ~{weeklyGainKg} kg per week lean gain rate</p>
      </div>
    </div>
  );
};

// ==========================================
// 11. Sugar Intake Tracker
// ==========================================
export const SugarIntakeTracker: React.FC = () => {
  const [sugarGrams, setSugarGrams] = useState(22);
  const whoMax = 25; // 25g WHO recommendation for added sugar

  return (
    <div className="space-y-6 text-center">
      <div className="max-w-xs mx-auto">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Added Sugar Consumed (g)</label>
        <input
          type="number"
          value={sugarGrams}
          onChange={(e) => setSugarGrams(parseInt(e.target.value, 10) || 0)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-bold"
        />
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">WHO Recommended Limit: 25g/day</span>
        <div className={`text-4xl font-black ${sugarGrams <= whoMax ? 'text-emerald-500' : 'text-rose-500'}`}>
          {sugarGrams} / {whoMax} g
        </div>
        <p className="text-xs text-slate-500">
          {sugarGrams <= whoMax
            ? 'Within healthy WHO guidelines (<10% of total dietary energy).'
            : 'Exceeds recommended free sugar daily threshold. Aim to reduce sodas, syrups, and packaged confectionery.'}
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 12. Fiber Intake Tracker
// ==========================================
export const FiberIntakeTracker: React.FC = () => {
  const [fiberGrams, setFiberGrams] = useState(28);
  const target = 35;

  return (
    <div className="space-y-6 text-center">
      <div className="max-w-xs mx-auto">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fiber Consumed (g)</label>
        <input
          type="number"
          value={fiberGrams}
          onChange={(e) => setFiberGrams(parseInt(e.target.value, 10) || 0)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-bold"
        />
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">RDA Target: 25g (women) - 38g (men)</span>
        <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{fiberGrams} / {target} g</div>
        <p className="text-xs text-slate-500">Legumes, chia seeds, oats, apples, and cruciferous vegetables are great sources.</p>
      </div>
    </div>
  );
};

// ==========================================
// 13. Food Label Analyzer
// ==========================================
export const FoodLabelAnalyzer: React.FC = () => {
  const [cal, setCal] = useState(250);
  const [sodium, setSodium] = useState(480); // mg
  const [satFat, setSatFat] = useState(3.5); // g
  const [addedSugar, setAddedSugar] = useState(12); // g

  // Standard % Daily Value thresholds: Sodium 2300mg, Sat Fat 20g, Added Sugar 50g
  const sodiumPct = Math.round((sodium / 2300) * 100);
  const satFatPct = Math.round((satFat / 20) * 100);
  const sugarPct = Math.round((addedSugar / 50) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Calories</label>
          <input
            type="number"
            value={cal}
            onChange={(e) => setCal(parseInt(e.target.value, 10) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Sodium (mg)</label>
          <input
            type="number"
            value={sodium}
            onChange={(e) => setSodium(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Saturated Fat (g)</label>
          <input
            type="number"
            value={satFat}
            onChange={(e) => setSatFat(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Added Sugar (g)</label>
          <input
            type="number"
            value={addedSugar}
            onChange={(e) => setAddedSugar(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs text-center">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Sodium %DV</span>
          <span className={`text-xl font-bold mt-1 block ${sodiumPct >= 20 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>{sodiumPct}%</span>
          <span className="text-[10px] text-slate-400">{sodiumPct >= 20 ? 'High' : sodiumPct <= 5 ? 'Low' : 'Moderate'}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Sat Fat %DV</span>
          <span className={`text-xl font-bold mt-1 block ${satFatPct >= 20 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>{satFatPct}%</span>
          <span className="text-[10px] text-slate-400">{satFatPct >= 20 ? 'High' : satFatPct <= 5 ? 'Low' : 'Moderate'}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Added Sugar %DV</span>
          <span className={`text-xl font-bold mt-1 block ${sugarPct >= 20 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>{sugarPct}%</span>
          <span className="text-[10px] text-slate-400">{sugarPct >= 20 ? 'High' : sugarPct <= 5 ? 'Low' : 'Moderate'}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 14. Meal Calorie Split Calculator
// ==========================================
export const MealCalorieSplitCalculator: React.FC = () => {
  const [totalCal, setTotalCal] = useState(2000);
  const [pattern, setPattern] = useState<'3_meals' | '3_meals_1_snack' | '4_meals' | '5_meals'>('3_meals_1_snack');

  const splits: Record<string, { name: string; pct: number }[]> = {
    '3_meals': [
      { name: 'Breakfast (30%)', pct: 0.3 },
      { name: 'Lunch (40%)', pct: 0.4 },
      { name: 'Dinner (30%)', pct: 0.3 }
    ],
    '3_meals_1_snack': [
      { name: 'Breakfast (25%)', pct: 0.25 },
      { name: 'Lunch (35%)', pct: 0.35 },
      { name: 'Dinner (25%)', pct: 0.25 },
      { name: 'Snack (15%)', pct: 0.15 }
    ],
    '4_meals': [
      { name: 'Meal 1 (25%)', pct: 0.25 },
      { name: 'Meal 2 (25%)', pct: 0.25 },
      { name: 'Meal 3 (25%)', pct: 0.25 },
      { name: 'Meal 4 (25%)', pct: 0.25 }
    ],
    '5_meals': [
      { name: 'Meal 1 (20%)', pct: 0.2 },
      { name: 'Meal 2 (20%)', pct: 0.2 },
      { name: 'Meal 3 (20%)', pct: 0.2 },
      { name: 'Meal 4 (20%)', pct: 0.2 },
      { name: 'Meal 5 (20%)', pct: 0.2 }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Total Daily Calories</label>
          <input
            type="number"
            value={totalCal}
            onChange={(e) => setTotalCal(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Meal Distribution Pattern</label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="3_meals">3 Meals (30% / 40% / 30%)</option>
            <option value="3_meals_1_snack">3 Meals + 1 Snack (25% / 35% / 25% / 15%)</option>
            <option value="4_meals">4 Equal Meals (25% each)</option>
            <option value="5_meals">5 Frequent Meals (20% each)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
        {splits[pattern].map((m, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block font-medium">{m.name}</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {Math.round(totalCal * m.pct)} kcal
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 15. Daily Nutrition Summary
// ==========================================
export const DailyNutritionSummary: React.FC = () => {
  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="font-bold text-slate-800 dark:text-slate-100 block">Today's Nutrition Scorecard</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Total Calories</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">1,950 kcal</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Total Protein</span>
            <span className="font-bold text-emerald-600 text-sm">138 g</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Hydration</span>
            <span className="font-bold text-cyan-600 text-sm">2.4 L</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Dietary Fiber</span>
            <span className="font-bold text-amber-600 text-sm">31 g</span>
          </div>
        </div>
      </div>
    </div>
  );
};
