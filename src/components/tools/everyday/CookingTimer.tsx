import React, { useState, useEffect } from 'react';
import { Timer, Plus, Trash2, Play, Pause, RotateCcw, Bell, Sparkles } from 'lucide-react';

interface ActiveTimer {
  id: string;
  label: string;
  initialSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

const PRESETS = [
  { label: 'Soft Boiled Egg', seconds: 390 }, // 6m 30s
  { label: 'Hard Boiled Egg', seconds: 600 }, // 10m
  { label: 'Pasta Al Dente', seconds: 480 },  // 8m
  { label: 'Green Tea Steeping', seconds: 180 }, // 3m
  { label: 'French Press Coffee', seconds: 240 }, // 4m
  { label: 'Pizza / Flatbread', seconds: 720 }, // 12m
  { label: 'Oven Roast Veggies', seconds: 1500 } // 25m
];

export const CookingTimer: React.FC = () => {
  const [timers, setTimers] = useState<ActiveTimer[]>([
    { id: '1', label: 'Pasta Al Dente', initialSeconds: 480, remainingSeconds: 480, isRunning: false, isFinished: false },
    { id: '2', label: 'Green Tea Steeping', initialSeconds: 180, remainingSeconds: 180, isRunning: false, isFinished: false }
  ]);

  const [customLabel, setCustomLabel] = useState('');
  const [customMinutes, setCustomMinutes] = useState(5);

  // Web Audio chime for timer alarm
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev =>
        prev.map(t => {
          if (!t.isRunning || t.remainingSeconds <= 0) return t;

          const nextRem = t.remainingSeconds - 1;
          if (nextRem === 0) {
            playChime();
            return { ...t, remainingSeconds: 0, isRunning: false, isFinished: true };
          }
          return { ...t, remainingSeconds: nextRem };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTimer = (id: string) => {
    setTimers(prev =>
      prev.map(t => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    setTimers(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, remainingSeconds: t.initialSeconds, isRunning: false, isFinished: false }
          : t
      )
    );
  };

  const removeTimer = (id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id));
  };

  const addPreset = (p: typeof PRESETS[0]) => {
    setTimers(prev => [
      ...prev,
      {
        id: 'timer_' + Date.now(),
        label: p.label,
        initialSeconds: p.seconds,
        remainingSeconds: p.seconds,
        isRunning: true,
        isFinished: false
      }
    ]);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim() || customMinutes <= 0) return;

    const secs = customMinutes * 60;
    setTimers(prev => [
      ...prev,
      {
        id: 'timer_' + Date.now(),
        label: customLabel.trim(),
        initialSeconds: secs,
        remainingSeconds: secs,
        isRunning: true,
        isFinished: false
      }
    ]);
    setCustomLabel('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Timer className="w-3.5 h-3.5" /> Everyday Life Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Multi-Pot Kitchen & Cooking Timers
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Run multiple kitchen timers simultaneously for different dishes with built-in culinary presets.
        </p>
      </div>

      {/* Culinary Presets */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Quick Kitchen Presets (Click to Start)
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => addPreset(p)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-500/10 hover:border-emerald-500 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <span>{p.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">({formatTime(p.seconds)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Timer */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
            placeholder="Dish / Timer label (e.g. Sautéing Onions)"
            className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min={1}
              max={360}
              value={customMinutes}
              onChange={e => setCustomMinutes(Math.max(1, Number(e.target.value)))}
              className="w-20 px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-500 whitespace-nowrap">Mins</span>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Start Timer
            </button>
          </div>
        </form>
      </div>

      {/* Active Timers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {timers.map(t => {
          const progress = 100 - (t.remainingSeconds / t.initialSeconds) * 100;

          return (
            <div
              key={t.id}
              className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                t.isFinished
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200 animate-bounce'
                  : t.isRunning
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/50'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {t.label}
                  </span>
                  <button
                    onClick={() => removeTimer(t.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white my-3 text-center">
                  {formatTime(t.remainingSeconds)}
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                  <div
                    className={`h-full transition-all duration-300 ${t.isFinished ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => toggleTimer(t.id)}
                  disabled={t.isFinished}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    t.isRunning
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-30'
                  }`}
                >
                  {t.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {t.isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={() => resetTimer(t.id)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
