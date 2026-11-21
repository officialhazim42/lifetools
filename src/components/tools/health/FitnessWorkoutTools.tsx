import React, { useState, useEffect, useRef } from 'react';
import {
  calculateRunningPace,
  calculateStepsToDistance,
  calculateExerciseCalories,
  calculateOneRepMax,
  EXERCISE_MET_TABLE
} from '../../../utils/health/fitnessUtils';
import { healthDB } from '../../../utils/healthDB';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Clock,
  Dumbbell,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Gentle Web Audio beep generator
function playBeep(freq = 880, duration = 0.15) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // AudioContext blocked or not allowed
  }
}

// ==========================================
// 1. Workout Planner
// ==========================================
export const WorkoutPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<
    { id: string; name: string; sets: number; reps: number; restSec: number }[]
  >([]);

  const [newName, setNewName] = useState('');
  const [newSets, setNewSets] = useState(3);
  const [newReps, setNewReps] = useState(10);
  const [newRest, setNewRest] = useState(60);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setExercises((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName.trim(), sets: newSets, reps: newReps, restSec: newRest }
    ]);
    setNewName('');
    showToast('Exercise added to workout routine', 'success');
  };

  const handleRemove = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleCopyPlan = () => {
    const text = `LifeTools Workout Plan: ${workoutName}\n\n` +
      exercises.map((e, idx) => `${idx + 1}. ${e.name} - ${e.sets} sets x ${e.reps} reps (Rest: ${e.restSec}s)`).join('\n');
    copyToClipboard(text);
    showToast('Workout routine copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Routine Title</label>
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Enter routine title (e.g. Upper Body Strength)..."
          className="w-full px-3 py-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
      </div>

      <form onSubmit={handleAddExercise} className="grid grid-cols-2 md:grid-cols-5 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="col-span-2">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Exercise Name</label>
          <input
            type="text"
            placeholder="e.g. Pull-ups"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Sets</label>
          <input
            type="number"
            min="1"
            max="20"
            value={newSets}
            onChange={(e) => setNewSets(parseInt(e.target.value, 10) || 1)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reps</label>
          <input
            type="number"
            min="1"
            max="100"
            value={newReps}
            onChange={(e) => setNewReps(parseInt(e.target.value, 10) || 1)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {exercises.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                {idx + 1}
              </span>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</span>
                <span className="text-slate-400 block text-[11px]">
                  {item.sets} Sets × {item.reps} Reps • {item.restSec}s Rest
                </span>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleCopyPlan}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl hover:bg-emerald-100 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Workout Routine
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 2. Daily Exercise Tracker
// ==========================================
export const DailyExerciseTracker: React.FC = () => {
  const { showToast } = useToast();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(45);
  const [exertion, setExertion] = useState(7);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    healthDB.getWorkouts().then(setLogs);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: 'w_' + Date.now(),
      date,
      workoutTitle: title,
      category: 'cardio' as const,
      durationMinutes: duration,
      exercises: [],
      perceivedExertion: exertion,
      createdAt: new Date().toISOString()
    };
    await healthDB.saveWorkout(entry);
    const updated = await healthDB.getWorkouts();
    setLogs(updated);
    showToast('Exercise session recorded', 'success');
  };

  const handleDelete = async (id: string) => {
    await healthDB.deleteWorkout(id);
    const updated = await healthDB.getWorkouts();
    setLogs(updated);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="block font-medium text-slate-500 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-500 mb-1">Workout Activity</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter workout activity (e.g. Morning Cardio)..."
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-500 mb-1">Duration (Mins)</label>
          <input
            type="number"
            min="5"
            max="360"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
          >
            Log Exercise
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recent Workout History</span>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">No workout logs yet. Record your first session above.</p>
        ) : (
          logs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{log.workoutTitle}</span>
                <span className="text-slate-400 block text-[11px]">
                  {log.date} • {log.durationMinutes} mins • Exertion: {log.perceivedExertion}/10
                </span>
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. Push-up Counter
// ==========================================
export const PushUpCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState<number[]>([]);
  const [target, setTarget] = useState(25);

  const handleIncrement = () => {
    playBeep(700, 0.08);
    setCount((prev) => prev + 1);
  };

  const handleFinishSet = () => {
    if (count > 0) {
      playBeep(1000, 0.2);
      setSets((prev) => [...prev, count]);
      setCount(0);
    }
  };

  const handleReset = () => {
    setCount(0);
    setSets([]);
  };

  const totalReps = sets.reduce((a, b) => a + b, 0) + count;

  return (
    <div className="space-y-6 text-center">
      <div className="max-w-xs mx-auto flex items-center justify-between text-xs">
        <span className="text-slate-400">Target Reps:</span>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(parseInt(e.target.value, 10) || 0)}
          className="w-16 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-bold"
        />
      </div>

      <div className="py-4">
        <button
          onClick={handleIncrement}
          className="w-44 h-44 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <span className="text-5xl font-black">{count}</span>
          <span className="text-xs uppercase tracking-widest font-semibold mt-1 opacity-90">Tap for Rep</span>
        </button>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleFinishSet}
          disabled={count === 0}
          className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Complete Set
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>
      </div>

      {sets.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-left">
          <div className="flex justify-between font-bold mb-2 text-slate-600 dark:text-slate-300">
            <span>Completed Sets ({sets.length})</span>
            <span>Total Push-ups: {totalReps}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sets.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                Set {i + 1}: {s} reps
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-400">
        Note: Browser utilities do not monitor camera or physical movement automatically. Tap screen or spacebar on each repetition completed.
      </p>
    </div>
  );
};

// ==========================================
// 4. Squat Counter
// ==========================================
export const SquatCounter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [sets, setSets] = useState<number[]>([]);

  const handleIncrement = () => {
    playBeep(650, 0.08);
    setCount((prev) => prev + 1);
  };

  const handleFinishSet = () => {
    if (count > 0) {
      playBeep(950, 0.2);
      setSets((prev) => [...prev, count]);
      setCount(0);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="py-4">
        <button
          onClick={handleIncrement}
          className="w-44 h-44 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform flex flex-col items-center justify-center cursor-pointer select-none"
        >
          <span className="text-5xl font-black">{count}</span>
          <span className="text-xs uppercase tracking-widest font-semibold mt-1 opacity-90">Tap Squat</span>
        </button>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={handleFinishSet}
          disabled={count === 0}
          className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl disabled:opacity-40"
        >
          Log Set
        </button>
        <button
          onClick={() => { setCount(0); setSets([]); }}
          className="px-3 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl"
        >
          Reset
        </button>
      </div>

      {sets.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-left">
          <div className="flex justify-between font-bold mb-2">
            <span>Logged Squat Sets ({sets.length})</span>
            <span>Total: {sets.reduce((a, b) => a + b, 0)}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sets.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 font-bold">
                Set {i + 1}: {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. Plank Timer
// ==========================================
export const PlankTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(60);
  const [initialDuration, setInitialDuration] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      playBeep(900, 0.5);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = (dur: number) => {
    setIsActive(false);
    setInitialDuration(dur);
    setSeconds(dur);
  };

  const progress = Math.max(0, Math.min(100, ((initialDuration - seconds) / initialDuration) * 100));

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-2">
        {[30, 45, 60, 90, 120].map((dur) => (
          <button
            key={dur}
            onClick={() => resetTimer(dur)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              initialDuration === dur
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            {dur}s
          </button>
        ))}
      </div>

      <div className="text-6xl font-black text-slate-900 dark:text-white font-mono py-2">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden max-w-sm mx-auto">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isActive ? 'Pause Plank' : 'Start Plank'}
        </button>
        <button
          onClick={() => resetTimer(initialDuration)}
          className="px-4 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:bg-slate-50"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 6. Running Pace Calculator
// ==========================================
export const RunningPaceCalculator: React.FC = () => {
  const [distance, setDistance] = useState<number>(5);
  const [unit, setUnit] = useState<'km' | 'miles'>('km');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);

  const pace = calculateRunningPace(distance, unit, hours, minutes, seconds);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Distance</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.1"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            >
              <option value="km">Kilometers</option>
              <option value="miles">Miles</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Time (HH:MM:SS)</label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              placeholder="HH"
              min="0"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value, 10) || 0)}
              className="px-2 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center outline-none"
            />
            <input
              type="number"
              placeholder="MM"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
              className="px-2 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center outline-none"
            />
            <input
              type="number"
              placeholder="SS"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value, 10) || 0)}
              className="px-2 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center outline-none"
            />
          </div>
        </div>
      </div>

      {pace && (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pace (/km)</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              {pace.formattedPaceKm}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Pace (/mile)</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {pace.formattedPaceMile}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Speed (km/h)</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {pace.speedKmh} km/h
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Speed (mph)</span>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {pace.speedMph} mph
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. Running Distance Calculator
// ==========================================
export const RunningDistanceCalculator: React.FC = () => {
  const [paceMin, setPaceMin] = useState(5);
  const [paceSec, setPaceSec] = useState(30);
  const [totalMin, setTotalMin] = useState(45);

  const paceInMinutes = paceMin + paceSec / 60;
  const distanceKm = paceInMinutes > 0 ? Math.round((totalMin / paceInMinutes) * 100) / 100 : 0;
  const distanceMiles = Math.round((distanceKm / 1.60934) * 100) / 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Pace per Kilometer</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Minutes"
              value={paceMin}
              onChange={(e) => setPaceMin(parseInt(e.target.value, 10) || 0)}
              className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
            <input
              type="number"
              placeholder="Seconds"
              value={paceSec}
              onChange={(e) => setPaceSec(parseInt(e.target.value, 10) || 0)}
              className="px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Total Running Time (Minutes)</label>
          <input
            type="number"
            value={totalMin}
            onChange={(e) => setTotalMin(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Distance Covered</span>
        <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{distanceKm} Kilometers</div>
        <p className="text-xs text-slate-400">{distanceMiles} Miles</p>
      </div>
    </div>
  );
};

// ==========================================
// 8. Walking Pace Calculator
// ==========================================
export const WalkingPaceCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState(3.5);
  const [durationMin, setDurationMin] = useState(40);

  const paceMinPerKm = durationMin > 0 && distanceKm > 0 ? Math.round((durationMin / distanceKm) * 10) / 10 : 0;
  const speedKmh = durationMin > 0 ? Math.round((distanceKm / (durationMin / 60)) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Walking Distance (km)</label>
          <input
            type="number"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Time Walked (Minutes)</label>
          <input
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 text-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Walking Pace</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{paceMinPerKm} min/km</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Walking Speed</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{speedKmh} km/h</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. Steps-to-Distance Calculator
// ==========================================
export const StepsToDistanceCalculator: React.FC = () => {
  const [steps, setSteps] = useState(8500);
  const [heightCm, setHeightCm] = useState(175);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const result = calculateStepsToDistance(steps, heightCm, gender);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Step Count</label>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Height (cm)</label>
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
          <div className="flex gap-1">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${gender === 'male' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-800'}`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-xs font-medium rounded-xl border ${gender === 'female' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-800'}`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Distance (Kilometers)</span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">{result.distanceKm} km</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Distance (Miles)</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{result.distanceMiles} mi</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-medium">Est. Calories Burned</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">~{result.estimatedCalories} kcal</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. Exercise Calorie Estimator (METs)
// ==========================================
export const ExerciseCalorieEstimator: React.FC = () => {
  const [weightKg, setWeightKg] = useState(70);
  const [durationMin, setDurationMin] = useState(45);
  const [selectedMetId, setSelectedMetId] = useState('run_moderate');

  const selectedActivity = EXERCISE_MET_TABLE.find((a) => a.id === selectedMetId) || EXERCISE_MET_TABLE[0];
  const burnedKcal = calculateExerciseCalories(selectedActivity.met, weightKg, durationMin);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Activity Type</label>
          <select
            value={selectedMetId}
            onChange={(e) => setSelectedMetId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            {EXERCISE_MET_TABLE.map((act) => (
              <option key={act.id} value={act.id}>
                {act.name} (MET: {act.met})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Body Weight (kg)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Duration (Minutes)</label>
          <input
            type="number"
            value={durationMin}
            onChange={(e) => setDurationMin(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-center space-y-2">
        <Flame className="w-8 h-8 text-amber-500 mx-auto" />
        <span className="text-xs uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">Estimated Energy Expended</span>
        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{burnedKcal} kcal</div>
        <p className="text-xs text-slate-500">Based on Metabolic Equivalent of Task formula: MET ({selectedActivity.met}) × Weight × Hours</p>
      </div>
    </div>
  );
};

// ==========================================
// 11. One Rep Max (1RM) Calculator
// ==========================================
export const OneRepMaxCalculator: React.FC = () => {
  const [weightKg, setWeightKg] = useState(80);
  const [reps, setReps] = useState(5);

  const result = calculateOneRepMax(weightKg, reps);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Weight Lifted (kg / lbs)</label>
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Repetitions Completed (1 - 30)</label>
          <input
            type="number"
            min="1"
            max="30"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Estimated One Rep Max (1RM)</span>
            <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{result.average} kg</div>
            <p className="text-xs text-slate-400 mt-1">Brzycki: {result.brzycki} kg • Epley: {result.epley} kg • Lander: {result.lander} kg</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {result.percentageTable.map((item) => (
              <div key={item.percentage} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-semibold text-slate-600 dark:text-slate-300">{item.percentage}% 1RM</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 12. Workout Rest Timer
// ==========================================
export const WorkoutRestTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let t: any = null;
    if (isActive && seconds > 0) {
      t = setInterval(() => setSeconds((p) => p - 1), 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      playBeep(950, 0.4);
    }
    return () => clearInterval(t);
  }, [isActive, seconds]);

  const setTimer = (s: number) => {
    setIsActive(true);
    setSeconds(s);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-2">
        {[30, 45, 60, 90, 120, 180].map((s) => (
          <button
            key={s}
            onClick={() => setTimer(s)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
          >
            {s}s
          </button>
        ))}
      </div>

      <div className="text-6xl font-black font-mono text-slate-900 dark:text-white py-2">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm"
        >
          {isActive ? 'Pause Rest' : 'Resume'}
        </button>
        <button
          onClick={() => { setIsActive(false); setSeconds(60); }}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 13. Interval Training Timer (HIIT / Tabata)
// ==========================================
export const IntervalTrainingTimer: React.FC = () => {
  const [workSec, setWorkSec] = useState(20);
  const [restSec, setRestSec] = useState(10);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) return prev - 1;

          // Phase transition
          playBeep(isWork ? 600 : 1000, 0.2);
          if (isWork) {
            setIsWork(false);
            return restSec;
          } else {
            if (currentRound < totalRounds) {
              setCurrentRound((r) => r + 1);
              setIsWork(true);
              return workSec;
            } else {
              setIsRunning(false);
              playBeep(1200, 0.6);
              return 0;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isWork, currentRound, totalRounds, workSec, restSec]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentRound(1);
    setIsWork(true);
    setTimeLeft(workSec);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto text-xs">
        <div>
          <label className="text-slate-400 block mb-1">Work (sec)</label>
          <input
            type="number"
            value={workSec}
            onChange={(e) => setWorkSec(parseInt(e.target.value, 10) || 1)}
            className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Rest (sec)</label>
          <input
            type="number"
            value={restSec}
            onChange={(e) => setRestSec(parseInt(e.target.value, 10) || 1)}
            className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center"
          />
        </div>
        <div>
          <label className="text-slate-400 block mb-1">Rounds</label>
          <input
            type="number"
            value={totalRounds}
            onChange={(e) => setTotalRounds(parseInt(e.target.value, 10) || 1)}
            className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-center"
          />
        </div>
      </div>

      <div className="py-2">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isWork ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'
        }`}>
          {isWork ? 'WORK PERIOD' : 'REST PERIOD'}
        </span>
        <div className="text-6xl font-black font-mono text-slate-900 dark:text-white mt-2">
          {timeLeft}s
        </div>
        <p className="text-xs text-slate-400 mt-1">Round {currentRound} of {totalRounds}</p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs"
        >
          {isRunning ? 'Pause HIIT' : 'Start HIIT'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 14. Fitness Goal Tracker
// ==========================================
export const FitnessGoalTracker: React.FC = () => {
  const [goals, setGoals] = useState([
    { id: '1', title: 'Run 5K under 25 minutes', current: 27.5, target: 25.0, unit: 'mins' },
    { id: '2', title: 'Barbell Squat Target', current: 100, target: 120, unit: 'kg' },
    { id: '3', title: 'Daily Step Goal', current: 8500, target: 10000, unit: 'steps' }
  ]);

  return (
    <div className="space-y-4">
      {goals.map((g) => {
        const pct = Math.min(100, Math.round((g.current / g.target) * 100));
        return (
          <div key={g.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-100">{g.title}</span>
              <span className="text-slate-400">{g.current} / {g.target} {g.unit}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 15. Weekly Workout Schedule (Splits)
// ==========================================
export const WeeklyWorkoutSchedule: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [schedule, setSchedule] = useState<Record<string, string>>({
    Monday: 'Chest & Triceps (Push)',
    Tuesday: 'Back & Biceps (Pull)',
    Wednesday: 'Active Recovery / 30m Walk',
    Thursday: 'Legs & Calves',
    Friday: 'Shoulders & Core',
    Saturday: 'HIIT & Conditioning',
    Sunday: 'Full Rest & Mobility'
  });

  return (
    <div className="space-y-3">
      {days.map((day) => (
        <div key={day} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-bold w-24 text-slate-700 dark:text-slate-200">{day}</span>
          <input
            type="text"
            value={schedule[day]}
            onChange={(e) => setSchedule({ ...schedule, [day]: e.target.value })}
            className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg outline-none font-medium"
          />
        </div>
      ))}
    </div>
  );
};
