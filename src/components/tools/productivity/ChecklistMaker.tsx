import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  ListChecks,
  Plus,
  Trash2,
  Copy,
  Download,
  RotateCcw,
  Check,
  CheckSquare,
  Square
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

const STORAGE_KEY = 'lifetools_checklist_maker';

export const ChecklistMaker: React.FC = () => {
  const { showToast } = useToast();
  const [listTitle, setListTitle] = useState('Deployment & Quality Checklist');
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    return storage.get<ChecklistItem[]>(STORAGE_KEY, [
      { id: 'c1', text: 'Validate responsive layouts across 320px to 1920px', checked: true },
      { id: 'c2', text: 'Verify unit and integration test assertions pass', checked: true },
      { id: 'c3', text: 'Run full production TypeScript & Vite compilation', checked: true },
      { id: 'c4', text: 'Audit offline service worker caching & manifest', checked: false },
      { id: 'c5', text: 'Confirm zero external analytics or paid APIs', checked: false }
    ]);
  });

  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    storage.set(STORAGE_KEY, items);
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    setItems(prev => [
      ...prev,
      { id: 'chk_' + Date.now(), text: newItemText.trim(), checked: false }
    ]);
    setNewItemText('');
  };

  const handleToggle = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleReset = () => {
    setItems(prev => prev.map(i => ({ ...i, checked: false })));
    showToast('All items unmarked');
  };

  const handleCopyMarkdown = () => {
    const lines = [`# ${listTitle}`, ''];
    items.forEach(i => {
      lines.push(`- [${i.checked ? 'x' : ' '}] ${i.text}`);
    });
    copyToClipboard(lines.join('\n'));
    showToast('Checklist copied as Markdown!');
  };

  const completed = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <input
            type="text"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            className="text-lg font-bold text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none flex-1"
          />

          <div className="flex items-center gap-2">
            <button onClick={handleCopyMarkdown} className="btn-secondary text-xs py-1.5 px-2.5" title="Copy Markdown">
              <Copy className="w-3.5 h-3.5" /> Markdown
            </button>
            <button onClick={handleReset} className="btn-secondary text-xs py-1.5 px-2.5 text-rose-500">
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress: {completed} of {items.length} items checked</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Item Bar */}
      <form onSubmit={handleAddItem} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Add a checklist step or item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="input-base text-xs flex-1"
        />
        <button type="submit" className="btn-primary text-xs py-2 px-4 shrink-0">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Items List */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle divide-y divide-slate-100 dark:divide-slate-800/60">
        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No items in this checklist. Add one above!
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="py-3 px-2 flex items-center justify-between gap-3 group transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 rounded-xl"
            >
              <div
                onClick={() => handleToggle(item.id)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span
                  className={`text-xs font-medium leading-relaxed ${
                    item.checked
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {item.text}
                </span>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 transition-opacity shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
