import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
  Hourglass,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Volume2,
  VolumeX
} from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const { showToast } = useToast();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef<any>(null);

  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.0);
    } catch {
      // Audio not permitted
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            playBeep();
            showToast('Time is up! Countdown finished!', 'info');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, soundEnabled]);

  const handleStart = () => {
    if (timeLeft === 0) {
      const initial = hours * 3600 + minutes * 60 + seconds;
      if (initial <= 0) {
        showToast('Please set a timer duration greater than 0', 'warning');
        return;
      }
      setTotalSeconds(initial);
      setTimeLeft(initial);
    }
    setIsRunning(true);
  };

  const handleApplyPreset = (h: number, m: number, s: number) => {
    setIsRunning(false);
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    const secs = h * 3600 + m * 60 + s;
    setTotalSeconds(secs);
    setTimeLeft(secs);
  };

  const handleReset = () => {
    setIsRunning(false);
    const secs = hours * 3600 + minutes * 60 + seconds;
    setTimeLeft(secs || totalSeconds);
    showToast('Timer reset');
  };

  const formatDisplay = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const display = formatDisplay(timeLeft);
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      {/* Timer Presets */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {[
          { label: '1 Min', h: 0, m: 1, s: 0 },
          { label: '5 Min', h: 0, m: 5, s: 0 },
          { label: '10 Min', h: 0, m: 10, s: 0 },
          { label: '15 Min', h: 0, m: 15, s: 0 },
          { label: '30 Min', h: 0, m: 30, s: 0 },
          { label: '1 Hour', h: 1, m: 0, s: 0 }
        ].map((p, i) => (
          <button
            key={i}
            onClick={() => handleApplyPreset(p.h, p.m, p.s)}
            className="btn-secondary text-xs py-1 px-3"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Display Card */}
      <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Big Digits */}
        <div className="text-7xl sm:text-8xl font-black font-mono text-slate-900 dark:text-white tracking-tight select-none">
          {display.h !== '00' && <span>{display.h}:</span>}
          <span>{display.m}</span>:<span>{display.s}</span>
        </div>

        {/* Inputs (visible when not running) */}
        {!isRunning && (
          <div className="flex items-center justify-center gap-3">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="99"
                value={hours}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setHours(val);
                  const total = val * 3600 + minutes * 60 + seconds;
                  setTotalSeconds(total);
                  setTimeLeft(total);
                }}
                className="input-base text-center w-16 py-1.5 font-mono text-sm"
              />
            </div>
            <span className="text-xl font-bold text-slate-400 self-end mb-1">:</span>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setMinutes(val);
                  const total = hours * 3600 + val * 60 + seconds;
                  setTotalSeconds(total);
                  setTimeLeft(total);
                }}
                className="input-base text-center w-16 py-1.5 font-mono text-sm"
              />
            </div>
            <span className="text-xl font-bold text-slate-400 self-end mb-1">:</span>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => {
                  const val = Math.max(0, parseInt(e.target.value) || 0);
                  setSeconds(val);
                  const total = hours * 3600 + minutes * 60 + val;
                  setTotalSeconds(total);
                  setTimeLeft(total);
                }}
                className="input-base text-center w-16 py-1.5 font-mono text-sm"
              />
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (isRunning) {
                setIsRunning(false);
              } else {
                handleStart();
              }
            }}
            className={`h-14 px-8 rounded-2xl font-bold text-base flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start
              </>
            )}
          </button>

          <button onClick={handleReset} className="btn-secondary h-14 px-6 rounded-2xl">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary h-14 px-4 rounded-2xl"
            title={soundEnabled ? 'Mute chime' : 'Enable chime'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-500" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};
