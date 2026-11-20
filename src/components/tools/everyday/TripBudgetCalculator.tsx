import React, { useState, useEffect } from 'react';
import { safeStorage, exportToCsv } from '../../../utils/storage';
import {
  Wallet,
  Plus,
  Trash2,
  Download,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  PieChart,
  Plane,
  Building,
  Utensils,
  Ticket,
  Car,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: string;
  title: string;
  amount: number;
  date: string;
}

interface CategoryBudget {
  key: string;
  label: string;
  icon: any;
  allocated: number;
}

const DEFAULT_CATEGORIES: CategoryBudget[] = [
  { key: 'transport', label: 'Flights & Long-distance Travel', icon: Plane, allocated: 15000 },
  { key: 'lodging', label: 'Hotel & Accommodation', icon: Building, allocated: 12000 },
  { key: 'food', label: 'Food & Dining', icon: Utensils, allocated: 8000 },
  { key: 'activities', label: 'Sightseeing & Activities', icon: Ticket, allocated: 5000 },
  { key: 'local_transit', label: 'Local Taxis & Transit', icon: Car, allocated: 3000 },
  { key: 'shopping', label: 'Shopping & Souvenirs', icon: ShoppingBag, allocated: 4000 },
  { key: 'emergency', label: 'Emergency Cushion / Buffer', icon: ShieldCheck, allocated: 3000 },
];

