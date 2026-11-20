import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const DuplicateWordRemover: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    'This is is a simple tool to find and remove duplicate duplicate words that often occur occur while typing.'
  );
  const [mode, setMode] = useState<'consecutive' | 'all'>('consecutive');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const clean = () => {
    if (!text) return { result: '', removedCount: 0 };
    const words = text.split(/(\s+)/); // keep whitespace tokens
    let removedCount = 0;

    if (mode === 'consecutive') {
      const output: string[] = [];
      let lastWord = '';

      for (let i = 0; i < words.length; i++) {
        const token = words[i];
        if (/^\s+$/.test(token)) {
          // Whitespace token
          output.push(token);
          continue;
        }

        const compWord = caseSensitive ? token : token.toLowerCase();
        if (compWord === lastWord) {
          removedCount++;
          // skip adding this word and remove the previous whitespace if any
          if (output.length > 0 && /^\s+$/.test(output[output.length - 1])) {
            output.pop();
          }
        } else {
          output.push(token);
          lastWord = compWord;
        }
      }
      return { result: output.join(''), removedCount };
    } else {
      // Remove all duplicate words in passage
      const seen = new Set<string>();
      const output: string[] = [];

      for (let i = 0; i < words.length; i++) {
        const token = words[i];
        if (/^\s+$/.test(token)) {
          output.push(token);
          continue;
        }

        const compWord = caseSensitive ? token : token.toLowerCase();
        if (seen.has(compWord)) {
          removedCount++;
          if (output.length > 0 && /^\s+$/.test(output[output.length - 1])) {
            output.pop();
          }
        } else {
          seen.add(compWord);
          output.push(token);
        }
      }
      return { result: output.join(''), removedCount };
    }
  };

  const { result, removedCount } = clean();

  const handleCopy = () => {
    copyToClipboard(result);
    showToast('Cleaned text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div>
          <span className="mr-2 uppercase">Deduplication Mode:</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="input-base py-1 text-xs w-48"
          >
            <option value="consecutive">Consecutive duplicates only (&ldquo;the the&rdquo;)</option>
            <option value="all">All duplicate words globally</option>
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Case Sensitive Matching
        </label>

        <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-auto">
          {removedCount} {removedCount === 1 ? 'word' : 'words'} removed
        </span>
      </div>

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
            className="input-base text-sm leading-relaxed"
            placeholder="Type text with repeated words..."
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
            value={result}
            className="input-base text-sm leading-relaxed bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
