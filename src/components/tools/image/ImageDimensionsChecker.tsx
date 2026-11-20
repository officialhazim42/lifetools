import React, { useState, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Upload, Maximize2, RotateCcw } from 'lucide-react';

export const ImageDimensionsChecker: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<{
    width: number;
    height: number;
    megapixels: string;
    aspect: string;
    imageSrc: string;
    fileName: string;
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
        const d = gcd(img.naturalWidth, img.naturalHeight);
        const aspect = `${img.naturalWidth / d}:${img.naturalHeight / d}`;
        const megapixels = ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2);

        setData({
          width: img.naturalWidth,
          height: img.naturalHeight,
          megapixels: `${megapixels} MP`,
          aspect,
          imageSrc: src,
          fileName: file.name
        });
        showToast('Dimensions inspected!');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {!data ? (
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
            <Maximize2 className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Upload an image to check exact pixel dimensions
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Instantly checks natural resolution, aspect ratio, and megapixels.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-md">
              {data.fileName}
            </span>
            <button
              onClick={() => {
                setData(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="btn-secondary text-xs py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Check Another
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {data.width} &times; {data.height}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Width &times; Height (px)</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {data.aspect}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Aspect Ratio</div>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {data.megapixels}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold uppercase">Total Megapixels</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl">
            <img src={data.imageSrc} alt="Preview" className="max-h-72 object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
};
