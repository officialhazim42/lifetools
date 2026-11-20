import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, RotateCcw, Calculator, Award } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface Semester {
  id: string;
  semesterName: string;
  sgpa: number | '';
  credits: number | '';
}

const STORAGE_KEY = 'lifetools_cgpa_calc';

const DEFAULT_SEMS: Semester[] = [
  { id: '1', semesterName: 'Semester 1', sgpa: 8.5, credits: 20 },
  { id: '2', semesterName: 'Semester 2', sgpa: 8.2, credits: 22 },
  { id: '3', semesterName: 'Semester 3', sgpa: 8.8, credits: 21 },
  { id: '4', semesterName: 'Semester 4', sgpa: '', credits: 20 }
];

export const CgpaCalculator: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_SEMS);
  });
  const [scale, setScale] = useState<number>(10); // 10-point or 4-point scale

  const handleUpdate = (id: string, field: 'sgpa' | 'credits' | 'semesterName', value: any) => {
    setSemesters(prev =>
      prev.map(sem => (sem.id === id ? { ...sem, [field]: value } : sem))
    );
  };

  const handleAdd = () => {
    const nextNum = semesters.length + 1;
    setSemesters(prev => [
      ...prev,
      {
        id: 'sem_' + Date.now(),
        semesterName: `Semester ${nextNum}`,
        sgpa: '',
        credits: 20
      }
    ]);
  };

  const handleDelete = (id: string) => {
    if (semesters.length <= 1) return;
    setSemesters(prev => prev.filter(s => s.id !== id));
  };

  const handleReset = () => {
    setSemesters(DEFAULT_SEMS);
  };

  // Calculate CGPA = Sum(SGPA * Credits) / Sum(Credits)
  const validSems = semesters.filter(
    s => typeof s.sgpa === 'number' && s.sgpa > 0 && typeof s.credits === 'number' && s.credits > 0
  );

  const totalCredits = validSems.reduce((sum, s) => sum + (s.credits as number), 0);
  const totalWeightedPoints = validSems.reduce(
    (sum, s) => sum + (s.sgpa as number) * (s.credits as number),
    0
  );

  const cgpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
  const percentageEstimate = scale === 10 ? cgpa * 9.5 : (cgpa / 4) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          CGPA Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate your Cumulative Grade Point Average (CGPA) accurately across college semesters and course credits.
        </p>
      </div>

      {/* Result Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-cyan-500/20 text-center">
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            Cumulative GPA
          </span>
          <div className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-2 font-mono">
            {cgpa.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">out of {scale}.00 scale</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Earned Credits
          </span>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono">
            {totalCredits}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {validSems.length} completed semesters
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Equivalent Percentage
          </span>
          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {percentageEstimate > 0 ? `${percentageEstimate.toFixed(1)}%` : '--'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {scale === 10 ? 'Using standard 9.5 multiplier' : '4.0 scale proportional'}
          </span>
        </div>
      </div>

      {/* Semester Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Semester SGPA & Credits
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setScale(10)}
                className={`px-2.5 py-0.5 rounded font-medium ${scale === 10 ? 'bg-white dark:bg-slate-700 shadow-xs text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}
              >
                10-Point Scale
              </button>
              <button
                onClick={() => setScale(4)}
                className={`px-2.5 py-0.5 rounded font-medium ${scale === 4 ? 'bg-white dark:bg-slate-700 shadow-xs text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}
              >
                4-Point Scale
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add Semester
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              title="Reset Semesters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs">
              <tr>
                <th className="p-3">Semester</th>
                <th className="p-3">SGPA / GPA (Max {scale})</th>
                <th className="p-3">Total Course Credits</th>
                <th className="p-3">Weighted Points</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {semesters.map(sem => {
                const isSemValid = typeof sem.sgpa === 'number' && typeof sem.credits === 'number';
                const pts = isSemValid ? ((sem.sgpa as number) * (sem.credits as number)).toFixed(1) : '--';

                return (
                  <tr key={sem.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <input
                        type="text"
                        value={sem.semesterName}
                        onChange={e => handleUpdate(sem.id, 'semesterName', e.target.value)}
                        className="font-medium text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-cyan-500 focus:outline-none px-1 text-sm"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={scale}
                        value={sem.sgpa}
                        onChange={e =>
                          handleUpdate(
                            sem.id,
                            'sgpa',
                            e.target.value === '' ? '' : Math.min(scale, Math.max(0, Number(e.target.value)))
                          )
                        }
                        placeholder={`e.g. ${scale === 10 ? '8.5' : '3.6'}`}
                        className="w-28 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min={1}
                        value={sem.credits}
                        onChange={e =>
                          handleUpdate(
                            sem.id,
                            'credits',
                            e.target.value === '' ? '' : Math.max(1, Number(e.target.value))
                          )
                        }
                        placeholder="e.g. 20"
                        className="w-24 px-2.5 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                      />
                    </td>
                    <td className="p-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {pts}
                    </td>
                    <td className="p-3 text-right">
                      {semesters.length > 1 && (
                        <button
                          onClick={() => handleDelete(sem.id)}
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
