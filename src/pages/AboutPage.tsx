import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Sparkles,
  Heart,
  Code2,
  Globe,
  Cpu,
  MapPin,
  Mail,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { DEVELOPER_INFO, SOCIAL_PROFILES } from '../data/developerInfo';
import { SocialBrandIcon } from '../components/common/SocialBrandIcon';
import { copyToClipboard } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const AboutPage: React.FC = () => {
  const { showToast } = useToast();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const handleCopyEmail = () => {
    copyToClipboard(DEVELOPER_INFO.email);
    setCopiedEmail(true);
    showToast('Developer email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyDiscord = (e: React.MouseEvent) => {
    e.preventDefault();
    copyToClipboard(DEVELOPER_INFO.discordUsername);
    setCopiedDiscord(true);
    showToast(`Discord handle "${DEVELOPER_INFO.discordUsername}" copied!`);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      <SEO
        title="About LifeTools & Developer Hazim Bashir"
        description="Learn about LifeTools architecture and developer Hazim Bashir (حازم بشیر), creating free, privacy-first digital utilities."
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision & Principles</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About LifeTools
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          LifeTools was built to provide an uncompromising, completely free, privacy-first digital toolbox that puts users in full control of their everyday digital tasks.
        </p>
      </div>

      {/* Mission Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          The Mission
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The modern internet is flooded with utility websites that bury simple tools beneath aggressive banner advertisements, paywalls, mandatory user registrations, and invasive third-party trackers. Even simple tasks like converting an image, resizing a photo, or formatting a JSON snippet often involve silently uploading confidential files or proprietary data to external cloud servers.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>LifeTools fundamentally rejects that model.</strong> Every calculation, text formatting step, image compression, QR generation, and cryptographic hashing operation occurs 100% locally on your own CPU via modern client-side Web APIs.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Architectural Core Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Strict Privacy Architecture</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No files or user inputs are sent to remote servers. We use browser Canvas, Web Crypto, and Blob APIs so your confidential data never leaves your device.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Zero Latency Performance</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Without round-trip API network delays, operations execute with near-instant speed at native browser hardware capabilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">No Registration or Accounts</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Access every tool freely without signing up or handing over an email address. Preferences and history are saved strictly in your private LocalStorage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Forever Free</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              100% free with no subscription tiers, trial periods, daily usage caps, or fake demo functionality. Every tool is completely operational.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 border border-slate-800">
        <h2 className="text-2xl font-bold flex items-center gap-2.5">
          <Code2 className="w-6 h-6 text-emerald-400" />
          Modern Engineering Stack
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          LifeTools is engineered using modern web standards ensuring high performance, accessibility, and offline durability:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-mono">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block">React 18</span>
            <span className="text-xs text-slate-400">Declarative UI</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block">TypeScript</span>
            <span className="text-xs text-slate-400">Type-Safe Logic</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block">Tailwind CSS</span>
            <span className="text-xs text-slate-400">Design System</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block">Vite Bundler</span>
            <span className="text-xs text-slate-400">Sub-second Builds</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block">Web Crypto API</span>
            <span className="text-xs text-slate-400">Native Cryptography</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-emerald-400 font-bold block">PWA Architecture</span>
            <span className="text-xs text-slate-400">Offline Ready</span>
          </div>
        </div>
      </div>

      {/* DEVELOPER PROFILE SECTION */}
      <section aria-labelledby="developer-section-title" className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-emerald-500/30 dark:ring-emerald-500/50 shadow-xl bg-slate-950 shrink-0">
            <img
              src={DEVELOPER_INFO.image}
              alt={DEVELOPER_INFO.imageAlt}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('Hazim')) {
                  target.src = '/Hazim%20Bashir%20Dev.png';
                }
              }}
            />
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Independent Creator</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <h2 id="developer-section-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {DEVELOPER_INFO.fullName}
              </h2>
              <span className="text-lg font-medium text-emerald-600 dark:text-emerald-400 font-serif" dir="rtl">
                ({DEVELOPER_INFO.urduName})
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              {DEVELOPER_INFO.username}
            </p>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {DEVELOPER_INFO.role}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{DEVELOPER_INFO.location}</span>
            </p>
          </div>
        </div>

        {/* Bio Card */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Developer Biography</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
            {DEVELOPER_INFO.bio}
          </p>
        </div>

        {/* Professional Information & LifeTools Integration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>Specializations & Skills</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {DEVELOPER_INFO.specializations.map((spec, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Contact & Inquiries</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For collaborations, questions, or feature suggestions:
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`mailto:${DEVELOPER_INFO.email}`}
                className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 hover:underline truncate"
              >
                {DEVELOPER_INFO.email}
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Social Presence Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Connect Across Social Platforms
            </h3>
            <span className="text-[11px] text-slate-400">10 Official Profiles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {SOCIAL_PROFILES.map((profile) => {
              if (profile.isDiscord) {
                return (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-indigo-400 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="text-slate-500 dark:text-slate-400 shrink-0">
                        <SocialBrandIcon platform="discord" className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{profile.platform}</p>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{profile.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={handleCopyDiscord}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                        title="Copy username"
                      >
                        {copiedDiscord ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                      <a
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-[#5865F2]"
                        title="Open profile"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              }

              return (
                <a
                  key={profile.id}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-500/60 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`text-slate-500 dark:text-slate-400 ${profile.color} transition-colors shrink-0`}>
                      <SocialBrandIcon platform={profile.id} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{profile.platform}</p>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">{profile.username}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0 ml-1" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Section Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>{DEVELOPER_INFO.footerNote}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </section>
    </div>
  );
};
