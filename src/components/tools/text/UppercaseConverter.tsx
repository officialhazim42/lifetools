import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Download, Trash2 } from 'lucide-react';

export const UppercaseConverter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('Quickly convert any text into pure uppercase letters with one click.');

  const upper = text.toUpperCase();

  const handleCopy = () => {
    copyToClipboard(upper);
    showToast('Uppercase text copied!');
  };

  const handleDownload = () => {
    downloadFile(upper, 'uppercase_text.txt');
    showToast('Downloaded text file');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Input Text
          </label>
          <button
            onClick={() => setText('')}
            className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-base text-sm"
          placeholder="Paste text here..."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Uppercase Result
          </label>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy Result
            </button>
            <button onClick={handleDownload} className="btn-secondary text-xs py-1">
              <Download className="w-3.5 h-3.5" /> Download .txt
            </button>
          </div>
        </div>
        <textarea
          rows={5}
          readOnly
          value={upper}
          className="input-base text-sm bg-slate-50 dark:bg-slate-850 font-mono text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};
