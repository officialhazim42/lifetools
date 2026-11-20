import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const LineCounter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState("First Line\n\nSecond Line\nThird Line\n\nFourth Line");

  const analyze = () => {
    if (!text) return { total: 0, nonEmpty: 0, empty: 0, maxLineLength: 0, avgLineLength: 0 };
    const lines = text.split('\n');
    const total = lines.length;
    const empty = lines.filter((l) => l.trim().length === 0).length;
    const nonEmpty = total - empty;
    const lengths = lines.map((l) => l.length);
    const maxLineLength = Math.max(...lengths);
    const avgLineLength = (text.length / total).toFixed(1);

    return { total, nonEmpty, empty, maxLineLength, avgLineLength };
  };

  const stats = analyze();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Input Text
          </label>
          <button
            onClick={() => setText('')}
            className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-base text-sm font-mono"
          placeholder="Paste code or text..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.total}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Total Lines</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.nonEmpty}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Non-Empty Lines</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.empty}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Empty Lines</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.maxLineLength}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Max Line Length</div>
        </div>
      </div>
    </div>
  );
};
