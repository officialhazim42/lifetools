import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RefreshCw, ShieldCheck } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [length, setLength] = useState<number>(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');

  const generate = () => {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      upper = upper.replace(/[OI]/g, '');
      lower = lower.replace(/[ol]/g, '');
      numbers = numbers.replace(/[01]/g, '');
      symbols = symbols.replace(/[|]/g, '');
    }

    let charPool = '';
    const guaranteed: string[] = [];

    if (includeUpper) {
      charPool += upper;
      guaranteed.push(upper[Math.floor(Math.random() * upper.length)]);
    }
    if (includeLower) {
      charPool += lower;
      guaranteed.push(lower[Math.floor(Math.random() * lower.length)]);
    }
    if (includeNumbers) {
      charPool += numbers;
      guaranteed.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    if (includeSymbols) {
      charPool += symbols;
      guaranteed.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    if (!charPool) {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    const passChars: string[] = [...guaranteed];
    for (let i = guaranteed.length; i < length; i++) {
      passChars.push(charPool[randomValues[i] % charPool.length]);
    }

    // Shuffle
    for (let i = passChars.length - 1; i > 0; i--) {
      const j = randomValues[i] % (i + 1);
      const temp = passChars[i];
      passChars[i] = passChars[j];
      passChars[j] = temp;
    }

    setPassword(passChars.join(''));
  };

  useEffect(() => {
    generate();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Entropy calculation
  const getPoolSize = () => {
    let size = 0;
    if (includeUpper) size += excludeAmbiguous ? 24 : 26;
    if (includeLower) size += excludeAmbiguous ? 24 : 26;
    if (includeNumbers) size += excludeAmbiguous ? 8 : 10;
    if (includeSymbols) size += excludeAmbiguous ? 25 : 26;
    return size;
  };

  const poolSize = getPoolSize();
  const entropyBits = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-rose-500';
  if (entropyBits >= 80) {
    strengthLabel = 'Very Strong (Crypto-Grade)';
    strengthColor = 'bg-emerald-500';
  } else if (entropyBits >= 60) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-emerald-400';
  } else if (entropyBits >= 40) {
    strengthLabel = 'Moderate';
    strengthColor = 'bg-amber-400';
  } else if (entropyBits >= 25) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-orange-500';
  }

  const handleCopy = () => {
    if (!password) return;
    copyToClipboard(password);
    showToast('Secure password copied!');
  };

  return (
    <div className="space-y-6">
      {/* Generated Password Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Generated Password</span>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Entropy: <strong className="text-emerald-500">{entropyBits} bits</strong> ({strengthLabel})
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            readOnly
            value={password}
            className="input-base font-mono text-lg font-bold pr-24 text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-850"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1">
            <button
              onClick={generate}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Regenerate"
              aria-label="Regenerate password"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
              title="Copy Password"
              aria-label="Copy password"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColor} transition-all duration-300`}
            style={{ width: `${Math.min(100, (entropyBits / 90) * 100)}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
            <span>Password Length</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{length} characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Uppercase Letters (A-Z)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Lowercase Letters (a-z)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Numbers (0-9)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Symbols (!@#$%^&*)
          </label>
          <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 sm:col-span-2">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Exclude Ambiguous Characters (0, O, l, 1, I)
          </label>
        </div>
      </div>
    </div>
  );
};
