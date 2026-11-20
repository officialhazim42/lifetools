import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../../utils/formatters';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Coins,
  Copy,
  RotateCcw,
  Printer,
  Sparkles,
  Calculator
} from 'lucide-react';

const DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

export const CashCounter: React.FC = () => {
  const { showToast } = useToast();
  const [openingFloat, setOpeningFloat] = useState<number>(2000);
  const [expectedClosingCash, setExpectedClosingCash] = useState<number>(25400);

  const [counts, setCounts] = useState<Record<number, number>>({
    500: 40,
    200: 15,
    100: 20,
    50: 8,
    20: 0,
    10: 0,
    5: 0,
    2: 0,
    1: 0,
    2000: 0
  });

  const handleCountChange = (denom: number, count: number) => {
    setCounts(prev => ({
      ...prev,
      [denom]: Math.max(0, count)
    }));
  };

  const handleReset = () => {
    const cleared: Record<number, number> = {};
    DENOMINATIONS.forEach(d => (cleared[d] = 0));
    setCounts(cleared);
    showToast('Register counts cleared');
  };

  let actualClosingCash = 0;
  DENOMINATIONS.forEach(d => {
    actualClosingCash += d * (counts[d] || 0);
  });

  const netCashCollected = actualClosingCash - openingFloat;
  const variance = actualClosingCash - expectedClosingCash;
  const isSurplus = variance > 0;
  const isShortage = variance < 0;

  const handleCopy = () => {
    const lines = [
      '🧾 End of Day Cash Register Reconciliation:',
      `Opening Float: ₹${formatNumber(openingFloat, 2)}`,
      `Actual Cash Counted: ₹${formatNumber(actualClosingCash, 2)}`,
      `Net Cash Inflow: ₹${formatNumber(netCashCollected, 2)}`,
      `Expected System Cash: ₹${formatNumber(expectedClosingCash, 2)}`,
      `Variance: ${isSurplus ? 'Surplus' : isShortage ? 'Shortage' : 'Balanced'} of ₹${formatNumber(Math.abs(variance), 2)}`
    ];
    copyToClipboard(lines.join('\n'));
    showToast('Register reconciliation copied!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Register Balance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Counted Cash
          </div>
          <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            ₹ {formatNumber(actualClosingCash, 0)}
          </div>
          <div className="text-[11px] text-slate-400">Physical drawer count</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Net Daily Inflow
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            ₹ {formatNumber(netCashCollected, 0)}
          </div>
          <div className="text-[11px] text-slate-400">Excluding opening float</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Reconciliation Variance
          </div>
          <div className={`text-3xl font-black font-mono ${
            isShortage ? 'text-rose-500' : isSurplus ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
          }`}>
            {isSurplus ? '+' : ''}₹ {formatNumber(variance, 0)}
          </div>
          <div className="text-[11px] text-slate-400">
            {isSurplus ? 'Cash Surplus' : isShortage ? 'Cash Shortage' : 'Perfect Match'}
          </div>
        </div>
      </div>

      {/* Float & Register Settings */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Opening Float:</span>
            <input
              type="number"
              min="0"
              value={openingFloat}
              onChange={(e) => setOpeningFloat(parseFloat(e.target.value) || 0)}
              className="input-base text-xs py-1 px-2.5 w-28 font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Expected Cash:</span>
            <input
              type="number"
              min="0"
              value={expectedClosingCash}
              onChange={(e) => setExpectedClosingCash(parseFloat(e.target.value) || 0)}
              className="input-base text-xs py-1 px-2.5 w-28 font-mono font-bold"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="btn-primary text-xs py-1.5 px-3">
            <Copy className="w-3.5 h-3.5" /> Copy Log
          </button>
          <button onClick={() => window.print()} className="btn-secondary text-xs py-1.5 px-3">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button onClick={handleReset} className="btn-secondary text-xs py-1.5 px-3 text-rose-500">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Denominations Input Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          {/* High Denominations */}
          <div className="p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">High Notes</h4>
            {DENOMINATIONS.slice(0, 5).map(denom => (
              <div key={denom} className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 w-16">₹{denom}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={counts[denom] || ''}
                  onChange={(e) => handleCountChange(denom, parseInt(e.target.value) || 0)}
                  className="input-base text-xs py-1 px-3 w-28 text-center font-mono font-bold"
                />
                <span className="font-mono text-slate-600 dark:text-slate-400 w-24 text-right">
                  ₹{formatNumber(denom * (counts[denom] || 0), 0)}
                </span>
              </div>
            ))}
          </div>

          {/* Low Denominations */}
          <div className="p-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Coins & Small Notes</h4>
            {DENOMINATIONS.slice(5).map(denom => (
              <div key={denom} className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 w-16">₹{denom}</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={counts[denom] || ''}
                  onChange={(e) => handleCountChange(denom, parseInt(e.target.value) || 0)}
                  className="input-base text-xs py-1 px-3 w-28 text-center font-mono font-bold"
                />
                <span className="font-mono text-slate-600 dark:text-slate-400 w-24 text-right">
                  ₹{formatNumber(denom * (counts[denom] || 0), 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
