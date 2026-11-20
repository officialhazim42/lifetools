import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  ACCENT_COLORS
} from '../types/settings';
import { SettingsProvider, useSettings } from '../context/SettingsContext';
import { SettingsPage } from '../pages/SettingsPage';
import {
  t,
  formatDate,
  formatTime,
  formatNumber,
  formatCurrency
} from '../utils/i18n';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ToastProvider } from '../context/ToastContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RecentToolsProvider } from '../context/RecentToolsContext';

// Helper component to test useSettings hooks
const SettingsConsumer: React.FC = () => {
  const {
    settings,
    updateAppearance,
    updateLanguageAndRegion,
    updateNotifications,
    updatePersonalization,
    resetToDefaults,
    importSettings
  } = useSettings();

  return (
    <div>
      <span data-testid="theme-mode">{settings.appearance.themeMode}</span>
      <span data-testid="font-size">{settings.appearance.fontSize}</span>
      <span data-testid="layout-density">{settings.appearance.layoutDensity}</span>
      <span data-testid="reduced-motion">{String(settings.appearance.reducedMotion)}</span>
      <span data-testid="accent-color">{settings.appearance.accentColor}</span>
      <span data-testid="currency">{settings.languageAndRegion.currency}</span>
      <span data-testid="date-format">{settings.languageAndRegion.dateFormat}</span>
      <span data-testid="time-format">{settings.languageAndRegion.timeFormat}</span>
      <span data-testid="task-reminders">{String(settings.notifications.taskReminders)}</span>
      <span data-testid="default-homepage">{settings.personalization.defaultHomepage}</span>

      <button
        onClick={() => updateAppearance({ themeMode: 'dark', fontSize: 'large', accentColor: 'violet', reducedMotion: true })}
        data-testid="btn-update-appearance"
      >
        Update Appearance
      </button>

      <button
        onClick={() => updateLanguageAndRegion({ currency: 'USD', dateFormat: 'YYYY-MM-DD', timeFormat: '24h' })}
        data-testid="btn-update-region"
      >
        Update Region
      </button>

      <button
        onClick={() => updateNotifications({ taskReminders: false, timerNotifications: false })}
        data-testid="btn-update-notifs"
      >
        Update Notifications
      </button>

      <button
        onClick={() => updatePersonalization({ defaultHomepage: 'workspace' })}
        data-testid="btn-update-personal"
      >
        Update Personalization
      </button>

      <button onClick={resetToDefaults} data-testid="btn-reset">
        Reset Defaults
      </button>

      <button
        onClick={() =>
          importSettings({
            appearance: { themeMode: 'light', fontSize: 'small', accentColor: 'rose' }
          })
        }
        data-testid="btn-import-valid"
      >
        Import Valid
      </button>

      <button
        onClick={() => importSettings('corrupted-string')}
        data-testid="btn-import-invalid"
      >
        Import Invalid
      </button>
    </div>
  );
};

