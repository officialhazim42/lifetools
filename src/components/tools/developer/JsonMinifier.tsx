import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const JsonMinifier: React.FC = () => {
  const { showToast } = useToast();
  const [inputJson, setInputJson] = useState('{\n  "title": "LifeTools",\n  "status": "ready",\n  "fast": true\n}');

  const minify = () => {
    if (!inputJson.trim()) return { minified: '', error: null, savings: 0 };
    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      const savings = inputJson.length > 0 ? Math.round(((inputJson.length - minified.length) / inputJson.length) * 100) : 0;
      return { minified, error: null, savings };
    } catch (err: any) {
      return { minified: '', error: err.message, savings: 0 };
    }
  };

  const { minified, error, savings } = minify();

  const handleCopy = () => {
    if (!minified) return;
    copyToClipboard(minified);
    showToast('Minified JSON copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Original JSON ({inputJson.length} bytes)</span>
            <button
              onClick={() => setInputJson('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste pretty JSON..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Minified Output ({minified.length} bytes, {savings}% smaller)</span>
            <button onClick={handleCopy} disabled={!minified} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 disabled:opacity-40">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          {error ? (
            <div className="w-full h-[240px] p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-mono">
              Invalid JSON: {error}
            </div>
          ) : (
            <textarea
              rows={10}
              readOnly
              value={minified}
              className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
            />
          )}
        </div>
      </div>
    </div>
  );
};
