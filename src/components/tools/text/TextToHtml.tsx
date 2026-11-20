import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const TextToHtml: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState(
    'Welcome to LifeTools.\n\nParagraphs are automatically wrapped in <p> tags.\nLine breaks become <br/> tags & special characters are escaped.'
  );
  const [wrapParagraphs, setWrapParagraphs] = useState(true);

  const convert = () => {
    if (!text) return '';
    // Escape HTML entities
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    if (wrapParagraphs) {
      const paras = escaped
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
        .join('\n');
      return paras;
    } else {
      return escaped.replace(/\n/g, '<br/>\n');
    }
  };

  const htmlResult = convert();

  const handleCopy = () => {
    copyToClipboard(htmlResult);
    showToast('HTML code copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={wrapParagraphs}
            onChange={(e) => setWrapParagraphs(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Wrap Blocks in &lt;p&gt; Paragraph Tags
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Plain Text Input</span>
            <button
              onClick={() => setText('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Type or paste plain text..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>HTML Output</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy HTML
            </button>
          </div>
          <textarea
            rows={10}
            readOnly
            value={htmlResult}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
