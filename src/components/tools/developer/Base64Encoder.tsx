import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const Base64Encoder: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);

  const encode = () => {
    if (!text) return '';
    try {
      // UTF-8 safe base64 encoding
      let encoded = btoa(unescape(encodeURIComponent(text)));
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      return encoded;
    } catch (err: any) {
      return `Encoding error: ${err.message}`;
    }
  };

  const encoded = encode();

  const handleCopy = () => {
    copyToClipboard(encoded);
    showToast('Base64 string copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => setUrlSafe(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          URL-Safe Base64 (replace &ldquo;+&rdquo; with &ldquo;-&rdquo;, &ldquo;/&rdquo; with &ldquo;_&rdquo;, strip &ldquo;=&rdquo;)
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Plain Text Input (UTF-8)</span>
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
            placeholder="Type or paste text..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Base64 Encoded Output</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={8}
            readOnly
            value={encoded}
            className="input-base text-sm font-mono break-all bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
