import React from 'react';
import { Search, Shield, Zap, Sparkles, Smartphone, WifiOff, ArrowRight, CheckCircle2, Heart, History, Layers } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { getPopularTools, TOOLS_REGISTRY } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { DynamicIcon } from '../components/common/DynamicIcon';
import { useRecentTools } from '../context/RecentToolsContext';
import { useFavorites } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';
import { SEO } from '../components/common/SEO';

interface HomePageProps {
  onOpenSearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch }) => {
  const popularTools = getPopularTools().slice(0, 12);
  const { recentTools } = useRecentTools();
  const { favorites } = useFavorites();
  const { settings } = useSettings();

  const favoriteToolItems = favorites
    .map((id) => TOOLS_REGISTRY.find((t) => t.id === id))
    .filter((t): t is typeof TOOLS_REGISTRY[0] => t !== undefined)
    .slice(0, 4);

  const recentToolItems = recentTools
    .map((entry) => TOOLS_REGISTRY.find((t) => t.id === entry.toolId))
    .filter((t): t is typeof TOOLS_REGISTRY[0] => t !== undefined)
    .slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      <SEO
        title="Everything You Need. All in One Place."
        description="Powerful, free, and privacy-friendly digital utility tools to simplify your everyday tasks. No sign-up. 100% client-side."
      />

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 text-center max-w-4xl mx-auto px-4">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>216+ Free Client-Side Tools &bull; Zero Server Uploads</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          Everything You Need. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            All in One Place.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Powerful, free, and privacy-friendly tools to simplify your everyday tasks. No sign-up. No tracking. No unnecessary complications.
        </p>

        {/* Global Search Bar Button */}
        <div className="max-w-xl mx-auto mb-8">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-indigo-500 dark:hover:border-indigo-400 transition-all text-left group"
          >
            <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
              <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-base text-slate-500 dark:text-slate-400 font-medium">Search among 216+ tools...</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <kbd>Ctrl</kbd>+<kbd>K</kbd>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#/tools"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore All 216+ Tools</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#/categories"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Browse Categories</span>
          </a>
        </div>
      </section>

      {/* Bookmarked Favorites Section (Personalization Controlled) */}
      {settings.personalization.showFavoritesOnHome && favoriteToolItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Starred Favorites</h2>
            </div>
            <a href="#/favorites" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All Favorites &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoriteToolItems.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used Section (Personalization Controlled) */}
      {settings.personalization.showRecentOnHome && recentToolItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recently Used Tools</h2>
            </div>
            <a href="#/recent" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All History &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentToolItems.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            Organized for Efficiency
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Every tool is neatly categorized and instantly accessible with intuitive keyboard shortcuts and search.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(cat => (
            <a
              key={cat.id}
              href={`#/categories/${cat.id}`}
              className="group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.gradient} text-white flex items-center justify-center mb-5 shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
                  <DynamicIcon name={cat.iconName} className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {cat.count} tools
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                  {cat.tagline}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <span>Explore {cat.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> High Demand Utilities
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Popular Everyday Tools
            </h2>
          </div>
          <a
            href="#/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <span>View all 117 tools</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {popularTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Why LifeTools Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2 block">
              Architected for Trust & Privacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Why Professionals & Individuals Choose LifeTools
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Most utility websites clutter your screen with invasive pop-ups, slow server-side redirects, or quiet data harvesting. LifeTools was built on an uncompromising privacy-first paradigm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">100% Free Forever</h3>
                <p className="text-sm text-slate-400">
                  No paywalls, no monthly subscription tiers, no hidden credit systems, and no restricted features.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Privacy First &bull; Zero Uploads</h3>
                <p className="text-sm text-slate-400">
                  All files, images, passwords, and data stay on your machine. We never upload private files to external servers.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Lightning Fast</h3>
                <p className="text-sm text-slate-400">
                  Runs directly in your browser with WebAssembly, Canvas, and Web Crypto APIs for zero network latency.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Works Offline (PWA)</h3>
                <p className="text-sm text-slate-400">
                  Fully installable as a Progressive Web App on mobile and desktop. Access critical tools even without an internet connection.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Mobile Optimized</h3>
                <p className="text-sm text-slate-400">
                  Thoughtfully designed layouts that adapt gracefully to smartphones, tablets, laptops, and ultra-wide monitors.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">No Accounts Needed</h3>
                <p className="text-sm text-slate-400">
                  Save your favorites and recent history safely in your browser's private local storage without an email or login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200 dark:border-indigo-900/60">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ready to streamline your daily workflow?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6 text-sm sm:text-base">
            Bookmark LifeTools and keep your digital workstation organized, fast, and secure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#/tools"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all"
            >
              Start Using Tools
            </a>
            <button
              onClick={onOpenSearch}
              className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-all"
            >
              Open Search (Ctrl+K)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
