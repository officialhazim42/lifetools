import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, AlertCircle } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  // Metric: cm & kg
  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [weightKg, setWeightKg] = useState<number | ''>(70);

  // Imperial: ft + in & lbs
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(9);
  const [weightLbs, setWeightLbs] = useState<number | ''>(155);

  const calculate = () => {
    let weightInKg = 0;
    let heightInM = 0;

    if (unitSystem === 'metric') {
      weightInKg = Number(weightKg) || 0;
      heightInM = (Number(heightCm) || 0) / 100;
    } else {
      weightInKg = (Number(weightLbs) || 0) * 0.453592;
      const totalInches = (Number(heightFt) || 0) * 12 + (Number(heightIn) || 0);
      heightInM = totalInches * 0.0254;
    }

    if (weightInKg <= 0 || heightInM <= 0) return null;

    const bmi = weightInKg / (heightInM * heightInM);

    let category = '';
    let categoryColor = '';
    let description = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-sky-500 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800';
      description = 'Below standard weight. Consider consulting a nutritionist.';
    } else if (bmi < 24.9) {
      category = 'Normal weight';
      categoryColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      description = 'Healthy range according to WHO guidelines.';
    } else if (bmi < 29.9) {
      category = 'Overweight';
      categoryColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      description = 'Slightly above standard range for height.';
    } else {
      category = 'Obese';
      categoryColor = 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800';
      description = 'Significantly above standard range for height.';
    }

    // Healthy weight range (BMI 18.5 - 24.9)
    const minHealthyKg = 18.5 * (heightInM * heightInM);
    const maxHealthyKg = 24.9 * (heightInM * heightInM);

    return {
      bmi,
      category,
      categoryColor,
      description,
      minHealthy: unitSystem === 'metric' ? `${minHealthyKg.toFixed(1)} kg` : `${(minHealthyKg * 2.20462).toFixed(1)} lbs`,
      maxHealthy: unitSystem === 'metric' ? `${maxHealthyKg.toFixed(1)} kg` : `${(maxHealthyKg * 2.20462).toFixed(1)} lbs`
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `BMI: ${res.bmi.toFixed(1)} (${res.category}), Healthy Weight: ${res.minHealthy} - ${res.maxHealthy}`
    );
    showToast('BMI result copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setUnitSystem('metric')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            unitSystem === 'metric'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Metric (cm, kg)
        </button>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            unitSystem === 'imperial'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Imperial (ft/in, lbs)
        </button>
      </div>

      {unitSystem === 'metric' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Height (cm)
            </label>
            <input
              type="number"
              min="50"
              max="260"
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
              min="10"
              max="350"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base"
              placeholder="70"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Height (Feet)
            </label>
            <input
              type="number"
              min="2"
              max="8"
              value={heightFt}
              onChange={(e) => setHeightFt(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Height (Inches)
            </label>
            <input
              type="number"
              min="0"
              max="11"
              value={heightIn}
              onChange={(e) => setHeightIn(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base"
              placeholder="9"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Weight (Pounds lbs)
            </label>
            <input
              type="number"
              min="20"
              max="700"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base"
              placeholder="155"
            />
          </div>
        </div>
      )}

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">BMI Assessment</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className={`p-5 rounded-xl border ${res.categoryColor}`}>
              <div className="text-4xl font-extrabold">{res.bmi.toFixed(1)}</div>
              <div className="text-sm font-bold mt-1 uppercase tracking-wider">{res.category}</div>
              <p className="text-xs mt-2 opacity-80">{res.description}</p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-center text-left space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Ideal Healthy Weight Range
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {res.minHealthy} – {res.maxHealthy}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Corresponds to normal BMI values of 18.5 – 24.9 for your given height.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Disclaimer: Body Mass Index (BMI) is a general screening indicator based on height and weight. It does not directly account for muscle mass, bone density, age, or sex. It is not a medical diagnosis. Consult a qualified physician for personalized advice.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
