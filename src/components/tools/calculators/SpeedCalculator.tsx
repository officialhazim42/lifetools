import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const SpeedCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [distance, setDistance] = useState<number | ''>(100);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles' | 'meters'>('km');

  const [hours, setHours] = useState<number | ''>(1);
  const [minutes, setMinutes] = useState<number | ''>(15);
  const [seconds, setSeconds] = useState<number | ''>(0);

  const calculate = () => {
    const d = Number(distance) || 0;
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    const s = Number(seconds) || 0;

    const totalHours = h + m / 60 + s / 3600;
    if (d <= 0 || totalHours <= 0) return null;

    // Convert distance to km
    let distKm = d;
    if (distanceUnit === 'miles') distKm = d * 1.60934;
    if (distanceUnit === 'meters') distKm = d / 1000;

    const kmh = distKm / totalHours;
    const mph = kmh * 0.621371;
    const ms = (kmh * 1000) / 3600;
    const knots = kmh * 0.539957;
    const fts = ms * 3.28084;

    return {
      kmh,
      mph,
      ms,
      knots,
      fts,
      totalHours
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Speed: ${res.kmh.toFixed(2)} km/h (${res.mph.toFixed(2)} mph, ${res.ms.toFixed(2)} m/s, ${res.knots.toFixed(2)} knots)`
    );
    showToast('Speed calculations copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Distance Traveled
            </label>
            <div className="flex gap-1 text-[11px]">
              {(['km', 'miles', 'meters'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setDistanceUnit(u)}
                  className={`px-1.5 py-0.5 rounded capitalize ${
                    distanceUnit === u ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            min="0"
            value={distance}
            onChange={(e) => setDistance(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Time Taken (Hours / Min / Sec)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base text-center"
              placeholder="Hrs"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base text-center"
              placeholder="Min"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base text-center"
              placeholder="Sec"
            />
          </div>
        </div>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Speed Metrics</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {res.kmh.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Kilometers per Hour (km/h)</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {res.mph.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase font-semibold">Miles per Hour (mph)</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Meters / Second</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{res.ms.toFixed(2)} m/s</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Knots (nautical)</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{res.knots.toFixed(2)} kts</span>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 block">Feet / Second</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{res.fts.toFixed(2)} ft/s</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
