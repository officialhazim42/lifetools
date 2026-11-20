import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Download, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const { showToast } = useToast();
  const [inputJson, setInputJson] = useState(
    '{"name":"LifeTools","version":1.0,"features":["calculators","converters","dev-tools","privacy-first"],"active":true,"metadata":{"offline":true}}'
  );
  const [indentSize, setIndentSize] = useState<number>(2);

  const format = () => {
    if (!inputJson.trim()) return { formatted: '', error: null, isValid: true };
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      return { formatted, error: null, isValid: true };
    } catch (err: any) {
      return { formatted: '', error: err.message, isValid: false };
    }
  };

  const { formatted, error, isValid } = format();

  const handleCopy = () => {
    if (!formatted) return;
    copyToClipboard(formatted);
    showToast('Formatted JSON copied!');
  };

  const handleDownload = () => {
    if (!formatted) return;
    downloadFile(formatted, 'data.json', 'application/json');
    showToast('Downloaded data.json');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Indentation:
          </span>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="input-base py-1 text-xs w-32"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={0}>Minify (Compact)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {isValid && inputJson.trim() ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Valid JSON
            </span>
          ) : error ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500">
              <AlertCircle className="w-4 h-4" /> Invalid Syntax
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Input JSON</span>
            <button
              onClick={() => setInputJson('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={12}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            className="input-base text-sm font-mono leading-relaxed"
            placeholder="Paste raw JSON here..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Formatted Result</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!isValid || !formatted}
                className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 disabled:opacity-40"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button
                onClick={handleDownload}
                disabled={!isValid || !formatted}
                className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" /> .json
              </button>
            </div>
          </div>
          {error ? (
            <div className="w-full h-[290px] p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-mono overflow-auto">
              <div className="font-bold mb-1">JSON Syntax Error:</div>
              <div>{error}</div>
            </div>
          ) : (
            <textarea
              rows={12}
              readOnly
              value={formatted}
              className="input-base text-sm font-mono leading-relaxed bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
            />
          )}
        </div>
      </div>
    </div>
  );
};
