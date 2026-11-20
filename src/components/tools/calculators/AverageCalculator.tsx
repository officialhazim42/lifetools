import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const AverageCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('12, 18, 25, 30, 42, 55, 60, 60, 75');

  const calculate = () => {
    const numbers = inputText
      .split(/[\s,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '' && !isNaN(Number(s)))
      .map(Number);

    if (numbers.length === 0) return null;

    const count = numbers.length;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    const sorted = [...numbers].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    // Median
    let median = 0;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    numbers.forEach((n) => {
      freq[n] = (freq[n] || 0) + 1;
      if (freq[n] > maxFreq) maxFreq = freq[n];
    });
    const modes = Object.keys(freq)
      .map(Number)
      .filter((n) => freq[n] === maxFreq && maxFreq > 1);

    // Standard deviation
    const variance =
      numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      (count > 1 ? count - 1 : 1);
    const sampleStdDev = Math.sqrt(variance);

    const popVariance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const popStdDev = Math.sqrt(popVariance);

    return {
      count,
      sum,
      mean,
      median,
      modes: modes.length > 0 ? modes.join(', ') : 'No unique mode',
      min,
      max,
      range,
      sampleStdDev,
      popStdDev
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Count: ${res.count}, Sum: ${res.sum}, Mean: ${res.mean.toFixed(2)}, Median: ${res.median.toFixed(2)}, Min: ${res.min}, Max: ${res.max}, StdDev: ${res.sampleStdDev.toFixed(2)}`
    );
    showToast('Statistical summary copied!');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
          Enter Numbers (separated by commas, spaces, or lines)
        </label>
        <textarea
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="input-base font-mono text-sm"
          placeholder="e.g. 10, 20, 30, 40"
        />
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Statistical Measures</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {res.mean.toLocaleString(undefined, { maximumFractionDigits: 3 })}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Mean (Average)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {res.median.toLocaleString(undefined, { maximumFractionDigits: 3 })}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Median</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {res.sum.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Sum Total</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {res.count}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Count (N)</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Min</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{res.min}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Max</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{res.max}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Range</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{res.range}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Sample StdDev (s)</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {res.sampleStdDev.toFixed(3)}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Mode</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {res.modes}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
