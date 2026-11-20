import React, { useState, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Upload, Download, RotateCcw } from 'lucide-react';

export const ImageFormatConverter: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(92);
  const [fileName, setFileName] = useState<string>('converted_image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      showToast('Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleConvertAndDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (targetFormat === 'jpeg') {
        // Fill white background for JPEG transparent pixels
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const mime = `image/${targetFormat}`;
      const dataUrl = canvas.toDataURL(mime, quality / 100);

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${fileName}.${targetFormat === 'jpeg' ? 'jpg' : targetFormat}`;
      a.click();
      showToast(`Image downloaded as .${targetFormat === 'jpeg' ? 'jpg' : targetFormat}!`);
    };
    img.src = imageSrc;
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
            Select image to convert format
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Convert seamlessly between PNG, JPEG, and modern WebP.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setTargetFormat(fmt)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase border transition-all ${
                    targetFormat === fmt
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  Convert to {fmt}
                </button>
              ))}
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

          {targetFormat !== 'png' && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
                <span>Compression Quality</span>
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
          )}

          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <img src={imageSrc} alt="Preview" className="max-h-72 object-contain rounded" />
          </div>

          <button onClick={handleConvertAndDownload} className="btn-primary w-full py-3 text-sm">
            <Download className="w-4 h-4" /> Download as .{targetFormat === 'jpeg' ? 'jpg' : targetFormat}
          </button>
        </div>
      )}
    </div>
  );
};
