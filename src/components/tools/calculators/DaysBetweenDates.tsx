import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const DaysBetweenDates: React.FC = () => {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [includeEndDay, setIncludeEndDay] = useState(false);

  const calculate = () => {
    if (!startDate || !endDate) return null;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const start = d1 < d2 ? new Date(d1) : new Date(d2);
    const end = d1 < d2 ? new Date(d2) : new Date(d1);

    let totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (includeEndDay) totalDays += 1;

    let businessDays = 0;
    let weekendDays = 0;

    const cur = new Date(start);
    const limit = new Date(end);
    if (includeEndDay) {
      limit.setDate(limit.getDate() + 1);
    }

    while (cur < limit) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      totalDays,
      businessDays,
      weekendDays
    };
  };

  const result = calculate();

  const handleCopy = () => {
    if (!result) return;
    copyToClipboard(`Calendar Days: ${result.totalDays}, Business Days: ${result.businessDays}, Weekends: ${result.weekendDays}`);
    showToast('Days breakdown copied!');
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

      <div className="flex items-center gap-2">
        <input
          id="includeEndDay"
          type="checkbox"
          checked={includeEndDay}
          onChange={(e) => setIncludeEndDay(e.target.checked)}
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="includeEndDay" className="text-sm text-slate-700 dark:text-slate-300">
          Include end day in total (+1 day)
        </label>
      </div>

      {result && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Days Calculated</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {result.totalDays}
              </div>
              <div className="text-xs text-slate-500 mt-1">Calendar Days</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {result.businessDays}
              </div>
              <div className="text-xs text-slate-500 mt-1">Working Days (M-F)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {result.weekendDays}
              </div>
              <div className="text-xs text-slate-500 mt-1">Weekend Days</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
