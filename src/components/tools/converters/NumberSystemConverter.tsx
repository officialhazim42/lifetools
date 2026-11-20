import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const NumberSystemConverter: React.FC = () => {
  const { showToast } = useToast();
  const [decimalVal, setDecimalVal] = useState<string>('255');
  const [error, setError] = useState<string | null>(null);

  const parseToBigInt = (val: string, radix: number): bigint | null => {
    try {
      if (!val.trim()) return null;
      let clean = val.trim().toLowerCase();
      // Test characters valid for radix
      const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
      const valid = digits.slice(0, radix);
      for (const char of clean) {
        if (!valid.includes(char)) return null;
      }

      // Convert via BigInt
      if (radix === 10) return BigInt(clean);
      if (radix === 16) return BigInt('0x' + clean);
      if (radix === 2) return BigInt('0b' + clean);
      if (radix === 8) return BigInt('0o' + clean);

      // Custom radix up to 36
      let result = BigInt(0);
      const bRadix = BigInt(radix);
      for (let i = 0; i < clean.length; i++) {
        const digitVal = BigInt(valid.indexOf(clean[i]));
        result = result * bRadix + digitVal;
      }
      return result;
    } catch {
      return null;
    }
  };

  const handleUpdate = (val: string, radix: number) => {
    setError(null);
    if (!val.trim()) {
      setDecimalVal('');
      return;
    }
    const parsed = parseToBigInt(val, radix);
    if (parsed !== null) {
      setDecimalVal(parsed.toString(10));
    } else {
      setError(`Invalid characters for Base-${radix}`);
    }
  };

  const currentBigInt = decimalVal.trim() ? parseToBigInt(decimalVal, 10) : null;

  const bases = [
    { label: 'Decimal (Base 10)', radix: 10, prefix: '' },
    { label: 'Binary (Base 2)', radix: 2, prefix: '0b' },
    { label: 'Hexadecimal (Base 16)', radix: 16, prefix: '0x' },
    { label: 'Octal (Base 8)', radix: 8, prefix: '0o' },
    { label: 'Base 36 (Alphanumeric)', radix: 36, prefix: '' },
  ];

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Interactive Radix Conversion
        </h3>
        <p className="text-xs text-slate-500">
          Edit any field below to update all other numerical representations in real-time. Supports arbitrary precision big integers.
        </p>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="space-y-3 pt-2">
          {bases.map((b) => {
            let strVal = '';
            if (currentBigInt !== null) {
              strVal = currentBigInt.toString(b.radix).toUpperCase();
            }

            return (
              <div key={b.radix} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{b.label}</span>
                  {strVal && (
                    <button
                      onClick={() => handleCopy(strVal)}
                      className="text-slate-400 hover:text-emerald-500 flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={strVal}
                    onChange={(e) => handleUpdate(e.target.value, b.radix)}
                    className="input-base font-mono uppercase text-sm pr-12"
                    placeholder={`Enter Base ${b.radix}`}
                  />
                  {b.prefix && (
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">
                      {b.prefix}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
