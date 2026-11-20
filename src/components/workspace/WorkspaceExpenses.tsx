import React, { useState, useEffect } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import { WorkspaceExpense, ExpenseCategory, PaymentMethod } from '../../types/workspace';
import { exportToCsv } from '../../utils/storage';
import {
  Wallet,
  Plus,
  Trash2,
  Edit3,
  Download,
  Calendar,
  CreditCard,
  TrendingDown,
  PieChart,
  Filter,
  DollarSign
} from 'lucide-react';

const CATEGORY_META: Record<ExpenseCategory, { label: string; color: string; icon: string }> = {
  food: { label: 'Food & Dining', color: 'bg-amber-500', icon: '🍲' },
  housing: { label: 'Housing & Rent', color: 'bg-blue-500', icon: '🏠' },
  utilities: { label: 'Bills & Utilities', color: 'bg-yellow-500', icon: '⚡' },
  transport: { label: 'Transit & Fuel', color: 'bg-emerald-500', icon: '🚗' },
  entertainment: { label: 'Entertainment & Fun', color: 'bg-purple-500', icon: '🎬' },
  health: { label: 'Health & Medical', color: 'bg-rose-500', icon: '💊' },
  shopping: { label: 'Shopping & Clothes', color: 'bg-pink-500', icon: '🛍️' },
  education: { label: 'Education & Courses', color: 'bg-indigo-500', icon: '📚' },
  other: { label: 'Miscellaneous', color: 'bg-slate-500', icon: '📦' },
};

export const WorkspaceExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<WorkspaceExpense[]>([]);
  const [currency, setCurrency] = useState<string>('₹');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return new Date().toISOString().substring(0, 7); // 'YYYY-MM'
  });

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WorkspaceExpense | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('food');
  const [formMethod, setFormMethod] = useState<PaymentMethod>('upi');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');

  const loadExpenses = async () => {
    const list = await workspaceDB.getExpenses();
    setExpenses(list);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const openNewModal = () => {
    setEditingExpense(null);
    setFormTitle('');
    setFormAmount('');
    setFormCategory('food');
    setFormMethod('upi');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp: WorkspaceExpense) => {
    setEditingExpense(exp);
    setFormTitle(exp.title);
    setFormAmount(String(exp.amount));
    setFormCategory(exp.category);
    setFormMethod(exp.paymentMethod);
    setFormDate(exp.date);
    setFormNotes(exp.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(formAmount);
    if (!formTitle.trim() || isNaN(amt) || amt <= 0) return;

    const expenseToSave: WorkspaceExpense = {
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      amount: amt,
      category: formCategory,
      paymentMethod: formMethod,
      date: formDate,
      notes: formNotes.trim(),
      createdAt: editingExpense ? editingExpense.createdAt : new Date().toISOString()
    };

    await workspaceDB.saveExpense(expenseToSave);
    setIsModalOpen(false);
    loadExpenses();
  };

  const handleDeleteExpense = async (id: string) => {
    if (window.confirm('Delete this expense entry?')) {
      await workspaceDB.deleteExpense(id);
      loadExpenses();
    }
  };

  const handleExportCsv = () => {
    if (expenses.length === 0) return;
    const rows = [
      ['Date', 'Title', 'Category', 'Payment Method', `Amount (${currency})`, 'Notes'],
      ...expenses.map((e) => [
        e.date,
        e.title,
        CATEGORY_META[e.category]?.label || e.category,
        e.paymentMethod.toUpperCase(),
        String(e.amount),
        e.notes || ''
      ])
    ];
    exportToCsv(rows, `workspace-expenses-${selectedMonth}`);
  };

  // Month filtering & statistics
  const monthExpenses = expenses.filter((e) => e.date && e.date.startsWith(selectedMonth));
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([cat, total]) => ({
      category: cat as ExpenseCategory,
      total,
      percentage: monthTotal > 0 ? Math.round((total / monthTotal) * 100) : 0
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            My Expenses & Spending Summary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log financial expenses locally, monitor category distribution, and export data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <option value="₹">INR (₹)</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="AED">AED</option>
          </select>

          <button
            onClick={handleExportCsv}
            disabled={expenses.length === 0}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Month Selector & KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Month Summary Card */}
        <div className="md:col-span-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Monthly Total
            </span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white/20 text-white border border-white/20 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
            />
          </div>

          <div className="my-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currency}{monthTotal.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-100 mt-1">
              {monthExpenses.length} transaction{monthExpenses.length === 1 ? '' : 's'} recorded in {selectedMonth}
            </div>
          </div>

          <div className="text-[11px] text-emerald-200/90 pt-3 border-t border-white/20 flex items-center justify-between">
            <span>Average / day: {currency}{Math.round(monthTotal / 30).toLocaleString()}</span>
            <span>Total records: {expenses.length}</span>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="md:col-span-6 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Top Categories ({selectedMonth})
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No expenses recorded for this month yet.
            </div>
          ) : (
            <div className="space-y-2.5 overflow-y-auto max-h-40 pr-1">
              {categoryBreakdown.map((item) => {
                const meta = CATEGORY_META[item.category] || CATEGORY_META.other;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {currency}{item.total.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${meta.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Expense History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Expense Records ({monthExpenses.length})
          </h3>
          <span className="text-xs text-slate-500">
            Filtered by: {selectedMonth}
          </span>
        </div>

        {monthExpenses.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No expenses found for {selectedMonth}. Click "+ Add Expense" above to record one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 uppercase font-medium">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {monthExpenses.map((exp) => {
                  const meta = CATEGORY_META[exp.category] || CATEGORY_META.other;

                  return (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 group">
                      <td className="p-3 font-medium text-slate-500 whitespace-nowrap">
                        {exp.date}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">
                        <div>{exp.title}</div>
                        {exp.notes && (
                          <div className="text-[10px] text-slate-400 font-normal italic">
                            {exp.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </span>
                      </td>
                      <td className="p-3 uppercase text-[11px] text-slate-400 font-mono">
                        {exp.paymentMethod}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {currency}{exp.amount.toLocaleString()}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded ml-1"
                          title="Delete"
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

      {/* Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {editingExpense ? 'Edit Expense Record' : 'Record Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Expense Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Groceries, Electricity bill..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Amount ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.icon} {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white uppercase font-mono"
                  >
                    <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="card">Debit / Credit Card</option>
                    <option value="cash">Cash</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Notes / Merchant (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Optional notes or receipt ID..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  {editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
