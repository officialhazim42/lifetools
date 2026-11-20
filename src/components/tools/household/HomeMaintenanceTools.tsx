import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Clock,
  Calendar,
  AlertTriangle,
  Droplet,
  Zap,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  RotateCcw
} from 'lucide-react';
import { householdDB } from '../../../utils/householdDB';
import { HomeMaintenanceRecord, HomeReminder, HomeRepairExpense } from '../../../types/household';

// 46. Home Maintenance Tracker
export const HomeMaintenanceTracker: React.FC = () => {
  const [records, setRecords] = useState<HomeMaintenanceRecord[]>([]);
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState<HomeMaintenanceRecord['category']>('hvac');
  const [freq, setFreq] = useState<HomeMaintenanceRecord['frequency']>('biannual');
  const [nextDue, setNextDue] = useState('2027-01-15');

  useEffect(() => {
    householdDB.getMaintenanceRecords().then(data => {
      if (data.length === 0) {
        const seed: HomeMaintenanceRecord[] = [
          { id: 'm1', title: 'HVAC Seasonal Tune-Up & Coil Cleaning', category: 'hvac', frequency: 'biannual', nextDue: '2027-04-10', cost: 120, status: 'pending', createdAt: new Date().toISOString() },
          { id: 'm2', title: 'Water Heater Sediment Flush', category: 'plumbing', frequency: 'annual', nextDue: '2026-12-05', status: 'pending', createdAt: new Date().toISOString() },
          { id: 'm3', title: 'Smoke Detector Battery Replacement', category: 'electrical', frequency: 'annual', nextDue: '2027-01-01', status: 'completed', createdAt: new Date().toISOString() }
        ];
        seed.forEach(s => householdDB.saveMaintenanceRecord(s));
        setRecords(seed);
      } else {
        setRecords(data);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: HomeMaintenanceRecord = {
      id: 'm_' + Date.now(),
      title: title.trim(),
      category: cat,
      frequency: freq,
      nextDue,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    await householdDB.saveMaintenanceRecord(item);
    setRecords([...records, item]);
    setTitle('');
  };

  const handleDelete = async (id: string) => {
    await householdDB.deleteMaintenanceRecord(id);
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-start gap-3">
        <Wrench className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-slate-900 dark:text-white">Local Home Maintenance Scheduler</p>
          <p className="mt-0.5">
            Log recurring appliance tune-ups, filter replacements, and equipment servicing. Stored securely on your device.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="Maintenance item (e.g. Gutter Cleaning)..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select value={cat} onChange={e => setCat(e.target.value as any)} className="px-2 py-2 border rounded-lg">
          <option value="hvac">HVAC</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="appliances">Appliances</option>
          <option value="exterior">Exterior</option>
        </select>
        <select value={freq} onChange={e => setFreq(e.target.value as any)} className="px-2 py-2 border rounded-lg">
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="biannual">Biannual</option>
          <option value="annual">Annual</option>
        </select>
        <input
          type="date"
          value={nextDue}
          onChange={e => setNextDue(e.target.value)}
          className="px-2 py-2 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="space-y-2 text-xs">
        {records.map(rec => (
          <div key={rec.id} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.title}</span>
              <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                Category: {rec.category} • Frequency: {rec.frequency} • Next Due: {rec.nextDue}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                rec.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {rec.status}
              </span>
              <button onClick={() => handleDelete(rec.id)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 47. Appliance Maintenance Reminder
export const ApplianceMaintenanceReminder: React.FC = () => {
  return <HomeMaintenanceTracker />;
};

// 48. AC Service Reminder
export const AcServiceReminder: React.FC = () => {
  const [filterCleanDays, setFilterCleanDays] = useState<number>(30);
  const [coilServiceMonths, setCoilServiceMonths] = useState<number>(6);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-5 bg-sky-950 text-white rounded-xl space-y-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Wrench className="w-4 h-4 text-sky-400" /> Air Conditioner Maintenance Schedule
        </h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-sky-900/60 rounded-lg">
            <span className="text-sky-300 block">Air Mesh Filters:</span>
            <strong className="text-sm">Clean every {filterCleanDays} days</strong>
            <p className="text-[11px] text-sky-300/80 mt-1">Wash under warm water to maintain 100% airflow</p>
          </div>
          <div className="p-3 bg-sky-900/60 rounded-lg">
            <span className="text-sky-300 block">Deep Chemical Service:</span>
            <strong className="text-sm">Every {coilServiceMonths} months</strong>
            <p className="text-[11px] text-sky-300/80 mt-1">Evaporator coil wash & refrigerant pressure check</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 49. Home Equipment Maintenance Tracker
export const HomeEquipmentMaintenanceTracker: React.FC = () => {
  return <HomeMaintenanceTracker />;
};

// 50. Plumbing Maintenance Checklist
export const PlumbingMaintenanceChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Inspect under-sink P-traps and supply shutoff valves for moisture', done: false },
    { id: 2, text: 'Test toilet fill valve & flapper seal with food coloring leak test', done: true },
    { id: 3, text: 'Drain 2-3 gallons from water heater drain valve to clear sediment', done: false },
    { id: 4, text: 'Clean aerators on all sink faucets and showerheads', done: false },
    { id: 5, text: 'Check washing machine rubber supply hoses for bulges or cracks', done: true }
  ]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
        <h4 className="font-semibold text-xs mb-3 flex items-center gap-2">
          <Droplet className="w-4 h-4 text-cyan-500" /> Preventative Plumbing Checklist
        </h4>
        <div className="space-y-2 text-xs">
          {items.map(it => (
            <div
              key={it.id}
              onClick={() => setItems(items.map(x => x.id === it.id ? { ...x, done: !x.done } : x))}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border flex items-center gap-3 cursor-pointer"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${it.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                {it.done && <Check className="w-3 h-3" />}
              </div>
              <span className={it.done ? 'line-through text-slate-400' : ''}>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 51. Electrical Maintenance Checklist
export const ElectricalMaintenanceChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Press "TEST" button on all GFCI outlets in bathrooms, kitchen & garage', done: false },
    { id: 2, text: 'Inspect appliance power cords for fraying or loose wall plugs', done: true },
    { id: 3, text: 'Check electrical service panel for warm breakers or buzzing noises', done: false },
    { id: 4, text: 'Replace batteries in all home smoke alarms and CO detectors', done: true }
  ]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
        <h4 className="font-semibold text-xs mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Electrical Safety Inspection Checklist
        </h4>
        <div className="space-y-2 text-xs">
          {items.map(it => (
            <div
              key={it.id}
              onClick={() => setItems(items.map(x => x.id === it.id ? { ...x, done: !x.done } : x))}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border flex items-center gap-3 cursor-pointer"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${it.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                {it.done && <Check className="w-3 h-3" />}
              </div>
              <span className={it.done ? 'line-through text-slate-400' : ''}>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 52. Water Tank Cleaning Reminder
export const WaterTankCleaningReminder: React.FC = () => {
  const [capacityLiters, setCapacityLiters] = useState<number>(2000);
  const [lastCleanDate, setLastCleanDate] = useState<string>('2026-06-01');

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-5 bg-cyan-950 text-white rounded-xl space-y-3">
        <h4 className="font-semibold text-sm">Overhead & Underground Water Tank Disinfection</h4>
        <p className="text-xs text-cyan-200">Recommended service cycle: Every 6 months (Semi-annually)</p>
        <div className="grid grid-cols-2 gap-3 text-xs pt-2">
          <div>
            <label className="text-cyan-300 block mb-1">Tank Capacity (L)</label>
            <input
              type="number"
              value={capacityLiters}
              onChange={e => setCapacityLiters(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-cyan-900 text-white rounded border border-cyan-700"
            />
          </div>
          <div>
            <label className="text-cyan-300 block mb-1">Last Cleaned Date</label>
            <input
              type="date"
              value={lastCleanDate}
              onChange={e => setLastCleanDate(e.target.value)}
              className="w-full px-2 py-1.5 bg-cyan-900 text-white rounded border border-cyan-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 53. Filter Replacement Reminder
export const FilterReplacementReminder: React.FC = () => {
  const filters = [
    { name: 'HVAC Air Filter (MERV 11)', interval: 'Every 90 Days', status: 'Due in 24 Days' },
    { name: 'Refrigerator Water Filter', interval: 'Every 6 Months', status: 'Good (3 Months left)' },
    { name: 'Kitchen Range Grease Filter', interval: 'Monthly Degrease', status: 'Clean This Weekend' },
    { name: 'HEPA Room Air Purifier', interval: 'Every 12 Months', status: 'Good (7 Months left)' }
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="space-y-2">
        {filters.map((f, i) => (
          <div key={i} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{f.name}</span>
              <p className="text-[11px] text-slate-400">Cycle: {f.interval}</p>
            </div>
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300 text-[11px]">
              {f.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 54. Home Repair Expense Tracker
export const HomeRepairExpenseTracker: React.FC = () => {
  const [repairs, setRepairs] = useState<HomeRepairExpense[]>([]);
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState<number>(0);
  const [cat, setCat] = useState<HomeRepairExpense['category']>('plumbing');

  useEffect(() => {
    householdDB.getRepairExpenses().then(data => {
      if (data.length === 0) {
        const seed: HomeRepairExpense[] = [
          { id: 'r1', date: '2026-10-12', description: 'Replaced kitchen faucet cartridge', category: 'plumbing', amount: 85, contractor: 'Self', isEmergency: false, createdAt: new Date().toISOString() },
          { id: 'r2', date: '2026-09-20', description: 'HVAC Capacitor replacement', category: 'hvac', amount: 220, contractor: 'AirPro Techs', isEmergency: true, createdAt: new Date().toISOString() }
        ];
        seed.forEach(s => householdDB.saveRepairExpense(s));
        setRepairs(seed);
      } else {
        setRepairs(data);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || amt <= 0) return;
    const item: HomeRepairExpense = {
      id: 'rep_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      description: desc.trim(),
      category: cat,
      amount: amt,
      createdAt: new Date().toISOString()
    };
    await householdDB.saveRepairExpense(item);
    setRepairs([...repairs, item]);
    setDesc('');
    setAmt(0);
  };

  const total = repairs.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <h3 className="font-semibold text-sm">Home Repairs & Maintenance Ledger</h3>
          <p className="text-slate-500">{repairs.length} maintenance repairs recorded</p>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Total Spent:</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${total.toLocaleString()}
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="Repair description..."
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select value={cat} onChange={e => setCat(e.target.value as any)} className="px-2 py-2 border rounded-lg">
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="hvac">HVAC</option>
          <option value="roofing">Roofing</option>
          <option value="appliance">Appliance</option>
        </select>
        <input
          type="number"
          placeholder="Cost ($)"
          value={amt || ''}
          onChange={e => setAmt(Number(e.target.value))}
          className="w-24 px-2 py-2 border rounded-lg font-mono"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="space-y-2 text-xs">
        {repairs.map(r => (
          <div key={r.id} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{r.description}</span>
              <p className="text-[11px] text-slate-400 capitalize">{r.date} • {r.category} • {r.contractor || 'Contractor'}</p>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white">${r.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 55. Warranty Expiry Reminder
export const WarrantyExpiryReminder: React.FC = () => {
  const warranties = [
    { item: 'Bosch Dishwasher 800 Series', purchase: '2024-05-10', warrantyYears: 2, status: 'Active (Expires May 2026)' },
    { item: 'LG Inverter Refrigerator', purchase: '2023-08-15', warrantyYears: 10, status: 'Active Compressor Warranty (2033)' },
    { item: 'Sony Bravia 4K TV', purchase: '2025-01-20', warrantyYears: 1, status: 'Active (Expires Jan 2027)' }
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="space-y-2 text-xs">
        {warranties.map((w, i) => (
          <div key={i} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{w.item}</span>
              <p className="text-[11px] text-slate-400">Purchased: {w.purchase} • {w.warrantyYears} Yr Coverage</p>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded font-medium text-[10px]">
              {w.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
