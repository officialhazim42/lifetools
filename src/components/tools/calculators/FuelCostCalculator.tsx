import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const FuelCostCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [distance, setDistance] = useState<number | ''>(350);
  const [efficiency, setEfficiency] = useState<number | ''>(12); // km per liter
  const [fuelPrice, setFuelPrice] = useState<number | ''>(1.5); // price per liter
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');

  const calculate = () => {
    const dist = Number(distance) || 0;
    const eff = Number(efficiency) || 0;
    const price = Number(fuelPrice) || 0;

    if (dist <= 0 || eff <= 0 || price <= 0) return null;

    let totalFuel = 0;
    if (unitSystem === 'metric') {
      // distance in km, eff in km/L
      totalFuel = dist / eff;
    } else {
      // distance in miles, eff in MPG
      totalFuel = dist / eff;
    }

    const totalCost = totalFuel * price;
    const costPerDistance = dist > 0 ? totalCost / dist : 0;

    return {
      totalFuel,
      totalCost,
      costPerDistance,
      unitSystem
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    const volUnit = res.unitSystem === 'metric' ? 'L' : 'gal';
    const distUnit = res.unitSystem === 'metric' ? 'km' : 'mi';
    copyToClipboard(
      `Trip Cost: $${res.totalCost.toFixed(2)}, Fuel Needed: ${res.totalFuel.toFixed(1)} ${volUnit}, Cost/${distUnit}: $${res.costPerDistance.toFixed(3)}`
    );
    showToast('Fuel calculation copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setUnitSystem('metric')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            unitSystem === 'metric'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Metric (km, L)
        </button>
        <button
          onClick={() => setUnitSystem('imperial')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            unitSystem === 'imperial'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Imperial (miles, gal)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Trip Distance ({unitSystem === 'metric' ? 'Kilometers' : 'Miles'})
          </label>
          <input
            type="number"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="350"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Fuel Efficiency ({unitSystem === 'metric' ? 'km / Liter' : 'MPG'})
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="12"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Fuel Price ($ / {unitSystem === 'metric' ? 'Liter' : 'Gallon'})
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="1.50"
          />
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Trip Fuel Estimate</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {res.totalFuel.toFixed(2)} {res.unitSystem === 'metric' ? 'L' : 'gal'}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Total Fuel Required</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${res.totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Estimated Fuel Cost</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ${res.costPerDistance.toFixed(3)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                Cost per {res.unitSystem === 'metric' ? 'km' : 'mile'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
