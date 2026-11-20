import React, { useState } from 'react';
import { Clock, Calendar, Calculator, Moon, Sun, ArrowRight, Check } from 'lucide-react';

export const ShiftTimeCalculator: React.FC = () => {
  // Mode 1: End Time calculation
  const [startTime, setStartTime] = useState('08:00');
  const [shiftHours, setShiftHours] = useState(8);
  const [shiftMinutes, setShiftMinutes] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(30);

  // Mode 2: Shift Rotation schedule preview
  const [patternDaysOn, setPatternDaysOn] = useState(4);
  const [patternDaysOff, setPatternDaysOff] = useState(4);
  const [patternStartDate, setPatternStartDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Calculate Shift End Time
  const calculateEndTime = () => {
    const [sH, sM] = startTime.split(':').map(Number);
    const totalStartMins = sH * 60 + sM;
    const totalWorkMins = shiftHours * 60 + shiftMinutes;
    const grandTotalMins = totalStartMins + totalWorkMins + breakMinutes;

    const endTotalMins = grandTotalMins % (24 * 60);
    const endH = Math.floor(endTotalMins / 60);
    const endM = endTotalMins % 60;
    const isNextDay = Math.floor(grandTotalMins / (24 * 60)) >= 1;

    const formattedTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    return { formattedTime, isNextDay, totalHours: (totalWorkMins / 60).toFixed(1) };
  };

  const shiftResult = calculateEndTime();

  // Generate 28-day shift schedule preview
  const generateSchedule = () => {
    const totalCycle = patternDaysOn + patternDaysOff;
    if (totalCycle <= 0) return [];

    const schedule = [];
    const start = new Date(patternStartDate);

    for (let i = 0; i < 28; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const cycleIndex = i % totalCycle;
      const isWorking = cycleIndex < patternDaysOn;

      schedule.push({
        date: d,
        dayStr: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        isWorking,
        shiftName: isWorking ? `Day ${cycleIndex + 1}` : 'Off Day'
      });
    }

    return schedule;
  };

  const schedulePreview = generateSchedule();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" /> Date & Time Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Shift Time Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate shift end times, manage unpaid breaks, and plan rotating shift schedules (such as 4-on-4-off).
        </p>
      </div>

      {/* Part 1: Shift End Time Calculator */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Shift End Time & Departure Estimator
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Shift Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Required Hours
            </label>
            <input
              type="number"
              min={1}
              max={24}
              value={shiftHours}
              onChange={e => setShiftHours(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Extra Minutes
            </label>
            <input
              type="number"
              min={0}
              max={59}
              value={shiftMinutes}
              onChange={e => setShiftMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Unpaid Break (Mins)
            </label>
            <input
              type="number"
              min={0}
              max={240}
              value={breakMinutes}
              onChange={e => setBreakMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Result Card */}
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              Calculated Clock-Out Time
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
              {shiftResult.formattedTime}
              {shiftResult.isNextDay && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white font-sans font-medium">
                  +1 Next Day
                </span>
              )}
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 text-center sm:text-right">
            <div><strong>Net Work Hours:</strong> {shiftResult.totalHours} hrs</div>
            <div><strong>Total Break Time:</strong> {breakMinutes} mins</div>
            <div><strong>Shift Window:</strong> {startTime} → {shiftResult.formattedTime}</div>
          </div>
        </div>
      </div>

      {/* Part 2: Shift Rotation Pattern Generator */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Shift Rotation Pattern Planner (4-Week Preview)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pattern Days ON (Work)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={patternDaysOn}
              onChange={e => setPatternDaysOn(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pattern Days OFF (Rest)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={patternDaysOff}
              onChange={e => setPatternDaysOff(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Cycle Start Date
            </label>
            <input
              type="date"
              value={patternStartDate}
              onChange={e => setPatternStartDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* 28-Day Schedule Visual Grid */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Schedule Forecast ({patternDaysOn} On / {patternDaysOff} Off)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {schedulePreview.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center transition-all ${
                  item.isWorking
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[11px] font-medium">{item.dayStr}</div>
                <div className={`text-xs font-bold mt-1 ${item.isWorking ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                  {item.isWorking ? '🏢 ON' : '🌴 OFF'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
