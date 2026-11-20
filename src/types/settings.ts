export type ThemeMode = 'system' | 'light' | 'dark';
export type FontSizePreference = 'small' | 'normal' | 'large';
export type LayoutDensity = 'comfortable' | 'compact';
export type AccentColor = 'emerald' | 'indigo' | 'violet' | 'amber' | 'rose' | 'cyan';

export type DateFormatPreference = 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'D MMM YYYY';
export type TimeFormatPreference = '12h' | '24h';
export type NumberFormatPreference = 'standard' | 'indian' | 'compact' | 'spaces';
export type CurrencyPreference = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD';
export type FirstDayOfWeek = 'monday' | 'sunday';

export interface AppearanceSettings {
  themeMode: ThemeMode;
  fontSize: FontSizePreference;
  layoutDensity: LayoutDensity;
  reducedMotion: boolean;
  accentColor: AccentColor;
}

export interface LanguageAndRegionSettings {
  language: string; // 'en' initially, architecture for more
  dateFormat: DateFormatPreference;
  timeFormat: TimeFormatPreference;
  numberFormat: NumberFormatPreference;
  currency: CurrencyPreference;
  firstDayOfWeek: FirstDayOfWeek;
}

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  habitReminders: boolean;
  eventReminders: boolean;
  timerNotifications: boolean;
  soundEnabled: boolean;
}

export interface PersonalizationSettings {
  defaultHomepage: 'home' | 'tools' | 'workspace' | 'favorites';
  defaultToolCategory: string; // 'all' or specific category ID
  showFavoritesOnHome: boolean;
  showRecentOnHome: boolean;
  defaultWorkspaceTab: string;
  defaultCurrency: CurrencyPreference;
}

export interface LifeToolsSettings {
  version: number;
  updatedAt: string;
  appearance: AppearanceSettings;
  languageAndRegion: LanguageAndRegionSettings;
  notifications: NotificationSettings;
  personalization: PersonalizationSettings;
}

export const SETTINGS_STORAGE_KEY = 'lifetools-settings-v1';

export const ACCENT_COLORS: {
  id: AccentColor;
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
  ringClass: string;
}[] = [
  { id: 'emerald', name: 'Emerald', hex: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500', ringClass: 'ring-emerald-500' },
  { id: 'indigo', name: 'Indigo', hex: '#6366f1', bgClass: 'bg-indigo-500', textClass: 'text-indigo-500', ringClass: 'ring-indigo-500' },
  { id: 'violet', name: 'Violet', hex: '#8b5cf6', bgClass: 'bg-violet-500', textClass: 'text-violet-500', ringClass: 'ring-violet-500' },
  { id: 'amber', name: 'Amber', hex: '#f59e0b', bgClass: 'bg-amber-500', textClass: 'text-amber-500', ringClass: 'ring-amber-500' },
  { id: 'rose', name: 'Rose', hex: '#f43f5e', bgClass: 'bg-rose-500', textClass: 'text-rose-500', ringClass: 'ring-rose-500' },
  { id: 'cyan', name: 'Cyan', hex: '#06b6d4', bgClass: 'bg-cyan-500', textClass: 'text-cyan-500', ringClass: 'ring-cyan-500' }
];

export const DEFAULT_SETTINGS: LifeToolsSettings = {
  version: 1,
  updatedAt: new Date().toISOString(),
  appearance: {
    themeMode: 'system',
    fontSize: 'normal',
    layoutDensity: 'comfortable',
    reducedMotion: false,
    accentColor: 'emerald'
  },
  languageAndRegion: {
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    numberFormat: 'standard',
    currency: 'INR',
    firstDayOfWeek: 'monday'
  },
  notifications: {
    enabled: false,
    taskReminders: true,
    habitReminders: true,
    eventReminders: true,
    timerNotifications: true,
    soundEnabled: true
  },
  personalization: {
    defaultHomepage: 'home',
    defaultToolCategory: 'all',
    showFavoritesOnHome: true,
    showRecentOnHome: true,
    defaultWorkspaceTab: 'dashboard',
    defaultCurrency: 'INR'
  }
};
