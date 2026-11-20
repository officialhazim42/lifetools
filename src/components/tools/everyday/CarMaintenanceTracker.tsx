import React, { useState, useEffect } from 'react';
import { safeStorage, exportToCsv } from '../../../utils/storage';
import {
  Wrench,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Calendar,
  Gauge,
  FileText,
  Car
} from 'lucide-react';

interface ServiceRecord {
  id: string;
  date: string;
  odometer: number;
  serviceType: string;
  cost: number;
  workshop: string;
  notes: string;
}

interface MaintenanceSchedule {
  key: string;
  name: string;
  intervalKm: number;
  intervalMonths: number;
  lastDoneKm: number;
  lastDoneDate: string;
}

const DEFAULT_SCHEDULES: MaintenanceSchedule[] = [
  { key: 'engine_oil', name: 'Engine Oil & Filter Change', intervalKm: 10000, intervalMonths: 12, lastDoneKm: 20000, lastDoneDate: '2026-03-01' },
  { key: 'tire_rotation', name: 'Tire Rotation & Balancing', intervalKm: 10000, intervalMonths: 6, lastDoneKm: 22000, lastDoneDate: '2026-05-15' },
  { key: 'cabin_filter', name: 'AC & Cabin Air Filter Replacement', intervalKm: 15000, intervalMonths: 12, lastDoneKm: 15000, lastDoneDate: '2025-11-10' },
  { key: 'brakes', name: 'Brake Fluid & Pads Inspection', intervalKm: 20000, intervalMonths: 24, lastDoneKm: 18000, lastDoneDate: '2025-08-20' },
  { key: 'battery', name: 'Battery Health & Terminal Check', intervalKm: 25000, intervalMonths: 12, lastDoneKm: 20000, lastDoneDate: '2026-02-10' },
  { key: 'insurance', name: 'Insurance Policy Renewal', intervalKm: 0, intervalMonths: 12, lastDoneKm: 0, lastDoneDate: '2026-01-15' },
  { key: 'puc', name: 'PUC / Emissions Certificate', intervalKm: 0, intervalMonths: 6, lastDoneKm: 0, lastDoneDate: '2026-07-01' },
];

