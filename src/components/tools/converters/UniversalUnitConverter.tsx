import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, ArrowRightLeft, RotateCcw } from 'lucide-react';

export interface UnitDef {
  id: string;
  name: string;
  symbol: string;
  // Factor to base unit (e.g. for length base is meter: km is 1000, cm is 0.01)
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

interface UniversalUnitConverterProps {
  title: string;
  baseUnitId: string;
  units: UnitDef[];
  defaultFromUnit: string;
  defaultToUnit: string;
  defaultVal?: number;
}

export const UniversalUnitConverter: React.FC<UniversalUnitConverterProps> = ({
  units,
  defaultFromUnit,
  defaultToUnit,
  defaultVal = 1
}) => {
  const { showToast } = useToast();
  const [fromUnitId, setFromUnitId] = useState(defaultFromUnit);
  const [toUnitId, setToUnitId] = useState(defaultToUnit);
  const [inputValue, setInputValue] = useState<number | ''>(defaultVal);

  const fromUnit = units.find((u) => u.id === fromUnitId) || units[0];
  const toUnit = units.find((u) => u.id === toUnitId) || units[1];

  const val = inputValue === '' ? 0 : Number(inputValue);
  const baseValue = fromUnit.toBase(val);
  const convertedValue = toUnit.fromBase(baseValue);

  const swapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleCopy = (strToCopy: string) => {
    copyToClipboard(strToCopy);
    showToast('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Primary Converter Box */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From Column */}
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
              placeholder="Enter value"
            />
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="input-base text-sm font-medium"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1 pt-4">
            <button
              onClick={swapUnits}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-500 transition-colors shadow-sm"
              title="Swap Units"
              aria-label="Swap Units"
            >
              <ArrowRightLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>

          {/* To Column */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={
                  isNaN(convertedValue)
                    ? '0'
                    : Number(convertedValue.toFixed(8)).toString()
                }
                className="input-base text-lg font-bold bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400 pr-10"
              />
              <button
                onClick={() =>
                  handleCopy(
                    `${Number(convertedValue.toFixed(8)).toString()} ${toUnit.symbol}`
                  )
                }
                className="absolute right-2 top-2.5 p-1 text-slate-400 hover:text-emerald-500 rounded"
                title="Copy converted value"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="input-base text-sm font-medium"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complete All-Units Comparison Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            All Equivalent Units ({inputValue || 0} {fromUnit.symbol})
          </h3>
          <span className="text-xs text-slate-400">Live Converted</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {units.map((u) => {
            const uVal = u.fromBase(baseValue);
            const formatted = isNaN(uVal)
              ? '0'
              : Math.abs(uVal) < 0.0001 || Math.abs(uVal) > 1000000
              ? uVal.toExponential(4)
              : Number(uVal.toFixed(6)).toString();

            return (
              <div
                key={u.id}
                onClick={() => handleCopy(`${formatted} ${u.symbol}`)}
                className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-emerald-500/60 group ${
                  u.id === toUnitId
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-850/50 border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{u.name}</span>
                  <span className="font-mono font-bold text-slate-400 group-hover:text-emerald-500">
                    {u.symbol}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate pr-2">
                    {formatted}
                  </span>
                  <Copy className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
