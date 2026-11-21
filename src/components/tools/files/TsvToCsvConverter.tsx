import React, { useState } from 'react';
import { FileSpreadsheet, ArrowLeftRight, Download, Copy, Check, Upload } from 'lucide-react';
import { exportToCsv } from '../../../utils/storage';

const SAMPLE_TSV = `Item\tCategory\tQuantity\tPrice
Wireless Mouse\tElectronics\t25\t29.99
Ergonomic Chair\tFurniture\t10\t199.50
USB-C Cable\tAccessories\t50\t12.99`;

export const TsvToCsvConverter: React.FC = () => {
  const [direction, setDirection] = useState<'tsvToCsv' | 'csvToTsv'>('tsvToCsv');
  const [inputData, setInputData] = useState('');
  const [copied, setCopied] = useState(false);

  const convertData = () => {
    if (!inputData.trim()) return '';
    const lines = inputData.trim().split(/\r?\n/).filter(l => l.length > 0);

    if (direction === 'tsvToCsv') {
      // TSV -> CSV
      return lines
        .map(line => {
          const cells = line.split('\t');
          return cells
            .map(cell => {
              const str = cell.trim();
              if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(',');
        })
        .join('\n');
    } else {
      // CSV -> TSV
      return lines
        .map(line => {
          const cells: string[] = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
              inQuotes = !inQuotes;
            } else if (c === ',' && !inQuotes) {
              cells.push(cur.trim());
              cur = '';
            } else {
              cur += c;
            }
          }
          cells.push(cur.trim());
          return cells.join('\t');
        })
        .join('\n');
    }
  };

  const outputResult = convertData();

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!outputResult) return;
    const filename = direction === 'tsvToCsv' ? 'converted.csv' : 'converted.tsv';
    const blob = new Blob([outputResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <FileSpreadsheet className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          TSV to CSV / CSV to TSV Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Convert tab-separated spreadsheet values into standard comma-separated format and vice versa.
        </p>
      </div>

      {/* Direction Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setDirection('tsvToCsv')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              direction === 'tsvToCsv'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            TSV ➔ CSV (Tab to Comma)
          </button>
          <button
            onClick={() => setDirection('csvToTsv')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              direction === 'csvToTsv'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            CSV ➔ TSV (Comma to Tab)
          </button>
        </div>
      </div>

      {/* Dual Editor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {direction === 'tsvToCsv' ? 'Input TSV (Tabs)' : 'Input CSV (Commas)'}
          </label>
          <textarea
            rows={14}
            value={inputData}
            onChange={e => setInputData(e.target.value)}
            placeholder="Paste your source table data here..."
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none whitespace-pre"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {direction === 'tsvToCsv' ? 'Converted CSV Output' : 'Converted TSV Output'}
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
            value={outputResult}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-blue-700 dark:text-blue-300 resize-none select-all whitespace-pre"
          />
        </div>
      </div>
    </div>
  );
};
