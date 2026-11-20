import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, ChefHat } from 'lucide-react';

interface Ingredient {
  name: string;
  density: number; // grams per mL (water is 1.0)
}

const ingredients: Ingredient[] = [
  { name: 'Water / Pure Liquid', density: 1.0 },
  { name: 'All-Purpose Flour', density: 0.528 }, // 1 cup ~ 125g
  { name: 'Granulated Sugar', density: 0.845 }, // 1 cup ~ 200g
  { name: 'Brown Sugar (Packed)', density: 0.93 }, // 1 cup ~ 220g
  { name: 'Butter', density: 0.958 }, // 1 cup ~ 227g
  { name: 'Milk (Whole)', density: 1.03 }, // 1 cup ~ 244g
  { name: 'Cocoa Powder', density: 0.423 }, // 1 cup ~ 100g
  { name: 'White Rice (Uncooked)', density: 0.782 }, // 1 cup ~ 185g
  { name: 'Honey / Maple Syrup', density: 1.42 },
];

export const CookingMeasurementConverter: React.FC = () => {
  const { showToast } = useToast();
  const [selectedIngredient, setSelectedIngredient] = useState<string>('All-Purpose Flour');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [fromUnit, setFromUnit] = useState<string>('cup');

  const ingredient =
    ingredients.find((i) => i.name === selectedIngredient) || ingredients[0];

  // Convert input to milliliters first
  const toMilliliters = (qty: number, unit: string, density: number): number => {
    switch (unit) {
      case 'cup': return qty * 236.588;
      case 'tbsp': return qty * 14.7868;
      case 'tsp': return qty * 4.92892;
      case 'ml': return qty;
      case 'floz': return qty * 29.5735;
      case 'g': return qty / density;
      case 'oz': return (qty * 28.3495) / density;
      default: return qty;
    }
  };

  const qty = quantity === '' ? 0 : Number(quantity);
  const ml = toMilliliters(qty, fromUnit, ingredient.density);

  // Results in various units
  const results = [
    { label: 'Grams', symbol: 'g', val: ml * ingredient.density },
    { label: 'Cups (US)', symbol: 'cups', val: ml / 236.588 },
    { label: 'Tablespoons', symbol: 'tbsp', val: ml / 14.7868 },
    { label: 'Teaspoons', symbol: 'tsp', val: ml / 4.92892 },
    { label: 'Milliliters', symbol: 'mL', val: ml },
    { label: 'Fluid Ounces', symbol: 'fl oz', val: ml / 29.5735 },
    { label: 'Ounces (Weight)', symbol: 'oz', val: (ml * ingredient.density) / 28.3495 },
  ];

  const handleCopy = (str: string) => {
    copyToClipboard(str);
    showToast('Measurement copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Ingredient
          </label>
          <select
            value={selectedIngredient}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            className="input-base"
          >
            {ingredients.map((ing) => (
              <option key={ing.name} value={ing.name}>
                {ing.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Quantity
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Unit
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="input-base"
          >
            <option value="cup">Cups (US)</option>
            <option value="tbsp">Tablespoons (tbsp)</option>
            <option value="tsp">Teaspoons (tsp)</option>
            <option value="ml">Milliliters (mL)</option>
            <option value="floz">Fluid Ounces (fl oz)</option>
            <option value="g">Grams (g)</option>
            <option value="oz">Ounces (oz weight)</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ChefHat className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Recipe Conversions for {ingredient.name}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {results.map((r) => {
            const num = isNaN(r.val) ? 0 : r.val;
            const strVal = Number(num.toFixed(2)).toString();
            return (
              <div
                key={r.symbol}
                onClick={() => handleCopy(`${strVal} ${r.symbol}`)}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all group"
              >
                <div className="text-xs text-slate-500">{r.label}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {strVal} <span className="text-xs font-normal text-slate-400">{r.symbol}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
