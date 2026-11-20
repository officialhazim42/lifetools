import React, { useState, useRef } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Upload, Copy, RotateCcw } from 'lucide-react';

export const ImageToBase64: React.FC = () => {
  const { showToast } = useToast();
  const [base64, setBase64] = useState<string>('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageSrc(dataUrl);
      setBase64(dataUrl);
      showToast('Image converted to Base64!');
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = (str: string, label: string) => {
    copyToClipboard(str);
    showToast(`${label} copied!`);
  };

  const cssBackground = `background-image: url("${base64}");`;
  const htmlTag = `<img src="${base64}" alt="${fileName || 'image'}" />`;

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
            Select an image to convert to Base64
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Converts image into data:image URL string, CSS background snippet, and HTML &lt;img&gt; tag.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-md">
              {fileName} ({base64.length.toLocaleString()} characters)
            </span>
            <button
              onClick={() => {
                setImageSrc(null);
                setBase64('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="btn-secondary text-xs py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Convert Another
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                <span>Base64 Data URI</span>
                <button onClick={() => handleCopy(base64, 'Base64 string')} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy Data URI
                </button>
              </div>
              <textarea
                rows={5}
                readOnly
                value={base64}
                className="input-base text-xs font-mono break-all bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                <span>CSS Background Rule</span>
                <button onClick={() => handleCopy(cssBackground, 'CSS snippet')} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy CSS
                </button>
              </div>
              <textarea
                rows={2}
                readOnly
                value={cssBackground}
                className="input-base text-xs font-mono break-all bg-slate-50 dark:bg-slate-850"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                <span>HTML &lt;img&gt; Element</span>
                <button onClick={() => handleCopy(htmlTag, 'HTML snippet')} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy HTML
                </button>
              </div>
              <textarea
                rows={2}
                readOnly
                value={htmlTag}
                className="input-base text-xs font-mono break-all bg-slate-50 dark:bg-slate-850"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
