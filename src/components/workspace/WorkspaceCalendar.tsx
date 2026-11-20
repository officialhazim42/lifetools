import React, { useState, useEffect } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import { WorkspaceEvent, EventCategory, WorkspaceTask } from '../../types/workspace';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Bell,
  Sparkles
} from 'lucide-react';

const CATEGORY_META: Record<EventCategory, { label: string; badge: string; dot: string }> = {
  event: { label: 'Event', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300', dot: 'bg-blue-500' },
  reminder: { label: 'Reminder', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300', dot: 'bg-amber-500' },
  deadline: { label: 'Deadline', badge: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300', dot: 'bg-red-500' },
  personal: { label: 'Personal', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300', dot: 'bg-purple-500' },
  work: { label: 'Work', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

export const WorkspaceCalendar: React.FC = () => {
  const [events, setEvents] = useState<WorkspaceEvent[]>([]);
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WorkspaceEvent | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formCategory, setFormCategory] = useState<EventCategory>('event');
  const [formPriority, setFormPriority] = useState<'normal' | 'important'>('normal');

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    const [allEvents, allTasks] = await Promise.all([
      workspaceDB.getEvents(),
      workspaceDB.getTasks()
    ]);
    setEvents(allEvents);
    setTasks(allTasks);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const monthName = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' });

  // First day of month & total days
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateStr(todayStr);
  };

  const openNewEventModal = (presetDate?: string) => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDesc('');
    setFormDate(presetDate || selectedDateStr || todayStr);
    setFormTime('10:00');
    setFormCategory('event');
    setFormPriority('normal');
    setIsModalOpen(true);
  };

  const openEditEventModal = (event: WorkspaceEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDesc(event.description || '');
    setFormDate(event.date);
    setFormTime(event.time || '');
    setFormCategory(event.category);
    setFormPriority(event.priority);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    const eventToSave: WorkspaceEvent = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      description: formDesc.trim(),
      date: formDate,
      time: formTime || undefined,
      category: formCategory,
      priority: formPriority,
      createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString()
    };

    await workspaceDB.saveEvent(eventToSave);
    setIsModalOpen(false);
    loadData();
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Delete this calendar event?')) {
      await workspaceDB.deleteEvent(id);
      loadData();
    }
  };

  // Build calendar matrix cells
  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarCells.push({ day: d, isCurrentMonth: false, dateStr: '' });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(i).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    calendarCells.push({ day: i, isCurrentMonth: true, dateStr });
  }

  // Next month leading days to complete grid
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= (remainingCells >= 7 ? remainingCells - 7 : remainingCells); i++) {
    calendarCells.push({ day: i, isCurrentMonth: false, dateStr: '' });
  }

  // Events & tasks for selected date
  const selectedDateEvents = events.filter((e) => e.date === selectedDateStr);
  const selectedDateTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  // Upcoming events
  const upcomingEvents = events
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            My Calendar & Reminders
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plan your schedule, track meetings, set deadlines, and monitor task due dates.
          </p>
        </div>

        <button
          onClick={() => openNewEventModal()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Main Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Calendar Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                {monthName}
              </h3>
              <button
                onClick={goToToday}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-1 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={idx}
                    className="h-14 sm:h-16 p-1.5 rounded-xl border border-transparent bg-slate-50/40 dark:bg-slate-850/20 text-slate-300 dark:text-slate-600 text-xs flex flex-col justify-between select-none pointer-events-none"
                  >
                    <span>{cell.day}</span>
                  </div>
                );
              }

              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;

              // Check if events or tasks exist on this date
              const dayEvents = events.filter((e) => e.date === cell.dateStr);
              const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr && !t.completed);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`h-14 sm:h-16 p-1.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                      : isToday
                      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center'
                          : isSelected
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {cell.day}
                    </span>
                  </div>

                  {/* Indicator Dots */}
                  <div className="flex items-center gap-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((e) => {
                      const meta = CATEGORY_META[e.category] || CATEGORY_META.event;
                      return (
                        <span
                          key={e.id}
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`}
                          title={e.title}
                        />
                      );
                    })}
                    {dayTasks.length > 0 && (
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                        title={`${dayTasks.length} pending task(s)`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Date Agenda & Upcoming */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Date Agenda */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Selected Date
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedDateStr === todayStr ? 'Today, ' : ''}
                  {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    weekday: 'short'
                  })}
                </div>
              </div>

              <button
                onClick={() => openNewEventModal(selectedDateStr)}
                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl transition"
                title="Add event to selected date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDateEvents.length === 0 && selectedDateTasks.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                No events or tasks scheduled for this day.
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {/* Events */}
                {selectedDateEvents.map((e) => {
                  const meta = CATEGORY_META[e.category] || CATEGORY_META.event;
                  return (
                    <div
                      key={e.id}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {e.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          {e.time && (
                            <span className="flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {e.time}
                            </span>
                          )}
                          <span>•</span>
                          <span className={`px-1 rounded text-[9px] font-bold ${meta.badge}`}>
                            {meta.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditEventModal(e)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(e.id)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Tasks due on this day */}
                {selectedDateTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold text-amber-900 dark:text-amber-200 truncate">
                        ✓ Task: {t.title}
                      </div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400">
                        Priority: {t.priority}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Highlights */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Upcoming Events ({upcomingEvents.length})
            </h4>

            {upcomingEvents.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                No future events scheduled.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {upcomingEvents.map((evt) => (
                  <div key={evt.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {evt.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {evt.date} {evt.time ? `at ${evt.time}` : ''}
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 shrink-0">
                      {evt.date === todayStr ? 'Today' : evt.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {editingEvent ? 'Edit Calendar Event' : 'Add Calendar Event'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Event / Reminder Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quarterly Team Review, Dentist appointment..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description / Location (Optional)
                </label>
                <textarea
                  placeholder="Notes, link, or meeting details..."
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as EventCategory)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white capitalize"
                  >
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <option key={key} value={key}>
                        {meta.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="important">Important</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  {editingEvent ? 'Update Event' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
