import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const CharacterCounter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('LifeTools: Modern & Secure Utilities 2026!');

  const analyze = () => {
    const total = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const punctuation = (text.match(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'’]/g) || []).length;
    const lines = text ? text.split('\n').length : 0;

    return { total, noSpaces, letters, digits, spaces, punctuation, lines };
  };

  const stats = analyze();

  const handleCopy = () => {
    copyToClipboard(text);
    showToast('Text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Input Text
          </label>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <button
              onClick={() => setText('')}
              className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-base leading-relaxed text-sm font-mono"
          placeholder="Type or paste text..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Total Characters</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.noSpaces.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Without Spaces</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.letters.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Letters (A-Z)</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.digits.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Digits (0-9)</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-slate-500 block">Spaces & Whitespace</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">{stats.spaces}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-slate-500 block">Punctuation & Symbols</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">{stats.punctuation}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-slate-500 block">Total Lines</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">{stats.lines}</span>
        </div>
      </div>
    </div>
  );
};
