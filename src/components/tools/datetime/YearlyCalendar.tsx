import React, { useState } from 'react';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles
} from 'lucide-react';

export const YearlyCalendar: React.FC = () => {
  const [year, setYear] = useState<number>(() => new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  const renderMonth = (monthIndex: number) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
      <div
        key={monthIndex}
        className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2 text-center"
      >
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
          {monthNames[monthIndex]}
        </h3>

        <div className="grid grid-cols-7 text-[10px] text-slate-400 font-bold">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-[10px] gap-y-1">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={`h-5 flex items-center justify-center rounded ${
                d === null ? '' : 'text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setYear(y => y - 1)} className="btn-secondary p-1.5 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-xl font-black text-slate-900 dark:text-white min-w-28 text-center font-mono">
            {year}
          </div>
          <button onClick={() => setYear(y => y + 1)} className="btn-secondary p-1.5 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>{isLeapYear(year) ? '366 Days (Leap Year)' : '365 Days (Standard Year)'}</span>
          <button onClick={() => window.print()} className="btn-primary text-xs py-1.5 px-3">
            <Printer className="w-3.5 h-3.5" /> Print Year
          </button>
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(m => renderMonth(m))}
      </div>
    </div>
  );
};
