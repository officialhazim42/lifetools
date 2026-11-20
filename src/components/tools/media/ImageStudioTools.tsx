import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Copy,
  Check,
  Crop,
  Shield,
  Palette,
  Eye,
  Type,
  Maximize2
} from 'lucide-react';

// Common drag and drop file loader hook
function useImageLoader() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image.png');
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageSrc(url);
    };
    img.src = url;
  }, []);

  const clear = useCallback(() => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setDimensions({ width: 0, height: 0 });
  }, [imageSrc]);

  return { imageSrc, fileName, dimensions, handleFile, clear, setImageSrc };
}

// ==========================================
// 1. Image Background Color Changer
// ==========================================
export const ImageBgColorChanger: React.FC = () => {
  const { imageSrc, fileName, dimensions, handleFile, clear } = useImageLoader();
  const [bgColor, setBgColor] = useState('#ffffff');
  const [padding, setPadding] = useState(20);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth + padding * 2;
      canvas.height = img.naturalHeight + padding * 2;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding);
    };
    img.src = imageSrc;
  }, [imageSrc, bgColor, padding]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `bg-changed-${fileName.replace(/\.[^/.]+$/, '')}.${format === 'png' ? 'png' : 'jpg'}`;
    link.href = canvasRef.current.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Background Color Changer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Replace transparent backgrounds or add colored studio framing behind product photos.
          </p>
        </div>
        {imageSrc && (
          <div className="flex items-center gap-2">
            <button onClick={clear} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              Clear Image
            </button>
            <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Click to upload or drag image here</span>
          <span className="text-xs text-slate-400 mt-1">PNG with transparency recommended, JPG, or WebP</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div className="flex gap-2 mt-2">
                {['#ffffff', '#000000', '#f1f5f9', '#fef3c7', '#dbeafe', '#dcfce7'].map((c) => (
                  <button key={c} onClick={() => setBgColor(c)} style={{ backgroundColor: c }} className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 shadow-sm" />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Padding / Border Margin</span>
                <span>{padding}px</span>
              </div>
              <input type="range" min="0" max="150" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">Export Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setFormat('png')} className={`py-1.5 text-xs font-medium rounded-lg border ${format === 'png' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700'}`}>
                  PNG (Lossless)
                </button>
                <button onClick={() => setFormat('jpeg')} className={`py-1.5 text-xs font-medium rounded-lg border ${format === 'jpeg' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700'}`}>
                  JPEG (Solid)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. Image Watermark Maker
// ==========================================
export const ImageWatermarkMaker: React.FC = () => {
  const { imageSrc, fileName, handleFile, clear } = useImageLoader();
  const [text, setText] = useState('© LifeTools Studio');
  const [opacity, setOpacity] = useState(60);
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'tile'>('bottom-right');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;

      if (position === 'tile') {
        ctx.rotate(-Math.PI / 6);
        for (let x = -canvas.width; x < canvas.width * 2; x += 300) {
          for (let y = -canvas.height; y < canvas.height * 2; y += 150) {
            ctx.fillText(text, x, y);
          }
        }
      } else {
        const textMetrics = ctx.measureText(text);
        let x = canvas.width - textMetrics.width - 30;
        let y = canvas.height - 30;

        if (position === 'center') {
          x = (canvas.width - textMetrics.width) / 2;
          y = canvas.height / 2;
        } else if (position === 'bottom-left') {
          x = 30;
          y = canvas.height - 30;
        } else if (position === 'top-right') {
          x = canvas.width - textMetrics.width - 30;
          y = fontSize + 30;
        }
        ctx.fillText(text, x, y);
      }
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, text, opacity, fontSize, color, position]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `watermarked-${fileName}`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Watermark Maker</h2>
          <p className="text-sm text-slate-500">Protect photos with customizable text or repeat pattern watermarks.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload image to watermark</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold block mb-1">Watermark Text</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Position</label>
              <select value={position} onChange={(e: any) => setPosition(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="tile">Repeat Tile Pattern</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Opacity</span>
                <span>{opacity}%</span>
              </div>
              <input type="range" min="10" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input type="range" min="14" max="120" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Color</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. Image Border Generator
// ==========================================
export const ImageBorderGenerator: React.FC = () => {
  const { imageSrc, fileName, handleFile, clear } = useImageLoader();
  const [borderWidth, setBorderWidth] = useState(16);
  const [borderColor, setBorderColor] = useState('#1e293b');
  const [polaroid, setPolaroid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const b = borderWidth;
      const bottomExtra = polaroid ? b * 3 : b;
      canvas.width = img.naturalWidth + b * 2;
      canvas.height = img.naturalHeight + b + bottomExtra;

      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, b, b);
    };
    img.src = imageSrc;
  }, [imageSrc, borderWidth, borderColor, polaroid]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `bordered-${fileName}`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Border Generator</h2>
          <p className="text-sm text-slate-500">Wrap photos in solid, stylish, or Polaroid-style custom borders.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload photo to frame</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Border Width</span>
                <span>{borderWidth}px</span>
              </div>
              <input type="range" min="2" max="100" value={borderWidth} onChange={(e) => setBorderWidth(Number(e.target.value))} className="w-full" />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Border Color</label>
              <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-8 rounded-lg cursor-pointer" />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input type="checkbox" checked={polaroid} onChange={(e) => setPolaroid(e.target.checked)} className="rounded text-emerald-600" />
                Polaroid Bottom Margin
              </label>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. Image Rounded Corners
// ==========================================
export const ImageRoundedCorners: React.FC = () => {
  const { imageSrc, fileName, handleFile, clear } = useImageLoader();
  const [radius, setRadius] = useState(40);
  const [circle, setCircle] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.beginPath();
      if (circle) {
        const r = Math.min(canvas.width, canvas.height) / 2;
        ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, Math.PI * 2);
      } else {
        const r = Math.min(radius, canvas.width / 2, canvas.height / 2);
        ctx.roundRect ? ctx.roundRect(0, 0, canvas.width, canvas.height, r) : ctx.rect(0, 0, canvas.width, canvas.height);
      }
      ctx.clip();
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };
    img.src = imageSrc;
  }, [imageSrc, radius, circle]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `rounded-${fileName.replace(/\.[^/.]+$/, '')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Rounded Corners</h2>
          <p className="text-sm text-slate-500">Clip images with smooth rounded corners or export as circular avatars.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download PNG
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload image to round</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium mb-3">
                <input type="checkbox" checked={circle} onChange={(e) => setCircle(e.target.checked)} className="rounded text-emerald-600" />
                Circular Avatar Mode
              </label>
            </div>

            {!circle && (
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Corner Radius</span>
                  <span>{radius}px</span>
                </div>
                <input type="range" min="5" max="300" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. Image Frame Maker
// ==========================================
export const ImageFrameMaker: React.FC = () => {
  const { imageSrc, fileName, handleFile, clear } = useImageLoader();
  const [frameStyle, setFrameStyle] = useState<'classic-wood' | 'gold' | 'neon' | 'vintage'>('classic-wood');
  const [thickness, setThickness] = useState(24);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const t = thickness;
      canvas.width = img.naturalWidth + t * 2;
      canvas.height = img.naturalHeight + t * 2;

      if (frameStyle === 'gold') {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#d97706');
        grad.addColorStop(0.5, '#fde68a');
        grad.addColorStop(1, '#b45309');
        ctx.fillStyle = grad;
      } else if (frameStyle === 'neon') {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = t / 2;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 15;
        ctx.strokeRect(t / 2, t / 2, canvas.width - t, canvas.height - t);
      } else if (frameStyle === 'vintage') {
        ctx.fillStyle = '#fef3c7';
      } else {
        ctx.fillStyle = '#451a03'; // classic wood
      }

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      ctx.drawImage(img, t, t);
    };
    img.src = imageSrc;
  }, [imageSrc, frameStyle, thickness]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `framed-${fileName}`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Frame Maker</h2>
          <p className="text-sm text-slate-500">Apply artistic wood, metallic gold, vintage or neon gallery frames.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload photo for framing</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold block mb-1">Frame Style</label>
              <select value={frameStyle} onChange={(e: any) => setFrameStyle(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="classic-wood">Classic Dark Wood</option>
                <option value="gold">Metallic Gold Gallery</option>
                <option value="neon">Cyber Neon Glow</option>
                <option value="vintage">Vintage Sepia Border</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Frame Thickness</span>
                <span>{thickness}px</span>
              </div>
              <input type="range" min="8" max="80" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. Image Collage Maker
// ==========================================
export const ImageCollageMaker: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [layout, setLayout] = useState<'2-col' | '2-row' | '3-col' | '4-grid'>('2-col');
  const [gap, setGap] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const urls: string[] = [];
    Array.from(e.target.files).forEach((file) => {
      urls.push(URL.createObjectURL(file));
    });
    setImages(urls.slice(0, 4));
  };

  const renderCanvas = useCallback(async () => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1200;
    canvas.height = 800;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const loaded = await Promise.all(
      images.map(
        (src) =>
          new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          })
      )
    );

    if (layout === '2-col') {
      const w = (canvas.width - gap * 3) / 2;
      const h = canvas.height - gap * 2;
      loaded.forEach((img, i) => {
        if (i < 2) ctx.drawImage(img, gap + i * (w + gap), gap, w, h);
      });
    } else if (layout === '2-row') {
      const w = canvas.width - gap * 2;
      const h = (canvas.height - gap * 3) / 2;
      loaded.forEach((img, i) => {
        if (i < 2) ctx.drawImage(img, gap, gap + i * (h + gap), w, h);
      });
    } else if (layout === '3-col') {
      const w = (canvas.width - gap * 4) / 3;
      const h = canvas.height - gap * 2;
      loaded.forEach((img, i) => {
        if (i < 3) ctx.drawImage(img, gap + i * (w + gap), gap, w, h);
      });
    } else {
      // 4-grid
      const w = (canvas.width - gap * 3) / 2;
      const h = (canvas.height - gap * 3) / 2;
      loaded.forEach((img, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        if (i < 4) ctx.drawImage(img, gap + col * (w + gap), gap + row * (h + gap), w, h);
      });
    }
  }, [images, layout, gap]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'collage.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Collage Maker</h2>
          <p className="text-sm text-slate-500">Combine multiple photos into 2-column, 3-column, or 4-grid photo collages.</p>
        </div>
        {images.length > 0 && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Collage
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold block mb-1">Select Images (Up to 4)</label>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-emerald-500 file:text-white cursor-pointer" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Grid Layout</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setLayout('2-col')} className={`p-2 text-xs font-medium rounded-lg border ${layout === '2-col' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                2 Side-by-Side
              </button>
              <button onClick={() => setLayout('2-row')} className={`p-2 text-xs font-medium rounded-lg border ${layout === '2-row' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                2 Stacked
              </button>
              <button onClick={() => setLayout('3-col')} className={`p-2 text-xs font-medium rounded-lg border ${layout === '3-col' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                3 Columns
              </button>
              <button onClick={() => setLayout('4-grid')} className={`p-2 text-xs font-medium rounded-lg border ${layout === '4-grid' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                4 Grid (2x2)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Grid Spacing</span>
              <span>{gap}px</span>
            </div>
            <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. Image Comparison Tool (Before / After Slider)
// ==========================================
export const ImageComparisonTool: React.FC = () => {
  const [imgA, setImgA] = useState<string | null>(null);
  const [imgB, setImgB] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image Comparison Tool</h2>
          <p className="text-sm text-slate-500">Compare Before and After photos with an interactive split slider.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Upload Image A (Before)</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setImgA(URL.createObjectURL(e.target.files[0]))} />
        </label>
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Upload Image B (After)</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && setImgB(URL.createObjectURL(e.target.files[0]))} />
        </label>
      </div>

      {imgA && imgB && (
        <div className="space-y-3">
          <div className="relative max-w-2xl mx-auto h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl select-none">
            <img src={imgB} alt="After" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
              <img src={imgA} alt="Before" className="w-full h-full object-cover" style={{ width: '100%', maxWidth: 'none' }} />
            </div>
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center text-xs font-bold">
                ⮂⮃
              </div>
            </div>
            <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">Before</span>
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">After</span>
          </div>
          <div className="max-w-md mx-auto">
            <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8-14. Image Filter & Adjustment Components
// (Blur, Pixelate, Brightness, Contrast, Saturation, Grayscale, Inverter)
// ==========================================
function FilterStudioTool({
  title,
  description,
  filterType,
  min = -100,
  max = 100,
  defaultValue = 0,
  unit = '%'
}: {
  title: string;
  description: string;
  filterType: 'blur' | 'pixelate' | 'brightness' | 'contrast' | 'saturation' | 'grayscale' | 'invert';
  min?: number;
  max?: number;
  defaultValue?: number;
  unit?: string;
}) {
  const { imageSrc, fileName, handleFile, clear } = useImageLoader();
  const [value, setValue] = useState(defaultValue);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      if (filterType === 'pixelate') {
        const blockSize = Math.max(2, Math.round(value));
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d')!;
        offCanvas.width = Math.max(1, Math.floor(canvas.width / blockSize));
        offCanvas.height = Math.max(1, Math.floor(canvas.height / blockSize));
        offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height, 0, 0, canvas.width, canvas.height);
      } else {
        let cssFilter = 'none';
        if (filterType === 'blur') cssFilter = `blur(${value}px)`;
        if (filterType === 'brightness') cssFilter = `brightness(${100 + value}%)`;
        if (filterType === 'contrast') cssFilter = `contrast(${100 + value}%)`;
        if (filterType === 'saturation') cssFilter = `saturate(${100 + value}%)`;
        if (filterType === 'grayscale') cssFilter = `grayscale(${value}%)`;
        if (filterType === 'invert') cssFilter = `invert(${value}%)`;

        ctx.filter = cssFilter;
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
      }
    };
    img.src = imageSrc;
  }, [imageSrc, filterType, value]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${filterType}-${fileName}`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Intensity</span>
                <span>{value}{unit}</span>
              </div>
              <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full" />
            </div>
            <button onClick={() => setValue(defaultValue)} className="w-full py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
              Reset to Default
            </button>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

export const ImageBlurTool: React.FC = () => (
  <FilterStudioTool title="Image Blur Tool" description="Apply customizable Gaussian blur to soften photos or protect privacy." filterType="blur" min={0} max={30} defaultValue={6} unit="px" />
);

export const ImagePixelator: React.FC = () => (
  <FilterStudioTool title="Image Pixelator" description="Transform photos into retro 8-bit pixel art or censor sensitive details." filterType="pixelate" min={2} max={40} defaultValue={12} unit="px" />
);

export const ImageBrightnessAdjuster: React.FC = () => (
  <FilterStudioTool title="Image Brightness Adjuster" description="Fine-tune exposure and brighten dark or underexposed photos." filterType="brightness" min={-100} max={100} defaultValue={20} unit="%" />
);

export const ImageContrastAdjuster: React.FC = () => (
  <FilterStudioTool title="Image Contrast Adjuster" description="Enhance color dynamic range and deepen shadows and highlights." filterType="contrast" min={-100} max={100} defaultValue={25} unit="%" />
);

export const ImageSaturationAdjuster: React.FC = () => (
  <FilterStudioTool title="Image Saturation Adjuster" description="Make colors pop with vivid saturation or reduce vibrancy." filterType="saturation" min={-100} max={200} defaultValue={50} unit="%" />
);

export const ImageGrayscaleConverter: React.FC = () => (
  <FilterStudioTool title="Image Grayscale Converter" description="Convert color photographs into timeless black and white monochrome." filterType="grayscale" min={0} max={100} defaultValue={100} unit="%" />
);

export const ImageColorInverter: React.FC = () => (
  <FilterStudioTool title="Image Color Inverter" description="Generate photo negative effects and invert RGB color spectrums." filterType="invert" min={0} max={100} defaultValue={100} unit="%" />
);

// ==========================================
// 15. Image DPI Calculator
// ==========================================
export const ImageDpiCalculator: React.FC = () => {
  const [pixelsW, setPixelsW] = useState(3000);
  const [pixelsH, setPixelsH] = useState(2000);
  const [dpi, setDpi] = useState(300);

  const inchesW = Math.round((pixelsW / dpi) * 100) / 100;
  const inchesH = Math.round((pixelsH / dpi) * 100) / 100;
  const cmW = Math.round(inchesW * 2.54 * 10) / 10;
  const cmH = Math.round(inchesH * 2.54 * 10) / 10;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Image DPI Calculator</h2>
        <p className="text-sm text-slate-500">Calculate physical print sizes (inches and centimeters) from pixel dimensions and print DPI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Width (Pixels)</label>
          <input type="number" value={pixelsW} onChange={(e) => setPixelsW(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Height (Pixels)</label>
          <input type="number" value={pixelsH} onChange={(e) => setPixelsH(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Target Print DPI</label>
          <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="72">72 DPI (Standard Web / Screen)</option>
            <option value="150">150 DPI (Draft Print / Newspaper)</option>
            <option value="300">300 DPI (Standard High-Res Print)</option>
            <option value="600">600 DPI (Fine Art / Gallery Quality)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Print Size in Inches</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{inchesW}" × {inchesH}"</p>
          <p className="text-xs text-slate-500 mt-1">Width: {inchesW} in | Height: {inchesH} in</p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Print Size in Centimeters</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{cmW} cm × {cmH} cm</p>
          <p className="text-xs text-slate-500 mt-1">Width: {cmW} cm | Height: {cmH} cm</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 16. Passport Photo Maker
// ==========================================
export const PassportPhotoMaker: React.FC = () => {
  const { imageSrc, fileName, handleFile, clear } = useImageLoader();
  const [country, setCountry] = useState<'us' | 'uk' | 'in'>('us');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // US: 600x600 (2x2 inch at 300dpi), UK/India: 413x531 (35x45mm at 300dpi)
    const targetW = country === 'us' ? 600 : 413;
    const targetH = country === 'us' ? 600 : 531;
    canvas.width = targetW;
    canvas.height = targetH;

    const img = new Image();
    img.onload = () => {
      // Cover fit
      const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (targetW - w) / 2;
      const y = (targetH - h) / 2;

      ctx.drawImage(img, x, y, w, h);

      // Biometric Guide Overlay
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      // Eye line
      ctx.beginPath();
      ctx.moveTo(0, targetH * 0.45);
      ctx.lineTo(targetW, targetH * 0.45);
      ctx.stroke();
    };
    img.src = imageSrc;
  }, [imageSrc, country]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `passport-photo-${country}.jpg`;
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.98);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Passport Photo Maker</h2>
          <p className="text-sm text-slate-500">Crop and prepare official biometric passport and visa photographs.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download (300 DPI)
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload portrait photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold block mb-1">Standard / Country</label>
              <select value={country} onChange={(e: any) => setCountry(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value="us">United States (2×2 in / 51×51 mm)</option>
                <option value="uk">United Kingdom / Schengen (35×45 mm)</option>
                <option value="in">India Passport & Visa (35×45 mm)</option>
              </select>
            </div>
            <p className="text-xs text-slate-400">Dotted green line denotes the recommended biometric eye level.</p>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <canvas ref={canvasRef} className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 17. ID Photo Sheet Generator
// ==========================================
export const IdPhotoSheetGenerator: React.FC = () => {
  const { imageSrc, handleFile } = useImageLoader();
  const [copies, setCopies] = useState<6 | 8>(6);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard 4x6 inch print at 300 DPI = 1800 x 1200
    canvas.width = 1800;
    canvas.height = 1200;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.onload = () => {
      const cols = copies === 6 ? 3 : 4;
      const rows = 2;
      const cardW = 420;
      const cardH = 520;
      const marginX = (canvas.width - cols * cardW) / (cols + 1);
      const marginY = (canvas.height - rows * cardH) / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = marginX + c * (cardW + marginX);
          const y = marginY + r * (cardH + marginY);
          ctx.drawImage(img, x, y, cardW, cardH);
          // Cut lines
          ctx.strokeStyle = '#e2e8f0';
          ctx.strokeRect(x, y, cardW, cardH);
        }
      }
    };
    img.src = imageSrc;
  }, [imageSrc, copies]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'id-photo-sheet-4x6.jpg';
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.98);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">ID Photo Sheet Generator</h2>
          <p className="text-sm text-slate-500">Tile passport photos onto standard 4×6 inch photo print sheets with cutting guides.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Sheet (4×6")
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload single passport photo</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-semibold block mb-1">Grid Density</label>
              <select value={copies} onChange={(e: any) => setCopies(Number(e.target.value) as any)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <option value={6}>6 Photos (3×2 grid)</option>
                <option value={8}>8 Photos (4×2 grid)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <canvas ref={canvasRef} className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 18. Social Media Image Resizer
// ==========================================
export const SocialMediaImageResizer: React.FC = () => {
  const { imageSrc, handleFile } = useImageLoader();
  const [platform, setPlatform] = useState<'ig-square' | 'ig-story' | 'yt-thumb' | 'tw-header'>('ig-square');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const specs = {
    'ig-square': { w: 1080, h: 1080, name: 'Instagram Square (1080×1080)' },
    'ig-story': { w: 1080, h: 1920, name: 'Instagram Story / Reel (1080×1920)' },
    'yt-thumb': { w: 1280, h: 720, name: 'YouTube Thumbnail (1280×720)' },
    'tw-header': { w: 1500, h: 500, name: 'Twitter / X Header (1500×500)' }
  };

  const renderCanvas = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cur = specs[platform];
    canvas.width = cur.w;
    canvas.height = cur.h;

    const img = new Image();
    img.onload = () => {
      const scale = Math.max(cur.w / img.naturalWidth, cur.h / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (cur.w - w) / 2;
      const y = (cur.h - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    };
    img.src = imageSrc;
  }, [imageSrc, platform]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${platform}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Social Media Image Resizer</h2>
          <p className="text-sm text-slate-500">Auto-crop and format images for Instagram, YouTube, and Twitter/X.</p>
        </div>
        {imageSrc && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {!imageSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload image to resize</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {(Object.keys(specs) as (keyof typeof specs)[]).map((k) => (
              <button key={k} onClick={() => setPlatform(k)} className={`w-full p-2.5 text-xs font-medium text-left rounded-lg border ${platform === k ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-700'}`}>
                {specs[k].name}
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <canvas ref={canvasRef} className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 19. YouTube Thumbnail Maker
// ==========================================
export const YoutubeThumbnailMaker: React.FC = () => {
  const { imageSrc, handleFile } = useImageLoader();
  const [headline, setHeadline] = useState('CREATE VIRAL THUMBNAILS');
  const [badgeText, setBadgeText] = useState('MUST WATCH');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    const drawContent = (bgImg?: HTMLImageElement) => {
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Badge
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(60, 60, 220, 50);
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeText, 85, 95);

      // Headline text
      ctx.font = '900 68px sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(headline, 60, 220);
      ctx.fillText(headline, 60, 220);
      ctx.shadowBlur = 0;
    };

    if (imageSrc) {
      const img = new Image();
      img.onload = () => drawContent(img);
      img.src = imageSrc;
    } else {
      drawContent();
    }
  }, [imageSrc, headline, badgeText]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'youtube-thumbnail-1280x720.jpg';
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">YouTube Thumbnail Maker</h2>
          <p className="text-sm text-slate-500">Design eye-catching 1280×720 thumbnails with high-impact bold typography.</p>
        </div>
        <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Download (1280×720)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold block mb-1">Optional Background Image</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="w-full text-xs text-slate-500" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Badge Tag</label>
            <input type="text" value={badgeText} onChange={(e) => setBadgeText(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Main Headline</label>
            <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <canvas ref={canvasRef} className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 20. Instagram Post Maker
// ==========================================
export const InstagramPostMaker: React.FC = () => {
  const { imageSrc, handleFile } = useImageLoader();
  const [quote, setQuote] = useState('Design is intelligence made visible.');
  const [author, setAuthor] = useState('— Alina Wheeler');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    const drawContent = (bgImg?: HTMLImageElement) => {
      if (bgImg) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#312e81');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'italic 52px serif';
      ctx.textAlign = 'center';
      ctx.fillText(`"${quote}"`, canvas.width / 2, canvas.height / 2);

      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(author, canvas.width / 2, canvas.height / 2 + 80);
      ctx.textAlign = 'left';
    };

    if (imageSrc) {
      const img = new Image();
      img.onload = () => drawContent(img);
      img.src = imageSrc;
    } else {
      drawContent();
    }
  }, [imageSrc, quote, author]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const download = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'instagram-post-1080x1080.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Instagram Post Maker</h2>
          <p className="text-sm text-slate-500">Design elegant square quote posts and aesthetic lifestyle graphics.</p>
        </div>
        <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" /> Download (1080×1080)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-semibold block mb-1">Optional Backdrop Photo</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="w-full text-xs text-slate-500" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Quote or Message</label>
            <textarea value={quote} onChange={(e) => setQuote(e.target.value)} rows={3} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1">Author / Handle</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          <canvas ref={canvasRef} className="max-w-full max-h-[450px] object-contain rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  );
};
