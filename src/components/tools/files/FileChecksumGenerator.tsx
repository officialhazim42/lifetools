import React, { useState } from 'react';
import { FileCheck, Upload, Copy, Check, Download, RefreshCw, Trash2 } from 'lucide-react';

interface FileManifestEntry {
  id: string;
  name: string;
  size: number;
  hash: string;
}

export const FileChecksumGenerator: React.FC = () => {
  const [entries, setEntries] = useState<FileManifestEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const processFiles = async (files: FileList) => {
    setIsProcessing(true);
    const newEntries: FileManifestEntry[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const buffer = await file.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', buffer);
        const hex = Array.from(new Uint8Array(digest))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        newEntries.push({
          id: 'ent_' + Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          hash: hex
        });
      } catch (err) {
        console.error(err);
      }
    }

    setEntries(prev => [...prev, ...newEntries]);
    setIsProcessing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Generate standard sha256sum format: "<hash>  <filename>"
  const manifestText = entries.map(e => `${e.hash}  ${e.name}`).join('\n');

  const handleCopy = () => {
    if (!manifestText) return;
    navigator.clipboard.writeText(manifestText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    if (!manifestText) return;
    const blob = new Blob([manifestText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SHA256SUMS.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Batch File Checksum & Manifest Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Compute SHA-256 checksums across multiple files simultaneously and export standard GNU checksum manifest files.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isProcessing ? 'Hashing batch files...' : 'Select or drop multiple files to generate checksum manifest'}
          </p>
          <span className="text-xs text-slate-400">
            Calculated client-side with 0 network usage
          </span>
        </div>
      </div>

      {/* Results Manifest */}
      {entries.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              SHA-256 Manifest ({entries.length} files)
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Manifest'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" /> Download SHA256SUMS.txt
              </button>
              <button
                onClick={() => setEntries([])}
                className="text-xs text-rose-500 hover:underline ml-2"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {entries.map(e => (
              <div
                key={e.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{e.hash}</span>  {e.name}
                </div>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {(e.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
