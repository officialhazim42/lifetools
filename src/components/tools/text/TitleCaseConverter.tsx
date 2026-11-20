import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const TitleCaseConverter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('the quick brown fox jumps over the lazy dog and runs into the woods');

  const minorWords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'with', 'in', 'of', 'as', 'via'
  ]);

  const toEditorialTitleCase = (str: string): string => {
    return str
      .split('\n')
      .map((line) => {
        const words = line.split(/\s+/);
        return words
          .map((word, index) => {
            if (!word) return '';
            const lower = word.toLowerCase();
            const isFirst = index === 0;
            const isLast = index === words.length - 1;

            if (!isFirst && !isLast && minorWords.has(lower)) {
              return lower;
            }
            return lower.charAt(0).toUpperCase() + lower.slice(1);
          })
          .join(' ');
      })
      .join('\n');
  };

  const titleCased = toEditorialTitleCase(text);

  const handleCopy = () => {
    copyToClipboard(titleCased);
    showToast('Title case copied!');
  };

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
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-base text-sm"
          placeholder="Enter sentence or headline..."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Title Cased Result (Editorial Standard)
          </label>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
        <textarea
          rows={5}
          readOnly
          value={titleCased}
          className="input-base text-sm bg-slate-50 dark:bg-slate-850 font-medium text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};
