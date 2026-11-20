import React, { useState } from 'react';
import { FileSpreadsheet, Download, Copy, Check, Upload, AlertCircle } from 'lucide-react';
import { exportToCsv } from '../../../utils/storage';

const DEFAULT_JSON = `[
  { "id": 1, "name": "Laptop Pro", "price": 1299.99, "inStock": true },
  { "id": 2, "name": "Wireless Earbuds", "price": 79.50, "inStock": true },
  { "id": 3, "name": "USB-C Hub", "price": 34.00, "inStock": false }
]`;

export const JsonToCsvConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convertJsonToCsv = () => {
    try {
      if (!jsonInput.trim()) return '';
      const data = JSON.parse(jsonInput);

      if (!Array.isArray(data)) {
        throw new Error('Top-level JSON structure must be an Array.');
      }

      if (data.length === 0) return '';

      // Case 1: 2D Array
      if (Array.isArray(data[0])) {
        return (data as any[][])
          .map(row =>
            row
              .map(val => {
                const str = String(val ?? '');
                return str.includes(',') || str.includes('"') || str.includes('\n')
                  ? `"${str.replace(/"/g, '""')}"`
                  : str;
              })
              .join(',')
          )
          .join('\n');
      }

      // Case 2: Array of Objects
      const allHeaders = Array.from(
        new Set(
          data.flatMap(item => (typeof item === 'object' && item !== null ? Object.keys(item) : []))
        )
      );

      const escapeVal = (val: any) => {
        const str = String(val ?? '');
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      };

      const headerLine = allHeaders.map(escapeVal).join(',');
      const rows = data.map(item =>
        allHeaders.map(h => escapeVal((item as any)[h])).join(',')
      );

      return [headerLine, ...rows].join('\n');
    } catch (err: any) {
      return '';
    }
  };

  const csvResult = convertJsonToCsv();

  const handleCopy = () => {
    if (!csvResult) return;
    navigator.clipboard.writeText(csvResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!csvResult) return;
    exportToCsv(csvResult, 'lifetools_exported_data.csv', []);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      setJsonInput(evt.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          JSON to CSV Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Transform JSON arrays and nested structures into clean, standardized CSV files for Excel, Sheets, or databases.
        </p>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* JSON Input */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Input JSON Array
            </label>
            <label className="cursor-pointer text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Upload className="w-3 h-3" /> Upload .json
              <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <textarea
            rows={15}
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
            placeholder="Paste JSON array here..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* CSV Output */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Generated CSV
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!csvResult}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                disabled={!csvResult}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" /> Download .csv
              </button>
            </div>
          </div>
          <textarea
            readOnly
            rows={15}
            value={csvResult}
            placeholder="Converted CSV will appear here..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-700 dark:text-blue-300 resize-none select-all"
          />
        </div>
      </div>
    </div>
  );
};
