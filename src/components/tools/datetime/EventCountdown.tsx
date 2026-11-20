import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Calendar, AlertCircle, Share2, Sparkles } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface EventItem {
  id: string;
  title: string;
  date: string; // ISO date-time string YYYY-MM-DDTHH:mm
  category: string;
  notes?: string;
}

const STORAGE_KEY = 'lifetools_event_countdown';

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'sample-new-year',
    title: 'New Year Celebration',
    date: `${new Date().getFullYear() + 1}-01-01T00:00`,
    category: 'Holiday',
    notes: 'Welcoming the new year!'
  }
];

export const EventCountdown: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_EVENTS);
  });
  const [now, setNow] = useState<Date>(new Date());

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Personal');
  const [notes, setNotes] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, events);
  }, [events]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const newEvent: EventItem = {
      id: 'event_' + Date.now(),
      title: title.trim(),
      date,
      category,
      notes: notes.trim()
    };

    setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setTitle('');
    setDate('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const getRemainingTime = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const diff = target - now.getTime();
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const seconds = Math.floor((absDiff / 1000) % 60);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, isPast, totalMs: diff };
  };

  const handleCopySummary = (item: EventItem) => {
    const rem = getRemainingTime(item.date);
    const text = `${item.title}: ${rem.isPast ? 'Passed ' : 'In '}${rem.days}d ${rem.hours}h ${rem.minutes}m ${rem.seconds}s (${new Date(item.date).toLocaleString()})`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" /> Date & Time Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Event Countdown
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Track upcoming milestones, product launches, exams, vacations, and celebrations in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-500" /> Add New Event
          </h2>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Vacation in Tokyo"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work / Project</option>
                <option value="Holiday">Holiday & Travel</option>
                <option value="Celebration">Birthday / Celebration</option>
                <option value="Academic">Exam / School</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Key details or location..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Save Event
            </button>
          </form>
        </div>

        {/* Events Grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Active Countdowns ({events.length})
            </h2>
            {events.length > 0 && (
              <button
                onClick={() => setEvents([])}
                className="text-xs text-rose-500 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No events scheduled yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Add your upcoming launches, exams, trips, or deadlines to see live ticking countdowns.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map(ev => {
                const rem = getRemainingTime(ev.date);
                const eventDate = new Date(ev.date);

                return (
                  <div
                    key={ev.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-amber-500/40"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {ev.category}
                          </span>
                          {rem.isPast ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-500">
                              Passed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Upcoming
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {eventDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                          {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopySummary(ev)}
                          title="Copy countdown summary"
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
                          title="Delete event"
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {copiedId === ev.id && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-2 font-medium">
                        ✓ Copied to clipboard!
                      </div>
                    )}

                    {/* Countdown Digits */}
                    <div className="grid grid-cols-4 gap-2 text-center my-3">
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {rem.days}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                          Days
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {String(rem.hours).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                          Hours
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {String(rem.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                          Mins
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-amber-500 font-mono">
                          {String(rem.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                          Secs
                        </div>
                      </div>
                    </div>

                    {ev.notes && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        {ev.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
