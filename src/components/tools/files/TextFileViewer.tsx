import React, { useState } from 'react';
import { FileText, Upload, Search, Copy, Check, Download, AlignLeft } from 'lucide-react';

export const TextFileViewer: React.FC = () => {
  const [content, setContent] = useState<string>(
    `# LifeTools System Diagnostics Log\n\n[2026-11-19 12:00:01] Service worker initialized successfully.\n[2026-11-19 12:00:02] Local client storage verified (IndexedDB + LocalStorage).\n[2026-11-19 12:00:03] PWA offline caching enabled.\n[2026-11-19 12:00:04] Security sandbox active: 0 external API calls.\n[2026-11-19 12:00:05] All 216 client utilities operational.\n`
  );
  const [fileName, setFileName] = useState<string>('system-log.txt');
  const [search, setSearch] = useState<string>('');
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const lines = content.split('\n');
  const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const sizeBytes = new Blob([content]).size;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = evt => {
      setContent(evt.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'document.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Universal Text & Log File Viewer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Inspect and search through code, logs, markdown, and plain text files with line numbering and stats.
        </p>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" /> Open File
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <span className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Find in file..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
            />
          </div>

          <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={wordWrap}
              onChange={e => setWordWrap(e.target.checked)}
              className="rounded accent-blue-600"
            />
            <span>Wrap</span>
          </label>

          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Copy text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor / Viewer Container with Line Numbers */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex text-xs font-mono">
        {/* Line Numbers Gutter */}
        <div className="select-none py-4 px-3 text-right bg-slate-50 dark:bg-slate-800/60 border-r border-slate-100 dark:border-slate-800 text-slate-400 shrink-0 min-w-[48px]">
          {lines.map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-4 overflow-x-auto ${wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
          {lines.map((line, i) => {
            const hasMatch = search && line.toLowerCase().includes(search.toLowerCase());
            return (
              <div
                key={i}
                className={`leading-6 ${hasMatch ? 'bg-yellow-500/20 text-yellow-900 dark:text-yellow-200 px-1 rounded' : 'text-slate-800 dark:text-slate-200'}`}
              >
                {line || ' '}
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Stats Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 px-2">
        <div className="flex items-center gap-4">
          <span>Lines: <strong>{lines.length}</strong></span>
          <span>Words: <strong>{wordCount.toLocaleString()}</strong></span>
          <span>Characters: <strong>{charCount.toLocaleString()}</strong></span>
          <span>Size: <strong>{(sizeBytes / 1024).toFixed(2)} KB</strong></span>
        </div>
        <span>Encoding: UTF-8</span>
      </div>
    </div>
  );
};