export const CarMaintenanceTracker: React.FC = () => {
  const [currency, setCurrency] = useState<string>(() => safeStorage.getItem('car_currency', '₹'));
  const [vehicleName, setVehicleName] = useState<string>(() => safeStorage.getItem('car_name', 'My Car'));
  const [plateNumber, setPlateNumber] = useState<string>(() => safeStorage.getItem('car_plate', 'JK01-AB-1234'));
  const [currentOdometer, setCurrentOdometer] = useState<number>(() => safeStorage.getItem('car_odo', 24500));

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    return safeStorage.getItem<MaintenanceSchedule[]>('car_schedules', DEFAULT_SCHEDULES);
  });

  const [records, setRecords] = useState<ServiceRecord[]>(() => {
    return safeStorage.getItem<ServiceRecord[]>('car_service_records', [
      { id: '1', date: '2026-05-15', odometer: 22000, serviceType: 'Tire Rotation & Balancing', cost: 850, workshop: 'City Tire Care', notes: 'All 4 tires balanced' },
      { id: '2', date: '2026-03-01', odometer: 20000, serviceType: 'Engine Oil & Filter Change', cost: 3600, workshop: 'Authorized Service Center', notes: 'Synthetic oil 5W-30' }
    ]);
  });

  // Log form state
  const [logType, setLogType] = useState('Engine Oil & Filter Change');
  const [logOdo, setLogOdo] = useState('');
  const [logCost, setLogCost] = useState('');
  const [logWorkshop, setLogWorkshop] = useState('');
  const [logNotes, setLogNotes] = useState('');

  useEffect(() => {
    safeStorage.setItem('car_currency', currency);
    safeStorage.setItem('car_name', vehicleName);
    safeStorage.setItem('car_plate', plateNumber);
    safeStorage.setItem('car_odo', currentOdometer);
    safeStorage.setItem('car_schedules', schedules);
    safeStorage.setItem('car_service_records', records);
  }, [currency, vehicleName, plateNumber, currentOdometer, schedules, records]);

  const handleAddServiceRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const odo = parseInt(logOdo) || currentOdometer;
    const cst = parseFloat(logCost) || 0;

    const newRecord: ServiceRecord = {
      id: `svc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      odometer: odo,
      serviceType: logType,
      cost: cst,
      workshop: logWorkshop.trim() || 'Local Workshop',
      notes: logNotes.trim()
    };

    setRecords((prev) => [newRecord, ...prev]);

    // Update schedule's lastDoneKm / date if matches
    setSchedules((prev) =>
      prev.map((s) => {
        if (s.name.toLowerCase().includes(logType.toLowerCase().slice(0, 8))) {
          return { ...s, lastDoneKm: odo, lastDoneDate: newRecord.date };
        }
        return s;
      })
    );

    if (odo > currentOdometer) {
      setCurrentOdometer(odo);
    }

    setLogOdo('');
    setLogCost('');
    setLogWorkshop('');
    setLogNotes('');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleExportCsv = () => {
    const data = [
      ['Date', 'Odometer (km)', 'Service Type', `Cost (${currency})`, 'Workshop', 'Notes'],
      ...records.map((r) => [r.date, String(r.odometer), r.serviceType, String(r.cost), r.workshop, r.notes])
    ];
    exportToCsv(data, `${vehicleName.toLowerCase().replace(/\s+/g, '-')}-maintenance-records`);
  };

  const totalSpent = records.reduce((sum, r) => sum + r.cost, 0);

  // Helper to compute schedule status
  const getScheduleStatus = (s: MaintenanceSchedule) => {
    const kmPassed = currentOdometer - s.lastDoneKm;
    const monthsPassed = s.lastDoneDate
      ? (new Date().getTime() - new Date(s.lastDoneDate).getTime()) / (1000 * 60 * 60 * 24 * 30.4)
      : 0;

    let isOverdue = false;
    let isDueSoon = false;

    if (s.intervalKm > 0) {
      if (kmPassed >= s.intervalKm) isOverdue = true;
      else if (kmPassed >= s.intervalKm - 1000) isDueSoon = true;
    }

    if (s.intervalMonths > 0) {
      if (monthsPassed >= s.intervalMonths) isOverdue = true;
      else if (monthsPassed >= s.intervalMonths - 1) isDueSoon = true;
    }

    return { kmPassed, monthsPassed: Math.round(monthsPassed), isOverdue, isDueSoon };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-zinc-800 to-blue-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold">Vehicle Maintenance Tracker</h1>
          </div>
          <p className="text-slate-300 text-sm mt-1">
            Keep track of oil changes, tire rotations, brake inspections, and service histories.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold transition text-white border border-white/20"
          >
            <option value="₹" className="text-slate-800">INR (₹)</option>
            <option value="$" className="text-slate-800">USD ($)</option>
            <option value="€" className="text-slate-800">EUR (€)</option>
            <option value="£" className="text-slate-800">GBP (£)</option>
          </select>
          <button
            onClick={handleExportCsv}
            disabled={records.length === 0}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 backdrop-blur-sm rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Vehicle Profile Card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Vehicle Make & Model</label>
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">License Plate Number</label>
          <input
            type="text"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white uppercase font-mono font-bold text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Current Odometer (km)</label>
          <div className="relative">
            <Gauge className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="number"
              value={currentOdometer}
              onChange={(e) => setCurrentOdometer(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Service Schedule Status Matrix */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-500" />
            Maintenance Schedules & Health Status
          </span>
          <span className="text-xs text-slate-500">
            Based on {currentOdometer.toLocaleString()} km
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {schedules.map((item) => {
            const status = getScheduleStatus(item);

            return (
              <div
                key={item.key}
                className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/50 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Interval: {item.intervalKm > 0 ? `Every ${item.intervalKm.toLocaleString()} km` : ''}
                      {item.intervalKm > 0 && item.intervalMonths > 0 ? ' or ' : ''}
                      {item.intervalMonths > 0 ? `${item.intervalMonths} months` : ''}
                    </div>
                  </div>

                  <div>
                    {status.isOverdue ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Overdue!
                      </span>
                    ) : status.isDueSoon ? (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due Soon
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Good
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>
                    Last: {item.lastDoneKm > 0 ? `${item.lastDoneKm.toLocaleString()} km` : item.lastDoneDate}
                  </span>
                  <span>
                    {item.intervalKm > 0
                      ? `${Math.max(0, item.intervalKm - status.kmPassed).toLocaleString()} km remaining`
                      : `${Math.max(0, item.intervalMonths - status.monthsPassed)} months remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Service Form */}
      <form
        onSubmit={handleAddServiceRecord}
        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-500" />
          Log Maintenance Service
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Service Type</label>
            <select
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {schedules.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
              <option value="General Checkup">General Inspection</option>
              <option value="Washing & Detailing">Car Detailing / Wash</option>
              <option value="Other Repair">Other Repair</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Odometer (km)</label>
            <input
              type="number"
              placeholder={String(currentOdometer)}
              value={logOdo}
              onChange={(e) => setLogOdo(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Cost ({currency})</label>
            <input
              type="number"
              placeholder="0.00"
              value={logCost}
              onChange={(e) => setLogCost(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Workshop / Center</label>
            <input
              type="text"
              placeholder="e.g. Authorized Dealer"
              value={logWorkshop}
              onChange={(e) => setLogWorkshop(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Service notes or parts replaced (e.g. Changed air filter, synthetic engine oil 3.5L)..."
            value={logNotes}
            onChange={(e) => setLogNotes(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shrink-0"
          >
            Add Record
          </button>
        </div>
      </form>

      {/* Service History Log */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            Past Service History ({records.length} records)
          </h3>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Total Maintenance Cost: {currency}{totalSpent.toLocaleString()}
          </span>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            No maintenance records logged yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-72 overflow-y-auto">
            {records.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-3 group">
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {rec.serviceType}
                  </div>
                  <div className="text-xs text-slate-400">
                    {rec.date} • {rec.odometer.toLocaleString()} km • {rec.workshop}
                  </div>
                  {rec.notes && (
                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                      "{rec.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {currency}{rec.cost.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteRecord(rec.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
