import React, { useState, useEffect } from 'react';
import { safeStorage, exportToCsv } from '../../../utils/storage';
import {
  Zap,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Lightbulb,
  Tv,
  Fan,
  Wind,
  Flame,
  Laptop,
  CheckCircle2
} from 'lucide-react';

interface Appliance {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
}

const DEFAULT_APPLIANCES: Appliance[] = [
  { id: '1', name: '1.5 Ton Inverter AC', watts: 1400, quantity: 1, hoursPerDay: 8 },
  { id: '2', name: 'Double Door Refrigerator', watts: 250, quantity: 1, hoursPerDay: 12 },
  { id: '3', name: 'Ceiling Fans', watts: 75, quantity: 3, hoursPerDay: 10 },
  { id: '4', name: 'LED Bulbs (9W - 12W)', watts: 10, quantity: 6, hoursPerDay: 6 },
  { id: '5', name: 'Smart LED TV (43"-55")', watts: 100, quantity: 1, hoursPerDay: 4 },
  { id: '6', name: 'Water Geyser / Boiler', watts: 2000, quantity: 1, hoursPerDay: 1 },
  { id: '7', name: 'Washing Machine', watts: 500, quantity: 1, hoursPerDay: 1 },
  { id: '8', name: 'Laptop / PC Workstation', watts: 90, quantity: 1, hoursPerDay: 8 },
];

