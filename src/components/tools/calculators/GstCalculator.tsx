import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const GstCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [amount, setAmount] = useState<number | ''>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);

  const rates = [3, 5, 12, 18, 28];

  const calculate = () => {
    const val = Number(amount) || 0;
    const rate = Number(gstRate) || 0;

    let netAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (isInclusive) {
      // Amount includes GST
      netAmount = (val * 100) / (100 + rate);
      gstAmount = val - netAmount;
      totalAmount = val;
    } else {
      // Amount excludes GST
      netAmount = val;
      gstAmount = (val * rate) / 100;
      totalAmount = val + gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      netAmount,
      gstAmount,
      totalAmount,
      cgst,
      sgst
    };
  };

  const res = calculate();

  const handleCopy = () => {
    copyToClipboard(
      `Net: $${res.netAmount.toFixed(2)}, GST (${gstRate}%): $${res.gstAmount.toFixed(2)} (CGST: $${res.cgst.toFixed(2)}, SGST: $${res.sgst.toFixed(2)}), Total: $${res.totalAmount.toFixed(2)}`
    );
    showToast('GST details copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            {isInclusive ? 'Gross Amount (Incl. GST)' : 'Net Amount (Excl. GST)'}
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="1000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            GST Calculation Mode
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsInclusive(false)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                !isInclusive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Add GST (Exclusive)
            </button>
            <button
              onClick={() => setIsInclusive(true)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                isInclusive
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Remove GST (Inclusive)
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase">
          Standard GST Rates (%)
        </label>
        <div className="flex flex-wrap gap-2">
          {rates.map((r) => (
            <button
              key={r}
              onClick={() => setGstRate(r)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                gstRate === r
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {r}%
            </button>
          ))}
          <div className="flex items-center gap-1.5 pl-2">
            <span className="text-xs text-slate-500">Custom:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={gstRate}
              onChange={(e) => setGstRate(Number(e.target.value) || 0)}
              className="input-base w-20 py-1 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Tax Summary</h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy Breakdown
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${res.netAmount.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Net Price (Base)</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${res.gstAmount.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Total GST ({gstRate}%)</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${res.totalAmount.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Final Total Price</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block">CGST (Central GST - {gstRate / 2}%)</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">${res.cgst.toFixed(2)}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <span className="text-slate-500 block">SGST / UTGST (State GST - {gstRate / 2}%)</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">${res.sgst.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
