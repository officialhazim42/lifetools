import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const RatioCalculator: React.FC = () => {
  const { showToast } = useToast();

  // Mode 1: A:B = C:D (Solve for D)
  const [a1, setA1] = useState<number | ''>(4);
  const [b1, setB1] = useState<number | ''>(3);
  const [c1, setC1] = useState<number | ''>(1920);

  // Mode 2: Simplify A:B
  const [a2, setA2] = useState<number | ''>(1920);
  const [b2, setB2] = useState<number | ''>(1080);

  // GCD helper
  const gcd = (x: number, y: number): number => {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  };

  // Solve D = (B * C) / A
  const solvedD =
    a1 !== '' && b1 !== '' && c1 !== '' && Number(a1) !== 0
      ? (Number(b1) * Number(c1)) / Number(a1)
      : null;

  // Simplify ratio
  const getSimplified = () => {
    const v1 = Number(a2) || 0;
    const v2 = Number(b2) || 0;
    if (v1 <= 0 || v2 <= 0) return null;
    const d = gcd(v1, v2);
    return {
      simplifiedA: v1 / d,
      simplifiedB: v2 / d,
      decimal: (v1 / v2).toFixed(4)
    };
  };

  const simplified = getSimplified();

  return (
    <div className="space-y-8">
      {/* Ratio Proportion Solver */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          1. Solve Proportion (A : B = C : D)
        </h3>
        <p className="text-xs text-slate-500">
          Find the unknown value D given ratio A:B and value C (e.g. aspect ratio scaling).
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={a1}
            onChange={(e) => setA1(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-24 text-center font-bold"
            placeholder="A"
          />
          <span className="font-bold text-slate-400">:</span>
          <input
            type="number"
            value={b1}
            onChange={(e) => setB1(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-24 text-center font-bold"
            placeholder="B"
          />
          <span className="font-bold text-slate-400">=</span>
          <input
            type="number"
            value={c1}
            onChange={(e) => setC1(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32 text-center font-bold"
            placeholder="C"
          />
          <span className="font-bold text-slate-400">:</span>
          <div className="w-32 py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center font-extrabold text-emerald-600 dark:text-emerald-400">
            {solvedD !== null ? solvedD.toLocaleString(undefined, { maximumFractionDigits: 3 }) : '?'}
          </div>
        </div>

        {solvedD !== null && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                copyToClipboard(String(solvedD));
                showToast('Value D copied!');
              }}
              className="btn-secondary text-xs py-1"
            >
              <Copy className="w-3.5 h-3.5" /> Copy D
            </button>
          </div>
        )}
      </div>

      {/* Simplify Ratio */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          2. Simplify Ratio (A : B)
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            value={a2}
            onChange={(e) => setA2(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32 text-center font-bold"
            placeholder="1920"
          />
          <span className="font-bold text-slate-400">:</span>
          <input
            type="number"
            value={b2}
            onChange={(e) => setB2(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base w-32 text-center font-bold"
            placeholder="1080"
          />
        </div>

        {simplified && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Simplified Ratio: </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 ml-1">
                {simplified.simplifiedA} : {simplified.simplifiedB}
              </span>
              <span className="text-xs text-slate-400 ml-3">({simplified.decimal} : 1)</span>
            </div>
            <button
              onClick={() => {
                copyToClipboard(`${simplified.simplifiedA}:${simplified.simplifiedB}`);
                showToast('Simplified ratio copied!');
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