export const ElectricityConsumptionEstimator: React.FC = () => {
  const [currency, setCurrency] = useState<string>(() => safeStorage.getItem('elec_currency', '₹'));
  const [tariffRate, setTariffRate] = useState<number>(() => safeStorage.getItem('elec_tariff', 7.5));
  const [fixedCharges, setFixedCharges] = useState<number>(() => safeStorage.getItem('elec_fixed', 150));
  const [taxPercent, setTaxPercent] = useState<number>(() => safeStorage.getItem('elec_tax', 5));
  const [billingDays, setBillingDays] = useState<number>(30);

  const [appliances, setAppliances] = useState<Appliance[]>(() => {
    return safeStorage.getItem<Appliance[]>('elec_appliances', DEFAULT_APPLIANCES);
  });

  // Add form state
  const [newName, setNewName] = useState('');
  const [newWatts, setNewWatts] = useState('');
  const [newQty, setNewQty] = useState('1');
  const [newHours, setNewHours] = useState('4');

  useEffect(() => {
    safeStorage.setItem('elec_currency', currency);
    safeStorage.setItem('elec_tariff', tariffRate);
    safeStorage.setItem('elec_fixed', fixedCharges);
    safeStorage.setItem('elec_tax', taxPercent);
    safeStorage.setItem('elec_appliances', appliances);
  }, [currency, tariffRate, fixedCharges, taxPercent, appliances]);

  const handleAddAppliance = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWatts);
    const q = parseInt(newQty) || 1;
    const h = parseFloat(newHours) || 1;

    if (!newName.trim() || isNaN(w) || w <= 0) return;

    const newItem: Appliance = {
      id: `app-${Date.now()}`,
      name: newName.trim(),
      watts: w,
      quantity: q,
      hoursPerDay: Math.min(24, Math.max(0.1, h))
    };

    setAppliances((prev) => [...prev, newItem]);
    setNewName('');
    setNewWatts('');
  };

  const handleDelete = (id: string) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  const handleUpdate = (id: string, field: keyof Appliance, value: number) => {
    setAppliances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all appliances to standard household presets?')) {
      setAppliances(DEFAULT_APPLIANCES);
      setTariffRate(7.5);
      setFixedCharges(150);
    }
  };

  // Calculations
  const calculateApplianceDailyKwh = (a: Appliance) => {
    return (a.watts * a.quantity * a.hoursPerDay) / 1000;
  };

  const dailyTotalKwh = appliances.reduce((sum, a) => sum + calculateApplianceDailyKwh(a), 0);
  const monthlyTotalKwh = dailyTotalKwh * billingDays;
  const energyCost = monthlyTotalKwh * tariffRate;
  const taxAmount = (energyCost + fixedCharges) * (taxPercent / 100);
  const totalMonthlyBill = energyCost + fixedCharges + taxAmount;
  const totalAnnualBill = totalMonthlyBill * 12;

  const handleExportCsv = () => {
    const data = [
      ['Appliance Name', 'Wattage (W)', 'Quantity', 'Hours/Day', 'Monthly Units (kWh)', `Estimated Monthly Cost (${currency})`],
      ...appliances.map((a) => {
        const kwh = calculateApplianceDailyKwh(a) * billingDays;
        const cost = kwh * tariffRate;
        return [a.name, String(a.watts), String(a.quantity), String(a.hoursPerDay), kwh.toFixed(1), cost.toFixed(2)];
      })
    ];
    exportToCsv(data, 'electricity-consumption-breakdown');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Electricity Consumption Estimator</h1>
          </div>
          <p className="text-yellow-100 text-sm mt-1">
            Calculate appliance wattage, monthly kWh units, electricity bills, and optimize power savings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-semibold transition text-white border border-white/20"
          >
            <option value="₹" className="text-slate-800">INR (₹)</option>
            <option value="$" className="text-slate-800">USD ($)</option>
            <option value="€" className="text-slate-800">EUR (€)</option>
            <option value="£" className="text-slate-800">GBP (£)</option>
          </select>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tariff & Settings Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Unit Rate ({currency} / kWh)
          </label>
          <input
            type="number"
            step="0.1"
            value={tariffRate}
            onChange={(e) => setTariffRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-semibold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Fixed Monthly Charges ({currency})
          </label>
          <input
            type="number"
            value={fixedCharges}
            onChange={(e) => setFixedCharges(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Electricity Duty / Tax (%)
          </label>
          <input
            type="number"
            step="0.5"
            value={taxPercent}
            onChange={(e) => setTaxPercent(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Billing Period (Days)
          </label>
          <input
            type="number"
            value={billingDays}
            onChange={(e) => setBillingDays(Math.max(1, parseInt(e.target.value) || 30))}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
      </div>

      {/* Estimated Bill KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Daily Consumption</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {dailyTotalKwh.toFixed(1)} <span className="text-xs font-normal text-slate-400">kWh</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Units / day</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Monthly Units (kWh)</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {Math.round(monthlyTotalKwh)} <span className="text-xs font-normal text-slate-400">Units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">For {billingDays} days</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Estimated Monthly Bill</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {currency}{Math.round(totalMonthlyBill).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Incl. taxes & fixed fee</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Projected Annual Cost</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {currency}{Math.round(totalAnnualBill).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">12 months total</div>
        </div>
      </div>

      {/* Add Appliance Form */}
      <form
        onSubmit={handleAddAppliance}
        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-amber-500" />
          Add Custom Appliance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium text-slate-500 mb-1">Appliance Name</label>
            <input
              type="text"
              placeholder="e.g. Electric Kettle, Iron, Induction..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">Power Rating (Watts)</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={newWatts}
              onChange={(e) => setNewWatts(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Hours / Day</label>
            <input
              type="number"
              step="0.5"
              min="0.1"
              max="24"
              value={newHours}
              onChange={(e) => setNewHours(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Add
            </button>
          </div>
        </div>
      </form>

      {/* Appliance Breakdown Table */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            Appliance Breakdown & Energy Contribution ({appliances.length})
          </h3>
          <button
            onClick={handleResetDefaults}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Presets
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 uppercase font-medium">
              <tr>
                <th className="p-2.5">Appliance</th>
                <th className="p-2.5">Power</th>
                <th className="p-2.5">Qty</th>
                <th className="p-2.5">Hours/Day</th>
                <th className="p-2.5">Monthly kWh</th>
                <th className="p-2.5">Monthly Cost</th>
                <th className="p-2.5">Share %</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {appliances.map((app) => {
                const appDaily = calculateApplianceDailyKwh(app);
                const appMonthlyUnits = appDaily * billingDays;
                const appMonthlyCost = appMonthlyUnits * tariffRate;
                const sharePercent = monthlyTotalKwh > 0 ? Math.round((appMonthlyUnits / monthlyTotalKwh) * 100) : 0;

                return (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="p-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {app.name}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        value={app.watts}
                        onChange={(e) => handleUpdate(app.id, 'watts', parseFloat(e.target.value) || 0)}
                        className="w-16 px-1.5 py-0.5 text-xs border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      /> W
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min="1"
                        value={app.quantity}
                        onChange={(e) => handleUpdate(app.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-12 px-1.5 py-0.5 text-xs border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        step="0.5"
                        min="0.1"
                        max="24"
                        value={app.hoursPerDay}
                        onChange={(e) => handleUpdate(app.id, 'hoursPerDay', parseFloat(e.target.value) || 1)}
                        className="w-14 px-1.5 py-0.5 text-xs border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                      /> hrs
                    </td>
                    <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                      {appMonthlyUnits.toFixed(1)}
                    </td>
                    <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">
                      {currency}{appMonthlyCost.toFixed(0)}
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, sharePercent)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">{sharePercent}%</span>
                      </div>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove"
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
      </div>
    </div>
  );
};
