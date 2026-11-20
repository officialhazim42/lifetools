import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import {
  Banknote,
  Copy,
  RotateCcw,
  Sparkles,
  Calculator
} from 'lucide-react';

const INR_DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

// Convert number to Indian English words
function numberToWordsINR(num: number): string {
  if (num === 0) return 'Zero Rupees';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    let str = '';
    if (n > 9999999) {
      str += inWords(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }
    if (n > 99999) {
      str += inWords(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }
    if (n > 999) {
      str += inWords(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }
    if (n > 99) {
      str += inWords(Math.floor(n / 100)) + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) {
        str += a[n] + ' ';
      } else {
        str += b[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + a[n % 10] : '') + ' ';
      }
    }
    return str.trim();
  };

  return inWords(Math.floor(num)) + ' Rupees Only';
}

export const CurrencyDenominationCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [counts, setCounts] = useState<Record<number, number>>({
    500: 10,
    200: 5,
    100: 20,
    50: 10,
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
    INR_DENOMINATIONS.forEach(d => (cleared[d] = 0));
    setCounts(cleared);
    showToast('All counts reset to zero');
  };

  let totalCash = 0;
  let totalNotes = 0;

  INR_DENOMINATIONS.forEach(d => {
    const qty = counts[d] || 0;
    totalCash += d * qty;
    totalNotes += qty;
  });

  const amountInWords = numberToWordsINR(totalCash);

  const handleCopySummary = () => {
    const lines = [
      '💵 Cash Denomination Tally:',
      '--------------------------'
    ];
    INR_DENOMINATIONS.forEach(d => {
      const qty = counts[d] || 0;
      if (qty > 0) {
        lines.push(`₹${d} x ${qty} = ₹${formatNumber(d * qty, 0)}`);
      }
    });
    lines.push('--------------------------');
    lines.push(`Total Notes/Coins: ${totalNotes}`);
    lines.push(`Total Amount: ₹${formatNumber(totalCash, 0)}`);
    lines.push(`Amount in Words: ${amountInWords}`);

    copyToClipboard(lines.join('\n'));
    showToast('Cash summary copied to clipboard!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Total Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Cash Count
            </span>
            <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ₹ {formatNumber(totalCash, 0)}
            </div>
            <p className="text-xs text-slate-500 italic">
              {amountInWords}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={handleCopySummary} className="btn-primary text-xs py-2 px-3">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <button onClick={handleReset} className="btn-secondary text-xs py-2 px-3 text-rose-500">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Total Currency Pieces: <strong className="text-slate-900 dark:text-white">{totalNotes}</strong></span>
          <span>Standard Reserve Bank of India (INR) denominations</span>
        </div>
      </div>

      {/* Denominations Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5">Denomination</th>
              <th className="p-3.5 text-center">Number of Notes / Coins</th>
              <th className="p-3.5 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {INR_DENOMINATIONS.map(denom => {
              const qty = counts[denom] || 0;
              const subtotal = denom * qty;

              return (
                <tr key={denom} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-16 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-mono text-center">
                      ₹{denom}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      onChange={(e) => handleCountChange(denom, parseInt(e.target.value) || 0)}
                      className="input-base text-xs py-1 px-3 w-28 text-center font-mono font-bold inline-block"
                    />
                  </td>

                  <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                    ₹ {formatNumber(subtotal, 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
