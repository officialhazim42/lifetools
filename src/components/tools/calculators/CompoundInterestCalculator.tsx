import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const CompoundInterestCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [principal, setPrincipal] = useState<number | ''>(10000);
  const [rate, setRate] = useState<number | ''>(7);
  const [years, setYears] = useState<number | ''>(5);
  const [frequency, setFrequency] = useState<number>(12); // monthly = 12

  const calculate = () => {
    const P = Number(principal) || 0;
    const r = (Number(rate) || 0) / 100;
    const t = Number(years) || 0;
    const n = Number(frequency) || 12;

    if (P <= 0 || r <= 0 || t <= 0) return null;

    // A = P(1 + r/n)^(n*t)
    const futureValue = P * Math.pow(1 + r / n, n * t);
    const totalInterest = futureValue - P;

    const breakdown = [];
    for (let yr = 1; yr <= t; yr++) {
      const valAtYr = P * Math.pow(1 + r / n, n * yr);
      breakdown.push({
        year: yr,
        interest: valAtYr - P,
        total: valAtYr
      });
    }

    return {
      futureValue,
      totalInterest,
      principal: P,
      breakdown
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Future Value: $${res.futureValue.toFixed(2)}, Compound Interest: $${res.totalInterest.toFixed(2)}, Initial: $${res.principal.toFixed(2)}`
    );
    showToast('Compound interest copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Initial Principal ($)
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
            placeholder="7"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Duration (Years)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={years}
            onChange={(e) => setYears(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Compounding Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="input-base"
          >
            <option value={365}>Daily (365/yr)</option>
            <option value={12}>Monthly (12/yr)</option>
            <option value={4}>Quarterly (4/yr)</option>
            <option value={2}>Semi-Annually (2/yr)</option>
            <option value={1}>Annually (1/yr)</option>
          </select>
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Compound Growth</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${res.principal.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Starting Balance</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${res.totalInterest.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Total Compound Interest</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${res.futureValue.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Future Value</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Annual Balance Progression
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5">Accrued Interest</th>
                    <th className="p-2.5">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                  {res.breakdown.map((row) => (
                    <tr key={row.year}>
                      <td className="p-2.5 font-medium text-slate-900 dark:text-white">{row.year}</td>
                      <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        +${row.interest.toFixed(2)}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                        ${row.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
