import React from 'react';
import { Star, Trash2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { SEO } from '../components/common/SEO';

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();

  const favoriteTools = favorites
    .map(id => TOOLS_REGISTRY.find(t => t.id === id))
    .filter((t): t is typeof TOOLS_REGISTRY[0] => t !== undefined);

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title="Your Favorite Tools - LifeTools"
        description="Quick access to your pinned and bookmarked everyday utility tools stored locally on your device."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> Bookmarked Essentials
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Favorite Tools
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your personal selection of quick-access tools saved locally in your browser.
          </p>
        </div>

        {favoriteTools.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to remove all favorite tools?')) {
                clearFavorites();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/60 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Favorites</span>
          </button>
        )}
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favoriteTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-900/50">
            <Star className="w-8 h-8 fill-amber-400/20 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Add your frequently used tools to Favorites for quick access.
          </p>
          <a
            href="#/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Browse All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};
