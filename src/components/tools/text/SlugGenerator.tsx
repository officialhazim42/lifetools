import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const SlugGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [inputTitle, setInputTitle] = useState('');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);

  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
  ]);

  const generateSlug = () => {
    let str = inputTitle.trim();
    if (!str) return '';

    if (removeStopWords) {
      str = str
        .split(/\s+/)
        .filter((w) => !stopWords.has(w.toLowerCase()))
        .join(' ');
    }

    if (lowercase) {
      str = str.toLowerCase();
    }

    // Normalize accents (e.g. é -> e)
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Replace non-alphanumeric with separator
    const sepEsc = separator === '-' ? '-' : '_';
    str = str
      .replace(/[^a-zA-Z0-9]+/g, sepEsc)
      .replace(new RegExp(`^\\${sepEsc}+|\\${sepEsc}+$`, 'g'), '');

    return str;
  };

  const slug = generateSlug();

  const handleCopy = () => {
    copyToClipboard(slug);
    showToast('URL slug copied!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
          Article or Page Title
        </label>
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          className="input-base text-base font-medium"
          placeholder="Enter title or string..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div>
          <span className="mr-2 uppercase">Separator:</span>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value as any)}
            className="input-base py-1 text-xs w-28"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
          </select>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Force Lowercase
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={removeStopWords}
            onChange={(e) => setRemoveStopWords(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Remove Stop Words (a, the, in, to...)
        </label>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
            Generated URL Slug
          </h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy Slug
          </button>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-mono text-sm break-all font-semibold text-emerald-600 dark:text-emerald-400">
          {slug || <span className="text-slate-400 italic">No slug generated</span>}
        </div>
        <div className="text-[11px] text-slate-500">
          Example URL: <code className="text-slate-700 dark:text-slate-300">https://example.com/posts/{slug || 'my-slug'}</code>
        </div>
      </div>
    </div>
  );
};
