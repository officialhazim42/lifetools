import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  Flame,
  Sun,
  Wifi,
  DollarSign,
  Users,
  Maximize2,
  Box,
  Paintbrush,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import {
  calculateTieredElectricityBill,
  calculateApplianceEnergyCost,
  calculateHouseholdWaterAudit,
  calculateWaterBill,
  calculateLpgConsumption,
  calculateSolarSizing,
  calculateSolarRoi,
  calculateBroadbandRequirement,
  calculateRoomDimensions,
  calculatePaintCoverage,
  calculateWallpaper,
  calculateRentSplit,
  ApplianceCostInput,
  RoommateRoomInput
} from '../../../utils/household/homeCalculators';
import { UtilityTariffSlab } from '../../../types/household';

// Copy hook helper
function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// 1. Home Electricity Bill Estimator
export const HomeElectricityBillEstimator: React.FC = () => {
  const [unitsKwh, setUnitsKwh] = useState<number>(350);
  const [fixedCharges, setFixedCharges] = useState<number>(10);
  const [fuelSurchargePct, setFuelSurchargePct] = useState<number>(5);
  const [taxPct, setTaxPct] = useState<number>(8);
  const [slabs, setSlabs] = useState<UtilityTariffSlab[]>([
    { slabStart: 0, slabEnd: 100, ratePerUnit: 0.12 },
    { slabStart: 100, slabEnd: 300, ratePerUnit: 0.18 },
    { slabStart: 300, slabEnd: null, ratePerUnit: 0.25 }
  ]);
  const { copied, copy } = useCopy();

  const result = calculateTieredElectricityBill(
    unitsKwh,
    slabs,
    fixedCharges,
    fuelSurchargePct,
    taxPct
  );

  const handleAddSlab = () => {
    const lastEnd = slabs[slabs.length - 1]?.slabEnd || 300;
    setSlabs([...slabs.slice(0, -1), { slabStart: slabs[slabs.length - 1]?.slabStart || 0, slabEnd: lastEnd + 200, ratePerUnit: 0.22 }, { slabStart: lastEnd + 200, slabEnd: null, ratePerUnit: 0.28 }]);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
        <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          <p className="font-semibold">Tiered Slab Electricity Tariff Estimator</p>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
            Electricity utilities bill through progressive tariff tiers. Enter your monthly consumption and customize tariff slabs for your local utility company.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Monthly Consumption & Surcharges</h3>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Monthly Consumption (kWh / Units)
            </label>
            <input
              type="number"
              min="0"
              value={unitsKwh}
              onChange={e => setUnitsKwh(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Fixed ($)</label>
              <input
                type="number"
                min="0"
                value={fixedCharges}
                onChange={e => setFixedCharges(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Fuel (%)</label>
              <input
                type="number"
                min="0"
                value={fuelSurchargePct}
                onChange={e => setFuelSurchargePct(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Tax (%)</label>
              <input
                type="number"
                min="0"
                value={taxPct}
                onChange={e => setTaxPct(Number(e.target.value))}
                className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tariff Slabs</span>
              <button
                onClick={handleAddSlab}
                className="text-xs text-amber-600 hover:text-amber-500 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tier
              </button>
            </div>
            <div className="space-y-2">
              {slabs.map((slab, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-20 text-slate-500 font-mono">
                    {slab.slabEnd ? `${slab.slabStart}-${slab.slabEnd}` : `${slab.slabStart}+`} kWh
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={slab.ratePerUnit}
                    onChange={e => {
                      const updated = [...slabs];
                      updated[idx].ratePerUnit = Number(e.target.value);
                      setSlabs(updated);
                    }}
                    className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs"
                  />
                  <span className="text-slate-400">$/kWh</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs uppercase tracking-wider text-slate-400">Estimated Total Bill</span>
              <button
                onClick={() => copy(`Estimated Electricity Bill: $${result.totalBill} for ${unitsKwh} kWh (Avg: $${result.averageRatePerKwh}/kWh)`)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-amber-400">${result.totalBill.toFixed(2)}</div>
              <p className="text-xs text-slate-400 mt-1">Average effective rate: ${result.averageRatePerKwh.toFixed(3)} / kWh</p>
            </div>

            <div className="mt-5 space-y-2 text-xs border-t border-slate-800 pt-4">
              <div className="flex justify-between text-slate-300">
                <span>Base Energy Charges:</span>
                <span className="font-mono">${result.energyCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fixed Meter Charges:</span>
                <span className="font-mono">${result.fixedCharges.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fuel Surcharge Adjustment:</span>
                <span className="font-mono">${result.fuelSurcharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Electricity Taxes & Duties:</span>
                <span className="font-mono">${result.taxes.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            Slab details:{' '}
            {result.slabBreakdown.map((s, i) => (
              <span key={i} className="mr-2">[{s.slabRange}: ${s.cost}]</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Electricity Consumption Calculator
export const ElectricityConsumptionCalculator: React.FC = () => {
  const [appliances, setAppliances] = useState<ApplianceCostInput[]>([
    { name: 'Air Conditioner (1.5 Ton)', wattage: 1800, dailyHours: 8, quantity: 1 },
    { name: 'Refrigerator', wattage: 200, dailyHours: 24, quantity: 1 },
    { name: 'Ceiling Fans', wattage: 75, dailyHours: 12, quantity: 4 },
    { name: 'LED Lighting', wattage: 10, dailyHours: 6, quantity: 10 },
    { name: 'Television & Console', wattage: 150, dailyHours: 4, quantity: 1 }
  ]);
  const [tariffRate, setTariffRate] = useState<number>(0.16);
  const { copied, copy } = useCopy();

  const result = calculateApplianceEnergyCost(appliances, tariffRate);

  const addAppliance = () => {
    setAppliances([...appliances, { name: 'New Appliance', wattage: 500, dailyHours: 2, quantity: 1 }]);
  };

  const removeAppliance = (idx: number) => {
    setAppliances(appliances.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Whole-House Energy Consumption Auditor</h3>
          <p className="text-xs text-slate-500 mt-0.5">Audit appliance energy use and forecast monthly kWh & costs</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 dark:text-slate-400">Electricity Rate ($/kWh):</label>
          <input
            type="number"
            step="0.01"
            value={tariffRate}
            onChange={e => setTariffRate(Math.max(0, Number(e.target.value)))}
            className="w-20 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs font-mono"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
            <tr>
              <th className="p-3">Appliance</th>
              <th className="p-3">Watts</th>
              <th className="p-3">Hrs/Day</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Daily kWh</th>
              <th className="p-3">Monthly Cost</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            {appliances.map((app, idx) => {
              const rowKwh = (((app.wattage * app.dailyHours) / 1000) * (app.quantity || 1));
              return (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3">
                    <input
                      type="text"
                      value={app.name}
                      onChange={e => {
                        const copyApp = [...appliances];
                        copyApp[idx].name = e.target.value;
                        setAppliances(copyApp);
                      }}
                      className="bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 w-full focus:outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={app.wattage}
                      onChange={e => {
                        const copyApp = [...appliances];
                        copyApp[idx].wattage = Number(e.target.value);
                        setAppliances(copyApp);
                      }}
                      className="w-16 px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      max="24"
                      value={app.dailyHours}
                      onChange={e => {
                        const copyApp = [...appliances];
                        copyApp[idx].dailyHours = Math.min(24, Number(e.target.value));
                        setAppliances(copyApp);
                      }}
                      className="w-14 px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="1"
                      value={app.quantity || 1}
                      onChange={e => {
                        const copyApp = [...appliances];
                        copyApp[idx].quantity = Math.max(1, Number(e.target.value));
                        setAppliances(copyApp);
                      }}
                      className="w-12 px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded"
                    />
                  </td>
                  <td className="p-3 font-mono">{(rowKwh).toFixed(2)}</td>
                  <td className="p-3 font-mono font-medium">${(rowKwh * 30 * tariffRate).toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeAppliance(idx)}
                      className="text-rose-500 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={addAppliance}
          className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add Appliance
        </button>

        <div className="flex gap-4 text-xs font-mono">
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <span className="text-slate-500">Daily:</span> <span className="font-bold">{result.totalDailyKwh} kWh (${result.dailyCost})</span>
          </div>
          <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-lg">
            <span>Monthly:</span> <span className="font-bold">{result.totalMonthlyKwh} kWh (${result.monthlyCost})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Appliance Electricity Cost Calculator
export const ApplianceElectricityCostCalculator: React.FC = () => {
  const [powerWatts, setPowerWatts] = useState<number>(1500);
  const [hoursPerDay, setHoursPerDay] = useState<number>(4);
  const [ratePerKwh, setRatePerKwh] = useState<number>(0.15);
  const { copied, copy } = useCopy();

  const dailyKwh = (powerWatts * hoursPerDay) / 1000;
  const monthlyKwh = dailyKwh * 30;
  const yearlyKwh = dailyKwh * 365;

  const dailyCost = dailyKwh * ratePerKwh;
  const monthlyCost = monthlyKwh * ratePerKwh;
  const yearlyCost = yearlyKwh * ratePerKwh;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Power Rating (Watts)
            </label>
            <input
              type="number"
              min="1"
              value={powerWatts}
              onChange={e => setPowerWatts(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Hours Used per Day
            </label>
            <input
              type="number"
              min="0.1"
              max="24"
              step="0.5"
              value={hoursPerDay}
              onChange={e => setHoursPerDay(Math.min(24, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Cost per kWh ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={ratePerKwh}
              onChange={e => setRatePerKwh(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Daily</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ${dailyCost.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{dailyKwh.toFixed(2)} kWh</p>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 shadow-sm">
          <span className="text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider font-semibold">Monthly (30d)</span>
          <div className="text-xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-1">
            ${monthlyCost.toFixed(2)}
          </div>
          <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">{monthlyKwh.toFixed(1)} kWh</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Yearly (365d)</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ${yearlyCost.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{yearlyKwh.toFixed(0)} kWh</p>
        </div>
      </div>
    </div>
  );
};

// 4. Monthly Water Bill Estimator
export const MonthlyWaterBillEstimator: React.FC = () => {
  const [units, setUnits] = useState<number>(25);
  const [unitType, setUnitType] = useState<'kiloliters' | 'cubic_meters' | 'gallons_1000'>('kiloliters');
  const [ratePerUnit, setRatePerUnit] = useState<number>(2.2);
  const [sewagePct, setSewagePct] = useState<number>(30);
  const [fixedFee, setFixedFee] = useState<number>(8);
  const [taxPct, setTaxPct] = useState<number>(5);
  const { copied, copy } = useCopy();

  const bill = calculateWaterBill(units, unitType, ratePerUnit, sewagePct, fixedFee, taxPct);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Water Consumed
            </label>
            <input
              type="number"
              min="0"
              value={units}
              onChange={e => setUnits(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Measurement Unit
            </label>
            <select
              value={unitType}
              onChange={e => setUnitType(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm"
            >
              <option value="kiloliters">Kiloliters (1,000 Liters)</option>
              <option value="cubic_meters">Cubic Meters (m³)</option>
              <option value="gallons_1000">1,000 Gallons (kgal)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-500 mb-1 block">Rate / Unit ($)</label>
            <input
              type="number"
              step="0.1"
              value={ratePerUnit}
              onChange={e => setRatePerUnit(Number(e.target.value))}
              className="w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
          <div>
            <label className="text-slate-500 mb-1 block">Sewage (%)</label>
            <input
              type="number"
              value={sewagePct}
              onChange={e => setSewagePct(Number(e.target.value))}
              className="w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
          <div>
            <label className="text-slate-500 mb-1 block">Fixed Fee ($)</label>
            <input
              type="number"
              value={fixedFee}
              onChange={e => setFixedFee(Number(e.target.value))}
              className="w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
          <div>
            <label className="text-slate-500 mb-1 block">Tax (%)</label>
            <input
              type="number"
              value={taxPct}
              onChange={e => setTaxPct(Number(e.target.value))}
              className="w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="bg-cyan-900 text-white p-5 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-cyan-300">Estimated Water Bill</span>
          <div className="text-3xl font-bold font-mono text-white mt-1">${bill.totalBill.toFixed(2)}</div>
          <p className="text-xs text-cyan-200 mt-1">
            Water: ${bill.waterCharge} | Sewage: ${bill.sewageCharge} | Fixed: ${bill.fixedCharge}
          </p>
        </div>
        <button
          onClick={() => copy(`Estimated Water Bill: $${bill.totalBill} (${units} ${unitType})`)}
          className="px-3 py-1.5 bg-cyan-800 hover:bg-cyan-700 text-xs rounded-lg flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

// 5. Household Water Consumption Calculator
export const HouseholdWaterConsumptionCalculator: React.FC = () => {
  const [residents, setResidents] = useState<number>(3);
  const [showersPerDay, setShowersPerDay] = useState<number>(1);
  const [showerMinutes, setShowerMinutes] = useState<number>(8);
  const [toiletFlushes, setToiletFlushes] = useState<number>(5);
  const [laundryLoads, setLaundryLoads] = useState<number>(4);
  const [dishLoads, setDishLoads] = useState<number>(5);
  const [outdoorMinutes, setOutdoorMinutes] = useState<number>(30);

  const audit = calculateHouseholdWaterAudit({
    residents,
    showersPerDay,
    minutesPerShower: showerMinutes,
    toiletFlushesPerDay: toiletFlushes,
    laundryLoadsPerWeek: laundryLoads,
    dishwasherRunsPerWeek: dishLoads,
    outdoorMinutesPerWeek: outdoorMinutes
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Household Residents</label>
          <input
            type="number"
            min="1"
            value={residents}
            onChange={e => setResidents(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Showers/Person/Day & Mins</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              value={showersPerDay}
              onChange={e => setShowersPerDay(Number(e.target.value))}
              className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
            <input
              type="number"
              min="1"
              value={showerMinutes}
              onChange={e => setShowerMinutes(Number(e.target.value))}
              className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="font-semibold block mb-1">Toilet Flushes/Person/Day</label>
          <input
            type="number"
            min="1"
            value={toiletFlushes}
            onChange={e => setToiletFlushes(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Laundry Loads / Week</label>
          <input
            type="number"
            min="0"
            value={laundryLoads}
            onChange={e => setLaundryLoads(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Dishwasher / Week</label>
          <input
            type="number"
            min="0"
            value={dishLoads}
            onChange={e => setDishLoads(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Garden/Hose Mins / Week</label>
          <input
            type="number"
            min="0"
            value={outdoorMinutes}
            onChange={e => setOutdoorMinutes(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl border border-cyan-200 dark:border-cyan-800">
          <span className="text-xs text-cyan-700 dark:text-cyan-400 uppercase">Daily Liters</span>
          <div className="text-2xl font-bold font-mono text-cyan-900 dark:text-cyan-200 mt-1">
            {audit.dailyTotalLiters.toLocaleString()} L
          </div>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400">({audit.dailyGallons} gal)</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Per Person / Day</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {audit.perCapitaDailyLiters} L
          </div>
          <span className="text-[11px] text-slate-400">Standard: 150-250 L</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Monthly Volume</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {(audit.monthlyTotalLiters / 1000).toFixed(1)} m³
          </div>
          <span className="text-[11px] text-slate-400">({audit.monthlyGallons.toLocaleString()} gal)</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Yearly Estimate</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {Math.round(audit.yearlyTotalLiters / 1000)} kL
          </div>
          <span className="text-[11px] text-slate-400">Annual footprint</span>
        </div>
      </div>
    </div>
  );
};

// 6. LPG Gas Consumption Calculator
export const LpgGasConsumptionCalculator: React.FC = () => {
  const [cylinderKg, setCylinderKg] = useState<number>(14.2);
  const [cookingHours, setCookingHours] = useState<number>(2.5);
  const [burners, setBurners] = useState<number>(1);
  const [burnRateGrams, setBurnRateGrams] = useState<number>(150);

  const res = calculateLpgConsumption(cylinderKg, cookingHours, burners, burnRateGrams);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Cylinder Size (kg)</label>
          <select
            value={cylinderKg}
            onChange={e => setCylinderKg(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value={14.2}>14.2 kg (Standard)</option>
            <option value={19}>19 kg (Commercial)</option>
            <option value={5}>5 kg (Small)</option>
            <option value={11.8}>11.8 kg</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Daily Cooking (Hrs)</label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            value={cookingHours}
            onChange={e => setCookingHours(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Active Burners</label>
          <input
            type="number"
            min="1"
            max="4"
            value={burners}
            onChange={e => setBurners(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Burn Rate (g/hr)</label>
          <input
            type="number"
            value={burnRateGrams}
            onChange={e => setBurnRateGrams(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="bg-amber-500 text-slate-950 p-6 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-amber-950/70">Estimated Lifespan</span>
          <div className="text-4xl font-extrabold font-mono mt-1">{res.estimatedDaysLifespan} Days</div>
          <p className="text-xs text-amber-950/80 mt-1">Approximately {res.weeksLifespan} weeks of regular daily cooking</p>
        </div>
        <div className="text-right text-xs space-y-1">
          <div>Burn Rate: <strong>{res.dailyBurnGrams}g / day</strong></div>
          <div>Cylinder: <strong>{cylinderKg} kg LPG</strong></div>
        </div>
      </div>
    </div>
  );
};

// 7. Solar Panel Requirement Calculator
export const SolarPanelRequirementCalculator: React.FC = () => {
  const [monthlyKwh, setMonthlyKwh] = useState<number>(600);
  const [sunHours, setSunHours] = useState<number>(5.0);
  const [panelWatts, setPanelWatts] = useState<number>(400);

  const solar = calculateSolarSizing(monthlyKwh, sunHours, panelWatts);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Monthly Power Consumption (kWh)</label>
          <input
            type="number"
            value={monthlyKwh}
            onChange={e => setMonthlyKwh(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Average Daily Peak Sun Hours</label>
          <input
            type="number"
            step="0.1"
            value={sunHours}
            onChange={e => setSunHours(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Solar Panel Rating (Watts)</label>
          <select
            value={panelWatts}
            onChange={e => setPanelWatts(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          >
            <option value={350}>350 Watts</option>
            <option value={400}>400 Watts (Standard)</option>
            <option value={450}>450 Watts</option>
            <option value={540}>540 Watts (High Efficiency)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
          <span className="text-xs text-amber-700 dark:text-amber-400 uppercase">System Capacity</span>
          <div className="text-2xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-1">
            {solar.actualSystemCapacityKw} kW
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400">Target: {solar.requiredSystemKw} kW</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Total Panels</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {solar.panelsCount} Panels
          </div>
          <span className="text-[11px] text-slate-400">@ {panelWatts}W each</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Roof Area Required</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {solar.roofAreaSqFt} sq ft
          </div>
          <span className="text-[11px] text-slate-400">({solar.roofAreaSqM} m²)</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Monthly Output</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ~{solar.estimatedMonthlyGenerationKwh} kWh
          </div>
          <span className="text-[11px] text-slate-400">~{solar.estimatedDailyGenerationKwh} kWh / day</span>
        </div>
      </div>
    </div>
  );
};

// 8. Solar Energy Savings Calculator
export const SolarEnergySavingsCalculator: React.FC = () => {
  const [installCost, setInstallCost] = useState<number>(8500);
  const [monthlySavings, setMonthlySavings] = useState<number>(110);
  const [maintenance, setMaintenance] = useState<number>(60);

  const roi = calculateSolarRoi(installCost, monthlySavings, maintenance);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Total System Cost ($)</label>
          <input
            type="number"
            value={installCost}
            onChange={e => setInstallCost(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Monthly Bill Savings ($)</label>
          <input
            type="number"
            value={monthlySavings}
            onChange={e => setMonthlySavings(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Annual Maintenance ($)</label>
          <input
            type="number"
            value={maintenance}
            onChange={e => setMaintenance(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Payback Period</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1">
            {roi.paybackPeriodYears} Years
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Break-even timeline</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">25-Yr Net Savings</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ${roi.cumulative25YearSavings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">After all costs</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Overall ROI</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {roi.roiPercent}%
          </div>
          <span className="text-[11px] text-slate-400">Lifetime return</span>
        </div>
      </div>
    </div>
  );
};

// 9. Home Internet Usage Calculator
export const HomeInternetUsageCalculator: React.FC = () => {
  const [members, setMembers] = useState<number>(3);
  const [hours4k, setHours4k] = useState<number>(3);
  const [hoursHd, setHoursHd] = useState<number>(4);
  const [hoursWfh, setHoursWfh] = useState<number>(6);
  const [hoursGaming, setHoursGaming] = useState<number>(2);
  const [devices, setDevices] = useState<number>(10);

  const internet = calculateBroadbandRequirement({
    familyMembers: members,
    devicesConnected: devices,
    hours4kStreamingPerDay: hours4k,
    hoursHdStreamingPerDay: hoursHd,
    hoursVideoCallsPerDay: hoursWfh,
    gamingHoursPerDay: hoursGaming
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Household Members</label>
          <input
            type="number"
            min="1"
            value={members}
            onChange={e => setMembers(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Connected Devices / IoT</label>
          <input
            type="number"
            min="1"
            value={devices}
            onChange={e => setDevices(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">4K Streaming (Hrs/Day)</label>
          <input
            type="number"
            min="0"
            value={hours4k}
            onChange={e => setHours4k(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">HD Streaming (Hrs/Day)</label>
          <input
            type="number"
            min="0"
            value={hoursHd}
            onChange={e => setHoursHd(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">WFH Video Calls (Hrs/Day)</label>
          <input
            type="number"
            min="0"
            value={hoursWfh}
            onChange={e => setHoursWfh(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Online Gaming (Hrs/Day)</label>
          <input
            type="number"
            min="0"
            value={hoursGaming}
            onChange={e => setHoursGaming(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="bg-indigo-950 text-white p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-300">Recommended Broadband Plan</span>
          <div className="text-2xl font-bold font-mono text-indigo-200 mt-1">{internet.recommendedSpeedMbps} Mbps Plan</div>
          <p className="text-xs text-indigo-300 mt-1">{internet.recommendedPlanTier}</p>
        </div>
        <div className="text-right text-xs space-y-1">
          <div>Est. Daily Usage: <strong>{internet.dailyGb} GB/day</strong></div>
          <div>Est. Monthly Data: <strong>{internet.monthlyGb} GB/mo</strong></div>
        </div>
      </div>
    </div>
  );
};

// 10. Household Monthly Budget Calculator
export const HouseholdMonthlyBudgetCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(5000);
  const [rentMortgage, setRentMortgage] = useState<number>(1600);
  const [utilities, setUtilities] = useState<number>(350);
  const [groceries, setGroceries] = useState<number>(650);
  const [transport, setTransport] = useState<number>(400);
  const [maintenance, setMaintenance] = useState<number>(200);
  const [discretionary, setDiscretionary] = useState<number>(800);

  const totalNeeds = rentMortgage + utilities + groceries + transport + maintenance;
  const totalExpenses = totalNeeds + discretionary;
  const remainingSavings = Math.max(0, income - totalExpenses);

  const needsPct = income > 0 ? (totalNeeds / income) * 100 : 0;
  const wantsPct = income > 0 ? (discretionary / income) * 100 : 0;
  const savingsPct = income > 0 ? (remainingSavings / income) * 100 : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="col-span-2">
          <label className="font-semibold block mb-1">Monthly Household Net Income ($)</label>
          <input
            type="number"
            value={income}
            onChange={e => setIncome(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm font-semibold"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-400 block mb-1">Housing (Rent/Mortgage)</label>
          <input
            type="number"
            value={rentMortgage}
            onChange={e => setRentMortgage(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-400 block mb-1">Utilities (Power/Water/Gas/Net)</label>
          <input
            type="number"
            value={utilities}
            onChange={e => setUtilities(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-400 block mb-1">Groceries & Food</label>
          <input
            type="number"
            value={groceries}
            onChange={e => setGroceries(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-400 block mb-1">Transportation & Fuel</label>
          <input
            type="number"
            value={transport}
            onChange={e => setTransport(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-400 block mb-1">Home Repairs & HOA</label>
          <input
            type="number"
            value={maintenance}
            onChange={e => setMaintenance(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="text-slate-600 dark:text-slate-400 block mb-1">Discretionary / Leisure</label>
          <input
            type="number"
            value={discretionary}
            onChange={e => setDiscretionary(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-[11px] text-slate-500 uppercase">Needs (Target 50%)</span>
          <div className="text-lg font-bold font-mono mt-1">${totalNeeds} ({needsPct.toFixed(0)}%)</div>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <span className="text-[11px] text-slate-500 uppercase">Wants (Target 30%)</span>
          <div className="text-lg font-bold font-mono mt-1">${discretionary} ({wantsPct.toFixed(0)}%)</div>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <span className="text-[11px] uppercase font-semibold">Savings (Target 20%)</span>
          <div className="text-lg font-bold font-mono mt-1">${remainingSavings} ({savingsPct.toFixed(0)}%)</div>
        </div>
      </div>
    </div>
  );
};

// 11. Household Rent Split Calculator
export const HouseholdRentSplitCalculator: React.FC = () => {
  const [totalRent, setTotalRent] = useState<number>(2400);
  const [rooms, setRooms] = useState<RoommateRoomInput[]>([
    { id: '1', tenantName: 'Alex', roomAreaSqFt: 220, hasPrivateBathroom: true, hasBalcony: true, hasParking: true },
    { id: '2', tenantName: 'Jordan', roomAreaSqFt: 180, hasPrivateBathroom: false, hasBalcony: false, hasParking: false },
    { id: '3', tenantName: 'Taylor', roomAreaSqFt: 160, hasPrivateBathroom: false, hasBalcony: false, hasParking: false }
  ]);

  const split = calculateRentSplit(totalRent, rooms);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-sm">Roommate Fair Rent Splitter</h3>
          <p className="text-xs text-slate-500">Calculates fair rent based on square footage, private baths, balconies, and parking</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 dark:text-slate-400">Total Apartment Rent ($):</label>
          <input
            type="number"
            value={totalRent}
            onChange={e => setTotalRent(Math.max(1, Number(e.target.value)))}
            className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs font-mono font-semibold"
          />
        </div>
      </div>

      <div className="space-y-3">
        {split.itemized.map((item, idx) => (
          <div key={item.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <span className="font-semibold text-sm">{item.tenantName}</span>
              <p className="text-xs text-slate-500 mt-0.5">
                {item.roomAreaSqFt} sq ft room | Base: ${item.baseShare} + Amenities: ${item.amenityShare}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                ${item.totalShare}
              </div>
              <span className="text-xs text-slate-400 font-mono">({item.percentage}% of rent)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 12. Room Area Calculator
export const RoomAreaCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(15);
  const [width, setWidth] = useState<number>(12);
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');

  const dims = calculateRoomDimensions(length, width, 9, unit);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Room Length</label>
          <input
            type="number"
            min="1"
            value={length}
            onChange={e => setLength(Math.max(0.1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Room Width</label>
          <input
            type="number"
            min="1"
            value={width}
            onChange={e => setWidth(Math.max(0.1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Measurement Unit</label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value="feet">Feet (ft)</option>
            <option value="meters">Meters (m)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Floor Area</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1">
            {dims.floorArea} {unit === 'feet' ? 'sq ft' : 'm²'}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
            {unit === 'feet' ? `${(dims.floorArea * 0.092903).toFixed(1)} m²` : `${(dims.floorArea * 10.7639).toFixed(1)} sq ft`}
          </span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Room Perimeter</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {dims.perimeter} {unit === 'feet' ? 'ft' : 'm'}
          </div>
          <span className="text-[11px] text-slate-400">For baseboards/trim</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">AC Cooling Needed</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {dims.coolingTons} Ton
          </div>
          <span className="text-[11px] text-slate-400">~{dims.coolingBtu} BTU/hr</span>
        </div>
      </div>
    </div>
  );
};

// 13. Room Volume Calculator
export const RoomVolumeCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(14);
  const [width, setWidth] = useState<number>(12);
  const [height, setHeight] = useState<number>(9);
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');

  const dims = calculateRoomDimensions(length, width, height, unit);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Length</label>
          <input
            type="number"
            value={length}
            onChange={e => setLength(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Width</label>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Height (Ceiling)</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Unit</label>
          <select
            value={unit}
            onChange={e => setUnit(e.target.value as any)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value="feet">Feet (ft)</option>
            <option value="meters">Meters (m)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800">
          <span className="text-xs text-sky-700 dark:text-sky-400 uppercase font-semibold">Cubic Volume</span>
          <div className="text-2xl font-bold font-mono text-sky-900 dark:text-sky-200 mt-1">
            {dims.volume} {unit === 'feet' ? 'cu ft' : 'm³'}
          </div>
          <span className="text-[11px] text-sky-600 dark:text-sky-400">Total air capacity</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Air Purifier CADR</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {dims.airChangesCfm} CFM
          </div>
          <span className="text-[11px] text-slate-400">4 Air Changes / Hour</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">HVAC Sizing</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {dims.coolingBtu} BTU
          </div>
          <span className="text-[11px] text-slate-400">{dims.coolingTons} Tons Cooling</span>
        </div>
      </div>
    </div>
  );
};

// 14. Paint Quantity Calculator
export const PaintQuantityCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [width, setWidth] = useState<number>(12);
  const [height, setHeight] = useState<number>(9);
  const [doors, setDoors] = useState<number>(1);
  const [windows, setWindows] = useState<number>(2);
  const [coats, setCoats] = useState<number>(2);
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);

  const paint = calculatePaintCoverage(length, width, height, doors, windows, includeCeiling, coats);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Length (ft)</label>
          <input
            type="number"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Width (ft)</label>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Height (ft)</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Number of Coats</label>
          <select
            value={coats}
            onChange={e => setCoats(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value={1}>1 Coat</option>
            <option value={2}>2 Coats (Standard)</option>
            <option value={3}>3 Coats</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Doors (Deduction)</label>
          <input
            type="number"
            value={doors}
            onChange={e => setDoors(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Windows (Deduction)</label>
          <input
            type="number"
            value={windows}
            onChange={e => setWindows(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div className="col-span-2 flex items-center gap-2 pt-4">
          <input
            type="checkbox"
            id="ceilingCheck"
            checked={includeCeiling}
            onChange={e => setIncludeCeiling(e.target.checked)}
            className="rounded text-emerald-600"
          />
          <label htmlFor="ceilingCheck" className="font-medium cursor-pointer">
            Include Ceiling Area ({length * width} sq ft)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Paint Needed</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1">
            {paint.litersNeeded} Liters
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">~{paint.gallonsNeeded} Gallons</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Net Paintable Area</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {paint.totalAreaToPaint} sq ft
          </div>
          <span className="text-[11px] text-slate-400">Walls: {paint.netWallArea} | Ceil: {paint.ceilingArea}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Primer Estimate</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {paint.primerLitersNeeded} Liters
          </div>
          <span className="text-[11px] text-slate-400">1 Base Coat</span>
        </div>
      </div>
    </div>
  );
};

// 15. Wallpaper Calculator
export const WallpaperCalculator: React.FC = () => {
  const [length, setLength] = useState<number>(14);
  const [width, setWidth] = useState<number>(12);
  const [height, setHeight] = useState<number>(9);
  const [rollWidth, setRollWidth] = useState<number>(21);
  const [rollLength, setRollLength] = useState<number>(33);
  const [repeat, setRepeat] = useState<number>(0);

  const res = calculateWallpaper(length, width, height, 1, 2, rollWidth, rollLength, repeat);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Room Length (ft)</label>
          <input
            type="number"
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Room Width (ft)</label>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Wall Height (ft)</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Roll Width (Inches)</label>
          <input
            type="number"
            value={rollWidth}
            onChange={e => setRollWidth(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Roll Length (Feet)</label>
          <input
            type="number"
            value={rollLength}
            onChange={e => setRollLength(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Pattern Repeat (Inches)</label>
          <input
            type="number"
            value={repeat}
            onChange={e => setRepeat(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="bg-rose-950 text-white p-5 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-rose-300">Wallpaper Rolls Needed</span>
          <div className="text-3xl font-bold font-mono text-white mt-1">{res.rollsNeeded} Rolls</div>
          <p className="text-xs text-rose-200 mt-1">
            Net Wall Area: {res.netWallArea} sq ft | Single Roll: {res.singleRollArea} sq ft
          </p>
        </div>
        <div className="text-xs text-right text-rose-300">
          <div>Usable Area/Roll: <strong>{res.usableRollArea} sq ft</strong></div>
          <div>Estimated Waste: <strong>{res.wasteArea} sq ft</strong></div>
        </div>
      </div>
    </div>
  );
};
