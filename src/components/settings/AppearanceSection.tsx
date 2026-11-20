import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { ThemeMode, FontSizePreference, LayoutDensity, AccentColor, ACCENT_COLORS } from '../../types/settings';
import { Sun, Moon, Laptop, Type, Layout, EyeOff, Palette, Check } from 'lucide-react';

export const AppearanceSection: React.FC = () => {
  const { settings, updateAppearance } = useSettings();
  const { themeMode, fontSize, layoutDensity, reducedMotion, accentColor } = settings.appearance;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-emerald-500" />
          Appearance
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Customize the visual interface, theme palette, typography scaling, and motion preferences.
        </p>
      </div>

      {/* 1. Theme Mode */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-white block">
            Interface Theme
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose between dark mode, light mode, or automatically match your operating system appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'system', name: 'System Default', icon: Laptop, desc: 'Sync with OS' },
            { id: 'light', name: 'Light Mode', icon: Sun, desc: 'Clean bright look' },
            { id: 'dark', name: 'Dark Mode', icon: Moon, desc: 'High contrast dark' }
          ].map((mode) => {
            const isSelected = themeMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateAppearance({ themeMode: mode.id as ThemeMode })}
                className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{mode.name}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">{mode.desc}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Accent Color Preferences */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-white block">
            Brand Accent Color
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a primary highlight color used for badges, interactive buttons, and navigation highlights.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {ACCENT_COLORS.map((color) => {
            const isSelected = accentColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => updateAppearance({ accentColor: color.id })}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 ring-2 ring-emerald-500/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Typography & Font Size */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Type className="w-4 h-4 text-slate-400" />
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">
              Font Scale
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust base typography scaling across all tools, articles, and workspace modules.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'small', label: 'Small (14px)', desc: 'Higher information density' },
            { id: 'normal', label: 'Default (16px)', desc: 'Balanced standard scaling' },
            { id: 'large', label: 'Large (18px)', desc: 'Increased readability & comfort' }
          ].map((item) => {
            const isSelected = fontSize === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateAppearance({ fontSize: item.id as FontSizePreference })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Layout Density & Motion */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        {/* Layout Density */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Layout className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                Layout Spacing Density
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compact mode tightens margins and card padding, maximizing visible screen real estate.
              </p>
            </div>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => updateAppearance({ layoutDensity: 'comfortable' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layoutDensity === 'comfortable'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Comfortable
            </button>
            <button
              type="button"
              onClick={() => updateAppearance({ layoutDensity: 'compact' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layoutDensity === 'compact'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <EyeOff className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                  Reduced Motion
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Minimizes smooth animations, dropdown transitions, and rotating icons for enhanced accessibility.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={reducedMotion}
              onClick={() => updateAppearance({ reducedMotion: !reducedMotion })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                reducedMotion ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
