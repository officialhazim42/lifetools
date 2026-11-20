import React, { useState } from 'react';
import { ShieldCheck, Upload, CheckCircle2, XCircle, RefreshCw, AlertTriangle, FileCode } from 'lucide-react';

export const FileChecksumVerifier: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [expectedHash, setExpectedHash] = useState('');
  const [calculatedHash, setCalculatedHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [algorithm, setAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');

  const computeFileHash = async (selectedFile: File, algo: string) => {
    setIsHashing(true);
    setFile(selectedFile);
    setCalculatedHash('');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const digest = await crypto.subtle.digest(algo, buffer);
      const hex = Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setCalculatedHash(hex);
    } catch (err) {
      console.error(err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      computeFileHash(f, algorithm);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      computeFileHash(f, algorithm);
    }
  };

  const cleanExpected = expectedHash.trim().toLowerCase();
  const cleanCalculated = calculatedHash.trim().toLowerCase();

  const isChecked = cleanCalculated.length > 0 && cleanExpected.length > 0;
  const isMatch = isChecked && cleanCalculated === cleanExpected;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          File Checksum Verifier & Integrity Validator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Verify downloaded software, firmware, and documents against the developer's official checksum to detect corruption or tampering.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Algorithm Picker */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verification Algorithm
          </label>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map(algo => (
              <button
                key={algo}
                onClick={() => {
                  setAlgorithm(algo);
                  if (file) computeFileHash(file, algo);
                }}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  algorithm === algo
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        {/* Expected Checksum Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Expected Checksum (from website or developer) *
          </label>
          <input
            type="text"
            value={expectedHash}
            onChange={e => setExpectedHash(e.target.value)}
            placeholder="Paste vendor checksum here (e.g. 5e884898da28047151d0e56f8dc62927...)"
            className="w-full px-4 py-3 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Upload Drop Zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors cursor-pointer relative"
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              {isHashing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {file ? file.name : 'Select or drop local file to compare'}
              </p>
              <p className="text-xs text-slate-400">
                {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Computed strictly in local memory'}
              </p>
            </div>
          </div>
        </div>

        {/* Calculated hash display */}
        {calculatedHash && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Calculated {algorithm}
            </span>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
              {calculatedHash}
            </div>
          </div>
        )}

        {/* Comparison Result Banner */}
        {isChecked && (
          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              isMatch
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              {isMatch ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-500" />
              )}
            </div>
            <h2 className="text-xl font-bold">
              {isMatch ? 'Checksums Match Perfectly!' : 'Checksum Mismatch Warning!'}
            </h2>
            <p className="text-xs mt-1 max-w-md mx-auto text-slate-600 dark:text-slate-300">
              {isMatch
                ? 'The file is authentic, complete, and exactly matches the author’s published hash.'
                : 'The file differs from the expected checksum. It may be incomplete, corrupted during transit, or modified by an untrusted party.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
