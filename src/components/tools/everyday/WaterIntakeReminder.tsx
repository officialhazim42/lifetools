import React, { useState, useEffect } from 'react';
import { safeStorage } from '../../../utils/storage';
import {
  Droplets,
  Plus,
  Trash2,
  RotateCcw,
  Volume2,
  VolumeX,
  TrendingUp,
  Settings,
  CheckCircle,
  Clock
} from 'lucide-react';

interface DrinkEntry {
  id: string;
  time: string;
  amount: number; // in ml
}

interface DailyRecord {
  date: string;
  total: number;
  goal: number;
}

export const WaterIntakeReminder: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Config State
  const [goal, setGoal] = useState<number>(() => {
    return safeStorage.getItem<number>('water_daily_goal', 2500);
  });
  const [weight, setWeight] = useState<number>(65);
  const [activity, setActivity] = useState<string>('moderate');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(false);

  // Today's logs
  const [entries, setEntries] = useState<DrinkEntry[]>(() => {
    return safeStorage.getItem<DrinkEntry[]>(`water_entries_${todayStr}`, []);
  });

  // History records (last 7 days)
  const [history, setHistory] = useState<DailyRecord[]>(() => {
    return safeStorage.getItem<DailyRecord[]>('water_history_records', []);
  });

  // Persist goal
  useEffect(() => {
    safeStorage.setItem('water_daily_goal', goal);
  }, [goal]);

  // Persist today's entries
  useEffect(() => {
    safeStorage.setItem(`water_entries_${todayStr}`, entries);
    const todayTotal = entries.reduce((sum, e) => sum + e.amount, 0);

    // Update history record
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.date !== todayStr);
      const updated = [...filtered, { date: todayStr, total: todayTotal, goal }].slice(-7);
      safeStorage.setItem('water_history_records', updated);
      return updated;
    });
  }, [entries, goal, todayStr]);

  // Sound chime using Web Audio API
  const playWaterChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleAddWater = (amount: number) => {
    if (amount <= 0) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: DrinkEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      amount
    };
    setEntries((prev) => [newEntry, ...prev]);
    playWaterChime();
  };

  const handleAddCustom = () => {
    const val = parseInt(customAmount);
    if (!isNaN(val) && val > 0) {
      handleAddWater(val);
      setCustomAmount('');
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleResetToday = () => {
    if (window.confirm("Reset today's water intake to 0 ml?")) {
      setEntries([]);
    }
  };

  const calculateRecommendedGoal = () => {
    let base = weight * 35;
    if (activity === 'sedentary') base += 0;
    else if (activity === 'moderate') base += 400;
    else if (activity === 'active') base += 800;
    else if (activity === 'athlete') base += 1200;
    const rounded = Math.round(base / 50) * 50;
    setGoal(rounded);
    setShowConfig(false);
  };

  const currentTotal = entries.reduce((sum, e) => sum + e.amount, 0);
  const percentage = Math.min(100, Math.round((currentTotal / (goal || 1)) * 100));
  const remaining = Math.max(0, goal - currentTotal);
  const glassCount = Math.round((currentTotal / 250) * 10) / 10;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Droplets className="w-8 h-8 text-cyan-200 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold">Daily Water Intake Reminder</h1>
            </div>
            <p className="text-cyan-100 text-sm mt-1">
              Stay hydrated, energized, and track your daily water consumption offline.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              className="p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-200" />}
            </button>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3.5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition backdrop-blur-sm flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>Goal: {goal} ml</span>
            </button>
          </div>
        </div>
      </div>

      {/* Goal Calculator Config Drawer */}
      {showConfig && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Hydration Goal Calculator
            </h3>
            <button
              onClick={() => setShowConfig(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                min="30"
                max="200"
                value={weight}
                onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Daily Activity Level
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              >
                <option value="sedentary">Sedentary (desk work)</option>
                <option value="moderate">Moderate (light workout / 30m walk)</option>
                <option value="active">Active (regular gym / sports)</option>
                <option value="athlete">High Intensity / Athlete</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={calculateRecommendedGoal}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-sm"
              >
                Calculate Recommended Goal
              </button>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-500">Or manually enter a target:</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="50"
                value={goal}
                onChange={(e) => setGoal(Math.max(500, Number(e.target.value)))}
                className="w-28 px-2 py-1 text-sm border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
              <span className="text-xs text-slate-500">ml</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Hydration Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Interactive Bottle & Progress */}
        <div className="md:col-span-5 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
              Today's Hydration
            </div>
            <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
              {currentTotal} <span className="text-lg font-normal text-slate-500">/ {goal} ml</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ≈ {glassCount} standard glasses (250ml)
            </div>
          </div>

          {/* Graphical Water Container */}
          <div className="relative my-6 w-36 h-64 border-4 border-blue-400 dark:border-blue-500/80 rounded-b-3xl rounded-t-lg p-1 bg-slate-50 dark:bg-slate-900/60 overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Top Bottle Cap neck hint */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2 bg-blue-300 dark:bg-blue-600 rounded-b-md" />
            {/* Measurement lines */}
            <div className="absolute inset-y-0 right-2 flex flex-col justify-between py-4 text-[9px] text-slate-400 select-none pointer-events-none">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
            </div>
            {/* Liquid Fill */}
            <div
              className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-b-2xl transition-all duration-700 ease-out flex items-center justify-center relative overflow-hidden"
              style={{ height: `${percentage}%` }}
            >
              {percentage > 10 && (
                <span className="text-white font-bold text-sm drop-shadow-md z-10">
                  {percentage}%
                </span>
              )}
            </div>
          </div>

          <div className="w-full space-y-2">
            {percentage >= 100 ? (
              <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Daily goal reached! Excellent work!</span>
              </div>
            ) : (
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-blue-400">{remaining} ml</span> needed to hit your target.
              </div>
            )}
            <button
              onClick={handleResetToday}
              className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition flex items-center justify-center gap-1 mx-auto mt-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset today's count
            </button>
          </div>
        </div>

        {/* Right: Quick Add & Log */}
        <div className="md:col-span-7 space-y-6">
          {/* Quick Add Presets */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-500" />
              Quick Log Water
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { label: 'Small Cup', amount: 150, icon: '☕' },
                { label: 'Glass', amount: 250, icon: '🥛' },
                { label: 'Coffee Mug', amount: 300, icon: '☕' },
                { label: 'Small Bottle', amount: 500, icon: '🍶' },
                { label: 'Flask', amount: 750, icon: '🧊' },
                { label: '1 Liter', amount: 1000, icon: '💧' },
              ].map((btn) => (
                <button
                  key={btn.amount}
                  onClick={() => handleAddWater(btn.amount)}
                  className="p-3 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/50 border border-cyan-100 dark:border-cyan-800/60 rounded-xl text-left transition flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{btn.icon}</span>
                    <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      +{btn.amount} ml
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                    {btn.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Log input */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="Custom amount (ml)..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                  className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white pr-10"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">ml</span>
              </div>
              <button
                onClick={handleAddCustom}
                disabled={!customAmount || Number(customAmount) <= 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Today's Intake History Table */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Today's Log ({entries.length} drinks)
              </span>
            </h3>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                No water logged yet today. Click a cup above to record your first drink!
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 pr-1">
                {entries.map((entry) => (
                  <div key={entry.id} className="py-2.5 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                        💧
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {entry.amount} ml
                        </div>
                        <div className="text-xs text-slate-400">{entry.time}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day History Summary */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Last 7 Days Progress
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {history.map((day) => {
              const dayPct = Math.min(100, Math.round((day.total / (day.goal || 1)) * 100));
              const isToday = day.date === todayStr;
              const dateObj = new Date(day.date + 'T00:00:00');
              const dayName = dateObj.toLocaleDateString([], { weekday: 'short' });

              return (
                <div key={day.date} className="flex flex-col items-center text-center">
                  <div className="h-28 w-full max-w-[36px] bg-slate-100 dark:bg-slate-700 rounded-xl p-1 flex flex-col justify-end overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        dayPct >= 100
                          ? 'bg-emerald-500'
                          : dayPct >= 60
                          ? 'bg-cyan-500'
                          : 'bg-blue-400'
                      }`}
                      style={{ height: `${dayPct}%` }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {dayName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {day.total}ml
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
