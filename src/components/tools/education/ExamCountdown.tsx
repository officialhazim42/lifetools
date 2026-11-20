import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, Clock, MapPin, CheckCircle, Circle } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface ExamItem {
  id: string;
  subject: string;
  dateTime: string; // ISO string YYYY-MM-DDTHH:mm
  venue: string;
  syllabusCovered: boolean;
  notes?: string;
}

const STORAGE_KEY = 'lifetools_exam_countdown';

const DEFAULT_EXAMS: ExamItem[] = [
  {
    id: '1',
    subject: 'Computer Architecture & Systems',
    dateTime: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 16),
    venue: 'Hall 302, Science Block',
    syllabusCovered: true,
    notes: 'Focus on pipelining and cache coherence.'
  },
  {
    id: '2',
    subject: 'Software Engineering Principles',
    dateTime: new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 16),
    venue: 'Auditorium B',
    syllabusCovered: false,
    notes: 'Design patterns and Agile scrum questions.'
  }
];

export const ExamCountdown: React.FC = () => {
  const [exams, setExams] = useState<ExamItem[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_EXAMS);
  });
  const [now, setNow] = useState<Date>(new Date());

  const [subject, setSubject] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, exams);
  }, [exams]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !dateTime) return;

    const newExam: ExamItem = {
      id: 'exam_' + Date.now(),
      subject: subject.trim(),
      dateTime,
      venue: venue.trim() || 'Main Exam Hall',
      syllabusCovered: false,
      notes: notes.trim()
    };

    setExams(prev =>
      [...prev, newExam].sort(
        (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
      )
    );

    setSubject('');
    setDateTime('');
    setVenue('');
    setNotes('');
  };

  const toggleSyllabus = (id: string) => {
    setExams(prev =>
      prev.map(e => (e.id === id ? { ...e, syllabusCovered: !e.syllabusCovered } : e))
    );
  };

  const handleDelete = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  const getRemainingTime = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const diff = target - now.getTime();
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const seconds = Math.floor((absDiff / 1000) % 60);
    const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
    const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds, isPast };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Exam Countdown
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Keep track of your exam timetable, syllabus readiness, and live countdowns for finals and midterms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-500" /> Schedule Exam
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Subject / Paper Title *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Organic Chemistry"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Exam Venue / Room
              </label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Hall 401, North Wing"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Prep Notes / Chapters
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Key formulas or revision chapters..."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Exam
            </button>
          </form>
        </div>

        {/* Exams List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Scheduled Exams ({exams.length})
            </h2>
            {exams.length > 0 && (
              <button
                onClick={() => setExams([])}
                className="text-xs text-rose-500 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {exams.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No exams on your calendar.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Schedule your papers above to track live countdown clocks.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {exams.map(exam => {
                const rem = getRemainingTime(exam.dateTime);
                const d = new Date(exam.dateTime);

                return (
                  <div
                    key={exam.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative transition-all hover:border-cyan-500/40"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <button
                            onClick={() => toggleSyllabus(exam.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                          >
                            {exam.syllabusCovered ? (
                              <span className="bg-emerald-500/10 text-emerald-500 flex items-center gap-1 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" /> Syllabus Prepared
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-500 flex items-center gap-1 px-2 py-0.5 rounded-full">
                                <Circle className="w-3.5 h-3.5" /> In Progress
                              </span>
                            )}
                          </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {exam.subject}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {d.toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}{' '}
                            at {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {exam.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {exam.venue}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Countdown Digits */}
                    <div className="grid grid-cols-4 gap-2 text-center my-3">
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {rem.days}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Days</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {String(rem.hours).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Hours</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {String(rem.minutes).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Mins</div>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="text-xl sm:text-2xl font-black text-cyan-500 font-mono">
                          {String(rem.seconds).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Secs</div>
                      </div>
                    </div>

                    {exam.notes && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        {exam.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
