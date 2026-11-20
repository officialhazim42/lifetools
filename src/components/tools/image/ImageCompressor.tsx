import React, { useState, useRef, useEffect } from 'react';
import { formatBytes } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Upload, Download, RotateCcw, Zap } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalBytes, setOriginalBytes] = useState<number>(0);
  const [compressedBytes, setCompressedBytes] = useState<number>(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [fileName, setFileName] = useState<string>('compressed_image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setOriginalBytes(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBytes(blob.size);
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
          }
        },
        'image/jpeg',
        quality / 100
      );
    };
    img.src = imageSrc;
  }, [imageSrc, quality]);

  const savings =
    originalBytes > 0 && compressedBytes > 0
      ? Math.round(((originalBytes - compressedBytes) / originalBytes) * 100)
      : 0;

  const handleDownload = () => {
    if (!compressedUrl) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    a.download = `${fileName}_compressed.jpg`;
    a.click();
    showToast('Compressed image downloaded!');
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-12 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Select an image to compress
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Reduces image file size instantly in your browser without uploading to any server.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  Compression Stats: {savings >= 0 ? `${savings}% reduction` : 'Optimized'}
                </span>
              </div>
              <button
                onClick={() => {
                  setImageSrc(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn-secondary text-xs py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Choose Different Image
              </button>
            </div>

            {/* Quality Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                <span>Compression Quality</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Original Size</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatBytes(originalBytes)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-semibold">
                  Compressed Size
                </span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatBytes(compressedBytes)}
                </span>
              </div>
            </div>

            {/* Preview */}
            {compressedUrl && (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
                <img
                  src={compressedUrl}
                  alt="Compressed output"
                  className="max-h-72 object-contain rounded shadow-sm"
                />
              </div>
            )}

            <button onClick={handleDownload} className="btn-primary w-full py-3 text-sm">
              <Download className="w-4 h-4" /> Download Compressed JPEG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
