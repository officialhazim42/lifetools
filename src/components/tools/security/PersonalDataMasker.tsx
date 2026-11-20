import React, { useState } from 'react';
import { EyeOff, Copy, Check, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const PersonalDataMasker: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Contact John Doe at john.doe@example.com or call +91 98765 43210. Billing card 4532-7592-8812-4019, IP 192.168.1.105, Aadhaar 2345 6789 1011.'
  );
  const [maskEmails, setMaskEmails] = useState(true);
  const [maskPhones, setMaskPhones] = useState(true);
  const [maskCards, setMaskCards] = useState(true);
  const [maskAadhaarSsn, setMaskAadhaarSsn] = useState(true);
  const [maskIps, setMaskIps] = useState(true);
  const [copied, setCopied] = useState(false);

  // Apply PII masking rules
  const getMaskedText = () => {
    let result = inputText;

    // Email: j***@domain.com
    if (maskEmails) {
      result = result.replace(
        /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/gi,
        (match, name, domain, ext) => {
          const visible = name.slice(0, 1);
          return `${visible}***@${domain}.${ext}`;
        }
      );
    }

    // Credit Card numbers (16 digits with - or space)
    if (maskCards) {
      result = result.replace(
        /\b(?:\d{4}[ -]?){3}(\d{4})\b/g,
        '****-****-****-$1'
      );
    }

    // Aadhaar (12 digits) / SSN (9 digits)
    if (maskAadhaarSsn) {
      // 12 digit Aadhaar
      result = result.replace(
        /\b\d{4}[ -]\d{4}[ -](\d{4})\b/g,
        'XXXX-XXXX-$1'
      );
      // US SSN (XXX-XX-XXXX)
      result = result.replace(
        /\b\d{3}[ -]\d{2}[ -](\d{4})\b/g,
        'XXX-XX-$1'
      );
    }

    // Phone numbers
    if (maskPhones) {
      result = result.replace(
        /(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?(\d{4})/g,
        (match, last4) => {
          return `***-***-${last4}`;
        }
      );
    }

    // IPv4 addresses
    if (maskIps) {
      result = result.replace(
        /\b(?:[0-9]{1,3}\.){3}([0-9]{1,3})\b/g,
        '***.***.***.$1'
      );
    }

    return result;
  };

  const maskedOutput = getMaskedText();

  const handleCopy = () => {
    navigator.clipboard.writeText(maskedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <EyeOff className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Personal Data & PII Masker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Sanitize and mask sensitive Personally Identifiable Information (emails, phone numbers, credit cards, SSN, IP addresses) before public sharing.
        </p>
      </div>

      {/* Input / Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Original Input Text
          </label>
          <textarea
            rows={8}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste text containing emails, credit cards, or telephone numbers..."
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sanitized & Masked Output
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Masked Text!' : 'Copy Result'}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={maskedOutput}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-300 resize-none font-mono select-all"
            />
          </div>
        </div>
      </div>

      {/* Masking Options */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Enabled PII Masking Rules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maskEmails}
              onChange={e => setMaskEmails(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>Email Addresses (e.g. j***@domain)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maskPhones}
              onChange={e => setMaskPhones(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>Phone Numbers</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maskCards}
              onChange={e => setMaskCards(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>Credit / Debit Cards</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maskAadhaarSsn}
              onChange={e => setMaskAadhaarSsn(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>Aadhaar / SSN Numbers</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maskIps}
              onChange={e => setMaskIps(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>IP Addresses (IPv4)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
