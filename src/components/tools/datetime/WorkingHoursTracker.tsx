import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Download, Play, Square, DollarSign, Calendar } from 'lucide-react';
import { safeStorage, exportToCsv } from '../../../utils/storage';

interface WorkLog {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  netHours: number;
  project: string;
  notes?: string;
}

const STORAGE_KEY = 'lifetools_working_hours';

export const WorkingHoursTracker: React.FC = () => {
  const [logs, setLogs] = useState<WorkLog[]>(() => {
    return safeStorage.get(STORAGE_KEY, []);
  });

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [project, setProject] = useState('');
  const [notes, setNotes] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(() => {
    return safeStorage.get('lifetools_hourly_rate', 0);
  });
  const [currency, setCurrency] = useState('₹');

  // Live punch clock state
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchStartTime, setPunchStartTime] = useState<string | null>(null);

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, logs);
  }, [logs]);

  useEffect(() => {
    safeStorage.set('lifetools_hourly_rate', hourlyRate);
  }, [hourlyRate]);

  const calculateNetHours = (start: string, end: string, breakMins: number) => {
    if (!start || !end) return 0;
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);

    let startMins = sH * 60 + sM;
    let endMins = eH * 60 + eM;

    // Handle shift crossing midnight
    if (endMins < startMins) {
      endMins += 24 * 60;
    }

    const totalMins = Math.max(0, endMins - startMins - (breakMins || 0));
    return Number((totalMins / 60).toFixed(2));
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const net = calculateNetHours(startTime, endTime, breakMinutes);
    if (net <= 0) return;

    const newLog: WorkLog = {
      id: 'log_' + Date.now(),
      date,
      startTime,
      endTime,
      breakMinutes,
      netHours: net,
      project: project.trim() || 'General Work',
      notes: notes.trim()
    };

    setLogs(prev => [newLog, ...prev]);
    setProject('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const handlePunchToggle = () => {
    const nowTime = new Date().toTimeString().slice(0, 5);
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchStartTime(nowTime);
    } else {
      setIsPunchedIn(false);
      if (punchStartTime) {
        setStartTime(punchStartTime);
        setEndTime(nowTime);
      }
    }
  };

  // Aggregated stats
  const totalHours = logs.reduce((acc, curr) => acc + curr.netHours, 0);
  const totalOvertime = logs.reduce((acc, curr) => acc + Math.max(0, curr.netHours - 8), 0);
  const estimatedPay = totalHours * (hourlyRate || 0);

  const handleExport = () => {
    if (logs.length === 0) return;
    exportToCsv(
      logs.map(l => ({
        Date: l.date,
        Project: l.project,
        'Start Time': l.startTime,
        'End Time': l.endTime,
        'Break (Mins)': l.breakMinutes,
        'Net Hours': l.netHours,
        Notes: l.notes || ''
      })),
      'lifetools_working_hours_timesheet'
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" /> Date & Time Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Working Hours Tracker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Log daily timesheets, monitor breaks and overtime, estimate wages, and export timesheet data.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Hours Logged</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {totalHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Overtime (&gt; 8h/day)</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {totalOvertime.toFixed(1)} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Estimated Earnings</span>
            <input
              type="text"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-8 text-center text-xs border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
              title="Currency symbol"
            />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {currency} {estimatedPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Manual Entry + Punch In Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Log Working Shift
            </h2>
            <p className="text-xs text-slate-500">Enter your hours manually or punch in live.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePunchToggle}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors shadow-sm ${
                isPunchedIn
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              {isPunchedIn ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPunchedIn ? `Punched In (${punchStartTime}) - Punch Out` : 'Punch In Now'}
            </button>
          </div>
        </div>

        <form onSubmit={handleAddLog} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Start Time
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              End Time
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Break (Minutes)
            </label>
            <input
              type="number"
              min={0}
              value={breakMinutes}
              onChange={e => setBreakMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Project / Activity
            </label>
            <input
              type="text"
              value={project}
              onChange={e => setProject(e.target.value)}
              placeholder="e.g. Client Design"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Hourly Rate ({currency})
            </label>
            <input
              type="number"
              min={0}
              value={hourlyRate || ''}
              onChange={e => setHourlyRate(Number(e.target.value))}
              placeholder="Optional rate"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add to Timesheet ({calculateNetHours(startTime, endTime, breakMinutes)} hrs)
            </button>
          </div>
        </form>
      </div>

      {/* Timesheet Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Work Log History ({logs.length})
          </h3>
          {logs.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                onClick={() => setLogs([])}
                className="text-xs text-rose-500 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No shifts recorded yet. Use the form above to add your first entry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Working Time</th>
                  <th className="p-3">Break</th>
                  <th className="p-3">Net Hours</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">
                      {log.project}
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {log.startTime} – {log.endTime}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {log.breakMinutes} min
                    </td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                      {log.netHours} hrs
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
