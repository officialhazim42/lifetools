import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Printer, RotateCcw } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface TimetableSlot {
  id: string;
  day: string; // 'Monday' | 'Tuesday' etc.
  time: string; // '09:00 - 10:00'
  subject: string;
  room?: string;
  teacher?: string;
  color?: string;
}

const STORAGE_KEY = 'lifetools_class_timetable';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMES = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00'
];

const COLORS = [
  'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
  'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
  'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
  'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
  'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
  'bg-cyan-500/10 border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
];

const DEFAULT_SLOTS: TimetableSlot[] = [
  { id: '1', day: 'Monday', time: '09:00 - 10:00', subject: 'Data Structures', room: 'Hall 101', color: COLORS[0] },
  { id: '2', day: 'Monday', time: '10:00 - 11:00', subject: 'Database Systems', room: 'Lab 2', color: COLORS[1] },
  { id: '3', day: 'Tuesday', time: '09:00 - 10:00', subject: 'Computer Networks', room: 'Hall 204', color: COLORS[2] },
  { id: '4', day: 'Wednesday', time: '11:15 - 12:15', subject: 'Operating Systems', room: 'Hall 101', color: COLORS[3] },
  { id: '5', day: 'Thursday', time: '02:00 - 03:00', subject: 'Software Eng.', room: 'Hall 305', color: COLORS[4] },
  { id: '6', day: 'Friday', time: '10:00 - 11:00', subject: 'Discrete Math', room: 'Hall 102', color: COLORS[5] }
];

export const TimetableGenerator: React.FC = () => {
  const [slots, setSlots] = useState<TimetableSlot[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_SLOTS);
  });

  const [activeDay, setActiveDay] = useState('Monday');
  const [activeTime, setActiveTime] = useState(TIMES[0]);
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [teacher, setTeacher] = useState('');
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, slots);
  }, [slots]);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    // Remove existing slot at same day and time
    const filtered = slots.filter(s => !(s.day === activeDay && s.time === activeTime));

    const newSlot: TimetableSlot = {
      id: 'slot_' + Date.now(),
      day: activeDay,
      time: activeTime,
      subject: subject.trim(),
      room: room.trim(),
      teacher: teacher.trim(),
      color: COLORS[colorIndex % COLORS.length]
    };

    setSlots([...filtered, newSlot]);
    setSubject('');
    setRoom('');
    setTeacher('');
  };

  const handleRemoveSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Timetable Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Create, customize, and print clean weekly lecture schedules and class timetables.
        </p>
      </div>

      {/* Add Slot Drawer */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-500" /> Assign Class to Timetable
          </h2>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print Timetable
          </button>
        </div>

        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Day</label>
            <select
              value={activeDay}
              onChange={e => setActiveDay(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {DAYS.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Time Slot</label>
            <select
              value={activeTime}
              onChange={e => setActiveTime(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {TIMES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Room / Lab</label>
            <input
              type="text"
              value={room}
              onChange={e => setRoom(e.target.value)}
              placeholder="e.g. Room 204"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Instructor</label>
            <input
              type="text"
              value={teacher}
              onChange={e => setTeacher(e.target.value)}
              placeholder="e.g. Dr. Smith"
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Save Slot
            </button>
          </div>
        </form>
      </div>

      {/* Timetable Grid View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Weekly Class Schedule
          </h3>
          <button
            onClick={() => setSlots([])}
            className="text-xs text-rose-500 hover:underline"
          >
            Clear Grid
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                <th className="p-3 text-left font-bold text-slate-500 w-28">Time Slot</th>
                {DAYS.map(day => (
                  <th key={day} className="p-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TIMES.map(time => (
                <tr key={time} className="hover:bg-slate-50/30">
                  <td className="p-3 font-mono font-medium text-slate-500 whitespace-nowrap bg-slate-50/50 dark:bg-slate-800/30">
                    {time}
                  </td>
                  {DAYS.map(day => {
                    const slot = slots.find(s => s.day === day && s.time === time);
                    return (
                      <td key={day} className="p-2 text-center align-top min-w-[120px]">
                        {slot ? (
                          <div className={`p-2 rounded-xl border relative group transition-all ${slot.color || COLORS[0]}`}>
                            <div className="font-bold text-xs">{slot.subject}</div>
                            {slot.room && <div className="text-[10px] opacity-80">{slot.room}</div>}
                            {slot.teacher && <div className="text-[10px] opacity-75">{slot.teacher}</div>}
                            <button
                              onClick={() => handleRemoveSlot(slot.id)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-500 transition-opacity"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="h-10 border border-dashed border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-center text-slate-300 dark:text-slate-700 text-[10px]">
                            Free
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
