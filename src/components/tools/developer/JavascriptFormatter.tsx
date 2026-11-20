import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const JavascriptFormatter: React.FC = () => {
  const { showToast } = useToast();
  const [code, setCode] = useState(
    'function calculateSum(a,b){if(a>0&&b>0){return a+b;}else{return 0;}}const result=calculateSum(10,20);'
  );

  const formatJs = (js: string): string => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    // Simple tokenizer for indentation and clean lines
    const tokens = js
      .replace(/([{};])/g, ' $1 ')
      .split(/\s+/)
      .filter(Boolean);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === '}') {
        indent = Math.max(0, indent - 1);
        formatted += '\n' + tab.repeat(indent) + '}';
      } else if (token === '{') {
        formatted += ' {\n';
        indent++;
        formatted += tab.repeat(indent);
      } else if (token === ';') {
        formatted += ';\n' + tab.repeat(indent);
      } else {
        formatted += (i > 0 && !formatted.endsWith('\n') && !formatted.endsWith(tab) && !formatted.endsWith('(') ? ' ' : '') + token;
      }
    }

    return formatted.replace(/\n\s*\n/g, '\n').trim();
  };

  const formatted = code.trim() ? formatJs(code.trim()) : '';

  const handleCopy = () => {
    copyToClipboard(formatted);
    showToast('Formatted JavaScript copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Raw JS / TS Code</span>
            <button
              onClick={() => setCode('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste JavaScript..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Formatted Output</span>
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
