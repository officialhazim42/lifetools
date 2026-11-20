import React, { useState, useEffect } from 'react';
import {
  calculateBedtimesForWakeTime,
  calculateWakeTimesFromNow
} from '../../../utils/health/sleepUtils';
import { healthDB } from '../../../utils/healthDB';
import { useToast } from '../../../context/ToastContext';
import {
  Moon,
  Sun,
  Clock,
  Sparkles,
  Heart,
  Smile,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Tv
} from 'lucide-react';

function playChime(freq = 528, duration = 0.5) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

// ==========================================
// 1. Sleep Calculator
// ==========================================
export const SleepCalculator: React.FC = () => {
  const [wakeTime, setWakeTime] = useState('07:00');
  const result = calculateBedtimesForWakeTime(wakeTime);

  return (
    <div className="space-y-6">
      <div className="max-w-xs mx-auto text-center">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          I want to wake up at:
        </label>
        <input
          type="time"
          value={wakeTime}
          onChange={(e) => setWakeTime(e.target.value)}
          className="w-full px-3 py-2 text-lg font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center outline-none"
        />
      </div>

      {result && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
            Suggested Bedtimes (accounting for 14m to fall asleep)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {result.cycles.map((c) => (
              <div
                key={c.cycleCount}
                className={`p-3.5 rounded-xl border transition-all ${
                  c.isOptimal
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100">{c.bedtime}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.isOptimal ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {c.cycleCount} Cycles ({c.totalHours} hrs)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. Sleep Tracker
// ==========================================
export const SleepTracker: React.FC = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState(4);

  useEffect(() => {
    healthDB.getSleepLogs().then(setLogs);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const entry = {
      id: 'slp_' + Date.now(),
      date,
      bedtime,
      wakeTime,
      durationMinutes: 480, // 8 hours
      sleepQuality: quality,
      createdAt: new Date().toISOString()
    };
    await healthDB.saveSleepLog(entry);
    const updated = await healthDB.getSleepLogs();
    setLogs(updated);
    showToast('Sleep log saved', 'success');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Bedtime</label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Wake Time</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="w-full py-2 bg-emerald-600 text-white font-medium rounded-lg">
            Log Sleep
          </button>
        </div>
      </form>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recent Sleep History</span>
        {logs.slice(0, 5).map((l) => (
          <div key={l.id} className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-100">{l.date}</span>
              <span className="text-slate-400 block text-[11px]">{l.bedtime} to {l.wakeTime}</span>
            </div>
            <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-600 font-bold">Quality: {l.sleepQuality}/5</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. Sleep Cycle Planner
// ==========================================
export const SleepCyclePlanner: React.FC = () => {
  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">The 90-Minute Sleep Architecture</span>
        <p className="text-slate-500 leading-relaxed">
          Human sleep consists of recurring ultradian cycles lasting approximately 90 to 110 minutes each, shifting from light Non-REM (N1, N2), to deep restorative slow-wave sleep (N3), into Rapid Eye Movement (REM).
        </p>
        <p className="text-slate-500 leading-relaxed">
          Waking up in the middle of deep sleep (N3) causes sleep inertia (grogginess and brain fog). Waking at the boundary of a cycle leaves you feeling alert and refreshed.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Stage 1: N1 Light</span>
          <span className="font-bold text-slate-800 dark:text-slate-100 block mt-1">5-10 min</span>
          <span className="text-[10px] text-slate-400">Drifting off</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Stage 2: N2 Core</span>
          <span className="font-bold text-slate-800 dark:text-slate-100 block mt-1">45-55%</span>
          <span className="text-[10px] text-slate-400">Heart rate slows</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Stage 3: N3 Deep</span>
          <span className="font-bold text-slate-800 dark:text-slate-100 block mt-1">15-25%</span>
          <span className="text-[10px] text-slate-400">Cellular repair</span>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block font-medium">Stage 4: REM</span>
          <span className="font-bold text-slate-800 dark:text-slate-100 block mt-1">20-25%</span>
          <span className="text-[10px] text-slate-400">Memory & dreaming</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Bedtime Calculator
// ==========================================
export const BedtimeCalculator: React.FC = () => {
  return <SleepCalculator />;
};

// ==========================================
// 5. Wake-up Time Calculator
// ==========================================
export const WakeUpTimeCalculator: React.FC = () => {
  const { bedtime, wakeTimes } = calculateWakeTimesFromNow();

  return (
    <div className="space-y-6 text-center">
      <div>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">If you go to bed right now ({bedtime})</span>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">You should aim to wake up at one of these times:</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {wakeTimes.map((w) => (
          <div
            key={w.cycles}
            className={`p-4 rounded-xl border ${
              w.isOptimal
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="text-2xl font-black block">{w.wakeTime}</span>
            <span className="text-slate-400 block mt-1">{w.hours} hrs ({w.cycles} cycles)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. Relaxation Timer
// ==========================================
export const RelaxationTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(300); // 5 mins
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let t: any = null;
    if (isRunning && seconds > 0) {
      t = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      playChime(432, 1.2);
    }
    return () => clearInterval(t);
  }, [isRunning, seconds]);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-2 text-xs">
        {[180, 300, 600, 900].map((dur) => (
          <button
            key={dur}
            onClick={() => { setIsRunning(false); setSeconds(dur); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50"
          >
            {dur / 60}m
          </button>
        ))}
      </div>

      <div className="text-6xl font-black font-mono text-slate-900 dark:text-white py-2">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs"
        >
          {isRunning ? 'Pause' : 'Start Relaxation'}
        </button>
        <button
          onClick={() => { setIsRunning(false); setSeconds(300); }}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 7. Meditation Timer
// ==========================================
export const MeditationTimer: React.FC = () => {
  const [seconds, setSeconds] = useState(600); // 10 mins
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let t: any = null;
    if (isRunning && seconds > 0) {
      t = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false);
      playChime(528, 1.5);
    }
    return () => clearInterval(t);
  }, [isRunning, seconds]);

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl font-black font-mono text-slate-900 dark:text-white py-2">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
        >
          {isRunning ? 'Pause Meditation' : 'Start Meditation'}
        </button>
        <button
          onClick={() => { setIsRunning(false); setSeconds(600); }}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl text-xs"
        >
          Reset (10m)
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 8. Breathing Exercise Timer (4-7-8 & Box Breathing)
// ==========================================
export const BreathingExerciseTimer: React.FC = () => {
  const [pattern, setPattern] = useState<'box' | '478'>('box');
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold2'>('Inhale');
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let t: any = null;
    if (isActive) {
      t = setInterval(() => {
        setCount((prev) => {
          if (prev > 1) return prev - 1;

          // Box breathing: 4s Inhale, 4s Hold, 4s Exhale, 4s Hold
          if (pattern === 'box') {
            if (phase === 'Inhale') { setPhase('Hold'); return 4; }
            if (phase === 'Hold') { setPhase('Exhale'); return 4; }
            if (phase === 'Exhale') { setPhase('Hold2'); return 4; }
            if (phase === 'Hold2') { setPhase('Inhale'); return 4; }
          } else {
            // 4-7-8 Breathing: 4s Inhale, 7s Hold, 8s Exhale
            if (phase === 'Inhale') { setPhase('Hold'); return 7; }
            if (phase === 'Hold') { setPhase('Exhale'); return 8; }
            if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
          }
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isActive, phase, pattern]);

  const toggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setPhase('Inhale');
      setCount(4);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center gap-2 text-xs">
        <button
          onClick={() => { setIsActive(false); setPattern('box'); setPhase('Inhale'); setCount(4); }}
          className={`px-3 py-1.5 rounded-lg border ${pattern === 'box' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
        >
          Box Breathing (4-4-4-4)
        </button>
        <button
          onClick={() => { setIsActive(false); setPattern('478'); setPhase('Inhale'); setCount(4); }}
          className={`px-3 py-1.5 rounded-lg border ${pattern === '478' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 font-bold' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
        >
          4-7-8 Deep Relaxation
        </button>
      </div>

      <div className="py-6">
        <div className={`w-40 h-40 mx-auto rounded-full flex flex-col items-center justify-center transition-all duration-700 ${
          phase === 'Inhale'
            ? 'scale-110 bg-emerald-500 text-white'
            : phase === 'Hold' || phase === 'Hold2'
            ? 'scale-105 bg-amber-500 text-white'
            : 'scale-90 bg-sky-500 text-white'
        }`}>
          <span className="text-sm uppercase tracking-wider font-bold">
            {phase === 'Hold2' ? 'Hold' : phase}
          </span>
          <span className="text-4xl font-black mt-1">{count}</span>
        </div>
      </div>

      <button
        onClick={toggle}
        className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-xs"
      >
        {isActive ? 'Pause Breathing' : 'Start Breathing Guide'}
      </button>
    </div>
  );
};

// ==========================================
// 9. Mood Tracker
// ==========================================
export const MoodTracker: React.FC = () => {
  const [rating, setRating] = useState(4);
  const moods = ['😢 Very Low', '🙁 Low', '😐 Neutral', '🙂 Good', '😁 Excellent'];

  return (
    <div className="space-y-6 text-center">
      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">How are you feeling today?</span>
      <div className="flex justify-center gap-2">
        {moods.map((m, idx) => (
          <button
            key={idx}
            onClick={() => setRating(idx + 1)}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              rating === idx + 1
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 font-bold shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400">Regular mood tracking helps identify emotional cycles, recovery periods, and stress triggers.</p>
    </div>
  );
};

// ==========================================
// 10. Daily Wellness Journal
// ==========================================
export const DailyWellnessJournal: React.FC = () => {
  const [gratitude, setGratitude] = useState('');
  const [reflection, setReflection] = useState('');

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-500 font-medium mb-1">What are you grateful for today?</label>
        <textarea
          rows={2}
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="List 2-3 simple things..."
          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-slate-500 font-medium mb-1">Daily Reflections & Wins</label>
        <textarea
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Reflect on your day..."
          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none resize-none"
        />
      </div>
    </div>
  );
};

// ==========================================
// 11. Wellness Habit Tracker
// ==========================================
export const WellnessHabitTracker: React.FC = () => {
  const [habits, setHabits] = useState([
    { id: '1', name: '2L Water Consumed', done: true },
    { id: '2', name: '15m Morning Sunlight', done: true },
    { id: '3', name: '30m Daily Physical Movement', done: false },
    { id: '4', name: 'No screens 30m before bed', done: false }
  ]);

  const toggle = (id: string) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, done: !h.done } : h)));
  };

  return (
    <div className="space-y-2 text-xs">
      {habits.map((h) => (
        <div
          key={h.id}
          onClick={() => toggle(h.id)}
          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300"
        >
          <span className={`font-semibold ${h.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
            {h.name}
          </span>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${h.done ? 'bg-emerald-500 text-white' : 'border border-slate-300'}`}>
            {h.done && '✓'}
          </span>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 12. Stress Journal
// ==========================================
export const StressJournal: React.FC = () => {
  const [stressLevel, setStressLevel] = useState(3);
  const [trigger, setTrigger] = useState('');

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block text-slate-500 font-medium mb-1">Current Stress Level (1 = Serene, 5 = Overwhelmed)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setStressLevel(lvl)}
              className={`flex-1 py-2 rounded-lg font-bold border ${stressLevel === lvl ? 'bg-rose-500/10 border-rose-500 text-rose-600' : 'border-slate-200 dark:border-slate-800 text-slate-500'}`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-slate-500 font-medium mb-1">What is triggering this feeling?</label>
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="e.g. Work deadline, lack of sleep..."
          className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
      </div>
    </div>
  );
};

// ==========================================
// 13. Screen Time Tracker
// ==========================================
export const ScreenTimeTracker: React.FC = () => {
  const [workHours, setWorkHours] = useState(6.5);
  const [recreationHours, setRecreationHours] = useState(2.0);

  const total = Math.round((workHours + recreationHours) * 10) / 10;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <label className="text-slate-500 block mb-1">Work / Productivity (hrs)</label>
          <input
            type="number"
            value={workHours}
            onChange={(e) => setWorkHours(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="text-slate-500 block mb-1">Recreation / Social (hrs)</label>
          <input
            type="number"
            value={recreationHours}
            onChange={(e) => setRecreationHours(parseFloat(e.target.value) || 0)}
            className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Estimated Total Screen Time</span>
        <div className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{total} Hours/Day</div>
        <p className="text-xs text-slate-500">
          Remember the 20-20-20 rule: Every 20 minutes, look at an object 20 feet away for at least 20 seconds to prevent digital eye strain.
        </p>
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Note: Web browsers cannot automatically monitor system-wide background desktop screen activity without native OS permissions.
      </p>
    </div>
  );
};

// ==========================================
// 14. Daily Self-Care Checklist
// ==========================================
export const DailySelfCareChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', title: 'Physical: Drank a full glass of water upon waking', done: true },
    { id: '2', title: 'Mental: Took a 10-minute digital disconnection break', done: true },
    { id: '3', title: 'Emotional: Acknowledged an accomplishment without dismissing it', done: false },
    { id: '4', title: 'Rest: Prepared bedroom for cool, dark sleep', done: false }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  return (
    <div className="space-y-2 text-xs">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => toggle(item.id)}
          className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
        >
          <span className={item.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200 font-medium'}>
            {item.title}
          </span>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500 text-white' : 'border border-slate-300'}`}>
            {item.done && '✓'}
          </span>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 15. Weekly Wellness Summary
// ==========================================
export const WeeklyWellnessSummary: React.FC = () => {
  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <span className="font-bold text-slate-800 dark:text-slate-100 block">7-Day Wellness Synthesis</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Average Sleep</span>
            <span className="font-bold text-indigo-600 text-sm">7.6 hrs/night</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Workouts Logged</span>
            <span className="font-bold text-emerald-600 text-sm">4 sessions</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Average Mood</span>
            <span className="font-bold text-amber-500 text-sm">4.2 / 5</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block">Water Consistency</span>
            <span className="font-bold text-cyan-600 text-sm">6 of 7 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
