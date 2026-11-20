import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const HtmlToText: React.FC = () => {
  const { showToast } = useToast();
  const [htmlInput, setHtmlInput] = useState(
    '<article class="post">\n  <h1>LifeTools Platform</h1>\n  <p>Free, <strong>privacy-first</strong> utilities for everyday tasks.</p>\n  <ul>\n    <li>Calculators</li>\n    <li>Converters</li>\n  </ul>\n</article>'
  );

  const convert = () => {
    if (!htmlInput) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');
      return doc.body.textContent || doc.body.innerText || '';
    } catch {
      return htmlInput.replace(/<[^>]*>/g, '');
    }
  };

  const plainText = convert();

  const handleCopy = () => {
    copyToClipboard(plainText);
    showToast('Extracted plain text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>HTML Input</span>
            <button
              onClick={() => setHtmlInput('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste HTML here..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Extracted Plain Text</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={10}
            readOnly
            value={plainText}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
