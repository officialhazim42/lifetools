import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const TextCleaner: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    '<p>“LifeTools” is <b>revolutionary</b>! It removes ‘smart quotes’, &nbsp; strips HTML tags, &amp; cleans up invisible non-ASCII \u200Bcharacters.</p>'
  );
  const [stripHtml, setStripHtml] = useState(true);
  const [fixSmartQuotes, setFixSmartQuotes] = useState(true);
  const [removeNonAscii, setRemoveNonAscii] = useState(false);
  const [normalizeWhitespace, setNormalizeWhitespace] = useState(true);

  const clean = () => {
    let result = text;
    if (stripHtml) {
      result = result.replace(/<[^>]*>/g, '');
      result = result
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"');
    }
    if (fixSmartQuotes) {
      result = result
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, '-');
    }
    if (removeNonAscii) {
      result = result.replace(/[^\x00-\x7F]/g, '');
    }
    if (normalizeWhitespace) {
      result = result.replace(/[ \t]+/g, ' ').trim();
    }
    return result;
  };

  const cleaned = clean();

  const handleCopy = () => {
    copyToClipboard(cleaned);
    showToast('Cleaned text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={stripHtml}
            onChange={(e) => setStripHtml(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Strip HTML Tags & Entities
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={fixSmartQuotes}
            onChange={(e) => setFixSmartQuotes(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Standardize Curly/Smart Quotes
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={normalizeWhitespace}
            onChange={(e) => setNormalizeWhitespace(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Normalize Whitespace
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={removeNonAscii}
            onChange={(e) => setRemoveNonAscii(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Remove Non-ASCII Characters
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Raw Text</span>
            <button
              onClick={() => setText('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste raw dirty text..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Cleaned Output</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={cleaned}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
