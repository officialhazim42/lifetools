import React, { useState, useEffect } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import {
  WorkspaceStats,
  WorkspaceTask,
  WorkspaceHabit,
  WorkspaceEvent
} from '../../types/workspace';
import {
  CheckSquare,
  FileText,
  Repeat,
  Target,
  Wallet,
  Calendar,
  Plus,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface WorkspaceDashboardProps {
  onSwitchTab: (tab: string) => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({ onSwitchTab }) => {
  const [stats, setStats] = useState<WorkspaceStats>({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    totalNotes: 0,
    activeHabits: 0,
    currentGoals: 0,
    monthlyExpenses: 0,
    upcomingEvents: 0
  });

  const [urgentTasks, setUrgentTasks] = useState<WorkspaceTask[]>([]);
  const [todayHabits, setTodayHabits] = useState<WorkspaceHabit[]>([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState<WorkspaceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = async () => {
    try {
      const [allStats, tasks, habits, events] = await Promise.all([
        workspaceDB.getStats(),
        workspaceDB.getTasks(),
        workspaceDB.getHabits(),
        workspaceDB.getEvents()
      ]);

      setStats(allStats);

      // Pending tasks that are urgent or due today/overdue
      const urgent = tasks.filter((t) => !t.completed).slice(0, 4);
      setUrgentTasks(urgent);

      // Today's habits
      setTodayHabits(habits);

      // Upcoming events (today and future)
      const upcoming = events.filter((e) => e.date >= todayStr).slice(0, 3);
      setUpcomingEventsList(upcoming);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleHabit = async (habitId: string) => {
    await workspaceDB.toggleHabitDate(habitId, todayStr);
    loadData();
  };

  const handleToggleTask = async (task: WorkspaceTask) => {
    const updated = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    await workspaceDB.saveTask(updated);
    loadData();
  };

  const isEmptyWorkspace =
    stats.totalTasks === 0 &&
    stats.totalNotes === 0 &&
    stats.activeHabits === 0 &&
    stats.currentGoals === 0 &&
    stats.monthlyExpenses === 0 &&
    stats.upcomingEvents === 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-emerald-100">
              <Sparkles className="w-3.5 h-3.5" />
              Private & Offline-First
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Productivity Workspace
            </h1>
            <p className="text-emerald-100/90 text-sm max-w-xl">
              Your personal dashboard for notes, tasks, expenses, habits, goals, and schedules. Stored safely inside your browser with zero cloud tracking.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onSwitchTab('tasks')}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => onSwitchTab('notes')}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>Quick Note</span>
            </button>
            <button
              onClick={() => onSwitchTab('expenses')}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-200" />
              <span>Record Spend</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Tasks */}
        <div
          onClick={() => onSwitchTab('tasks')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tasks
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {stats.totalTasks}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {stats.completedTasks} done
            </span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              {stats.pendingTasks} pending
            </span>
          </div>
        </div>

        {/* Total Notes */}
        <div
          onClick={() => onSwitchTab('notes')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Notes
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {stats.totalNotes}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {stats.totalNotes === 1 ? '1 saved note' : `${stats.totalNotes} saved notes`}
          </div>
        </div>

        {/* Active Habits */}
        <div
          onClick={() => onSwitchTab('habits')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Habits
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {stats.activeHabits}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {stats.activeHabits === 1 ? '1 active routine' : `${stats.activeHabits} active routines`}
          </div>
        </div>

        {/* Current Goals */}
        <div
          onClick={() => onSwitchTab('goals')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Goals
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {stats.currentGoals}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            In-progress milestones
          </div>
        </div>
      </div>

      {/* Secondary Metrics (Monthly Expenses & Calendar Events) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Monthly Expenses */}
        <div
          onClick={() => onSwitchTab('expenses')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                This Month's Spending
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                ₹{stats.monthlyExpenses.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span>Manage</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Upcoming Events */}
        <div
          onClick={() => onSwitchTab('calendar')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Upcoming Events & Reminders
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                {stats.upcomingEvents}
              </div>
            </div>
          </div>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <span>View Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Fresh Install Empty State */}
      {isEmptyWorkspace && !isLoading && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Welcome to Your Clean Workspace
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            There are no mock or sample records. Everything you see is 100% your own. Get started by organizing your tasks, taking notes, or building daily habits.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSwitchTab('tasks')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl shadow-sm transition"
            >
              Add Your First Task
            </button>
            <button
              onClick={() => onSwitchTab('notes')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl transition"
            >
              Create a Note
            </button>
            <button
              onClick={() => onSwitchTab('habits')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl transition"
            >
              Start a Daily Habit
            </button>
          </div>
        </div>
      )}

      {/* Split Activity Feed */}
      {!isEmptyWorkspace && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Pending Tasks & Deadlines */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                Priority Tasks to Tackle
              </h2>
              <button
                onClick={() => onSwitchTab('tasks')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                View all ({stats.pendingTasks})
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                No pending tasks right now. Great job!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="w-5 h-5 rounded-md border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-emerald-500 transition shrink-0"
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </button>
                      <div className="truncate">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate block">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="capitalize">{task.category || 'General'}</span>
                          {task.dueDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                                <Clock className="w-3 h-3" />
                                {task.dueDate}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        task.priority === 'urgent'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : task.priority === 'high'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Habits Check-in */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Today's Habits Check-in
              </h2>
              <button
                onClick={() => onSwitchTab('habits')}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                All habits
              </button>
            </div>

            {todayHabits.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                No habits established yet. Start a small daily streak!
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayHabits.map((h) => {
                  const isDoneToday = Boolean(h.history && h.history[todayStr]);

                  return (
                    <div
                      key={h.id}
                      onClick={() => handleToggleHabit(h.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                        isDoneToday
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: h.color || '#10b981' }}
                        />
                        <span
                          className={`text-xs font-semibold truncate ${
                            isDoneToday
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {h.name}
                        </span>
                      </div>

                      <div className="shrink-0">
                        {isDoneToday ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                            Tap to log
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
