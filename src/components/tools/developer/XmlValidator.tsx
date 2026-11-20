import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export const XmlValidator: React.FC = () => {
  const [xmlInput, setXmlInput] = useState(
    '<?xml version="1.0" encoding="UTF-8"?>\n<note>\n  <to>User</to>\n  <from>LifeTools</from>\n  <heading>Notice</heading>\n  <body>All tools are fully functional and offline ready.</body>\n</note>'
  );

  const validate = () => {
    if (!xmlInput.trim()) return { isValid: false, message: 'XML input is empty.' };
    try {
      const parser = new DOMParser();
      const dom = parser.parseFromString(xmlInput, 'application/xml');
      const parserError = dom.querySelector('parsererror');
      if (parserError) {
        return { isValid: false, message: parserError.textContent || 'XML parsing error.' };
      }
      return { isValid: true, message: 'Valid XML document syntax.' };
    } catch (err: any) {
      return { isValid: false, message: err.message };
    }
  };

  const status = validate();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            XML Document Input
          </label>
          <button
            onClick={() => setXmlInput('')}
            className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          rows={10}
          value={xmlInput}
          onChange={(e) => setXmlInput(e.target.value)}
          className="input-base text-sm font-mono leading-relaxed"
          placeholder="Paste XML document..."
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
            {status.isValid ? 'XML is Well-Formed & Valid' : 'XML Parsing Error'}
          </h4>
          <p
            className={`text-xs font-mono break-all ${
              status.isValid ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
            }`}
          >
            {status.message}
          </p>
        </div>
      </div>
    </div>
  );
};
