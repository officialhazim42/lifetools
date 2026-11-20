import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  Wallet,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  PieChart,
  CheckCircle2
} from 'lucide-react';

interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  actual: number;
  type: 'Needs' | 'Wants' | 'Savings';
}

const STORAGE_KEY = 'lifetools_monthly_budget';
const CURRENCY_KEY = 'lifetools_pref_currency';

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: 'b1', name: 'Housing & Rent', allocated: 15000, actual: 15000, type: 'Needs' },
  { id: 'b2', name: 'Groceries & Food', allocated: 8000, actual: 7200, type: 'Needs' },
  { id: 'b3', name: 'Utilities & Internet', allocated: 3000, actual: 2850, type: 'Needs' },
  { id: 'b4', name: 'Dining Out & Entertainment', allocated: 4000, actual: 3400, type: 'Wants' },
  { id: 'b5', name: 'Shopping & Hobbies', allocated: 3000, actual: 2100, type: 'Wants' },
  { id: 'b6', name: 'Emergency Fund & SIP', allocated: 7000, actual: 7000, type: 'Savings' }
];

export const MonthlyBudgetPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    return storage.get<number>(`${STORAGE_KEY}_income`, 40000);
  });
  const [categories, setCategories] = useState<BudgetCategory[]>(() => {
    return storage.get<BudgetCategory[]>(STORAGE_KEY, DEFAULT_CATEGORIES);
  });

  const [newName, setNewName] = useState('');
  const [newAllocated, setNewAllocated] = useState('');
  const [newType, setNewType] = useState<BudgetCategory['type']>('Needs');

  useEffect(() => {
    storage.set(STORAGE_KEY, categories);
    storage.set(`${STORAGE_KEY}_income`, monthlyIncome);
  }, [categories, monthlyIncome]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const allocated = parseFloat(newAllocated);
    if (!newName.trim()) {
      showToast('Enter a category name', 'warning');
      return;
    }
    if (isNaN(allocated) || allocated <= 0) {
      showToast('Enter valid allocated budget amount', 'warning');
      return;
    }

    const newCat: BudgetCategory = {
      id: 'cat_' + Date.now(),
      name: newName.trim(),
      allocated,
      actual: 0,
      type: newType
    };

    setCategories(prev => [...prev, newCat]);
    setNewName('');
    setNewAllocated('');
    showToast('Budget category added');
  };

  const handleUpdateActual = (id: string, val: number) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, actual: Math.max(0, val) } : c))
    );
  };

  const handleDelete = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalActual = categories.reduce((sum, c) => sum + c.actual, 0);
  const remainingIncome = monthlyIncome - totalActual;

  // 50/30/20 Rule Calculations
  const needsActual = categories.filter(c => c.type === 'Needs').reduce((s, c) => s + c.actual, 0);
  const wantsActual = categories.filter(c => c.type === 'Wants').reduce((s, c) => s + c.actual, 0);
  const savingsActual = categories.filter(c => c.type === 'Savings').reduce((s, c) => s + c.actual, 0);

  const needsPercent = monthlyIncome > 0 ? Math.round((needsActual / monthlyIncome) * 100) : 0;
  const wantsPercent = monthlyIncome > 0 ? Math.round((wantsActual / monthlyIncome) * 100) : 0;
  const savingsPercent = monthlyIncome > 0 ? Math.round((savingsActual / monthlyIncome) * 100) : 0;

  const handleExportCsv = () => {
    const headers = ['Category', 'Type', `Budgeted (${currency})`, `Actual Spend (${currency})`, `Variance (${currency})`];
    const rows = categories.map(c => [
      c.name,
      c.type,
      c.allocated.toFixed(2),
      c.actual.toFixed(2),
      (c.allocated - c.actual).toFixed(2)
    ]);
    storage.exportToCsv('lifetools-monthly-budget.csv', headers, rows);
    showToast('Exported monthly budget to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Monthly Income Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" /> Monthly Budget Planner
          </h2>
          <p className="text-xs text-slate-500">
            Total Spent: <span className="font-bold text-slate-900 dark:text-white">{currency} {formatNumber(totalActual, 2)}</span> of {currency} {formatNumber(monthlyIncome, 2)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Monthly Income:</span>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
              className="input-base text-xs py-1.5 px-3 w-32 font-bold font-mono"
            />
          </div>

          <button onClick={handleExportCsv} className="btn-secondary text-xs py-1.5 px-3">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* 50/30/20 Heuristic Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Needs (Target 50%)</span>
            <span className="text-xs font-bold text-sky-500">{needsPercent}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {currency} {formatNumber(needsActual, 2)}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, needsPercent)}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Wants (Target 30%)</span>
            <span className="text-xs font-bold text-amber-500">{wantsPercent}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {currency} {formatNumber(wantsActual, 2)}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, wantsPercent)}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Savings (Target 20%)</span>
            <span className="text-xs font-bold text-emerald-500">{savingsPercent}%</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {currency} {formatNumber(savingsActual, 2)}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, savingsPercent)}%` }} />
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="New Category (e.g. Subscriptions, Gym, Fuel)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input-base text-xs flex-1"
        />
        <input
          type="number"
          placeholder="Allocated Budget"
          value={newAllocated}
          onChange={(e) => setNewAllocated(e.target.value)}
          className="input-base text-xs sm:w-36 font-mono"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as any)}
          className="input-base text-xs sm:w-32"
        >
          <option value="Needs">Needs</option>
          <option value="Wants">Wants</option>
          <option value="Savings">Savings</option>
        </select>
        <button type="submit" className="btn-primary text-xs py-2 px-4 shrink-0 w-full sm:w-auto">
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </form>

      {/* Categories Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Class</th>
              <th className="p-3.5 text-right">Budgeted</th>
              <th className="p-3.5 text-right">Actual Spend</th>
              <th className="p-3.5 text-right">Variance</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {categories.map(c => {
              const diff = c.allocated - c.actual;
              const isOver = diff < 0;

              return (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-slate-900 dark:text-white">
                    {c.name}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        c.type === 'Needs'
                          ? 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400'
                          : c.type === 'Wants'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    {currency} {formatNumber(c.allocated, 2)}
                  </td>
                  <td className="p-3.5 text-right">
                    <input
                      type="number"
                      value={c.actual}
                      onChange={(e) => handleUpdateActual(c.id, parseFloat(e.target.value) || 0)}
                      className="input-base text-xs py-1 px-2 w-28 text-right inline-block font-mono font-bold"
                    />
                  </td>
                  <td className={`p-3.5 text-right font-bold ${isOver ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isOver ? '-' : '+'}{currency} {formatNumber(Math.abs(diff), 2)}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      title="Delete category"
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
  );
};
