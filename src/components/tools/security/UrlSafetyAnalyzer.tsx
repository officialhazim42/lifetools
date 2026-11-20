import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Copy, Check, ExternalLink, Link2, Search } from 'lucide-react';

interface SecurityIssue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export const UrlSafetyAnalyzer: React.FC = () => {
  const [urlInput, setUrlInput] = useState('https://login.apple.com.secure-verify-auth.xyz/login?utm_source=phish&redirect=http://malicious.site');
  const [copiedClean, setCopiedClean] = useState(false);

  const analyzeUrl = (raw: string) => {
    let parsed: URL;
    try {
      const normalized = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
      parsed = new URL(normalized);
    } catch {
      return { isValid: false, issues: [], cleanUrl: '', hostname: '', protocol: '', params: [] };
    }

    const issues: SecurityIssue[] = [];

    // 1. Insecure protocol
    if (parsed.protocol === 'http:') {
      issues.push({
        severity: 'high',
        title: 'Insecure Protocol (HTTP)',
        description: 'Connection is unencrypted. Login credentials or sensitive tokens transmitted in plaintext can be intercepted.'
      });
    }

    // 2. Punycode / IDN Homograph
    if (parsed.hostname.startsWith('xn--') || /[^\x00-\x7F]/.test(parsed.hostname)) {
      issues.push({
        severity: 'high',
        title: 'Punycode / Homograph Spoofing Detected',
        description: 'Hostname uses internationalized characters (IDN) which can spoof familiar brands (e.g., Cyrillic "а" resembling Latin "a").'
      });
    }

    // 3. Raw IP Address
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
      issues.push({
        severity: 'high',
        title: 'Raw IP Address Hostname',
        description: 'URL directs directly to an IP address rather than a registered domain name, common in phishing and botnets.'
      });
    }

    // 4. Excessive subdomains (e.g. apple.com.login.verify...)
    const parts = parsed.hostname.split('.');
    if (parts.length >= 4) {
      issues.push({
        severity: 'medium',
        title: 'Suspicious Subdomain Nesting',
        description: 'Multiple nested subdomains often mimic trusted domains (e.g., paypal.com.attacker.com).'
      });
    }

    // 5. Non-standard port
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      issues.push({
        severity: 'medium',
        title: `Non-Standard Port (:${parsed.port})`,
        description: 'Standard web traffic uses ports 80 or 443. Non-standard ports may bypass proxy inspections.'
      });
    }

    // 6. Suspicious query redirect parameters
    const redirectParams = ['redirect', 'url', 'next', 'return', 'dest', 'target'];
    const foundRedirect = Array.from(parsed.searchParams.keys()).find(k =>
      redirectParams.includes(k.toLowerCase())
    );
    if (foundRedirect) {
      issues.push({
        severity: 'medium',
        title: `Open Redirect Parameter Detected (?${foundRedirect}=)`,
        description: 'The URL contains a redirection parameter which attackers frequently use for phishing bypass.'
      });
    }

    // Clean tracking parameters (UTM, fbclid, etc.)
    const cleanParams = new URLSearchParams(parsed.search);
    const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'mc_eid'];
    trackingKeys.forEach(k => cleanParams.delete(k));

    const cleanUrl = `${parsed.protocol}//${parsed.host}${parsed.pathname}${cleanParams.toString() ? '?' + cleanParams.toString() : ''}${parsed.hash}`;

    const paramsList = Array.from(parsed.searchParams.entries());

    return {
      isValid: true,
      issues,
      cleanUrl,
      hostname: parsed.hostname,
      protocol: parsed.protocol,
      pathname: parsed.pathname,
      params: paramsList
    };
  };

  const analysis = analyzeUrl(urlInput);

  const handleCopyClean = () => {
    if (!analysis.cleanUrl) return;
    navigator.clipboard.writeText(analysis.cleanUrl);
    setCopiedClean(true);
    setTimeout(() => setCopiedClean(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          URL Safety & Phishing Analyzer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Audit suspicious links, expose homograph IDN phishing tricks, inspect query parameters, and strip tracking tokens.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Target URL to Analyze
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Paste any link or domain..."
              className="w-full px-4 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Clean URL action */}
        {analysis.cleanUrl && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
            <div className="truncate max-w-lg">
              <span className="font-semibold text-slate-500 mr-2">Clean Tracking-Free URL:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{analysis.cleanUrl}</span>
            </div>
            <button
              onClick={handleCopyClean}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shrink-0 transition-colors"
            >
              {copiedClean ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedClean ? 'Copied Clean URL!' : 'Copy Clean URL'}
            </button>
          </div>
        )}
      </div>

      {/* Risk Summary */}
      {analysis.isValid && (
        <div className="space-y-4">
          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              analysis.issues.length === 0
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                : analysis.issues.some(i => i.severity === 'high')
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {analysis.issues.length === 0 ? (
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-rose-500" />
              )}
            </div>
            <h2 className="text-xl font-bold">
              {analysis.issues.length === 0
                ? 'No Common Security Red Flags Detected'
                : `${analysis.issues.length} Potential Security Concerns Flagged`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hostname: <strong className="font-mono">{analysis.hostname}</strong> ({analysis.protocol})
            </p>
          </div>

          {/* Issues List */}
          {analysis.issues.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Security Audit Findings
              </h3>
              <div className="space-y-2">
                {analysis.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      issue.severity === 'high'
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-900 dark:text-rose-200'
                        : 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${issue.severity === 'high' ? 'text-rose-500' : 'text-amber-500'}`} />
                    <div>
                      <div className="font-bold text-xs">{issue.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{issue.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query Parameters Deconstruction */}
          {analysis.params.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                URL Query Parameters ({analysis.params.length})
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {analysis.params.map(([k, v], idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-4">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{k}</span>
                    <span className="text-slate-500 truncate max-w-md">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
