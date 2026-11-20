import React, { useState } from 'react';
import { FileSpreadsheet, ArrowRight, Download, Copy, Check, Upload } from 'lucide-react';
import { exportToJson } from '../../../utils/storage';

const DEFAULT_CSV = `id,name,role,department,active
101,Hazim Bashir,Android Developer,Engineering,true
102,Aisha Khan,UI/UX Designer,Product,true
103,Liam Smith,Data Analyst,Analytics,false`;

export const CsvToJsonConverter: React.FC = () => {
  const [csvInput, setCsvInput] = useState(DEFAULT_CSV);
  const [format, setFormat] = useState<'objects' | '2d' | 'keyed'>('objects');
  const [parseTypes, setParseTypes] = useState(true);
  const [copied, setCopied] = useState(false);

  // Convert CSV to parsed rows
  const convertCsvToJson = () => {
    const lines = csvInput.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return '[]';

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const castValue = (val: string): any => {
      if (!parseTypes) return val;
      if (val.toLowerCase() === 'true') return true;
      if (val.toLowerCase() === 'false') return false;
      if (val.toLowerCase() === 'null') return null;
      if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
      return val;
    };

    const headers = parseLine(lines[0]);
    const rawRows = lines.slice(1).map(parseLine);

    if (format === '2d') {
      const all = [headers, ...rawRows.map(r => r.map(castValue))];
      return JSON.stringify(all, null, 2);
    }

    if (format === 'keyed') {
      const obj: Record<string, any> = {};
      rawRows.forEach(r => {
        const key = r[0] || 'unknown';
        const rowObj: Record<string, any> = {};
        headers.slice(1).forEach((h, idx) => {
          rowObj[h || `field_${idx + 1}`] = castValue(r[idx + 1] ?? '');
        });
        obj[key] = rowObj;
      });
      return JSON.stringify(obj, null, 2);
    }

    // Default: Array of Objects
    const objects = rawRows.map(r => {
      const rowObj: Record<string, any> = {};
      headers.forEach((h, idx) => {
        rowObj[h || `field_${idx}`] = castValue(r[idx] ?? '');
      });
      return rowObj;
    });

    return JSON.stringify(objects, null, 2);
  };

  const jsonResult = convertCsvToJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    try {
      const parsed = JSON.parse(jsonResult);
      exportToJson('lifetools_converted_data.json', parsed);
    } catch {
      // ignore
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      setCsvInput(evt.target?.result as string);
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
          CSV to JSON Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Convert comma-separated values into formatted JSON arrays or keyed objects with automatic type inference.
        </p>
      </div>

      {/* Settings Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors">
            <Upload className="w-3.5 h-3.5" /> Upload .csv
            <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFormat('objects')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                format === 'objects' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              Array of Objects
            </button>
            <button
              onClick={() => setFormat('2d')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                format === '2d' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              2D Array
            </button>
            <button
              onClick={() => setFormat('keyed')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                format === 'keyed' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
              }`}
            >
              Keyed Map
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={parseTypes}
              onChange={e => setParseTypes(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Parse numbers & booleans</span>
          </label>
        </div>
      </div>

      {/* Conversion Dual Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Side */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Input CSV Data
            </label>
            <button
              onClick={() => setCsvInput('')}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={14}
            value={csvInput}
            onChange={e => setCsvInput(e.target.value)}
            placeholder="Paste CSV data here..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* JSON Side */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Formatted JSON Output
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
          <textarea
            readOnly
            rows={14}
            value={jsonResult}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-700 dark:text-blue-300 resize-none select-all"
          />
        </div>
      </div>
    </div>
  );
};
