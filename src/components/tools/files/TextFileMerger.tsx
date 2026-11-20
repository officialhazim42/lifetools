import React, { useState } from 'react';
import { Files, Upload, Trash2, ArrowUp, ArrowDown, Download, Check } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  content: string;
  size: number;
}

export const TextFileMerger: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [separator, setSeparator] = useState('\n\n--- [FILE DIVIDER] ---\n\n');
  const [outputFileName, setOutputFileName] = useState('merged_document.txt');
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    Array.from(uploaded).forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        const text = evt.target?.result as string;
        setFiles(prev => [
          ...prev,
          {
            id: 'file_' + Math.random().toString(36).substring(2, 9),
            name: file.name,
            content: text,
            size: file.size
          }
        ]);
      };
      reader.readAsText(file);
    });
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === files.length - 1)
    ) {
      return;
    }
    const target = direction === 'up' ? index - 1 : index + 1;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setFiles(updated);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const getMergedContent = () => {
    return files.map(f => f.content).join(separator);
  };

  const mergedText = getMergedContent();

  const handleDownload = () => {
    if (files.length === 0) return;
    const blob = new Blob([mergedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = outputFileName || 'merged_document.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Files className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Text File Merger
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Combine multiple text, markdown, log, or CSV files into a single ordered document with custom delimiters.
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
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Select or drop multiple text files to combine
          </p>
          <span className="text-xs text-slate-400">
            Supports .txt, .log, .md, .csv, .json, source files
          </span>
        </div>
      </div>

      {/* Uploaded Files Queue */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Files to Merge ({files.length})
            </h3>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear Queue
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.map((file, idx) => (
              <div key={file.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB • {file.content.split('\n').length} lines
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === files.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 ml-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merging Settings & Export */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Merge Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              File Separator / Delimiter
            </label>
            <input
              type="text"
              value={separator}
              onChange={e => setSeparator(e.target.value)}
              placeholder="e.g. \n\n or ---"
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Output File Name
            </label>
            <input
              type="text"
              value={outputFileName}
              onChange={e => setOutputFileName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleDownload}
            disabled={files.length === 0}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Merged File ({files.length} files)
          </button>
        </div>
      </div>
    </div>
  );
};
