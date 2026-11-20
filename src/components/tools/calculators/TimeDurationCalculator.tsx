import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const TimeDurationCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [startTime, setStartTime] = useState('09:15');
  const [endTime, setEndTime] = useState('17:45');
  const [crossMidnight, setCrossMidnight] = useState(false);

  const calculate = () => {
    if (!startTime || !endTime) return null;
    const [h1, m1] = startTime.split(':').map(Number);
    const [h2, m2] = endTime.split(':').map(Number);

    let startMinutes = h1 * 60 + m1;
    let endMinutes = h2 * 60 + m2;

    if (crossMidnight || endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const decimalHours = diffMinutes / 60;
    const totalSeconds = diffMinutes * 60;

    return {
      hours,
      minutes,
      decimalHours,
      totalMinutes: diffMinutes,
      totalSeconds
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Duration: ${res.hours} hrs ${res.minutes} mins (${res.decimalHours.toFixed(2)} decimal hours, ${res.totalMinutes} total minutes)`
    );
    showToast('Duration copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="input-base"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input-base"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="crossMidnight"
          type="checkbox"
          checked={crossMidnight}
          onChange={(e) => setCrossMidnight(e.target.checked)}
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        <label htmlFor="crossMidnight" className="text-sm text-slate-700 dark:text-slate-300">
          Crosses midnight (End time is on next day)
        </label>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Elapsed Time</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {res.hours}h {res.minutes}m
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Standard Duration</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {res.decimalHours.toFixed(2)} hrs
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Decimal Hours (for Timesheets)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {res.totalMinutes.toLocaleString()} min
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{res.totalSeconds.toLocaleString()} Seconds</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
