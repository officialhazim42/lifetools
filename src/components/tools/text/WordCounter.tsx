import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    'LifeTools provides a comprehensive, free, privacy-first utility platform. All data processing occurs directly within your browser, ensuring complete confidentiality and instant responsiveness.'
  );

  const getStats = () => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersWithoutSpaces = text.replace(/\s+/g, '').length;
    const paragraphs = trimmed ? trimmed.split(/\n+/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || []).length || (trimmed ? 1 : 0) : 0;

    // Reading time (avg 200 words per minute)
    const readingTimeMinutes = (words / 200).toFixed(1);
    // Speaking time (avg 130 words per minute)
    const speakingTimeMinutes = (words / 130).toFixed(1);

    return {
      words,
      characters,
      charactersWithoutSpaces,
      paragraphs,
      sentences,
      readingTimeMinutes,
      speakingTimeMinutes
    };
  };

  const stats = getStats();

  const handleCopy = () => {
    copyToClipboard(text);
    showToast('Text copied to clipboard!');
  };

  const handleClear = () => {
    setText('');
    showToast('Cleared text area', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Live Stats Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.words.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Words</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.characters.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Characters</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.sentences.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Sentences</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Paragraphs</div>
        </div>
      </div>

      {/* Input area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Input Text
          </label>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
            <button onClick={handleClear} className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
        <textarea
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-base leading-relaxed text-sm"
          placeholder="Paste or type your text here..."
        />
      </div>

      {/* Extended stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-slate-500 block">Characters (No Spaces)</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            {stats.charactersWithoutSpaces.toLocaleString()}
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-slate-500 block">Est. Reading Time</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            ~{stats.readingTimeMinutes} min (200 wpm)
          </span>
        </div>
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
          <span className="text-slate-500 block">Est. Speaking Time</span>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            ~{stats.speakingTimeMinutes} min (130 wpm)
          </span>
        </div>
      </div>
    </div>
  );
};
