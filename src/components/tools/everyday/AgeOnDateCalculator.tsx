import React, { useState, useEffect } from 'react';
import { safeStorage } from '../../../utils/storage';
import {
  Calendar,
  Clock,
  Sparkles,
  Cake,
  Gift,
  Award,
  Heart,
  Star,
  Hourglass
} from 'lucide-react';

interface Milestone {
  label: string;
  date: string;
  reached: boolean;
}

export const AgeOnDateCalculator: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [dob, setDob] = useState<string>(() => {
    return safeStorage.getItem<string>('age_calc_dob', '2000-01-01');
  });

  const [targetDate, setTargetDate] = useState<string>(todayStr);

  useEffect(() => {
    safeStorage.setItem('age_calc_dob', dob);
  }, [dob]);

  // Chronological Age Calculation
  const birthDate = new Date(dob + 'T00:00:00');
  const asOfDate = new Date(targetDate + 'T00:00:00');

  const isValidDates = !isNaN(birthDate.getTime()) && !isNaN(asOfDate.getTime());
  const isTargetAfterBirth = asOfDate >= birthDate;

  let years = 0;
  let months = 0;
  let days = 0;

  if (isValidDates && isTargetAfterBirth) {
    let y = asOfDate.getFullYear() - birthDate.getFullYear();
    let m = asOfDate.getMonth() - birthDate.getMonth();
    let d = asOfDate.getDate() - birthDate.getDate();

    if (d < 0) {
      m -= 1;
      // days in previous month of target
      const prevMonthLastDay = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0).getDate();
      d += prevMonthLastDay;
    }

    if (m < 0) {
      y -= 1;
      m += 12;
    }

    years = y;
    months = m;
    days = d;
  }

  // Duration in raw units
  const diffTimeMs = isValidDates && isTargetAfterBirth ? asOfDate.getTime() - birthDate.getTime() : 0;
  const totalDays = Math.floor(diffTimeMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDaysAfterWeeks = totalDays % 7;
  const totalMonthsApprox = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;
  const totalSeconds = totalMinutes * 60;

  // Day names
  const birthDayName = isValidDates ? birthDate.toLocaleDateString([], { weekday: 'long' }) : '';
  const targetDayName = isValidDates ? asOfDate.toLocaleDateString([], { weekday: 'long' }) : '';

  // Zodiac Sign Finder
  const getZodiac = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-12

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' };
    return { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' };
  };

  const zodiac = isValidDates ? getZodiac(birthDate) : null;

  // Next Birthday relative to target date
  let nextBdayStr = '';
  let daysToNextBday = 0;
  let nextBdayDayOfWeek = '';

  if (isValidDates) {
    let nextBdayYear = asOfDate.getFullYear();
    let nextBday = new Date(nextBdayYear, birthDate.getMonth(), birthDate.getDate());

    if (nextBday < asOfDate) {
      nextBday = new Date(nextBdayYear + 1, birthDate.getMonth(), birthDate.getDate());
    }

    nextBdayStr = nextBday.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
    nextBdayDayOfWeek = nextBday.toLocaleDateString([], { weekday: 'long' });
    daysToNextBday = Math.ceil((nextBday.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Milestones
  const milestones: Milestone[] = isValidDates ? [
    { label: '1,000 Days Lived', date: new Date(birthDate.getTime() + 1000 * 86400000).toISOString().split('T')[0], reached: totalDays >= 1000 },
    { label: '5,000 Days Lived', date: new Date(birthDate.getTime() + 5000 * 86400000).toISOString().split('T')[0], reached: totalDays >= 5000 },
    { label: '10,000 Days Lived', date: new Date(birthDate.getTime() + 10000 * 86400000).toISOString().split('T')[0], reached: totalDays >= 10000 },
    { label: '15,000 Days Lived', date: new Date(birthDate.getTime() + 15000 * 86400000).toISOString().split('T')[0], reached: totalDays >= 15000 },
    { label: '18th Birthday (Adulthood)', date: new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate()).toISOString().split('T')[0], reached: years >= 18 },
    { label: '21st Birthday', date: new Date(birthDate.getFullYear() + 21, birthDate.getMonth(), birthDate.getDate()).toISOString().split('T')[0], reached: years >= 21 },
    { label: '30th Milestone Birthday', date: new Date(birthDate.getFullYear() + 30, birthDate.getMonth(), birthDate.getDate()).toISOString().split('T')[0], reached: years >= 30 },
    { label: '50th Golden Jubilee', date: new Date(birthDate.getFullYear() + 50, birthDate.getMonth(), birthDate.getDate()).toISOString().split('T')[0], reached: years >= 50 },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cake className="w-8 h-8 text-pink-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Age on Specific Date Calculator</h1>
          </div>
          <p className="text-pink-100 text-sm mt-1">
            Calculate your exact chronological age in years, months, days, hours, and find upcoming milestones.
          </p>
        </div>
      </div>

      {/* Date Pickers */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
            />
          </div>
          {birthDayName && (
            <span className="text-[11px] text-slate-400 mt-1 block">
              Born on a {birthDayName}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
              Age As Of (Target Date)
            </label>
            <button
              onClick={() => setTargetDate(todayStr)}
              className="text-[11px] text-rose-500 hover:underline"
            >
              Reset to Today
            </button>
          </div>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white font-medium"
            />
          </div>
          {targetDayName && (
            <span className="text-[11px] text-slate-400 mt-1 block">
              Target date falls on a {targetDayName}
            </span>
          )}
        </div>
      </div>

      {/* Validation Message */}
      {!isTargetAfterBirth && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-sm">
          Please select a target date that is on or after the date of birth.
        </div>
      )}

      {/* Primary Age Result Banner */}
      {isTargetAfterBirth && (
        <>
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-rose-200/80 dark:border-slate-700 shadow-sm text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
              Exact Age on {targetDate}
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white flex flex-wrap items-center justify-center gap-2">
              <span className="text-rose-600 dark:text-rose-400">{years}</span> Years,
              <span className="text-rose-600 dark:text-rose-400">{months}</span> Months,
              <span className="text-rose-600 dark:text-rose-400">{days}</span> Days
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              or approximately {totalMonthsApprox} months and {days} days
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Total Days</div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {totalDays.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Days lived</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Total Weeks</div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                {totalWeeks.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">+{remainingDaysAfterWeeks} days</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Total Hours</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {totalHours.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Hours passed</div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
              <div className="text-xs text-slate-500 mb-1">Total Minutes</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalMinutes.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Minutes lived</div>
            </div>
          </div>

          {/* Next Birthday & Zodiac */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold">
                  Next Birthday Countdown
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  {daysToNextBday === 0 ? '🎉 Happy Birthday Today!' : `${daysToNextBday} Days Left`}
                </div>
                <div className="text-xs text-slate-500">
                  {nextBdayStr} ({nextBdayDayOfWeek})
                </div>
              </div>
            </div>

            {zodiac && (
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0">
                  {zodiac.symbol}
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase font-semibold">
                    Astrological Sun Sign
                  </div>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {zodiac.name} {zodiac.symbol}
                  </div>
                  <div className="text-xs text-slate-500">{zodiac.dates}</div>
                </div>
              </div>
            )}
          </div>

          {/* Life Milestones Table */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Key Life Milestones Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    m.reached
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{m.date}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        m.reached
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {m.reached ? 'Reached' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
