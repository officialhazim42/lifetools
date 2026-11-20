import React from 'react';
import { History, Trash2, ArrowRight, Clock } from 'lucide-react';
import { useRecentTools } from '../context/RecentToolsContext';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { SEO } from '../components/common/SEO';

export const RecentPage: React.FC = () => {
  const { recentTools, clearRecentTools } = useRecentTools();

  const recentToolList = recentTools
    .map(entry => {
      const tool = TOOLS_REGISTRY.find(t => t.id === entry.toolId);
      return tool ? { ...tool, lastUsed: entry.lastUsed } : null;
    })
    .filter((t): t is typeof TOOLS_REGISTRY[0] & { lastUsed: number } => t !== null);

  const formatTimeAgo = (timestamp: number): string => {
    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title="Recently Used Tools - LifeTools"
        description="View your recent tool activity and history stored locally in your browser session."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <History className="w-4 h-4" /> Activity History
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Recently Used Tools
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tools you have interacted with during your recent sessions, recorded locally without tracking.
          </p>
        </div>

        {recentToolList.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your recent tool history?')) {
                clearRecentTools();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentToolList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {recentToolList.map(tool => (
            <div key={tool.id} className="relative group">
              <ToolCard tool={tool} />
              <div className="mt-1.5 px-2 flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Used {formatTimeAgo(tool.lastUsed)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-900/50">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No recently used tools
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Tools you use will appear here automatically.
          </p>
          <a
            href="#/tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Explore All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
};
