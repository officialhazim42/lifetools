import React, { useState, useEffect } from 'react';
import { safeStorage, exportToCsv } from '../../../utils/storage';
import {
  Fuel,
  Calculator,
  Users,
  Download,
  Plus,
  Trash2,
  Gauge,
  TrendingUp,
  MapPin,
  Car
} from 'lucide-react';

interface FuelLogEntry {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  cost: number;
  fullTank: boolean;
}

export const FuelMileageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mileage' | 'trip' | 'log'>('mileage');
  const [currency, setCurrency] = useState<string>(() => safeStorage.getItem('fuel_calc_currency', '₹'));

  // Tab 1: Mileage Calculator
  const [distance, setDistance] = useState<string>('450');
  const [fuelUsed, setFuelUsed] = useState<string>('25');
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [fuelUnit, setFuelUnit] = useState<'liters' | 'gallons'>('liters');

  // Tab 2: Trip Cost Estimator
  const [tripDist, setTripDist] = useState<string>('300');
  const [vehicleMileage, setVehicleMileage] = useState<string>('18');
  const [fuelPrice, setFuelPrice] = useState<string>('96.72');
  const [passengers, setPassengers] = useState<number>(3);

  // Tab 3: Fuel Refill Log
  const [logs, setLogs] = useState<FuelLogEntry[]>(() => {
    return safeStorage.getItem<FuelLogEntry[]>('fuel_fill_logs', [
      { id: '1', date: '2026-11-01', odometer: 24500, liters: 32, cost: 3095, fullTank: true },
      { id: '2', date: '2026-11-15', odometer: 25120, liters: 33.5, cost: 3240, fullTank: true },
    ]);
  });

  const [newOdo, setNewOdo] = useState<string>('');
  const [newLiters, setNewLiters] = useState<string>('');
  const [newCost, setNewCost] = useState<string>('');
  const [newFullTank, setNewFullTank] = useState<boolean>(true);

  useEffect(() => {
    safeStorage.setItem('fuel_calc_currency', currency);
    safeStorage.setItem('fuel_fill_logs', logs);
  }, [currency, logs]);

  // Tab 1 calculations
  const distNum = parseFloat(distance) || 0;
  const fuelNum = parseFloat(fuelUsed) || 0;

  let kmL = 0;
  let l100km = 0;
  let usMpg = 0;
  let ukMpg = 0;

  if (distNum > 0 && fuelNum > 0) {
    // Normalize to km and liters first
    const normKm = distanceUnit === 'km' ? distNum : distNum * 1.60934;
    const normL = fuelUnit === 'liters' ? fuelNum : fuelNum * 3.78541;

    kmL = normKm / normL;
    l100km = (normL / normKm) * 100;
    usMpg = (normKm * 0.621371) / (normL / 3.78541);
    ukMpg = (normKm * 0.621371) / (normL / 4.54609);
  }

  // Tab 2 calculations
  const tDist = parseFloat(tripDist) || 0;
  const vMileage = parseFloat(vehicleMileage) || 1;
  const fPrice = parseFloat(fuelPrice) || 0;

  const totalFuelNeeded = tDist > 0 && vMileage > 0 ? tDist / vMileage : 0;
  const totalTripCost = totalFuelNeeded * fPrice;
  const costPerKm = tDist > 0 ? totalTripCost / tDist : 0;
  const costPerPerson = passengers > 0 ? totalTripCost / passengers : totalTripCost;

  // Tab 3: Fuel refill log handlers
  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const odo = parseFloat(newOdo);
    const ltr = parseFloat(newLiters);
    const cst = parseFloat(newCost);

    if (isNaN(odo) || isNaN(ltr) || isNaN(cst) || odo <= 0 || ltr <= 0) return;

    const entry: FuelLogEntry = {
      id: `fuel-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      odometer: odo,
      liters: ltr,
      cost: cst,
      fullTank: newFullTank
    };

    setLogs((prev) => [entry, ...prev].sort((a, b) => b.odometer - a.odometer));
    setNewOdo('');
    setNewLiters('');
    setNewCost('');
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleExportLogs = () => {
    const data = [
      ['Date', 'Odometer', 'Liters Filled', `Cost (${currency})`, 'Full Tank?'],
      ...logs.map((l) => [l.date, String(l.odometer), String(l.liters), String(l.cost), l.fullTank ? 'Yes' : 'No'])
    ];
    exportToCsv(data, 'fuel-refill-logs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Fuel className="w-8 h-8 text-amber-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Fuel Mileage & Trip Cost Calculator</h1>
          </div>
          <p className="text-amber-100 text-sm mt-1">
            Calculate fuel economy, trip costs, carpool splits, and keep track of fuel fill-ups.
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('mileage')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'mileage'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Mileage / Fuel Economy</span>
        </button>
        <button
          onClick={() => setActiveTab('trip')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'trip'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Trip Cost & Carpool Split</span>
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'log'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <Fuel className="w-4 h-4" />
          <span>Refill Log ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: MILEAGE CALCULATOR */}
      {activeTab === 'mileage' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
              Enter Distance Traveled & Fuel Consumed
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Distance Traveled
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <select
                    value={distanceUnit}
                    onChange={(e) => setDistanceUnit(e.target.value as any)}
                    className="w-24 px-2 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  >
                    <option value="km">Kilometers</option>
                    <option value="miles">Miles</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Fuel Consumed
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={fuelUsed}
                    onChange={(e) => setFuelUsed(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <select
                    value={fuelUnit}
                    onChange={(e) => setFuelUnit(e.target.value as any)}
                    className="w-24 px-2 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  >
                    <option value="liters">Liters</option>
                    <option value="gallons">Gallons</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">km / Liter</div>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {kmL.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Kilometers per Liter</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">L / 100 km</div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {l100km.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Liters per 100 km</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">US MPG</div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {usMpg.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Miles per Gallon (US)</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">UK MPG</div>
              <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                {ukMpg.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Imperial MPG (UK)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRIP COST & CARPOOL SPLIT */}
      {activeTab === 'trip' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                One-Way or Total Trip Distance (km)
              </label>
              <input
                type="number"
                step="any"
                value={tripDist}
                onChange={(e) => setTripDist(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Vehicle Fuel Economy (km/L)
              </label>
              <input
                type="number"
                step="any"
                value={vehicleMileage}
                onChange={(e) => setVehicleMileage(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Fuel Price ({currency} per Liter)
              </label>
              <input
                type="number"
                step="any"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Passengers Sharing Cost (Carpool Headcount)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Fuel Required</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {totalFuelNeeded.toFixed(1)} <span className="text-xs font-normal text-slate-400">Liters</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Total Trip Fuel Cost</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {currency}{totalTripCost.toFixed(2)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Cost per Kilometer</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currency}{costPerKm.toFixed(2)}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Cost per Passenger</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {currency}{costPerPerson.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Split across {passengers} people</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FILL-UP LOG */}
      {activeTab === 'log' && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddLog}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
          >
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-500" />
              Log Fuel Refill
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Odometer Reading (km)</label>
                <input
                  type="number"
                  placeholder="e.g. 25400"
                  value={newOdo}
                  onChange={(e) => setNewOdo(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Liters Filled</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 35.2"
                  value={newLiters}
                  onChange={(e) => setNewLiters(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Total Cost Paid ({currency})</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 3400"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required
                />
              </div>
              <div className="flex flex-col justify-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"
                >
                  Save Fill-up Log
                </button>
              </div>
            </div>
          </form>

          {/* History Log Table */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                Refill History & Calculated Consumption
              </h3>
              <button
                onClick={handleExportLogs}
                disabled={logs.length === 0}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No refill records saved yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 uppercase font-medium">
                    <tr>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5">Odometer</th>
                      <th className="p-2.5">Distance</th>
                      <th className="p-2.5">Liters</th>
                      <th className="p-2.5">Economy</th>
                      <th className="p-2.5">Total Cost</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                    {logs.map((log, idx) => {
                      const nextLog = logs[idx + 1];
                      const distanceDiff = nextLog ? log.odometer - nextLog.odometer : null;
                      const calculatedEconomy = distanceDiff && distanceDiff > 0 ? (distanceDiff / log.liters).toFixed(2) : '-';

                      return (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-2.5 font-medium">{log.date}</td>
                          <td className="p-2.5">{log.odometer.toLocaleString()} km</td>
                          <td className="p-2.5">{distanceDiff ? `${distanceDiff} km` : '-'}</td>
                          <td className="p-2.5">{log.liters} L</td>
                          <td className="p-2.5 font-semibold text-amber-600 dark:text-amber-400">
                            {calculatedEconomy !== '-' ? `${calculatedEconomy} km/L` : '-'}
                          </td>
                          <td className="p-2.5 font-medium">{currency}{log.cost.toLocaleString()}</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Delete log"
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};
