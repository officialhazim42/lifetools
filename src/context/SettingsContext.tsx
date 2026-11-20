import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  LifeToolsSettings,
  AppearanceSettings,
  LanguageAndRegionSettings,
  NotificationSettings,
  PersonalizationSettings,
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  ACCENT_COLORS,
  ThemeMode
} from '../types/settings';
import { setLanguage } from '../utils/i18n';

interface SettingsContextType {
  settings: LifeToolsSettings;
  updateAppearance: (partial: Partial<AppearanceSettings>) => void;
  updateLanguageAndRegion: (partial: Partial<LanguageAndRegionSettings>) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
  updatePersonalization: (partial: Partial<PersonalizationSettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => void;
  importSettings: (payload: any) => { success: boolean; error?: string };
  isDirty: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Helper to validate and migrate settings
function validateAndMigrateSettings(parsed: any): LifeToolsSettings {
  if (!parsed || typeof parsed !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    version: 1,
    updatedAt: parsed.updatedAt || new Date().toISOString(),
    appearance: {
      themeMode: ['system', 'light', 'dark'].includes(parsed.appearance?.themeMode)
        ? parsed.appearance.themeMode
        : DEFAULT_SETTINGS.appearance.themeMode,
      fontSize: ['small', 'normal', 'large'].includes(parsed.appearance?.fontSize)
        ? parsed.appearance.fontSize
        : DEFAULT_SETTINGS.appearance.fontSize,
      layoutDensity: ['comfortable', 'compact'].includes(parsed.appearance?.layoutDensity)
        ? parsed.appearance.layoutDensity
        : DEFAULT_SETTINGS.appearance.layoutDensity,
      reducedMotion: typeof parsed.appearance?.reducedMotion === 'boolean'
        ? parsed.appearance.reducedMotion
        : DEFAULT_SETTINGS.appearance.reducedMotion,
      accentColor: ACCENT_COLORS.some(c => c.id === parsed.appearance?.accentColor)
        ? parsed.appearance.accentColor
        : DEFAULT_SETTINGS.appearance.accentColor
    },
    languageAndRegion: {
      language: typeof parsed.languageAndRegion?.language === 'string'
        ? parsed.languageAndRegion.language
        : DEFAULT_SETTINGS.languageAndRegion.language,
      dateFormat: ['DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY', 'D MMM YYYY'].includes(parsed.languageAndRegion?.dateFormat)
        ? parsed.languageAndRegion.dateFormat
        : DEFAULT_SETTINGS.languageAndRegion.dateFormat,
      timeFormat: ['12h', '24h'].includes(parsed.languageAndRegion?.timeFormat)
        ? parsed.languageAndRegion.timeFormat
        : DEFAULT_SETTINGS.languageAndRegion.timeFormat,
      numberFormat: ['standard', 'indian', 'compact', 'spaces'].includes(parsed.languageAndRegion?.numberFormat)
        ? parsed.languageAndRegion.numberFormat
        : DEFAULT_SETTINGS.languageAndRegion.numberFormat,
      currency: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].includes(parsed.languageAndRegion?.currency)
        ? parsed.languageAndRegion.currency
        : DEFAULT_SETTINGS.languageAndRegion.currency,
      firstDayOfWeek: ['monday', 'sunday'].includes(parsed.languageAndRegion?.firstDayOfWeek)
        ? parsed.languageAndRegion.firstDayOfWeek
        : DEFAULT_SETTINGS.languageAndRegion.firstDayOfWeek
    },
    notifications: {
      enabled: typeof parsed.notifications?.enabled === 'boolean'
        ? parsed.notifications.enabled
        : DEFAULT_SETTINGS.notifications.enabled,
      taskReminders: typeof parsed.notifications?.taskReminders === 'boolean'
        ? parsed.notifications.taskReminders
        : DEFAULT_SETTINGS.notifications.taskReminders,
      habitReminders: typeof parsed.notifications?.habitReminders === 'boolean'
        ? parsed.notifications.habitReminders
        : DEFAULT_SETTINGS.notifications.habitReminders,
      eventReminders: typeof parsed.notifications?.eventReminders === 'boolean'
        ? parsed.notifications.eventReminders
        : DEFAULT_SETTINGS.notifications.eventReminders,
      timerNotifications: typeof parsed.notifications?.timerNotifications === 'boolean'
        ? parsed.notifications.timerNotifications
        : DEFAULT_SETTINGS.notifications.timerNotifications,
      soundEnabled: typeof parsed.notifications?.soundEnabled === 'boolean'
        ? parsed.notifications.soundEnabled
        : DEFAULT_SETTINGS.notifications.soundEnabled
    },
    personalization: {
      defaultHomepage: ['home', 'tools', 'workspace', 'favorites'].includes(parsed.personalization?.defaultHomepage)
        ? parsed.personalization.defaultHomepage
        : DEFAULT_SETTINGS.personalization.defaultHomepage,
      defaultToolCategory: typeof parsed.personalization?.defaultToolCategory === 'string'
        ? parsed.personalization.defaultToolCategory
        : DEFAULT_SETTINGS.personalization.defaultToolCategory,
      showFavoritesOnHome: typeof parsed.personalization?.showFavoritesOnHome === 'boolean'
        ? parsed.personalization.showFavoritesOnHome
        : DEFAULT_SETTINGS.personalization.showFavoritesOnHome,
      showRecentOnHome: typeof parsed.personalization?.showRecentOnHome === 'boolean'
        ? parsed.personalization.showRecentOnHome
        : DEFAULT_SETTINGS.personalization.showRecentOnHome,
      defaultWorkspaceTab: typeof parsed.personalization?.defaultWorkspaceTab === 'string'
        ? parsed.personalization.defaultWorkspaceTab
        : DEFAULT_SETTINGS.personalization.defaultWorkspaceTab,
      defaultCurrency: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].includes(parsed.personalization?.defaultCurrency)
        ? parsed.personalization.defaultCurrency
        : DEFAULT_SETTINGS.personalization.defaultCurrency
    }
  };
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<LifeToolsSettings>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        return validateAndMigrateSettings(JSON.parse(raw));
      }
      // Check if user previously had a legacy theme stored
      const legacyTheme = localStorage.getItem('lifetools-theme') as 'dark' | 'light' | null;
      if (legacyTheme === 'light' || legacyTheme === 'dark') {
        return {
          ...DEFAULT_SETTINGS,
          appearance: {
            ...DEFAULT_SETTINGS.appearance,
            themeMode: legacyTheme
          }
        };
      }
    } catch {
      // Fallback
    }
    return { ...DEFAULT_SETTINGS };
  });

  const [isDirty, setIsDirty] = useState(false);

  // Synchronize settings changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Apply appearance changes to DOM (Theme, Font Size, Layout Density, Reduced Motion, Accent Color)
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const { themeMode, fontSize, layoutDensity, reducedMotion, accentColor } = settings.appearance;

    // 1. Theme application (system / light / dark)
    const applyTheme = (mode: ThemeMode) => {
      let isDark = false;
      if (mode === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = mode === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        try { localStorage.setItem('lifetools-theme', 'dark'); } catch {}
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        try { localStorage.setItem('lifetools-theme', 'light'); } catch {}
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lifetools-theme-sync', { detail: isDark ? 'dark' : 'light' }));
      }
    };

    applyTheme(themeMode);

    // If system default, listen to OS dark mode preference changes
    let mediaQuery: MediaQueryList | null = null;
    let listener: ((e: MediaQueryListEvent) => void) | null = null;

    if (themeMode === 'system' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      listener = (e: MediaQueryListEvent) => {
        applyTheme('system');
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      }
    }

    // 2. Font Size
    root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
    root.setAttribute('data-font-size', fontSize);

    // 3. Layout Density
    root.setAttribute('data-density', layoutDensity);
    if (layoutDensity === 'compact') {
      root.classList.add('density-compact');
    } else {
      root.classList.remove('density-compact');
    }

    // 4. Reduced Motion
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // 5. Accent Color
    root.setAttribute('data-accent', accentColor);
    const colorObj = ACCENT_COLORS.find(c => c.id === accentColor) || ACCENT_COLORS[0];
    root.style.setProperty('--color-accent-primary', colorObj.hex);

    // 6. i18n Language Sync
    setLanguage(settings.languageAndRegion.language);

    return () => {
      if (mediaQuery && listener && mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      }
    };
  }, [settings.appearance, settings.languageAndRegion.language]);

  // Updater functions
  const updateAppearance = useCallback((partial: Partial<AppearanceSettings>) => {
    setSettings(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      appearance: { ...prev.appearance, ...partial }
    }));
    setIsDirty(true);
    setTimeout(() => setIsDirty(false), 2000);
  }, []);

  const updateLanguageAndRegion = useCallback((partial: Partial<LanguageAndRegionSettings>) => {
    setSettings(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      languageAndRegion: { ...prev.languageAndRegion, ...partial }
    }));
    setIsDirty(true);
    setTimeout(() => setIsDirty(false), 2000);
  }, []);

  const updateNotifications = useCallback((partial: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      notifications: { ...prev.notifications, ...partial }
    }));
    setIsDirty(true);
    setTimeout(() => setIsDirty(false), 2000);
  }, []);

  const updatePersonalization = useCallback((partial: Partial<PersonalizationSettings>) => {
    setSettings(prev => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      personalization: { ...prev.personalization, ...partial }
    }));
    setIsDirty(true);
    setTimeout(() => setIsDirty(false), 2000);
  }, []);

  const resetToDefaults = useCallback(() => {
    const reset = {
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString()
    };
    setSettings(reset);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(reset));
    } catch {}
    setIsDirty(true);
    setTimeout(() => setIsDirty(false), 2000);
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lifetools_settings_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [settings]);

  const importSettings = useCallback((payload: any): { success: boolean; error?: string } => {
    try {
      const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid settings file. Expected JSON object.' };
      }
      const migrated = validateAndMigrateSettings(parsed);
      setSettings(migrated);
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(migrated));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to parse settings JSON.' };
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateAppearance,
        updateLanguageAndRegion,
        updateNotifications,
        updatePersonalization,
        resetToDefaults,
        exportSettings,
        importSettings,
        isDirty
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
