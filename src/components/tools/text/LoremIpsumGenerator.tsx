import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RefreshCw } from 'lucide-react';

export const LoremIpsumGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);

  const sentences = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus eu gravida integer eu augue augue.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.",
    "Donec eu libero sit amet quam egestas semper.",
    "Aenean ultricies mi vitae est mauris placerat eleifend leo.",
    "Quisque sit amet est et sapien ullamcorper pharetra.",
    "Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi."
  ];

  const generate = () => {
    let result = '';
    const n = Math.max(1, count);

    if (type === 'words') {
      const allWords = sentences.join(' ').replace(/[.,]/g, '').split(/\s+/);
      let selected: string[] = [];
      while (selected.length < n) {
        selected.push(...allWords);
      }
      selected = selected.slice(0, n);
      if (startWithLorem && selected.length >= 2) {
        selected[0] = 'Lorem';
        selected[1] = 'ipsum';
      }
      result = selected.join(' ') + '.';
    } else if (type === 'sentences') {
      const selected: string[] = [];
      for (let i = 0; i < n; i++) {
        selected.push(sentences[i % sentences.length]);
      }
      result = selected.join(' ');
    } else {
      // Paragraphs
      const paras: string[] = [];
      for (let p = 0; p < n; p++) {
        const pSentences: string[] = [];
        const numS = 4 + (p % 3);
        for (let s = 0; s < numS; s++) {
          pSentences.push(sentences[(p * 4 + s) % sentences.length]);
        }
        paras.push(pSentences.join(' '));
      }
      result = paras.join('\n\n');
    }

    return result;
  };

  const text = generate();

  const handleCopy = () => {
    copyToClipboard(text);
    showToast('Lorem Ipsum copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="input-base"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Count ({type})
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value) || 1))}
            className="input-base"
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Start with &ldquo;Lorem ipsum...&rdquo;
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Generated Placeholder Text
          </label>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy Text
          </button>
        </div>
        <textarea
          rows={10}
          readOnly
          value={text}
          className="input-base text-sm leading-relaxed"
        />
      </div>
    </div>
  );
};
