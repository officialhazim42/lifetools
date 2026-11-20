import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, CheckSquare, Square, RotateCcw, Sparkles } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface RevisionStage {
  stage: number;
  label: string;
  offsetDays: number;
  dateStr: string;
  completed: boolean;
}

interface RevisionTopic {
  id: string;
  subject: string;
  topic: string;
  firstStudiedDate: string;
  stages: RevisionStage[];
}

const STORAGE_KEY = 'lifetools_revision_plan';

const STAGE_OFFSETS = [
  { stage: 1, label: '1st Review (+1 Day)', offsetDays: 1 },
  { stage: 2, label: '2nd Review (+3 Days)', offsetDays: 3 },
  { stage: 3, label: '3rd Review (+7 Days)', offsetDays: 7 },
  { stage: 4, label: '4th Review (+14 Days)', offsetDays: 14 },
  { stage: 5, label: '5th Review (+30 Days)', offsetDays: 30 }
];

const DEFAULT_TOPICS: RevisionTopic[] = [
  {
    id: '1',
    subject: 'Organic Chemistry',
    topic: 'Reaction Mechanisms of Alkenes',
    firstStudiedDate: new Date().toISOString().split('T')[0],
    stages: STAGE_OFFSETS.map(o => {
      const d = new Date();
      d.setDate(d.getDate() + o.offsetDays);
      return {
        stage: o.stage,
        label: o.label,
        offsetDays: o.offsetDays,
        dateStr: d.toISOString().split('T')[0],
        completed: o.stage === 1
      };
    })
  }
];

export const RevisionPlanner: React.FC = () => {
  const [topics, setTopics] = useState<RevisionTopic[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_TOPICS);
  });

  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, topics);
  }, [topics]);

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) return;

    const base = new Date(startDate);
    const stages: RevisionStage[] = STAGE_OFFSETS.map(o => {
      const d = new Date(base);
      d.setDate(base.getDate() + o.offsetDays);
      return {
        stage: o.stage,
        label: o.label,
        offsetDays: o.offsetDays,
        dateStr: d.toISOString().split('T')[0],
        completed: false
      };
    });

    const newTopic: RevisionTopic = {
      id: 'rev_' + Date.now(),
      subject: subject.trim(),
      topic: topic.trim(),
      firstStudiedDate: startDate,
      stages
    };

    setTopics(prev => [newTopic, ...prev]);
    setSubject('');
    setTopic('');
  };

  const toggleStage = (topicId: string, stageNum: number) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id !== topicId) return t;
        return {
          ...t,
          stages: t.stages.map(s => (s.stage === stageNum ? { ...s, completed: !s.completed } : s))
        };
      })
    );
  };

  const handleDelete = (id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Spaced Repetition Revision Planner
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Defeat the Ebbinghaus forgetting curve by scheduling scientifically proven revision intervals (Day 1, 3, 7, 14, 30).
        </p>
      </div>

      {/* Add Topic Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-500" /> Schedule Topic for Spaced Revision
        </h2>

        <form onSubmit={handleAddTopic} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Neuroscience, Calculus"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Chapter / Concept *
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Synaptic Transmission"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Date Initially Learned
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" /> Generate 5-Stage Revision Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Active Revision Tracks ({topics.length})
          </h2>
          {topics.length > 0 && (
            <button
              onClick={() => setTopics([])}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        {topics.map(t => {
          const completedCount = t.stages.filter(s => s.completed).length;
          const isComplete = completedCount === t.stages.length;

          return (
            <div
              key={t.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {t.subject}
                    </span>
                    <span className="text-xs text-slate-400">
                      Learned: {t.firstStudiedDate}
                    </span>
                    {isComplete && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-500">
                        100% Retained
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {t.topic}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Revision Interval Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {t.stages.map(stage => (
                  <button
                    key={stage.stage}
                    onClick={() => toggleStage(t.id, stage.stage)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      stage.completed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-cyan-500'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>R{stage.stage}</span>
                      {stage.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="text-[11px] font-mono">{stage.dateStr}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      +{stage.offsetDays}d {stage.completed ? 'Done' : 'Pending'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
