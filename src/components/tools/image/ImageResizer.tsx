import React, { useState, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Upload, Download, RotateCcw, Lock, Unlock } from 'lucide-react';

export const ImageResizer: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(90);
  const [fileType, setFileType] = useState<string>('image/png');
  const [fileName, setFileName] = useState<string>('image');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setFileType(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setOriginalWidth(img.naturalWidth);
        setOriginalHeight(img.naturalHeight);
        setTargetWidth(img.naturalWidth);
        setTargetHeight(img.naturalHeight);
        showToast('Image loaded successfully');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (maintainAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (maintainAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(h * ratio));
    }
  };

  const handleDownload = () => {
    if (!imageSrc || targetWidth <= 0 || targetHeight <= 0) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw resized image with high-quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mime = fileType === 'image/jpeg' ? 'image/jpeg' : 'image/png';
      const ext = mime === 'image/jpeg' ? 'jpg' : 'png';
      const dataUrl = canvas.toDataURL(mime, quality / 100);

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${fileName}_${targetWidth}x${targetHeight}.${ext}`;
      a.click();
      showToast('Resized image downloaded!');
    };
    img.src = imageSrc;
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
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
            Click or drag & drop an image to resize
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Supports PNG, JPEG, WebP, SVG, BMP. 100% processed locally in browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500">Original Resolution: </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {originalWidth} &times; {originalHeight} px
                </span>
              </div>
              <button
                onClick={() => {
                  setImageSrc(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn-secondary text-xs py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Change Image
              </button>
            </div>

            {/* Resize Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Target Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="input-base text-base font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Target Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="input-base text-base font-bold font-mono"
                />
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => setMaintainAspect(!maintainAspect)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    maintainAspect
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {maintainAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span>{maintainAspect ? 'Lock Aspect Ratio' : 'Free Aspect Ratio'}</span>
                </button>
              </div>
            </div>

            {/* Quality Slider for JPEG */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                <span>Output Quality</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden">
              <img
                src={imageSrc}
                alt="Resize preview"
                className="max-h-72 object-contain rounded shadow-sm"
              />
              <span className="text-[11px] text-slate-400 mt-2">
                Target: {targetWidth} &times; {targetHeight} pixels
              </span>
            </div>

            {/* Action */}
            <button onClick={handleDownload} className="btn-primary w-full py-3 text-sm">
              <Download className="w-4 h-4" /> Download Resized Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
