import React, { useState } from 'react';
import {
  calculateBmi,
  calculateIdealWeight,
  calculateBmr,
  calculateTdee,
  calculateBodyFat,
  calculateWhtr,
  calculateWhr,
  calculateWaterIntake,
  calculateProteinNeeds,
  calculateHeartRateZones,
  calculatePregnancyDueDate,
  calculateOvulationWindow,
  ActivityLevel,
  ACTIVITY_MULTIPLIERS
} from '../../../utils/health/healthCalculators';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  Activity,
  Heart,
  Droplet,
  Baby,
  Calendar,
  AlertCircle,
  Copy,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

// Common medical disclaimer alert box
const MedicalDisclaimer: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-start gap-3 p-3.5 mt-4 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
    <p>
      {text ||
        'Informational Estimate Only: This calculation is provided for general health awareness and personal reference. It does not constitute medical advice, diagnosis, or clinical evaluation. Always consult a qualified healthcare provider for clinical assessments.'}
    </p>
  </div>
);

// ==========================================
// 1. Body Mass Index Calculator
// ==========================================
export const BodyMassIndexCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);

  const effectiveWeightKg = unit === 'metric' ? weightKg : weightLbs * 0.453592;
  const effectiveHeightCm = unit === 'metric' ? heightCm : (heightFt * 12 + heightIn) * 2.54;

  const result = calculateBmi(effectiveWeightKg, effectiveHeightCm);

  const handleCopy = () => {
    if (!result) return;
    const text = `LifeTools BMI Assessment:\nBMI: ${result.bmi} (${result.category})\nWHO Category: ${result.category}\nAsian Cutoff Category: ${result.asianCategory}\nBMI Prime: ${result.prime}\nPonderal Index: ${result.ponderalIndex} kg/m³\nHealthy Weight Range: ${result.healthyWeightRangeKg[0]} - ${result.healthyWeightRangeKg[1]} kg`;
    copyToClipboard(text);
    showToast('BMI results copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setUnit('metric')}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
            unit === 'metric' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Metric (kg / cm)
        </button>
        <button
          onClick={() => setUnit('imperial')}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
            unit === 'imperial' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Imperial (lbs / ft-in)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unit === 'metric' ? (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Weight (Kilograms)
              </label>
              <input
                type="number"
                min="20"
                max="300"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Height (Centimeters)
              </label>
              <input
                type="number"
                min="80"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Weight (Pounds)
              </label>
              <input
                type="number"
                min="40"
                max="650"
                value={weightLbs}
                onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Feet</label>
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={heightFt}
                  onChange={(e) => setHeightFt(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Inches</label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={heightIn}
                  onChange={(e) => setHeightIn(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Calculated BMI</span>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {result.bmi} <span className="text-sm font-semibold text-slate-400">kg/m²</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${result.categoryColor} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm`}>
                {result.category}
              </span>
              <div className="text-xs text-slate-500 mt-1">Asian Ref: {result.asianCategory}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block">BMI Prime</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{result.prime} (&lt;1.0 normal)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Ponderal Index</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{result.ponderalIndex} kg/m³</span>
            </div>
            <div>
              <span className="text-slate-400 block">Healthy Range (Kg)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{result.healthyWeightRangeKg[0]} - {result.healthyWeightRangeKg[1]} kg</span>
            </div>
            <div>
              <span className="text-slate-400 block">Healthy Range (Lbs)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{result.healthyWeightRangeLbs[0]} - {result.healthyWeightRangeLbs[1]} lbs</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Assessment
            </button>
          </div>
        </div>
      )}

      <MedicalDisclaimer text="BMI is a statistical screening measure of body mass relative to height. It does not measure body fat directly and may overestimate fatness in athletes with high muscle mass or underestimate fatness in older individuals with sarcopenia." />
    </div>
  );
};

// ==========================================
// 2. Ideal Weight Estimator
// ==========================================
export const IdealWeightEstimator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(175);

  const result = calculateIdealWeight(gender, heightCm);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                gender === 'male'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-sm font-medium rounded-xl border transition-all ${
                gender === 'female'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Height (cm)
          </label>
          <input
            type="number"
            min="120"
            max="230"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="text-center pb-2">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Consensus Ideal Weight</span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {result.averageKg} kg <span className="text-lg font-normal text-slate-400">({result.averageLbs} lbs)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Average across 4 clinical pharmacological formulas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Devine Formula</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{result.devineKg} kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Robinson Formula</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{result.robinsonKg} kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Miller Formula</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{result.millerKg} kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Hamwi Formula</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{result.hamwiKg} kg</span>
            </div>
          </div>
        </div>
      )}

      <MedicalDisclaimer text="Ideal Body Weight formulas were originally designed for clinical medication dosing and medical standards. Individual frame size, muscularity, bone density, and genetics create natural variation around these targets." />
    </div>
  );
};

// ==========================================
// 3. BMR Calculator
// ==========================================
export const BmrCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [bodyFat, setBodyFat] = useState<number | ''>('');

  const result = calculateBmr(
    gender,
    age,
    weightKg,
    heightCm,
    bodyFat !== '' ? Number(bodyFat) : undefined
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'male' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'female' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
          <input
            type="number"
            min="10"
            max="120"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weight (kg)</label>
          <input
            type="number"
            min="20"
            max="300"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
          <input
            type="number"
            min="80"
            max="250"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="max-w-xs">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          Body Fat % (Optional, for Katch-McArdle)
        </label>
        <input
          type="number"
          min="3"
          max="60"
          placeholder="e.g. 18"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value === '' ? '' : parseFloat(e.target.value))}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
      </div>

      {result && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Baseline Resting Metabolism</span>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {result.mifflinStJeor} <span className="text-base font-normal text-slate-400">kcal/day</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Calculated via Mifflin-St Jeor formula (Standard Gold Standard)</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Mifflin-St Jeor</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{result.mifflinStJeor} kcal</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Harris-Benedict</span>
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">{result.harrisBenedict} kcal</span>
            </div>
            {result.katchMcArdle && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-medium">Katch-McArdle (Lean Mass)</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">{result.katchMcArdle} kcal</span>
              </div>
            )}
          </div>
        </div>
      )}

      <MedicalDisclaimer text="Basal Metabolic Rate is the number of calories your body burns at complete rest just to keep organs functioning. It does not include physical movement, thermic effect of food, or daily exercise." />
    </div>
  );
};

// ==========================================
// 4. TDEE Calculator
// ==========================================
export const TdeeCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const bmrResult = calculateBmr(gender, age, weightKg, heightCm);
  const bmr = bmrResult?.mifflinStJeor || 1600;
  const tdee = calculateTdee(bmr, activity);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'male' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'female' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
          <input
            type="number"
            min="10"
            max="120"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weight (kg)</label>
          <input
            type="number"
            min="20"
            max="300"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
          <input
            type="number"
            min="80"
            max="250"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Activity Level</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((key) => {
            const item = ACTIVITY_MULTIPLIERS[key];
            const isSelected = activity === key;
            return (
              <button
                key={key}
                onClick={() => setActivity(key)}
                className={`p-3 text-left rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500 dark:border-emerald-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.label}</span>
                  <span className="text-[10px] font-semibold text-slate-400">×{item.multiplier}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Daily Energy Expenditure (TDEE)</span>
          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {tdee} <span className="text-base font-normal text-slate-400">kcal/day</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Calories required daily to maintain current body weight at your activity level</p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Mild Weight Loss</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{Math.max(1200, tdee - 250)} kcal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Standard Fat Loss (-500)</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{Math.max(1200, tdee - 500)} kcal</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Muscle Gain (+300)</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{tdee + 300} kcal</span>
          </div>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 5. Body Fat Percentage Estimator
// ==========================================
export const BodyFatPercentageEstimator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [hipCm, setHipCm] = useState<number>(98);
  const [weightKg, setWeightKg] = useState<number>(72);

  const result = calculateBodyFat(
    gender,
    heightCm,
    waistCm,
    neckCm,
    gender === 'female' ? hipCm : undefined,
    weightKg
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'male' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'female' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Waist (cm, at navel)</label>
          <input
            type="number"
            value={waistCm}
            onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Neck (cm, below larynx)</label>
          <input
            type="number"
            value={neckCm}
            onChange={(e) => setNeckCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        {gender === 'female' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Hips (cm, widest point)</label>
            <input
              type="number"
              value={hipCm}
              onChange={(e) => setHipCm(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
          </div>
        )}
      </div>

      {result ? (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Estimated Body Fat %</span>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {result.bodyFatPercent}%
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
                {result.category}
              </span>
              <div className="text-xs text-slate-400 mt-1">US Navy Circumference Standard</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Fat Mass</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{result.fatMassKg} kg</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block font-medium">Lean Body Mass</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{result.leanMassKg} kg</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          Please verify circumference inputs (waist must be larger than neck).
        </div>
      )}

      <MedicalDisclaimer text="The US Navy method is a statistical circumference model with a typical variance of ±3-4% compared to clinical DEXA or hydrostatic weighing." />
    </div>
  );
};

// ==========================================
// 6. Waist-to-Height Ratio Calculator
// ==========================================
export const WaistToHeightRatioCalculator: React.FC = () => {
  const [waistCm, setWaistCm] = useState<number>(82);
  const [heightCm, setHeightCm] = useState<number>(175);

  const result = calculateWhtr(waistCm, heightCm);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Waist Circumference (cm)</label>
          <input
            type="number"
            value={waistCm}
            onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Waist-to-Height Ratio</span>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{result.ratio}</div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
            {result.category}
          </span>
          <p className="text-xs text-slate-500 pt-2">General health rule of thumb: "Keep your waist circumference to less than half your height" (Ratio &lt; 0.50).</p>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 7. Waist-to-Hip Ratio Calculator
// ==========================================
export const WaistToHipRatioCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waistCm, setWaistCm] = useState<number>(85);
  const [hipCm, setHipCm] = useState<number>(98);

  const result = calculateWhr(gender, waistCm, hipCm);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'male' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${
                gender === 'female' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Waist Circumference (cm)</label>
          <input
            type="number"
            value={waistCm}
            onChange={(e) => setWaistCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Hip Circumference (cm)</label>
          <input
            type="number"
            value={hipCm}
            onChange={(e) => setHipCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Waist-to-Hip Ratio</span>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{result.ratio}</div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400">
            {result.riskLevel}
          </span>
          <p className="text-xs text-slate-500 pt-2">
            WHO Guidelines: WHR &gt; 0.90 in men and &gt; 0.85 in women indicates central visceral adiposity and higher cardiometabolic risk.
          </p>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 8. Calorie Needs Calculator
// ==========================================
export const CalorieNeedsCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [age, setAge] = useState<number>(29);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');

  const bmrResult = calculateBmr(gender, age, weightKg, heightCm);
  const tdee = calculateTdee(bmrResult?.mifflinStJeor || 1700, activity);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${gender === 'male' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-800'}`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${gender === 'female' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-800'}`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Maintenance</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{tdee} kcal</span>
          <span className="text-[11px] text-slate-400">0 kg/week</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-amber-500 block font-medium">Mild Weight Loss</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">{Math.max(1200, tdee - 250)} kcal</span>
          <span className="text-[11px] text-slate-400">-0.25 kg/week</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-rose-500 block font-medium">Standard Fat Loss</span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">{Math.max(1200, tdee - 500)} kcal</span>
          <span className="text-[11px] text-slate-400">-0.5 kg/week</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-indigo-500 block font-medium">Lean Muscle Bulk</span>
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">{tdee + 300} kcal</span>
          <span className="text-[11px] text-slate-400">+0.25 kg/week</span>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 9. Water Intake Estimator
// ==========================================
export const WaterIntakeEstimator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [exerciseMins, setExerciseMins] = useState<number>(45);
  const [climate, setClimate] = useState<'temperate' | 'hot'>('temperate');

  const { liters, glasses8oz } = calculateWaterIntake(weightKg, exerciseMins, climate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Body Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Daily Exercise (Minutes)</label>
          <input
            type="number"
            value={exerciseMins}
            onChange={(e) => setExerciseMins(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Climate / Weather</label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="temperate">Moderate / Temperate Climate</option>
            <option value="hot">Hot / Humid / Summer Season (+500 mL)</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/40 text-center space-y-2">
        <Droplet className="w-8 h-8 text-cyan-500 mx-auto" />
        <span className="text-xs uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400">Target Daily Hydration</span>
        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{liters} Liters</div>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Approximately <strong>{glasses8oz} standard 8-ounce glasses</strong> (240 mL each) per day.
        </p>
      </div>

      <MedicalDisclaimer text="Individuals with renal conditions, congestive heart failure, or specific medical fluid restrictions should follow their nephrologist's or physician's explicit fluid limits." />
    </div>
  );
};

// ==========================================
// 10. Protein Intake Calculator
// ==========================================
export const ProteinIntakeCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(75);
  const [goal, setGoal] = useState<'sedentary' | 'maintenance' | 'endurance' | 'muscle_gain' | 'fat_loss'>('muscle_gain');

  const result = calculateProteinNeeds(weightKg, goal);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Body Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Activity & Fitness Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="sedentary">Sedentary (0.8 - 1.0 g/kg) - Baseline RDA</option>
            <option value="maintenance">Active Lifestyle (1.0 - 1.4 g/kg)</option>
            <option value="endurance">Endurance Training / Running (1.2 - 1.6 g/kg)</option>
            <option value="muscle_gain">Hypertrophy & Muscle Building (1.6 - 2.2 g/kg)</option>
            <option value="fat_loss">Fat Loss & Muscle Preservation (1.8 - 2.4 g/kg)</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Recommended Daily Protein Target</span>
        <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
          {result.gramsMin} - {result.gramsMax} <span className="text-lg font-normal text-slate-400">grams/day</span>
        </div>
        <p className="text-xs text-slate-500 pt-1">{result.desc}</p>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 11. Age & Fitness Calculator (VO2 Max & Biological Age)
// ==========================================
export const AgeFitnessCalculator: React.FC = () => {
  const [chronologicalAge, setChronologicalAge] = useState<number>(35);
  const [restingHr, setRestingHr] = useState<number>(64);
  const [exerciseDaysPerWeek, setExerciseDaysPerWeek] = useState<number>(4);
  const [bmi, setBmi] = useState<number>(23.5);

  // Simplified aerobic fitness age estimation based on resting HR, BMI, and exercise frequency
  let fitnessAge = chronologicalAge;
  if (restingHr < 60) fitnessAge -= 3;
  else if (restingHr > 75) fitnessAge += 3;

  if (exerciseDaysPerWeek >= 4) fitnessAge -= 4;
  else if (exerciseDaysPerWeek <= 1) fitnessAge += 3;

  if (bmi >= 18.5 && bmi <= 24.9) fitnessAge -= 2;
  else if (bmi >= 30) fitnessAge += 4;

  fitnessAge = Math.max(18, Math.min(90, fitnessAge));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Chronological Age</label>
          <input
            type="number"
            value={chronologicalAge}
            onChange={(e) => setChronologicalAge(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Resting Heart Rate (bpm)</label>
          <input
            type="number"
            value={restingHr}
            onChange={(e) => setRestingHr(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Exercise Days/Week</label>
          <input
            type="number"
            min="0"
            max="7"
            value={exerciseDaysPerWeek}
            onChange={(e) => setExerciseDaysPerWeek(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Current BMI</label>
          <input
            type="number"
            value={bmi}
            onChange={(e) => setBmi(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Estimated Fitness Age</span>
        <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
          {fitnessAge} <span className="text-lg font-normal text-slate-400">years old</span>
        </div>
        <p className="text-xs text-slate-500">
          {fitnessAge < chronologicalAge
            ? `Your aerobic and resting indicators reflect a cardiovascular fitness profile younger than your calendar age (-${chronologicalAge - fitnessAge} years).`
            : fitnessAge > chronologicalAge
            ? `Targeting lower resting heart rate through consistent cardio can improve your fitness age (+${fitnessAge - chronologicalAge} years).`
            : 'Your fitness metrics are in close equilibrium with your chronological age.'}
        </p>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 12. Pregnancy Due Date Calculator
// ==========================================
export const PregnancyDueDateCalculator: React.FC = () => {
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // Default ~10 weeks ago
    return d.toISOString().split('T')[0];
  });
  const [cycleLength, setCycleLength] = useState<number>(28);

  const result = calculatePregnancyDueDate(lmpDate, cycleLength);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            First Day of Last Menstrual Period (LMP)
          </label>
          <input
            type="date"
            value={lmpDate}
            onChange={(e) => setLmpDate(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Average Cycle Length (Days)
          </label>
          <input
            type="number"
            min="21"
            max="40"
            value={cycleLength}
            onChange={(e) => setCycleLength(parseInt(e.target.value, 10) || 28)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">Estimated Due Date (EDD)</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {new Date(result.estimatedDueDate).toLocaleDateString(undefined, { dateStyle: 'full' })}
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 shadow-sm">
                Trimester {result.currentTrimester}
              </span>
              <div className="text-xs text-slate-500 mt-1">{result.daysRemaining} days remaining</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-rose-200 dark:border-rose-800/40 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900">
              <span className="text-slate-400 block font-medium">Gestational Age</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{result.gestationalAgeWeeks} Weeks, {result.gestationalAgeDays} Days</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900">
              <span className="text-slate-400 block font-medium">Estimated Conception</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">{result.estimatedConceptionDate}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900">
              <span className="text-slate-400 block font-medium">Full Term Standard</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">40 Weeks (280 Days)</span>
            </div>
          </div>
        </div>
      )}

      <MedicalDisclaimer text="Approximation based on Naegele's rule. Only about 4% of births occur on their exact estimated due date. Ultrasound dating conducted by your OB/GYN or midwife is the clinical standard for establishing gestational timelines." />
    </div>
  );
};

// ==========================================
// 13. Ovulation Date Estimator
// ==========================================
export const OvulationDateEstimator: React.FC = () => {
  const [lastPeriod, setLastPeriod] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 10);
    return d.toISOString().split('T')[0];
  });
  const [cycleDays, setCycleDays] = useState<number>(28);

  const result = calculateOvulationWindow(lastPeriod, cycleDays);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">First Day of Last Period</label>
          <input
            type="date"
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Average Cycle Length (Days)</label>
          <input
            type="number"
            min="20"
            max="45"
            value={cycleDays}
            onChange={(e) => setCycleDays(parseInt(e.target.value, 10) || 28)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400">Estimated Ovulation Date</span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {new Date(result.ovulationDate).toLocaleDateString(undefined, { dateStyle: 'full' })}
            </div>
            <p className="text-xs text-slate-500 mt-1">Estimated luteal phase calculation (14 days prior to next period)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-purple-200 dark:border-purple-800/40 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900">
              <span className="text-slate-400 block font-medium">Estimated Fertile Window</span>
              <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {result.fertileWindowStart} to {result.fertileWindowEnd}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900">
              <span className="text-slate-400 block font-medium">Estimated Next Period</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{result.nextPeriodDate}</span>
            </div>
          </div>
        </div>
      )}

      <MedicalDisclaimer text="Biological ovulation varies naturally due to stress, travel, illness, and hormonal fluctuations. This mathematical model must NEVER be used as a method of natural birth control or contraception." />
    </div>
  );
};

// ==========================================
// 14. Heart Rate Zone Calculator
// ==========================================
export const HeartRateZoneCalculator: React.FC = () => {
  const [age, setAge] = useState<number>(30);
  const [restingHr, setRestingHr] = useState<number>(65);

  const result = calculateHeartRateZones(age, restingHr);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
          <input
            type="number"
            min="10"
            max="100"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Resting Heart Rate (bpm)</label>
          <input
            type="number"
            min="40"
            max="120"
            value={restingHr}
            onChange={(e) => setRestingHr(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Estimated Maximum Heart Rate</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{result.maxHr} bpm</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Heart Rate Reserve (HRR)</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{result.reserveHr} bpm</span>
            </div>
          </div>

          <div className="space-y-2">
            {result.zones.map((z) => (
              <div
                key={z.zone}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                    {z.zone}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{z.name}</span>
                    <p className="text-[11px] text-slate-400">{z.benefit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {z.hrMin} - {z.hrMax} bpm
                  </span>
                  <div className="text-[10px] text-slate-400">{z.intensity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
};

// ==========================================
// 15. Target Heart Rate Calculator
// ==========================================
export const TargetHeartRateCalculator: React.FC = () => {
  const [age, setAge] = useState<number>(32);

  const maxHr = Math.round(208 - 0.7 * age);
  const moderateMin = Math.round(maxHr * 0.5);
  const moderateMax = Math.round(maxHr * 0.7);
  const vigorousMin = Math.round(maxHr * 0.7);
  const vigorousMax = Math.round(maxHr * 0.85);

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
        <input
          type="number"
          min="10"
          max="100"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Moderate Intensity (50% - 70%)</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {moderateMin} - {moderateMax} <span className="text-sm font-normal text-slate-400">bpm</span>
          </div>
          <p className="text-xs text-slate-500">
            Recommended for general aerobic fitness, brisk walking, light jogging, and active fat metabolism. You can talk comfortably.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">Vigorous Intensity (70% - 85%)</span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {vigorousMin} - {vigorousMax} <span className="text-sm font-normal text-slate-400">bpm</span>
          </div>
          <p className="text-xs text-slate-500">
            Recommended for cardiovascular performance, tempo running, and high-intensity stamina. Talking requires taking a breath.
          </p>
        </div>
      </div>

      <MedicalDisclaimer />
    </div>
  );
};
