import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  StickyNote,
  Plus,
  Trash2,
  Copy,
  RotateCcw
} from 'lucide-react';
import { copyToClipboard } from '../../../utils/formatters';

interface StickyItem {
  id: string;
  text: string;
  color: 'yellow' | 'emerald' | 'blue' | 'pink' | 'purple' | 'amber';
  createdAt: number;
}

const STORAGE_KEY = 'lifetools_sticky_notes';

const COLOR_MAP = {
  yellow: 'bg-yellow-100 dark:bg-yellow-950/70 border-yellow-300 dark:border-yellow-700/60 text-yellow-900 dark:text-yellow-100',
  emerald: 'bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-100',
  blue: 'bg-sky-100 dark:bg-sky-950/70 border-sky-300 dark:border-sky-700/60 text-sky-900 dark:text-sky-100',
  pink: 'bg-pink-100 dark:bg-pink-950/70 border-pink-300 dark:border-pink-700/60 text-pink-900 dark:text-pink-100',
  purple: 'bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-700/60 text-purple-900 dark:text-purple-100',
  amber: 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-100'
};

const COLOR_PALETTE: StickyItem['color'][] = ['yellow', 'emerald', 'blue', 'pink', 'purple', 'amber'];

export const StickyNotes: React.FC = () => {
  const { showToast } = useToast();
  const [stickies, setStickies] = useState<StickyItem[]>(() => {
    return storage.get<StickyItem[]>(STORAGE_KEY, [
      {
        id: 'sticky_1',
        text: '📌 Welcome! Click anywhere on this sticky note to edit its content in real-time.',
        color: 'yellow',
        createdAt: Date.now()
      },
      {
        id: 'sticky_2',
        text: '💡 All sticky notes are autosaved locally in your browser storage with zero cloud dependencies.',
        color: 'emerald',
        createdAt: Date.now() - 1000
      }
    ]);
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, stickies);
  }, [stickies]);

  const handleAddSticky = (color: StickyItem['color'] = 'yellow') => {
    const newSticky: StickyItem = {
      id: 'sticky_' + Date.now(),
      text: '',
      color,
      createdAt: Date.now()
    };
    setStickies(prev => [newSticky, ...prev]);
    showToast('New sticky note pinned!');
  };

  const handleUpdateText = (id: string, text: string) => {
    setStickies(prev =>
      prev.map(s => (s.id === id ? { ...s, text } : s))
    );
  };

  const handleChangeColor = (id: string, color: StickyItem['color']) => {
    setStickies(prev =>
      prev.map(s => (s.id === id ? { ...s, color } : s))
    );
  };

  const handleDelete = (id: string) => {
    setStickies(prev => prev.filter(s => s.id !== id));
    showToast('Sticky note removed', 'info');
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    showToast('Note copied to clipboard!');
  };

  const handleClearAll = () => {
    if (stickies.length === 0) return;
    setStickies([]);
    showToast('All sticky notes cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Control Ribbon */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Sticky Board ({stickies.length})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Add color:</span>
          {COLOR_PALETTE.map(c => (
            <button
              key={c}
              onClick={() => handleAddSticky(c)}
              className={`w-6 h-6 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-110 active:scale-95 ${
                c === 'yellow' ? 'bg-yellow-300' :
                c === 'emerald' ? 'bg-emerald-400' :
                c === 'blue' ? 'bg-sky-400' :
                c === 'pink' ? 'bg-pink-400' :
                c === 'purple' ? 'bg-purple-400' : 'bg-amber-400'
              }`}
              title={`Add ${c} note`}
            />
          ))}

          <button
            onClick={() => handleAddSticky('yellow')}
            className="btn-primary text-xs py-1.5 ml-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add Note
          </button>

          {stickies.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn-secondary text-xs py-1.5 text-rose-500 hover:text-rose-600"
            >
              Clear Board
            </button>
          )}
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stickies.map(sticky => (
          <div
            key={sticky.id}
            className={`p-4 rounded-2xl border shadow-sm transition-all flex flex-col justify-between min-h-[220px] ${COLOR_MAP[sticky.color]}`}
          >
            <textarea
              value={sticky.text}
              onChange={(e) => handleUpdateText(sticky.id, e.target.value)}
              placeholder="Write your quick reminder here..."
              className="w-full flex-1 bg-transparent resize-none border-0 text-sm focus:outline-none placeholder:text-current placeholder:opacity-40 leading-relaxed font-sans"
            />

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-1">
                {COLOR_PALETTE.map(c => (
                  <button
                    key={c}
                    onClick={() => handleChangeColor(sticky.id, c)}
                    className={`w-3.5 h-3.5 rounded-full border border-black/20 ${
                      c === 'yellow' ? 'bg-yellow-400' :
                      c === 'emerald' ? 'bg-emerald-400' :
                      c === 'blue' ? 'bg-sky-400' :
                      c === 'pink' ? 'bg-pink-400' :
                      c === 'purple' ? 'bg-purple-400' : 'bg-amber-400'
                    } ${sticky.color === c ? 'ring-1 ring-black dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title={`Switch to ${c}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopy(sticky.text)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="Copy text"
                >
                  <Copy className="w-3.5 h-3.5 opacity-80 hover:opacity-100" />
                </button>
                <button
                  onClick={() => handleDelete(sticky.id)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-rose-600 dark:text-rose-400"
                  title="Delete sticky"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
