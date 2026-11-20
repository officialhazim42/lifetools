import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RefreshCw } from 'lucide-react';

export const RandomNumberGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(10);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('asc');
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([7, 14, 22, 38, 45, 59, 63, 77, 89, 94]);

  const generate = () => {
    const minVal = Math.min(min, max);
    const maxVal = Math.max(min, max);
    const range = maxVal - minVal + 1;
    const n = Math.min(1000, Math.max(1, count));

    if (!allowDuplicates && n > range) {
      showToast(`Cannot generate ${n} unique numbers from a range of ${range}!`, 'error');
      return;
    }

    const numbers: number[] = [];
    const seen = new Set<number>();

    // Use cryptographically secure values
    const randomBuffer = new Uint32Array(allowDuplicates ? n : n * 3);
    crypto.getRandomValues(randomBuffer);
    let bufIdx = 0;

    while (numbers.length < n) {
      if (bufIdx >= randomBuffer.length) {
        crypto.getRandomValues(randomBuffer);
        bufIdx = 0;
      }
      const val = minVal + (randomBuffer[bufIdx++] % range);
      if (allowDuplicates) {
        numbers.push(val);
      } else {
        if (!seen.has(val)) {
          seen.add(val);
          numbers.push(val);
        }
      }
    }

    if (sortOrder === 'asc') numbers.sort((a, b) => a - b);
    if (sortOrder === 'desc') numbers.sort((a, b) => b - a);

    setGeneratedNumbers(numbers);
    showToast(`Generated ${numbers.length} random numbers!`);
  };

  const handleCopy = () => {
    copyToClipboard(generatedNumbers.join(', '));
    showToast('Copied numbers list!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Minimum
          </label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="input-base text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Maximum
          </label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="input-base text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Count (Quantity)
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="input-base text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Sort Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="input-base text-xs py-2"
          >
            <option value="none">Unsorted (Random)</option>
            <option value="asc">Ascending (Low &rarr; High)</option>
            <option value="desc">Descending (High &rarr; Low)</option>
          </select>
        </div>

        <div className="pt-5">
          <button onClick={generate} className="btn-primary w-full py-2.5 text-xs font-bold">
            <RefreshCw className="w-4 h-4" /> Generate
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="allowDuplicates"
          type="checkbox"
          checked={allowDuplicates}
          onChange={(e) => setAllowDuplicates(e.target.checked)}
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="allowDuplicates" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Allow Duplicate Numbers
        </label>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
            Generated Numbers ({generatedNumbers.length})
          </span>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy List
          </button>
        </div>

        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-2">
          {generatedNumbers.map((num, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-mono text-sm font-bold text-slate-900 dark:text-emerald-400"
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
