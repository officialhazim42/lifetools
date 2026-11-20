import React, { useState } from 'react';
import { Minimize2, Upload, Download, RefreshCw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [stripMetadata, setStripMetadata] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const compressPdf = async (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    setCompressedSize(0);
    setCompressedBytes(null);
    setIsCompressing(true);
    setError(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (stripMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      // Save with useObjectStreams for maximum dictionary compression
      const savedBytes = await pdfDoc.save({ useObjectStreams: true });
      setCompressedBytes(savedBytes);
      setCompressedSize(savedBytes.length);
    } catch (err: any) {
      setError(err?.message || 'Failed to compress PDF document.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) compressPdf(f);
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    const blob = new Blob([compressedBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const savedBytes = Math.max(0, originalSize - compressedSize);
  const percentSaved = originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <Minimize2 className="w-3.5 h-3.5" /> PDF Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Client-Side PDF Compressor & Optimizer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Reduce PDF file sizes by compressing object streams and removing redundant metadata without external servers.
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
            {isCompressing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Select or drop PDF to optimize & compress'}
          </p>
          <span className="text-xs text-slate-400">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Safe, private local browser compression'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Compression Outcome Card */}
      {compressedSize > 0 && file && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Original Size
              </span>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                {(originalSize / 1024).toFixed(1)} KB
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Optimized Size
              </span>
              <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                {(compressedSize / 1024).toFixed(1)} KB
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Space Saved
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
                {percentSaved}%
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Optimized cross-reference tables and compacted object streams.</span>
            </div>

            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Optimized PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
