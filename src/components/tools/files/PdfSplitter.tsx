import React, { useState } from 'react';
import { Split, Upload, Download, RefreshCw, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [fromPage, setFromPage] = useState<number>(1);
  const [toPage, setToPage] = useState<number>(1);
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
      setFromPage(1);
      setToPage(Math.min(count, 5));
    } catch (err: any) {
      setError(err?.message || 'Failed to read PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processPdf(f);
  };

  const handleSplitRange = async () => {
    if (!pdfBytes || !file || pageCount === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const subDoc = await PDFDocument.create();

      const startIdx = Math.max(0, fromPage - 1);
      const endIdx = Math.min(pageCount - 1, toPage - 1);

      if (startIdx > endIdx) {
        throw new Error('Start page must be less than or equal to End page.');
      }

      const indices: number[] = [];
      for (let i = startIdx; i <= endIdx; i++) {
        indices.push(i);
      }

      const copiedPages = await subDoc.copyPages(srcDoc, indices);
      copiedPages.forEach(p => subDoc.addPage(p));

      const subBytes = await subDoc.save();
      const blob = new Blob([subBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, '')}_pages_${fromPage}-${toPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Split className="w-3.5 h-3.5" /> PDF Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Client-Side PDF Splitter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Split large PDFs into targeted page range documents in your browser without uploading files.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {isProcessing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Select or drop PDF to split'}
          </p>
          <span className="text-xs text-slate-400">
            {pageCount > 0 ? `${pageCount} total pages detected` : 'Extract custom chapters or page ranges'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Split Range Configuration */}
      {file && pageCount > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" /> Select Page Range to Extract
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                From Page (1 to {pageCount})
              </label>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={fromPage}
                onChange={e => setFromPage(Math.max(1, Math.min(pageCount, Number(e.target.value))))}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                To Page (1 to {pageCount})
              </label>
              <input
                type="number"
                min={fromPage}
                max={pageCount}
                value={toPage}
                onChange={e => setToPage(Math.max(fromPage, Math.min(pageCount, Number(e.target.value))))}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Will extract <strong>{toPage - fromPage + 1}</strong> pages (Pages {fromPage} through {toPage}).
            </span>

            <button
              onClick={handleSplitRange}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
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
