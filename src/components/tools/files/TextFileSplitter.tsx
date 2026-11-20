import React, { useState } from 'react';
import { Split, Upload, Download, Copy, Check, FileText } from 'lucide-react';

export const TextFileSplitter: React.FC = () => {
  const [inputText, setInputText] = useState(
    Array.from({ length: 45 }, (_, i) => `Line ${i + 1}: Sample data record payload for LifeTools data suite.`).join('\n')
  );
  const [fileName, setFileName] = useState('data_records.txt');
  const [splitMode, setSplitMode] = useState<'lines' | 'delimiter'>('lines');
  const [linesPerChunk, setLinesPerChunk] = useState(15);
  const [customDelimiter, setCustomDelimiter] = useState('---');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getChunks = (): string[] => {
    if (!inputText.trim()) return [];

    if (splitMode === 'delimiter') {
      return inputText
        .split(customDelimiter)
        .map(c => c.trim())
        .filter(c => c.length > 0);
    }

    // Split by lines
    const lines = inputText.split('\n');
    const chunks: string[] = [];
    for (let i = 0; i < lines.length; i += linesPerChunk) {
      chunks.push(lines.slice(i, i + linesPerChunk).join('\n'));
    }
    return chunks;
  };

  const chunks = getChunks();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = evt => {
      setInputText(evt.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleDownloadChunk = (chunkText: string, index: number) => {
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'txt';
    const blob = new Blob([chunkText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseName}_part_${index + 1}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyChunk = (chunkText: string, index: number) => {
    navigator.clipboard.writeText(chunkText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Split className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Text File Splitter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Split oversized text and log files into smaller manageable parts by line count or delimiter.
        </p>
      </div>

      {/* Upload & Split Settings */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" /> Upload File to Split
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setSplitMode('lines')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  splitMode === 'lines' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                By Line Count
              </button>
              <button
                onClick={() => setSplitMode('delimiter')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  splitMode === 'delimiter' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500'
                }`}
              >
                By Delimiter
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {splitMode === 'lines' ? (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Lines per Split File
              </label>
              <input
                type="number"
                min={1}
                value={linesPerChunk}
                onChange={e => setLinesPerChunk(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Split Delimiter Pattern
              </label>
              <input
                type="text"
                value={customDelimiter}
                onChange={e => setCustomDelimiter(e.target.value)}
                placeholder="e.g. --- or [SECTION]"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex items-end">
            <span className="text-xs text-slate-500">
              Total input: <strong>{inputText.split('\n').length}</strong> lines → will generate{' '}
              <strong className="text-blue-600 dark:text-blue-400">{chunks.length}</strong> split parts.
            </span>
          </div>
        </div>
      </div>

      {/* Generated Chunks List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          Generated Split Parts ({chunks.length})
        </h3>

        <div className="space-y-3">
          {chunks.map((chunk, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Part {idx + 1} ({chunk.split('\n').length} lines, {(new Blob([chunk]).size / 1024).toFixed(1)} KB)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyChunk(chunk, idx)}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === idx ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleDownloadChunk(chunk, idx)}
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Part
                  </button>
                </div>
              </div>

              <textarea
                readOnly
                rows={4}
                value={chunk}
                className="w-full p-2.5 font-mono text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 resize-none select-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
