import React, { useState } from 'react';
import { FileCode, Upload, ShieldCheck, AlertTriangle, CheckCircle2, FileQuestion } from 'lucide-react';

interface FileSignatureMatch {
  detectedFormat: string;
  mime: string;
  description: string;
  matchesExtension: boolean;
}

export const FileTypeInspector: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [magicHex, setMagicHex] = useState<string>('');
  const [magicAscii, setMagicAscii] = useState<string>('');
  const [analysis, setAnalysis] = useState<FileSignatureMatch | null>(null);

  const inspectFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setMagicHex('');
    setMagicAscii('');
    setAnalysis(null);

    const slice = selectedFile.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

    const ascii = Array.from(bytes)
      .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
      .join('');

    setMagicHex(hex);
    setMagicAscii(ascii);

    // Signature match
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';

    let detected = 'Unknown Binary / Plain Text';
    let mime = selectedFile.type || 'application/octet-stream';
    let desc = 'No standard binary magic header matched. Could be plain text or proprietary format.';
    let matchesExt = true;

    // Check common signatures
    if (hex.startsWith('89 50 4E 47 0D 0A 1A 0A')) {
      detected = 'PNG Image';
      mime = 'image/png';
      desc = 'Portable Network Graphics lossless image file.';
      matchesExt = ext === 'png';
    } else if (hex.startsWith('FF D8 FF')) {
      detected = 'JPEG Image';
      mime = 'image/jpeg';
      desc = 'Joint Photographic Experts Group image.';
      matchesExt = ext === 'jpg' || ext === 'jpeg';
    } else if (hex.startsWith('25 50 44 46')) {
      detected = 'PDF Document';
      mime = 'application/pdf';
      desc = 'Adobe Portable Document Format.';
      matchesExt = ext === 'pdf';
    } else if (hex.startsWith('50 4B 03 04')) {
      detected = 'ZIP Archive / Office Open XML';
      mime = 'application/zip';
      desc = 'Standard ZIP archive or modern MS Office document (.docx, .xlsx, .pptx).';
      matchesExt = ['zip', 'docx', 'xlsx', 'pptx', 'jar', 'apk'].includes(ext);
    } else if (hex.startsWith('47 49 46 38')) {
      detected = 'GIF Animation';
      mime = 'image/gif';
      desc = 'Graphics Interchange Format image.';
      matchesExt = ext === 'gif';
    } else if (hex.startsWith('4D 5A')) {
      detected = 'Windows PE Executable / DLL';
      mime = 'application/x-msdownload';
      desc = 'Executable binary file for Windows systems (MZ header).';
      matchesExt = ['exe', 'dll', 'sys', 'scr'].includes(ext);
    } else if (hex.startsWith('52 49 46 46') && hex.includes('57 45 42 50')) {
      detected = 'WebP Image';
      mime = 'image/webp';
      desc = 'Google WebP modern web image format.';
      matchesExt = ext === 'webp';
    }

    setAnalysis({
      detectedFormat: detected,
      mime,
      description: desc,
      matchesExtension: matchesExt
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) inspectFile(f);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <FileCode className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          File Type & Magic Byte Inspector
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Inspect true binary signatures (magic bytes) to identify genuine file types and uncover disguised file extensions.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="w-10 h-10 text-blue-500" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {file ? file.name : 'Choose any file to inspect true binary signature'}
          </p>
          <span className="text-xs text-slate-400">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Reads file headers locally with zero uploads'}
          </span>
        </div>
      </div>

      {/* Magic Byte Inspection Output */}
      {analysis && file && (
        <div className="space-y-4">
          {/* Extension Spoofing Verdict Banner */}
          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              analysis.matchesExtension
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {analysis.matchesExtension ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              )}
            </div>
            <h2 className="text-xl font-bold">
              {analysis.matchesExtension
                ? 'Extension Matches Binary Signature'
                : 'Potential Extension Mismatch / Spoofing Detected!'}
            </h2>
            <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {analysis.matchesExtension
                ? `The declared extension (.${file.name.split('.').pop()}) matches the verified ${analysis.detectedFormat} magic header.`
                : `The file has extension (.${file.name.split('.').pop()}) but its underlying binary header indicates: ${analysis.detectedFormat}.`}
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Binary Header Analysis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-slate-400">Detected Format:</span>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {analysis.detectedFormat}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-slate-400">MIME Type:</span>
                <div className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                  {analysis.mime}
                </div>
              </div>
            </div>

            {/* Hex Dump */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                First 16 Magic Bytes (Hexadecimal)
              </span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl font-mono text-xs text-blue-600 dark:text-blue-400 select-all">
                {magicHex}
              </div>
            </div>

            {/* ASCII Dump */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                First 16 Bytes (ASCII Representation)
              </span>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 select-all">
                {magicAscii}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
