import React, { useState, useEffect } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import { WorkspaceHabit } from '../../types/workspace';
import {
  Repeat,
  Plus,
  Flame,
  Check,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

const HABIT_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export const WorkspaceHabits: React.FC = () => {
  const [habits, setHabits] = useState<WorkspaceHabit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<WorkspaceHabit | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState(HABIT_COLORS[0]);
  const [formFrequency, setFormFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');

  const todayStr = new Date().toISOString().split('T')[0];

  const loadHabits = async () => {
    const list = await workspaceDB.getHabits();
    setHabits(list);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  // Compute past 7 days dates array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString([], { weekday: 'narrow' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum, isToday: dateStr === todayStr };
  });

  const openNewModal = () => {
    setEditingHabit(null);
    setFormName('');
    setFormDesc('');
    setFormColor(HABIT_COLORS[0]);
    setFormFrequency('daily');
    setIsModalOpen(true);
  };

  const openEditModal = (habit: WorkspaceHabit) => {
    setEditingHabit(habit);
    setFormName(habit.name);
    setFormDesc(habit.description || '');
    setFormColor(habit.color || HABIT_COLORS[0]);
    setFormFrequency(habit.frequency);
    setIsModalOpen(true);
  };

  const handleSaveHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const habitToSave: WorkspaceHabit = {
      id: editingHabit ? editingHabit.id : `habit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: formName.trim(),
      description: formDesc.trim(),
      color: formColor,
      frequency: formFrequency,
      history: editingHabit ? editingHabit.history : {},
      createdAt: editingHabit ? editingHabit.createdAt : new Date().toISOString()
    };

    await workspaceDB.saveHabit(habitToSave);
    setIsModalOpen(false);
    loadHabits();
  };

  const handleDeleteHabit = async (id: string) => {
    if (window.confirm('Delete this habit and all its logged history?')) {
      await workspaceDB.deleteHabit(id);
      loadHabits();
    }
  };

  const handleToggleDay = async (habitId: string, dateStr: string) => {
    await workspaceDB.toggleHabitDate(habitId, dateStr);
    loadHabits();
  };

  // Streak calculation helper
  const calculateStreak = (history: Record<string, boolean>) => {
    let streak = 0;
    const d = new Date();

    // Check if completed today, or start from yesterday
    const today = d.toISOString().split('T')[0];
    const isCompletedToday = Boolean(history && history[today]);

    if (isCompletedToday) {
      streak += 1;
    }

    // Check consecutive days backwards
    for (let i = 1; i <= 365; i++) {
      const prev = new Date();
      prev.setDate(prev.getDate() - (isCompletedToday ? i : i - 1));
      const pStr = prev.toISOString().split('T')[0];
      if (history && history[pStr]) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  };

  // Total completions
  const calculateTotalCompletions = (history: Record<string, boolean>) => {
    return Object.keys(history || {}).length;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Repeat className="w-5 h-5 text-purple-500" />
            My Habits & Consistency Streaks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Build discipline with daily check-ins, consistency streaks, and weekly progress.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Empty State */}
      {habits.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Repeat className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No habits established yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Start small! Track daily habits like reading 15 pages, 20-minute morning workout, drinking 2.5L water, or evening meditation.
          </p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => {
            const streak = calculateStreak(habit.history);
            const totalDone = calculateTotalCompletions(habit.history);

            // Weekly completion in past 7 days
            const weekDoneCount = last7Days.filter((d) => habit.history && habit.history[d.dateStr]).length;
            const weekPct = Math.round((weekDoneCount / 7) * 100);

            return (
              <div
                key={habit.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 group"
              >
                {/* Habit Info & Streak */}
                <div className="space-y-1.5 min-w-[220px]">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: habit.color || '#10b981' }}
                    />
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {habit.name}
                    </h3>
                  </div>

                  {habit.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {habit.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs pt-1">
                    <span className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {streak} {streak === 1 ? 'day streak' : 'days streak'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 font-medium">
                      {weekDoneCount}/7 this week ({weekPct}%)
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">
                      {totalDone} total
                    </span>
                  </div>
                </div>

                {/* 7-Day Interactive Matrix */}
                <div className="flex items-center gap-2">
                  {last7Days.map((day) => {
                    const isChecked = Boolean(habit.history && habit.history[day.dateStr]);

                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => handleToggleDay(habit.id, day.dateStr)}
                        className={`flex flex-col items-center justify-center w-10 h-14 rounded-xl border transition cursor-pointer ${
                          isChecked
                            ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-purple-400'
                        } ${day.isToday ? 'ring-2 ring-purple-500/40 ring-offset-1 dark:ring-offset-slate-800' : ''}`}
                        title={`${day.dateStr} — Click to toggle`}
                      >
                        <span className="text-[10px] uppercase font-semibold">
                          {day.dayName}
                        </span>
                        <span className="text-xs font-bold mt-1">
                          {day.dayNum}
                        </span>
                        <div className="mt-1">
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(habit)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
                    title="Edit habit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition"
                    title="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {editingHabit ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Read 20 mins, 5km Morning Run..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description / Motivation (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Why this habit matters..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Frequency
                  </label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white capitalize"
                  >
                    <option value="daily">Every Day</option>
                    <option value="weekdays">Weekdays (Mon-Fri)</option>
                    <option value="weekends">Weekends (Sat-Sun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {HABIT_COLORS.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setFormColor(clr)}
                        className={`w-6 h-6 rounded-full border transition flex items-center justify-center ${
                          formColor === clr ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-slate-800' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: clr }}
                      >
                        {formColor === clr && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </div>
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  {editingHabit ? 'Update Habit' : 'Save Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
