import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export const SecurePinGenerator: React.FC = () => {
  const [pinLength, setPinLength] = useState<number>(6);
  const [avoidSequential, setAvoidSequential] = useState<boolean>(true);
  const [pinsCount, setPinsCount] = useState<number>(5);
  const [generatedPins, setGeneratedPins] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isWeak = (pin: string) => {
    // Check all identical: '0000', '1111'
    if (/^(\d)\1+$/.test(pin)) return true;

    // Check ascending sequential: '1234', '2345'
    const asc = '0123456789';
    const desc = '9876543210';
    if (asc.includes(pin) || desc.includes(pin)) return true;

    // Common phone keypad vertical patterns
    const commonBad = ['2580', '0852', '1212', '1313', '1004', '2000'];
    if (commonBad.includes(pin)) return true;

    return false;
  };

  const generateSinglePin = (length: number, avoidWeak: boolean): string => {
    let attempts = 0;
    while (attempts < 50) {
      const buffer = new Uint8Array(length);
      crypto.getRandomValues(buffer);
      const digits = Array.from(buffer).map(b => b % 10).join('');

      if (!avoidWeak || !isWeak(digits)) {
        return digits;
      }
      attempts++;
    }
    // Fallback
    const buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);
    return Array.from(buffer).map(b => b % 10).join('');
  };

  const generateAllPins = () => {
    const list: string[] = [];
    for (let i = 0; i < pinsCount; i++) {
      list.push(generateSinglePin(pinLength, avoidSequential));
    }
    setGeneratedPins(list);
  };

  useEffect(() => {
    generateAllPins();
  }, [pinLength, avoidSequential, pinsCount]);

  const handleCopy = (pin: string, index: number) => {
    navigator.clipboard.writeText(pin);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <KeyRound className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Secure PIN Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Generate high-entropy 4-digit, 6-digit, and custom numerical PINs with automatic weak-pattern filtering.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { label: '4-Digit PIN (ATM / Debit)', len: 4 },
          { label: '6-Digit PIN (UPI / 2FA / SIM)', len: 6 },
          { label: '8-Digit PIN (High Security)', len: 8 },
          { label: '10-Digit Master Code', len: 10 }
        ].map(preset => (
          <button
            key={preset.len}
            onClick={() => setPinLength(preset.len)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border ${
              pinLength === preset.len
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Generated PIN Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Cryptographic Numeric PINs ({pinLength} Digits)</span>
          <button
            onClick={generateAllPins}
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {generatedPins.map((pin, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-emerald-500/40 transition-colors"
            >
              <span className="text-2xl font-bold font-mono tracking-widest text-slate-900 dark:text-white">
                {pin}
              </span>
              <button
                onClick={() => handleCopy(pin, idx)}
                className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title="Copy PIN"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Generation Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              PIN Length ({pinLength} Digits)
            </label>
            <input
              type="range"
              min={3}
              max={16}
              value={pinLength}
              onChange={e => setPinLength(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Batch Quantity
            </label>
            <select
              value={pinsCount}
              onChange={e => setPinsCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>1 PIN</option>
              <option value={3}>3 PINs</option>
              <option value={5}>5 PINs</option>
              <option value={10}>10 PINs</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={avoidSequential}
                onChange={e => setAvoidSequential(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
              <span>Reject sequential/repetitive PINs (e.g. 1234, 0000, 2580)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
