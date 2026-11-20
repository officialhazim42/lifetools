import React, { useState } from 'react';
import { formatNumber } from '../../../utils/formatters';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  PiggyBank,
  TrendingUp,
  Calendar,
  Sparkles,
  Calculator,
  RotateCcw
} from 'lucide-react';

const CURRENCY_KEY = 'lifetools_pref_currency';

export const SavingsGoalCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [targetAmount, setTargetAmount] = useState<number>(500000);
  const [currentSavings, setCurrentSavings] = useState<number>(75000);
  const [timeHorizonMonths, setTimeHorizonMonths] = useState<number>(24);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState<number>(8); // 8% mutual fund / FD rate

  const handleReset = () => {
    setTargetAmount(500000);
    setCurrentSavings(75000);
    setTimeHorizonMonths(24);
    setExpectedAnnualReturn(8);
    showToast('Reset to default values', 'info');
  };

  const remainingPrincipal = Math.max(0, targetAmount - currentSavings);

  // Simple monthly savings required (without interest)
  const simpleMonthlyRequired = timeHorizonMonths > 0 ? remainingPrincipal / timeHorizonMonths : 0;

  // With compound interest (SIP Formula)
  // FV = P*(1+r)^n + PMT * [ ((1+r)^n - 1) / r ]
  const monthlyRate = expectedAnnualReturn > 0 ? expectedAnnualReturn / 12 / 100 : 0;
  let sipMonthlyRequired = simpleMonthlyRequired;

  if (monthlyRate > 0 && timeHorizonMonths > 0) {
    const futureValueOfCurrent = currentSavings * Math.pow(1 + monthlyRate, timeHorizonMonths);
    const neededFromSip = Math.max(0, targetAmount - futureValueOfCurrent);
    const factor = (Math.pow(1 + monthlyRate, timeHorizonMonths) - 1) / monthlyRate;
    sipMonthlyRequired = factor > 0 ? neededFromSip / factor : 0;
  }

  const interestEarnedProjection = Math.max(
    0,
    targetAmount - (currentSavings + sipMonthlyRequired * timeHorizonMonths)
  );

  const progressPercent = targetAmount > 0 ? Math.min(100, Math.round((currentSavings / targetAmount) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Target Progress Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-emerald-500" /> Savings Goal Milestone
            </h2>
            <p className="text-xs text-slate-500">
              Current: <span className="font-bold text-slate-900 dark:text-white">{currency} {formatNumber(currentSavings, 0)}</span> / Goal: <span className="font-bold text-slate-900 dark:text-white">{currency} {formatNumber(targetAmount, 0)}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {progressPercent}% Complete
            </span>
            <button onClick={handleReset} className="btn-secondary text-xs py-1.5 px-3">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Input Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Target Goal Amount ({currency})
          </label>
          <input
            type="number"
            min="1000"
            step="5000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="input-base text-base font-bold font-mono"
          />
          <span className="text-[11px] text-slate-400 block">e.g. Emergency fund, car, down payment</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Current Savings ({currency})
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Math.max(0, parseFloat(e.target.value) || 0))}
            className="input-base text-base font-bold font-mono"
          />
          <span className="text-[11px] text-slate-400 block">Funds already accumulated</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Time Horizon (Months)
          </label>
          <input
            type="number"
            min="1"
            max="360"
            value={timeHorizonMonths}
            onChange={(e) => setTimeHorizonMonths(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-base text-base font-bold font-mono"
          />
          <span className="text-[11px] text-slate-400 block">
            {(timeHorizonMonths / 12).toFixed(1)} years to reach target
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Expected Return (%/year)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={expectedAnnualReturn}
            onChange={(e) => setExpectedAnnualReturn(Math.max(0, parseFloat(e.target.value) || 0))}
            className="input-base text-base font-bold font-mono"
          />
          <span className="text-[11px] text-slate-400 block">
            {expectedAnnualReturn === 0 ? 'Cash savings' : 'Index fund / FD compounding'}
          </span>
        </div>
      </div>

      {/* Result Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Required Monthly Savings (With {expectedAnnualReturn}% Return)
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {currency} {formatNumber(sipMonthlyRequired, 0)}
          </div>
          <p className="text-[11px] text-slate-400">
            Per month for {timeHorizonMonths} months
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Without Investment (0% Return)
          </div>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-200 font-mono">
            {currency} {formatNumber(simpleMonthlyRequired, 0)}
          </div>
          <p className="text-[11px] text-slate-400">
            Plain cash required per month
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Compounding Interest Bonus
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            +{currency} {formatNumber(interestEarnedProjection, 0)}
          </div>
          <p className="text-[11px] text-slate-400">
            Saved by investing early
          </p>
        </div>
      </div>
    </div>
  );
};
