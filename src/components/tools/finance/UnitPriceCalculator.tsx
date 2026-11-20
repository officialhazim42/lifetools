import React, { useState } from 'react';
import { formatNumber } from '../../../utils/formatters';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CURRENCY_KEY = 'lifetools_pref_currency';

export const UnitPriceCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));

  // Package A
  const [priceA, setPriceA] = useState<number>(240);
  const [qtyA, setQtyA] = useState<number>(750);
  const [unitA, setUnitA] = useState<'g' | 'kg' | 'ml' | 'l' | 'pcs'>('g');

  // Package B
  const [priceB, setPriceB] = useState<number>(350);
  const [qtyB, setQtyB] = useState<number>(1.2);
  const [unitB, setUnitB] = useState<'g' | 'kg' | 'ml' | 'l' | 'pcs'>('kg');

  const normalizeToStandard = (qty: number, unit: string) => {
    switch (unit) {
      case 'g': return qty / 1000; // to kg
      case 'kg': return qty;
      case 'ml': return qty / 1000; // to liters
      case 'l': return qty;
      case 'pcs': return qty;
      default: return qty;
    }
  };

  const stdQtyA = normalizeToStandard(qtyA, unitA);
  const stdQtyB = normalizeToStandard(qtyB, unitB);

  const costPerStandardA = stdQtyA > 0 ? priceA / stdQtyA : 0;
  const costPerStandardB = stdQtyB > 0 ? priceB / stdQtyB : 0;

  const standardUnitLabel = unitA === 'g' || unitA === 'kg' ? 'kg' : unitA === 'ml' || unitA === 'l' ? 'liter' : 'piece';

  const diff = Math.abs(costPerStandardA - costPerStandardB);
  const percentSaved =
    Math.max(costPerStandardA, costPerStandardB) > 0
      ? Math.round((diff / Math.max(costPerStandardA, costPerStandardB)) * 100)
      : 0;

  const isAWinner = costPerStandardA < costPerStandardB;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-500" /> Unit Price Comparison
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Compare two different package sizes (e.g. 750g vs 1.2kg) and find out exactly how much you save per standard unit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Package A */}
        <div className={`p-6 rounded-2xl border transition-all space-y-4 ${
          isAWinner
            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-subtle'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Package A</h3>
            {isAWinner && (
              <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                Better Deal
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Total Price ({currency})</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={priceA}
                onChange={(e) => setPriceA(parseFloat(e.target.value) || 0)}
                className="input-base text-xs font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Quantity</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={qtyA}
                  onChange={(e) => setQtyA(parseFloat(e.target.value) || 1)}
                  className="input-base text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Unit</label>
                <select
                  value={unitA}
                  onChange={(e) => setUnitA(e.target.value as any)}
                  className="input-base text-xs"
                >
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (l)</option>
                  <option value="pcs">Pieces (pcs)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center space-y-1">
              <span className="text-[11px] text-slate-500">Effective Cost per {standardUnitLabel}:</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {currency} {formatNumber(costPerStandardA, 2)}
              </div>
            </div>
          </div>
        </div>

        {/* Package B */}
        <div className={`p-6 rounded-2xl border transition-all space-y-4 ${
          !isAWinner
            ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-subtle'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Package B</h3>
            {!isAWinner && (
              <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                Better Deal
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Total Price ({currency})</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={priceB}
                onChange={(e) => setPriceB(parseFloat(e.target.value) || 0)}
                className="input-base text-xs font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Quantity</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={qtyB}
                  onChange={(e) => setQtyB(parseFloat(e.target.value) || 1)}
                  className="input-base text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Unit</label>
                <select
                  value={unitB}
                  onChange={(e) => setUnitB(e.target.value as any)}
                  className="input-base text-xs"
                >
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (l)</option>
                  <option value="pcs">Pieces (pcs)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center space-y-1">
              <span className="text-[11px] text-slate-500">Effective Cost per {standardUnitLabel}:</span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {currency} {formatNumber(costPerStandardB, 2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Verdict */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-center space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Recommendation
        </div>
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {isAWinner ? 'Package A' : 'Package B'} is {percentSaved}% cheaper per {standardUnitLabel}!
        </div>
        <p className="text-xs text-slate-400">
          You save {currency} {formatNumber(diff, 2)} for every {standardUnitLabel} purchased.
        </p>
      </div>
    </div>
  );
};
