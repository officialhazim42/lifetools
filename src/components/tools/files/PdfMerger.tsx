import React, { useState } from 'react';
import { Files, Upload, Trash2, ArrowUp, ArrowDown, Download, RefreshCw, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PdfQueueItem {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  buffer: ArrayBuffer;
}

export const PdfMerger: React.FC = () => {
  const [queue, setQueue] = useState<PdfQueueItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [outputName, setOutputName] = useState('merged_document.pdf');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsReading(true);
    setError(null);
    const newItems: PdfQueueItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        newItems.push({
          id: 'pdf_' + Math.random().toString(36).substring(2, 9),
          name: f.name,
          size: f.size,
          pageCount: doc.getPageCount(),
          buffer
        });
      } catch (err: any) {
        console.error(err);
      }
    }

    setQueue(prev => [...prev, ...newItems]);
    setIsReading(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === queue.length - 1)
    ) {
      return;
    }
    const target = direction === 'up' ? index - 1 : index + 1;
    const updated = [...queue];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setQueue(updated);
  };

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  const handleMerge = async () => {
    if (queue.length === 0) return;
    setIsMerging(true);
    setError(null);

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of queue) {
        const doc = await PDFDocument.load(item.buffer, { ignoreEncryption: true });
        const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
        pages.forEach(p => mergedDoc.addPage(p));
      }

      const mergedBytes = await mergedDoc.save();
      const blob = new Blob([mergedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = outputName.endsWith('.pdf') ? outputName : `${outputName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to merge PDF files.');
    } finally {
      setIsMerging(false);
    }
  };

  const totalPages = queue.reduce((sum, item) => sum + item.pageCount, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Files className="w-3.5 h-3.5" /> PDF Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Client-Side PDF Merger
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Combine multiple PDF files into a single unified document with complete client-side confidentiality.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {isReading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isReading ? 'Reading PDF pages...' : 'Select or drop multiple PDF files to merge'}
          </p>
          <span className="text-xs text-slate-400">
            Reorder pages and merge directly in your browser
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Queue List */}
      {queue.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                PDF Documents ({queue.length})
              </h3>
              <p className="text-xs text-slate-400">Total: {totalPages} pages</p>
            </div>
            <button
              onClick={() => setQueue([])}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear Queue
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {queue.map((item, idx) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-sm">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {(item.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === queue.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 ml-1"
                    title="Remove PDF"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="w-full sm:w-auto flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500 whitespace-nowrap">
                Output File:
              </label>
              <input
                type="text"
                value={outputName}
                onChange={e => setOutputName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 font-mono"
              />
            </div>

            <button
              onClick={handleMerge}
              disabled={isMerging}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isMerging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isMerging ? 'Merging PDF Documents...' : `Merge & Download (${totalPages} Pages)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
