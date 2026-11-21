import React, { useState, useEffect } from 'react';
import {
  Cake,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';

interface Birthday {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
}

const STORAGE_KEY = 'lifetools_birthdays';

const DEFAULT_BIRTHDAYS: Birthday[] = [];

export const BirthdayCountdown: React.FC = () => {
  const { showToast } = useToast();
  const [birthdays, setBirthdays] = useState<Birthday[]>(() => {
    return storage.get<Birthday[]>(STORAGE_KEY, DEFAULT_BIRTHDAYS);
  });

  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    storage.set(STORAGE_KEY, birthdays);
  }, [birthdays]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast('Enter person name', 'warning');
      return;
    }
    if (!newDate) {
      showToast('Select birth date', 'warning');
      return;
    }

    const item: Birthday = {
      id: 'bday_' + Date.now(),
      name: newName.trim(),
      birthDate: newDate
    };

    setBirthdays(prev => [...prev, item]);
    setNewName('');
    setNewDate('');
    showToast('Birthday added to countdown!');
  };

  const handleDelete = (id: string) => {
    setBirthdays(prev => prev.filter(b => b.id !== id));
  };

  const calculateCountdown = (birthDateStr: string) => {
    const bDate = new Date(birthDateStr);
    if (isNaN(bDate.getTime())) return null;

    let nextBirthday = new Date(now.getFullYear(), bDate.getMonth(), bDate.getDate(), 0, 0, 0);
    if (nextBirthday.getTime() < now.getTime()) {
      nextBirthday = new Date(now.getFullYear() + 1, bDate.getMonth(), bDate.getDate(), 0, 0, 0);
    }

    const diff = nextBirthday.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const turningAge = nextBirthday.getFullYear() - bDate.getFullYear();

    return { days, hours, minutes, seconds, turningAge };
  };

  return (
    <div className="space-y-6">
      {/* Add Birthday Form */}
      <form onSubmit={handleAdd} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="Person's name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input-base text-xs flex-1"
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="input-base text-xs sm:w-44 font-mono"
        />
        <button type="submit" className="btn-primary text-xs py-2 px-4 shrink-0 w-full sm:w-auto">
          <Plus className="w-3.5 h-3.5" /> Add Birthday
        </button>
      </form>

      {/* Birthday Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {birthdays.map(b => {
          const cd = calculateCountdown(b.birthDate);
          if (!cd) return null;

          return (
            <div
              key={b.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Cake className="w-4 h-4 text-rose-500" /> {b.name}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Born: {new Date(b.birthDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} • Turning <strong className="text-emerald-600 dark:text-emerald-400">{cd.turningAge}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{cd.days}</div>
                  <div className="text-[10px] uppercase font-sans text-slate-400 font-bold mt-1">Days</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{cd.hours}</div>
                  <div className="text-[10px] uppercase font-sans text-slate-400 font-bold mt-1">Hours</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{cd.minutes}</div>
                  <div className="text-[10px] uppercase font-sans text-slate-400 font-bold mt-1">Mins</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-2xl font-black text-emerald-500">{cd.seconds}</div>
                  <div className="text-[10px] uppercase font-sans text-slate-400 font-bold mt-1">Secs</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
