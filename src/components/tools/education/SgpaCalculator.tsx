import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface Course {
  id: string;
  courseName: string;
  credits: number;
  gradePoint: number;
}

const STORAGE_KEY = 'lifetools_sgpa_calc';

const GRADE_OPTIONS = [
  { letter: 'O (Outstanding)', point: 10 },
  { letter: 'A+ (Excellent)', point: 9 },
  { letter: 'A (Very Good)', point: 8 },
  { letter: 'B+ (Good)', point: 7 },
  { letter: 'B (Above Average)', point: 6 },
  { letter: 'C (Average)', point: 5 },
  { letter: 'P (Pass)', point: 4 },
  { letter: 'F (Fail)', point: 0 }
];

const DEFAULT_COURSES: Course[] = [
  { id: '1', courseName: 'Data Structures & Algorithms', credits: 4, gradePoint: 9 },
  { id: '2', courseName: 'Computer Architecture', credits: 3, gradePoint: 8 },
  { id: '3', courseName: 'Database Management Systems', credits: 4, gradePoint: 10 },
  { id: '4', courseName: 'Discrete Mathematics', credits: 4, gradePoint: 7 },
  { id: '5', courseName: 'DSA Laboratory', credits: 2, gradePoint: 10 }
];

export const SgpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_COURSES);
  });

  const handleUpdate = (id: string, field: 'courseName' | 'credits' | 'gradePoint', value: any) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleAdd = () => {
    const nextNum = courses.length + 1;
    setCourses(prev => [
      ...prev,
      {
        id: 'course_' + Date.now(),
        courseName: `Subject ${nextNum}`,
        credits: 3,
        gradePoint: 8
      }
    ]);
  };

  const handleDelete = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleReset = () => {
    setCourses(DEFAULT_COURSES);
  };

  const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const totalWeightedPoints = courses.reduce(
    (sum, c) => sum + (c.credits || 0) * (c.gradePoint || 0),
    0
  );

  const sgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const hasFailed = courses.some(c => c.gradePoint === 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          SGPA Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate your Semester Grade Point Average (SGPA) based on course credits and letter grades.
        </p>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-cyan-500/20 text-center">
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            Semester SGPA
          </span>
          <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-2 font-mono">
            {sgpa.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">out of 10.00 scale</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Credits
          </span>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {totalCredits}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {courses.length} registered subjects
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Academic Standing
          </span>
          <div className="text-2xl font-bold mt-3 flex items-center justify-center gap-1.5 font-mono">
            {hasFailed ? (
              <span className="text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-5 h-5" /> Arrears / Backlog
              </span>
            ) : sgpa >= 8.5 ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> Distinction
              </span>
            ) : sgpa >= 6.5 ? (
              <span className="text-cyan-500 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> First Class
              </span>
            ) : (
              <span className="text-amber-500 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5" /> Pass
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {hasFailed ? 'Contains grade F (0 pts)' : 'All enrolled subjects passed'}
          </span>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Registered Courses ({courses.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Course
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
                <th className="p-3">Course / Subject Name</th>
                <th className="p-3">Course Credits</th>
                <th className="p-3">Grade Awarded</th>
                <th className="p-3">Grade Points</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3">
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={e => handleUpdate(course.id, 'courseName', e.target.value)}
                      className="font-medium text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none px-1 text-sm w-full"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={course.credits}
                      onChange={e => handleUpdate(course.id, 'credits', Math.max(1, Number(e.target.value)))}
                      className="w-20 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={course.gradePoint}
                      onChange={e => handleUpdate(course.id, 'gradePoint', Number(e.target.value))}
                      className="px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {GRADE_OPTIONS.map(g => (
                        <option key={g.point} value={g.point}>
                          {g.letter} - {g.point} pts
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                    {course.credits * course.gradePoint} pts
                  </td>
                  <td className="p-3 text-right">
                    {courses.length > 1 && (
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
