import React, { useState } from 'react';
import { formatNumber } from '../../../utils/formatters';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Scale,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Trophy
} from 'lucide-react';

interface ProductOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const CURRENCY_KEY = 'lifetools_pref_currency';

export const PriceComparisonCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));

  const [options, setOptions] = useState<ProductOption[]>([
    { id: 'opt_1', name: 'Option A (Small Pack)', price: 180, quantity: 500, unit: 'g' },
    { id: 'opt_2', name: 'Option B (Value Pack)', price: 320, quantity: 1000, unit: 'g' },
    { id: 'opt_3', name: 'Option C (Bulk Pack)', price: 590, quantity: 2000, unit: 'g' }
  ]);

  const handleUpdate = (id: string, field: keyof ProductOption, value: any) => {
    setOptions(prev =>
      prev.map(opt => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const handleAddOption = () => {
    if (options.length >= 6) {
      showToast('Maximum 6 options can be compared at once', 'info');
      return;
    }
    const idx = options.length + 1;
    const newOpt: ProductOption = {
      id: 'opt_' + Date.now(),
      name: `Option ${String.fromCharCode(65 + options.length)}`,
      price: 100,
      quantity: 500,
      unit: options[0]?.unit || 'g'
    };
    setOptions(prev => [...prev, newOpt]);
  };

  const handleRemove = (id: string) => {
    if (options.length <= 2) {
      showToast('Need at least 2 options to compare', 'warning');
      return;
    }
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  // Compute unit prices
  const computed = options.map(opt => {
    const unitPrice = opt.quantity > 0 ? opt.price / opt.quantity : 0;
    return {
      ...opt,
      unitPrice
    };
  });

  // Find lowest unit price
  const valid = computed.filter(c => c.unitPrice > 0);
  const lowestUnitPrice = valid.length > 0 ? Math.min(...valid.map(v => v.unitPrice)) : 0;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-500" /> Price Comparison Calculator
          </h2>
          <p className="text-xs text-slate-500">
            Compare package sizes, bulk discounts, and find the true lowest cost per unit.
          </p>
        </div>

        <button onClick={handleAddOption} className="btn-primary text-xs py-2 px-3">
          + Add Product Option
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {computed.map(opt => {
          const isBestDeal = opt.unitPrice === lowestUnitPrice && opt.unitPrice > 0;
          const percentMoreExpensive =
            lowestUnitPrice > 0 && !isBestDeal
              ? Math.round(((opt.unitPrice - lowestUnitPrice) / lowestUnitPrice) * 100)
              : 0;

          return (
            <div
              key={opt.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isBestDeal
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-subtle'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={opt.name}
                    onChange={(e) => handleUpdate(opt.id, 'name', e.target.value)}
                    className="font-bold text-sm text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none w-full"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemove(opt.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs p-1"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Price ({currency})</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={opt.price}
                      onChange={(e) => handleUpdate(opt.id, 'price', parseFloat(e.target.value) || 0)}
                      className="input-base text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Quantity ({opt.unit})</label>
                    <input
                      type="number"
                      min="1"
                      value={opt.quantity}
                      onChange={(e) => handleUpdate(opt.id, 'quantity', parseFloat(e.target.value) || 1)}
                      className="input-base text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Calculated Unit Price */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 text-center space-y-1">
                  <div className="text-[11px] text-slate-500">Unit Cost ({currency}/{opt.unit})</div>
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {currency} {opt.unitPrice.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-center pt-2">
                {isBestDeal ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
                    <Trophy className="w-3.5 h-3.5" /> BEST VALUE DEAL
                  </span>
                ) : (
                  <span className="text-xs text-rose-500 font-semibold">
                    +{percentMoreExpensive}% more expensive
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
