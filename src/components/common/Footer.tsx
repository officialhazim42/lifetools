import React from 'react';
import { Logo } from './Logo';
import { Shield, Zap, Lock, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLink = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Everything You Need. All in One Place. LifeTools is a comprehensive, privacy-first digital utility suite built entirely for the modern web. 100% free, client-side, and registration-free.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Lock className="w-3 h-3 text-emerald-500" /> Client-Side
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Shield className="w-3 h-3 text-sky-500" /> Zero Tracking
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Zap className="w-3 h-3 text-amber-500" /> Offline Ready
              </span>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#/categories/calculators" onClick={handleLink('/categories/calculators')} className="hover:text-emerald-500 transition-colors">
                  Calculators (24)
                </a>
              </li>
              <li>
                <a href="#/categories/converters" onClick={handleLink('/categories/converters')} className="hover:text-emerald-500 transition-colors">
                  Converters (15)
                </a>
              </li>
              <li>
                <a href="#/categories/text" onClick={handleLink('/categories/text')} className="hover:text-emerald-500 transition-colors">
                  Text Tools (22)
                </a>
              </li>
              <li>
                <a href="#/categories/developer" onClick={handleLink('/categories/developer')} className="hover:text-emerald-500 transition-colors">
                  Developer Tools (26)
                </a>
              </li>
              <li>
                <a href="#/categories/image" onClick={handleLink('/categories/image')} className="hover:text-emerald-500 transition-colors">
                  Image Tools (15)
                </a>
              </li>
              <li>
                <a href="#/categories/generators" onClick={handleLink('/categories/generators')} className="hover:text-emerald-500 transition-colors">
                  QR & Generators (15)
                </a>
              </li>
              <li>
                <a href="#/categories/templates" onClick={handleLink('/categories/templates')} className="hover:text-emerald-500 transition-colors">
                  Templates & Documents (40)
                </a>
              </li>
              <li>
                <a href="#/categories/web" onClick={handleLink('/categories/web')} className="hover:text-emerald-500 transition-colors">
                  Web & Internet (65)
                </a>
              </li>
              <li>
                <a href="#/categories/media" onClick={handleLink('/categories/media')} className="hover:text-rose-500 transition-colors">
                  Media Studio (70)
                </a>
              </li>
              <li>
                <a href="#/categories/communication" onClick={handleLink('/categories/communication')} className="hover:text-blue-500 transition-colors">
                  Communication & Social (47)
                </a>
              </li>
              <li>
                <a href="#/categories/health" onClick={handleLink('/categories/health')} className="hover:text-emerald-500 transition-colors">
                  Health & Wellness (70)
                </a>
              </li>
              <li>
                <a href="#/categories/travel" onClick={handleLink('/categories/travel')} className="hover:text-amber-500 transition-colors">
                  Travel & Navigation (55)
                </a>
              </li>
              <li>
                <a href="#/categories/home" onClick={handleLink('/categories/home')} className="hover:text-emerald-500 transition-colors">
                  Home & Property (70)
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#/workspace" onClick={handleLink('/workspace')} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                  <span>My Workspace</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">New</span>
                </a>
              </li>
              <li>
                <a href="#/media" onClick={handleLink('/media')} className="text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Media Studio</span>
                  <span className="text-[10px] bg-rose-100 dark:bg-rose-950 px-1.5 py-0.5 rounded-full">New</span>
                </a>
              </li>
              <li>
                <a href="#/backup" onClick={handleLink('/backup')} className="hover:text-emerald-500 transition-colors flex items-center gap-1">
                  <span>Universal Backup</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">New</span>
                </a>
              </li>
              <li>
                <a href="#/templates" onClick={handleLink('/templates')} className="hover:text-emerald-500 transition-colors flex items-center gap-1">
                  <span>Templates Creator</span>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 px-1.5 py-0.5 rounded-full text-indigo-700 dark:text-indigo-300">New</span>
                </a>
              </li>
              <li>
                <a href="#/tools" onClick={handleLink('/tools')} className="hover:text-emerald-500 transition-colors">
                  All 633 Tools
                </a>
              </li>
              <li>
                <a href="#/favorites" onClick={handleLink('/favorites')} className="hover:text-emerald-500 transition-colors">
                  My Favorites
                </a>
              </li>
              <li>
                <a href="#/recent" onClick={handleLink('/recent')} className="hover:text-emerald-500 transition-colors">
                  Recently Used
                </a>
              </li>
              <li>
                <a href="#/about" onClick={handleLink('/about')} className="hover:text-emerald-500 transition-colors">
                  About LifeTools
                </a>
              </li>
              <li>
                <a href="#/settings" onClick={handleLink('/settings')} className="hover:text-emerald-500 transition-colors">
                  Settings Center
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#/privacy" onClick={handleLink('/privacy')} className="hover:text-emerald-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#/terms" onClick={handleLink('/terms')} className="hover:text-emerald-500 transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#/contact" onClick={handleLink('/contact')} className="hover:text-emerald-500 transition-colors">
                  Contact Developer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© LifeTools. Free and open client-side utilities.</p>
          <div className="flex items-center gap-1.5 text-center sm:text-right flex-wrap justify-center">
            <span>Crafted with care by</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Hazim Bashir (حازم بشیر)</span>
            <span>in Kashmir</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
