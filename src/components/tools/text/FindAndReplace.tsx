import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2, Replace } from 'lucide-react';

export const FindAndReplace: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    'The quick brown fox jumps over the lazy dog. The fox was nimble, and the dog was sleepy.'
  );
  const [findStr, setFindStr] = useState('fox');
  const [replaceStr, setReplaceStr] = useState('cat');
  const [matchCase, setMatchCase] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const process = () => {
    if (!text || !findStr) return { result: text, matches: 0 };
    try {
      let pattern = findStr;
      if (!useRegex) {
        // Escape regex special chars
        pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (wholeWord) {
          pattern = `\\b${pattern}\\b`;
        }
      }
      const flags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(pattern, flags);
      const matches = (text.match(regex) || []).length;
      const result = text.replace(regex, replaceStr);
      return { result, matches, error: null };
    } catch (err: any) {
      return { result: text, matches: 0, error: err.message };
    }
  };

  const { result, matches, error } = process();

  const handleCopy = () => {
    copyToClipboard(result);
    showToast('Replaced text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Find
          </label>
          <input
            type="text"
            value={findStr}
            onChange={(e) => setFindStr(e.target.value)}
            className="input-base"
            placeholder="Text to find..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Replace With
          </label>
          <input
            type="text"
            value={replaceStr}
            onChange={(e) => setReplaceStr(e.target.value)}
            className="input-base"
            placeholder="Replacement text..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={matchCase}
            onChange={(e) => setMatchCase(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Match Case
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={wholeWord}
            onChange={(e) => setWholeWord(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Whole Word Only
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useRegex}
            onChange={(e) => setUseRegex(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Regular Expression (Regex)
        </label>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-auto">
          {matches} {matches === 1 ? 'match' : 'matches'} found
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
          Regex error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Input Text</span>
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
            placeholder="Enter source text..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Replaced Output</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={result}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
