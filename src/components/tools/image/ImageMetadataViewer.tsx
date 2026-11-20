import React, { useState, useRef } from 'react';
import { formatBytes } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Upload, Info, RotateCcw } from 'lucide-react';

export const ImageMetadataViewer: React.FC = () => {
  const { showToast } = useToast();
  const [meta, setMeta] = useState<{
    name: string;
    size: number;
    type: string;
    width: number;
    height: number;
    aspectRatio: string;
    megapixels: string;
    lastModified: string;
    imageSrc: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
        const divisor = gcd(img.naturalWidth, img.naturalHeight);
        const aspect = `${img.naturalWidth / divisor}:${img.naturalHeight / divisor}`;
        const megapixels = ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2);

        setMeta({
          name: file.name,
          size: file.size,
          type: file.type || 'Unknown',
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: aspect,
          megapixels: `${megapixels} MP`,
          lastModified: new Date(file.lastModified).toLocaleString(),
          imageSrc: src
        });
        showToast('Image metadata extracted');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {!meta ? (
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
            <Info className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Select an image to inspect metadata
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Reads file size, dimensions, MIME format, aspect ratio, megapixels, and file header info.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-md">
              {meta.name}
            </h3>
            <button
              onClick={() => {
                setMeta(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="btn-secondary text-xs py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Inspect Another
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <img
                src={meta.imageSrc}
                alt="Inspected"
                className="max-h-64 object-contain rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 block">Dimensions</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {meta.width} &times; {meta.height} px
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 block">File Size</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {formatBytes(meta.size)}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 block">Aspect Ratio</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {meta.aspectRatio}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 block">Resolution</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {meta.megapixels}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 block">MIME Type</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {meta.type}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 block">Last Modified</span>
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                  {meta.lastModified}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
