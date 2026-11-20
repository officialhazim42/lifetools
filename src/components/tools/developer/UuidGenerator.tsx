import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RefreshCw } from 'lucide-react';

export const UuidGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [wrapBraces, setWrapBraces] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuids = () => {
    const list: string[] = [];
    const count = Math.min(100, Math.max(1, quantity));

    for (let i = 0; i < count; i++) {
      let u = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

      if (removeHyphens) {
        u = u.replace(/-/g, '');
      }
      if (uppercase) {
        u = u.toUpperCase();
      }
      if (wrapBraces) {
        u = `{${u}}`;
      }
      list.push(u);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateUuids();
  }, [quantity, uppercase, removeHyphens, wrapBraces]);

  const handleCopyAll = () => {
    copyToClipboard(uuids.join('\n'));
    showToast(`Copied ${uuids.length} UUIDs!`);
  };

  const handleCopySingle = (u: string) => {
    copyToClipboard(u);
    showToast('UUID copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Quantity (1 – 100)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="input-base"
          />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Uppercase (A-Z)
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={removeHyphens}
              onChange={(e) => setRemoveHyphens(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Remove Hyphens
          </label>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={wrapBraces}
              onChange={(e) => setWrapBraces(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Wrap with Braces {'{...}'}
          </label>
        </div>

        <div className="flex gap-2 pt-4">
          <button onClick={generateUuids} className="btn-primary flex-1 text-xs py-2.5">
            <RefreshCw className="w-4 h-4" /> Re-Generate
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
            Generated Version 4 UUIDs (Cryptographically Secure)
          </h3>
          <button onClick={handleCopyAll} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy All ({uuids.length})
          </button>
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {uuids.map((u, i) => (
            <div
              key={i}
              onClick={() => handleCopySingle(u)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-emerald-400 cursor-pointer hover:border-emerald-500/60 group transition-all"
            >
              <span>{u}</span>
              <Copy className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
