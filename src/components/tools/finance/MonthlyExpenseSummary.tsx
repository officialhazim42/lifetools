import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  PieChart,
  BarChart,
  Download,
  Calendar,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { ExpenseItem } from './DailyExpenseTracker';

const EXPENSES_KEY = 'lifetools_expenses';
const CURRENCY_KEY = 'lifetools_pref_currency';

export const MonthlyExpenseSummary: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [expenses] = useState<ExpenseItem[]>(() => {
    return storage.get<ExpenseItem[]>(EXPENSES_KEY, []);
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  // Filter expenses by selected month
  const monthExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  // Compute category totals
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const totalMonthlySpend = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Highest spending category
  let topCategory = 'None';
  let topAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > topAmount) {
      topAmount = amt;
      topCategory = cat;
    }
  });

  const daysInMonth = new Date(
    parseInt(selectedMonth.split('-')[0]),
    parseInt(selectedMonth.split('-')[1]),
    0
  ).getDate();
  const dailyAverage = totalMonthlySpend / (daysInMonth || 30);

  const handleExportCsv = () => {
    if (monthExpenses.length === 0) {
      showToast('No expenses found for this month', 'info');
      return;
    }
    const headers = ['Date', 'Item', 'Category', 'Payment Mode', `Amount (${currency})`];
    const rows = monthExpenses.map(e => [
      e.date,
      e.title,
      e.category,
      e.paymentMode,
      e.amount.toFixed(2)
    ]);
    storage.exportToCsv(`lifetools-expense-summary-${selectedMonth}.csv`, headers, rows);
    showToast('Monthly summary exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Month Selector Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">Reporting Month:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-base text-xs py-1 px-3 w-40 font-bold"
          />
        </div>

        <button onClick={handleExportCsv} className="btn-secondary text-xs py-1.5 px-3">
          <Download className="w-3.5 h-3.5" /> Export Month CSV
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Monthly Outflow
          </div>
          <div className="text-3xl font-black text-rose-500 font-mono">
            {currency} {formatNumber(totalMonthlySpend, 2)}
          </div>
          <div className="text-[11px] text-slate-400">{monthExpenses.length} transactions logged</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Average Daily Spend
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {currency} {formatNumber(dailyAverage, 2)}
          </div>
          <div className="text-[11px] text-slate-400">Over {daysInMonth} calendar days</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Top Spending Category
          </div>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 truncate">
            {topCategory}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {currency} {formatNumber(topAmount, 2)} ({totalMonthlySpend > 0 ? Math.round((topAmount / totalMonthlySpend) * 100) : 0}%)
          </div>
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-500" /> Spending Distribution by Category
        </h3>

        {Object.keys(categoryTotals).length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No expenses recorded for this month yet. Use the Daily Expense Tracker to log receipts!
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(categoryTotals).map(([cat, amt]) => {
              const pct = totalMonthlySpend > 0 ? Math.round((amt / totalMonthlySpend) * 100) : 0;

              return (
                <div key={cat} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {currency} {formatNumber(amt, 2)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
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
