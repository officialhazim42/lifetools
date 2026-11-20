import React, { useState, useRef } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Upload, Download, Copy, RotateCcw } from 'lucide-react';

interface FaviconSize {
  size: number;
  label: string;
  url: string;
}

export const FaviconGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [icons, setIcons] = useState<FaviconSize[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizes = [
    { size: 16, label: '16x16 Favicon' },
    { size: 32, label: '32x32 Standard' },
    { size: 48, label: '48x48 Desktop' },
    { size: 180, label: '180x180 Apple Touch' },
    { size: 192, label: '192x192 Android PWA' },
    { size: 512, label: '512x512 PWA Splash' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        const generated: FaviconSize[] = sizes.map(({ size, label }) => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, size, size);
          }
          return {
            size,
            label,
            url: canvas.toDataURL('image/png')
          };
        });
        setIcons(generated);
        showToast('Generated multi-resolution favicon bundle!');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const downloadIcon = (icon: FaviconSize) => {
    const a = document.createElement('a');
    a.href = icon.url;
    a.download = `favicon-${icon.size}x${icon.size}.png`;
    a.click();
    showToast(`Downloaded favicon-${icon.size}x${icon.size}.png`);
  };

  const htmlSnippet = `<!-- Standard Favicons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android / Web App Manifest -->
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">`;

  const handleCopySnippet = () => {
    copyToClipboard(htmlSnippet);
    showToast('HTML tags copied!');
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
            Upload logo or icon to generate multi-size favicons
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Generates 16px, 32px, 48px, Apple Touch 180px, and Android PWA 192px/512px icons.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Generated Favicon Suite
              </span>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setIcons([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="btn-secondary text-xs py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Upload New Logo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {icons.map((ic) => (
                <div
                  key={ic.size}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1">
                    <img src={ic.url} alt={ic.label} className="max-w-full max-h-full" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">
                      {ic.size}&times;{ic.size}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{ic.label}</span>
                  </div>
                  <button
                    onClick={() => downloadIcon(ic)}
                    className="btn-secondary text-[11px] py-1 px-2 w-full mt-auto"
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                <span>Recommended HTML &lt;head&gt; Link Tags</span>
                <button onClick={handleCopySnippet} className="btn-secondary text-xs py-1">
                  <Copy className="w-3.5 h-3.5" /> Copy Tags
                </button>
              </div>
              <textarea
                rows={7}
                readOnly
                value={htmlSnippet}
                className="input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
