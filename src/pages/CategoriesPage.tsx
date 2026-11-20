import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getToolsByCategory } from '../data/toolsRegistry';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { SEO } from '../components/common/SEO';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      <SEO
        title="Tool Categories - LifeTools"
        description="Explore 6 comprehensive utility categories: Calculators, Converters, Text Tools, Developer Tools, Image Tools, and QR Code Generators."
      />

      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
          <Layers className="w-4 h-4" /> Comprehensive Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
          Tool Categories
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
          All 117+ tools structured into focused, highly specialized departments designed to streamline everyday workflows.
        </p>
      </div>

      <div className="space-y-8">
        {CATEGORIES.map(category => {
          const tools = getToolsByCategory(category.id);
          const previewTools = tools.slice(0, 6);

          return (
            <div
              key={category.id}
              className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${category.gradient} text-white flex items-center justify-center shadow-lg shadow-indigo-500/10 shrink-0`}>
                    <DynamicIcon name={category.iconName} className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {category.name}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tools.length} Tools
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-0.5">
                      {category.tagline}
                    </p>
                  </div>
                </div>

                <a
                  href={`#/categories/${category.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-all shrink-0 self-start md:self-auto"
                >
                  <span>View All {tools.length} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                {category.description}
              </p>

              {/* Sample preview pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                {previewTools.map(t => (
                  <a
                    key={t.id}
                    href={`#/tool/${t.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <DynamicIcon name={t.iconName} className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.name}</span>
                  </a>
                ))}
                {tools.length > 6 && (
                  <a
                    href={`#/categories/${category.id}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    +{tools.length - 6} more
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
