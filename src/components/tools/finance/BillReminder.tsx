import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

interface BillItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  category: string;
}

const STORAGE_KEY = 'lifetools_bill_reminders';
const CURRENCY_KEY = 'lifetools_pref_currency';

const DEFAULT_BILLS: BillItem[] = [
  { id: 'b1', name: 'Electricity Utility Bill', amount: 2450, dueDate: '2026-11-28', paid: false, category: 'Utilities' },
  { id: 'b2', name: 'Fiber Broadband Internet', amount: 999, dueDate: '2026-11-30', paid: false, category: 'Internet' },
  { id: 'b3', name: 'Credit Card Statement', amount: 12500, dueDate: '2026-12-05', paid: false, category: 'Banking' }
];

export const BillReminder: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [bills, setBills] = useState<BillItem[]>(() => {
    return storage.get<BillItem[]>(STORAGE_KEY, DEFAULT_BILLS);
  });

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Utilities');

  useEffect(() => {
    storage.set(STORAGE_KEY, bills);
  }, [bills]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!name.trim()) {
      showToast('Enter bill name', 'warning');
      return;
    }
    if (isNaN(val) || val <= 0) {
      showToast('Enter valid amount', 'warning');
      return;
    }

    const newBill: BillItem = {
      id: 'bill_' + Date.now(),
      name: name.trim(),
      amount: val,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      paid: false,
      category
    };

    setBills(prev => [...prev, newBill]);
    setName('');
    setAmount('');
    setDueDate('');
    showToast('Bill reminder created!');
  };

  const handleTogglePaid = (id: string) => {
    setBills(prev =>
      prev.map(b => (b.id === id ? { ...b, paid: !b.paid } : b))
    );
  };

  const handleDelete = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const pendingBills = bills.filter(b => !b.paid);
  const totalPendingAmount = pendingBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Bill Due Date Reminders
          </h2>
          <p className="text-xs text-slate-500">
            Pending Dues: <span className="font-bold text-rose-500 text-base">{currency} {formatNumber(totalPendingAmount, 2)}</span> ({pendingBills.length} unpaid bills)
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          {pendingBills.length === 0 ? 'All Bills Settled!' : `${pendingBills.length} Bills Pending`}
        </span>
      </div>

      {/* Add Bill Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Bill Name</label>
          <input
            type="text"
            placeholder="e.g. Water Bill, Apartment Rent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Amount ({currency})</label>
          <input
            type="number"
            min="1"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-3.5 h-3.5" /> Add Bill
          </button>
        </div>
      </form>

      {/* Bills Cards */}
      <div className="space-y-3">
        {bills.map(bill => {
          const isOverdue = !bill.paid && bill.dueDate < todayStr;
          const diffDays = Math.ceil((new Date(bill.dueDate).getTime() - new Date(todayStr).getTime()) / 86400000);
          const isDueSoon = !bill.paid && diffDays >= 0 && diffDays <= 3;

          return (
            <div
              key={bill.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                bill.paid
                  ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/40 opacity-70'
                  : isOverdue
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-subtle'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTogglePaid(bill.id)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all ${
                    bill.paid
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                  }`}
                  title={bill.paid ? 'Mark unpaid' : 'Mark paid'}
                >
                  {bill.paid && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div>
                  <h4 className={`text-sm font-bold ${bill.paid ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {bill.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Due: {new Date(bill.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {isOverdue && (
                      <span className="text-[10px] font-bold text-rose-500 uppercase">
                        Overdue
                      </span>
                    )}
                    {isDueSoon && (
                      <span className="text-[10px] font-bold text-amber-500 uppercase">
                        Due in {diffDays} {diffDays === 1 ? 'day' : 'days'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="font-mono font-black text-base text-slate-900 dark:text-white">
                  {currency} {formatNumber(bill.amount, 2)}
                </div>

                <button
                  onClick={() => handleDelete(bill.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
