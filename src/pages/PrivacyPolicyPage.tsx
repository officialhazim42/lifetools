import React from 'react';
import { ShieldCheck, Lock, EyeOff, HardDrive, Cookie, CheckCircle2 } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      <SEO
        title="Privacy Policy - LifeTools"
        description="LifeTools is built on a privacy-first foundation. Read our clear, transparent privacy guarantees."
      />

      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy-First Commitment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Effective Date: November 2026 &bull; Last updated: Today
        </p>
      </div>

      {/* Summary Highlight Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
        <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Plain English Summary
        </h2>
        <p className="text-sm text-emerald-800 dark:text-emerald-200/90 leading-relaxed">
          At LifeTools, your privacy is guaranteed by architecture, not just by policy. Your calculations, text documents, uploaded images, QR code inputs, and generated passwords are processed <strong>strictly inside your local web browser</strong>. We do not store, view, upload, or transmit your private data to any remote server.
        </p>
      </div>

      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            1. Client-Side Processing Architecture
          </h2>
          <p>
            Traditional utility websites transmit user data across the public internet to backend processing servers. LifeTools operates entirely differently:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Images:</strong> Manipulated entirely in-memory using HTML5 Canvas and Blob APIs. No photos leave your browser.</li>
            <li><strong>Text & Documents:</strong> Analyzed, cleaned, formatted, and converted entirely on your client CPU.</li>
            <li><strong>Cryptographic Hashes & Passwords:</strong> Generated using the browser's native <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">window.crypto</code> API.</li>
            <li><strong>Financial & Health Calculations:</strong> Math functions run instantaneously without telemetry.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            2. Local Browser Storage
          </h2>
          <p>
            LifeTools does not require accounts or user registration. To provide personalized conveniences, we store small preference entries inside your browser's private <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">localStorage</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
            <li><strong>Theme Preference:</strong> Stores whether you prefer Dark or Light mode.</li>
            <li><strong>Favorite Tools:</strong> Array of tool IDs you have starred for quick access.</li>
            <li><strong>Recent Tools:</strong> Timestamps of the last tools you opened so you can easily return to them.</li>
          </ul>
          <p>
            This data never leaves your device. You can clear this data at any time via the "Clear Favorites" or "Clear History" buttons on the website or by clearing your browser's site cookies/storage.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            3. No Tracking & No Third-Party Cookies
          </h2>
          <p>
            We believe you have a fundamental right to explore the web without being fingerprinted or followed. LifeTools does not use cross-site tracking cookies, behavioral tracking scripts, or ad-targeting pixels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            4. Offline PWA Capabilities
          </h2>
          <p>
            LifeTools implements a modern Service Worker cache. This allows the application assets (HTML, CSS, JavaScript, icons) to be stored locally so you can open and operate tools without an active internet connection. The Service Worker only caches static website bundle assets and never intercepts or records user inputs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            5. Contact Us
          </h2>
          <p>
            If you have questions regarding our privacy architecture, you may reach out via the <a href="#/contact" className="text-indigo-600 dark:text-indigo-400 font-medium underline">Contact page</a> or connect directly with the developer at <a href="https://github.com/officialhazim42" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-medium underline">@officialhazim42</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
