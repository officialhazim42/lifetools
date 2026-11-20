import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Copy, Check, Lock, Unlock, Download, Code, Sparkles, CheckCircle2 } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';

interface ColorSwatch {
  hex: string;
  locked: boolean;
}

// Convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function getBrightness(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export const ColorPaletteGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [harmony, setHarmony] = useState<'random' | 'analogous' | 'complementary' | 'triadic' | 'monochromatic'>('random');
  const [colors, setColors] = useState<ColorSwatch[]>([
    { hex: '#4F46E5', locked: false },
    { hex: '#06B6D4', locked: false },
    { hex: '#10B981', locked: false },
    { hex: '#F59E0B', locked: false },
    { hex: '#EC4899', locked: false }
  ]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const generateHarmonic = useCallback(() => {
    const baseH = Math.floor(Math.random() * 360);
    const baseS = Math.floor(55 + Math.random() * 35);
    const baseL = Math.floor(45 + Math.random() * 20);

    let hues: number[] = [];
    if (harmony === 'analogous') {
      hues = [baseH, (baseH + 25) % 360, (baseH + 50) % 360, (baseH + 75) % 360, (baseH + 100) % 360];
    } else if (harmony === 'complementary') {
      const comp = (baseH + 180) % 360;
      hues = [baseH, (baseH + 20) % 360, (baseH - 20 + 360) % 360, comp, (comp + 20) % 360];
    } else if (harmony === 'triadic') {
      const t1 = (baseH + 120) % 360;
      const t2 = (baseH + 240) % 360;
      hues = [baseH, (baseH + 15) % 360, t1, (t1 + 15) % 360, t2];
    } else if (harmony === 'monochromatic') {
      // same hue, differing lightness/saturation
      setColors(prev =>
        prev.map((c, i) => {
          if (c.locked) return c;
          const l = 20 + i * 16;
          return { hex: hslToHex(baseH, baseS, l), locked: false };
        })
      );
      return;
    } else {
      // pure random harmonious
      hues = Array.from({ length: 5 }, () => Math.floor(Math.random() * 360));
    }

    setColors(prev =>
      prev.map((c, i) => {
        if (c.locked) return c;
        const s = Math.max(20, Math.min(95, baseS + (i % 2 === 0 ? 10 : -10)));
        const l = Math.max(25, Math.min(85, 30 + i * 12));
        return { hex: hslToHex(hues[i], s, l), locked: false };
      })
    );
  }, [harmony]);

  useEffect(() => {
    generateHarmonic();
  }, [harmony]);

  // Spacebar triggers generator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        generateHarmonic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateHarmonic]);

  const toggleLock = (index: number) => {
    setColors(prev =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  const updateColorHex = (index: number, newHex: string) => {
    setColors(prev =>
      prev.map((c, i) => (i === index ? { ...c, hex: newHex } : c))
    );
  };

  const handleCopyHex = async (hex: string) => {
    const ok = await copyToClipboard(hex);
    if (ok) {
      setCopiedHex(hex);
      showToast(`Copied ${hex}!`, 'success');
      setTimeout(() => setCopiedHex(null), 1500);
    }
  };

  const exportCss = () => {
    const css = `:root {\n${colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`;
    downloadFile(css, 'palette.css', 'text/css');
    showToast('Downloaded palette.css', 'success');
  };

  const exportJson = () => {
    const json = JSON.stringify(
      colors.map((c, i) => {
        const rgb = hexToRgb(c.hex);
        return { id: i + 1, hex: c.hex, rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` };
      }),
      null,
      2
    );
    downloadFile(json, 'palette.json', 'application/json');
    showToast('Downloaded palette.json', 'success');
  };

  const exportSvg = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="200" viewBox="0 0 1000 200">
${colors.map((c, i) => `  <rect x="${i * 200}" y="0" width="200" height="200" fill="${c.hex}" />
  <text x="${i * 200 + 100}" y="105" font-family="monospace" font-size="16" font-weight="bold" fill="${getBrightness(c.hex) > 128 ? '#000000' : '#ffffff'}" text-anchor="middle">${c.hex}</text>`).join('\n')}
</svg>`;
    downloadFile(svg, 'palette.svg', 'image/svg+xml');
    showToast('Downloaded palette.svg', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Harmony Mode:</label>
          <select
            value={harmony}
            onChange={(e) => setHarmony(e.target.value as any)}
            className="p-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-medium"
          >
            <option value="random">Dynamic Harmonious</option>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="monochromatic">Monochromatic</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateHarmonic}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Generate (Space)
          </button>
        </div>
      </div>

      {/* Palette Swatches */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 rounded-2xl overflow-hidden p-2 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        {colors.map((c, idx) => {
          const isLight = getBrightness(c.hex) > 130;
          return (
            <div
              key={idx}
              className="h-64 sm:h-80 rounded-xl relative flex flex-col justify-between p-4 transition-all duration-300 shadow-sm"
              style={{ backgroundColor: c.hex }}
            >
              {/* Lock Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => toggleLock(idx)}
                  className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                    c.locked
                      ? 'bg-black/40 text-amber-300 ring-2 ring-amber-400'
                      : isLight
                      ? 'bg-black/10 hover:bg-black/20 text-slate-800'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title={c.locked ? 'Color Locked' : 'Lock Color'}
                >
                  {c.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
              </div>

              {/* Color Info */}
              <div className="space-y-2">
                <button
                  onClick={() => handleCopyHex(c.hex)}
                  className={`w-full py-2 px-3 rounded-lg font-mono font-bold text-center text-sm sm:text-base backdrop-blur-md flex items-center justify-center gap-1.5 transition-all ${
                    isLight
                      ? 'bg-black/10 hover:bg-black/20 text-slate-900'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {copiedHex === c.hex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{c.hex}</span>
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColorHex(idx, e.target.value.toUpperCase())}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    title="Pick custom color"
                  />
                  <div
                    className={`text-xs font-mono truncate ${
                      isLight ? 'text-slate-800/80' : 'text-white/80'
                    }`}
                  >
                    RGB: {Object.values(hexToRgb(c.hex)).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Export Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs">Spacebar</kbd> anytime to shuffle unlocked colors!
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCss}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Code className="w-3.5 h-3.5" /> CSS Variables
          </button>
          <button
            onClick={exportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> JSON
          </button>
          <button
            onClick={exportSvg}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> SVG
          </button>
        </div>
      </div>
    </div>
  );
};
