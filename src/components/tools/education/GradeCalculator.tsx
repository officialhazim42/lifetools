import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, RotateCcw, Calculator, Target, CheckCircle2 } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface Assessment {
  id: string;
  name: string;
  weight: number;
  score: number | '';
}

const STORAGE_KEY = 'lifetools_grade_calc';

const DEFAULT_ASSESSMENTS: Assessment[] = [
  { id: '1', name: 'Homework & Assignments', weight: 20, score: 92 },
  { id: '2', name: 'Quizzes & Labs', weight: 15, score: 85 },
  { id: '3', name: 'Midterm Examination', weight: 25, score: 88 },
  { id: '4', name: 'Final Project', weight: 15, score: 94 },
  { id: '5', name: 'Final Examination', weight: 25, score: '' }
];

export const GradeCalculator: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_ASSESSMENTS);
  });
  const [desiredGrade, setDesiredGrade] = useState<number>(90); // e.g. 90% for an A

  const handleUpdate = (id: string, field: 'name' | 'weight' | 'score', value: any) => {
    setAssessments(prev =>
      prev.map(a => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleAdd = () => {
    setAssessments(prev => [
      ...prev,
      {
        id: 'ass_' + Date.now(),
        name: `Assessment ${prev.length + 1}`,
        weight: 10,
        score: ''
      }
    ]);
  };

  const handleDelete = (id: string) => {
    if (assessments.length <= 1) return;
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  const handleReset = () => {
    setAssessments(DEFAULT_ASSESSMENTS);
  };

  // Calculations
  const totalWeight = assessments.reduce((sum, a) => sum + (a.weight || 0), 0);

  const gradedAssessments = assessments.filter(a => typeof a.score === 'number' && a.score >= 0);
  const gradedWeight = gradedAssessments.reduce((sum, a) => sum + (a.weight || 0), 0);
  const earnedWeightedPoints = gradedAssessments.reduce(
    (sum, a) => sum + ((a.weight || 0) * (a.score as number)) / 100,
    0
  );

  const currentGrade = gradedWeight > 0 ? (earnedWeightedPoints / gradedWeight) * 100 : 0;

  // Final exam needed calculation
  const remainingWeight = Math.max(0, 100 - gradedWeight);
  const pointsNeeded = desiredGrade - earnedWeightedPoints;
  const scoreNeededOnRemaining =
    remainingWeight > 0 ? (pointsNeeded / remainingWeight) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Grade Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate your weighted class grade and discover what score you need on finals to earn your goal grade.
        </p>
      </div>

      {/* Target & Current Grade Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-cyan-500/20 text-center">
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            Current Standing
          </span>
          <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-2 font-mono">
            {currentGrade.toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Based on {gradedWeight}% completed coursework
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Target Final Grade
            </span>
            <input
              type="number"
              min={1}
              max={100}
              value={desiredGrade}
              onChange={e => setDesiredGrade(Number(e.target.value))}
              className="w-14 text-center text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1"
            />
            <span className="text-xs font-bold text-slate-500">%</span>
          </div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {desiredGrade}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Desired class result</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Score Needed on Remaining
          </span>
          <div
            className={`text-4xl font-extrabold mt-2 font-mono ${
              scoreNeededOnRemaining > 100
                ? 'text-rose-500'
                : scoreNeededOnRemaining <= 0
                ? 'text-emerald-500'
                : 'text-indigo-600 dark:text-indigo-400'
            }`}
          >
            {remainingWeight <= 0
              ? 'Complete'
              : scoreNeededOnRemaining <= 0
              ? 'Secured'
              : `${scoreNeededOnRemaining.toFixed(1)}%`}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {remainingWeight <= 0
              ? 'All weights graded'
              : scoreNeededOnRemaining > 100
              ? 'Mathematically unattainable'
              : `Needed across remaining ${remainingWeight}%`}
          </span>
        </div>
      </div>

      {/* Weights Warning */}
      {totalWeight !== 100 && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 rounded-xl text-xs flex items-center justify-between">
          <span>⚠️ Total weight currently sums to <strong>{totalWeight}%</strong>. Standard syllabus weights usually total 100%.</span>
        </div>
      )}

      {/* Assessment Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Grading Components ({assessments.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Component
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
                <th className="p-3">Component Name</th>
                <th className="p-3">Weight (%)</th>
                <th className="p-3">Your Score (%)</th>
                <th className="p-3">Points Earned</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assessments.map(a => {
                const isScored = typeof a.score === 'number';
                const pts = isScored ? (((a.weight || 0) * (a.score as number)) / 100).toFixed(1) : '--';

                return (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <input
                        type="text"
                        value={a.name}
                        onChange={e => handleUpdate(a.id, 'name', e.target.value)}
                        className="font-medium text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none px-1 text-sm w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={a.weight}
                        onChange={e => handleUpdate(a.id, 'weight', Math.max(1, Number(e.target.value)))}
                        className="w-20 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={a.score}
                        onChange={e =>
                          handleUpdate(
                            a.id,
                            'score',
                            e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
                          )
                        }
                        placeholder="Leave blank if pending"
                        className="w-40 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      />
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {pts} / {a.weight}
                    </td>
                    <td className="p-3 text-right">
                      {assessments.length > 1 && (
                        <button
                          onClick={() => handleDelete(a.id)}
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
