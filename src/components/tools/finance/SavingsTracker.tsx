import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { formatNumber } from '../../../utils/formatters';
import {
  TrendingUp,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  PiggyBank
} from 'lucide-react';

interface SavingsPot {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
}

interface SavingsTransaction {
  id: string;
  potId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  note?: string;
}

const STORAGE_POTS = 'lifetools_savings_pots';
const STORAGE_TX = 'lifetools_savings_tx';
const CURRENCY_KEY = 'lifetools_pref_currency';

const DEFAULT_POTS: SavingsPot[] = [
  { id: 'pot_emergency', name: 'Emergency Fund', targetAmount: 200000, currentAmount: 85000, category: 'Safety' },
  { id: 'pot_travel', name: 'Kashmir Vacation', targetAmount: 50000, currentAmount: 32000, category: 'Travel' },
  { id: 'pot_gadgets', name: 'MacBook & Phone Upgrade', targetAmount: 150000, currentAmount: 60000, category: 'Tech' }
];

export const SavingsTracker: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [pots, setPots] = useState<SavingsPot[]>(() => {
    return storage.get<SavingsPot[]>(STORAGE_POTS, DEFAULT_POTS);
  });
  const [transactions, setTransactions] = useState<SavingsTransaction[]>(() => {
    return storage.get<SavingsTransaction[]>(STORAGE_TX, []);
  });

  const [newPotName, setNewPotName] = useState('');
  const [newPotTarget, setNewPotTarget] = useState('');
  const [newPotInitial, setNewPotInitial] = useState('');

  // Transaction modal/state
  const [selectedPotId, setSelectedPotId] = useState('');
  const [txType, setTxType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [txAmount, setTxAmount] = useState('');
  const [txNote, setTxNote] = useState('');

  useEffect(() => {
    storage.set(STORAGE_POTS, pots);
    storage.set(STORAGE_TX, transactions);
  }, [pots, transactions]);

  const handleAddPot = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newPotTarget);
    const initial = parseFloat(newPotInitial) || 0;
    if (!newPotName.trim()) {
      showToast('Enter pot name', 'warning');
      return;
    }
    if (isNaN(target) || target <= 0) {
      showToast('Enter valid target amount', 'warning');
      return;
    }

    const newPot: SavingsPot = {
      id: 'pot_' + Date.now(),
      name: newPotName.trim(),
      targetAmount: target,
      currentAmount: initial,
      category: 'Personal'
    };

    setPots(prev => [...prev, newPot]);
    setNewPotName('');
    setNewPotTarget('');
    setNewPotInitial('');
    showToast('New savings pot created!');
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(txAmount);
    if (!selectedPotId) {
      showToast('Select a savings pot', 'warning');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast('Enter a valid amount', 'warning');
      return;
    }

    const pot = pots.find(p => p.id === selectedPotId);
    if (!pot) return;

    if (txType === 'withdrawal' && amt > pot.currentAmount) {
      showToast('Insufficient funds in this pot', 'warning');
      return;
    }

    const updatedPots = pots.map(p => {
      if (p.id !== selectedPotId) return p;
      const nextAmt = txType === 'deposit' ? p.currentAmount + amt : p.currentAmount - amt;
      return { ...p, currentAmount: nextAmt };
    });

    const newTx: SavingsTransaction = {
      id: 'tx_' + Date.now(),
      potId: selectedPotId,
      type: txType,
      amount: amt,
      date: new Date().toISOString().split('T')[0],
      note: txNote.trim() || undefined
    };

    setPots(updatedPots);
    setTransactions(prev => [newTx, ...prev]);
    setTxAmount('');
    setTxNote('');
    showToast(`${txType === 'deposit' ? 'Deposited' : 'Withdrawn'} ${currency} ${amt}`);
  };

  const handleDeletePot = (id: string) => {
    setPots(prev => prev.filter(p => p.id !== id));
    showToast('Savings pot deleted', 'info');
  };

  const totalSaved = pots.reduce((sum, p) => sum + p.currentAmount, 0);
  const totalTarget = pots.reduce((sum, p) => sum + p.targetAmount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-500" /> Savings Pots & Vaults
          </h2>
          <p className="text-xs text-slate-500">
            Total Saved Across Pots: <span className="font-bold text-slate-900 dark:text-white text-base">{currency} {formatNumber(totalSaved, 0)}</span> / Goal: {currency} {formatNumber(totalTarget, 0)}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}% Target Saved
        </span>
      </div>

      {/* Grid of Pots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pots.map(pot => {
          const progress = pot.targetAmount > 0 ? Math.min(100, Math.round((pot.currentAmount / pot.targetAmount) * 100)) : 0;

          return (
            <div
              key={pot.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {pot.name}
                  </h3>
                  <button
                    onClick={() => handleDeletePot(pot.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {currency} {formatNumber(pot.currentAmount, 0)}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Target: {currency} {formatNumber(pot.targetAmount, 0)}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Progress</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit / Withdraw Action Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" /> Log Deposit or Withdrawal
        </h3>

        <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Pot</label>
            <select
              value={selectedPotId}
              onChange={(e) => setSelectedPotId(e.target.value)}
              className="input-base text-xs"
            >
              <option value="">Select Target Pot...</option>
              {pots.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({currency}{p.currentAmount})</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Action</label>
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value as any)}
              className="input-base text-xs"
            >
              <option value="deposit">Deposit (+)</option>
              <option value="withdrawal">Withdrawal (-)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Amount ({currency})</label>
            <input
              type="number"
              min="1"
              placeholder="0.00"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              className="input-base text-xs font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Note</label>
            <input
              type="text"
              placeholder="e.g. Monthly transfer"
              value={txNote}
              onChange={(e) => setTxNote(e.target.value)}
              className="input-base text-xs"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button type="submit" className="btn-primary w-full text-xs py-2.5">
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Create New Pot Form */}
      <form onSubmit={handleAddPot} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">New Pot Name</label>
          <input
            type="text"
            placeholder="e.g. Home Renovation, New Car"
            value={newPotName}
            onChange={(e) => setNewPotName(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Amount ({currency})</label>
          <input
            type="number"
            min="100"
            placeholder="100000"
            value={newPotTarget}
            onChange={(e) => setNewPotTarget(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>
        <div className="sm:col-span-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Initial Deposit ({currency})</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={newPotInitial}
            onChange={(e) => setNewPotInitial(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>
        <div className="sm:col-span-2 flex items-end">
          <button type="submit" className="btn-secondary w-full text-xs py-2.5">
            <Plus className="w-3.5 h-3.5" /> Add Pot
          </button>
        </div>
      </form>
    </div>
  );
};
