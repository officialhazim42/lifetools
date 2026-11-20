import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Download,
  Sparkles
} from 'lucide-react';

interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'annual';
  renewalDay: number; // Day of month 1-31
  category: string;
}

const STORAGE_KEY = 'lifetools_subscriptions';
const CURRENCY_KEY = 'lifetools_pref_currency';

const DEFAULT_SUBS: Subscription[] = [
  { id: 'sub_1', name: 'Netflix Premium', cost: 649, billingCycle: 'monthly', renewalDay: 14, category: 'Entertainment' },
  { id: 'sub_2', name: 'Spotify Individual', cost: 119, billingCycle: 'monthly', renewalDay: 22, category: 'Music' },
  { id: 'sub_3', name: 'Google One (2TB)', cost: 6500, billingCycle: 'annual', renewalDay: 5, category: 'Cloud Storage' },
  { id: 'sub_4', name: 'GitHub Copilot', cost: 850, billingCycle: 'monthly', renewalDay: 1, category: 'Developer Tools' }
];

export const SubscriptionTracker: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [subs, setSubs] = useState<Subscription[]>(() => {
    return storage.get<Subscription[]>(STORAGE_KEY, DEFAULT_SUBS);
  });

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [renewalDay, setRenewalDay] = useState<number>(1);
  const [category, setCategory] = useState('Entertainment');

  useEffect(() => {
    storage.set(STORAGE_KEY, subs);
  }, [subs]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCost = parseFloat(cost);
    if (!name.trim()) {
      showToast('Enter subscription name', 'warning');
      return;
    }
    if (isNaN(parsedCost) || parsedCost <= 0) {
      showToast('Enter valid subscription cost', 'warning');
      return;
    }

    const newSub: Subscription = {
      id: 'sub_' + Date.now(),
      name: name.trim(),
      cost: parsedCost,
      billingCycle,
      renewalDay: Math.min(31, Math.max(1, renewalDay)),
      category
    };

    setSubs(prev => [...prev, newSub]);
    setName('');
    setCost('');
    showToast('Subscription added!');
  };

  const handleDelete = (id: string) => {
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  // Normalized monthly & annual cost
  const totalMonthlyCost = subs.reduce((sum, s) => {
    return sum + (s.billingCycle === 'monthly' ? s.cost : s.cost / 12);
  }, 0);
  const totalAnnualCost = totalMonthlyCost * 12;

  const today = new Date().getDate();

  const handleExportCsv = () => {
    const headers = ['Subscription', 'Category', 'Cycle', `Cost (${currency})`, 'Billing Day'];
    const rows = subs.map(s => [
      s.name,
      s.category,
      s.billingCycle,
      s.cost.toFixed(2),
      s.renewalDay
    ]);
    storage.exportToCsv('lifetools-subscriptions.csv', headers, rows);
    showToast('Subscriptions exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Monthly Spend
          </div>
          <div className="text-3xl font-black text-rose-500 font-mono">
            {currency} {formatNumber(totalMonthlyCost, 2)}
          </div>
          <div className="text-[11px] text-slate-400">Recurring every month</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Yearly Commitment
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
            {currency} {formatNumber(totalAnnualCost, 2)}
          </div>
          <div className="text-[11px] text-slate-400">Annual projected total</div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Subscriptions
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {subs.length}
          </div>
          <div className="text-[11px] text-slate-400">Services tracked</div>
        </div>
      </div>

      {/* Add Subscription Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Service Name</label>
          <input
            type="text"
            placeholder="e.g. Netflix, Prime, Cloud"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Cost ({currency})</label>
          <input
            type="number"
            min="1"
            placeholder="0.00"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Billing Cycle</label>
          <select
            value={billingCycle}
            onChange={(e) => setBillingCycle(e.target.value as any)}
            className="input-base text-xs"
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Renewal Day (1-31)</label>
          <input
            type="number"
            min="1"
            max="31"
            value={renewalDay}
            onChange={(e) => setRenewalDay(parseInt(e.target.value) || 1)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </form>

      {/* Subscriptions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Active Subscriptions</h3>
          <button onClick={handleExportCsv} className="btn-secondary text-xs py-1 px-3">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5">Service</th>
              <th className="p-3.5">Cycle</th>
              <th className="p-3.5">Billing Day</th>
              <th className="p-3.5 text-right">Cost</th>
              <th className="p-3.5 text-right">Monthly Equivalent</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {subs.map(sub => {
              const daysUntil = (sub.renewalDay - today + 31) % 31;
              const isDueSoon = daysUntil <= 3 && daysUntil >= 0;

              return (
                <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-slate-900 dark:text-white">
                    {sub.name}
                  </td>
                  <td className="p-3.5 font-sans capitalize text-slate-500">
                    {sub.billingCycle}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="flex items-center gap-1.5">
                      Day {sub.renewalDay}
                      {isDueSoon && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                          Due soon
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                    {currency} {formatNumber(sub.cost, 2)}
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    {currency} {formatNumber(sub.billingCycle === 'monthly' ? sub.cost : sub.cost / 12, 2)}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
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
