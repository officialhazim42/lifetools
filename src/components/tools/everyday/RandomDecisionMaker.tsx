import React, { useState, useEffect, useRef } from 'react';
import { safeStorage } from '../../../utils/storage';
import {
  Dices,
  RotateCw,
  Plus,
  Trash2,
  Sparkles,
  Volume2,
  VolumeX,
  History,
  Trophy,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface Choice {
  id: string;
  text: string;
  weight: number;
  color: string;
}

const PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
];

const PRESETS: Record<string, { name: string; choices: string[] }> = {
  food: {
    name: 'What to Eat?',
    choices: ['Pizza', 'Biryani', 'Pasta', 'Burger', 'Healthy Salad', 'Tacos', 'Dosa', 'Sushi']
  },
  yesno: {
    name: 'Yes or No?',
    choices: ['Yes, definitely!', 'No, not today', 'Maybe later', 'Go for it!']
  },
  whofirst: {
    name: 'Who Goes First?',
    choices: ['Player 1', 'Player 2', 'Player 3', 'Player 4']
  },
  weekend: {
    name: 'Weekend Activity',
    choices: ['Watch a Movie', 'Outdoor Walk / Hike', 'Read a Book', 'Deep Clean & Organize', 'Gaming Session', 'Cook New Recipe']
  },
  workout: {
    name: 'Daily Workout',
    choices: ['Upper Body Strength', 'Legs & Glutes', 'Core & Cardio HIIT', 'Yoga & Stretching', 'Rest & Recovery Walk']
  }
};

