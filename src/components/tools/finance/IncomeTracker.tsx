import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  Coins,
  Plus,
  Trash2,
  TrendingUp,
  Download,
  DollarSign
} from 'lucide-react';

interface IncomeSource {
  id: string;
  source: string;
  amount: number;
  frequency: 'Monthly' | 'Annual' | 'Bi-Weekly' | 'Weekly' | 'One-Time';
  category: string;
}

const STORAGE_KEY = 'lifetools_income_tracker';
const CURRENCY_KEY = 'lifetools_pref_currency';

const DEFAULT_INCOMES: IncomeSource[] = [
  { id: 'inc_1', source: 'Primary Engineering Salary', amount: 85000, frequency: 'Monthly', category: 'Employment' },
  { id: 'inc_2', source: 'Software Freelance & Consulting', amount: 25000, frequency: 'Monthly', category: 'Freelance' },
  { id: 'inc_3', source: 'Dividend Yield', amount: 3500, frequency: 'Monthly', category: 'Investments' }
];

export const IncomeTracker: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [incomes, setIncomes] = useState<IncomeSource[]>(() => {
    return storage.get<IncomeSource[]>(STORAGE_KEY, DEFAULT_INCOMES);
  });

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<IncomeSource['frequency']>('Monthly');
  const [category, setCategory] = useState('Employment');

  useEffect(() => {
    storage.set(STORAGE_KEY, incomes);
  }, [incomes]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!source.trim()) {
      showToast('Enter income source title', 'warning');
      return;
    }
    if (isNaN(val) || val <= 0) {
      showToast('Enter valid income amount', 'warning');
      return;
    }

    const newInc: IncomeSource = {
      id: 'inc_' + Date.now(),
      source: source.trim(),
      amount: val,
      frequency,
      category
    };

    setIncomes(prev => [...prev, newInc]);
    setSource('');
    setAmount('');
    showToast('Income stream added!');
  };

  const handleDelete = (id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  // Convert each income source to normalized monthly amount
  const toMonthly = (item: IncomeSource) => {
    switch (item.frequency) {
      case 'Monthly': return item.amount;
      case 'Annual': return item.amount / 12;
      case 'Bi-Weekly': return (item.amount * 26) / 12;
      case 'Weekly': return (item.amount * 52) / 12;
      case 'One-Time': return 0;
    }
  };

  const totalMonthlyIncome = incomes.reduce((sum, i) => sum + toMonthly(i), 0);
  const totalAnnualProjected = totalMonthlyIncome * 12;

  const handleExportCsv = () => {
    const headers = ['Source', 'Category', 'Frequency', `Raw Amount (${currency})`, `Monthly Normalized (${currency})`];
    const rows = incomes.map(i => [
      i.source,
      i.category,
      i.frequency,
      i.amount.toFixed(2),
      toMonthly(i).toFixed(2)
    ]);
    storage.exportToCsv('lifetools-income.csv', headers, rows);
    showToast('Exported income streams to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Monthly Income
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {currency} {formatNumber(totalMonthlyIncome, 0)}
          </div>
          <div className="text-[11px] text-slate-400">Recurring normalized monthly</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Annual Run Rate
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {currency} {formatNumber(totalAnnualProjected, 0)}
          </div>
          <div className="text-[11px] text-slate-400">12-month projection</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Income Streams
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {incomes.length}
          </div>
          <div className="text-[11px] text-slate-400">Diversified sources</div>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Source Name
          </label>
          <input
            type="text"
            placeholder="e.g. Full-time job, Side business, Rental"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Amount ({currency})
          </label>
          <input
            type="number"
            min="1"
            placeholder="50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            className="input-base text-xs"
          >
            <option value="Monthly">Monthly</option>
            <option value="Annual">Annual</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Weekly">Weekly</option>
            <option value="One-Time">One-Time</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-end">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-3.5 h-3.5" /> Add Income Stream
          </button>
        </div>
      </form>

      {/* Income List Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Income Streams</h3>
          <button onClick={handleExportCsv} className="btn-secondary text-xs py-1 px-3">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5">Source</th>
              <th className="p-3.5">Frequency</th>
              <th className="p-3.5 text-right">Raw Amount</th>
              <th className="p-3.5 text-right">Monthly Equivalent</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {incomes.map(inc => (
              <tr key={inc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5 font-sans font-semibold text-slate-900 dark:text-white">
                  {inc.source}
                </td>
                <td className="p-3.5 font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {inc.frequency}
                  </span>
                </td>
                <td className="p-3.5 text-right text-slate-500">
                  {currency} {formatNumber(inc.amount, 2)}
                </td>
                <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {currency} {formatNumber(toMonthly(inc), 2)}
                </td>
                <td className="p-3.5 text-right font-sans">
                  <button
                    onClick={() => handleDelete(inc.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
