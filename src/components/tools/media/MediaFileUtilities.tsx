import React, { useState } from 'react';
import {
  Upload,
  FileCheck,
  Film,
  Music,
  Image as ImageIcon,
  Clock,
  Maximize2,
  HardDrive,
  Hash,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import {
  inspectMagicBytes,
  calculateAspectRatio,
  calculateBitrate,
  calculateMediaSize,
  MediaSignature
} from '../../../utils/media/mediaFileUtils';

// ==========================================
// 1. Media File Inspector
// ==========================================
export const MediaFileInspector: React.FC = () => {
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
    signature: MediaSignature;
    hexHeader: string;
  } | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slice = await file.slice(0, 64).arrayBuffer();
    const signature = inspectMagicBytes(slice);

    // Format first 16 bytes as hex
    const bytes = new Uint8Array(slice).subarray(0, 16);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');

    setFileInfo({
      name: file.name,
      size: file.size,
      signature,
      hexHeader: hex
    });
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Media File Inspector</h2>
        <p className="text-sm text-slate-500">Inspect binary header magic numbers to identify genuine file types and containers.</p>
      </div>

      <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
        <Upload className="w-8 h-8 text-slate-400 mb-2" />
        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Upload Any Media File to Inspect</span>
        <input type="file" onChange={handleFile} className="hidden" />
      </label>

      {fileInfo && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">Filename</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">{fileInfo.name}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">File Size</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{(fileInfo.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">Detected Format</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{fileInfo.signature.container}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">MIME Type</span>
              <p className="font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{fileInfo.signature.mime}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Raw Hex Header (Magic Bytes):</span>
            <p className="font-mono text-sm bg-slate-950 text-emerald-400 p-3 rounded-xl overflow-x-auto">
              {fileInfo.hexHeader}
            </p>
            <p className="text-xs text-slate-500 pt-1">{fileInfo.signature.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. Audio Format Identifier & 3. Video Format Identifier & 4. Metadata
// ==========================================
export const AudioFormatIdentifier: React.FC = () => <MediaFileInspector />;
export const VideoFormatIdentifier: React.FC = () => <MediaFileInspector />;
export const MediaMetadataExtractor: React.FC = () => <MediaFileInspector />;

// ==========================================
// 5. Media Duration Checker
// ==========================================
export const MediaDurationChecker: React.FC = () => {
  const [duration, setDuration] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const media = document.createElement(file.type.startsWith('video') ? 'video' : 'audio');
    media.src = URL.createObjectURL(file);
    media.onloadedmetadata = () => {
      setDuration(media.duration);
    };
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Media Duration Checker</h2>
        <p className="text-sm text-slate-500">Quickly extract exact playback duration from audio and video files without uploading.</p>
      </div>

      <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
        <Clock className="w-8 h-8 text-slate-400 mb-2" />
        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Select Audio or Video File</span>
        <input type="file" accept="audio/*,video/*" onChange={handleFile} className="hidden" />
      </label>

      {duration !== null && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Total Playback Duration</span>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.floor(duration / 60)}m {(Math.floor(duration) % 60).toString().padStart(2, '0')}s
          </p>
          <p className="text-xs text-slate-500 mt-1">{duration.toFixed(3)} total seconds ({fileName})</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. Media Resolution Checker
// ==========================================
export const MediaResolutionChecker: React.FC = () => {
  const [res, setRes] = useState<{ width: number; height: number; megaPixels: number } | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type.startsWith('video')) {
      const v = document.createElement('video');
      v.src = URL.createObjectURL(file);
      v.onloadedmetadata = () => {
        const mp = Math.round((v.videoWidth * v.videoHeight) / 100000) / 10;
        setRes({ width: v.videoWidth, height: v.videoHeight, megaPixels: mp });
      };
    } else {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const mp = Math.round((img.naturalWidth * img.naturalHeight) / 100000) / 10;
        setRes({ width: img.naturalWidth, height: img.naturalHeight, megaPixels: mp });
      };
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Media Resolution Checker</h2>
        <p className="text-sm text-slate-500">Inspect exact pixel width, height, and megapixel count for images and videos.</p>
      </div>

      <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
        <Maximize2 className="w-8 h-8 text-slate-400 mb-2" />
        <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Select Image or Video</span>
        <input type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
      </label>

      {res && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Dimensions</span>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{res.width} × {res.height} px</p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Megapixels</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{res.megaPixels} MP</p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
            <span className="text-xs text-slate-400 font-bold uppercase">Orientation</span>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {res.width > res.height ? 'Landscape' : res.width < res.height ? 'Portrait' : 'Square'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. File Bitrate Calculator
// ==========================================
export const FileBitrateCalculator: React.FC = () => {
  const [sizeMb, setSizeMb] = useState(25);
  const [durationSec, setDurationSec] = useState(120);

  const bitrate = calculateBitrate(sizeMb * 1024 * 1024, durationSec);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">File Bitrate Calculator</h2>
        <p className="text-sm text-slate-500">Calculate overall audio/video bitrate from file size and total duration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">File Size (MB)</label>
          <input type="number" value={sizeMb} onChange={(e) => setSizeMb(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Duration (Seconds)</label>
          <input type="number" value={durationSec} onChange={(e) => setDurationSec(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Bitrate in Kbps</span>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{bitrate.kbps.toLocaleString()} kbps</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Bitrate in Mbps</span>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{bitrate.mbps} Mbps</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. Aspect Ratio Calculator
// ==========================================
export const AspectRatioCalculator: React.FC = () => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const ratio = calculateAspectRatio(width, height);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Aspect Ratio Calculator</h2>
        <p className="text-sm text-slate-500">Calculate simplified aspect ratios and identify nearest standard cinema and social aspect ratios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Width (px)</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Height (px)</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Simplified Ratio</span>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{ratio.ratioText}</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Decimal Multiplier</span>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{ratio.decimal}</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Nearest Standard</span>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{ratio.closestStandard}</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. Frame Rate Calculator
// ==========================================
export const FrameRateCalculator: React.FC = () => {
  const [fps, setFps] = useState(60);

  const frameTimeMs = Math.round((1000 / fps) * 100) / 100;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frame Rate Calculator</h2>
        <p className="text-sm text-slate-500">Calculate single-frame exposure budget in milliseconds across target frame rates.</p>
      </div>

      <div className="max-w-md">
        <label className="text-xs font-semibold block mb-1">Target Frames Per Second (FPS)</label>
        <input type="number" min="1" max="240" value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center max-w-md">
        <span className="text-xs font-bold uppercase text-slate-400">Time Per Frame</span>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{frameTimeMs} ms</p>
        <p className="text-xs text-slate-500 mt-1">Each frame renders within a {frameTimeMs} millisecond window.</p>
      </div>
    </div>
  );
};

// ==========================================
// 10. Media File Size Estimator
// ==========================================
export const MediaFileSizeEstimator: React.FC = () => {
  const [durationMin, setDurationMin] = useState(10);
  const [bitrateKbps, setBitrateKbps] = useState(4500); // 4.5 Mbps 1080p

  const size = calculateMediaSize(bitrateKbps, durationMin * 60);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Media File Size Estimator</h2>
        <p className="text-sm text-slate-500">Estimate video or audio file size from duration and bitrate encoding settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Duration (Minutes)</label>
          <input type="number" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Encoding Bitrate (Kbps)</label>
          <input type="number" value={bitrateKbps} onChange={(e) => setBitrateKbps(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          <span className="text-[11px] text-slate-400 mt-1 block">E.g. 1080p video ≈ 4,500 Kbps, 4K ≈ 20,000 Kbps, Podcast ≈ 128 Kbps</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Estimated Size in Megabytes</span>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{size.megaBytes.toLocaleString()} MB</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-bold uppercase text-slate-400">Estimated Size in Gigabytes</span>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{size.gigaBytes} GB</p>
        </div>
      </div>
    </div>
  );
};
