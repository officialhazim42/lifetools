import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Link as LinkIcon,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Maximize2,
  FileCheck2,
  X
} from 'lucide-react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import {
  LogoShape,
  ErrorCorrectionLevel,
  QrLogoOptions,
  validateLogoFile,
  renderQrToCanvas,
  validateQrScannability,
  generateQrSvg,
  renderHighResQrBlob
} from '../../../utils/qrLogoRenderer';

export const UrlQrGenerator: React.FC = () => {
  const { showToast } = useToast();

  // 1. URL State
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // 2. Logo State
  const [hasLogo, setHasLogo] = useState(false);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState('');
  const [logoFileSize, setLogoFileSize] = useState('');
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 3. Logo Customization Options
  const [logoSizePreset, setLogoSizePreset] = useState<'small' | 'medium' | 'large' | 'custom'>('medium');
  const [logoSizePercent, setLogoSizePercent] = useState<number>(20); // 10 to 28%
  const [logoShape, setLogoShape] = useState<LogoShape>('rounded');
  const [logoBackgroundType, setLogoBackgroundType] = useState<'transparent' | 'white' | 'custom'>('white');
  const [logoCustomBg, setLogoCustomBg] = useState('#FFFFFF');
  const [logoPadding, setLogoPadding] = useState<number>(4); // 0 to 16
  const [hasBorder, setHasBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#0F172A');
  const [borderThickness, setBorderThickness] = useState<number>(2); // 1 to 8

  // 4. QR Appearance Options
  const [foregroundColor, setForegroundColor] = useState('#0F172A');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('H');
  const [quietZone, setQuietZone] = useState<number>(2); // 1, 2, 4
  const [previewSize, setPreviewSize] = useState<number>(384); // 256, 384, 512

  // 5. Verification & Status
  const [scanStatus, setScanStatus] = useState<'verified' | 'warning' | 'checking'>('checking');
  const [isDownloading, setIsDownloading] = useState(false);

  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate URL format
  useEffect(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError(touched ? 'URL cannot be empty.' : null);
    } else if (!/^https?:\/\//i.test(trimmed)) {
      setUrlError('Tip: URLs starting with https:// are automatically clickable on mobile cameras.');
    } else {
      setUrlError(null);
    }
  }, [url, touched]);

  // Compute actual logo background color
  const effectiveLogoBg =
    logoBackgroundType === 'transparent'
      ? 'transparent'
      : logoBackgroundType === 'white'
        ? '#FFFFFF'
        : logoCustomBg;

  // Build options object
  const currentOptions: QrLogoOptions = {
    url: url.trim() || 'https://lifetools.app',
    width: previewSize,
    margin: quietZone,
    foregroundColor,
    backgroundColor,
    errorCorrectionLevel: errorCorrection,
    hasLogo,
    logoImage,
    logoDataUrl,
    logoSizePercent,
    logoShape,
    logoBackground: effectiveLogoBg,
    logoPadding,
    hasBorder,
    borderColor,
    borderThickness
  };

  // Re-render canvas whenever any option changes
  const renderCanvas = useCallback(async () => {
    if (!canvasRef.current) return;
    setScanStatus('checking');

    try {
      await renderQrToCanvas(canvasRef.current, currentOptions);

      // Verify scannability via client-side jsQR
      const result = validateQrScannability(canvasRef.current, currentOptions.url);
      setScanStatus(result.isScannable ? 'verified' : 'warning');
    } catch (err) {
      console.error('Error rendering QR code:', err);
      setScanStatus('warning');
    }
  }, [currentOptions]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // File Upload Handlers
  const processImageFile = (file: File) => {
    const validation = validateLogoFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid file format', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();

      img.onload = () => {
        setLogoImage(img);
        setLogoDataUrl(dataUrl);
        setLogoFileName(file.name);
        setLogoFileSize(`${(file.size / 1024).toFixed(1)} KB`);
        setLogoDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setHasLogo(true);

        // Enforce High Error Correction (H) by default when logo is enabled
        setErrorCorrection('H');

        showToast('Logo uploaded and centered in QR code!');
      };

      img.onerror = () => {
        showToast('Failed to load image. The file may be corrupted.', 'error');
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      showToast('Error reading uploaded image file.', 'error');
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveLogo = () => {
    setLogoImage(null);
    setLogoDataUrl(null);
    setLogoFileName('');
    setLogoFileSize('');
    setLogoDimensions(null);
    setHasLogo(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Logo removed from QR code.');
  };

  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Preset Size Switcher
  const handleSizePresetChange = (preset: 'small' | 'medium' | 'large' | 'custom') => {
    setLogoSizePreset(preset);
    if (preset === 'small') setLogoSizePercent(15);
    else if (preset === 'medium') setLogoSizePercent(20);
    else if (preset === 'large') setLogoSizePercent(25);
  };

  const handleCustomSizeChange = (val: number) => {
    setLogoSizePercent(val);
    setLogoSizePreset('custom');
  };

  // Download Handlers
  const downloadPng = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `qrcode-${hasLogo ? 'branded' : 'standard'}.png`;
      a.click();
      showToast('Downloaded QR code PNG.');
    } catch (err) {
      showToast('Failed to download PNG.', 'error');
    }
  };

  const downloadHighResPng = async () => {
    setIsDownloading(true);
    try {
      const blob = await renderHighResQrBlob(currentOptions, 2048);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `qrcode-highres-2048px-${hasLogo ? 'branded' : 'standard'}.png`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      showToast('Downloaded high-resolution (2048px) QR code PNG.');
    } catch (err) {
      showToast('Failed to generate high-resolution PNG.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadSvg = async () => {
    try {
      const svgString = await generateQrSvg(currentOptions);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `qrcode-${hasLogo ? 'branded' : 'standard'}.svg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      showToast('Downloaded vector SVG QR code.');
    } catch (err) {
      showToast('Failed to export vector SVG.', 'error');
    }
  };

  const handleCopyUrl = () => {
    copyToClipboard(url);
    showToast('Target URL copied to clipboard!');
  };

  // Reset to default
  const handleReset = () => {
    setUrl('');
    setTouched(false);
    handleRemoveLogo();
    setForegroundColor('#0F172A');
    setBackgroundColor('#FFFFFF');
    setErrorCorrection('H');
    setQuietZone(2);
    setPreviewSize(384);
    setLogoSizePreset('medium');
    setLogoSizePercent(20);
    setLogoShape('rounded');
    setLogoBackgroundType('white');
    setLogoCustomBg('#FFFFFF');
    setLogoPadding(4);
    setHasBorder(false);
    setBorderColor('#0F172A');
    setBorderThickness(2);
    showToast('Customizations reset to defaults.');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. URL Input Section */}
      <div className="card-base p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label
            htmlFor="target-url-input"
            className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4 text-emerald-500" />
            Target Website URL
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUrl('https://')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              https://
            </button>
            <button
              type="button"
              onClick={() => setUrl('http://')}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              http://
            </button>
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500 transition-colors"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <input
            id="target-url-input"
            type="url"
            value={url}
            onChange={(e) => {
              setTouched(true);
              setUrl(e.target.value);
            }}
            className="input-base text-base font-medium pr-10"
            placeholder="Enter website URL (e.g. https://yourwebsite.com)"
          />
          {url && /^https?:\/\//i.test(url) && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
              title="Test open URL in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {urlError && (
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            {urlError}
          </p>
        )}
      </div>

      {/* Main Grid: Controls (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Customization */}
        <div className="lg:col-span-7 space-y-6">
          {/* 2. Custom Logo Upload Section */}
          <div className="card-base p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Customize with Your Logo
                </h3>
              </div>
              {hasLogo && (
                <button
                  type="button"
                  onClick={() => setHasLogo(!hasLogo)}
                  className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition-colors ${hasLogo
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  title="Toggle logo visibility"
                >
                  {hasLogo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {hasLogo ? 'Logo Visible' : 'Logo Hidden'}
                </button>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!logoImage ? (
              /* Dropzone empty state */
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleTriggerFilePicker}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                  }`}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Click to upload or drag and drop your logo
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-3">
                  Supports transparent PNG, JPG, JPEG, and WebP (up to 5 MB). Processed 100% locally in your browser.
                </p>
                <button
                  type="button"
                  className="btn-secondary text-xs py-1.5 px-3 pointer-events-none"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              /* Uploaded logo preview card */
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                    {logoDataUrl && (
                      <img
                        src={logoDataUrl}
                        alt="Logo thumbnail"
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                      {logoFileName || 'Custom Logo'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {logoFileSize}
                      {logoDimensions ? ` • ${logoDimensions.width}×${logoDimensions.height}px` : ''}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Ready & Centered
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleTriggerFilePicker}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Remove logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Logo Customization Options (active when logo exists) */}
          {hasLogo && logoImage && (
            <div className="card-base p-6 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Logo Styling Controls
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Centered in QR</span>
              </div>

              {/* Logo Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Logo Size ({logoSizePercent}% of QR)
                  </label>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {logoSizePercent}%
                  </span>
                </div>

                {/* Preset buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'small', label: 'Small (15%)', val: 15 },
                      { id: 'medium', label: 'Medium (20%)', val: 20 },
                      { id: 'large', label: 'Large (25%)', val: 25 },
                      { id: 'custom', label: 'Custom', val: logoSizePercent }
                    ] as const
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSizePresetChange(preset.id)}
                      className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${logoSizePreset === preset.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={10}
                  max={28}
                  step={1}
                  value={logoSizePercent}
                  onChange={(e) => handleCustomSizeChange(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>10% (Minimal)</span>
                  <span>20% (Optimal)</span>
                  <span>28% (Max Safe)</span>
                </div>
              </div>

              {/* Logo Shape */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Logo Shape
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'rounded', label: 'Rounded Square' },
                      { id: 'circle', label: 'Circle' },
                      { id: 'square', label: 'Square' }
                    ] as const
                  ).map((shape) => (
                    <button
                      key={shape.id}
                      type="button"
                      onClick={() => setLogoShape(shape.id)}
                      className={`text-xs py-2 px-3 rounded-lg font-medium border text-center transition-all ${logoShape === shape.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Background */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Logo Background
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'white', label: 'White (#FFF)' },
                      { id: 'transparent', label: 'Transparent' },
                      { id: 'custom', label: 'Custom Color' }
                    ] as const
                  ).map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setLogoBackgroundType(bg.id)}
                      className={`text-xs py-2 px-3 rounded-lg font-medium border text-center transition-all ${logoBackgroundType === bg.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>

                {logoBackgroundType === 'custom' && (
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="color"
                      value={logoCustomBg}
                      onChange={(e) => setLogoCustomBg(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      value={logoCustomBg}
                      onChange={(e) => setLogoCustomBg(e.target.value)}
                      className="input-base font-mono uppercase text-xs w-32"
                    />
                    <span className="text-xs text-slate-400">Background fill behind the logo</span>
                  </div>
                )}
              </div>

              {/* Logo Padding */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Logo Padding ({logoPadding}px)
                  </label>
                  <span className="text-xs font-mono text-slate-500">{logoPadding} px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={16}
                  step={1}
                  value={logoPadding}
                  onChange={(e) => setLogoPadding(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Logo Border */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                      Logo Border
                    </label>
                    <span className="text-xs text-slate-400">Frame border around the center logo</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasBorder(!hasBorder)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasBorder ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasBorder ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                {hasBorder && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Border Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-9 h-9 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                        />
                        <input
                          type="text"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="input-base font-mono uppercase text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-500 uppercase">
                          Thickness ({borderThickness}px)
                        </label>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={8}
                        step={1}
                        value={borderThickness}
                        onChange={(e) => setBorderThickness(Number(e.target.value))}
                        className="w-full accent-emerald-500 mt-2"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. QR Appearance Controls */}
          <div className="card-base p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  QR Appearance & Colors
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Foreground Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  QR Pattern (Foreground)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="input-base font-mono uppercase text-xs"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  QR Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="input-base font-mono uppercase text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Error Correction Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Error Correction Level
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                  className="input-base text-xs font-medium"
                >
                  <option value="H">H - High (30% Recovery) • Recommended</option>
                  <option value="Q">Q - Quartile (25% Recovery)</option>
                  <option value="M">M - Medium (15% Recovery)</option>
                  <option value="L">L - Low (7% Recovery)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  {hasLogo
                    ? 'Level H is active to preserve scan accuracy while embedding a center logo.'
                    : 'Higher levels add redundant data to keep the code scannable if smudged or damaged.'}
                </p>
              </div>

              {/* Quiet Zone / Margin */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Quiet Zone (Border Margin)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 4].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuietZone(m)}
                      className={`text-xs py-2 px-2 rounded-lg font-medium border text-center transition-all ${quietZone === m
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                      {m} module{m > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Outer spacing standard for scanner edge isolation.
                </p>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset All Customizations
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live QR Preview & Downloads (Sticky on Desktop) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
          {/* QR Code Preview Card */}
          <div className="card-base p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                Live QR Code Preview
              </h3>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-slate-400 hover:text-emerald-500 text-xs flex items-center gap-1 transition-colors"
                title="Copy URL"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </button>
            </div>

            {/* Canvas Display Container */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
              <div
                className="p-3 bg-white rounded-xl shadow-subtle border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                style={{ backgroundColor }}
              >
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto transition-all duration-200"
                  style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
                />
              </div>

              {/* Status Badges */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {scanStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Scannable (jsQR Verified)
                  </span>
                ) : scanStatus === 'warning' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" /> Scan Warning (Check Size/Contrast)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Verifying Readability...
                  </span>
                )}

                <span className="text-[11px] font-mono text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {previewSize}×{previewSize}px
                </span>
              </div>
            </div>

            {/* Preview Size Selector */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Preview Size:</span>
              <div className="flex items-center gap-1.5">
                {[256, 384, 512].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPreviewSize(s)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${previewSize === s
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            {/* Download Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={downloadPng}
                className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" /> Download Standard PNG
              </button>

              <button
                type="button"
                onClick={downloadHighResPng}
                disabled={isDownloading}
                className="btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2 border-emerald-500/30 hover:border-emerald-500 text-emerald-700 dark:text-emerald-300"
              >
                <Maximize2 className="w-4 h-4" />
                {isDownloading ? 'Rendering 2048px...' : 'Download High-Res PNG (2048px Print)'}
              </button>

              <button
                type="button"
                onClick={downloadSvg}
                className="btn-secondary w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Vector SVG
              </button>
            </div>

            {/* Reliability Disclaimer Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed space-y-1">
              <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
                Physical Scan Verification Advisory
              </p>
              <p>
                While High Error Correction (H) allows recovery of up to 30% obstructed data, real-world
                scan performance depends on camera sensor resolution, focal distance, glare, and ambient
                lighting. Always test-scan your branded QR code on a physical mobile device before bulk
                printing or publishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
