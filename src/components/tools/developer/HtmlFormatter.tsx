import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const HtmlFormatter: React.FC = () => {
  const { showToast } = useToast();
  const [htmlInput, setHtmlInput] = useState(
    '<div class="card"><h1>Title</h1><p>Description text</p><button class="btn">Click</button></div>'
  );

  const formatHtml = (html: string): string => {
    let formatted = '';
    let indent = '';
    const tab = '  ';

    html.split(/>\s*</).forEach((element) => {
      if (element.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + element + '>\r\n';
      if (
        element.match(/^<?\w[^>]*[^\/]$/) &&
        !element.startsWith('input') &&
        !element.startsWith('img') &&
        !element.startsWith('br') &&
        !element.startsWith('hr') &&
        !element.startsWith('meta') &&
        !element.startsWith('link')
      ) {
        indent += tab;
      }
    });

    return formatted.substring(1, formatted.length - 3);
  };

  const formatted = htmlInput.trim() ? formatHtml(htmlInput.trim()) : '';

  const handleCopy = () => {
    copyToClipboard(formatted);
    showToast('Formatted HTML copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Raw HTML</span>
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
            placeholder="Paste compact HTML..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Formatted HTML</span>
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
