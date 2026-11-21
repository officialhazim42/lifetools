import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Clock,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

interface ClockCity {
  id: string;
  name: string;
  timeZone: string;
  country: string;
}

const DEFAULT_CITIES: ClockCity[] = [
  { id: 'city_delhi', name: 'New Delhi / Kolkata', timeZone: 'Asia/Kolkata', country: 'India' },
  { id: 'city_london', name: 'London', timeZone: 'Europe/London', country: 'United Kingdom' },
  { id: 'city_ny', name: 'New York', timeZone: 'America/New_York', country: 'United States' },
  { id: 'city_tokyo', name: 'Tokyo', timeZone: 'Asia/Tokyo', country: 'Japan' },
  { id: 'city_dubai', name: 'Dubai', timeZone: 'Asia/Dubai', country: 'United Arab Emirates' },
  { id: 'city_sydney', name: 'Sydney', timeZone: 'Australia/Sydney', country: 'Australia' }
];

const AVAILABLE_ZONES: ClockCity[] = [
  ...DEFAULT_CITIES,
  { id: 'city_paris', name: 'Paris', timeZone: 'Europe/Paris', country: 'France' },
  { id: 'city_berlin', name: 'Berlin', timeZone: 'Europe/Berlin', country: 'Germany' },
  { id: 'city_singapore', name: 'Singapore', timeZone: 'Asia/Singapore', country: 'Singapore' },
  { id: 'city_toronto', name: 'Toronto', timeZone: 'America/Toronto', country: 'Canada' },
  { id: 'city_la', name: 'Los Angeles', timeZone: 'America/Los_Angeles', country: 'United States' },
  { id: 'city_sf', name: 'San Francisco', timeZone: 'America/Los_Angeles', country: 'United States' },
  { id: 'city_chicago', name: 'Chicago', timeZone: 'America/Chicago', country: 'United States' },
  { id: 'city_moscow', name: 'Moscow', timeZone: 'Europe/Moscow', country: 'Russia' },
  { id: 'city_beijing', name: 'Beijing', timeZone: 'Asia/Shanghai', country: 'China' },
  { id: 'city_seoul', name: 'Seoul', timeZone: 'Asia/Seoul', country: 'South Korea' },
  { id: 'city_auckland', name: 'Auckland', timeZone: 'Pacific/Auckland', country: 'New Zealand' },
  { id: 'city_cairo', name: 'Cairo', timeZone: 'Africa/Cairo', country: 'Egypt' },
  { id: 'city_johannesburg', name: 'Johannesburg', timeZone: 'Africa/Johannesburg', country: 'South Africa' },
  { id: 'city_saopaulo', name: 'São Paulo', timeZone: 'America/Sao_Paulo', country: 'Brazil' }
];

const STORAGE_KEY = 'lifetools_world_clock_cities';

export const WorldClock: React.FC = () => {
  const { showToast } = useToast();
  const [cities, setCities] = useState<ClockCity[]>(() => {
    return storage.get<ClockCity[]>(STORAGE_KEY, DEFAULT_CITIES);
  });
  const [now, setNow] = useState(new Date());
  const [use24Hour, setUse24Hour] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('');

  useEffect(() => {
    storage.set(STORAGE_KEY, cities);
  }, [cities]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCity = () => {
    if (!selectedCityId) return;
    const cityToAdd = AVAILABLE_ZONES.find(c => c.id === selectedCityId);
    if (!cityToAdd) return;
    if (cities.some(c => c.timeZone === cityToAdd.timeZone)) {
      showToast('This timezone is already displayed', 'info');
      return;
    }
    setCities(prev => [...prev, cityToAdd]);
    setSelectedCityId('');
    showToast(`Added ${cityToAdd.name}`);
  };

  const handleRemoveCity = (id: string) => {
    setCities(prev => prev.filter(c => c.id !== id));
  };

  // Helper to format time & date for a city timezone
  const getCityTime = (timeZone: string) => {
    try {
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone,
        hour12: !use24Hour,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const dateStr = now.toLocaleDateString('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      // Hour in this timezone to check day/night
      const hourInTz = parseInt(
        now.toLocaleTimeString('en-US', { timeZone, hour12: false, hour: '2-digit' }),
        10
      );
      const isDay = hourInTz >= 6 && hourInTz < 18;

      return { timeStr, dateStr, isDay };
    } catch {
      return { timeStr: '--:--:--', dateStr: 'Invalid TZ', isDay: true };
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-sky-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">World Clock Dashboard</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="input-base text-xs py-1.5 w-48"
          >
            <option value="">+ Add a World City...</option>
            {AVAILABLE_ZONES.filter(z => !cities.some(c => c.timeZone === z.timeZone)).map(z => (
              <option key={z.id} value={z.id}>
                {z.name} ({z.country})
              </option>
            ))}
          </select>

          <button onClick={handleAddCity} disabled={!selectedCityId} className="btn-primary text-xs py-1.5 disabled:opacity-50">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>

          <button
            onClick={() => setUse24Hour(!use24Hour)}
            className="btn-secondary text-xs py-1.5 ml-2"
          >
            {use24Hour ? '24h format' : '12h format'}
          </button>
        </div>
      </div>

      {/* Clock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cities.map(city => {
          const { timeStr, dateStr, isDay } = getCityTime(city.timeZone);

          return (
            <div
              key={city.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {city.name}
                  </h3>
                  <div className="text-xs text-slate-500">{city.country}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`p-1.5 rounded-lg text-xs ${
                      isDay
                        ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/40'
                        : 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40'
                    }`}
                    title={isDay ? 'Daytime' : 'Nighttime'}
                  >
                    {isDay ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </span>

                  {cities.length > 1 && (
                    <button
                      onClick={() => handleRemoveCity(city.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                      title="Remove city"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="my-6">
                <div className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                  {timeStr}
                </div>
                <div className="text-xs text-slate-500 mt-1">{dateStr}</div>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between">
                <span className="truncate">{city.timeZone}</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Live</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
