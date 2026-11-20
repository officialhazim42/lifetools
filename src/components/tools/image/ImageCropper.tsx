import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Upload, Download, RotateCcw, Crop } from 'lucide-react';

export const ImageCropper: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [cropRatio, setCropRatio] = useState<'free' | '1:1' | '16:9' | '4:3'>('1:1');
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number>(200);
  const [cropHeight, setCropHeight] = useState<number>(200);
  const [imgNaturalWidth, setImgNaturalWidth] = useState<number>(0);
  const [imgNaturalHeight, setImgNaturalHeight] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setImgNaturalWidth(img.naturalWidth);
        setImgNaturalHeight(img.naturalHeight);
        const minSide = Math.min(img.naturalWidth, img.naturalHeight);
        setCropWidth(Math.round(minSide * 0.8));
        setCropHeight(Math.round(minSide * 0.8));
        setCropX(Math.round((img.naturalWidth - minSide * 0.8) / 2));
        setCropY(Math.round((img.naturalHeight - minSide * 0.8) / 2));
        showToast('Image loaded');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleRatioChange = (ratio: 'free' | '1:1' | '16:9' | '4:3') => {
    setCropRatio(ratio);
    if (ratio === '1:1') {
      const side = Math.min(cropWidth, cropHeight);
      setCropWidth(side);
      setCropHeight(side);
    } else if (ratio === '16:9') {
      setCropHeight(Math.round((cropWidth * 9) / 16));
    } else if (ratio === '4:3') {
      setCropHeight(Math.round((cropWidth * 3) / 4));
    }
  };

  const handleCropDownload = () => {
    if (!imageSrc || cropWidth <= 0 || cropHeight <= 0) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `cropped_${cropWidth}x${cropHeight}.png`;
      a.click();
      showToast('Cropped image downloaded!');
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
            <Crop className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Select an image to crop
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Choose aspect ratios: 1:1, 16:9, 4:3, or custom dimensions.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex gap-2">
              {(['1:1', '16:9', '4:3', 'free'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRatioChange(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    cropRatio === r
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {r === 'free' ? 'Free Form' : r}
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
              <RotateCcw className="w-3.5 h-3.5" /> Choose New Image
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Crop X (px)
              </label>
              <input
                type="number"
                min="0"
                max={imgNaturalWidth - 10}
                value={cropX}
                onChange={(e) => setCropX(Math.max(0, Number(e.target.value)))}
                className="input-base text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Crop Y (px)
              </label>
              <input
                type="number"
                min="0"
                max={imgNaturalHeight - 10}
                value={cropY}
                onChange={(e) => setCropY(Math.max(0, Number(e.target.value)))}
                className="input-base text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Width (px)
              </label>
              <input
                type="number"
                min="10"
                max={imgNaturalWidth - cropX}
                value={cropWidth}
                onChange={(e) => setCropWidth(Math.max(10, Number(e.target.value)))}
                className="input-base text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Height (px)
              </label>
              <input
                type="number"
                min="10"
                max={imgNaturalHeight - cropY}
                value={cropHeight}
                onChange={(e) => setCropHeight(Math.max(10, Number(e.target.value)))}
                className="input-base text-sm font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl overflow-hidden relative">
            <img
              src={imageSrc}
              alt="Source"
              className="max-h-72 object-contain opacity-75"
            />
          </div>

          <button onClick={handleCropDownload} className="btn-primary w-full py-3 text-sm">
            <Download className="w-4 h-4" /> Download Cropped Area ({cropWidth} &times; {cropHeight} px)
          </button>
        </div>
      )}
    </div>
  );
};
