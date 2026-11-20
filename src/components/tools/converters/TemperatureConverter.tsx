import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, ArrowRightLeft } from 'lucide-react';

type TempUnit = 'C' | 'F' | 'K' | 'R';

export const TemperatureConverter: React.FC = () => {
  const { showToast } = useToast();
  const [fromUnit, setFromUnit] = useState<TempUnit>('C');
  const [toUnit, setToUnit] = useState<TempUnit>('F');
  const [inputValue, setInputValue] = useState<number | ''>(25);

  const toCelsius = (val: number, unit: TempUnit): number => {
    switch (unit) {
      case 'C': return val;
      case 'F': return ((val - 32) * 5) / 9;
      case 'K': return val - 273.15;
      case 'R': return ((val - 491.67) * 5) / 9;
    }
  };

  const fromCelsius = (c: number, unit: TempUnit): number => {
    switch (unit) {
      case 'C': return c;
      case 'F': return (c * 9) / 5 + 32;
      case 'K': return c + 273.15;
      case 'R': return ((c + 273.15) * 9) / 5;
    }
  };

  const val = inputValue === '' ? 0 : Number(inputValue);
  const c = toCelsius(val, fromUnit);
  const converted = fromCelsius(c, toUnit);

  const unitsList: { id: TempUnit; name: string; symbol: string }[] = [
    { id: 'C', name: 'Celsius', symbol: '°C' },
    { id: 'F', name: 'Fahrenheit', symbol: '°F' },
    { id: 'K', name: 'Kelvin', symbol: 'K' },
    { id: 'R', name: 'Rankine', symbol: '°R' },
  ];

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleCopy = (str: string) => {
    copyToClipboard(str);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              From
            </label>
            <input
              type="number"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base text-lg font-semibold"
              placeholder="25"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as TempUnit)}
              className="input-base text-sm font-medium"
            >
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center md:col-span-1 pt-4">
            <button
              onClick={handleSwap}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:text-emerald-500 transition-colors shadow-sm"
              title="Swap"
              aria-label="Swap units"
            >
              <ArrowRightLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={Number(converted.toFixed(4)).toString()}
                className="input-base text-lg font-bold bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400 pr-10"
              />
              <button
                onClick={() =>
                  handleCopy(
                    `${Number(converted.toFixed(4)).toString()} ${
                      unitsList.find((u) => u.id === toUnit)?.symbol
                    }`
                  )
                }
                className="absolute right-2 top-2.5 p-1 text-slate-400 hover:text-emerald-500"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value as TempUnit)}
              className="input-base text-sm font-medium"
            >
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
          All Scales ({val} {unitsList.find((u) => u.id === fromUnit)?.symbol})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {unitsList.map((u) => {
            const tempVal = fromCelsius(c, u.id);
            const str = `${Number(tempVal.toFixed(2)).toString()} ${u.symbol}`;
            return (
              <div
                key={u.id}
                onClick={() => handleCopy(str)}
                className={`p-3.5 rounded-xl border cursor-pointer hover:border-emerald-500 transition-all ${
                  u.id === toUnit
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-850/60 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="text-xs text-slate-500">{u.name}</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{str}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