describe('LifeTools Smart Settings Center', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-font-size');
    document.documentElement.removeAttribute('data-density');
    document.documentElement.removeAttribute('data-accent');
    document.documentElement.style.fontSize = '';
  });

  it('1. validates default settings constants and structures', () => {
    expect(DEFAULT_SETTINGS.version).toBe(1);
    expect(DEFAULT_SETTINGS.appearance.themeMode).toBe('system');
    expect(DEFAULT_SETTINGS.appearance.fontSize).toBe('normal');
    expect(DEFAULT_SETTINGS.appearance.layoutDensity).toBe('comfortable');
    expect(DEFAULT_SETTINGS.appearance.reducedMotion).toBe(false);
    expect(DEFAULT_SETTINGS.appearance.accentColor).toBe('emerald');
    expect(DEFAULT_SETTINGS.languageAndRegion.currency).toBe('INR');
    expect(DEFAULT_SETTINGS.languageAndRegion.dateFormat).toBe('DD/MM/YYYY');
    expect(DEFAULT_SETTINGS.languageAndRegion.timeFormat).toBe('12h');
    expect(DEFAULT_SETTINGS.personalization.defaultHomepage).toBe('home');
    expect(ACCENT_COLORS.length).toBe(6);
  });

  it('2. initializes SettingsProvider with defaults and applies attributes to DOM', () => {
    render(
      <SettingsProvider>
        <SettingsConsumer />
      </SettingsProvider>
    );

    expect(screen.getByTestId('theme-mode').textContent).toBe('system');
    expect(screen.getByTestId('font-size').textContent).toBe('normal');
    expect(screen.getByTestId('currency').textContent).toBe('INR');

    // DOM checks
    expect(document.documentElement.style.fontSize).toBe('16px');
    expect(document.documentElement.getAttribute('data-density')).toBe('comfortable');
    expect(document.documentElement.getAttribute('data-accent')).toBe('emerald');
  });

  it('3. updates appearance settings and synchronizes DOM & localStorage', async () => {
    render(
      <SettingsProvider>
        <SettingsConsumer />
      </SettingsProvider>
    );

    fireEvent.click(screen.getByTestId('btn-update-appearance'));

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode').textContent).toBe('dark');
      expect(screen.getByTestId('font-size').textContent).toBe('large');
      expect(screen.getByTestId('accent-color').textContent).toBe('violet');
      expect(screen.getByTestId('reduced-motion').textContent).toBe('true');
    });

    // Check DOM side effects
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
    expect(document.documentElement.style.fontSize).toBe('18px');
    expect(document.documentElement.getAttribute('data-accent')).toBe('violet');

    // Check localStorage persistence
    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(saved.appearance.themeMode).toBe('dark');
    expect(saved.appearance.accentColor).toBe('violet');
  });

  it('4. updates language & region settings correctly', async () => {
    render(
      <SettingsProvider>
        <SettingsConsumer />
      </SettingsProvider>
    );

    fireEvent.click(screen.getByTestId('btn-update-region'));

    await waitFor(() => {
      expect(screen.getByTestId('currency').textContent).toBe('USD');
      expect(screen.getByTestId('date-format').textContent).toBe('YYYY-MM-DD');
      expect(screen.getByTestId('time-format').textContent).toBe('24h');
    });

    const saved = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    expect(saved.languageAndRegion.currency).toBe('USD');
    expect(saved.languageAndRegion.dateFormat).toBe('YYYY-MM-DD');
  });

  it('5. updates notifications and personalization settings', async () => {
    render(
      <SettingsProvider>
        <SettingsConsumer />
      </SettingsProvider>
    );

    fireEvent.click(screen.getByTestId('btn-update-notifs'));
    fireEvent.click(screen.getByTestId('btn-update-personal'));

    await waitFor(() => {
      expect(screen.getByTestId('task-reminders').textContent).toBe('false');
      expect(screen.getByTestId('default-homepage').textContent).toBe('workspace');
    });
  });

  it('6. resets settings to factory defaults when triggered', async () => {
    render(
      <SettingsProvider>
        <SettingsConsumer />
      </SettingsProvider>
    );

    // First modify
    fireEvent.click(screen.getByTestId('btn-update-appearance'));
    expect(screen.getByTestId('font-size').textContent).toBe('large');

    // Then reset
    fireEvent.click(screen.getByTestId('btn-reset'));

    await waitFor(() => {
      expect(screen.getByTestId('font-size').textContent).toBe('normal');
      expect(screen.getByTestId('theme-mode').textContent).toBe('system');
      expect(screen.getByTestId('accent-color').textContent).toBe('emerald');
    });

    expect(document.documentElement.style.fontSize).toBe('16px');
  });

  it('7. safely imports valid and handles malformed settings files', async () => {
    render(
      <SettingsProvider>
        <SettingsConsumer />
      </SettingsProvider>
    );

    // Valid import
    fireEvent.click(screen.getByTestId('btn-import-valid'));
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode').textContent).toBe('light');
      expect(screen.getByTestId('font-size').textContent).toBe('small');
      expect(screen.getByTestId('accent-color').textContent).toBe('rose');
    });

    // Malformed import should safely return error without crashing
    fireEvent.click(screen.getByTestId('btn-import-invalid'));
    expect(screen.getByTestId('theme-mode').textContent).toBe('light'); // Unchanged
  });

  it('8. formats dates, times, numbers, and currencies accurately across regions', () => {
    const testDate = new Date(2026, 10, 19, 14, 30); // 19 Nov 2026, 14:30

    // Dates
    expect(formatDate(testDate, 'DD/MM/YYYY')).toBe('19/11/2026');
    expect(formatDate(testDate, 'YYYY-MM-DD')).toBe('2026-11-19');
    expect(formatDate(testDate, 'MM/DD/YYYY')).toBe('11/19/2026');
    expect(formatDate(testDate, 'D MMM YYYY')).toBe('19 Nov 2026');

    // Times
    expect(formatTime(testDate, '12h')).toBe('2:30 PM');
    expect(formatTime(testDate, '24h')).toBe('14:30');

    // Numbers
    expect(formatNumber(1234567.89, 'standard')).toBe('1,234,567.89');
    expect(formatNumber(1234567.89, 'indian')).toBe('12,34,567.89');
    expect(formatNumber(1234567.89, 'spaces')).toBe('1 234 567.89');
    expect(formatNumber(1500000, 'compact')).toBe('1.5M');

    // Currencies
    expect(formatCurrency(5000, 'INR', 'indian')).toBe('₹ 5,000.00');
    expect(formatCurrency(5000, 'USD', 'standard')).toBe('$ 5,000.00');
    expect(formatCurrency(5000, 'EUR', 'standard')).toBe('€ 5,000.00');
    expect(formatCurrency(5000, 'GBP', 'standard')).toBe('£ 5,000.00');
    expect(formatCurrency(5000, 'JPY', 'standard')).toBe('¥ 5,000');

    // i18n lookup
    expect(t('nav.home')).toBe('Home');
    expect(t('nonexistent_key', 'Fallback Label')).toBe('Fallback Label');
  });

  it('9. ConfirmDialog functions properly and handles callbacks', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    const { rerender } = render(
      <ConfirmDialog
        isOpen={true}
        title="Delete All Data?"
        message="This operation cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Keep"
        isDanger={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Delete All Data?')).toBeDefined();
    expect(screen.getByText('This operation cannot be undone.')).toBeDefined();

    fireEvent.click(screen.getByText('No, Keep'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Yes, Delete'));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    // If closed, renders null
    rerender(
      <ConfirmDialog
        isOpen={false}
        title="Delete?"
        message="Msg"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    expect(screen.queryByText('Delete All Data?')).toBeNull();
  });

  it('10. renders SettingsPage and switches between sections', async () => {
    render(
      <SettingsProvider>
        <FavoritesProvider>
          <RecentToolsProvider>
            <ToastProvider>
              <SettingsPage />
            </ToastProvider>
          </RecentToolsProvider>
        </FavoritesProvider>
      </SettingsProvider>
    );

    // Should render heading and initial Appearance section
    expect(screen.getByText('Settings Center')).toBeDefined();
    expect(screen.getByText('Interface Theme')).toBeDefined();
    expect(screen.getByText('Brand Accent Color')).toBeDefined();

    // Switch to Language & Region
    const langTab = screen.getAllByText('Language & Region')[0];
    fireEvent.click(langTab);

    await waitFor(() => {
      expect(screen.getByText('Calendar Date Format')).toBeDefined();
      expect(screen.getByText('Default Financial Currency')).toBeDefined();
    });

    // Switch to About Application
    const aboutTab = screen.getAllByText('About Application')[0];
    fireEvent.click(aboutTab);

    await waitFor(() => {
      expect(screen.getByText('v1.2.0 Production')).toBeDefined();
      expect(screen.getByText('Hazim Bashir')).toBeDefined();
    });
  });
});
