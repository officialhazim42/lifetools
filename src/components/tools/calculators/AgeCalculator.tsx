import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [asOfDate, setAsOfDate] = useState(() => new Date().toISOString().split('T')[0]);

  const calculateAge = () => {
    if (!birthDate) return null;
    const start = new Date(birthDate);
    const end = new Date(asOfDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return null;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBday = new Date(end.getFullYear(), start.getMonth(), start.getDate());
    if (nextBday < end) {
      nextBday = new Date(end.getFullYear() + 1, start.getMonth(), start.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextBdayDayName = dayNames[nextBday.getDay()];

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysToNextBday,
      nextBdayDayName
    };
  };

  const result = calculateAge();

  const handleCopy = () => {
    if (!result) return;
    const text = `Age: ${result.years} years, ${result.months} months, ${result.days} days (Total: ${result.totalDays} days)`;
    copyToClipboard(text);
    showToast('Age result copied to clipboard!');
  };

  const handleReset = () => {
    setBirthDate('2000-01-01');
    setAsOfDate(new Date().toISOString().split('T')[0]);
    showToast('Reset to default values', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
            Age as of Date
          </label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {result ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Calculated Age</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy Summary
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{result.years}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Years</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{result.months}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Months</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{result.days}</div>
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Days</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Total Days</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{result.totalDays.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Total Weeks</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{result.totalWeeks.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Total Hours</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{result.totalHours.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Next Birthday</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {result.daysToNextBday} days ({result.nextBdayDayName})
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
          Please select a valid birth date that is before the &ldquo;as of&rdquo; date.
        </div>
      )}
    </div>
  );
};
