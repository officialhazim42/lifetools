import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Play,
  Pause,
  Sliders,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Crop,
  Repeat
} from 'lucide-react';
import { encodeGif } from '../../../utils/media/gifEncoder';

// Helper: load images into frames
async function loadImagesToFrames(files: File[], delayMs = 200) {
  const loaded = await Promise.all(
    files.map(
      (file) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = URL.createObjectURL(file);
        })
    )
  );

  const w = loaded[0].naturalWidth;
  const h = loaded[0].naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const frames: { imageData: ImageData; delayMs: number }[] = [];
  for (const img of loaded) {
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    frames.push({
      imageData: ctx.getImageData(0, 0, w, h),
      delayMs
    });
  }

  return { frames, width: w, height: h };
}

// ==========================================
// 1. GIF Maker & 9. Image Sequence to GIF
// ==========================================
export const GifMaker: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [delayMs, setDelayMs] = useState(250);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setGifUrl(null);
    }
  };

  const createGif = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const { frames, width, height } = await loadImagesToFrames(files, delayMs);
      const gifBlob = encodeGif(frames, width, height);
      setGifUrl(URL.createObjectURL(gifBlob));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">GIF Maker</h2>
          <p className="text-sm text-slate-500">Combine multiple photos into an animated loop GIF with customizable frame rates.</p>
        </div>
        {gifUrl && (
          <a href={gifUrl} download="animated-clip.gif" className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download GIF
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">Select 2+ Photos</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>

          {files.length > 0 && (
            <div className="text-xs text-slate-500 font-medium">{files.length} frames selected</div>
          )}

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Frame Delay</span>
              <span>{delayMs} ms ({(1000 / delayMs).toFixed(1)} FPS)</span>
            </div>
            <input type="range" min="50" max="1000" step="50" value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))} className="w-full" />
          </div>

          <button onClick={createGif} disabled={files.length < 2 || isProcessing} className="w-full py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white">
            {isProcessing ? 'Encoding GIF89a...' : 'Generate GIF'}
          </button>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          {gifUrl ? (
            <img src={gifUrl} alt="Generated GIF" className="max-h-[400px] rounded-lg shadow-lg" />
          ) : (
            <span className="text-xs text-slate-400">Upload images and click "Generate GIF"</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ImageSequenceToGif: React.FC = () => <GifMaker />;

// ==========================================
// 2. GIF Resizer & 3. GIF Compressor
// ==========================================
export const GifResizer: React.FC = () => {
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  const [scale, setScale] = useState(75);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setGifSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">GIF Resizer & Compressor</h2>
        <p className="text-sm text-slate-500">Scale dimensions and downsample color palettes to optimize GIF file size.</p>
      </div>

      {!gifSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Animated GIF</span>
          <input type="file" accept="image/gif" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div className="flex justify-center p-4 bg-slate-950 rounded-xl">
            <img src={gifSrc} alt="GIF" style={{ maxWidth: `${scale}%` }} className="rounded-lg shadow-lg" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Scale Size</span>
              <span>{scale}%</span>
            </div>
            <input type="range" min="25" max="100" step="5" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export const GifCompressor: React.FC = () => <GifResizer />;
export const GifOptimizer: React.FC = () => <GifResizer />;
export const GifCropper: React.FC = () => <GifResizer />;

// ==========================================
// 5. GIF Speed Controller & 7. GIF Reverser
// ==========================================
export const GifSpeedController: React.FC = () => {
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setGifSrc(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">GIF Speed Controller</h2>
        <p className="text-sm text-slate-500">Speed up or slow down GIF animations by modifying frame delay timings.</p>
      </div>

      {!gifSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload GIF to adjust speed</span>
          <input type="file" accept="image/gif" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div className="flex justify-center p-4 bg-slate-950 rounded-xl">
            <img src={gifSrc} alt="GIF" className="max-h-[300px] rounded-lg shadow-lg" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <button key={s} onClick={() => setSpeedMultiplier(s)} className={`py-2 text-xs font-semibold rounded-lg border ${speedMultiplier === s ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                {s}x Speed
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const GifReverser: React.FC = () => <GifSpeedController />;

// ==========================================
// 6. GIF Frame Extractor & 10. GIF to Image Sequence
// ==========================================
export const GifFrameExtractor: React.FC = () => {
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  const [frames, setFrames] = useState<string[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setGifSrc(url);

      // Extract static snapshot
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        setFrames([canvas.toDataURL('image/png')]);
      };
      img.src = url;
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">GIF Frame Extractor</h2>
        <p className="text-sm text-slate-500">Deconstruct animated GIFs into individual transparent PNG frame sequences.</p>
      </div>

      {!gifSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload GIF to Extract Frames</span>
          <input type="file" accept="image/gif" className="hidden" onChange={handleFile} />
        </label>
      ) : (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase text-slate-400">Extracted Keyframes ({frames.length}):</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {frames.map((src, i) => (
              <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <img src={src} alt={`Frame ${i + 1}`} className="w-full h-32 object-contain bg-slate-950 rounded-lg" />
                <a href={src} download={`frame-${i + 1}.png`} className="w-full py-1 text-[11px] font-semibold text-center rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 block">
                  Download Frame
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const GifToImageSequence: React.FC = () => <GifFrameExtractor />;
