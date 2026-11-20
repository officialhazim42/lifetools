import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const ProfitLossCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [costPrice, setCostPrice] = useState<number | ''>(120);
  const [sellingPrice, setSellingPrice] = useState<number | ''>(160);

  const calculate = () => {
    const cp = Number(costPrice) || 0;
    const sp = Number(sellingPrice) || 0;

    if (cp <= 0 || sp <= 0) return null;

    const diff = sp - cp;
    const isProfit = diff >= 0;
    const percentage = cp > 0 ? (Math.abs(diff) / cp) * 100 : 0;
    const margin = sp > 0 ? (diff / sp) * 100 : 0;
    const markup = cp > 0 ? (diff / cp) * 100 : 0;

    return {
      cp,
      sp,
      diff: Math.abs(diff),
      isProfit,
      percentage,
      margin,
      markup
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `${res.isProfit ? 'Profit' : 'Loss'}: $${res.diff.toFixed(2)} (${res.percentage.toFixed(2)}%), Margin: ${res.margin.toFixed(2)}%`
    );
    showToast('Profit & Loss summary copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Cost Price (CP) ($)
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="120"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Selling Price (SP) ($)
          </label>
          <input
            type="number"
            min="0.01"
            step="any"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="160"
          />
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Financial Outcome</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div
              className={`p-4 rounded-xl border ${
                res.isProfit
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
              }`}
            >
              <div
                className={`text-3xl font-extrabold ${
                  res.isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {res.isProfit ? `+$${res.diff.toFixed(2)}` : `-$${res.diff.toFixed(2)}`}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {res.isProfit ? 'Net Profit' : 'Net Loss'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div
                className={`text-3xl font-extrabold ${
                  res.isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {res.percentage.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {res.isProfit ? 'Profit Percentage' : 'Loss Percentage'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {res.margin.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Profit Margin (on Revenue)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
