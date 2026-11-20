import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Download, Clock, Star, Calendar } from 'lucide-react';
import { safeStorage, exportToCsv } from '../../../utils/storage';

interface StudySession {
  id: string;
  date: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  focusRating: number; // 1 to 5
  notes?: string;
}

const STORAGE_KEY = 'lifetools_study_sessions';

const DEFAULT_SESSIONS: StudySession[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    subject: 'Computer Networks',
    topic: 'TCP/IP Model & Subnetting',
    durationMinutes: 90,
    focusRating: 5,
    notes: 'Understood CIDR notations and practice subnet questions.'
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    subject: 'Linear Algebra',
    topic: 'Eigenvalues & Matrix Decomposition',
    durationMinutes: 60,
    focusRating: 4,
    notes: 'Solved 8 textbook problem sets.'
  }
];

export const StudySessionTracker: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_SESSIONS);
  });

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [focusRating, setFocusRating] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, sessions);
  }, [sessions]);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const newSession: StudySession = {
      id: 'sess_' + Date.now(),
      date,
      subject: subject.trim(),
      topic: topic.trim(),
      durationMinutes: Math.max(1, durationMinutes),
      focusRating,
      notes: notes.trim()
    };

    setSessions(prev => [newSession, ...prev]);
    setSubject('');
    setTopic('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleExport = () => {
    if (sessions.length === 0) return;
    exportToCsv(
      sessions.map(s => ({
        Date: s.date,
        Subject: s.subject,
        Topic: s.topic,
        'Duration (Minutes)': s.durationMinutes,
        'Focus Rating': `${s.focusRating}/5`,
        Notes: s.notes || ''
      })),
      'lifetools_study_sessions'
    );
  };

  // Stats
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const avgSession = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
  const avgFocus =
    sessions.length > 0
      ? (sessions.reduce((sum, s) => sum + s.focusRating, 0) / sessions.length).toFixed(1)
      : '0.0';

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Study Session Tracker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Log focused study hours, monitor subject dedication, rate session quality, and maintain consistent revision habits.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Time Studied
          </span>
          <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1 font-mono">
            {totalHours} <span className="text-xs font-normal text-slate-400">hours</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {sessions.length} study sessions
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Session
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {avgSession} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Per sitting</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Average Focus
          </span>
          <div className="text-3xl font-extrabold text-amber-500 mt-1 font-mono flex items-center justify-center gap-1">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" /> {avgFocus}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">out of 5.0 stars</span>
        </div>
      </div>

      {/* Add Session Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-500" /> Log New Study Session
        </h2>

        <form onSubmit={handleAddSession} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Subject *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Physics, Law, Biology"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Topic / Chapter
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Thermodynamics Ch 3"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={720}
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Focus & Comprehension Rating
            </label>
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFocusRating(rating)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    rating <= focusRating
                      ? 'text-amber-500'
                      : 'text-slate-300 dark:text-slate-700'
                  }`}
                >
                  <Star className={`w-5 h-5 ${rating <= focusRating ? 'fill-amber-500' : ''}`} />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2">
                {focusRating === 5 && '🌟 Deep Focus / High Retention'}
                {focusRating === 4 && '👍 Solid Comprehension'}
                {focusRating === 3 && '😐 Moderate / Normal'}
                {focusRating <= 2 && '🥱 Distracted / Needs Review'}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Session Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What formulas or concepts need revisiting?"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Save Study Session
            </button>
          </div>
        </form>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Study History ({sessions.length})
          </h3>
          {sessions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button
                onClick={() => setSessions([])}
                className="text-xs text-rose-500 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No study sessions logged yet. Record your learning to track progress.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Subject & Topic</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Focus</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-900 dark:text-white whitespace-nowrap text-xs">
                      {s.date}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{s.subject}</div>
                      {s.topic && <div className="text-xs text-slate-500">{s.topic}</div>}
                    </td>
                    <td className="p-3 font-mono text-cyan-600 dark:text-cyan-400 font-bold whitespace-nowrap">
                      {s.durationMinutes} min
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: s.focusRating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-slate-500 max-w-xs truncate">
                      {s.notes || '--'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
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
