import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  Receipt,
  Plus,
  Trash2,
  Download,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  PieChart
} from 'lucide-react';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  paymentMode: 'Cash' | 'UPI' | 'Card' | 'Net Banking';
  date: string;
  notes?: string;
}

const STORAGE_KEY = 'lifetools_expenses';
const CURRENCY_KEY = 'lifetools_pref_currency';

const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Utilities & Bills',
  'Entertainment',
  'Shopping',
  'Health & Medical',
  'Education',
  'Personal Care',
  'Other'
];

export const DailyExpenseTracker: React.FC = () => {
  const { showToast } = useToast();
  const [currency, setCurrency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    return storage.get<ExpenseItem[]>(STORAGE_KEY, [
      {
        id: 'exp_1',
        title: 'Weekly Grocery Store',
        amount: 1450,
        category: 'Groceries',
        paymentMode: 'UPI',
        date: today
      },
      {
        id: 'exp_2',
        title: 'Coffee & Snacks',
        amount: 180,
        category: 'Food & Dining',
        paymentMode: 'Cash',
        date: today
      }
    ]);
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [paymentMode, setPaymentMode] = useState<ExpenseItem['paymentMode']>('UPI');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    storage.set(STORAGE_KEY, expenses);
  }, [expenses]);

  useEffect(() => {
    storage.set(CURRENCY_KEY, currency);
  }, [currency]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      showToast('Please enter an expense description', 'warning');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast('Please enter a valid amount greater than 0', 'warning');
      return;
    }

    const newItem: ExpenseItem = {
      id: 'exp_' + Date.now(),
      title: title.trim(),
      amount: parsedAmount,
      category,
      paymentMode,
      date: date || new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [newItem, ...prev]);
    setTitle('');
    setAmount('');
    showToast('Expense recorded successfully!');
  };

  const handleDelete = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense removed', 'info');
  };

  const handleExportCsv = () => {
    if (expenses.length === 0) {
      showToast('No expense records to export', 'info');
      return;
    }
    const headers = ['Date', 'Title', 'Category', `Amount (${currency})`, 'Payment Mode'];
    const rows = expenses.map(e => [
      e.date,
      e.title,
      e.category,
      e.amount.toFixed(2),
      e.paymentMode
    ]);
    storage.exportToCsv('lifetools-expenses.csv', headers, rows);
    showToast('Exported expense records to CSV');
  };

  const filteredExpenses = expenses.filter(e => {
    if (filterCategory !== 'All' && e.category !== filterCategory) return false;
    return true;
  });

  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown for summary
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="space-y-6">
      {/* Overview & Currency Selector Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" /> Daily Expense Tracker
          </h2>
          <p className="text-xs text-slate-500">
            Total Logged: <span className="font-bold text-slate-900 dark:text-white text-sm">{currency} {formatNumber(totalExpense, 2)}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Currency:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="input-base text-xs py-1 px-2.5 w-24 font-bold"
            >
              <option value="₹">₹ INR</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="AED">AED</option>
              <option value="¥">¥ JPY</option>
            </select>
          </div>

          <button onClick={handleExportCsv} className="btn-secondary text-xs py-1.5 px-3">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Expense Title
          </label>
          <input
            type="text"
            placeholder="e.g. Lunch with team, Fuel, Groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Amount ({currency})
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-base text-xs"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Payment Mode
          </label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as any)}
            className="input-base text-xs"
          >
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Debit / Credit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-12">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-4 h-4" /> Add Expense Record
          </button>
        </div>
      </form>

      {/* Filter Ribbon */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">Filter Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-base text-xs py-1 px-2.5 w-44"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing {filteredExpenses.length} entries
        </span>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Payment</th>
              <th className="p-3.5 text-right">Amount</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-xs text-slate-400">
                  No expense records found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-slate-500 font-mono">
                    {new Date(exp.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                    {exp.title}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {exp.paymentMode}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {currency} {formatNumber(exp.amount, 2)}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
