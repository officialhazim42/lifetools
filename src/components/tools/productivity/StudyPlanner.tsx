import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

interface StudySubject {
  id: string;
  name: string;
  targetHours: number;
  completedHours: number;
  examDate: string;
  topics: string[];
}

const STORAGE_KEY = 'lifetools_study_planner';

export const StudyPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [subjects, setSubjects] = useState<StudySubject[]>(() => {
    return storage.get<StudySubject[]>(STORAGE_KEY, [
      {
        id: 'sub_1',
        name: 'Computer Architecture & Systems',
        targetHours: 40,
        completedHours: 24,
        examDate: '2026-12-15',
        topics: ['Pipelines & Hazards', 'Cache Coherence', 'Memory Hierarchies']
      },
      {
        id: 'sub_2',
        name: 'Algorithms & Discrete Math',
        targetHours: 50,
        completedHours: 35,
        examDate: '2026-12-18',
        topics: ['Graph Theory', 'Dynamic Programming', 'Complexity Classes']
      }
    ]);
  });

  const [name, setName] = useState('');
  const [targetHours, setTargetHours] = useState(30);
  const [examDate, setExamDate] = useState('');
  const [topicsText, setTopicsText] = useState('');

  useEffect(() => {
    storage.set(STORAGE_KEY, subjects);
  }, [subjects]);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Enter subject or course name', 'warning');
      return;
    }

    const newSub: StudySubject = {
      id: 'sub_' + Date.now(),
      name: name.trim(),
      targetHours: Math.max(1, targetHours),
      completedHours: 0,
      examDate: examDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      topics: topicsText
        ? topicsText.split(',').map(t => t.trim()).filter(Boolean)
        : ['Fundamentals', 'Practice Problems']
    };

    setSubjects(prev => [...prev, newSub]);
    setName('');
    setTopicsText('');
    showToast('Course added to study plan!');
  };

  const handleLogHours = (id: string, delta: number) => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const next = Math.max(0, s.completedHours + delta);
        return { ...s, completedHours: next };
      })
    );
  };

  const handleDelete = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast('Subject removed', 'info');
  };

  const totalTargetHours = subjects.reduce((acc, s) => acc + s.targetHours, 0);
  const totalCompletedHours = subjects.reduce((acc, s) => acc + s.completedHours, 0);
  const overallProgress = totalTargetHours > 0 ? Math.round((totalCompletedHours / totalTargetHours) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {subjects.length}
            </div>
            <div className="text-xs text-slate-500">Planned Courses</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalCompletedHours} / {totalTargetHours}h
            </div>
            <div className="text-xs text-slate-500">Hours Studied</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {overallProgress}%
            </div>
            <div className="text-xs text-slate-500">Syllabus Completion</div>
          </div>
        </div>
      </div>

      {/* Add Course Form */}
      <form onSubmit={handleAddSubject} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <input
            type="text"
            placeholder="Subject / Course Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <input
            type="number"
            min="1"
            placeholder="Target Hours"
            value={targetHours}
            onChange={(e) => setTargetHours(Number(e.target.value))}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <input
            type="text"
            placeholder="Key topics (comma sep)"
            value={topicsText}
            onChange={(e) => setTopicsText(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </form>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map(s => {
          const progress = Math.min(100, Math.round((s.completedHours / s.targetHours) * 100));

          return (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {s.name}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" /> Exam Date: {new Date(s.examDate).toLocaleDateString()}
                  </div>
                </div>

                <button onClick={() => handleDelete(s.id)} className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{s.completedHours}h completed of {s.targetHours}h goal</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {s.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Hours logging buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500">Log Study Session:</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleLogHours(s.id, 1)} className="btn-secondary text-[11px] py-1 px-2.5">
                    +1 hr
                  </button>
                  <button onClick={() => handleLogHours(s.id, 2)} className="btn-secondary text-[11px] py-1 px-2.5">
                    +2 hrs
                  </button>
                  <button onClick={() => handleLogHours(s.id, -1)} className="btn-secondary text-[11px] py-1 px-2 text-slate-400">
                    -1 hr
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
