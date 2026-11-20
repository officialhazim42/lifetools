import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const LineBreakRemover: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    "Often when copying text from PDFs\nor email newsletters, random\nunwanted line breaks interrupt the flow\nof the sentences.\n\nParagraph breaks should be preserved."
  );
  const [replaceWith, setReplaceWith] = useState<'space' | 'comma' | 'semicolon' | 'none'>('space');
  const [preserveParagraphs, setPreserveParagraphs] = useState(true);

  const clean = () => {
    if (!text) return '';
    const replacement =
      replaceWith === 'space'
        ? ' '
        : replaceWith === 'comma'
        ? ', '
        : replaceWith === 'semicolon'
        ? '; '
        : '';

    if (preserveParagraphs) {
      // Split into paragraphs (two or more newlines)
      const paras = text.split(/\n\s*\n/);
      return paras
        .map((p) => p.replace(/\r?\n|\r/g, replacement).replace(/\s+/g, ' ').trim())
        .join('\n\n');
    } else {
      return text.replace(/\r?\n|\r/g, replacement).replace(/\s+/g, ' ').trim();
    }
  };

  const result = clean();

  const handleCopy = () => {
    copyToClipboard(result);
    showToast('Cleaned text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div>
          <span className="mr-2 uppercase">Replace Breaks With:</span>
          <select
            value={replaceWith}
            onChange={(e) => setReplaceWith(e.target.value as any)}
            className="input-base py-1 text-xs w-32"
          >
            <option value="space">Space &quot; &quot;</option>
            <option value="comma">Comma &quot;, &quot;</option>
            <option value="semicolon">Semicolon &quot;; &quot;</option>
            <option value="none">No separator</option>
          </select>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preserveParagraphs}
            onChange={(e) => setPreserveParagraphs(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Preserve Paragraph Breaks (double newlines)
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Input with Line Breaks</span>
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
            placeholder="Paste text with line breaks..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Continuous Text</span>
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
