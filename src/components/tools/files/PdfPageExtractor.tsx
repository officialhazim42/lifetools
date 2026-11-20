import React, { useState } from 'react';
import { Layers, Upload, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfPageExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pagesQuery, setPagesQuery] = useState<string>('1, 3-5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPdf = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      setPdfBytes(buffer);
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setPagesQuery(count >= 3 ? '1, 3' : '1');
    } catch (err: any) {
      setError(err?.message || 'Failed to read PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parsePageIndices = (query: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const tokens = query.split(',').map(t => t.trim()).filter(Boolean);

    for (const token of tokens) {
      if (token.includes('-')) {
        const [startStr, endStr] = token.split('-').map(s => parseInt(s.trim(), 10));
        if (!isNaN(startStr) && !isNaN(endStr)) {
          const start = Math.max(1, Math.min(startStr, endStr));
          const end = Math.min(maxPages, Math.max(startStr, endStr));
          for (let p = start; p <= end; p++) {
            indices.add(p - 1); // 0-based
          }
        }
      } else {
        const p = parseInt(token, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          indices.add(p - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!pdfBytes || !file || pageCount === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const indices = parsePageIndices(pagesQuery, pageCount);
      if (indices.length === 0) {
        throw new Error('No valid pages found in your selection. Check page numbers.');
      }

      const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const outDoc = await PDFDocument.create();

      const copiedPages = await outDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(p => outDoc.addPage(p));

      const outBytes = await outDoc.save();
      const blob = new Blob([outBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, '')}_extracted.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to extract requested pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parsedPagesList = pageCount > 0 ? parsePageIndices(pagesQuery, pageCount) : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> PDF Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          PDF Page Extractor
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Extract non-contiguous or specific page ranges (e.g. 1, 3, 5-8) into a fresh, stand-alone PDF.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={e => e.target.files?.[0] && processPdf(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Select or drop PDF to extract pages'}
          </p>
          <span className="text-xs text-slate-400">
            {pageCount > 0 ? `${pageCount} total pages available` : 'Extract arbitrary individual or ranged pages'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Extractor Configuration */}
      {file && pageCount > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Pages to Extract (e.g. 1, 3-5, 8)
            </label>
            <input
              type="text"
              value={pagesQuery}
              onChange={e => setPagesQuery(e.target.value)}
              placeholder="e.g. 1, 4-6, 10"
              className="w-full px-4 py-3 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Available pages: 1 to {pageCount}. Use commas to separate individual pages and hyphens for ranges.
            </p>
          </div>

          {/* Preview of Selected Pages */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Selected: <strong>{parsedPagesList.length}</strong> pages (
              {parsedPagesList.map(p => p + 1).join(', ') || 'None'}
              )
            </span>
            <button
              onClick={handleExtract}
              disabled={isProcessing || parsedPagesList.length === 0}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Extract & Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
