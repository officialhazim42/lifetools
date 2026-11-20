import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const UrlEncoder: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('https://lifetools.app/search?query=hello world & mode=offline&filter=all');
  const [encodeMode, setEncodeMode] = useState<'component' | 'full'>('component');

  const encode = () => {
    if (!text) return '';
    try {
      return encodeMode === 'component' ? encodeURIComponent(text) : encodeURI(text);
    } catch (err: any) {
      return err.message;
    }
  };

  const encoded = encode();

  const handleCopy = () => {
    copyToClipboard(encoded);
    showToast('Encoded URL copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div>
          <span className="mr-2 uppercase">Encoding Standard:</span>
          <select
            value={encodeMode}
            onChange={(e) => setEncodeMode(e.target.value as any)}
            className="input-base py-1 text-xs w-48"
          >
            <option value="component">encodeURIComponent (All special chars)</option>
            <option value="full">encodeURI (Preserve URL protocol / domain)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Input String</span>
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
            placeholder="Enter URL or parameter..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Encoded URL Output</span>
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
