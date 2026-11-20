import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Sparkles,
  Calendar,
  Layers,
  ShoppingBag,
  Package,
  Ruler,
  Maximize2,
  Box,
  Truck,
  Plus,
  Trash2,
  Check,
  Search,
  Printer,
  RotateCcw
} from 'lucide-react';
import { householdDB } from '../../../utils/householdDB';
import { HouseholdChore, InventoryItem, HouseholdShoppingItem } from '../../../types/household';

// 31. Household Chore Planner
export const HouseholdChorePlanner: React.FC = () => {
  const [chores, setChores] = useState<HouseholdChore[]>([]);
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('Living Room');
  const [assignee, setAssignee] = useState('');
  const [freq, setFreq] = useState<HouseholdChore['frequency']>('daily');

  useEffect(() => {
    householdDB.getChores().then(data => {
      if (data.length === 0) {
        // Seed default chores
        const initial: HouseholdChore[] = [
          { id: 'c1', title: 'Vacuum carpet & rugs', room: 'Living Room', assignedTo: 'Alex', frequency: 'daily', isCompleted: false, createdAt: new Date().toISOString() },
          { id: 'c2', title: 'Wipe kitchen counters', room: 'Kitchen', assignedTo: 'Jordan', frequency: 'daily', isCompleted: true, createdAt: new Date().toISOString() },
          { id: 'c3', title: 'Clean bathroom sinks', room: 'Bathroom', assignedTo: 'Taylor', frequency: 'weekly', isCompleted: false, createdAt: new Date().toISOString() }
        ];
        initial.forEach(c => householdDB.saveChore(c));
        setChores(initial);
      } else {
        setChores(data);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item: HouseholdChore = {
      id: 'chore_' + Date.now(),
      title: title.trim(),
      room,
      assignedTo: assignee.trim() || undefined,
      frequency: freq,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    await householdDB.saveChore(item);
    setChores([...chores, item]);
    setTitle('');
  };

  const handleToggle = async (id: string) => {
    await householdDB.toggleChoreCompletion(id);
    const updated = await householdDB.getChores();
    setChores(updated);
  };

  const handleDelete = async (id: string) => {
    await householdDB.deleteChore(id);
    setChores(chores.filter(c => c.id !== id));
  };

  const completedCount = chores.filter(c => c.isCompleted).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-sm">Household Chore Planner</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {completedCount} of {chores.length} tasks completed ({chores.length ? Math.round((completedCount / chores.length) * 100) : 0}%)
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" /> Print Chores
        </button>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="New chore title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select
          value={room}
          onChange={e => setRoom(e.target.value)}
          className="px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        >
          <option>Living Room</option>
          <option>Kitchen</option>
          <option>Bathroom</option>
          <option>Bedroom</option>
          <option>Outdoor / Yard</option>
        </select>
        <input
          type="text"
          placeholder="Assignee (e.g. Alex)"
          value={assignee}
          onChange={e => setAssignee(e.target.value)}
          className="w-28 px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select
          value={freq}
          onChange={e => setFreq(e.target.value as any)}
          className="px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="space-y-2">
        {chores.map(chore => (
          <div
            key={chore.id}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              chore.isCompleted
                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(chore.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center ${
                  chore.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {chore.isCompleted && <Check className="w-3.5 h-3.5" />}
              </button>
              <div>
                <span className={`font-medium ${chore.isCompleted ? 'line-through text-slate-400' : ''}`}>
                  {chore.title}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">{chore.room}</span>
                  <span className="capitalize">{chore.frequency}</span>
                  {chore.assignedTo && <span>• Assigned: {chore.assignedTo}</span>}
                </div>
              </div>
            </div>
            <button onClick={() => handleDelete(chore.id)} className="text-slate-400 hover:text-rose-500 p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 32. Cleaning Schedule Generator
export const CleaningScheduleGenerator: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');

  const schedule: Record<string, string[]> = {
    Monday: ['Dust high surfaces & ceiling fans', 'Wipe down baseboards', 'Empty all bedroom trash bins'],
    Tuesday: ['Deep scrub kitchen sink & disposal', 'Wipe microwave & stove hood', 'Mop kitchen tile floor'],
    Wednesday: ['Scrub shower tiles & glass door', 'Disinfect bathroom toilet & counter', 'Wash bath mats'],
    Thursday: ['Vacuum all bedroom carpets & under beds', 'Dust blinds and window sills', 'Declutter entryway'],
    Friday: ['Change all bed sheets & pillowcases', 'Wash and fold household towels', 'Sanitize door handles'],
    Saturday: ['Outdoor patio sweeping / yard tidy', 'Clean refrigerator interior shelves', 'Discard expired food'],
    Sunday: ['Household planning & rest', 'Run washing machine tub clean cycle', 'Restock paper goods']
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.keys(schedule).map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              selectedDay === day
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
        <h4 className="font-semibold text-sm mb-3 text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" /> {selectedDay} Focused Routine
        </h4>
        <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {schedule[selectedDay].map((task, idx) => (
            <li key={idx} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                {idx + 1}
              </span>
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// 33. Daily Cleaning Checklist
export const DailyCleaningChecklist: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Make bed upon waking', done: true },
    { id: 2, text: 'Wipe kitchen counters and dining table', done: false },
    { id: 3, text: 'Empty kitchen sink & run dishwasher', done: true },
    { id: 4, text: 'Quick 10-minute floor sweep / cordless vacuum', done: false },
    { id: 5, text: 'Empty kitchen compost & trash if full', done: false },
    { id: 6, text: '10-minute night-time clutter reset in living room', done: false }
  ]);

  const toggle = (id: number) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex justify-between items-center text-xs">
        <span className="font-semibold text-emerald-900 dark:text-emerald-200">
          Daily Reset Progress: {doneCount} of {tasks.length}
        </span>
        <button
          onClick={() => setTasks(tasks.map(t => ({ ...t, done: false })))}
          className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset All
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map(t => (
          <div
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`p-3 rounded-xl border flex items-center gap-3 text-xs cursor-pointer select-none transition-colors ${
              t.done ? 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 line-through' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${t.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
              {t.done && <Check className="w-3 h-3" />}
            </div>
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 34. Weekly Cleaning Planner
export const WeeklyCleaningPlanner: React.FC = () => {
  return <CleaningScheduleGenerator />;
};

// 35. Monthly Cleaning Planner
export const MonthlyCleaningPlanner: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Clean and degrease range hood grease filters', done: false },
    { id: 2, text: 'Run washing machine self-clean / descaling cycle', done: false },
    { id: 3, text: 'Vacuum refrigerator condenser coils', done: true },
    { id: 4, text: 'Wipe down interior door frames and baseboards', done: false },
    { id: 5, text: 'Test all smoke and carbon monoxide detectors', done: true },
    { id: 6, text: 'Wash window panes and dust window sills', done: false }
  ]);

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
        <h4 className="font-semibold text-xs mb-2">Monthly Deep Maintenance & Cleaning</h4>
        <div className="space-y-2 text-xs">
          {tasks.map(t => (
            <div
              key={t.id}
              onClick={() => setTasks(tasks.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}
              className="p-3 bg-white dark:bg-slate-800 rounded-lg border flex items-center gap-3 cursor-pointer"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${t.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                {t.done && <Check className="w-3 h-3" />}
              </div>
              <span className={t.done ? 'line-through text-slate-400' : ''}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 36. Laundry Schedule Planner
export const LaundrySchedulePlanner: React.FC = () => {
  const loads = [
    { day: 'Tuesday', type: 'Everyday Dark & Color Clothes', temp: 'Cold 30°C', cycle: 'Normal' },
    { day: 'Thursday', type: 'Whites & Light Cottons', temp: 'Warm 40°C', cycle: 'Heavy Duty' },
    { day: 'Saturday', type: 'Bed Sheets, Pillowcases & Blankets', temp: 'Hot 60°C', cycle: 'Sanitize / Bedding' },
    { day: 'Sunday', type: 'Bath & Hand Towels', temp: 'Hot 60°C', cycle: 'Towels' }
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="grid grid-cols-1 gap-3">
        {loads.map((l, i) => (
          <div key={i} className="p-4 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">{l.day}</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{l.type}</p>
              <span className="text-[11px] text-slate-500">Wash: {l.temp} • Cycle: {l.cycle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 37. Grocery Inventory Manager
export const GroceryInventoryManager: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState<InventoryItem['category']>('groceries');

  useEffect(() => {
    householdDB.getInventories().then(data => {
      if (data.length === 0) {
        const seed: InventoryItem[] = [
          { id: 'inv1', name: 'Whole Wheat Bread', category: 'groceries', quantity: 1, unit: 'loaf', expiryDate: '2026-11-25', updatedAt: new Date().toISOString() },
          { id: 'inv2', name: 'Greek Yogurt', category: 'fridge', quantity: 2, unit: 'tubs', expiryDate: '2026-11-28', updatedAt: new Date().toISOString() },
          { id: 'inv3', name: 'Basmati Rice', category: 'pantry', quantity: 5, unit: 'kg', updatedAt: new Date().toISOString() }
        ];
        seed.forEach(s => householdDB.saveInventoryItem(s));
        setItems(seed);
      } else {
        setItems(data);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const item: InventoryItem = {
      id: 'inv_' + Date.now(),
      name: name.trim(),
      category,
      quantity: qty,
      updatedAt: new Date().toISOString()
    };
    await householdDB.saveInventoryItem(item);
    setItems([...items, item]);
    setName('');
  };

  const handleDelete = async (id: string) => {
    await householdDB.deleteInventoryItem(id);
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="Item name (e.g. Olive Oil)..."
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <input
          type="number"
          min="1"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          className="w-16 px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value as any)}
          className="px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        >
          <option value="groceries">Groceries</option>
          <option value="pantry">Pantry</option>
          <option value="fridge">Fridge</option>
          <option value="freezer">Freezer</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-1 font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {items.map(it => (
          <div key={it.id} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{it.name}</span>
              <p className="text-[11px] text-slate-400 capitalize">
                Qty: {it.quantity} {it.unit || 'units'} | Location: {it.category}
              </p>
            </div>
            <button onClick={() => handleDelete(it.id)} className="text-slate-400 hover:text-rose-500 p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 38. Pantry Inventory Tracker
export const PantryInventoryTracker: React.FC = () => {
  return <GroceryInventoryManager />;
};

// 39. Refrigerator Inventory Tracker
export const RefrigeratorInventoryTracker: React.FC = () => {
  return <GroceryInventoryManager />;
};

// 40. Household Shopping List
export const HouseholdShoppingList: React.FC = () => {
  const [items, setItems] = useState<HouseholdShoppingItem[]>([]);
  const [name, setName] = useState('');
  const [cat, setCat] = useState('Groceries');

  useEffect(() => {
    householdDB.getShoppingItems().then(data => {
      if (data.length === 0) {
        const seed: HouseholdShoppingItem[] = [
          { id: 's1', name: 'Almond Milk (Unsweetened)', category: 'Dairy', quantity: 2, isPurchased: false, createdAt: new Date().toISOString() },
          { id: 's2', name: 'Dishwasher Pods', category: 'Cleaning', quantity: 1, isPurchased: true, createdAt: new Date().toISOString() },
          { id: 's3', name: 'Paper Towels (Pack of 6)', category: 'Household', quantity: 1, isPurchased: false, createdAt: new Date().toISOString() }
        ];
        seed.forEach(s => householdDB.saveShoppingItem(s));
        setItems(seed);
      } else {
        setItems(data);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const item: HouseholdShoppingItem = {
      id: 'shop_' + Date.now(),
      name: name.trim(),
      category: cat,
      quantity: 1,
      isPurchased: false,
      createdAt: new Date().toISOString()
    };
    await householdDB.saveShoppingItem(item);
    setItems([...items, item]);
    setName('');
  };

  const handleToggle = async (id: string) => {
    await householdDB.toggleShoppingItem(id);
    const updated = await householdDB.getShoppingItems();
    setItems(updated);
  };

  const handleDelete = async (id: string) => {
    await householdDB.deleteShoppingItem(id);
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="Add shopping item..."
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          className="px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        >
          <option>Groceries</option>
          <option>Dairy</option>
          <option>Cleaning</option>
          <option>Household</option>
          <option>Personal Care</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-1 font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="space-y-2">
        {items.map(it => (
          <div
            key={it.id}
            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              it.isPurchased ? 'bg-slate-50 dark:bg-slate-900/40 text-slate-400 line-through' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggle(it.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center ${
                  it.isPurchased ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                }`}
              >
                {it.isPurchased && <Check className="w-3 h-3" />}
              </button>
              <div>
                <span className="font-medium">{it.name}</span>
                <span className="text-[10px] text-slate-400 ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                  {it.category}
                </span>
              </div>
            </div>
            <button onClick={() => handleDelete(it.id)} className="text-slate-400 hover:text-rose-500">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 41. Home Inventory Manager
export const HomeInventoryManager: React.FC = () => {
  const [assets, setAssets] = useState<Array<{ id: string; name: string; room: string; serial: string; value: number }>>([
    { id: '1', name: 'Smart OLED TV 65"', room: 'Living Room', serial: 'LG-65C2-991', value: 1800 },
    { id: '2', name: 'Dyson Cordless Vacuum', room: 'Utility', serial: 'V15-DY-4412', value: 650 },
    { id: '3', name: 'Espresso Machine', room: 'Kitchen', serial: 'BES870XL', value: 700 }
  ]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('Living Room');
  const [val, setVal] = useState<number>(0);

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAssets([...assets, { id: Date.now().toString(), name, room, serial: 'N/A', value: val }]);
    setName('');
    setVal(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <h3 className="font-semibold text-sm">Home Asset & Insurance Inventory</h3>
          <p className="text-slate-500 mt-0.5">{assets.length} items cataloged for home insurance records</p>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Total Asset Value:</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <input
          type="text"
          placeholder="Asset name (e.g. MacBook Pro)..."
          value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <select
          value={room}
          onChange={e => setRoom(e.target.value)}
          className="px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        >
          <option>Living Room</option>
          <option>Kitchen</option>
          <option>Bedroom</option>
          <option>Office</option>
        </select>
        <input
          type="number"
          placeholder="Est Value ($)"
          value={val || ''}
          onChange={e => setVal(Number(e.target.value))}
          className="w-28 px-2 py-2 bg-white dark:bg-slate-800 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-1 font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="space-y-2 text-xs">
        {assets.map(a => (
          <div key={a.id} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{a.name}</span>
              <p className="text-[11px] text-slate-400">{a.room} • Serial: {a.serial}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-slate-900 dark:text-white">${a.value.toLocaleString()}</span>
              <button onClick={() => setAssets(assets.filter(x => x.id !== a.id))} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 42. Furniture Measurement Planner
export const FurnitureMeasurementPlanner: React.FC = () => {
  const [itemW, setItemW] = useState<number>(36);
  const [itemD, setItemD] = useState<number>(34);
  const [itemH, setItemH] = useState<number>(84);
  const [doorWidth, setDoorWidth] = useState<number>(32);
  const [doorHeight, setDoorHeight] = useState<number>(80);

  // Clearance check: Item can pass if smallest 2 dimensions are smaller than doorway
  const dims = [itemW, itemD, itemH].sort((a, b) => a - b);
  const willFit = dims[0] < doorWidth && dims[1] < doorHeight;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">Furniture Dimensions (Inches)</h4>
          <div>
            <label className="text-slate-500 block">Width</label>
            <input type="number" value={itemW} onChange={e => setItemW(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
          </div>
          <div>
            <label className="text-slate-500 block">Depth</label>
            <input type="number" value={itemD} onChange={e => setItemD(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
          </div>
          <div>
            <label className="text-slate-500 block">Height</label>
            <input type="number" value={itemH} onChange={e => setItemH(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">Doorway / Entry Clearance (Inches)</h4>
          <div>
            <label className="text-slate-500 block">Door Opening Width</label>
            <input type="number" value={doorWidth} onChange={e => setDoorWidth(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
          </div>
          <div>
            <label className="text-slate-500 block">Door Opening Height</label>
            <input type="number" value={doorHeight} onChange={e => setDoorHeight(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-xl border text-center ${
        willFit ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-900 dark:text-rose-200'
      }`}>
        <span className="text-xs uppercase font-semibold">Clearance Verification</span>
        <div className="text-2xl font-bold mt-1">
          {willFit ? '✓ Item Fits Through Doorway' : '✕ Clearance Warning: Will Not Fit Standard'}
        </div>
        <p className="text-xs mt-1 opacity-80">
          Smallest 2 dimensions: {dims[0]}" × {dims[1]}" vs Door: {doorWidth}" × {doorHeight}"
        </p>
      </div>
    </div>
  );
};

// 43. Room Layout Planner
export const RoomLayoutPlanner: React.FC = () => {
  return <FurnitureMeasurementPlanner />;
};

// 44. Storage Space Calculator
export const StorageSpaceCalculator: React.FC = () => {
  const [boxes, setBoxes] = useState<number>(30);
  const [mattresses, setMattresses] = useState<number>(2);
  const [sofas, setSofas] = useState<number>(1);

  // Approx volume in cu ft: Box = 3 cu ft, Mattress = 35 cu ft, Sofa = 60 cu ft
  const totalCuFt = boxes * 3 + mattresses * 35 + sofas * 60;

  let unitSize = '5x5 (25 sq ft / 200 cu ft)';
  if (totalCuFt > 800) unitSize = '10x20 (200 sq ft / 1600 cu ft)';
  else if (totalCuFt > 400) unitSize = '10x10 (100 sq ft / 800 cu ft)';
  else if (totalCuFt > 200) unitSize = '5x10 (50 sq ft / 400 cu ft)';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Standard Boxes</label>
          <input type="number" value={boxes} onChange={e => setBoxes(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Beds / Mattresses</label>
          <input type="number" value={mattresses} onChange={e => setMattresses(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Sofas / Couches</label>
          <input type="number" value={sofas} onChange={e => setSofas(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="p-5 bg-indigo-950 text-white rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-indigo-300">Recommended Storage Unit</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">{unitSize}</div>
          <p className="text-xs text-indigo-300 mt-1">Total Estimated Volume: ~{totalCuFt} cubic feet</p>
        </div>
      </div>
    </div>
  );
};

// 45. Moving House Checklist
export const MovingHouseChecklist: React.FC = () => {
  const [stages, setStages] = useState([
    { stage: '8 Weeks Before', tasks: ['Purge unwanted items and hold garage sale / donate', 'Gather packing boxes, bubble wrap, and tape', 'Start binder for moving contracts and estimates'] },
    { stage: '4 Weeks Before', tasks: ['Submit change of address to postal service', 'Notify bank, credit cards, insurance, and subscriptions', 'Schedule disconnection of electricity, internet, and gas at old home'] },
    { stage: '1 Week Before', tasks: ['Pack essentials suitcase (toiletries, change of clothes, phone chargers)', 'Defrost refrigerator and freezer 24 hours prior', 'Confirm moving truck arrival window and parking permit'] },
    { stage: 'Moving Day', tasks: ['Conduct final walkthrough of empty property and take water/electric meter photos', 'Lock all windows and doors; hand over keys', 'Inspect delivered furniture boxes against inventory manifest'] }
  ]);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {stages.map((st, i) => (
        <div key={i} className="p-4 bg-white dark:bg-slate-900 border rounded-xl text-xs space-y-2">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[11px]">{st.stage}</span>
          <ul className="space-y-1.5">
            {st.tasks.map((t, j) => (
              <li key={j} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <input type="checkbox" className="rounded text-emerald-600" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
