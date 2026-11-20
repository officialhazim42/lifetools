import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const SimpleInterestCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [principal, setPrincipal] = useState<number | ''>(10000);
  const [rate, setRate] = useState<number | ''>(5);
  const [time, setTime] = useState<number | ''>(3);
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');

  const calculate = () => {
    const P = Number(principal) || 0;
    const R = Number(rate) || 0;
    const T = timeUnit === 'years' ? Number(time) || 0 : (Number(time) || 0) / 12;

    if (P <= 0 || R <= 0 || T <= 0) return null;

    const interest = (P * R * T) / 100;
    const totalAmount = P + interest;

    return {
      interest,
      totalAmount,
      principal: P,
      rate: R,
      timeInYears: T
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Principal: $${res.principal.toFixed(2)}, Simple Interest: $${res.interest.toFixed(2)}, Total Amount: $${res.totalAmount.toFixed(2)}`
    );
    showToast('Simple Interest copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Principal ($)
          </label>
          <input
            type="number"
            min="1"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="5"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Time Period
            </label>
            <div className="flex gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => setTimeUnit('years')}
                className={`px-1.5 py-0.5 rounded ${timeUnit === 'years' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Yrs
              </button>
              <button
                type="button"
                onClick={() => setTimeUnit('months')}
                className={`px-1.5 py-0.5 rounded ${timeUnit === 'months' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Mos
              </button>
            </div>
          </div>
          <input
            type="number"
            min="1"
            value={time}
            onChange={(e) => setTime(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="3"
          />
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Interest Summary</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${res.principal.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Initial Principal</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${res.interest.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Simple Interest Earned</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${res.totalAmount.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Total Maturity Amount</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
