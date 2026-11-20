import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  CalendarDays,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DaySchedule {
  dayName: string;
  tasks: string[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STORAGE_KEY = 'lifetools_weekly_planner';

export const WeeklyPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [weeklyGoal, setWeeklyGoal] = useState(() => {
    return storage.get<string>(`${STORAGE_KEY}_goal`, 'Complete primary project deliverables & stay consistent');
  });

  const [days, setDays] = useState<Record<string, string[]>>(() => {
    return storage.get<Record<string, string[]>>(STORAGE_KEY, {
      Monday: ['Review weekly priorities', 'Team sync'],
      Tuesday: ['Deep work on critical tasks'],
      Wednesday: ['Mid-week progress review'],
      Thursday: ['Finalize draft milestones'],
      Friday: ['Sprint wrap-up & retrospective'],
      Saturday: ['Personal learning & reading'],
      Sunday: ['Rest & plan upcoming week']
    });
  });

  const [newTaskInput, setNewTaskInput] = useState<Record<string, string>>({});

  useEffect(() => {
    storage.set(STORAGE_KEY, days);
    storage.set(`${STORAGE_KEY}_goal`, weeklyGoal);
  }, [days, weeklyGoal]);

  const handleAddTask = (day: string) => {
    const text = (newTaskInput[day] || '').trim();
    if (!text) return;
    setDays(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), text]
    }));
    setNewTaskInput(prev => ({ ...prev, [day]: '' }));
    showToast(`Task added to ${day}`);
  };

  const handleRemoveTask = (day: string, index: number) => {
    setDays(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const handleReset = () => {
    setDays({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    });
    setWeeklyGoal('');
    showToast('Weekly planner reset');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Goal */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Focus & Agenda</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="btn-secondary text-xs py-1.5">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={handleReset} className="btn-secondary text-xs py-1.5 text-rose-500 hover:text-rose-600">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
            Weekly Main Objective:
          </span>
          <input
            type="text"
            value={weeklyGoal}
            onChange={(e) => setWeeklyGoal(e.target.value)}
            placeholder="What is your #1 goal this week?"
            className="input-base text-xs py-1.5"
          />
        </div>
      </div>

      {/* 7 Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const isWeekend = day === 'Saturday' || day === 'Sunday';
          const taskList = days[day] || [];

          return (
            <div
              key={day}
              className={`rounded-2xl border p-4 flex flex-col justify-between shadow-subtle ${
                isWeekend
                  ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {day}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {taskList.length}
                  </span>
                </div>

                <div className="space-y-1.5 min-h-[140px] max-h-[260px] overflow-y-auto">
                  {taskList.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic py-2">No tasks</p>
                  ) : (
                    taskList.map((task, idx) => (
                      <div
                        key={idx}
                        className="group flex items-start justify-between gap-1 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <span className="break-words flex-1 leading-snug">{task}</span>
                        <button
                          onClick={() => handleRemoveTask(day, idx)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                          title="Remove task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask(day);
                  }}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    value={newTaskInput[day] || ''}
                    onChange={(e) =>
                      setNewTaskInput(prev => ({ ...prev, [day]: e.target.value }))
                    }
                    placeholder="Add..."
                    className="input-base py-1 px-2 text-[11px] h-7"
                  />
                  <button type="submit" className="btn-primary p-1 h-7 w-7 shrink-0 text-xs" title="Add">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
