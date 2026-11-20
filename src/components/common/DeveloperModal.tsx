import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  MapPin,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Cpu,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { DEVELOPER_INFO, SOCIAL_PROFILES } from '../../data/developerInfo';
import { SocialBrandIcon } from './SocialBrandIcon';
import { copyToClipboard } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const modalRef = useRef<HTMLDivElement>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management and background scroll lock
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(DEVELOPER_INFO.email);
    setCopiedEmail(true);
    showToast('Developer email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyDiscord = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(DEVELOPER_INFO.discordUsername);
    setCopiedDiscord(true);
    showToast(`Discord handle "${DEVELOPER_INFO.discordUsername}" copied!`);
    setTimeout(() => setCopiedDiscord(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="developer-profile-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up focus:outline-none"
      >
        {/* A. Fixed Modal Header with Subtle Gradient Accent & Close Button */}
        <div className="relative flex-shrink-0 px-5 sm:px-6 py-3.5 bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-indigo-600/10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          {/* Subtle decorative gradient top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
              Developer Profile
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* B. Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-7 space-y-5">
          {/* Profile Header with Fully Visible HB Image (Zero Negative Margins) */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 pb-1">
            {/* Developer Avatar - Fully visible with authentic HB branding */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-emerald-500/80 shadow-lg bg-slate-950 flex items-center justify-center p-0.5">
                <img
                  src={DEVELOPER_INFO.image}
                  alt={DEVELOPER_INFO.imageAlt}
                  className="w-full h-full object-contain rounded-xl"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('Hazim')) {
                      target.src = '/Hazim%20Bashir%20Dev.png';
                    }
                  }}
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-white text-[9px] shadow-xs"
                title="Verified Developer"
              >
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Developer Identity Details */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 justify-center sm:justify-start">
                <h2
                  id="developer-profile-title"
                  className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight"
                >
                  {DEVELOPER_INFO.fullName}
                </h2>
                <span
                  className="text-base sm:text-lg font-medium text-emerald-600 dark:text-emerald-400 font-serif"
                  dir="rtl"
                  title="Urdu Name"
                >
                  ({DEVELOPER_INFO.urduName})
                </span>
              </div>

              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {DEVELOPER_INFO.username}
              </p>

              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                {DEVELOPER_INFO.role}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{DEVELOPER_INFO.location}</span>
              </p>
            </div>
          </div>

          {/* About Me Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>About Developer</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {DEVELOPER_INFO.bio}
            </p>
          </div>

          {/* Professional Information & LifeTools Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Specialization Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                <span>Technical Specialization</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {DEVELOPER_INFO.specializations.map((spec, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LifeTools Project Context Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>LifeTools Architecture</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {DEVELOPER_INFO.projectContext}
              </p>
              <div className="pt-0.5 flex flex-wrap gap-1.5 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  React 18
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  TypeScript
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Tailwind CSS
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Vite
                </span>
              </div>
            </div>
          </div>

          {/* Email Card with Copy and Mailto */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Official Developer Email
                </p>
                <a
                  href={`mailto:${DEVELOPER_INFO.email}`}
                  className="text-xs sm:text-sm font-mono font-medium text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  {DEVELOPER_INFO.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
              </button>
              <a
                href={`mailto:${DEVELOPER_INFO.email}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>Send Mail</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Social Media Presence Grid */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Official Social Profiles & Presence
              </h3>
              <span className="text-[11px] text-slate-400">10 Platforms</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SOCIAL_PROFILES.map((profile) => {
                if (profile.isDiscord) {
                  return (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="text-slate-500 dark:text-slate-400 group-hover:text-[#5865F2] transition-colors shrink-0">
                          <SocialBrandIcon platform="discord" className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                            {profile.platform}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                            {profile.username}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={handleCopyDiscord}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Copy Discord username"
                          aria-label="Copy Discord username"
                        >
                          {copiedDiscord ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <a
                          href={profile.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-[#5865F2] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Open Discord profile"
                          aria-label="Open Discord profile"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
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
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 hover:shadow-xs transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`text-slate-500 dark:text-slate-400 ${profile.color} transition-colors shrink-0`}>
                        <SocialBrandIcon platform={profile.id} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                          {profile.platform}
                        </p>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          {profile.username}
                        </p>
                      </div>
                    </div>

                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0 ml-2" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* C. Fixed Modal Footer */}
        <div className="p-3.5 px-5 sm:px-7 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>{DEVELOPER_INFO.footerNote}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline shrink-0" />
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
