import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Download, Copy, RefreshCw, QrCode as QrCodeIcon, CreditCard } from 'lucide-react';
import { UpiQrGenerator } from '../generators/UpiQrGenerator';

export const QrCodeGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [activeMode, setActiveMode] = useState<'standard' | 'upi'>(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('upi')) {
      return 'upi';
    }
    return 'standard';
  });
  const [data, setData] = useState('https://lifetools.app');
  const [darkColor, setDarkColor] = useState('#0B132B');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [svgString, setSvgString] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data.trim()) return;

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        data,
        {
          width: 256,
          margin: 2,
          color: {
            dark: darkColor,
            light: lightColor,
          },
          errorCorrectionLevel: errorCorrection,
        },
        () => {}
      );
    }

    QRCode.toString(
      data,
      {
        type: 'svg',
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
        errorCorrectionLevel: errorCorrection,
      },
      (err, string) => {
        if (!err && string) setSvgString(string);
      }
    );
  }, [data, darkColor, lightColor, errorCorrection]);

  const downloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
    showToast('Downloaded qrcode.png');
  };

  const downloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded qrcode.svg');
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveMode('standard')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'standard'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <QrCodeIcon className="w-3.5 h-3.5" /> Standard Text / URL QR
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('upi')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'upi'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> UPI Payment QR
          </button>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          {activeMode === 'upi' ? 'Interoperable static & fixed-amount UPI payment QR' : 'Universal text & link QR generation'}
        </span>
      </div>

      {activeMode === 'upi' ? (
        <UpiQrGenerator />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-2 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
              Text or URL Content
            </label>
            <textarea
              rows={3}
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="input-base text-sm leading-relaxed"
              placeholder="Enter text or URL..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="input-base font-mono uppercase text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="input-base font-mono uppercase text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Error Correction
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as any)}
                className="input-base text-xs"
              >
                <option value="L">L - Low (7%)</option>
                <option value="M">M - Medium (15%)</option>
                <option value="Q">Q - Quartile (25%)</option>
                <option value="H">H - High (30%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* QR Preview Card */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle text-center space-y-4">
          <div className="p-3 bg-white rounded-2xl shadow-subtle border border-slate-100 flex items-center justify-center">
            <canvas ref={canvasRef} className="max-w-[190px] max-h-[190px]" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button onClick={downloadPng} className="btn-primary flex-1 text-xs py-2">
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
            <button onClick={downloadSvg} className="btn-secondary flex-1 text-xs py-2">
              <Download className="w-3.5 h-3.5" /> Download SVG
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
