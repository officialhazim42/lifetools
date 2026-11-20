import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import { storage } from '../../../utils/storage';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Download,
  Flame
} from 'lucide-react';

interface Lap {
  index: number;
  splitTime: number; // Duration of this lap in ms
  overallTime: number; // Overall elapsed time at lap in ms
}

export const StopwatchTool: React.FC = () => {
  const { showToast } = useToast();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedTime;
      const update = () => {
        setElapsedTime(performance.now() - startTimeRef.current);
        animationFrameRef.current = requestAnimationFrame(update);
      };
      animationFrameRef.current = requestAnimationFrame(update);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (!isRunning && elapsedTime === 0) return;
    const prevOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const split = elapsedTime - prevOverall;
    const newLap: Lap = {
      index: laps.length + 1,
      splitTime: split,
      overallTime: elapsedTime
    };
    setLaps([newLap, ...laps]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    showToast('Stopwatch reset');
  };

  const formatDisplay = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      centiseconds: centiseconds.toString().padStart(2, '0')
    };
  };

  const time = formatDisplay(elapsedTime);

  const handleExportLaps = () => {
    if (laps.length === 0) {
      showToast('No laps to export', 'info');
      return;
    }
    const headers = ['Lap #', 'Split Time (s)', 'Overall Time (s)'];
    const rows = laps.map(l => [
      l.index,
      (l.splitTime / 1000).toFixed(2),
      (l.overallTime / 1000).toFixed(2)
    ]);
    storage.exportToCsv('lifetools-stopwatch-laps.csv', headers, rows);
    showToast('Laps exported as CSV');
  };

  // Find fastest & slowest lap
  const minSplit = laps.length > 1 ? Math.min(...laps.map(l => l.splitTime)) : -1;
  const maxSplit = laps.length > 1 ? Math.max(...laps.map(l => l.splitTime)) : -1;

  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      {/* Stopwatch Counter Card */}
      <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="flex items-center justify-center gap-1 font-mono select-none">
          <div className="text-7xl sm:text-8xl font-black text-slate-900 dark:text-white">
            {time.minutes}:{time.seconds}
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-emerald-500 self-end mb-2">
            .{time.centiseconds}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleToggle}
            className={`h-14 px-8 rounded-2xl font-bold text-base flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Stop
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" /> Start
              </>
            )}
          </button>

          <button
            onClick={handleLap}
            disabled={elapsedTime === 0}
            className="btn-secondary h-14 px-6 rounded-2xl disabled:opacity-40"
          >
            <Flag className="w-4 h-4" /> Lap
          </button>

          <button
            onClick={handleReset}
            disabled={elapsedTime === 0}
            className="btn-secondary h-14 px-6 rounded-2xl disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Laps Table */}
      {laps.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-emerald-500" /> Recorded Laps ({laps.length})
            </h4>
            <button onClick={handleExportLaps} className="btn-secondary text-xs py-1 px-2.5">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
            {laps.map(lap => {
              const isFastest = lap.splitTime === minSplit;
              const isSlowest = lap.splitTime === maxSplit;
              const split = formatDisplay(lap.splitTime);
              const overall = formatDisplay(lap.overallTime);

              return (
                <div
                  key={lap.index}
                  className={`py-2.5 px-3 flex items-center justify-between rounded-lg transition-colors ${
                    isFastest
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : isSlowest
                      ? 'bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="w-16">Lap #{lap.index}</span>
                  <span className="flex-1 text-center">
                    +{split.minutes}:{split.seconds}.{split.centiseconds}
                    {isFastest && <span className="ml-2 text-[10px] uppercase font-sans font-bold">Fastest</span>}
                    {isSlowest && <span className="ml-2 text-[10px] uppercase font-sans font-bold">Slowest</span>}
                  </span>
                  <span className="w-24 text-right text-slate-400">
                    {overall.minutes}:{overall.seconds}.{overall.centiseconds}
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
