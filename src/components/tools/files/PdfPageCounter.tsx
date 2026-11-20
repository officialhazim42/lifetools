import React, { useState } from 'react';
import { FileText, Upload, RefreshCw, FileCheck, Layers } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfPageCounter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number; orientation: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPdf = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setPageCount(null);
    setDimensions([]);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);

      const dims = [];
      const sampleCount = Math.min(count, 5);
      for (let i = 0; i < sampleCount; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        dims.push({
          width: Math.round(width),
          height: Math.round(height),
          orientation: width > height ? 'Landscape' : 'Portrait'
        });
      }
      setDimensions(dims);
    } catch (err: any) {
      setError(err?.message || 'Failed to read PDF. The file may be password-protected or corrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processPdf(f);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> PDF Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          PDF Page Counter & Dimension Inspector
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Instantly determine total page counts, page dimensions, and orientations for any PDF file entirely in your browser.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Select or drop PDF to count pages'}
          </p>
          <span className="text-xs text-slate-400">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Calculated locally using WebAssembly/pdf-lib'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Results Cards */}
      {pageCount !== null && file && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pages
              </span>
              <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
                {pageCount}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Pages in document</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                File Size
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {file.size.toLocaleString()} bytes
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Page Size
              </span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3 font-mono">
                {pageCount > 0 ? `${(file.size / pageCount / 1024).toFixed(1)} KB` : '--'}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Per page weight</span>
            </div>
          </div>

          {/* Sample Dimensions */}
          {dimensions.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3">
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" /> Page Dimensions (First {dimensions.length} Pages)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {dimensions.map((d, i) => (
                  <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="font-bold text-slate-700 dark:text-slate-300">Page {i + 1}</div>
                    <div className="font-mono text-slate-500 mt-0.5">{d.width} × {d.height} pt</div>
                    <span className="text-[10px] text-blue-500 font-semibold">{d.orientation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
