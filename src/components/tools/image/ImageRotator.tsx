import React, { useState, useRef } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Upload, Download, RotateCcw, RotateCw } from 'lucide-react';

export const ImageRotator: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [fileName, setFileName] = useState('image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
      setRotationDegrees(0);
    };
    reader.readAsDataURL(file);
  };

  const rotateBy = (deg: number) => {
    setRotationDegrees((prev) => (prev + deg + 360) % 360);
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const isOrthogonal = rotationDegrees === 90 || rotationDegrees === 270;
      canvas.width = isOrthogonal ? img.naturalHeight : img.naturalWidth;
      canvas.height = isOrthogonal ? img.naturalWidth : img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationDegrees * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}_rot${rotationDegrees}.png`;
      a.click();
      showToast('Rotated image downloaded!');
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
            <RotateCw className="w-7 h-7" />
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Select an image to rotate
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Rotate clockwise 90°, 180°, 270° or arbitrary angles losslessly.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button onClick={() => rotateBy(-90)} className="btn-secondary text-xs py-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> 90° Left
              </button>
              <button onClick={() => rotateBy(90)} className="btn-secondary text-xs py-1.5">
                <RotateCw className="w-3.5 h-3.5" /> 90° Right
              </button>
              <button onClick={() => rotateBy(180)} className="btn-secondary text-xs py-1.5">
                180° Flip
              </button>
            </div>

            <button
              onClick={() => {
                setImageSrc(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="btn-secondary text-xs py-1"
            >
              Change Image
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden min-h-[300px]">
            <img
              src={imageSrc}
              alt="Rotate preview"
              className="max-h-72 object-contain transition-transform duration-300"
              style={{ transform: `rotate(${rotationDegrees}deg)` }}
            />
            <span className="text-xs font-semibold text-slate-500 mt-4">
              Current Angle: {rotationDegrees}°
            </span>
          </div>

          <button onClick={handleDownload} className="btn-primary w-full py-3 text-sm">
            <Download className="w-4 h-4" /> Download Rotated PNG
          </button>
        </div>
      )}
    </div>
  );
};
