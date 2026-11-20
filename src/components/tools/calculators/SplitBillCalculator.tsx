import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Plus, Trash2 } from 'lucide-react';

interface PersonExpense {
  id: string;
  name: string;
  amount: number;
}

export const SplitBillCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [splitMode, setSplitMode] = useState<'equal' | 'itemized'>('equal');

  // Equal mode
  const [subtotal, setSubtotal] = useState<number | ''>(120);
  const [tipPercent, setTipPercent] = useState<number | ''>(15);
  const [taxPercent, setTaxPercent] = useState<number | ''>(8);
  const [numPeople, setNumPeople] = useState<number>(3);

  // Itemized mode
  const [people, setPeople] = useState<PersonExpense[]>([
    { id: '1', name: 'Alice', amount: 35 },
    { id: '2', name: 'Bob', amount: 45 },
    { id: '3', name: 'Charlie', amount: 40 },
  ]);

  const addPerson = () => {
    const id = Math.random().toString(36).substring(2, 7);
    setPeople([...people, { id, name: `Person ${people.length + 1}`, amount: 0 }]);
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) return;
    setPeople(people.filter((p) => p.id !== id));
  };

  const updatePerson = (id: string, field: 'name' | 'amount', value: any) => {
    setPeople(
      people.map((p) => (p.id === id ? { ...p, [field]: field === 'amount' ? Number(value) || 0 : value } : p))
    );
  };

  // Calculations
  const tipP = Number(tipPercent) || 0;
  const taxP = Number(taxPercent) || 0;

  const equalCalc = () => {
    const base = Number(subtotal) || 0;
    const count = Math.max(1, numPeople);
    const taxVal = (base * taxP) / 100;
    const tipVal = (base * tipP) / 100;
    const total = base + taxVal + tipVal;
    const perPerson = total / count;

    return { base, taxVal, tipVal, total, perPerson, count };
  };

  const itemizedCalc = () => {
    const itemizedBase = people.reduce((acc, p) => acc + p.amount, 0);
    const taxVal = (itemizedBase * taxP) / 100;
    const tipVal = (itemizedBase * tipP) / 100;
    const total = itemizedBase + taxVal + tipVal;

    const breakdown = people.map((p) => {
      const ratio = itemizedBase > 0 ? p.amount / itemizedBase : 1 / people.length;
      const shareTax = taxVal * ratio;
      const shareTip = tipVal * ratio;
      const shareTotal = p.amount + shareTax + shareTip;
      return {
        ...p,
        shareTax,
        shareTip,
        shareTotal
      };
    });

    return { itemizedBase, taxVal, tipVal, total, breakdown };
  };

  const eq = equalCalc();
  const it = itemizedCalc();

  const handleCopy = () => {
    if (splitMode === 'equal') {
      copyToClipboard(
        `Total: $${eq.total.toFixed(2)} ($${eq.perPerson.toFixed(2)} each for ${eq.count} people)`
      );
    } else {
      const details = it.breakdown.map((p) => `${p.name}: $${p.shareTotal.toFixed(2)}`).join(', ');
      copyToClipboard(`Split Bill Total: $${it.total.toFixed(2)} (${details})`);
    }
    showToast('Split details copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setSplitMode('equal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            splitMode === 'equal'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Equal Split
        </button>
        <button
          onClick={() => setSplitMode('itemized')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            splitMode === 'itemized'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Itemized / Custom Split
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Tax Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="8"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Tip Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="15"
          />
        </div>
      </div>

      {splitMode === 'equal' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Bill Subtotal ($)
            </label>
            <input
              type="number"
              min="0"
              value={subtotal}
              onChange={(e) => setSubtotal(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base"
              placeholder="120"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              Number of People
            </label>
            <input
              type="number"
              min="1"
              value={numPeople}
              onChange={(e) => setNumPeople(Math.max(1, Number(e.target.value) || 1))}
              className="input-base"
              placeholder="3"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Itemized Expenses per Person
            </label>
            <button onClick={addPerson} className="btn-secondary text-xs py-1">
              <Plus className="w-3.5 h-3.5" /> Add Person
            </button>
          </div>
          {people.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <input
                type="text"
                value={p.name}
                onChange={(e) => updatePerson(p.id, 'name', e.target.value)}
                className="input-base flex-1"
                placeholder="Name"
              />
              <div className="relative w-36">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.amount}
                  onChange={(e) => updatePerson(p.id, 'amount', e.target.value)}
                  className="input-base pl-6"
                  placeholder="0.00"
                />
              </div>
              <button
                onClick={() => removePerson(p.id)}
                disabled={people.length <= 1}
                className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg disabled:opacity-30"
                aria-label="Remove person"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Result Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Split Breakdown</h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        {splitMode === 'equal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                ${eq.total.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Total Bill (incl. ${eq.taxVal.toFixed(2)} tax + ${eq.tipVal.toFixed(2)} tip)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${eq.perPerson.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Each Person Owes</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Grand Total (with Tax & Tip):</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-lg">${it.total.toFixed(2)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5">Person</th>
                    <th className="p-2.5">Subtotal</th>
                    <th className="p-2.5">Tax Share</th>
                    <th className="p-2.5">Tip Share</th>
                    <th className="p-2.5">Total Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                  {it.breakdown.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2.5 font-medium text-slate-900 dark:text-white">{row.name}</td>
                      <td className="p-2.5">${row.amount.toFixed(2)}</td>
                      <td className="p-2.5">${row.shareTax.toFixed(2)}</td>
                      <td className="p-2.5">${row.shareTip.toFixed(2)}</td>
                      <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                        ${row.shareTotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
