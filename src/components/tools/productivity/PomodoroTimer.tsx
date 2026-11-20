import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Coffee,
  Brain
} from 'lucide-react';

type Mode = 'work' | 'shortBreak' | 'longBreak';

export const PomodoroTimer: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<Mode>('work');
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const timerRef = useRef<any>(null);

  // Synthesize pleasant bell sound using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // Audio not permitted or supported
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playChime();

            if (mode === 'work') {
              const nextCount = sessionsCompleted + 1;
              setSessionsCompleted(nextCount);
              if (nextCount % 4 === 0) {
                setMode('longBreak');
                setTimeLeft(longBreakDuration * 60);
                showToast('Great job! Time for a Long Break (15 min)!');
              } else {
                setMode('shortBreak');
                setTimeLeft(shortBreakDuration * 60);
                showToast('Focus session complete! Take a 5 min break.');
              }
            } else {
              setMode('work');
              setTimeLeft(workDuration * 60);
              showToast('Break finished! Ready for next focus round?');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, mode, sessionsCompleted, workDuration, shortBreakDuration, longBreakDuration]);

  const handleModeChange = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(workDuration * 60);
    else if (newMode === 'shortBreak') setTimeLeft(shortBreakDuration * 60);
    else setTimeLeft(longBreakDuration * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    handleModeChange(mode);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'work') {
      handleModeChange('shortBreak');
    } else {
      handleModeChange('work');
    }
    showToast('Skipped to next session');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentDuration =
    mode === 'work'
      ? workDuration * 60
      : mode === 'shortBreak'
      ? shortBreakDuration * 60
      : longBreakDuration * 60;

  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      {/* Mode Selectors */}
      <div className="inline-flex rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 shadow-subtle gap-1">
        <button
          onClick={() => handleModeChange('work')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'work'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" /> Pomodoro (Work)
        </button>
        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'shortBreak'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" /> Short Break
        </button>
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'longBreak'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" /> Long Break
        </button>
      </div>

      {/* Main Clock Card */}
      <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 relative overflow-hidden">
        {/* Top subtle progress line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              mode === 'work' ? 'bg-rose-500' : mode === 'shortBreak' ? 'bg-emerald-500' : 'bg-sky-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2">
          <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white select-none">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
            {mode === 'work' ? 'Stay Focused & Minimize Distractions' : 'Rest Your Eyes & Relax'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`h-14 px-8 rounded-2xl font-bold text-base flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : mode === 'work'
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start Focus
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="btn-secondary h-14 px-4 rounded-2xl"
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={handleReset}
            className="btn-secondary h-14 px-4 rounded-2xl"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`btn-secondary h-14 px-4 rounded-2xl ${showSettings ? 'border-emerald-500 text-emerald-500' : ''}`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary h-14 px-4 rounded-2xl"
            title={soundEnabled ? 'Mute alert sound' : 'Enable alert sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

        {/* Session Stats */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around text-xs text-slate-500">
          <div>
            Sessions Completed: <span className="font-bold text-slate-900 dark:text-white">{sessionsCompleted}</span>
          </div>
          <div>
            Cycle: <span className="font-bold text-slate-900 dark:text-white">{(sessionsCompleted % 4) + 1}/4</span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-left space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Timer Durations (Minutes)</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Work</label>
              <input
                type="number"
                min="1"
                max="90"
                value={workDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWorkDuration(val);
                  if (mode === 'work') setTimeLeft(val * 60);
                }}
                className="input-base text-xs py-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Short Break</label>
              <input
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setShortBreakDuration(val);
                  if (mode === 'shortBreak') setTimeLeft(val * 60);
                }}
                className="input-base text-xs py-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Long Break</label>
              <input
                type="number"
                min="1"
                max="60"
                value={longBreakDuration}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLongBreakDuration(val);
                  if (mode === 'longBreak') setTimeLeft(val * 60);
                }}
                className="input-base text-xs py-1.5"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
