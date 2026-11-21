import React, { useState } from 'react';
import { Scissors, Copy, Check, ShieldCheck, RefreshCw } from 'lucide-react';

export const SensitiveTextRedactor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [redactStyle, setRedactStyle] = useState<'block' | 'tag' | 'stars' | 'confidential'>('block');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(true);
  const [copied, setCopied] = useState(false);

  const getRedactedText = () => {
    let result = inputText;
    const terms = keywords
      .split(/[,;\n]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    terms.forEach(term => {
      try {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(pattern, flags);

        result = result.replace(regex, match => {
          if (redactStyle === 'block') return '█'.repeat(match.length);
          if (redactStyle === 'stars') return '*'.repeat(match.length);
          if (redactStyle === 'tag') return '[REDACTED]';
          if (redactStyle === 'confidential') return '[CONFIDENTIAL]';
          return '██████';
        });
      } catch {
        // ignore regex error
      }
    });

    return result;
  };

  const redactedOutput = getRedactedText();

  const handleCopy = () => {
    navigator.clipboard.writeText(redactedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Scissors className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sensitive Text Redactor
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Black out sensitive terms, trade secrets, names, and classified keywords using customizable redaction bars.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Source Document / Memo
            </label>
            <textarea
              rows={6}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Paste document to redact..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Terms & Names to Redact (comma or newline separated)
            </label>
            <textarea
              rows={3}
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="Enter terms, names, or sensitive keywords to redact..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans"
            />
          </div>
        </div>

        {/* Output */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Redacted Document Output
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Redacted Text!' : 'Copy Redacted Text'}
              </button>
            </div>
            <textarea
              readOnly
              rows={11}
              value={redactedOutput}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none font-sans select-all leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Style & Match Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Redaction Style & Behavior
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'block', label: 'Black Bars (████)' },
              { id: 'tag', label: '[REDACTED]' },
              { id: 'confidential', label: '[CONFIDENTIAL]' },
              { id: 'stars', label: 'Asterisks (****)' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setRedactStyle(s.id as any)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${redactStyle === s.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wholeWord}
                onChange={e => setWholeWord(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Whole Words Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={e => setCaseSensitive(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Case Sensitive</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
