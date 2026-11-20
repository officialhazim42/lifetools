import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  Sparkles,
  RotateCcw,
  Clock
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const DateToDayFinder: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const dateObj = new Date(selectedDate);
  const isValid = !isNaN(dateObj.getTime());

  // Day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = isValid ? dayNames[dateObj.getDay()] : '--';

  // Day of Year
  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const diffMs = dateObj.getTime() - startOfYear.getTime();
  const dayOfYear = isValid ? Math.floor(diffMs / 86400000) + 1 : 0;
  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const totalYearDays = isValid ? (isLeap(dateObj.getFullYear()) ? 366 : 365) : 365;

  // ISO Week Number
  const getISOWeek = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };
  const weekNumber = isValid ? getISOWeek(dateObj) : 0;

  // Astrological Zodiac Sign
  const getZodiac = (month: number, day: number) => {
    // month 1-12, day 1-31
    const signs = [
      { name: 'Capricorn', start: [1, 1], end: [1, 19] },
      { name: 'Aquarius', start: [1, 20], end: [2, 18] },
      { name: 'Pisces', start: [2, 19], end: [3, 20] },
      { name: 'Aries', start: [3, 21], end: [4, 19] },
      { name: 'Taurus', start: [4, 20], end: [5, 20] },
      { name: 'Gemini', start: [5, 21], end: [6, 20] },
      { name: 'Cancer', start: [6, 21], end: [7, 22] },
      { name: 'Leo', start: [7, 23], end: [8, 22] },
      { name: 'Virgo', start: [8, 23], end: [9, 22] },
      { name: 'Libra', start: [9, 23], end: [10, 22] },
      { name: 'Scorpio', start: [10, 23], end: [11, 21] },
      { name: 'Sagittarius', start: [11, 22], end: [12, 21] },
      { name: 'Capricorn', start: [12, 22], end: [12, 31] }
    ];
    for (const s of signs) {
      if (
        (month === s.start[0] && day >= s.start[1]) ||
        (month === s.end[0] && day <= s.end[1])
      ) {
        return s.name;
      }
    }
    return 'Capricorn';
  };

  const zodiac = isValid ? getZodiac(dateObj.getMonth() + 1, dateObj.getDate()) : '--';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Compass className="w-5 h-5 text-emerald-500" /> Date to Day Finder
        </h2>
        <p className="text-xs text-slate-500">
          Find the exact weekday, week number, day of year, and astronomical details for any calendar date.
        </p>

        <div className="max-w-xs mx-auto">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pick Any Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-base text-center text-sm font-bold font-mono py-2"
          />
        </div>
      </div>

      {isValid && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Weekday Result
            </span>
            <div className="text-5xl sm:text-6xl font-black text-emerald-600 dark:text-emerald-400">
              {dayOfWeek}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-400">Day of Year</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {dayOfYear}/{totalYearDays}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-400">Week Number</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                Week #{weekNumber}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-400">Leap Year</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                {isLeap(dateObj.getFullYear()) ? 'Yes' : 'No'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-400">Zodiac Sign</div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {zodiac}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
