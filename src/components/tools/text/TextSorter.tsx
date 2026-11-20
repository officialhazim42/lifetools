import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2, ArrowUpDown } from 'lucide-react';

export const TextSorter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('Zebra\nApple\nMonkey\nCat\nDog\nElephant\nBear');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'length_asc' | 'length_desc' | 'natural'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);

  const sortLines = () => {
    if (!text) return '';
    const lines = text.split('\n');

    const sorted = [...lines].sort((a, b) => {
      if (sortOrder === 'length_asc') return a.length - b.length;
      if (sortOrder === 'length_desc') return b.length - a.length;
      if (sortOrder === 'natural') {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: caseSensitive ? 'variant' : 'base' });
      }

      const strA = caseSensitive ? a : a.toLowerCase();
      const strB = caseSensitive ? b : b.toLowerCase();
      if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
      if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted.join('\n');
  };

  const result = sortLines();

  const handleCopy = () => {
    copyToClipboard(result);
    showToast('Sorted text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase block mb-1">
            Sort Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="input-base text-xs py-1.5"
          >
            <option value="asc">Alphabetical (A → Z)</option>
            <option value="desc">Alphabetical (Z → A)</option>
            <option value="natural">Natural Sort (Numbers 1, 2, 10)</option>
            <option value="length_asc">Line Length (Shortest first)</option>
            <option value="length_desc">Line Length (Longest first)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-5">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Case Sensitive Sort
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Input Lines</span>
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
            placeholder="Enter lines to sort..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Sorted Output</span>
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
