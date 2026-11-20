import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  DateFormatPreference,
  TimeFormatPreference,
  NumberFormatPreference,
  CurrencyPreference,
  FirstDayOfWeek
} from '../../types/settings';
import { formatDate, formatTime, formatNumber, formatCurrency, CURRENCY_SYMBOLS } from '../../utils/i18n';
import { Globe, Calendar, Clock, DollarSign, Hash, Sparkles } from 'lucide-react';

export const LanguageRegionSection: React.FC = () => {
  const { settings, updateLanguageAndRegion } = useSettings();
  const { language, dateFormat, timeFormat, numberFormat, currency, firstDayOfWeek } =
    settings.languageAndRegion;

  const now = new Date();
  const sampleAmount = 149500.5;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-emerald-500" />
          Language & Region
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure regional localization, date conventions, time formats, and financial currency displays.
        </p>
      </div>

      {/* Live Preview Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Live Formatting Preview
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Formatted Date</span>
            <span className="font-semibold text-slate-900 dark:text-white text-sm font-mono">
              {formatDate(now, dateFormat)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Formatted Time</span>
            <span className="font-semibold text-slate-900 dark:text-white text-sm font-mono">
              {formatTime(now, timeFormat)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Formatted Currency</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
              {formatCurrency(sampleAmount, currency, numberFormat)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Week Starts On</span>
            <span className="font-semibold text-slate-900 dark:text-white text-sm capitalize">
              {firstDayOfWeek}
            </span>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">
              Application Language
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The primary display language for navigation, headers, and tool instructions.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
            i18n Ready
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">🇬🇧</span>
              <div>
                <span className="text-sm font-medium block">English (United States / Global)</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Fully Translated (Active)</span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 text-slate-400 dark:text-slate-500 flex items-center justify-between opacity-80">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌐</span>
              <div>
                <span className="text-sm font-medium block">Additional Languages</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Community translation packs in development</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-500">
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      {/* Date & Time Conventions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Format */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Calendar Date Format
            </label>
          </div>
          <div className="space-y-2">
            {[
              { id: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 19/11/2026)', desc: 'India, UK, Europe' },
              { id: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-11-19)', desc: 'ISO 8601 Standard' },
              { id: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 11/19/2026)', desc: 'United States' },
              { id: 'D MMM YYYY', label: 'D MMM YYYY (e.g. 19 Nov 2026)', desc: 'Written Format' }
            ].map((fmt) => (
              <label
                key={fmt.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  dateFormat === fmt.id
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">{fmt.label}</span>
                  <span className="text-[10px] text-slate-400">{fmt.desc}</span>
                </div>
                <input
                  type="radio"
                  name="dateFormat"
                  checked={dateFormat === fmt.id}
                  onChange={() => updateLanguageAndRegion({ dateFormat: fmt.id as DateFormatPreference })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Time Format */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Clock & Time Format
            </label>
          </div>
          <div className="space-y-2">
            {[
              { id: '12h', label: '12-Hour Clock (e.g. 02:30 PM)', desc: 'Standard civilian time with AM/PM' },
              { id: '24h', label: '24-Hour Clock (e.g. 14:30)', desc: 'Military / International standard' }
            ].map((fmt) => (
              <label
                key={fmt.id}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  timeFormat === fmt.id
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold block">{fmt.label}</span>
                  <span className="text-[10px] text-slate-400">{fmt.desc}</span>
                </div>
                <input
                  type="radio"
                  name="timeFormat"
                  checked={timeFormat === fmt.id}
                  onChange={() => updateLanguageAndRegion({ timeFormat: fmt.id as TimeFormatPreference })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              First Day of the Week
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['monday', 'sunday'] as FirstDayOfWeek[]).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => updateLanguageAndRegion({ firstDayOfWeek: day })}
                  className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                    firstDayOfWeek === day
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Currency & Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency Preference */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Default Financial Currency
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Used across My Expenses, budget calculators, EMI planners, and financial tools.
          </p>

          <select
            value={currency}
            onChange={(e) => updateLanguageAndRegion({ currency: e.target.value as CurrencyPreference })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="INR">₹ INR (Indian Rupee) — Default</option>
            <option value="USD">$ USD (US Dollar)</option>
            <option value="EUR">€ EUR (Euro)</option>
            <option value="GBP">£ GBP (British Pound)</option>
            <option value="JPY">¥ JPY (Japanese Yen)</option>
            <option value="CAD">CA$ CAD (Canadian Dollar)</option>
            <option value="AUD">AU$ AUD (Australian Dollar)</option>
          </select>
        </div>

        {/* Number Formatting */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Number Grouping Style
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose delimiter rules for large numbers and monetary quantities.
          </p>

          <select
            value={numberFormat}
            onChange={(e) => updateLanguageAndRegion({ numberFormat: e.target.value as NumberFormatPreference })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="standard">Standard Western (1,234,567.89)</option>
            <option value="indian">Indian Lakhs/Crores (12,34,567.89)</option>
            <option value="spaces">Space Delimited (1 234 567.89)</option>
            <option value="compact">Compact Shorthand (1.2M)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
