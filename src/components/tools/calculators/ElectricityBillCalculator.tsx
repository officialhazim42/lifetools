import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const ElectricityBillCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [powerWatts, setPowerWatts] = useState<number | ''>(1500);
  const [hoursPerDay, setHoursPerDay] = useState<number | ''>(6);
  const [costPerKwh, setCostPerKwh] = useState<number | ''>(0.15);
  const [daysPerMonth, setDaysPerMonth] = useState<number | ''>(30);

  const calculate = () => {
    const watts = Number(powerWatts) || 0;
    const hours = Number(hoursPerDay) || 0;
    const costUnit = Number(costPerKwh) || 0;
    const days = Number(daysPerMonth) || 30;

    const dailyKwh = (watts * hours) / 1000;
    const monthlyKwh = dailyKwh * days;
    const yearlyKwh = dailyKwh * 365;

    const dailyCost = dailyKwh * costUnit;
    const monthlyCost = monthlyKwh * costUnit;
    const yearlyCost = yearlyKwh * costUnit;

    return {
      dailyKwh,
      monthlyKwh,
      yearlyKwh,
      dailyCost,
      monthlyCost,
      yearlyCost
    };
  };

  const res = calculate();

  const handleCopy = () => {
    copyToClipboard(
      `Monthly Usage: ${res.monthlyKwh.toFixed(1)} kWh, Monthly Bill: $${res.monthlyCost.toFixed(2)}, Annual Bill: $${res.yearlyCost.toFixed(2)}`
    );
    showToast('Electricity estimate copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Power Rating (Watts)
          </label>
          <input
            type="number"
            min="1"
            value={powerWatts}
            onChange={(e) => setPowerWatts(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="1500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Usage (Hours / Day)
          </label>
          <input
            type="number"
            min="0.1"
            max="24"
            step="0.5"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="6"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Electricity Rate ($/kWh)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={costPerKwh}
            onChange={(e) => setCostPerKwh(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="0.15"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Days per Month
          </label>
          <input
            type="number"
            min="1"
            max="31"
            value={daysPerMonth}
            onChange={(e) => setDaysPerMonth(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="30"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Estimated Energy Cost</h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${res.dailyCost.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">{res.dailyKwh.toFixed(2)} kWh / Day</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${res.monthlyCost.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{res.monthlyKwh.toFixed(1)} kWh / Month</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${res.yearlyCost.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">{res.yearlyKwh.toFixed(0)} kWh / Year</div>
          </div>
        </div>
      </div>
    </div>
  );
};
