import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Copy,
  Download,
  Plus,
  Trash2,
  Globe
} from 'lucide-react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { storage } from '../../../utils/storage';

interface Participant {
  id: string;
  name: string;
  timeZone: string;
}

const COMMON_TZ = [
  { label: 'India / Srinagar (IST)', tz: 'Asia/Kolkata' },
  { label: 'London (GMT/BST)', tz: 'Europe/London' },
  { label: 'New York (EST/EDT)', tz: 'America/New_York' },
  { label: 'San Francisco (PST/PDT)', tz: 'America/Los_Angeles' },
  { label: 'Dubai (GST)', tz: 'Asia/Dubai' },
  { label: 'Tokyo (JST)', tz: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', tz: 'Australia/Sydney' },
  { label: 'UTC', tz: 'UTC' }
];

export const MeetingPlanner: React.FC = () => {
  const { showToast } = useToast();
  const [meetingTitle, setMeetingTitle] = useState('Sprint Planning & Product Review');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:30');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [baseTimezone, setBaseTimezone] = useState('Asia/Kolkata');
  const [agenda, setAgenda] = useState('1. Review milestones\n2. Blockers and risks\n3. Next actions and owners');

  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'p1', name: 'Organizer', timeZone: 'Asia/Kolkata' },
    { id: 'p2', name: 'Design Lead (UK)', timeZone: 'Europe/London' },
    { id: 'p3', name: 'Engineering (US East)', timeZone: 'America/New_York' }
  ]);

  const [newName, setNewName] = useState('');
  const [newTz, setNewTz] = useState('Europe/London');

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setParticipants(prev => [
      ...prev,
      { id: 'p_' + Date.now(), name: newName.trim(), timeZone: newTz }
    ]);
    setNewName('');
    showToast('Participant added');
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  // Calculate meeting times in each participant's timezone
  const getMeetingTimes = () => {
    try {
      const dt = new Date(`${date}T${time}:00`);
      if (isNaN(dt.getTime())) return [];

      return participants.map(p => {
        const pTime = dt.toLocaleTimeString('en-US', {
          timeZone: p.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        const pDate = dt.toLocaleDateString('en-US', {
          timeZone: p.timeZone,
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
        return {
          ...p,
          localTime: pTime,
          localDate: pDate
        };
      });
    } catch {
      return [];
    }
  };

  const times = getMeetingTimes();

  const handleCopySummary = () => {
    const lines = [
      `📅 Meeting: ${meetingTitle}`,
      `⏰ Duration: ${durationMinutes} minutes`,
      '',
      '🌐 Worldwide Local Times:'
    ];
    times.forEach(t => {
      lines.push(`• ${t.name} (${t.timeZone}): ${t.localDate} at ${t.localTime}`);
    });
    if (agenda.trim()) {
      lines.push('');
      lines.push('📝 Agenda:');
      lines.push(agenda);
    }
    copyToClipboard(lines.join('\n'));
    showToast('Meeting summary copied to clipboard!');
  };

  const handleDownloadIcs = () => {
    try {
      const startDt = new Date(`${date}T${time}:00`);
      const endDt = new Date(startDt.getTime() + durationMinutes * 60000);

      const toIcsDate = (d: Date) =>
        d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//LifeTools//Meeting Planner//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@lifetools.app`,
        `DTSTAMP:${toIcsDate(new Date())}`,
        `DTSTART:${toIcsDate(startDt)}`,
        `DTEND:${toIcsDate(endDt)}`,
        `SUMMARY:${meetingTitle}`,
        `DESCRIPTION:${agenda.replace(/\n/g, '\\n')}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      storage.downloadFile('meeting-invite.ics', ics, 'text/calendar;charset=utf-8');
      showToast('Downloaded .ics calendar invite');
    } catch {
      showToast('Error generating calendar file', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" /> Meeting Details
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              className="input-base text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-base text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="input-base text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Your Timezone
              </label>
              <select
                value={baseTimezone}
                onChange={(e) => setBaseTimezone(e.target.value)}
                className="input-base text-xs"
              >
                {COMMON_TZ.map(t => (
                  <option key={t.tz} value={t.tz}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Agenda & Notes
            </label>
            <textarea
              rows={4}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="input-base text-xs resize-none"
              placeholder="Key talking points..."
            />
          </div>
        </div>

        {/* Right: Participant Timezone Schedule & Sync */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" /> Participant Local Times
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={handleCopySummary} className="btn-secondary text-xs py-1.5 px-2.5">
                  <Copy className="w-3.5 h-3.5" /> Copy Invite
                </button>
                <button onClick={handleDownloadIcs} className="btn-primary text-xs py-1.5 px-2.5">
                  <Download className="w-3.5 h-3.5" /> .ICS File
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {times.map(t => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {t.name}
                    </div>
                    <div className="text-[11px] text-slate-500">{t.timeZone}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      {t.localTime}
                    </div>
                    <div className="text-[10px] text-slate-400">{t.localDate}</div>
                  </div>
                  {participants.length > 1 && (
                    <button
                      onClick={() => handleRemoveParticipant(t.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add participant */}
            <form onSubmit={handleAddParticipant} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Participant Name/Role"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input-base text-xs flex-1"
              />
              <select
                value={newTz}
                onChange={(e) => setNewTz(e.target.value)}
                className="input-base text-xs w-44"
              >
                {COMMON_TZ.map(t => (
                  <option key={t.tz} value={t.tz}>{t.label}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary text-xs py-2 px-3 shrink-0">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
