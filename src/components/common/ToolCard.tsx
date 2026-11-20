import React from 'react';
import { ToolItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';
import { Star, ArrowRight } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

interface ToolCardProps {
  tool: ToolItem;
  onNavigate?: (path: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onNavigate }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(tool.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(`/tool/${tool.id}`);
    } else {
      window.location.hash = `#/tool/${tool.id}`;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(tool.id);
  };

  const categoryLabelMap: Record<string, string> = {
    calculators: 'Calculators',
    converters: 'Converters',
    text: 'Text Tools',
    developer: 'Developer',
    image: 'Image Tools',
    generators: 'Generators'
  };

  return (
    <a
      href={`#/tool/${tool.id}`}
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-subtle hover:shadow-card transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <div>
        {/* Top Header of Card */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors group-hover:bg-emerald-500 group-hover:text-white">
            <DynamicIcon name={tool.iconName} className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
              {categoryLabelMap[tool.category] || tool.category}
            </span>
            <button
              onClick={handleFavoriteClick}
              className={`p-1.5 rounded-lg transition-colors ${
                favorited
                  ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400'
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between text-base">
          <span>{tool.name}</span>
          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-500 shrink-0 ml-1" />
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer tags / popular indicator */}
      {tool.isPopular && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Popular Utility
          </span>
          <span className="text-slate-400">Client-Side</span>
        </div>
      )}
    </a>
  );
};
