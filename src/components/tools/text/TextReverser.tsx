import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const TextReverser: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('LifeTools makes everyday digital tasks fast and secure.');
  const [mode, setMode] = useState<'chars' | 'words' | 'words_letters' | 'lines'>('chars');

  const reverse = () => {
    if (!text) return '';
    switch (mode) {
      case 'chars':
        return text.split('').reverse().join('');
      case 'words':
        return text.split(/\s+/).reverse().join(' ');
      case 'words_letters':
        return text
          .split(' ')
          .map((w) => w.split('').reverse().join(''))
          .join(' ');
      case 'lines':
        return text.split('\n').reverse().join('\n');
    }
  };

  const result = reverse();

  const handleCopy = () => {
    copyToClipboard(result);
    showToast('Reversed text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode('chars')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'chars'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Reverse All Characters
        </button>
        <button
          onClick={() => setMode('words')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'words'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Reverse Word Order
        </button>
        <button
          onClick={() => setMode('words_letters')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'words_letters'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Reverse Each Word Letters
        </button>
        <button
          onClick={() => setMode('lines')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            mode === 'lines'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
          }`}
        >
          Reverse Lines
        </button>
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
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Type text..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Reversed Output</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={7}
            readOnly
            value={result}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
