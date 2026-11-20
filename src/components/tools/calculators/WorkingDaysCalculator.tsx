import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const WorkingDaysCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [weekendRule, setWeekendRule] = useState<'sat_sun' | 'sun_only'>('sat_sun');
  const [holidaysCount, setHolidaysCount] = useState<number | ''>(2);

  const calculate = () => {
    if (!startDate || !endDate) return null;
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const start = d1 < d2 ? new Date(d1) : new Date(d2);
    const end = d1 < d2 ? new Date(d2) : new Date(d1);

    let totalCalendarDays = 0;
    let weekendDays = 0;
    let standardWorkingDays = 0;

    const cur = new Date(start);
    while (cur <= end) {
      totalCalendarDays++;
      const day = cur.getDay();
      const isWeekend = weekendRule === 'sat_sun' ? day === 0 || day === 6 : day === 0;

      if (isWeekend) {
        weekendDays++;
      } else {
        standardWorkingDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    const holidays = Number(holidaysCount) || 0;
    const finalWorkingDays = Math.max(0, standardWorkingDays - holidays);

    return {
      totalCalendarDays,
      standardWorkingDays,
      weekendDays,
      holidays,
      finalWorkingDays
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Working Days: ${res.finalWorkingDays} (Calendar: ${res.totalCalendarDays}, Weekends: ${res.weekendDays}, Holidays: ${res.holidays})`
    );
    showToast('Working days summary copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Weekend Days
          </label>
          <select
            value={weekendRule}
            onChange={(e) => setWeekendRule(e.target.value as any)}
            className="input-base"
          >
            <option value="sat_sun">Saturday & Sunday</option>
            <option value="sun_only">Sunday Only</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Public Holidays (Count)
          </label>
          <input
            type="number"
            min="0"
            value={holidaysCount}
            onChange={(e) => setHolidaysCount(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="2"
          />
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Working Days Calculated</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {res.finalWorkingDays}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Net Working Days</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {res.totalCalendarDays}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Total Calendar Days</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {res.weekendDays}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Weekend Days ({res.holidays} holidays)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
