import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const { showToast } = useToast();
  const [text, setText] = useState('');

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');
  };

  const cases = [
    { label: 'UPPERCASE', val: text.toUpperCase() },
    { label: 'lowercase', val: text.toLowerCase() },
    { label: 'Title Case', val: toTitleCase(text) },
    { label: 'Sentence case', val: toSentenceCase(text) },
    { label: 'camelCase', val: toCamelCase(text) },
    { label: 'PascalCase', val: toPascalCase(text) },
    { label: 'snake_case', val: toSnakeCase(text) },
    { label: 'kebab-case', val: toKebabCase(text) },
    { label: 'CONSTANT_CASE', val: toConstantCase(text) },
    { label: 'aLtErNaTiNg', val: toAlternatingCase(text) },
  ];

  const handleCopy = (str: string) => {
    copyToClipboard(str);
    showToast('Copied to clipboard!');
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
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-base text-sm leading-relaxed"
          placeholder="Enter text to convert..."
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Converted Formats
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cases.map((c) => (
            <div
              key={c.label}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{c.label}</span>
                <button
                  onClick={() => handleCopy(c.val)}
                  className="p-1 text-slate-400 hover:text-emerald-500 rounded flex items-center gap-1"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs font-mono break-all line-clamp-2 text-slate-900 dark:text-white">
                {c.val || <span className="text-slate-400 italic">Empty</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
