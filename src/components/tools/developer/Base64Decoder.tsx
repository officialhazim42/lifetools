import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2, AlertCircle } from 'lucide-react';

export const Base64Decoder: React.FC = () => {
  const { showToast } = useToast();
  const [base64Input, setBase64Input] = useState('');

  const decode = () => {
    if (!base64Input.trim()) return { text: '', error: null };
    try {
      let clean = base64Input.trim();
      // Restore URL-safe characters
      clean = clean.replace(/-/g, '+').replace(/_/g, '/');
      // Pad if needed
      while (clean.length % 4) {
        clean += '=';
      }
      const rawDecoded = atob(clean);
      const text = decodeURIComponent(escape(rawDecoded));
      return { text, error: null };
    } catch (err: any) {
      return { text: '', error: 'Invalid Base64 sequence or corrupted character encoding.' };
    }
  };

  const { text, error } = decode();

  const handleCopy = () => {
    if (!text) return;
    copyToClipboard(text);
    showToast('Decoded text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Base64 Input</span>
            <button
              onClick={() => setBase64Input('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={8}
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            className="input-base text-sm font-mono break-all"
            placeholder="Paste Base64 encoded string..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Decoded Text (UTF-8)</span>
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
