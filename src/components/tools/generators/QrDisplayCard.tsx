import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Download, Copy } from 'lucide-react';

interface QrDisplayCardProps {
  qrData: string;
  title?: string;
  defaultFilename?: string;
}

export const QrDisplayCard: React.FC<QrDisplayCardProps> = ({
  qrData,
  title = 'QR Code Preview',
  defaultFilename = 'qrcode'
}) => {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [svgString, setSvgString] = useState('');
  const [darkColor, setDarkColor] = useState('#0F172A');
  const [lightColor, setLightColor] = useState('#FFFFFF');

  useEffect(() => {
    if (!qrData.trim()) return;

    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        qrData,
        {
          width: 256,
          margin: 2,
          color: {
            dark: darkColor,
            light: lightColor
          },
          errorCorrectionLevel: 'M'
        },
        () => {}
      );
    }

    QRCode.toString(
      qrData,
      {
        type: 'svg',
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor
        },
        errorCorrectionLevel: 'M'
      },
      (err, string) => {
        if (!err && string) setSvgString(string);
      }
    );
  }, [qrData, darkColor, lightColor]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${defaultFilename}.png`;
    a.click();
    showToast(`Downloaded ${defaultFilename}.png`);
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${defaultFilename}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${defaultFilename}.svg`);
  };

  const handleCopyRaw = () => {
    copyToClipboard(qrData);
    showToast('Raw QR payload copied!');
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
          {title}
        </h3>
        <button onClick={handleCopyRaw} className="text-slate-400 hover:text-emerald-500 text-xs flex items-center gap-1">
          <Copy className="w-3.5 h-3.5" /> Copy Data
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <div className="p-3 bg-white rounded-2xl shadow-subtle border border-slate-100 flex items-center justify-center">
          <canvas ref={canvasRef} className="max-w-[200px] max-h-[200px]" />
        </div>

        <div className="space-y-4 w-full sm:w-auto">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Dots Color
              </label>
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                className="w-9 h-9 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
                Background
              </label>
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-9 h-9 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={handleDownloadPng} className="btn-primary text-xs py-2">
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
            <button onClick={handleDownloadSvg} className="btn-secondary text-xs py-2">
              <Download className="w-3.5 h-3.5" /> Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
