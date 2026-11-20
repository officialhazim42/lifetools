import React, { useState } from 'react';
import { Utensils, Plus, Trash2, ArrowRightLeft, Scale, RotateCcw } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

const DEFAULT_INGREDIENTS: Ingredient[] = [
  { id: '1', name: 'All-Purpose Flour', quantity: 2, unit: 'Cups' },
  { id: '2', name: 'Granulated Sugar', quantity: 1, unit: 'Cup' },
  { id: '3', name: 'Baking Powder', quantity: 2, unit: 'Teaspoons (tsp)' },
  { id: '4', name: 'Whole Milk', quantity: 250, unit: 'Milliliters (ml)' },
  { id: '5', name: 'Unsalted Butter', quantity: 100, unit: 'Grams (g)' }
];

export const RecipeMeasurementCalculator: React.FC = () => {
  const [baseServings, setBaseServings] = useState<number>(4);
  const [targetServings, setTargetServings] = useState<number>(8);
  const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS);

  // Quick unit converter state
  const [quickAmount, setQuickAmount] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('cup');

  const scaleFactor = baseServings > 0 ? targetServings / baseServings : 1;

  const handleUpdate = (id: string, field: 'name' | 'quantity' | 'unit', val: any) => {
    setIngredients(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const handleAdd = () => {
    setIngredients(prev => [
      ...prev,
      {
        id: 'ing_' + Date.now(),
        name: `Ingredient ${prev.length + 1}`,
        quantity: 1,
        unit: 'Cups'
      }
    ]);
  };

  const handleDelete = (id: string) => {
    if (ingredients.length <= 1) return;
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  // Unit conversion helpers
  const getUnitConversions = (qty: number, unit: string) => {
    let ml = 0;
    if (unit === 'cup') ml = qty * 236.588;
    else if (unit === 'tbsp') ml = qty * 14.7868;
    else if (unit === 'tsp') ml = qty * 4.92892;
    else if (unit === 'floz') ml = qty * 29.5735;
    else if (unit === 'ml') ml = qty;

    return {
      ml: ml.toFixed(1),
      cups: (ml / 236.588).toFixed(2),
      tbsp: (ml / 14.7868).toFixed(1),
      tsp: (ml / 4.92892).toFixed(1),
      floz: (ml / 29.5735).toFixed(2)
    };
  };

  const conv = getUnitConversions(quickAmount, fromUnit);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Utensils className="w-3.5 h-3.5" /> Everyday Life Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Recipe Portion Scaler & Kitchen Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Scale ingredients proportionally for family gatherings or dinner parties, and convert baking volumetric measurements.
        </p>
      </div>

      {/* Serving Scaler Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Original Recipe Servings
            </label>
            <input
              type="number"
              min={1}
              value={baseServings}
              onChange={e => setBaseServings(Math.max(1, Number(e.target.value)))}
              className="w-28 text-xl font-bold font-mono px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="text-slate-300 dark:text-slate-700 pt-5 text-xl font-black">➔</div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Desired Target Servings
            </label>
            <input
              type="number"
              min={1}
              value={targetServings}
              onChange={e => setTargetServings(Math.max(1, Number(e.target.value)))}
              className="w-28 text-xl font-bold font-mono px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>

        <div className="text-center sm:text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Scale Multiplier
          </span>
          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            ×{scaleFactor.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Scaled Recipe Ingredients ({ingredients.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Ingredient
            </button>
            <button
              onClick={() => setIngredients(DEFAULT_INGREDIENTS)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500">
              <tr>
                <th className="p-3">Ingredient</th>
                <th className="p-3">Original Qty</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Scaled Qty ({targetServings} Servings)</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ingredients.map(item => {
                const scaledQty = item.quantity * scaleFactor;
                const formatted = Number.isInteger(scaledQty)
                  ? String(scaledQty)
                  : scaledQty.toFixed(2).replace(/\.?0+$/, '');

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => handleUpdate(item.id, 'name', e.target.value)}
                        className="font-medium text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1 text-sm w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.1"
                        min={0}
                        value={item.quantity}
                        onChange={e => handleUpdate(item.id, 'quantity', Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.unit}
                        onChange={e => handleUpdate(item.id, 'unit', e.target.value)}
                        className="w-32 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </td>
                    <td className="p-3">
                      <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                        {formatted} {item.unit}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {ingredients.length > 1 && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Volumetric Kitchen Converter */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-500" /> Quick Volume Conversion Reference
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            step="0.25"
            min={0}
            value={quickAmount}
            onChange={e => setQuickAmount(Math.max(0, Number(e.target.value)))}
            className="w-24 px-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="cup">Cups (US)</option>
            <option value="tbsp">Tablespoons (tbsp)</option>
            <option value="tsp">Teaspoons (tsp)</option>
            <option value="floz">Fluid Ounces (fl oz)</option>
            <option value="ml">Milliliters (ml)</option>
          </select>
          <span className="text-xs text-slate-400">equals:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{conv.ml} ml</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Milliliters</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{conv.cups} cups</div>
            <div className="text-[10px] text-slate-400 mt-0.5">US Cups</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{conv.tbsp} tbsp</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tablespoons</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{conv.tsp} tsp</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Teaspoons</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white font-mono">{conv.floz} oz</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Fluid Ounces</div>
          </div>
        </div>
      </div>
    </div>
  );
};
