import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RefreshCw } from 'lucide-react';

export const CssGradientGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState<number>(135);
  const [color1, setColor1] = useState('#10B981');
  const [color2, setColor2] = useState('#0284C7');

  const cssCode =
    gradientType === 'linear'
      ? `background: linear-gradient(${angle}deg, ${color1}, ${color2});`
      : `background: radial-gradient(circle, ${color1}, ${color2});`;

  const handleCopy = () => {
    copyToClipboard(cssCode);
    showToast('CSS gradient rule copied!');
  };

  const handleRandomize = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor1(randomHex());
    setColor2(randomHex());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="space-y-6">
      {/* Live Preview Display */}
      <div
        className="w-full h-48 sm:h-64 rounded-2xl shadow-elevated border border-slate-200 dark:border-slate-800 transition-all duration-300"
        style={{
          background:
            gradientType === 'linear'
              ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
              : `radial-gradient(circle, ${color1}, ${color2})`
        }}
      />

      {/* Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setGradientType('linear')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                gradientType === 'linear'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Linear Gradient
            </button>
            <button
              onClick={() => setGradientType('radial')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                gradientType === 'radial'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              Radial Gradient
            </button>
          </div>

          <button onClick={handleRandomize} className="btn-secondary text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5" /> Randomize Colors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Color Stop 1
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="input-base font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Color Stop 2
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="input-base font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {gradientType === 'linear' && (
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
              <span>Gradient Angle</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        )}

        {/* Generated CSS Code */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-2">
            <span>Generated CSS Code</span>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy CSS
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-mono text-xs text-emerald-600 dark:text-emerald-400 select-all">
            {cssCode}
          </div>
        </div>
      </div>
    </div>
  );
};
