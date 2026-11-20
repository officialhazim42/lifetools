import React, { useState, useEffect } from 'react';
import { safeStorage, exportToCsv } from '../../../utils/storage';
import {
  Wifi,
  Download,
  AlertTriangle,
  CheckCircle2,
  Tv,
  Video,
  Smartphone,
  Music,
  Gamepad2,
  Globe,
  HardDrive
} from 'lucide-react';

interface ActivityItem {
  id: string;
  name: string;
  rateGbPerHour: number;
  hoursPerDay: number;
  category: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  { id: '1', name: '4K Ultra HD Streaming (Netflix, Prime)', rateGbPerHour: 7.0, hoursPerDay: 1, category: 'video' },
  { id: '2', name: '1080p Full HD Streaming (YouTube, Disney+)', rateGbPerHour: 2.5, hoursPerDay: 2, category: 'video' },
  { id: '3', name: '720p HD Streaming', rateGbPerHour: 1.0, hoursPerDay: 0, category: 'video' },
  { id: '4', name: 'HD Video Meetings (Zoom, Google Meet, Teams)', rateGbPerHour: 1.5, hoursPerDay: 2, category: 'work' },
  { id: '5', name: 'Instagram Reels / TikTok / Shorts', rateGbPerHour: 1.2, hoursPerDay: 1.5, category: 'social' },
  { id: '6', name: 'Music & Podcasts Streaming (Spotify, Apple)', rateGbPerHour: 0.15, hoursPerDay: 3, category: 'music' },
  { id: '7', name: 'Online Gaming (Multiplayer)', rateGbPerHour: 0.15, hoursPerDay: 1, category: 'gaming' },
  { id: '8', name: 'General Web Browsing & Social Feeds', rateGbPerHour: 0.1, hoursPerDay: 3, category: 'web' },
];

