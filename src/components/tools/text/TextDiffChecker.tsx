import React, { useState } from 'react';
import * as Diff from 'diff';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, ArrowRightLeft } from 'lucide-react';

export const TextDiffChecker: React.FC = () => {
  const { showToast } = useToast();
  const [oldText, setOldText] = useState(
    "LifeTools is an open-source utility platform.\nIt features 100+ calculators and converters.\nEverything runs inside your browser."
  );
  const [newText, setNewText] = useState(
    "LifeTools is a free digital utility platform.\nIt features 117+ fast calculators, converters, and developer tools.\nEverything runs privately inside your browser offline."
  );
  const [diffMode, setDiffMode] = useState<'words' | 'lines'>('words');

  const diffParts = diffMode === 'words'
    ? Diff.diffWords(oldText, newText)
    : Diff.diffLines(oldText, newText);

  const additions = diffParts.filter((p) => p.added).length;
  const deletions = diffParts.filter((p) => p.removed).length;

  const handleSwap = () => {
    const temp = oldText;
    setOldText(newText);
    setNewText(temp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setDiffMode('words')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              diffMode === 'words'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}
          >
            Word-by-Word Diff
          </button>
          <button
            onClick={() => setDiffMode('lines')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              diffMode === 'lines'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}
          >
            Line-by-Line Diff
          </button>
        </div>

        <button onClick={handleSwap} className="btn-secondary text-xs py-1.5 flex items-center gap-1.5">
          <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Texts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Original Text (Before)
          </label>
          <textarea
            rows={6}
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste original text..."
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Modified Text (After)
          </label>
          <textarea
            rows={6}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste modified text..."
          />
        </div>
      </div>

      {/* Visual Diff Output */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Comparison Results
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              +{additions} Additions
            </span>
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              -{deletions} Deletions
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words border border-slate-200/60 dark:border-slate-800">
          {diffParts.map((part, index) => {
            if (part.added) {
              return (
                <span
                  key={index}
                  className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-semibold border border-emerald-300 dark:border-emerald-800"
                >
                  {part.value}
                </span>
              );
            }
            if (part.removed) {
              return (
                <span
                  key={index}
                  className="bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 px-1 py-0.5 rounded line-through opacity-80 border border-rose-300 dark:border-rose-800"
                >
                  {part.value}
                </span>
              );
            }
            return <span key={index} className="text-slate-700 dark:text-slate-300">{part.value}</span>;
          })}
        </div>
      </div>
    </div>
  );
};
