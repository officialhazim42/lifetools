import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const LoanCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [amount, setAmount] = useState<number | ''>(25000);
  const [rate, setRate] = useState<number | ''>(6.5);
  const [termYears, setTermYears] = useState<number | ''>(3);
  const [frequency, setFrequency] = useState<'monthly' | 'biweekly'>('monthly');

  const calculate = () => {
    const P = Number(amount) || 0;
    const rAnnual = Number(rate) || 0;
    const yrs = Number(termYears) || 0;

    if (P <= 0 || rAnnual <= 0 || yrs <= 0) return null;

    const paymentsPerYear = frequency === 'monthly' ? 12 : 26;
    const r = rAnnual / paymentsPerYear / 100;
    const n = yrs * paymentsPerYear;

    const payment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalCost = payment * n;
    const totalInterest = totalCost - P;

    return {
      payment,
      totalCost,
      totalInterest,
      paymentsCount: n,
      frequency
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Payment: $${res.payment.toFixed(2)} (${res.frequency}), Total Interest: $${res.totalInterest.toFixed(2)}, Total Cost: $${res.totalCost.toFixed(2)}`
    );
    showToast('Loan summary copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Loan Amount ($)
          </label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="25000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="6.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Term (Years)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={termYears}
            onChange={(e) => setTermYears(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="3"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Payment Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            className="input-base"
          >
            <option value="monthly">Monthly (12/yr)</option>
            <option value="biweekly">Bi-Weekly (26/yr)</option>
          </select>
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Loan Estimate</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${res.payment.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 capitalize font-medium">{res.frequency} Payment</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                ${res.totalInterest.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Total Interest Paid</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ${res.totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Total Repayment Amount</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
