import React, { useState } from 'react';
import { formatNumber, copyToClipboard } from '../../../utils/formatters';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Users,
  Plus,
  Trash2,
  Copy,
  Receipt,
  RotateCcw,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
}

interface SharedExpense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // member id
  splitAmong: string[]; // member ids
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

const CURRENCY_KEY = 'lifetools_pref_currency';

export const ExpenseSplitter: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));

  const [members, setMembers] = useState<GroupMember[]>([]);

  const [expenses, setExpenses] = useState<SharedExpense[]>([]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePaidBy, setNewExpensePaidBy] = useState('m1');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newM: GroupMember = {
      id: 'm_' + Date.now(),
      name: newMemberName.trim()
    };
    setMembers(prev => [...prev, newM]);
    setNewMemberName('');
    showToast(`Added ${newM.name} to group`);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 2) {
      showToast('Need at least 2 members to split expenses', 'warning');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    setExpenses(prev =>
      prev
        .filter(e => e.paidBy !== id)
        .map(e => ({ ...e, splitAmong: e.splitAmong.filter(mId => mId !== id) }))
    );
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseDesc.trim()) {
      showToast('Enter expense title', 'warning');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      showToast('Enter valid amount', 'warning');
      return;
    }

    const newExp: SharedExpense = {
      id: 'e_' + Date.now(),
      description: newExpenseDesc.trim(),
      amount: amt,
      paidBy: newExpensePaidBy,
      splitAmong: members.map(m => m.id)
    };

    setExpenses(prev => [...prev, newExp]);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
    showToast('Shared expense logged');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Calculate Net Balances per member
  const balances: Record<string, number> = {};
  members.forEach(m => {
    balances[m.id] = 0;
  });

  expenses.forEach(e => {
    const splitCount = e.splitAmong.length;
    if (splitCount === 0) return;
    const share = e.amount / splitCount;

    // Payer is credited the full amount
    balances[e.paidBy] = (balances[e.paidBy] || 0) + e.amount;

    // Consumers are debited their share
    e.splitAmong.forEach(mId => {
      balances[mId] = (balances[mId] || 0) - share;
    });
  });

  // Calculate minimum settlement transactions (Greedy debt simplification)
  const calculateSettlements = (): Settlement[] => {
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    members.forEach(m => {
      const b = Math.round((balances[m.id] || 0) * 100) / 100;
      if (b < -0.01) {
        debtors.push({ id: m.id, amount: -b });
      } else if (b > 0.01) {
        creditors.push({ id: m.id, amount: b });
      }
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: Settlement[] = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const settledAmt = Math.min(debtors[i].amount, creditors[j].amount);
      if (settledAmt > 0.01) {
        settlements.push({
          from: debtors[i].id,
          to: creditors[j].id,
          amount: settledAmt
        });
      }

      debtors[i].amount -= settledAmt;
      creditors[j].amount -= settledAmt;

      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();
  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || id;

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCopySettlements = () => {
    const lines = [
      '💸 Expense Splitter Settlement Plan:',
      `Total Group Spend: ${currency} ${formatNumber(totalExpense, 2)}`,
      ''
    ];
    if (settlements.length === 0) {
      lines.push('All balances are settled! Nobody owes anything.');
    } else {
      settlements.forEach(s => {
        lines.push(`• ${getMemberName(s.from)} pays ${getMemberName(s.to)} ${currency} ${formatNumber(s.amount, 2)}`);
      });
    }
    copyToClipboard(lines.join('\n'));
    showToast('Settlement breakdown copied!');
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" /> Group Expense Splitter
          </h2>
          <p className="text-xs text-slate-500">
            Total Group Spend: <span className="font-bold text-slate-900 dark:text-white text-base">{currency} {formatNumber(totalExpense, 2)}</span>
          </p>
        </div>

        <button onClick={handleCopySettlements} className="btn-primary text-xs py-2 px-3">
          <Copy className="w-3.5 h-3.5" /> Copy Settlement Summary
        </button>
      </div>

      {/* Member Chips & Add Member */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-2">Members ({members.length}):</span>
        {members.map(m => (
          <span
            key={m.id}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {m.name}
            {members.length > 2 && (
              <button onClick={() => handleRemoveMember(m.id)} className="text-slate-400 hover:text-rose-500">
                ×
              </button>
            )}
          </span>
        ))}

        <form onSubmit={handleAddMember} className="inline-flex items-center gap-1 ml-auto">
          <input
            type="text"
            placeholder="Add person..."
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            className="input-base text-xs py-1 px-2.5 w-32"
          />
          <button type="submit" className="btn-secondary text-xs py-1 px-2">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleAddExpense} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Description</label>
          <input
            type="text"
            placeholder="e.g. Hotel Stay, Grocery Run, Gas"
            value={newExpenseDesc}
            onChange={(e) => setNewExpenseDesc(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-3">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Amount ({currency})</label>
          <input
            type="number"
            min="1"
            placeholder="0.00"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Paid By</label>
          <select
            value={newExpensePaidBy}
            onChange={(e) => setNewExpensePaidBy(e.target.value)}
            className="input-base text-xs"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </form>

      {/* Settlement Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settlements Table */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Simplified Debt Settlements
          </h3>

          {settlements.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              All settled up! No transactions needed.
            </div>
          ) : (
            <div className="space-y-2.5">
              {settlements.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{getMemberName(s.from)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900 dark:text-white">{getMemberName(s.to)}</span>
                  </div>
                  <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                    {currency} {formatNumber(s.amount, 2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Member Balances */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Individual Net Balances
          </h3>

          <div className="space-y-2.5">
            {members.map(m => {
              const bal = balances[m.id] || 0;
              const isPositive = bal >= 0;

              return (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className={`font-mono font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {isPositive ? `Gets back ${currency} ${formatNumber(bal, 2)}` : `Owes ${currency} ${formatNumber(Math.abs(bal), 2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
