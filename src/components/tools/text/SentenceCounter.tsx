import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const SentenceCounter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    'Digital tools should be universally accessible. Why should basic utilities require complicated subscriptions? LifeTools empowers everyone with client-side privacy!'
  );

  const analyze = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { count: 0, avgWords: 0, shortest: 0, longest: 0, sentences: [] };
    }

    // Split sentences by punctuation (. ? !)
    const rawSentences = trimmed
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const sentenceLengths = rawSentences.map((s) => s.split(/\s+/).filter(Boolean).length);
    const count = rawSentences.length;
    const totalWords = sentenceLengths.reduce((a, b) => a + b, 0);
    const avgWords = count > 0 ? (totalWords / count).toFixed(1) : '0';
    const shortest = sentenceLengths.length > 0 ? Math.min(...sentenceLengths) : 0;
    const longest = sentenceLengths.length > 0 ? Math.max(...sentenceLengths) : 0;

    return {
      count,
      avgWords,
      shortest,
      longest,
      sentences: rawSentences
    };
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
          className="input-base leading-relaxed text-sm"
          placeholder="Paste or write text..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.count}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Total Sentences</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.avgWords}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Avg Words / Sentence</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.shortest}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Shortest (words)</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.longest}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Longest (words)</div>
        </div>
      </div>
    </div>
  );
};
