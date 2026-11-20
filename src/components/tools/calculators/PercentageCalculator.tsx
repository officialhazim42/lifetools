import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const PercentageCalculator: React.FC = () => {
  const { showToast } = useToast();

  // Mode 1: What is P% of X?
  const [p1, setP1] = useState<number | ''>(15);
  const [x1, setX1] = useState<number | ''>(200);

  // Mode 2: X is what percent of Y?
  const [x2, setX2] = useState<number | ''>(25);
  const [y2, setY2] = useState<number | ''>(100);

  // Mode 3: Percentage change from A to B
  const [a3, setA3] = useState<number | ''>(50);
  const [b3, setB3] = useState<number | ''>(75);

  const res1 = p1 !== '' && x1 !== '' ? (Number(p1) / 100) * Number(x1) : null;
  const res2 = x2 !== '' && y2 !== '' && Number(y2) !== 0 ? (Number(x2) / Number(y2)) * 100 : null;
  const res3 =
    a3 !== '' && b3 !== '' && Number(a3) !== 0
      ? ((Number(b3) - Number(a3)) / Number(a3)) * 100
      : null;

  return (
    <div className="space-y-8">
      {/* Mode 1 */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          1. Calculate Percentage: What is P% of X?
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-400">What is</span>
          <div className="relative w-28">
            <input
              type="number"
              value={p1}
              onChange={(e) => setP1(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base pr-7"
              placeholder="15"
            />
            <span className="absolute right-2.5 top-2.5 text-slate-400 text-sm">%</span>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">of</span>
          <input
            type="number"
            value={x1}
            onChange={(e) => setX1(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-36"
            placeholder="200"
          />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">?</span>
        </div>

        {res1 !== null && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div>
              <span className="text-xs text-slate-500">Result: </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 ml-1">
                {res1.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
            </div>
            <button
              onClick={() => {
                copyToClipboard(String(res1));
                showToast('Result copied!');
              }}
              className="btn-secondary text-xs py-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
        )}
      </div>

      {/* Mode 2 */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          2. Find Percentage: X is what percent of Y?
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={x2}
            onChange={(e) => setX2(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32"
            placeholder="25"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">is what percent of</span>
          <input
            type="number"
            value={y2}
            onChange={(e) => setY2(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32"
            placeholder="100"
          />
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">?</span>
        </div>

        {res2 !== null && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div>
              <span className="text-xs text-slate-500">Result: </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 ml-1">
                {res2.toLocaleString(undefined, { maximumFractionDigits: 4 })}%
              </span>
            </div>
            <button
              onClick={() => {
                copyToClipboard(`${res2}%`);
                showToast('Result copied!');
              }}
              className="btn-secondary text-xs py-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
        )}
      </div>

      {/* Mode 3 */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          3. Percentage Increase or Decrease: From A to B
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-600 dark:text-slate-400">From</span>
          <input
            type="number"
            value={a3}
            onChange={(e) => setA3(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32"
            placeholder="50"
          />
          <span className="text-sm text-slate-600 dark:text-slate-400">to</span>
          <input
            type="number"
            value={b3}
            onChange={(e) => setB3(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32"
            placeholder="75"
          />
        </div>

        {res3 !== null && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div>
              <span className="text-xs text-slate-500">Result: </span>
              <span
                className={`text-xl font-extrabold ml-1 ${
                  res3 >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {res3 >= 0 ? `+${res3.toFixed(2)}% (Increase)` : `${res3.toFixed(2)}% (Decrease)`}
              </span>
            </div>
            <button
              onClick={() => {
                copyToClipboard(`${res3.toFixed(2)}%`);
                showToast('Result copied!');
              }}
              className="btn-secondary text-xs py-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
