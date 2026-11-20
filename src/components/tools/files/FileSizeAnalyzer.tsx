import React, { useState } from 'react';
import { HardDrive, Upload, Wifi, Gauge, Clock, ArrowRight } from 'lucide-react';

const NETWORKS = [
  { name: '3G Mobile', speedMbps: 2, icon: '📱' },
  { name: '4G LTE Mobile', speedMbps: 25, icon: '📶' },
  { name: 'Home Wi-Fi (Standard)', speedMbps: 50, icon: '📡' },
  { name: '5G Mobile Ultra', speedMbps: 150, icon: '⚡' },
  { name: 'High-Speed Broadband', speedMbps: 300, icon: '🌐' },
  { name: 'Gigabit Fiber', speedMbps: 1000, icon: '🚀' }
];

export const FileSizeAnalyzer: React.FC = () => {
  const [bytes, setBytes] = useState<number>(45 * 1024 * 1024); // 45 MB default
  const [fileName, setFileName] = useState<string>('sample-video-clip.mp4');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setBytes(file.size);
  };

  // Convert bytes to human units
  const kb = bytes / 1000;
  const mb = bytes / (1000 * 1000);
  const gb = bytes / (1000 * 1000 * 1000);

  const kib = bytes / 1024;
  const mib = bytes / (1024 * 1024);
  const gib = bytes / (1024 * 1024 * 1024);

  // Transfer duration in seconds = (bytes * 8) / (speedMbps * 1,000,000)
  const calculateTransferTime = (speedMbps: number) => {
    const bits = bytes * 8;
    const bitsPerSec = speedMbps * 1000 * 1000;
    const totalSecs = bits / bitsPerSec;

    if (totalSecs < 1) return '< 1 second';
    if (totalSecs < 60) return `${Math.round(totalSecs)} seconds`;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.round(totalSecs % 60);
    if (mins < 60) return `${mins}m ${secs}s`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
          <HardDrive className="w-3.5 h-3.5" /> File & Document Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          File Size & Network Transfer Analyzer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Convert storage dimensions across decimal and binary byte units and estimate upload/download transfer times.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-6 text-center transition-colors cursor-pointer relative">
        <input
          type="file"
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="w-8 h-8 text-blue-500" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {fileName ? `${fileName}` : 'Select or drop any file to inspect'}
          </p>
          <span className="text-xs text-slate-400">
            Calculated instantly locally without uploading
          </span>
        </div>
      </div>

      {/* Manual Input Slider / Number */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Or Enter Exact File Size in Megabytes (MB)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            step="0.1"
            min={0}
            value={parseFloat(mb.toFixed(2))}
            onChange={e => setBytes(Math.max(0, Number(e.target.value) * 1000 * 1000))}
            className="w-40 px-3 py-2 text-lg font-bold font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="font-bold text-slate-500 text-sm">MB</span>
        </div>
      </div>

      {/* Storage Dimension Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Exact Bytes
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 truncate">
            {bytes.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">B (Octets)</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Megabytes (Decimal)
          </span>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
            {mb.toFixed(2)} MB
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">1 MB = 1,000,000 B</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Mebibytes (Binary)
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {mib.toFixed(2)} MiB
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">1 MiB = 1,048,576 B</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Gigabytes (Decimal)
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {gb.toFixed(4)} GB
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">1 GB = 10⁹ B</span>
        </div>
      </div>

      {/* Network Transfer Estimates */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-500" /> Estimated Transfer Time by Connection
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {NETWORKS.map(net => (
            <div
              key={net.name}
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{net.icon}</span> {net.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">{net.speedMbps} Mbps</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                  {calculateTransferTime(net.speedMbps)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
