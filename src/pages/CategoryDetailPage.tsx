import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getToolsByCategory } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { ToolCategory } from '../types';
import { SEO } from '../components/common/SEO';

interface CategoryDetailPageProps {
  categoryId: string;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({ categoryId }) => {
  const [query, setQuery] = useState<string>('');

  const category = CATEGORIES.find(c => c.id === categoryId);
  const tools = useMemo(() => {
    return getToolsByCategory(categoryId as ToolCategory);
  }, [categoryId]);

  const filteredTools = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return tools;
    return tools.filter(t =>
      t.name.toLowerCase().includes(clean) ||
      t.shortDescription.toLowerCase().includes(clean) ||
      t.keywords.some(k => k.toLowerCase().includes(clean))
    );
  }, [tools, query]);

  if (!category) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <p className="text-slate-500">The requested category does not exist.</p>
        <a href="#/categories" className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title={`${category.name} - Free Online Tools`}
        description={category.description}
      />

      {/* Back Link */}
      <div>
        <a
          href="#/categories"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Categories
        </a>
      </div>

      {/* Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${category.gradient} text-white flex items-center justify-center shadow-lg shadow-indigo-500/10 shrink-0`}>
            <DynamicIcon name={category.iconName} className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {category.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {tools.length} Tools
              </span>
            </div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-1">
              {category.tagline}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Filter tools in ${category.name}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <span className="text-xs text-slate-500 font-medium shrink-0">
          Showing {filteredTools.length} of {tools.length}
        </span>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">No matching tools found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Try a different search keyword.</p>
          <button
            onClick={() => setQuery('')}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
};
