import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { SEO } from '../components/common/SEO';
import { AppearanceSection } from '../components/settings/AppearanceSection';
import { LanguageRegionSection } from '../components/settings/LanguageRegionSection';
import { PrivacySecuritySection } from '../components/settings/PrivacySecuritySection';
import { OfflineStorageSection } from '../components/settings/OfflineStorageSection';
import { NotificationsSection } from '../components/settings/NotificationsSection';
import { PersonalizationSection } from '../components/settings/PersonalizationSection';
import { DataManagementSection } from '../components/settings/DataManagementSection';
import { AboutAppSection } from '../components/settings/AboutAppSection';
import {
  Palette,
  Globe,
  Lock,
  HardDrive,
  Bell,
  Sliders,
  FileCode2,
  Info,
  ChevronRight,
  Settings as SettingsIcon,
  CheckCircle2,
  Save
} from 'lucide-react';

export type SettingsSectionId =
  | 'appearance'
  | 'language'
  | 'privacy'
  | 'storage'
  | 'notifications'
  | 'personalization'
  | 'data'
  | 'about';

interface SectionConfig {
  id: SettingsSectionId;
  label: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionConfig[] = [
  { id: 'appearance', label: 'Appearance', shortDesc: 'Theme, typography, density & motion', icon: Palette },
  { id: 'language', label: 'Language & Region', shortDesc: 'Formats, date, time & currency', icon: Globe },
  { id: 'privacy', label: 'Privacy & Security', shortDesc: 'Storage wiping, export & zero-tracking', icon: Lock },
  { id: 'storage', label: 'Offline & Storage', shortDesc: 'PWA, Cache & quota estimates', icon: HardDrive },
  { id: 'notifications', label: 'Notifications', shortDesc: 'Task, habit & timer reminders', icon: Bell },
  { id: 'personalization', label: 'Personalization', shortDesc: 'Default landing & home widgets', icon: Sliders },
  { id: 'data', label: 'Data Management', shortDesc: 'Backup, restore & reset options', icon: FileCode2 },
  { id: 'about', label: 'About Application', shortDesc: 'Release version & creator info', icon: Info }
];

interface SettingsPageProps {
  initialSection?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ initialSection }) => {
  const { isDirty } = useSettings();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>(() => {
    if (initialSection && SECTIONS.some((s) => s.id === initialSection)) {
      return initialSection as SettingsSectionId;
    }
    return 'appearance';
  });

  useEffect(() => {
    if (initialSection && SECTIONS.some((s) => s.id === initialSection)) {
      setActiveSection(initialSection as SettingsSectionId);
    }
  }, [initialSection]);

  const handleSelectSection = (id: SettingsSectionId) => {
    setActiveSection(id);
    window.location.hash = `#/settings/${id}`;
  };

  const currentSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title="Settings Center — LifeTools"
        description="Customize appearance, regional dates and currencies, storage preferences, notifications, and privacy options in LifeTools."
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
            <SettingsIcon className="w-4 h-4" />
            <span>Preferences & System Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Settings Center
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Configure your client-side experience, appearance themes, date and currency formatting, local storage custody, and notification reminders.
          </p>
        </div>

        {/* Live Auto-Save Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-xs font-medium text-slate-600 dark:text-slate-300 self-start md:self-auto shrink-0 shadow-xs">
          {isDirty ? (
            <>
              <Save className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Saving preferences...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Auto-saved locally</span>
            </>
          )}
        </div>
      </div>

      {/* Mobile Horizontal Tabs */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800 -mx-4 px-4 sm:mx-0 sm:px-0">
        {SECTIONS.map((sec) => {
          const isSelected = activeSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => handleSelectSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Settings Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Configuration Sections
          </div>
          {SECTIONS.map((sec) => {
            const isSelected = activeSection === sec.id;
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => handleSelectSection(sec.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-emerald-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-medium block truncate">
                      {sec.label}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                      {sec.shortDesc}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-emerald-600 dark:text-emerald-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </aside>

        {/* Right Active Section Content */}
        <section className="lg:col-span-8 min-w-0">
          {activeSection === 'appearance' && <AppearanceSection />}
          {activeSection === 'language' && <LanguageRegionSection />}
          {activeSection === 'privacy' && <PrivacySecuritySection />}
          {activeSection === 'storage' && <OfflineStorageSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
          {activeSection === 'personalization' && <PersonalizationSection />}
          {activeSection === 'data' && <DataManagementSection />}
          {activeSection === 'about' && <AboutAppSection />}
        </section>
      </div>
    </div>
  );
};