export const TripBudgetCalculator: React.FC = () => {
  const [currency, setCurrency] = useState<string>(() => {
    return safeStorage.getItem<string>('trip_calc_currency', '₹');
  });
  const [tripName, setTripName] = useState<string>(() => {
    return safeStorage.getItem<string>('trip_calc_name', 'Goa Holiday');
  });
  const [numTravelers, setNumTravelers] = useState<number>(() => {
    return safeStorage.getItem<number>('trip_calc_travelers', 2);
  });
  const [tripDays, setTripDays] = useState<number>(() => {
    return safeStorage.getItem<number>('trip_calc_days', 5);
  });

  const [categories, setCategories] = useState<CategoryBudget[]>(() => {
    return safeStorage.getItem<CategoryBudget[]>('trip_calc_categories', DEFAULT_CATEGORIES);
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    return safeStorage.getItem<ExpenseItem[]>('trip_calc_expenses', []);
  });

  // Expense form state
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState(DEFAULT_CATEGORIES[0].key);

  useEffect(() => {
    safeStorage.setItem('trip_calc_currency', currency);
    safeStorage.setItem('trip_calc_name', tripName);
    safeStorage.setItem('trip_calc_travelers', numTravelers);
    safeStorage.setItem('trip_calc_days', tripDays);
    safeStorage.setItem('trip_calc_categories', categories);
    safeStorage.setItem('trip_calc_expenses', expenses);
  }, [currency, tripName, numTravelers, tripDays, categories, expenses]);

  const handleUpdateAllocated = (key: string, val: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.key === key ? { ...c, allocated: Math.max(0, val) } : c))
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expAmount);
    if (!expTitle.trim() || isNaN(amt) || amt <= 0) return;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: expCategory,
      title: expTitle.trim(),
      amount: amt,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setExpTitle('');
    setExpAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleExportCsv = () => {
    const rows = expenses.map((e) => ({
      Date: e.date,
      Category: categories.find((c) => c.key === e.category)?.label || e.category,
      Title: e.title,
      Amount: e.amount,
      Currency: currency
    }));

    exportToCsv(
      [
        ['Date', 'Category', 'Title', `Amount (${currency})`],
        ...rows.map((r) => [r.Date, r.Category, r.Title, String(r.Amount)])
      ],
      `${tripName.toLowerCase().replace(/\s+/g, '-')}-expenses`
    );
  };

  const handleResetTrip = () => {
    if (window.confirm('Reset this trip budget and clear all expenses?')) {
      setCategories(DEFAULT_CATEGORIES);
      setExpenses([]);
    }
  };

  // Calculations
  const totalBudget = categories.reduce((sum, c) => sum + (c.allocated || 0), 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const budgetPerPerson = Math.round(totalBudget / Math.max(1, numTravelers));
  const spentPerPerson = Math.round(totalSpent / Math.max(1, numTravelers));
  const spentPerDay = Math.round(totalSpent / Math.max(1, tripDays));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-emerald-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Trip Budget Calculator</h1>
          </div>
          <p className="text-teal-100 text-sm mt-1">
            Plan vacation expenses, track actual spends, and split group trip costs accurately.
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
            <option value="AED" className="text-slate-800">AED</option>
            <option value="¥" className="text-slate-800">JPY (¥)</option>
          </select>
          <button
            onClick={handleExportCsv}
            disabled={expenses.length === 0}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 backdrop-blur-sm rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Trip Meta Configuration */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Trip Name</label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Travelers (Headcount)</label>
          <div className="relative">
            <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="number"
              min="1"
              max="50"
              value={numTravelers}
              onChange={(e) => setNumTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Trip Duration (Days)</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="number"
              min="1"
              max="365"
              value={tripDays}
              onChange={(e) => setTripDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Total Budget</div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {currency}{totalBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currency}{budgetPerPerson.toLocaleString()} / person
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Total Spent</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {currency}{totalSpent.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {currency}{spentPerPerson.toLocaleString()} / person ({spentPercentage}%)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Remaining Balance</div>
          <div
            className={`text-xl font-bold ${
              remainingBudget < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {currency}{remainingBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {remainingBudget < 0 ? 'Over budget!' : 'Within budget'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 mb-1">Avg Spend / Day</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {currency}{spentPerDay.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across {tripDays} days</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
          <span>Budget Utilization ({spentPercentage}%)</span>
          <span>
            {currency}{totalSpent.toLocaleString()} / {currency}{totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              spentPercentage > 100
                ? 'bg-red-500'
                : spentPercentage > 85
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, spentPercentage)}%` }}
          />
        </div>
      </div>

      {/* Category Allocations */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center justify-between">
          <span>Planned Category Budgets</span>
          <span className="text-xs font-normal text-slate-500">Edit values directly</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const catSpent = expenses
              .filter((e) => e.category === cat.key)
              .reduce((sum, e) => sum + e.amount, 0);
            const isOver = catSpent > cat.allocated;

            return (
              <div
                key={cat.key}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Spent: <span className={isOver ? 'text-red-500 font-bold' : ''}>{currency}{catSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs text-slate-400">{currency}</span>
                  <input
                    type="number"
                    step="100"
                    value={cat.allocated}
                    onChange={(e) => handleUpdateAllocated(cat.key, parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 text-xs border rounded-lg text-right dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense Logger Form */}
      <form
        onSubmit={handleAddExpense}
        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3"
      >
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-500" />
          Record Actual Expense
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <label className="block text-xs font-medium text-slate-500 mb-1">Expense Title</label>
            <input
              type="text"
              placeholder="e.g. Scuba diving, Dinner at beach cafe..."
              value={expTitle}
              onChange={(e) => setExpTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select
              value={expCategory}
              onChange={(e) => setExpCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-500 mb-1">Amount ({currency})</label>
            <input
              type="number"
              step="any"
              min="0.1"
              placeholder="0.00"
              value={expAmount}
              onChange={(e) => setExpAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Add Expense
            </button>
          </div>
        </div>
      </form>

      {/* Expenses Log List */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center justify-between">
          <span>Trip Expense Log ({expenses.length})</span>
          {expenses.length > 0 && (
            <button
              onClick={handleResetTrip}
              className="text-xs text-red-500 hover:text-red-700 transition"
            >
              Reset Trip
            </button>
          )}
        </h3>

        {expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No expenses logged yet. Add your first spending above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-72 overflow-y-auto">
            {expenses.map((exp) => {
              const catObj = categories.find((c) => c.key === exp.category);
              return (
                <div key={exp.id} className="py-2.5 flex items-center justify-between gap-3 group">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {exp.title}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {catObj?.label || exp.category} • {exp.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {currency}{exp.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
