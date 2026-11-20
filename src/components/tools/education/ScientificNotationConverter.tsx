import React, { useState } from 'react';
import { GraduationCap, Copy, Check, Calculator, Info } from 'lucide-react';

const SI_PREFIXES: { exp: number; prefix: string; symbol: string }[] = [
  { exp: 24, prefix: 'yotta', symbol: 'Y' },
  { exp: 21, prefix: 'zetta', symbol: 'Z' },
  { exp: 18, prefix: 'exa', symbol: 'E' },
  { exp: 15, prefix: 'peta', symbol: 'P' },
  { exp: 12, prefix: 'tera', symbol: 'T' },
  { exp: 9, prefix: 'giga', symbol: 'G' },
  { exp: 6, prefix: 'mega', symbol: 'M' },
  { exp: 3, prefix: 'kilo', symbol: 'k' },
  { exp: 0, prefix: '', symbol: '' },
  { exp: -3, prefix: 'milli', symbol: 'm' },
  { exp: -6, prefix: 'micro', symbol: 'µ' },
  { exp: -9, prefix: 'nano', symbol: 'n' },
  { exp: -12, prefix: 'pico', symbol: 'p' },
  { exp: -15, prefix: 'femto', symbol: 'f' },
  { exp: -18, prefix: 'atto', symbol: 'a' }
];

export const ScientificNotationConverter: React.FC = () => {
  const [inputStr, setInputStr] = useState<string>('299792458');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const num = parseFloat(inputStr);
  const isValid = !isNaN(num) && isFinite(num) && num !== 0;

  // Scientific Notation: a * 10^b where 1 <= |a| < 10
  const getScientific = () => {
    if (!isValid) return { coef: '0', exp: 0, formatted: '0' };
    const exp = Math.floor(Math.log10(Math.abs(num)));
    const coef = num / Math.pow(10, exp);
    return {
      coef: coef.toFixed(6).replace(/\.?0+$/, ''),
      exp,
      formatted: `${coef.toFixed(6).replace(/\.?0+$/, '')} × 10^${exp}`
    };
  };

  // Engineering Notation: a * 10^b where b is multiple of 3
  const getEngineering = () => {
    if (!isValid) return { coef: '0', exp: 0, formatted: '0' };
    const expFloor = Math.floor(Math.log10(Math.abs(num)));
    const engExp = Math.floor(expFloor / 3) * 3;
    const coef = num / Math.pow(10, engExp);
    return {
      coef: coef.toFixed(4).replace(/\.?0+$/, ''),
      exp: engExp,
      formatted: `${coef.toFixed(4).replace(/\.?0+$/, '')} × 10^${engExp}`
    };
  };

  // SI Prefix Form
  const getSiPrefix = () => {
    if (!isValid) return '0';
    const eng = getEngineering();
    const match = SI_PREFIXES.find(p => p.exp === eng.exp);
    if (match && match.symbol) {
      return `${eng.coef} ${match.symbol} (${match.prefix})`;
    }
    return `${eng.formatted}`;
  };

  const sci = getScientific();
  const eng = getEngineering();
  const si = getSiPrefix();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Scientific Notation Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Convert standard decimal numbers to scientific notation ($a \times 10^b$), engineering notation, and SI metric prefixes.
        </p>
      </div>

      {/* Input Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Enter Decimal, Scientific, or E-Notation Number
          </label>
          <input
            type="text"
            value={inputStr}
            onChange={e => setInputStr(e.target.value)}
            placeholder="e.g. 299792458 or 0.000045 or 6.022e23"
            className="w-full text-2xl font-bold font-mono px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs text-slate-500">Physics Presets:</span>
          {[
            { label: 'Speed of Light (c)', val: '299792458' },
            { label: "Avogadro's Number (NA)", val: '6.02214076e23' },
            { label: "Planck's Constant (h)", val: '6.62607015e-34' },
            { label: 'Electron Charge (e)', val: '1.602176634e-19' }
          ].map(p => (
            <button
              key={p.label}
              onClick={() => setInputStr(p.val)}
              className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg transition-colors font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Scientific Notation */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Scientific Notation
              </span>
              <button
                onClick={() => handleCopy(sci.formatted, 'sci')}
                className="p-1 text-slate-400 hover:text-cyan-500 rounded transition-colors"
              >
                {copiedKey === 'sci' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white my-2">
              {isValid ? (
                <>
                  {sci.coef} × 10<sup>{sci.exp}</sup>
                </>
              ) : (
                '--'
              )}
            </div>
          </div>
          <span className="text-xs text-slate-400 mt-2">Coefficient between 1 and 10</span>
        </div>

        {/* Engineering Notation */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Engineering Notation
              </span>
              <button
                onClick={() => handleCopy(eng.formatted, 'eng')}
                className="p-1 text-slate-400 hover:text-cyan-500 rounded transition-colors"
              >
                {copiedKey === 'eng' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white my-2">
              {isValid ? (
                <>
                  {eng.coef} × 10<sup>{eng.exp}</sup>
                </>
              ) : (
                '--'
              )}
            </div>
          </div>
          <span className="text-xs text-slate-400 mt-2">Exponent multiple of 3 (10³ⁿ)</span>
        </div>

        {/* SI Metric Prefix */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                SI Metric Prefix
              </span>
              <button
                onClick={() => handleCopy(si, 'si')}
                className="p-1 text-slate-400 hover:text-emerald-500 rounded transition-colors"
              >
                {copiedKey === 'si' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white my-2">
              {isValid ? si : '--'}
            </div>
          </div>
          <span className="text-xs text-slate-400 mt-2">Standard international metric symbol</span>
        </div>
      </div>
    </div>
  );
};
