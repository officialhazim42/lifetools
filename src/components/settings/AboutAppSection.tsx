import React, { useState } from 'react';
import {
  Info,
  Shield,
  Zap,
  Lock,
  ExternalLink,
  Mail,
  MapPin,
  Heart,
  Layers,
  Sparkles
} from 'lucide-react';
import { SocialBrandIcon } from '../common/SocialBrandIcon';
import { DeveloperModal } from '../common/DeveloperModal';

export const AboutAppSection: React.FC = () => {
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-500" />
          About LifeTools
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform credentials, release architecture, technology stack, and creator information.
        </p>
      </div>

      {/* Brand & Release Card */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">LifeTools</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  v1.2.0 Production
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Everything You Need. All in One Place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/officialhazim42"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <SocialBrandIcon platform="github" className="w-3.5 h-3.5" />
              GitHub
            </a>
            <button
              type="button"
              onClick={() => setIsDevModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Creator Profile
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          LifeTools is a comprehensive, privacy-conscious digital utility platform engineered with 216 client-side tools across 13 categories, complete with a private offline workspace. Built on the belief that everyday digital tools should be completely free, instantly responsive, and respectful of personal data.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              100% Client-Side
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero remote servers</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Shield className="w-3.5 h-3.5 text-sky-500" />
              Zero Telemetry
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">No tracking pixels</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Offline PWA
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Service worker cached</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              216 Tools
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">Across 13 categories</span>
          </div>
        </div>
      </div>

      {/* Developer Profile Snapshot */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs text-slate-400">
          Software Creator
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-black border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="https://raw.githubusercontent.com/officialhazim42/lifetools/main/public/hazim-profile.jpg"
                alt="Hazim Bashir"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-bold text-emerald-400 text-sm">HB</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Hazim Bashir
                </span>
                <span className="font-arabic text-sm text-emerald-600 dark:text-emerald-400">
                  حازم بشیر
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>@officialhazim42</span>
                <span>&bull;</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Ganderbal, Jammu & Kashmir, India
                </span>
              </div>
            </div>
          </div>

          <a
            href="mailto:hazimbashir.dev@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            hazimbashir.dev@gmail.com
          </a>
        </div>
      </div>

      {/* Tech Stack Highlights */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Engineered With Modern Web Standards
        </h3>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            React 18
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            TypeScript 5.7
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Tailwind CSS
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Vite 6
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            IndexedDB
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Web Crypto API
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Service Worker (PWA)
          </span>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <a href="#/privacy" className="hover:text-emerald-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#/terms" className="hover:text-emerald-500 transition-colors">
            Terms of Service
          </a>
          <a href="#/contact" className="hover:text-emerald-500 transition-colors">
            Contact Support
          </a>
          <a href="#/about" className="hover:text-emerald-500 transition-colors">
            About LifeTools
          </a>
        </div>
        <div>
          <span>© LifeTools. Free and open client-side utilities.</span>
        </div>
      </div>

      {/* Developer Profile Modal */}
      <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} />
    </div>
  );
};
