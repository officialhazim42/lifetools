import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Clock, Copy, Check, Calendar } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface TimezoneCity {
  id: string;
  name: string;
  timezone: string;
  country: string;
}

const POPULAR_ZONES: TimezoneCity[] = [
  { id: 'nyc', name: 'New York (EDT/EST)', timezone: 'America/New_York', country: 'US' },
  { id: 'sfo', name: 'San Francisco (PDT/PST)', timezone: 'America/Los_Angeles', country: 'US' },
  { id: 'lon', name: 'London (GMT/BST)', timezone: 'Europe/London', country: 'UK' },
  { id: 'ber', name: 'Berlin (CET/CEST)', timezone: 'Europe/Berlin', country: 'Germany' },
  { id: 'dxb', name: 'Dubai (GST)', timezone: 'Asia/Dubai', country: 'UAE' },
  { id: 'del', name: 'New Delhi (IST)', timezone: 'Asia/Kolkata', country: 'India' },
  { id: 'sin', name: 'Singapore (SGT)', timezone: 'Asia/Singapore', country: 'Singapore' },
  { id: 'tok', name: 'Tokyo (JST)', timezone: 'Asia/Tokyo', country: 'Japan' },
  { id: 'syd', name: 'Sydney (AEST/AEDT)', timezone: 'Australia/Sydney', country: 'Australia' },
  { id: 'utc', name: 'UTC Universal Time', timezone: 'UTC', country: 'Global' }
];

const STORAGE_KEY = 'lifetools_tz_cities';

export const TimezoneMeetingPlanner: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<TimezoneCity[]>(() => {
    return safeStorage.get(STORAGE_KEY, [
      POPULAR_ZONES[5], // New Delhi
      POPULAR_ZONES[2], // London
      POPULAR_ZONES[0]  // New York
    ]);
  });

  const [baseHour, setBaseHour] = useState<number>(14); // 2:00 PM in reference zone (0th selected city or local)
  const [copied, setCopied] = useState(false);
  const [customZone, setCustomZone] = useState('');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, selectedCities);
  }, [selectedCities]);

  const addCity = (city: TimezoneCity) => {
    if (!selectedCities.some(c => c.timezone === city.timezone)) {
      setSelectedCities(prev => [...prev, city]);
    }
  };

  const removeCity = (id: string) => {
    setSelectedCities(prev => prev.filter(c => c.id !== id));
  };

  const getTimeInZone = (tz: string, hourOffsetFromBase: number = 0) => {
    const d = new Date();
    d.setHours(baseHour + hourOffsetFromBase, 0, 0, 0);

    try {
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(d);

      const hourNumber = parseInt(
        new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: 'numeric',
          hour12: false
        }).format(d),
        10
      );

      return { timeStr, hourNumber };
    } catch {
      return { timeStr: '--:--', hourNumber: 0 };
    }
  };

  // Status: Green (9-17 business hours), Amber (7-9 or 18-21 awake), Red (22-6 night)
  const getHourStatus = (hour: number) => {
    if (hour >= 9 && hour < 18) {
      return { label: 'Working', bg: 'bg-emerald-500 text-white', text: 'text-emerald-600 dark:text-emerald-400' };
    } else if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 22)) {
      return { label: 'Extended', bg: 'bg-amber-500 text-white', text: 'text-amber-600 dark:text-amber-400' };
    }
    return { label: 'Sleep/Off', bg: 'bg-slate-400 text-white', text: 'text-slate-400' };
  };

  const handleCopySchedule = () => {
    const lines = [
      `📅 Proposed Meeting Times:`,
      ...selectedCities.map(c => {
        const { timeStr } = getTimeInZone(c.timezone);
        return `• ${c.name}: ${timeStr}`;
      })
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" /> Date & Time Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Timezone Meeting Planner
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Coordinate global meetings across multiple time zones without confusion or awkward hours.
        </p>
      </div>

      {/* Hour Slider Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Meeting Time Slider
            </h2>
            <p className="text-xs text-slate-500">
              Drag the slider to find a slot that works for everyone.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySchedule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Details!' : 'Copy Meeting Times'}
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
          <input
            type="range"
            min={0}
            max={23}
            value={baseHour}
            onChange={e => setBaseHour(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Working Hours (9 AM – 6 PM)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Extended / Early (7–9 AM, 6–10 PM)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400"></span> Sleep / Late Night
          </div>
        </div>
      </div>

      {/* Selected Timezones Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Selected Locations ({selectedCities.length})
          </h3>
          <span className="text-xs text-slate-500">All calculations performed locally in browser</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {selectedCities.map((c, idx) => {
            const { timeStr, hourNumber } = getTimeInZone(c.timezone);
            const status = getHourStatus(hourNumber);

            return (
              <div key={c.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    {c.country}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-slate-900 dark:text-white">
                      {c.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {c.timezone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                      {timeStr}
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${status.bg}`}>
                      {status.label}
                    </span>
                  </div>

                  {selectedCities.length > 1 && (
                    <button
                      onClick={() => removeCity(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove zone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add More Timezones */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Add Global City / Time Zone
        </h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ZONES.map(city => {
            const isAlreadySelected = selectedCities.some(c => c.timezone === city.timezone);
            return (
              <button
                key={city.id}
                disabled={isAlreadySelected}
                onClick={() => addCity(city)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${
                  isAlreadySelected
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300'
                }`}
              >
                + {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
