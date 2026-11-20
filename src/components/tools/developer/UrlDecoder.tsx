import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2, AlertCircle } from 'lucide-react';

export const UrlDecoder: React.FC = () => {
  const { showToast } = useToast();
  const [encodedUrl, setEncodedUrl] = useState('https%3A%2F%2Flifetools.app%2Fsearch%3Fquery%3Dhello%20world%20%26%20mode%3Doffline');

  const decode = () => {
    if (!encodedUrl.trim()) return { text: '', error: null };
    try {
      const decoded = decodeURIComponent(encodedUrl.trim().replace(/\+/g, ' '));
      return { text: decoded, error: null };
    } catch (err: any) {
      return { text: '', error: 'Malformed percent-encoded URI string.' };
    }
  };

  const { text, error } = decode();

  const handleCopy = () => {
    if (!text) return;
    copyToClipboard(text);
    showToast('Decoded URL copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Encoded URL / URI</span>
            <button
              onClick={() => setEncodedUrl('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={8}
            value={encodedUrl}
            onChange={(e) => setEncodedUrl(e.target.value)}
            className="input-base text-sm font-mono break-all"
            placeholder="Paste percent-encoded URL..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Decoded Result</span>
            <button onClick={handleCopy} disabled={!text} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 disabled:opacity-40">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          {error ? (
            <div className="w-full h-[195px] p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-mono flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <textarea
              rows={8}
              readOnly
              value={text}
              className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
            />
          )}
        </div>
      </div>
    </div>
  );
};
