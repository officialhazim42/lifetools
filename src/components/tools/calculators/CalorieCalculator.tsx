import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, AlertCircle } from 'lucide-react';

export const CalorieCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(28);
  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [weightKg, setWeightKg] = useState<number | ''>(70);
  const [activity, setActivity] = useState<number>(1.375); // 1.2, 1.375, 1.55, 1.725, 1.9

  const calculate = () => {
    const a = Number(age) || 0;
    const h = Number(heightCm) || 0;
    const w = Number(weightKg) || 0;

    if (a <= 0 || h <= 0 || w <= 0) return null;

    // Mifflin-St Jeor Formula
    // BMR = 10*weight(kg) + 6.25*height(cm) - 5*age(y) + (male: +5, female: -161)
    let bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'male' ? 5 : -161);
    let tdee = bmr * activity;

    return {
      bmr: Math.round(bmr),
      maintenance: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500)
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Daily Calories: Maintenance: ${res.maintenance} kcal/day, BMR: ${res.bmr} kcal/day, Weight Loss Target: ${res.weightLoss} kcal/day`
    );
    showToast('Calorie goals copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Gender
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                gender === 'male'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                gender === 'female'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Age (Years)
          </label>
          <input
            type="number"
            min="10"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="28"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Height (cm)
          </label>
          <input
            type="number"
            min="50"
            max="250"
            value={heightCm}
            onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="175"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Weight (kg)
          </label>
          <input
            type="number"
            min="20"
            max="300"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="70"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
          Daily Physical Activity Level
        </label>
        <select
          value={activity}
          onChange={(e) => setActivity(Number(e.target.value))}
          className="input-base"
        >
          <option value={1.2}>Sedentary (little or no exercise, desk job)</option>
          <option value={1.375}>Lightly active (light exercise or sports 1-3 days/week)</option>
          <option value={1.55}>Moderately active (moderate exercise or sports 3-5 days/week)</option>
          <option value={1.725}>Very active (hard exercise or sports 6-7 days/week)</option>
          <option value={1.9}>Extra active (very hard physical job or athlete training 2x/day)</option>
        </select>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Daily Calorie Targets</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy Goals
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {res.maintenance} kcal
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                Maintenance (TDEE)
              </div>
              <p className="text-xs text-slate-500 mt-1">Calorie intake to keep current weight unchanged</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {res.bmr} kcal
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                Basal Metabolic Rate (BMR)
              </div>
              <p className="text-xs text-slate-500 mt-1">Calories burned at complete resting state</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
            <div className="p-3.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40">
              <span className="text-sky-700 dark:text-sky-400 font-semibold block">Mild Weight Loss</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{res.mildLoss}</span>
              <span className="text-[10px] text-slate-500 block">-0.25 kg/week</span>
            </div>
            <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold block">Weight Loss</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{res.weightLoss}</span>
              <span className="text-[10px] text-slate-500 block">-0.5 kg/week</span>
            </div>
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
              <span className="text-amber-700 dark:text-amber-400 font-semibold block">Mild Weight Gain</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{res.mildGain}</span>
              <span className="text-[10px] text-slate-500 block">+0.25 kg/week</span>
            </div>
            <div className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
              <span className="text-rose-700 dark:text-rose-400 font-semibold block">Weight Gain</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{res.weightGain}</span>
              <span className="text-[10px] text-slate-500 block">+0.5 kg/week</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Disclaimer: Calorie calculations are mathematical estimates utilizing the validated Mifflin-St Jeor equation. Individual metabolic rates, body composition, hormonal profiles, and health conditions can alter caloric requirements. Always consult a certified healthcare professional before starting an aggressive diet.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
