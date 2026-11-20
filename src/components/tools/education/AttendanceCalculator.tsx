import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';

export const AttendanceCalculator: React.FC = () => {
  const [totalClasses, setTotalClasses] = useState<number>(45);
  const [attendedClasses, setAttendedClasses] = useState<number>(38);
  const [targetPercentage, setTargetPercentage] = useState<number>(75);

  const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  const missedClasses = Math.max(0, totalClasses - attendedClasses);

  const isSafe = percentage >= targetPercentage;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Attendance Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Monitor your class attendance percentage, track missed sessions, and verify compliance with university criteria.
        </p>
      </div>

      {/* Main Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Total Classes Held
            </label>
            <input
              type="number"
              min={1}
              value={totalClasses}
              onChange={e => setTotalClasses(Math.max(1, Number(e.target.value)))}
              className="w-full text-xl font-bold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Classes Attended
            </label>
            <input
              type="number"
              min={0}
              max={totalClasses}
              value={attendedClasses}
              onChange={e =>
                setAttendedClasses(Math.min(totalClasses, Math.max(0, Number(e.target.value))))
              }
              className="w-full text-xl font-bold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Minimum Required Criteria
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={100}
                value={targetPercentage}
                onChange={e => setTargetPercentage(Math.min(100, Math.max(1, Number(e.target.value))))}
                className="w-full text-xl font-bold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
              />
              <span className="font-bold text-slate-500">%</span>
            </div>
          </div>
        </div>

        {/* Big Percentage Gauge Card */}
        <div className={`p-6 rounded-2xl border text-center transition-all ${
          isSafe
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
        }`}>
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            {isSafe ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Attendance Criteria Satisfied
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Below Minimum Attendance Criteria
              </span>
            )}
          </div>

          <div className={`text-5xl font-black font-mono my-2 ${isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {percentage.toFixed(1)}%
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden max-w-md mx-auto my-3 relative">
            <div
              className={`h-full transition-all duration-300 ${isSafe ? 'bg-emerald-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
            {/* Target threshold indicator line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-slate-900 dark:bg-white z-10"
              style={{ left: `${targetPercentage}%` }}
              title={`Target: ${targetPercentage}%`}
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Target threshold marker at {targetPercentage}% | {attendedClasses} attended out of {totalClasses} classes ({missedClasses} missed)
          </div>
        </div>
      </div>
    </div>
  );
};