export const InternetDataUsageCalculator: React.FC = () => {
  const [planType, setPlanType] = useState<'daily' | 'monthly'>(() => {
    return safeStorage.getItem<'daily' | 'monthly'>('net_plan_type', 'daily');
  });
  const [quotaLimit, setQuotaLimit] = useState<number>(() => {
    return safeStorage.getItem<number>('net_quota_limit', 2.0); // 2 GB/day or 100 GB/month
  });
  const [monthlyDownloadsGb, setMonthlyDownloadsGb] = useState<number>(() => {
    return safeStorage.getItem<number>('net_monthly_dl', 15);
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    return safeStorage.getItem<ActivityItem[]>('net_activities', DEFAULT_ACTIVITIES);
  });

  useEffect(() => {
    safeStorage.setItem('net_plan_type', planType);
    safeStorage.setItem('net_quota_limit', quotaLimit);
    safeStorage.setItem('net_monthly_dl', monthlyDownloadsGb);
    safeStorage.setItem('net_activities', activities);
  }, [planType, quotaLimit, monthlyDownloadsGb, activities]);

  const handleUpdateHours = (id: string, hours: number) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, hoursPerDay: Math.max(0, hours) } : a))
    );
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all activities to typical average daily usage?')) {
      setActivities(DEFAULT_ACTIVITIES);
      setPlanType('daily');
      setQuotaLimit(2.0);
      setMonthlyDownloadsGb(15);
    }
  };

  // Daily usage calculations
  const dailyStreamingGb = activities.reduce(
    (sum, a) => sum + a.rateGbPerHour * a.hoursPerDay,
    0
  );
  const monthlyStreamingGb = dailyStreamingGb * 30;
  const totalMonthlyGb = monthlyStreamingGb + monthlyDownloadsGb;
  const effectiveDailyTotalGb = dailyStreamingGb + monthlyDownloadsGb / 30;

  // Plan limit comparisons
  let isOverLimit = false;
  let usageRatio = 0;

  if (planType === 'daily') {
    usageRatio = quotaLimit > 0 ? (dailyStreamingGb / quotaLimit) * 100 : 0;
    isOverLimit = dailyStreamingGb > quotaLimit;
  } else {
    usageRatio = quotaLimit > 0 ? (totalMonthlyGb / quotaLimit) * 100 : 0;
    isOverLimit = totalMonthlyGb > quotaLimit;
  }

  const handleExportCsv = () => {
    const data = [
      ['Activity', 'Rate (GB/Hour)', 'Hours / Day', 'Daily Usage (GB)', 'Monthly Usage (GB)'],
      ...activities.map((a) => {
        const d = a.rateGbPerHour * a.hoursPerDay;
        return [a.name, String(a.rateGbPerHour), String(a.hoursPerDay), d.toFixed(2), (d * 30).toFixed(1)];
      }),
      ['Large Downloads / Game Updates', '-', '-', (monthlyDownloadsGb / 30).toFixed(2), String(monthlyDownloadsGb)],
      ['TOTAL ESTIMATED USAGE', '-', '-', effectiveDailyTotalGb.toFixed(2), totalMonthlyGb.toFixed(1)]
    ];
    exportToCsv(data, 'internet-data-usage-breakdown');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wifi className="w-8 h-8 text-blue-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Internet Data Usage Calculator</h1>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Estimate mobile data and home broadband bandwidth consumption and prevent overage caps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Plan Limits Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Your Internet Plan Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setPlanType('daily');
                if (quotaLimit > 20) setQuotaLimit(2.0);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                planType === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Daily Mobile Plan
            </button>
            <button
              onClick={() => {
                setPlanType('monthly');
                if (quotaLimit < 10) setQuotaLimit(150);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                planType === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Monthly Broadband
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Data Limit ({planType === 'daily' ? 'GB per Day' : 'GB per Month'})
          </label>
          <input
            type="number"
            step="0.5"
            value={quotaLimit}
            onChange={(e) => setQuotaLimit(Math.max(0.1, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            OS & Game Downloads (GB/month)
          </label>
          <input
            type="number"
            value={monthlyDownloadsGb}
            onChange={(e) => setMonthlyDownloadsGb(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
      </div>

      {/* KPI Usage Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Daily Streaming Usage</div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {dailyStreamingGb.toFixed(2)} <span className="text-xs font-normal text-slate-400">GB</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active hours today</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Monthly Projected</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Math.round(totalMonthlyGb)} <span className="text-xs font-normal text-slate-400">GB</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Streaming + Downloads</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Plan Quota Used</div>
          <div
            className={`text-2xl font-bold ${
              isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {Math.round(usageRatio)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isOverLimit ? 'Exceeded data quota!' : 'Within data plan'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="text-xs text-slate-500 mb-1">Plan Recommendation</div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {totalMonthlyGb > 500
              ? 'Unlimited Fiber'
              : totalMonthlyGb > 200
              ? '300GB+ Fiber'
              : dailyStreamingGb > 2.5
              ? '3GB/day Mobile'
              : '2GB/day Mobile'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Based on your activity</div>
        </div>
      </div>

      {/* Utilization Progress Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
          <span>
            {planType === 'daily'
              ? `Daily Quota: ${dailyStreamingGb.toFixed(2)} GB of ${quotaLimit} GB`
              : `Monthly Quota: ${Math.round(totalMonthlyGb)} GB of ${quotaLimit} GB`}
          </span>
          <span className={isOverLimit ? 'text-red-500 font-bold' : ''}>
            {Math.round(usageRatio)}%
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOverLimit
                ? 'bg-red-500'
                : usageRatio > 80
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, usageRatio)}%` }}
          />
        </div>
      </div>

      {/* Activity Sliders & Controls */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
            Daily Activities (Hours / Day)
          </h3>
          <button
            onClick={handleResetDefaults}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700/60">
          {activities.map((act) => {
            const dailyGb = act.rateGbPerHour * act.hoursPerDay;
            const monthlyGb = dailyGb * 30;

            return (
              <div key={act.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="sm:w-1/2">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {act.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Consumes ~{act.rateGbPerHour} GB / hour
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:w-1/2 justify-end">
                  <div className="flex-1 max-w-[180px]">
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      value={act.hoursPerDay}
                      onChange={(e) => handleUpdateHours(act.id, parseFloat(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="w-16 text-right font-medium text-xs text-slate-700 dark:text-slate-300">
                    {act.hoursPerDay} hrs
                  </div>

                  <div className="w-24 text-right">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {dailyGb.toFixed(2)} GB
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {monthlyGb.toFixed(0)} GB/mo
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
