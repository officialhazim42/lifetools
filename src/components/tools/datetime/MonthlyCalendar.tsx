import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  color: 'emerald' | 'sky' | 'amber' | 'rose';
}

const STORAGE_KEY = 'lifetools_monthly_calendar_events';

export const MonthlyCalendar: React.FC = () => {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    return storage.get<CalendarEvent[]>(STORAGE_KEY, [
      { id: 'ev_1', date: today, title: 'LifeTools Production Verification', color: 'emerald' }
    ]);
  });

  const [selectedDayStr, setSelectedDayStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState<CalendarEvent['color']>('emerald');

  useEffect(() => {
    storage.set(STORAGE_KEY, events);
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Enter event title', 'warning');
      return;
    }

    const newEv: CalendarEvent = {
      id: 'ev_' + Date.now(),
      date: selectedDayStr,
      title: newTitle.trim(),
      color: newColor
    };

    setEvents(prev => [...prev, newEv]);
    setNewTitle('');
    showToast('Event scheduled!');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const selectedDayEvents = events.filter(e => e.date === selectedDayStr);

  return (
    <div className="space-y-6">
      {/* Month Header Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-secondary p-1.5 rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="btn-secondary text-xs py-1 px-2.5"
          >
            Today
          </button>
          <button onClick={nextMonth} className="btn-secondary p-1.5 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-800 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div
                key={d}
                className="py-2 text-[11px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 border-r border-b border-slate-200 dark:border-slate-800 text-slate-500"
              >
                {d}
              </div>
            ))}

            {calendarDays.map((dayNum, idx) => {
              const dateStr = dayNum
                ? `${year}-${(month + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
                : '';
              const isSelected = dateStr === selectedDayStr;
              const isToday =
                dayNum === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              const dayEvents = events.filter(e => e.date === dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => dayNum && setSelectedDayStr(dateStr)}
                  className={`min-h-[75px] p-1.5 border-r border-b border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    dayNum === null
                      ? 'bg-slate-50/30 dark:bg-slate-950/20'
                      : isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500 inset-0'
                      : isToday
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {dayNum !== null && (
                    <>
                      <span
                        className={`inline-block w-5 h-5 rounded-full text-[11px] font-bold text-center leading-5 ${
                          isToday
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {dayNum}
                      </span>

                      <div className="space-y-1 mt-1">
                        {dayEvents.slice(0, 2).map(ev => (
                          <div
                            key={ev.id}
                            className={`text-[9px] font-semibold truncate px-1 rounded ${
                              ev.color === 'emerald' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                              ev.color === 'sky' ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300' :
                              ev.color === 'rose' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                              'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-bold block">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda & Form */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Agenda for {new Date(selectedDayStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </h3>

            {/* Event List */}
            <div className="space-y-2 min-h-24 max-h-56 overflow-y-auto">
              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4 text-center">
                  No events on this date.
                </p>
              ) : (
                selectedDayEvents.map(ev => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate flex-1">
                      {ev.title}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add event form */}
            <form onSubmit={handleAddEvent} className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <input
                type="text"
                placeholder="New event title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-base text-xs py-1.5"
              />
              <div className="flex items-center gap-2">
                <select
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value as any)}
                  className="input-base text-xs py-1 px-2 flex-1"
                >
                  <option value="emerald">Green Accent</option>
                  <option value="sky">Blue Accent</option>
                  <option value="amber">Amber Accent</option>
                  <option value="rose">Rose Accent</option>
                </select>
                <button type="submit" className="btn-primary text-xs py-1.5 px-3">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
