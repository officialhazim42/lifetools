import React, { useState } from 'react';
import { GraduationCap, AlertCircle, CheckCircle, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export const AttendanceShortageCalculator: React.FC = () => {
  const [totalHeld, setTotalHeld] = useState<number>(50);
  const [attended, setAttended] = useState<number>(32);
  const [targetPercent, setTargetPercent] = useState<number>(75);

  const currentPercent = totalHeld > 0 ? (attended / totalHeld) * 100 : 0;
  const p = targetPercent / 100;

  // Question 1: How many consecutive classes needed to reach target?
  // (attended + x) / (totalHeld + x) >= p
  // attended + x >= p * totalHeld + p * x
  // x * (1 - p) >= p * totalHeld - attended
  // x >= (p * totalHeld - attended) / (1 - p)
  let neededToAttend = 0;
  if (currentPercent < targetPercent && p < 1) {
    neededToAttend = Math.ceil((p * totalHeld - attended) / (1 - p));
    if (neededToAttend < 0) neededToAttend = 0;
  }

  // Question 2: How many classes can be safely bunked without dropping below target?
  // attended / (totalHeld + y) >= p
  // attended >= p * (totalHeld + y)
  // totalHeld + y <= attended / p
  // y <= (attended / p) - totalHeld
  let canBunk = 0;
  if (currentPercent >= targetPercent && p > 0) {
    canBunk = Math.floor(attended / p - totalHeld);
    if (canBunk < 0) canBunk = 0;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Attendance Shortage Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate exactly how many consecutive lectures you must attend to overcome shortage, or how many you can safely bunk.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Classes Held So Far
            </label>
            <input
              type="number"
              min={1}
              value={totalHeld}
              onChange={e => setTotalHeld(Math.max(1, Number(e.target.value)))}
              className="w-full text-xl font-bold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Classes You Attended
            </label>
            <input
              type="number"
              min={0}
              max={totalHeld}
              value={attended}
              onChange={e =>
                setAttended(Math.min(totalHeld, Math.max(0, Number(e.target.value))))
              }
              className="w-full text-xl font-bold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Target Attendance Required
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={99}
                value={targetPercent}
                onChange={e => setTargetPercent(Math.min(99, Math.max(1, Number(e.target.value))))}
                className="w-full text-xl font-bold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
              />
              <span className="font-bold text-slate-500">%</span>
            </div>
          </div>
        </div>

        {/* Current Standing Indicator */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm border border-slate-100 dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-400">Current Standing:</span>
          <span className={`font-bold font-mono text-lg ${currentPercent >= targetPercent ? 'text-emerald-500' : 'text-rose-500'}`}>
            {currentPercent.toFixed(1)}% ({attended}/{totalHeld})
          </span>
        </div>
      </div>

      {/* Outcome Cards */}
      {currentPercent < targetPercent ? (
        <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> Shortage Detected
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            You must attend the next <span className="text-rose-600 dark:text-rose-400 font-mono text-3xl font-black">{neededToAttend}</span> classes consecutively
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Without missing a single lecture, attending {neededToAttend} more classes will bring your record to{' '}
            <strong className="text-slate-900 dark:text-white">
              {attended + neededToAttend} / {totalHeld + neededToAttend}
            </strong>{' '}
            (
            {(((attended + neededToAttend) / (totalHeld + neededToAttend)) * 100).toFixed(1)}
            %), satisfying your {targetPercent}% requirement.
          </p>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Safe Attendance Margin
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            You can safely miss up to <span className="text-emerald-600 dark:text-emerald-400 font-mono text-3xl font-black">{canBunk}</span> upcoming classes
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Missing {canBunk} classes would result in{' '}
            <strong className="text-slate-900 dark:text-white">
              {attended} / {totalHeld + canBunk}
            </strong>{' '}
            ({((attended / (totalHeld + canBunk)) * 100).toFixed(1)}
            %), keeping you comfortably at or above your required {targetPercent}% threshold.
          </p>
        </div>
      )}
    </div>
  );
};
