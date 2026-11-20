import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const CssFormatter: React.FC = () => {
  const { showToast } = useToast();
  const [cssInput, setCssInput] = useState(
    '.btn{display:inline-block;padding:8px 16px;background:#10b981;color:#fff;border-radius:8px}.btn:hover{background:#059669}'
  );

  const formatCss = (css: string): string => {
    return css
      .replace(/\s*{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*}\s*/g, '\n}\n\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/  }/g, '}')
      .trim();
  };

  const formatted = cssInput.trim() ? formatCss(cssInput.trim()) : '';

  const handleCopy = () => {
    copyToClipboard(formatted);
    showToast('Formatted CSS copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Raw CSS</span>
            <button
              onClick={() => setCssInput('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={cssInput}
            onChange={(e) => setCssInput(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste CSS rules..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Clean Formatted CSS</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={10}
            readOnly
            value={formatted}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
