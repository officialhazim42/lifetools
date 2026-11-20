import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, RotateCcw, Award, CheckCircle, XCircle } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface SubjectMark {
  id: string;
  name: string;
  maxMarks: number;
  scoredMarks: number | '';
}

const STORAGE_KEY = 'lifetools_marks_calc';

const DEFAULT_SUBJECTS: SubjectMark[] = [
  { id: '1', name: 'Mathematics', maxMarks: 100, scoredMarks: 94 },
  { id: '2', name: 'Physics', maxMarks: 100, scoredMarks: 88 },
  { id: '3', name: 'Chemistry', maxMarks: 100, scoredMarks: 85 },
  { id: '4', name: 'English', maxMarks: 100, scoredMarks: 90 },
  { id: '5', name: 'Computer Science', maxMarks: 100, scoredMarks: 98 }
];

export const MarksCalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectMark[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_SUBJECTS);
  });
  const [passingPercentage, setPassingPercentage] = useState<number>(35);

  const handleUpdate = (id: string, field: 'name' | 'maxMarks' | 'scoredMarks', value: any) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAdd = () => {
    const nextNum = subjects.length + 1;
    setSubjects(prev => [
      ...prev,
      {
        id: 'subj_' + Date.now(),
        name: `Subject ${nextNum}`,
        maxMarks: 100,
        scoredMarks: ''
      }
    ]);
  };

  const handleDelete = (id: string) => {
    if (subjects.length <= 1) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  };

  const handleReset = () => {
    setSubjects(DEFAULT_SUBJECTS);
  };

  // Calculations
  const validSubjects = subjects.filter(
    s => typeof s.scoredMarks === 'number' && s.maxMarks > 0
  );

  const totalScored = validSubjects.reduce((sum, s) => sum + (s.scoredMarks as number), 0);
  const totalMax = validSubjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const overallPercentage = totalMax > 0 ? (totalScored / totalMax) * 100 : 0;

  // Best & lowest
  const sorted = [...validSubjects].sort(
    (a, b) =>
      ((b.scoredMarks as number) / b.maxMarks) - ((a.scoredMarks as number) / a.maxMarks)
  );
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  // Subject failures
  const failedCount = validSubjects.filter(
    s => ((s.scoredMarks as number) / s.maxMarks) * 100 < passingPercentage
  ).length;

  const getDivision = () => {
    if (failedCount > 0) return { label: 'Fail / Compartment', color: 'text-rose-500' };
    if (overallPercentage >= 75) return { label: 'Distinction', color: 'text-emerald-500' };
    if (overallPercentage >= 60) return { label: 'First Division', color: 'text-cyan-500' };
    if (overallPercentage >= 50) return { label: 'Second Division', color: 'text-amber-500' };
    if (overallPercentage >= passingPercentage) return { label: 'Third Division', color: 'text-slate-500' };
    return { label: 'Fail', color: 'text-rose-500' };
  };

  const division = getDivision();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Marks Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate aggregate total marks, percentage, division class, and subject-wise performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/30 p-5 rounded-2xl border border-cyan-500/20 text-center">
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            Total Scored
          </span>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
            {totalScored} <span className="text-xs font-normal text-slate-400">/ {totalMax}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Percentage
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {overallPercentage.toFixed(2)}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Result / Division
          </span>
          <div className={`text-xl font-bold mt-2 font-mono ${division.color}`}>
            {division.label}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Top Scoring
          </span>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 truncate">
            {highest ? highest.name : '--'}
          </div>
          <span className="text-xs font-mono text-slate-400">
            {highest && typeof highest.scoredMarks === 'number'
              ? `${highest.scoredMarks}/${highest.maxMarks}`
              : ''}
          </span>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Subject List ({subjects.length})
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>Pass cutoff:</span>
              <input
                type="number"
                min={1}
                max={100}
                value={passingPercentage}
                onChange={e => setPassingPercentage(Number(e.target.value))}
                className="w-12 px-1.5 py-0.5 text-center text-xs bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
              />
              <span>%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Subject
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs">
              <tr>
                <th className="p-3">Subject Name</th>
                <th className="p-3">Marks Scored</th>
                <th className="p-3">Maximum Marks</th>
                <th className="p-3">Percentage</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjects.map(s => {
                const isScored = typeof s.scoredMarks === 'number';
                const subPerc = isScored && s.maxMarks > 0 ? ((s.scoredMarks as number) / s.maxMarks) * 100 : 0;
                const isPass = subPerc >= passingPercentage;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <input
                        type="text"
                        value={s.name}
                        onChange={e => handleUpdate(s.id, 'name', e.target.value)}
                        className="font-medium text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none px-1 text-sm w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        max={s.maxMarks}
                        value={s.scoredMarks}
                        onChange={e =>
                          handleUpdate(
                            s.id,
                            'scoredMarks',
                            e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                          )
                        }
                        placeholder="e.g. 85"
                        className="w-24 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={1}
                        value={s.maxMarks}
                        onChange={e => handleUpdate(s.id, 'maxMarks', Math.max(1, Number(e.target.value)))}
                        className="w-24 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      />
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {isScored ? `${subPerc.toFixed(1)}%` : '--'}
                    </td>
                    <td className="p-3">
                      {isScored && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isPass
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {isPass ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isPass ? 'Pass' : 'Fail'}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {subjects.length > 1 && (
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
