import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const FractionCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [num1, setNum1] = useState<number | ''>(3);
  const [den1, setDen1] = useState<number | ''>(4);
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/'>('+');
  const [num2, setNum2] = useState<number | ''>(2);
  const [den2, setDen2] = useState<number | ''>(5);

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  const calculate = () => {
    const n1 = Number(num1) || 0;
    const d1 = Number(den1) || 1;
    const n2 = Number(num2) || 0;
    const d2 = Number(den2) || 1;

    if (d1 === 0 || d2 === 0) return null;

    let resNum = 0;
    let resDen = 1;

    if (operator === '+') {
      resNum = n1 * d2 + n2 * d1;
      resDen = d1 * d2;
    } else if (operator === '-') {
      resNum = n1 * d2 - n2 * d1;
      resDen = d1 * d2;
    } else if (operator === '*') {
      resNum = n1 * n2;
      resDen = d1 * d2;
    } else if (operator === '/') {
      if (n2 === 0) return null; // divide by zero
      resNum = n1 * d2;
      resDen = d1 * n2;
    }

    if (resDen < 0) {
      resNum = -resNum;
      resDen = -resDen;
    }

    const common = gcd(resNum, resDen);
    const simpNum = resNum / common;
    const simpDen = resDen / common;

    const whole = Math.floor(Math.abs(simpNum) / simpDen) * (simpNum < 0 ? -1 : 1);
    const remNum = Math.abs(simpNum) % simpDen;
    const decimal = simpNum / simpDen;

    return {
      rawNum: resNum,
      rawDen: resDen,
      simpNum,
      simpDen,
      whole,
      remNum,
      decimal
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      res.simpDen === 1
        ? `${res.simpNum}`
        : `${res.simpNum}/${res.simpDen} (approx. ${res.decimal.toFixed(4)})`
    );
    showToast('Fraction copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center w-24">
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base text-center font-bold"
            placeholder="Num"
          />
          <div className="w-full h-0.5 bg-slate-400 my-1.5"></div>
          <input
            type="number"
            value={den1}
            onChange={(e) => setDen1(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base text-center font-bold"
            placeholder="Den"
          />
        </div>

        {/* Operator Selector */}
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value as any)}
          className="input-base w-16 text-center font-bold text-lg"
        >
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">&times;</option>
          <option value="/">÷</option>
        </select>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center w-24">
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base text-center font-bold"
            placeholder="Num"
          />
          <div className="w-full h-0.5 bg-slate-400 my-1.5"></div>
          <input
            type="number"
            value={den2}
            onChange={(e) => setDen2(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base text-center font-bold"
            placeholder="Den"
          />
        </div>

        <span className="text-2xl font-bold text-slate-400">=</span>

        {/* Result Fraction Badge */}
        {res ? (
          <div className="flex flex-col items-center px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl min-w-28 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl">
            {res.simpDen === 1 ? (
              <span>{res.simpNum}</span>
            ) : (
              <>
                <span>{res.simpNum}</span>
                <div className="w-full h-0.5 bg-emerald-500 my-1"></div>
                <span>{res.simpDen}</span>
              </>
            )}
          </div>
        ) : (
          <div className="text-rose-500 text-xs">Invalid (zero denominator)</div>
        )}
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Fraction Details</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {res.simpDen === 1 ? res.simpNum : `${res.simpNum} / ${res.simpDen}`}
              </div>
              <div className="text-xs text-slate-500 mt-1">Simplified Fraction</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {res.whole !== 0 && res.remNum > 0
                  ? `${res.whole} ${res.remNum}/${res.simpDen}`
                  : res.simpDen === 1
                  ? `${res.simpNum}`
                  : 'N/A (< 1)'}
              </div>
              <div className="text-xs text-slate-500 mt-1">Mixed Number</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {res.decimal.toFixed(4)}
              </div>
              <div className="text-xs text-slate-500 mt-1">Decimal Form</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
