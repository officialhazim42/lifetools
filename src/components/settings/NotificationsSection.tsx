import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import {
  Bell,
  BellRing,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  CheckSquare,
  Timer
} from 'lucide-react';

export const NotificationsSection: React.FC = () => {
  const { settings, updateNotifications } = useSettings();
  const { notifications } = settings;
  const { showToast } = useToast();

  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Web Audio subtle ping chime
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Notifications are not supported in this browser.', 'error');
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        updateNotifications({ enabled: true });
        showToast('Notification permission granted!', 'success');
        if (notifications.soundEnabled) playNotificationChime();
        new Notification('LifeTools Notifications Enabled', {
          body: 'You will receive reminders for timers, habits, and tasks.',
          icon: '/logo.svg'
        });
      } else if (res === 'denied') {
        updateNotifications({ enabled: false });
        showToast('Notification permission was blocked in browser settings.', 'info');
      }
    } catch {
      showToast('Failed to request notification permission.', 'error');
    }
  };

  const handleSendTestNotification = () => {
    if (permission !== 'granted') {
      showToast('Please enable browser notification permissions first.', 'info');
      return;
    }

    if (notifications.soundEnabled) {
      playNotificationChime();
    }

    try {
      new Notification('LifeTools Test Notification', {
        body: 'This is a test notification confirming your alerts are configured properly.',
        icon: '/logo.svg'
      });
      showToast('Test notification dispatched.', 'success');
    } catch {
      showToast('Could not trigger notification.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-500" />
          Notifications
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure local device reminders for productivity tasks, habit routines, calendar events, and cooking/pomodoro timers.
        </p>
      </div>

      {/* Permission Status Card */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                permission === 'granted'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                  : permission === 'denied'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Browser Notification Status
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                    permission === 'granted'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : permission === 'denied'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {permission === 'default' ? 'Not Requested' : permission}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {permission === 'granted'
                  ? 'Notifications are permitted by your browser.'
                  : permission === 'denied'
                  ? 'Notifications are blocked. Enable them in your browser site settings.'
                  : 'LifeTools does not prompt automatically. Click below to grant permissions.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            {permission !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-emerald-600/20 transition-all cursor-pointer"
              >
                Enable Notifications
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Send Test Alert
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Granular Notification Channels */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Configurable Alert Channels
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose which types of alerts should produce system notifications when active.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {/* Task Reminders */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <CheckSquare className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Task Due Date Reminders
                </span>
                <span className="text-[11px] text-slate-400">
                  Notify when scheduled tasks reach their specified deadline.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications.taskReminders}
              onClick={() => updateNotifications({ taskReminders: !notifications.taskReminders })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notifications.taskReminders ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifications.taskReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Habit Reminders */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Daily Habit Check-in Reminders
                </span>
                <span className="text-[11px] text-slate-400">
                  Daily reminder prompts to maintain active habit streaks.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications.habitReminders}
              onClick={() => updateNotifications({ habitReminders: !notifications.habitReminders })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notifications.habitReminders ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifications.habitReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Event Reminders */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Calendar Event & Meeting Alerts
                </span>
                <span className="text-[11px] text-slate-400">
                  Alerts for scheduled calendar events, exams, and routines.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications.eventReminders}
              onClick={() => updateNotifications({ eventReminders: !notifications.eventReminders })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notifications.eventReminders ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifications.eventReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Timer Notifications */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <Timer className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Timers & Pomodoro Alarms
                </span>
                <span className="text-[11px] text-slate-400">
                  Audio chime and desktop notification when cooking, workout, or Pomodoro timers elapse.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications.timerNotifications}
              onClick={() => updateNotifications({ timerNotifications: !notifications.timerNotifications })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notifications.timerNotifications ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifications.timerNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notification Sounds */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-start gap-3">
              <Volume2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Audible Chimes & Sound Effects
                </span>
                <span className="text-[11px] text-slate-400">
                  Play subtle synthesized Web Audio chimes alongside alerts.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifications.soundEnabled}
              onClick={() => {
                const nextVal = !notifications.soundEnabled;
                updateNotifications({ soundEnabled: nextVal });
                if (nextVal) playNotificationChime();
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                notifications.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifications.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
