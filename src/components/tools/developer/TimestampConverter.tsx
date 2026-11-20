import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Clock, RefreshCw } from 'lucide-react';

export const TimestampConverter: React.FC = () => {
  const { showToast } = useToast();
  const [timestampInput, setTimestampInput] = useState<string>(() => Math.floor(Date.now() / 1000).toString());
  const [customDateTime, setCustomDateTime] = useState<string>(() => new Date().toISOString().slice(0, 16));

  const convertTimestamp = () => {
    if (!timestampInput.trim()) return null;
    let num = Number(timestampInput.trim());
    if (isNaN(num)) return null;

    // Check if seconds or milliseconds
    const isMilliseconds = num > 9999999999;
    const date = new Date(isMilliseconds ? num : num * 1000);

    if (isNaN(date.getTime())) return null;

    return {
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      iso: date.toISOString(),
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
      isMilliseconds
    };
  };

  const tsResult = convertTimestamp();

  // Convert custom picker
  const pickerDate = new Date(customDateTime);
  const pickerSec = !isNaN(pickerDate.getTime()) ? Math.floor(pickerDate.getTime() / 1000) : null;
  const pickerMs = !isNaN(pickerDate.getTime()) ? pickerDate.getTime() : null;

  const handleCopy = (str: string, label: string) => {
    copyToClipboard(str);
    showToast(`${label} copied!`);
  };

  const handleNow = () => {
    const now = Math.floor(Date.now() / 1000).toString();
    setTimestampInput(now);
    setCustomDateTime(new Date().toISOString().slice(0, 16));
    showToast('Updated to current time');
  };

  return (
    <div className="space-y-8">
      {/* 1. Epoch to Human Date */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
            1. Unix Timestamp &rarr; Human-Readable Date
          </h3>
          <button onClick={handleNow} className="btn-secondary text-xs py-1">
            <RefreshCw className="w-3.5 h-3.5" /> Current Epoch Now
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">Epoch Timestamp (Seconds or Milliseconds)</label>
          <input
            type="text"
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            className="input-base font-mono text-base font-bold"
            placeholder="1710000000"
          />
        </div>

        {tsResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Local Time</span>
                <button onClick={() => handleCopy(tsResult.local, 'Local Time')} className="hover:text-emerald-500">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{tsResult.local}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>UTC Time</span>
                <button onClick={() => handleCopy(tsResult.utc, 'UTC Time')} className="hover:text-emerald-500">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">{tsResult.utc}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-1 sm:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>ISO 8601 String</span>
                <button onClick={() => handleCopy(tsResult.iso, 'ISO string')} className="hover:text-emerald-500">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{tsResult.iso}</div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Date Picker to Epoch */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
          2. Human Date &rarr; Unix Timestamp
        </h3>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Select Date & Time</label>
          <input
            type="datetime-local"
            value={customDateTime}
            onChange={(e) => setCustomDateTime(e.target.value)}
            className="input-base font-mono"
          />
        </div>

        {pickerSec !== null && pickerMs !== null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Seconds (Standard)</span>
                <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {pickerSec}
                </span>
              </div>
              <button onClick={() => handleCopy(String(pickerSec), 'Timestamp seconds')} className="btn-secondary text-xs py-1">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Milliseconds</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                  {pickerMs}
                </span>
              </div>
              <button onClick={() => handleCopy(String(pickerMs), 'Timestamp milliseconds')} className="btn-secondary text-xs py-1">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
