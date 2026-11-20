import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import {
  ArrowRightLeft,
  Copy,
  RotateCcw,
  Sparkles,
  Calculator
} from 'lucide-react';

const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export const ChangeCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [billAmount, setBillAmount] = useState<number>(340);
  const [cashTendered, setCashTendered] = useState<number>(500);

  const changeDue = Math.max(0, cashTendered - billAmount);
  const shortage = Math.max(0, billAmount - cashTendered);

  // Compute greedy change breakdown
  const calculateChangeBreakdown = (amount: number) => {
    let rem = Math.floor(amount);
    const breakdown: { denom: number; count: number }[] = [];

    DENOMINATIONS.forEach(d => {
      if (rem >= d) {
        const cnt = Math.floor(rem / d);
        breakdown.push({ denom: d, count: cnt });
        rem %= d;
      }
    });

    return breakdown;
  };

  const breakdown = calculateChangeBreakdown(changeDue);

  const handleCopy = () => {
    const lines = [
      '💵 Change Breakdown:',
      `Bill Amount: ₹${formatNumber(billAmount, 2)}`,
      `Cash Given: ₹${formatNumber(cashTendered, 2)}`,
      `Change Due: ₹${formatNumber(changeDue, 2)}`,
      '',
      'Optimal Notes/Coins:'
    ];
    breakdown.forEach(b => {
      lines.push(`• ₹${b.denom} x ${b.count} = ₹${b.denom * b.count}`);
    });
    copyToClipboard(lines.join('\n'));
    showToast('Change breakdown copied!');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-emerald-500" /> Cashier Change Calculator
        </h2>
        <p className="text-xs text-slate-500">
          Instant calculation of customer change due and optimal currency notes to return.
        </p>
      </div>

      {/* Bill & Cash Input Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Bill Total (₹)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={billAmount}
            onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
            className="input-base text-lg font-bold font-mono"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Cash Given by Customer (₹)
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={cashTendered}
            onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
            className="input-base text-lg font-bold font-mono"
          />
        </div>
      </div>

      {/* Change Due Card */}
      <div className={`p-6 rounded-2xl border shadow-subtle text-center space-y-2 ${
        shortage > 0
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
          : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500/40'
      }`}>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          {shortage > 0 ? 'Shortage (Customer owes)' : 'Change to Return'}
        </span>
        <div className={`text-5xl font-black font-mono ${shortage > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          ₹ {formatNumber(shortage > 0 ? shortage : changeDue, 2)}
        </div>
      </div>

      {/* Denominations to Hand Over */}
      {changeDue > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Hand Over Notes & Coins:
            </h4>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1 px-2.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {breakdown.map(b => (
              <div
                key={b.denom}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-center space-y-1"
              >
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{b.denom} Note/Coin
                </div>
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {b.count}x
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  (= ₹{b.denom * b.count})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
