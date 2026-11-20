import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const TipCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [billAmount, setBillAmount] = useState<number | ''>(85.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [peopleCount, setPeopleCount] = useState<number>(2);

  const tips = [10, 15, 18, 20, 25];

  const calculate = () => {
    const bill = Number(billAmount) || 0;
    const tipP = Number(tipPercent) || 0;
    const people = Number(peopleCount) || 1;

    const tipAmount = (bill * tipP) / 100;
    const totalAmount = bill + tipAmount;
    const perPersonBill = bill / people;
    const perPersonTip = tipAmount / people;
    const perPersonTotal = totalAmount / people;

    return {
      bill,
      tipAmount,
      totalAmount,
      perPersonBill,
      perPersonTip,
      perPersonTotal,
      people
    };
  };

  const res = calculate();

  const handleCopy = () => {
    copyToClipboard(
      `Bill: $${res.bill.toFixed(2)}, Tip (${tipPercent}%): $${res.tipAmount.toFixed(2)}, Total: $${res.totalAmount.toFixed(2)} ($${res.perPersonTotal.toFixed(2)}/person for ${res.people} people)`
    );
    showToast('Tip calculation copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Bill Subtotal ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="85.50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Number of People
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={peopleCount}
            onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value) || 1))}
            className="input-base"
            placeholder="2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase">
          Tip Percentage (%)
        </label>
        <div className="flex flex-wrap gap-2">
          {tips.map((t) => (
            <button
              key={t}
              onClick={() => setTipPercent(t)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                tipPercent === t
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {t}%
            </button>
          ))}
          <div className="flex items-center gap-1.5 pl-2">
            <span className="text-xs text-slate-500">Custom:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value) || 0)}
              className="input-base w-20 py-1 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Bill & Tip Breakdown</h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${res.totalAmount.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Total Bill (incl. ${res.tipAmount.toFixed(2)} tip)</div>
          </div>
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${res.perPersonTotal.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Each Person Pays ({res.people} People)</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block">Tip per person</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">${res.perPersonTip.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block">Subtotal per person</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">${res.perPersonBill.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
