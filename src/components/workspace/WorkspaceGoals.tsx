import React, { useState, useEffect } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import { WorkspaceGoal, GoalStatus, GoalMilestone } from '../../types/workspace';
import {
  Target,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Circle,
  TrendingUp
} from 'lucide-react';

const CATEGORIES = ['Personal', 'Career & Work', 'Health & Fitness', 'Financial', 'Learning', 'Projects'];

export const WorkspaceGoals: React.FC = () => {
  const [goals, setGoals] = useState<WorkspaceGoal[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'on_hold'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<WorkspaceGoal | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formTargetDate, setFormTargetDate] = useState('');
  const [formProgress, setFormProgress] = useState(0);
  const [formStatus, setFormStatus] = useState<GoalStatus>('in_progress');
  const [formMilestones, setFormMilestones] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newMilestoneText, setNewMilestoneText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const loadGoals = async () => {
    const list = await workspaceDB.getGoals();
    setGoals(list);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const openNewModal = () => {
    setEditingGoal(null);
    setFormTitle('');
    setFormDesc('');
    setFormCategory(CATEGORIES[0]);
    // default target date 3 months from now
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    setFormTargetDate(d.toISOString().split('T')[0]);
    setFormProgress(0);
    setFormStatus('in_progress');
    setFormMilestones([]);
    setNewMilestoneText('');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: WorkspaceGoal) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormDesc(goal.description || '');
    setFormCategory(goal.category || CATEGORIES[0]);
    setFormTargetDate(goal.targetDate);
    setFormProgress(goal.progress || 0);
    setFormStatus(goal.status);
    setFormMilestones(goal.milestones || []);
    setNewMilestoneText('');
    setIsModalOpen(true);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setFormMilestones((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, title: newMilestoneText.trim(), completed: false }
    ]);
    setNewMilestoneText('');
  };

  const handleRemoveMilestone = (id: string) => {
    setFormMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleFormMilestone = (id: string) => {
    setFormMilestones((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
      // Optionally auto compute progress based on milestones
      const done = updated.filter((m) => m.completed).length;
      if (updated.length > 0) {
        setFormProgress(Math.round((done / updated.length) * 100));
      }
      return updated;
    });
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const now = new Date().toISOString();
    const finalStatus = formProgress >= 100 ? 'completed' : formStatus;

    const goalToSave: WorkspaceGoal = {
      id: editingGoal ? editingGoal.id : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      description: formDesc.trim(),
      category: formCategory,
      targetDate: formTargetDate,
      progress: Math.min(100, Math.max(0, formProgress)),
      status: finalStatus,
      milestones: formMilestones,
      createdAt: editingGoal ? editingGoal.createdAt : now,
      updatedAt: now
    };

    await workspaceDB.saveGoal(goalToSave);
    setIsModalOpen(false);
    loadGoals();
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Delete this goal and its milestones?')) {
      await workspaceDB.deleteGoal(id);
      loadGoals();
    }
  };

  const handleQuickProgressUpdate = async (goal: WorkspaceGoal, newProgress: number) => {
    const progress = Math.min(100, Math.max(0, newProgress));
    const status: GoalStatus = progress >= 100 ? 'completed' : goal.status === 'completed' ? 'in_progress' : goal.status;
    const updated: WorkspaceGoal = {
      ...goal,
      progress,
      status,
      updatedAt: new Date().toISOString()
    };
    await workspaceDB.saveGoal(updated);
    loadGoals();
  };

  const handleToggleGoalMilestone = async (goal: WorkspaceGoal, milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter((m) => m.completed).length;
    const progress = updatedMilestones.length > 0 ? Math.round((completedCount / updatedMilestones.length) * 100) : goal.progress;
    const status: GoalStatus = progress >= 100 ? 'completed' : goal.status === 'completed' ? 'in_progress' : goal.status;

    const updated: WorkspaceGoal = {
      ...goal,
      milestones: updatedMilestones,
      progress,
      status,
      updatedAt: new Date().toISOString()
    };
    await workspaceDB.saveGoal(updated);
    loadGoals();
  };

  const filteredGoals = goals.filter((g) => {
    if (statusFilter === 'all') return true;
    return g.status === statusFilter;
  });

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate + 'T00:00:00');
    const today = new Date(todayStr + 'T00:00:00');
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            My Goals & Key Milestones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Define objectives, set target completion dates, and check off key milestones.
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl w-fit">
        {(['all', 'in_progress', 'completed', 'on_hold'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
              statusFilter === status
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No goals in this view
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Set a tangible objective with target deadlines, like learning a language, saving for an investment, or completing a major course.
          </p>
          <button
            onClick={openNewModal}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGoals.map((goal) => {
            const daysLeft = getDaysRemaining(goal.targetDate);
            const isCompleted = goal.status === 'completed' || goal.progress >= 100;

            return (
              <div
                key={goal.id}
                className={`bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {goal.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : goal.status === 'on_hold'
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        }`}
                      >
                        {isCompleted ? 'Completed' : goal.status.replace('_', ' ')}
                      </span>

                      <button
                        onClick={() => openEditModal(goal)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title="Edit goal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar & Quick Toggles */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">Progress</span>
                      <span className="text-rose-600 dark:text-rose-400">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-rose-500 to-amber-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                      <span className="text-slate-400">Quick:</span>
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => handleQuickProgressUpdate(goal, pct)}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition font-medium"
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  {goal.milestones && goal.milestones.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Milestones ({goal.milestones.filter((m) => m.completed).length}/
                        {goal.milestones.length})
                      </div>
                      <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                        {goal.milestones.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => handleToggleGoalMilestone(goal, m.id)}
                            className="flex items-center gap-2 text-xs cursor-pointer select-none text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
                          >
                            {m.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                            <span className={m.completed ? 'line-through text-slate-400' : ''}>
                              {m.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Due Date */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: {goal.targetDate || 'No date'}
                  </span>
                  <span
                    className={`font-semibold ${
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : daysLeft < 0
                        ? 'text-red-500'
                        : daysLeft <= 14
                        ? 'text-amber-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {isCompleted
                      ? 'Goal Achieved!'
                      : daysLeft < 0
                      ? `${Math.abs(daysLeft)} days overdue`
                      : daysLeft === 0
                      ? 'Due Today!'
                      : `${daysLeft} days left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {editingGoal ? 'Edit Goal' : 'Define New Goal'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Save ₹2,00,000 for emergency fund..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description / Motivation (Optional)
                </label>
                <textarea
                  placeholder="Why this goal matters and what success looks like..."
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={formTargetDate}
                    onChange={(e) => setFormTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Progress Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Current Progress</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{formProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formProgress}
                  onChange={(e) => setFormProgress(parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Milestones Sub-list */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Key Steps / Milestones
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add milestone step..."
                    value={newMilestoneText}
                    onChange={(e) => setNewMilestoneText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMilestone();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-medium rounded-xl transition"
                  >
                    Add
                  </button>
                </div>

                {formMilestones.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pt-1">
                    {formMilestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-xs"
                      >
                        <div
                          onClick={() => handleToggleFormMilestone(m.id)}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          {m.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                          <span className={m.completed ? 'line-through text-slate-400' : ''}>
                            {m.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(m.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
