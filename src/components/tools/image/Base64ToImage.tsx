import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Download, Trash2, Image as ImageIcon } from 'lucide-react';

export const Base64ToImage: React.FC = () => {
  const { showToast } = useToast();
  const [base64Input, setBase64Input] = useState('');

  // Normalize data uri if user pasted raw base64 without prefix
  const getNormalizedSrc = () => {
    let clean = base64Input.trim();
    if (!clean) return null;
    if (!clean.startsWith('data:image/')) {
      clean = `data:image/png;base64,${clean}`;
    }
    return clean;
  };

  const imageSrc = getNormalizedSrc();

  const handleDownload = () => {
    if (!imageSrc) return;
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = 'decoded_image.png';
    a.click();
    showToast('Decoded image downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Base64 Image String or Data URI
          </label>
          {base64Input && (
            <button
              onClick={() => setBase64Input('')}
              className="text-rose-500 hover:text-rose-600 text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
        <textarea
          rows={6}
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          className="input-base text-xs font-mono break-all leading-relaxed"
          placeholder="Paste data:image/png;base64,... or raw Base64 string here..."
        />
      </div>

      {imageSrc ? (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
            Decoded Image Preview
          </h3>
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <img
              src={imageSrc}
              alt="Decoded output"
              className="max-h-72 object-contain rounded shadow"
              onError={() => showToast('Invalid Base64 image data', 'error')}
            />
          </div>
          <button onClick={handleDownload} className="btn-primary w-full py-3 text-sm">
            <Download className="w-4 h-4" /> Download as PNG
          </button>
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <span>Paste a Base64 string above to render and download the image.</span>
        </div>
      )}
    </div>
  );
};
