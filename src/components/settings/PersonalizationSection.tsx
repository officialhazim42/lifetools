import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { CATEGORIES } from '../../data/categories';
import { CurrencyPreference } from '../../types/settings';
import {
  Sliders,
  Home,
  Layers,
  Star,
  Clock,
  LayoutDashboard,
  DollarSign
} from 'lucide-react';

export const PersonalizationSection: React.FC = () => {
  const { settings, updatePersonalization } = useSettings();
  const {
    defaultHomepage,
    defaultToolCategory,
    showFavoritesOnHome,
    showRecentOnHome,
    defaultWorkspaceTab,
    defaultCurrency
  } = settings.personalization;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-500" />
          Personalization
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tailor default landing destinations, homepage widget visibility, and workflow defaults.
        </p>
      </div>

      {/* Default Landing Destination */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-slate-400" />
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white block">
              Default Landing Page
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose which section opens automatically when visiting the root domain or clicking the logo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'home', label: 'Main Home', desc: 'Hero & category grids' },
            { id: 'tools', label: 'All Tools', desc: 'Searchable tool catalog' },
            { id: 'workspace', label: 'My Workspace', desc: 'Personal productivity hub' },
            { id: 'favorites', label: 'Favorites', desc: 'Starred utilities' }
          ].map((item) => {
            const isSelected = defaultHomepage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  updatePersonalization({
                    defaultHomepage: item.id as 'home' | 'tools' | 'workspace' | 'favorites'
                  })
                }
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

      {/* Default Category & Workspace Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Tool Category */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Default Tool Catalog Filter
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Initial category filter preselected when navigating to the All Tools library.
          </p>

          <select
            value={defaultToolCategory}
            onChange={(e) => updatePersonalization({ defaultToolCategory: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All 13 Categories (Default)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.count} tools)
              </option>
            ))}
          </select>
        </div>

        {/* Default Workspace Tab */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Default Workspace Tab
            </label>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Initial active module loaded when entering My Workspace (`#/workspace`).
          </p>

          <select
            value={defaultWorkspaceTab}
            onChange={(e) => updatePersonalization({ defaultWorkspaceTab: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer capitalize"
          >
            {['dashboard', 'notes', 'tasks', 'expenses', 'habits', 'goals', 'calendar', 'backups'].map(
              (tab) => (
                <option key={tab} value={tab} className="capitalize">
                  {tab}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Homepage Widgets Visibility */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Homepage Content Widgets
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure dynamic content ribbons surfaced on the main landing page.
          </p>
        </div>

        <div className="space-y-4 pt-1">
          {/* Show Favorites */}
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Show Favorites Ribbon on Homepage
                </span>
                <span className="text-[11px] text-slate-400">
                  Surfaces quick-access cards for bookmarked tools on the home dashboard.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showFavoritesOnHome}
              onClick={() => updatePersonalization({ showFavoritesOnHome: !showFavoritesOnHome })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                showFavoritesOnHome ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showFavoritesOnHome ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Show Recent */}
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-sky-500 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block">
                  Show Recently Used Tools on Homepage
                </span>
                <span className="text-[11px] text-slate-400">
                  Surfaces history cards for your most recently accessed utilities.
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={showRecentOnHome}
              onClick={() => updatePersonalization({ showRecentOnHome: !showRecentOnHome })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                showRecentOnHome ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  showRecentOnHome ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