export const RandomDecisionMaker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [choices, setChoices] = useState<Choice[]>(() => {
    const saved = safeStorage.getItem<Choice[]>('wheel_choices', []);
    if (saved.length > 0) return saved;

    return PRESETS.food.choices.map((text, idx) => ({
      id: `c-${Date.now()}-${idx}`,
      text,
      weight: 1,
      color: PALETTE[idx % PALETTE.length]
    }));
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [newChoiceText, setNewChoiceText] = useState<string>('');
  const [history, setHistory] = useState<{ id: string; result: string; time: string }[]>(() => {
    return safeStorage.getItem('wheel_history', []);
  });

  // Animation refs
  const currentAngleRef = useRef<number>(0);
  const spinTimeoutRef = useRef<any>(null);

  useEffect(() => {
    safeStorage.setItem('wheel_choices', choices);
  }, [choices]);

  useEffect(() => {
    safeStorage.setItem('wheel_history', history);
  }, [history]);

  // Audio synthesize click
  const playTickSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch {
      // Audio not supported
    }
  };

  const playWinFanfare = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.08);
        osc.stop(audioCtx.currentTime + idx * 0.08 + 0.25);
      });
    } catch {
      // Audio not supported
    }
  };

  // Draw the Canvas wheel
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2 - 16;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    if (choices.length === 0) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      return;
    }

    const totalWeight = choices.reduce((sum, c) => sum + (c.weight || 1), 0);
    let startAngle = angle;

    // Draw slices
    choices.forEach((choice) => {
      const sliceAngle = (choice.weight / totalWeight) * (2 * Math.PI);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = choice.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Text label inside slice
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;

      // Truncate text if long
      const maxLen = 16;
      const displayTxt = choice.text.length > maxLen ? choice.text.substring(0, maxLen - 1) + '…' : choice.text;
      ctx.fillText(displayTxt, radius - 20, 5);
      ctx.restore();

      startAngle += sliceAngle;
    });

    // Center circular hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
  };

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [choices]);

  const spinWheel = () => {
    if (isSpinning || choices.length < 2) return;
    setIsSpinning(true);
    setWinner(null);

    const totalWeight = choices.reduce((sum, c) => sum + (c.weight || 1), 0);

    // Random turns: between 4 and 8 full revolutions + random offset
    const randomRotations = (Math.floor(Math.random() * 4) + 5) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const totalSpin = randomRotations + randomOffset;

    const startAngle = currentAngleRef.current;
    const finalAngle = startAngle + totalSpin;
    const duration = 4000; // ms
    const startTime = performance.now();
    let lastTickAngle = startAngle;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startAngle + totalSpin * ease;
      currentAngleRef.current = current;

      // Tick sound every 30 degrees (~0.5 rad)
      if (Math.abs(current - lastTickAngle) >= 0.4) {
        playTickSound();
        lastTickAngle = current;
      }

      drawWheel(current);

      if (progress < 1) {
        spinTimeoutRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // Compute which slice landed at the top pointer (pointer is at top: 3*PI/2 or -PI/2)
        const normalizedAngle = (finalAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        // The pointer points down at top (angle = 3*PI/2)
        const pointerAngle = (1.5 * Math.PI - normalizedAngle + 2 * Math.PI) % (2 * Math.PI);

        let accumulated = 0;
        let chosenItem = choices[0];
        for (const choice of choices) {
          const sliceAngle = (choice.weight / totalWeight) * (2 * Math.PI);
          if (pointerAngle >= accumulated && pointerAngle < accumulated + sliceAngle) {
            chosenItem = choice;
            break;
          }
          accumulated += sliceAngle;
        }

        setWinner(chosenItem.text);
        playWinFanfare();

        const historyEntry = {
          id: `h-${Date.now()}`,
          result: chosenItem.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setHistory((prev) => [historyEntry, ...prev.slice(0, 19)]);
      }
    };

    spinTimeoutRef.current = requestAnimationFrame(animate);
  };

  const handleAddChoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChoiceText.trim()) return;

    const newChoice: Choice = {
      id: `c-${Date.now()}`,
      text: newChoiceText.trim(),
      weight: 1,
      color: PALETTE[choices.length % PALETTE.length]
    };

    setChoices((prev) => [...prev, newChoice]);
    setNewChoiceText('');
  };

  const handleDeleteChoice = (id: string) => {
    if (choices.length <= 2) {
      alert('You need at least 2 choices to spin the wheel.');
      return;
    }
    setChoices((prev) => prev.filter((c) => c.id !== id));
  };

  const loadPreset = (presetKey: string) => {
    const p = PRESETS[presetKey];
    if (!p) return;
    const newItems = p.choices.map((text, idx) => ({
      id: `c-${Date.now()}-${idx}`,
      text,
      weight: 1,
      color: PALETTE[idx % PALETTE.length]
    }));
    setChoices(newItems);
    setWinner(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Dices className="w-8 h-8 text-pink-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Random Decision Maker & Spin Wheel</h1>
          </div>
          <p className="text-pink-100 text-sm mt-1">
            End decision fatigue! Spin the wheel to pick meals, workout splits, movie nights, or team turns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition"
            title={soundEnabled ? 'Mute' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-200" />}
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Decision Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Wheel & Winner Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Canvas Wheel */}
        <div className="md:col-span-7 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {/* Top Pointer Indicator Arrow */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[26px] border-t-red-500 drop-shadow-md" />
          </div>

          <div className="relative my-2">
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="rounded-full shadow-lg max-w-full"
            />
          </div>

          {/* Spin Button */}
          <button
            onClick={spinWheel}
            disabled={isSpinning || choices.length < 2}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transition flex items-center gap-2 group cursor-pointer"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
            <span>{isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}</span>
          </button>

          {/* Winner Celebration Modal / Card */}
          {winner && (
            <div className="mt-5 p-4 w-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 rounded-2xl text-center animate-fadeIn">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                Winner Selected!
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                "{winner}"
              </div>
            </div>
          )}
        </div>

        {/* Right: Choices Editor & History */}
        <div className="md:col-span-5 space-y-4">
          {/* Add Choice */}
          <form
            onSubmit={handleAddChoice}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex gap-2"
          >
            <input
              type="text"
              placeholder="Add new option..."
              value={newChoiceText}
              onChange={(e) => setNewChoiceText(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <button
              type="submit"
              disabled={!newChoiceText.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          {/* Current Choices List */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider">
              Options List ({choices.length})
            </h3>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 pr-1">
              {choices.map((c) => (
                <div key={c.id} className="py-2 flex items-center justify-between gap-2 group">
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {c.text}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteChoice(c.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1"
                    title="Remove choice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Decision History */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-500" />
                Recent Decision History
              </h3>
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 text-xs">
                {history.map((h) => (
                  <div key={h.id} className="py-1.5 flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {h.result}
                    </span>
                    <span className="text-[10px] text-slate-400">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
