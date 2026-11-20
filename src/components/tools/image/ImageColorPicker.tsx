import React, { useState, useRef, useEffect } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Upload, Copy, Pipette, RotateCcw } from 'lucide-react';

export const ImageColorPicker: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [pickedColor, setPickedColor] = useState<string>('#10B981');
  const [rgbValues, setRgbValues] = useState<{ r: number; g: number; b: number }>({ r: 16, g: 185, b: 129 });
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const pickColorFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

    setPickedColor(hex);
    setRgbValues({ r, g, b });
    setCoords({ x, y });
  };

  const handleCopy = (str: string) => {
    copyToClipboard(str);
    showToast(`Copied ${str}!`);
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
            <Pipette className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Upload an image to pick colors
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Click anywhere on the image to inspect pixel HEX and RGB color values.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Color Details Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center gap-6">
            <div
              className="w-24 h-24 rounded-2xl border-2 border-white dark:border-slate-800 shadow-elevated shrink-0 transition-colors"
              style={{ backgroundColor: pickedColor }}
            />

            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-base">
                  Selected Pixel Color
                </span>
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

              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => handleCopy(pickedColor)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:border-emerald-500 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs text-slate-500 block">HEX</span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {pickedColor}
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => handleCopy(`rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:border-emerald-500 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs text-slate-500 block">RGB</span>
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {rgbValues.r}, {rgbValues.g}, {rgbValues.b}
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 overflow-auto max-h-[450px]">
            <p className="text-xs text-slate-400 mb-2">Click or drag across the image to sample colors:</p>
            <canvas
              ref={canvasRef}
              onClick={pickColorFromEvent}
              onMouseMove={(e) => {
                if (e.buttons === 1) pickColorFromEvent(e);
              }}
              className="cursor-crosshair max-w-full rounded shadow"
            />
          </div>
        </div>
      )}
    </div>
  );
};
