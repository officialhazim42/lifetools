import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const DateDifferenceCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  const getDiff = () => {
    if (!startDate || !endDate) return null;
    let d1 = new Date(startDate);
    let d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const isNegative = d1 > d2;
    if (isNegative) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDaysAfterWeeks = totalDays % 7;
    const totalHours = totalDays * 24;

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDaysAfterWeeks,
      totalHours,
      isNegative
    };
  };

  const result = getDiff();

  const handleCopy = () => {
    if (!result) return;
    const text = `Difference: ${result.years} years, ${result.months} months, ${result.days} days (${result.totalDays} total days)`;
    copyToClipboard(text);
    showToast('Date difference copied!');
  };

  const handleReset = () => {
    setStartDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    setEndDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Date Span Result {result.isNegative ? '(Start is after End)' : ''}
            </h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.years}</div>
              <div className="text-xs text-slate-500 mt-1">Years</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.months}</div>
              <div className="text-xs text-slate-500 mt-1">Months</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.days}</div>
              <div className="text-xs text-slate-500 mt-1">Days</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-slate-500 block">Total Days</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{result.totalDays.toLocaleString()} days</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-slate-500 block">Weeks & Days</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {result.totalWeeks} wks, {result.remainingDaysAfterWeeks} days
              </span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-slate-500 block">Total Hours</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{result.totalHours.toLocaleString()} hrs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
