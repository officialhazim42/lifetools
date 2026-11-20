import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const RomanNumeralConverter: React.FC = () => {
  const { showToast } = useToast();
  const [numVal, setNumVal] = useState<number | ''>(2026);
  const [romanVal, setRomanVal] = useState<string>('MMXXVI');
  const [error, setError] = useState<string | null>(null);

  const romanMap: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  const toRoman = (num: number): string => {
    if (num <= 0 || num > 3999) return '';
    let result = '';
    for (const [val, sym] of romanMap) {
      while (num >= val) {
        result += sym;
        num -= val;
      }
    }
    return result;
  };

  const fromRoman = (str: string): number | null => {
    const s = str.trim().toUpperCase();
    if (!s) return null;
    const lookup: Record<string, number> = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };

    let total = 0;
    for (let i = 0; i < s.length; i++) {
      const current = lookup[s[i]];
      const next = lookup[s[i + 1]];
      if (!current) return null; // invalid character
      if (next && current < next) {
        total += next - current;
        i++;
      } else {
        total += current;
      }
    }

    // Verify reverse
    if (toRoman(total) !== s) {
      return null; // Not valid Roman numeral format
    }
    return total;
  };

  const handleNumChange = (val: string) => {
    setError(null);
    if (!val) {
      setNumVal('');
      setRomanVal('');
      return;
    }
    const n = Number(val);
    if (n < 1 || n > 3999) {
      setError('Standard Roman numerals support integers between 1 and 3999.');
      setNumVal(n);
      setRomanVal('');
    } else {
      setNumVal(n);
      setRomanVal(toRoman(n));
    }
  };

  const handleRomanChange = (val: string) => {
    setError(null);
    const upper = val.toUpperCase();
    setRomanVal(upper);
    if (!upper.trim()) {
      setNumVal('');
      return;
    }
    const parsed = fromRoman(upper);
    if (parsed !== null) {
      setNumVal(parsed);
    } else {
      setError('Invalid Roman numeral sequence (e.g. valid: XIV, CMXCIX, MMXXVI).');
      setNumVal('');
    }
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Decimal Integer input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Integer Number (1 – 3999)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="3999"
                value={numVal}
                onChange={(e) => handleNumChange(e.target.value)}
                className="input-base text-lg font-semibold pr-10"
                placeholder="2026"
              />
              {numVal && (
                <button
                  onClick={() => handleCopy(String(numVal))}
                  className="absolute right-2 top-2.5 p-1 text-slate-400 hover:text-emerald-500"
                  title="Copy Integer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Roman Numeral input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Roman Numeral
            </label>
            <div className="relative">
              <input
                type="text"
                value={romanVal}
                onChange={(e) => handleRomanChange(e.target.value)}
                className="input-base text-lg font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 pr-10"
                placeholder="MMXXVI"
              />
              {romanVal && (
                <button
                  onClick={() => handleCopy(romanVal)}
                  className="absolute right-2 top-2.5 p-1 text-slate-400 hover:text-emerald-500"
                  title="Copy Roman Numeral"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Roman Reference Guide */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
            Roman Symbol Values
          </h4>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {romanMap
              .filter(([_, s]) => s.length === 1)
              .map(([val, sym]) => (
                <div
                  key={sym}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                    {sym}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{val}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
