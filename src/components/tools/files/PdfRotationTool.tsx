import React, { useState } from 'react';
import { RotateCw, Upload, Download, RefreshCw, FileText } from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';

export const PdfRotationTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(90); // 90, 180, 270
  const [targetScope, setTargetScope] = useState<'all' | 'custom'>('all');
  const [customPages, setCustomPages] = useState<string>('1');
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
    } catch (err: any) {
      setError(err?.message || 'Failed to read PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotateAndDownload = async () => {
    if (!pdfBytes || !file || pageCount === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

      const targetIndices: number[] = [];
      if (targetScope === 'all') {
        for (let i = 0; i < pageCount; i++) targetIndices.push(i);
      } else {
        const tokens = customPages.split(',').map(s => parseInt(s.trim(), 10));
        tokens.forEach(p => {
          if (!isNaN(p) && p >= 1 && p <= pageCount) {
            targetIndices.push(p - 1);
          }
        });
      }

      targetIndices.forEach(idx => {
        const page = pdfDoc.getPage(idx);
        const existingAngle = page.getRotation().angle;
        page.setRotation(degrees((existingAngle + rotationAngle) % 360));
      });

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${file.name.replace(/\.pdf$/i, '')}_rotated_${rotationAngle}deg.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || 'Failed to rotate PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <RotateCw className="w-3.5 h-3.5" /> PDF Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          PDF Page Rotation Tool
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Permanently rotate upside-down or sideways PDF pages by 90°, 180°, or 270° with client-side security.
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
            {file ? file.name : 'Select or drop PDF to rotate pages'}
          </p>
          <span className="text-xs text-slate-400">
            {pageCount > 0 ? `${pageCount} total pages in document` : 'Choose orientation rotation angle'}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Configuration */}
      {file && pageCount > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Rotation Angle & Scope
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: '90° Clockwise', angle: 90 },
              { label: '180° Upside Down', angle: 180 },
              { label: '270° Counter-Clockwise', angle: 270 }
            ].map(item => (
              <button
                key={item.angle}
                onClick={() => setRotationAngle(item.angle)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  rotationAngle === item.angle
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <RotateCw className="w-5 h-5 mx-auto mb-1" />
                <div className="font-bold text-xs">{item.label}</div>
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === 'all'}
                  onChange={() => setTargetScope('all')}
                  className="accent-blue-600"
                />
                <span>Rotate All {pageCount} Pages</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === 'custom'}
                  onChange={() => setTargetScope('custom')}
                  className="accent-blue-600"
                />
                <span>Rotate Specific Page Numbers</span>
              </label>
            </div>

            {targetScope === 'custom' && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Specific Page Numbers (comma separated e.g. 1, 3, 5)
                </label>
                <input
                  type="text"
                  value={customPages}
                  onChange={e => setCustomPages(e.target.value)}
                  placeholder="e.g. 1, 3"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleRotateAndDownload}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Rotate & Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
