import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Printer,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export const CalendarGenerator: React.FC = () => {
  const { showToast } = useToast();
  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth()); // 0-11
  const [startOnMonday, setStartOnMonday] = useState(false);
  const [notes, setNotes] = useState('Important monthly milestones & deliverables');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysHeader = startOnMonday
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const adjustedFirstDay = startOnMonday ? (firstDayIndex === 0 ? 6 : firstDayIndex - 1) : firstDayIndex;

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="space-y-6">
      {/* Configuration Ribbon */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-secondary p-1.5 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-base font-bold text-slate-900 dark:text-white min-w-36 text-center">
            {monthNames[month]} {year}
          </div>
          <button onClick={nextMonth} className="btn-secondary p-1.5 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={startOnMonday}
              onChange={(e) => setStartOnMonday(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            Start on Monday
          </label>

          <button onClick={() => window.print()} className="btn-primary text-xs py-1.5 px-3">
            <Printer className="w-3.5 h-3.5" /> Print Calendar
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg print:shadow-none print:border-0 print:p-0 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {daysInMonth} Days • LifeTools Printable Calendar
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            LifeTools.app
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-800 text-center">
          {daysHeader.map(d => (
            <div
              key={d}
              className="py-2.5 text-xs font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 border-r border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {d}
            </div>
          ))}

          {calendarDays.map((dayNum, idx) => {
            const isToday =
              dayNum === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={idx}
                className={`min-h-[85px] sm:min-h-[100px] p-2 border-r border-b border-slate-200 dark:border-slate-800 text-left transition-colors flex flex-col justify-between ${
                  dayNum === null
                    ? 'bg-slate-50/30 dark:bg-slate-950/20'
                    : isToday
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                {dayNum !== null && (
                  <>
                    <span
                      className={`inline-block w-6 h-6 rounded-full text-xs font-bold text-center leading-6 ${
                        isToday
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {dayNum}
                    </span>
                    <div className="flex-1 mt-1"></div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Notes Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Monthly Notes & Goal Reminders:
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-transparent border-0 text-xs text-slate-800 dark:text-slate-200 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};
