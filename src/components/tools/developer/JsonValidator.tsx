import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { CheckCircle2, AlertCircle, Copy, Trash2 } from 'lucide-react';

export const JsonValidator: React.FC = () => {
  const { showToast } = useToast();
  const [jsonStr, setJsonStr] = useState('{\n  "platform": "LifeTools",\n  "status": "online",\n  "toolsCount": 117\n}');

  const validate = () => {
    if (!jsonStr.trim()) return { isValid: false, message: 'Input is empty.', details: null };
    try {
      const parsed = JSON.parse(jsonStr);
      const type = Array.isArray(parsed) ? 'Array' : typeof parsed === 'object' && parsed !== null ? 'Object' : typeof parsed;
      const keys = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 0;
      return {
        isValid: true,
        message: 'Valid JSON syntax confirmed.',
        details: { type, keys }
      };
    } catch (err: any) {
      return {
        isValid: false,
        message: err.message,
        details: null
      };
    }
  };

  const status = validate();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            JSON Input
          </label>
          <button
            onClick={() => setJsonStr('')}
            className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          rows={10}
          value={jsonStr}
          onChange={(e) => setJsonStr(e.target.value)}
          className="input-base text-sm font-mono leading-relaxed"
          placeholder="Paste JSON to validate..."
        />
      </div>

      <div
        className={`p-6 rounded-2xl border shadow-subtle flex items-start gap-4 ${
          status.isValid
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
        }`}
      >
        {status.isValid ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <h4
            className={`font-bold text-base ${
              status.isValid ? 'text-emerald-800 dark:text-emerald-200' : 'text-rose-800 dark:text-rose-200'
            }`}
          >
            {status.isValid ? 'JSON is completely valid!' : 'JSON Syntax Error Detected'}
          </h4>
          <p
            className={`text-xs font-mono ${
              status.isValid ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}
          >
            {status.message}
          </p>
          {status.details && (
            <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 flex gap-4">
              <span>Root Type: <strong>{status.details.type}</strong></span>
              <span>Root Keys/Items: <strong>{status.details.keys}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
