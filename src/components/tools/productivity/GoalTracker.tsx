import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  Trophy,
  Plus,
  Trash2,
  CheckCircle2,
  Target,
  Sparkles,
  Calendar,
  Check
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  category: string;
  targetDate: string;
  status: 'in-progress' | 'completed' | 'on-hold';
  milestones: Milestone[];
  createdAt: number;
}

const STORAGE_KEY = 'lifetools_goal_tracker';

export const GoalTracker: React.FC = () => {
  const { showToast } = useToast();
  const [goals, setGoals] = useState<Goal[]>(() => {
    return storage.get<Goal[]>(STORAGE_KEY, [
      {
        id: 'goal_1',
        title: 'Launch Full-Stack Web Suite Expansion',
        category: 'Career',
        targetDate: '2026-12-31',
        status: 'in-progress',
        milestones: [
          { id: 'm1', title: 'Design architecture and tool registry', completed: true },
          { id: 'm2', title: 'Implement productivity & finance modules', completed: true },
          { id: 'm3', title: 'Verify unit tests and client offline capability', completed: false }
        ],
        createdAt: Date.now()
      }
    ]);
  });

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  useEffect(() => {
    storage.set(STORAGE_KEY, goals);
  }, [goals]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Enter a goal title', 'warning');
      return;
    }

    const newGoal: Goal = {
      id: 'goal_' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      targetDate: newTargetDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'in-progress',
      milestones: [],
      createdAt: Date.now()
    };

    setGoals(prev => [newGoal, ...prev]);
    setNewTitle('');
    setNewTargetDate('');
    showToast('New goal added!');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (activeGoalId === id) setActiveGoalId(null);
    showToast('Goal removed', 'info');
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allDone = updatedMilestones.length > 0 && updatedMilestones.every(m => m.completed);
        return {
          ...g,
          milestones: updatedMilestones,
          status: allDone ? 'completed' : g.status === 'completed' ? 'in-progress' : g.status
        };
      })
    );
  };

  const handleAddMilestone = (goalId: string) => {
    if (!newMilestoneText.trim()) return;
    setGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          milestones: [
            ...g.milestones,
            { id: 'm_' + Date.now(), title: newMilestoneText.trim(), completed: false }
          ]
        };
      })
    );
    setNewMilestoneText('');
  };

  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Goal & Milestone Tracker
          </h2>
          <p className="text-xs text-slate-500">
            {completedGoals} of {goals.length} high-level goals achieved
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          {goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0}% Target Rate
        </span>
      </div>

      {/* Add Goal Form */}
      <form onSubmit={handleAddGoal} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <input
            type="text"
            placeholder="What high-impact goal are you targeting?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="input-base text-xs"
          >
            <option value="Career">Career & Work</option>
            <option value="Health">Health & Fitness</option>
            <option value="Financial">Financial</option>
            <option value="Learning">Learning & Skills</option>
            <option value="Personal">Personal Life</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <input
            type="date"
            value={newTargetDate}
            onChange={(e) => setNewTargetDate(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>
      </form>

      {/* Goal Cards */}
      <div className="space-y-4">
        {goals.map(goal => {
          const totalMs = goal.milestones.length;
          const completedMs = goal.milestones.filter(m => m.completed).length;
          const progress = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;

          return (
            <div
              key={goal.id}
              className={`p-6 rounded-2xl border transition-all ${
                goal.status === 'completed'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-subtle'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {goal.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {goal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {progress}% ({completedMs}/{totalMs} milestones)
                  </span>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Milestones list */}
              <div className="space-y-2 mb-3">
                {goal.milestones.map(m => (
                  <div
                    key={m.id}
                    onClick={() => handleToggleMilestone(goal.id, m.id)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs transition-colors"
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        m.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`flex-1 ${
                        m.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Milestone Inline */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="+ Add key milestone..."
                  value={activeGoalId === goal.id ? newMilestoneText : ''}
                  onFocus={() => setActiveGoalId(goal.id)}
                  onChange={(e) => {
                    setActiveGoalId(goal.id);
                    setNewMilestoneText(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMilestone(goal.id);
                    }
                  }}
                  className="input-base text-xs py-1.5 flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleAddMilestone(goal.id)}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
