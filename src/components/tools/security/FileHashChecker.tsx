import React, { useState } from 'react';
import { ShieldCheck, Upload, Copy, Check, FileCheck, HardDrive, RefreshCw } from 'lucide-react';

interface HashResults {
  sha256: string;
  sha512: string;
  sha1: string;
}

export const FileHashChecker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<HashResults | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute hashes using Web Crypto subtle
  const computeHash = async (selectedFile: File) => {
    setIsHashing(true);
    setFile(selectedFile);
    setHashes(null);

    try {
      const buffer = await selectedFile.arrayBuffer();

      const [sha256Buf, sha512Buf, sha1Buf] = await Promise.all([
        crypto.subtle.digest('SHA-256', buffer),
        crypto.subtle.digest('SHA-512', buffer),
        crypto.subtle.digest('SHA-1', buffer)
      ]);

      const bufferToHex = (buf: ArrayBuffer) => {
        return Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      };

      setHashes({
        sha256: bufferToHex(sha256Buf),
        sha512: bufferToHex(sha512Buf),
        sha1: bufferToHex(sha1Buf)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      computeHash(f);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      computeHash(f);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Client-Side File Hash Checker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Calculate cryptographic checksums (SHA-256, SHA-512, SHA-1) of files entirely in your browser with zero data upload.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative"
      >
        <input
          type="file"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            {isHashing ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {file ? file.name : 'Choose a file or drag & drop here'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {file ? `${formatBytes(file.size)} • ${file.type || 'Binary'}` : 'Supports any file type (ISO, ZIP, PDF, EXE, etc.)'}
            </p>
          </div>
          <span className="inline-block px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
            Browse File
          </span>
        </div>
      </div>

      {/* Hashes Output Cards */}
      {hashes && file && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              Calculated Hashes for: <span className="font-mono text-emerald-600 dark:text-emerald-400">{file.name}</span>
            </div>
            <span className="text-xs text-slate-400">{formatBytes(file.size)}</span>
          </div>

          {/* SHA-256 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>SHA-256 (Standard Recommended)</span>
              <button
                onClick={() => handleCopy(hashes.sha256, 'sha256')}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copiedKey === 'sha256' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'sha256' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {hashes.sha256}
            </div>
          </div>

          {/* SHA-512 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>SHA-512 (High Security)</span>
              <button
                onClick={() => handleCopy(hashes.sha512, 'sha512')}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copiedKey === 'sha512' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'sha512' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {hashes.sha512}
            </div>
          </div>

          {/* SHA-1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>SHA-1 (Legacy / Git Commits)</span>
              <button
                onClick={() => handleCopy(hashes.sha1, 'sha1')}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copiedKey === 'sha1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'sha1' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {hashes.sha1}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Guarantee Note */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>100% Offline Security:</strong> Files never leave your local machine or get uploaded to any cloud server. All hashes are calculated locally via browser `SubtleCrypto.digest()`.
        </div>
      </div>
    </div>
  );
};
