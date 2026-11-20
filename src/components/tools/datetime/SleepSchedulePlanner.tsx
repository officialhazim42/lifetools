import React, { useState } from 'react';
import { Moon, Sun, Clock, Zap, Sparkles, Bed, Info } from 'lucide-react';

export const SleepSchedulePlanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wake' | 'sleep' | 'nap'>('wake');
  const [targetTime, setTargetTime] = useState('07:00');
  const [fallAsleepMins, setFallAsleepMins] = useState(14); // Average time to fall asleep

  // Format Date to HH:MM AM/PM
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Mode 1: Wake up at target time -> find bedtimes
  const calculateBedtimes = () => {
    const [h, m] = targetTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    const cycles = [
      { count: 6, hours: 9, quality: 'Optimal (6 cycles)', desc: 'Full restoration, deep repair & memory consolidation', badge: 'Optimal', color: 'emerald' },
      { count: 5, hours: 7.5, quality: 'Recommended (5 cycles)', desc: 'Standard healthy adult sleep requirement', badge: 'Recommended', color: 'indigo' },
      { count: 4, hours: 6, quality: 'Moderate (4 cycles)', desc: 'Manageable for busy schedules', badge: 'Fair', color: 'amber' },
      { count: 3, hours: 4.5, quality: 'Minimum (3 cycles)', desc: 'Short sleep; may cause minor daytime fatigue', badge: 'Short', color: 'rose' }
    ];

    return cycles.map(c => {
      const bedtime = new Date(target.getTime() - (c.count * 90 + fallAsleepMins) * 60000);
      return {
        ...c,
        bedtimeStr: formatTime(bedtime)
      };
    });
  };

  // Mode 2: Sleep now -> find wake-up times
  const calculateWakeTimes = () => {
    const now = new Date();
    const cycles = [
      { count: 3, hours: 4.5, label: '3 Cycles (4.5 hrs)', color: 'rose' },
      { count: 4, hours: 6, label: '4 Cycles (6.0 hrs)', color: 'amber' },
      { count: 5, hours: 7.5, label: '5 Cycles (7.5 hrs - Recommended)', color: 'indigo' },
      { count: 6, hours: 9, label: '6 Cycles (9.0 hrs - Optimal)', color: 'emerald' }
    ];

    return cycles.map(c => {
      const wakeTime = new Date(now.getTime() + (c.count * 90 + fallAsleepMins) * 60000);
      return {
        ...c,
        wakeTimeStr: formatTime(wakeTime)
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-500 rounded-full text-xs font-semibold">
          <Moon className="w-3.5 h-3.5" /> Sleep & Wellness Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sleep Schedule Planner
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Synchronize your sleep with natural 90-minute REM cycles to wake up feeling refreshed instead of groggy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('wake')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'wake'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sun className="w-4 h-4" /> I need to wake up at...
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'sleep'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Bed className="w-4 h-4" /> If I sleep right now...
          </button>
          <button
            onClick={() => setActiveTab('nap')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'nap'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" /> Power Nap
          </button>
        </div>
      </div>

      {/* Tab 1: Wake-up target */}
      {activeTab === 'wake' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Desired Wake-Up Time
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={e => setTargetTime(e.target.value)}
                className="text-2xl font-bold font-mono px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="text-right">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                Time to fall asleep (minutes)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={fallAsleepMins}
                onChange={e => setFallAsleepMins(Number(e.target.value))}
                className="w-20 text-center px-2 py-1 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {calculateBedtimes().map((cycle, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">{cycle.quality}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500">
                      {cycle.badge}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white my-1">
                    {cycle.bedtimeStr}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{cycle.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  {cycle.hours} hours of pure cycle sleep
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sleep now */}
      {activeTab === 'sleep' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-2xl text-center text-sm">
            Going to bed right now? Set your alarm for one of these times to wake up between sleep cycles:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {calculateWakeTimes().map((cycle, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm"
              >
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  {cycle.label}
                </div>
                <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {cycle.wakeTimeStr}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Power Nap */}
      {activeTab === 'nap' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-bold">
              <Zap className="w-5 h-5" /> 20-Minute Power Nap
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Boosts alertness, motor performance, and mood without entering deep sleep (preventing sleep inertia or grogginess).
            </p>
            <div className="bg-amber-500/10 p-4 rounded-xl text-xs text-amber-700 dark:text-amber-300 font-medium">
              💡 Tip: Drink a small coffee right before lying down ("Coffee Nap"). Caffeine takes 20 minutes to absorb, kicking in right when you wake!
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-indigo-500 font-bold">
              <Moon className="w-5 h-5" /> 90-Minute Full Cycle Nap
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Completes a full sleep cycle including deep slow-wave and REM sleep. Helps with creative problem solving and recovery from sleep debt.
            </p>
            <div className="bg-indigo-500/10 p-4 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              💡 Tip: Best taken in the early afternoon (1:00 PM – 3:00 PM) so it does not interfere with nighttime slumber.
            </div>
          </div>
        </div>
      )}

      {/* Informational banner */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong>Why 90 minutes?</strong> A healthy human sleep architecture consists of cycles lasting roughly 90 to 110 minutes each, shifting between light sleep, deep slow-wave sleep, and REM. Waking up in the middle of deep sleep causes grogginess (sleep inertia), while waking up at the conclusion of a cycle leaves you feeling energized.
        </div>
      </div>
    </div>
  );
};
