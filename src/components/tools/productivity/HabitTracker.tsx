import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Flame,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  category: string;
  history: Record<string, boolean>; // 'YYYY-MM-DD' => true
  createdAt: number;
}

const STORAGE_KEY = 'lifetools_habit_tracker';

// Get last 7 days keys
const getLast7Days = () => {
  const dates: { key: string; label: string; dayNumber: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString([], { weekday: 'short' });
    dates.push({ key, label, dayNumber: d.getDate() });
  }
  return dates;
};

export const HabitTracker: React.FC = () => {
  const { showToast } = useToast();
  const [days] = useState(getLast7Days);
  const [habits, setHabits] = useState<Habit[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    return storage.get<Habit[]>(STORAGE_KEY, [
      {
        id: 'habit_1',
        name: 'Drink 2 Liters Water',
        category: 'Health',
        history: { [today]: true },
        createdAt: Date.now()
      },
      {
        id: 'habit_2',
        name: 'Read 20 Pages',
        category: 'Learning',
        history: {},
        createdAt: Date.now()
      },
      {
        id: 'habit_3',
        name: '30 Min Exercise',
        category: 'Fitness',
        history: { [today]: true },
        createdAt: Date.now()
      }
    ]);
  });

  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Personal');

  useEffect(() => {
    storage.set(STORAGE_KEY, habits);
  }, [habits]);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      showToast('Enter a habit name', 'warning');
      return;
    }

    const newHabit: Habit = {
      id: 'habit_' + Date.now(),
      name: newHabitName.trim(),
      category: newHabitCategory.trim() || 'General',
      history: {},
      createdAt: Date.now()
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    showToast('Habit added!');
  };

  const handleToggleDay = (habitId: string, dateKey: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        const current = !!h.history[dateKey];
        const nextHistory = { ...h.history };
        if (current) {
          delete nextHistory[dateKey];
        } else {
          nextHistory[dateKey] = true;
        }
        return { ...h, history: nextHistory };
      })
    );
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    showToast('Habit removed', 'info');
  };

  // Calculate current streak
  const calculateStreak = (history: Record<string, boolean>) => {
    let streak = 0;
    const d = new Date();
    // Check if done today or yesterday
    const todayKey = d.toISOString().split('T')[0];
    d.setDate(d.getDate() - 1);
    const yesterdayKey = d.toISOString().split('T')[0];

    if (!history[todayKey] && !history[yesterdayKey]) {
      return 0;
    }

    let checkDate = new Date();
    if (!history[todayKey]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const k = checkDate.toISOString().split('T')[0];
      if (history[k]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const totalCompletionsThisWeek = habits.reduce((acc, h) => {
    const doneDays = days.filter(d => h.history[d.key]).length;
    return acc + doneDays;
  }, 0);

  const possibleCompletions = habits.length * 7;
  const weeklyRate = possibleCompletions > 0 ? Math.round((totalCompletionsThisWeek / possibleCompletions) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {habits.length}
            </div>
            <div className="text-xs text-slate-500">Tracked Habits</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalCompletionsThisWeek}
            </div>
            <div className="text-xs text-slate-500">Check-ins This Week</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {weeklyRate}%
            </div>
            <div className="text-xs text-slate-500">Weekly Consistency</div>
          </div>
        </div>
      </div>

      {/* Add Habit Bar */}
      <form onSubmit={handleAddHabit} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="New habit name (e.g., Morning Meditation, Gym, 10k Steps)..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          className="input-base text-sm flex-1"
        />
        <select
          value={newHabitCategory}
          onChange={(e) => setNewHabitCategory(e.target.value)}
          className="input-base text-xs sm:w-40"
        >
          <option value="Health">Health & Wellness</option>
          <option value="Fitness">Fitness & Sports</option>
          <option value="Learning">Learning & Study</option>
          <option value="Productivity">Work & Productivity</option>
          <option value="Personal">Personal Growth</option>
        </select>
        <button type="submit" className="btn-primary text-xs py-2.5 px-4 shrink-0 w-full sm:w-auto">
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </form>

      {/* Habit Matrix Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Habit Name</th>
              <th className="p-4 text-center">Streak</th>
              {days.map(d => (
                <th key={d.key} className="p-4 text-center">
                  <div>{d.label}</div>
                  <div className="text-slate-400 font-normal">{d.dayNumber}</div>
                </th>
              ))}
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {habits.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-xs text-slate-400">
                  No habits added yet. Start by adding one above.
                </td>
              </tr>
            ) : (
              habits.map((habit) => {
                const streak = calculateStreak(habit.history);
                return (
                  <tr key={habit.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {habit.name}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {habit.category}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" /> {streak}d
                      </span>
                    </td>

                    {days.map(d => {
                      const isDone = !!habit.history[d.key];
                      return (
                        <td key={d.key} className="p-4 text-center">
                          <button
                            onClick={() => handleToggleDay(habit.id, d.key)}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-white shadow-sm scale-105'
                                : 'bg-slate-100 dark:bg-slate-800 text-transparent hover:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            title={`Toggle ${d.key}`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </td>
                      );
                    })}

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
