import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
  Printer,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';

interface TimeBlock {
  id: string;
  time: string;
  activity: string;
  done: boolean;
}

interface DayPlan {
  date: string;
  priorities: string[];
  schedule: TimeBlock[];
  notes: string;
}

const DEFAULT_HOURS = [
  '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'
];

export const DailyPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const storageKey = `lifetools_daily_plan_${selectedDate}`;

  const [plan, setPlan] = useState<DayPlan>(() => {
    return storage.get<DayPlan>(storageKey, {
      date: selectedDate,
      priorities: ['', '', ''],
      schedule: DEFAULT_HOURS.map((h, i) => ({
        id: 'block_' + i,
        time: h,
        activity: '',
        done: false
      })),
      notes: ''
    });
  });

  // Switch date
  useEffect(() => {
    const key = `lifetools_daily_plan_${selectedDate}`;
    const loaded = storage.get<DayPlan>(key, {
      date: selectedDate,
      priorities: ['', '', ''],
      schedule: DEFAULT_HOURS.map((h, i) => ({
        id: 'block_' + i,
        time: h,
        activity: '',
        done: false
      })),
      notes: ''
    });
    setPlan(loaded);
  }, [selectedDate]);

  // Autosave
  useEffect(() => {
    storage.set(`lifetools_daily_plan_${selectedDate}`, plan);
  }, [plan, selectedDate]);

  const handlePriorityChange = (index: number, val: string) => {
    setPlan(prev => {
      const nextPriorities = [...prev.priorities];
      nextPriorities[index] = val;
      return { ...prev, priorities: nextPriorities };
    });
  };

  const handleActivityChange = (id: string, activity: string) => {
    setPlan(prev => ({
      ...prev,
      schedule: prev.schedule.map(s => (s.id === id ? { ...s, activity } : s))
    }));
  };

  const handleToggleDone = (id: string) => {
    setPlan(prev => ({
      ...prev,
      schedule: prev.schedule.map(s => (s.id === id ? { ...s, done: !s.done } : s))
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetDay = () => {
    setPlan({
      date: selectedDate,
      priorities: ['', '', ''],
      schedule: DEFAULT_HOURS.map((h, i) => ({
        id: 'block_' + i,
        time: h,
        activity: '',
        done: false
      })),
      notes: ''
    });
    showToast('Plan reset to default');
  };

  const completedActivities = plan.schedule.filter(s => s.activity && s.done).length;
  const totalActivities = plan.schedule.filter(s => s.activity).length;

  return (
    <div className="space-y-6">
      {/* Date bar & Print action */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">Daily Planning Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-base py-1 px-3 text-xs w-auto"
          />
        </div>

        <div className="flex items-center gap-2">
          {totalActivities > 0 && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              {completedActivities}/{totalActivities} tasks completed
            </span>
          )}
          <button onClick={handlePrint} className="btn-secondary text-xs py-1.5" title="Print daily plan">
            <Printer className="w-3.5 h-3.5" /> Print Plan
          </button>
          <button onClick={handleResetDay} className="btn-secondary text-xs py-1.5 text-rose-500 hover:text-rose-600" title="Clear Day">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top 3 Priorities & Notes */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Top 3 Daily Priorities
            </h3>
            <div className="space-y-2.5">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={plan.priorities[idx] || ''}
                    onChange={(e) => handlePriorityChange(idx, e.target.value)}
                    placeholder={`High priority goal #${idx + 1}`}
                    className="input-base text-xs py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Daily Notes & Reflections
            </h3>
            <textarea
              value={plan.notes}
              onChange={(e) => setPlan(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Jot down quick reminders, wins, or thoughts for the day..."
              rows={8}
              className="input-base text-xs leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Right Column: Hourly Schedule */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-sky-500" /> Hourly Time Blocks
            </h3>
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {plan.schedule.map((block) => (
                <div
                  key={block.id}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border transition-colors ${
                    block.done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/40'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-700/60'
                  }`}
                >
                  <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 w-16 shrink-0 text-right pr-2 border-r border-slate-200 dark:border-slate-700">
                    {block.time}
                  </span>
                  <input
                    type="text"
                    value={block.activity}
                    onChange={(e) => handleActivityChange(block.id, e.target.value)}
                    placeholder="Plan activity..."
                    className={`flex-1 bg-transparent border-0 text-xs focus:outline-none ${
                      block.done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  />
                  {block.activity && (
                    <button
                      type="button"
                      onClick={() => handleToggleDone(block.id)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        block.done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {block.done ? 'Done' : 'Pending'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
