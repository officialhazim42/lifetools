import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const HtmlEntityDecoder: React.FC = () => {
  const { showToast } = useToast();
  const [entitiesText, setEntitiesText] = useState('');

  const decode = () => {
    if (!entitiesText) return '';
    try {
      const doc = new DOMParser().parseFromString(entitiesText, 'text/html');
      return doc.documentElement.textContent || '';
    } catch {
      return entitiesText;
    }
  };

  const decoded = decode();

  const handleCopy = () => {
    copyToClipboard(decoded);
    showToast('Decoded text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>HTML Entities Input</span>
            <button
              onClick={() => setEntitiesText('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={8}
            value={entitiesText}
            onChange={(e) => setEntitiesText(e.target.value)}
            className="input-base text-sm font-mono break-all"
            placeholder="Paste HTML entities (&amp;, &#60;, etc.)..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Decoded Text / Symbols</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={decoded}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
