import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { DynamicIcon } from './DynamicIcon';
import {
  Star,
  HelpCircle,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { SEO } from './SEO';
import { ToolCard } from './ToolCard';

interface ToolLayoutProps {
  tool: ToolItem;
  relatedToolsList?: ToolItem[];
  onNavigate?: (path: string) => void;
  onApplyExample?: (exampleData: any) => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  relatedToolsList = [],
  onNavigate,
  onApplyExample,
  children
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(tool.id);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categoryLabels: Record<string, string> = {
    calculators: 'Calculators',
    converters: 'Converters',
    text: 'Text Tools',
    developer: 'Developer Tools',
    image: 'Image Tools',
    generators: 'QR & Generators'
  };

  const categoryName = categoryLabels[tool.category] || tool.category;

  const handleBreadcrumbClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = `#${path}`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <SEO
        title={`${tool.name} — Free Online Tool`}
        description={tool.shortDescription}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
        <a
          href="#/"
          onClick={handleBreadcrumbClick('/')}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <a
          href={`#/categories/${tool.category}`}
          onClick={handleBreadcrumbClick(`/categories/${tool.category}`)}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {categoryName}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-xs">
          {tool.name}
        </span>
      </nav>

      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <DynamicIcon name={tool.iconName} className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {categoryName}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Client-Side
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {tool.shortDescription}
            </p>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(tool.id)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors shrink-0 ${
            favorited
              ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
          <span>{favorited ? 'Favorited' : 'Favorite'}</span>
        </button>
      </div>

      {/* Disclaimers if applicable (Health/Financial/JWT) */}
      {tool.disclaimer && (
        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Notice & Disclaimer:</span>
            <span>{tool.disclaimer}</span>
          </div>
        </div>
      )}

      {/* Main Interactive Tool Body (Supplied by Tool Component) */}
      <main className="mt-8">{children}</main>

      {/* Quick Examples Section (if provided) */}
      {tool.examples && tool.examples.length > 0 && (
        <section aria-labelledby="examples-heading" className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold text-base">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2 id="examples-heading">Preset Examples & Quick Loads</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Click any example below to quickly populate the inputs and test the tool immediately.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tool.examples.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onApplyExample && onApplyExample(example.data)}
                className="text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-500 hover:shadow-subtle transition-all group"
              >
                <div className="font-medium text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {example.title}
                </div>
                {example.description && (
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {example.description}
                  </div>
                )}
                <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span>Load this preset</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Instructions & How To Use */}
      <section aria-labelledby="how-to-use-heading" className="mt-12 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-semibold text-base">
          <HelpCircle className="w-5 h-5 text-emerald-500" />
          <h2 id="how-to-use-heading">How to Use the {tool.name}</h2>
        </div>
        <ol className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
          {tool.instructions.map((step, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* FAQs */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section aria-labelledby="faqs-heading" className="mt-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 id="faqs-heading" className="text-base font-semibold text-slate-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-850/30 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedToolsList.length > 0 && (
        <section aria-labelledby="related-tools-heading" className="mt-12">
          <h2 id="related-tools-heading" className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Related Utilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedToolsList.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
