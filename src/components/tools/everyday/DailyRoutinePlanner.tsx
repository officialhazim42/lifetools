import React, { useState, useEffect } from 'react';
import { safeStorage } from '../../../utils/storage';
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';

interface RoutineItem {
  id: string;
  title: string;
  duration: number; // in minutes
  category: 'morning' | 'afternoon' | 'evening' | 'night';
}

const DEFAULT_ROUTINES: RoutineItem[] = [
  // Morning
  { id: 'm1', title: 'Drink 500ml warm water & hydrate', duration: 2, category: 'morning' },
  { id: 'm2', title: '10-minute stretching / light mobility', duration: 10, category: 'morning' },
  { id: 'm3', title: 'Healthy nutrient-dense breakfast', duration: 20, category: 'morning' },
  { id: 'm4', title: 'Review today’s Top 3 priorities', duration: 5, category: 'morning' },

  // Afternoon
  { id: 'a1', title: 'Healthy lunch & step away from screens', duration: 30, category: 'afternoon' },
  { id: 'a2', title: '15-minute brisk walk / sunlight break', duration: 15, category: 'afternoon' },
  { id: 'a3', title: 'Hydration check & deep focus block', duration: 5, category: 'afternoon' },

  // Evening
  { id: 'e1', title: 'Wrap up work tasks & clear desk', duration: 10, category: 'evening' },
  { id: 'e2', title: '30-minute physical exercise or sport', duration: 30, category: 'evening' },
  { id: 'e3', title: 'Nutritious dinner with family', duration: 35, category: 'evening' },

  // Night
  { id: 'n1', title: 'Digital detox (turn off screens & blue light)', duration: 30, category: 'night' },
  { id: 'n2', title: 'Prepare clothes & bag for tomorrow', duration: 10, category: 'night' },
  { id: 'n3', title: 'Read a book chapter or practice mindfulness', duration: 20, category: 'night' },
];

export const DailyRoutinePlanner: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    return safeStorage.getItem<RoutineItem[]>('daily_routines_list', DEFAULT_ROUTINES);
  });

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    return safeStorage.getItem<string[]>(`daily_routine_done_${todayStr}`, []);
  });

  const [activeTab, setActiveTab] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('15');
  const [newCategory, setNewCategory] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [showAddForm, setShowAddForm] = useState(false);

  // Save routines
  useEffect(() => {
    safeStorage.setItem('daily_routines_list', routines);
  }, [routines]);

  // Save today's completions
  useEffect(() => {
    safeStorage.setItem(`daily_routine_done_${todayStr}`, completedIds);
  }, [completedIds, todayStr]);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: RoutineItem = {
      id: `r-${Date.now()}`,
      title: newTitle.trim(),
      duration: Math.max(1, parseInt(newDuration) || 10),
      category: newCategory
    };

    setRoutines((prev) => [...prev, newItem]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    setCompletedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all routines to default healthy habits?')) {
      setRoutines(DEFAULT_ROUTINES);
      setCompletedIds([]);
    }
  };

  const handleClearCompletedToday = () => {
    setCompletedIds([]);
  };

  // Calculations
  const totalItems = routines.length;
  const completedCount = completedIds.filter((id) => routines.some((r) => r.id === id)).length;
  const percentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  const totalPlannedMinutes = routines.reduce((sum, r) => sum + r.duration, 0);

  const categories = [
    { key: 'morning', label: 'Morning Routine', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { key: 'afternoon', label: 'Afternoon Focus', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { key: 'evening', label: 'Evening Wind-Down', icon: Sunset, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { key: 'night', label: 'Night Routine', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  ] as const;

  const filteredRoutines = activeTab === 'all'
    ? routines
    : routines.filter((r) => r.category === activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Daily Routine Planner</h1>
          </div>
          <p className="text-amber-100 text-sm mt-1">
            Build discipline with morning, afternoon, evening, and night routines that stick.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-medium text-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Routine</span>
          </button>
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {completedCount} / {totalItems}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Completed Today ({percentage}%)</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalPlannedMinutes} <span className="text-sm font-normal text-slate-500">mins</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Planned Habits Time</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {percentage === 100 ? 'Complete!' : `${100 - percentage}% Left`}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Today's Consistency Status</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Daily Routine Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddRoutine}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4 animate-fadeIn"
        >
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-500" />
            Add New Routine Habit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Routine Habit Name
              </label>
              <input
                type="text"
                placeholder="e.g. 15-minute meditation"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="240"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Time Block
              </label>
              <div className="flex gap-2">
                {(['morning', 'afternoon', 'evening', 'night'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                      newCategory === cat
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Add Routine
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Routine Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          All Routines ({routines.length})
        </button>
        {categories.map((cat) => {
          const count = routines.filter((r) => r.category === cat.key).length;
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === cat.key
                  ? 'bg-amber-500 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Routine Cards by Category */}
      <div className="space-y-6">
        {categories
          .filter((cat) => activeTab === 'all' || activeTab === cat.key)
          .map((cat) => {
            const items = filteredRoutines.filter((r) => r.category === cat.key);
            if (items.length === 0) return null;
            const Icon = cat.icon;

            return (
              <div
                key={cat.key}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <div className={`p-4 ${cat.bg} border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${cat.color}`} />
                    <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {cat.label}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {items.filter((i) => completedIds.includes(i.id)).length} / {items.length} done
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {items.map((routine) => {
                    const isDone = completedIds.includes(routine.id);
                    return (
                      <div
                        key={routine.id}
                        onClick={() => toggleComplete(routine.id)}
                        className={`p-4 flex items-center justify-between cursor-pointer transition select-none ${
                          isDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-slate-400'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => {}} // handled by parent onClick
                            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 dark:border-slate-600 cursor-pointer"
                          />
                          <div>
                            <p className={`text-sm font-medium ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                              {routine.title}
                            </p>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {routine.duration} mins
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(routine.id);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition"
                          title="Delete habit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleClearCompletedToday}
          className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear today's checkmarks
        </button>
        <button
          onClick={handleResetDefaults}
          className="text-xs text-red-500 hover:text-red-700 transition"
        >
          Reset to default routines
        </button>
      </div>
    </div>
  );
};
