import React, { useState } from 'react';
import { ArrowLeftRight, GraduationCap, Calculator, Info, Check } from 'lucide-react';

type FormulaType = 'cbse' | 'vtu' | 'mumbai' | 'us4' | 'custom';

export const PercentageToCgpaConverter: React.FC = () => {
  const [direction, setDirection] = useState<'cgpaToPerc' | 'percToCgpa'>('cgpaToPerc');
  const [formula, setFormula] = useState<FormulaType>('cbse');
  const [customFactor, setCustomFactor] = useState<number>(9.5);
  const [inputValue, setInputValue] = useState<string>('8.6');

  const val = parseFloat(inputValue) || 0;

  // Convert CGPA -> Percentage
  const getPercentageFromCgpa = (cgpa: number): number => {
    switch (formula) {
      case 'cbse':
        return cgpa * 9.5;
      case 'vtu':
        return Math.max(0, (cgpa - 0.75) * 10);
      case 'mumbai':
        return cgpa >= 7 ? 7.1 * cgpa + 11 : 7.25 * cgpa + 11;
      case 'us4':
        return (cgpa / 4) * 100;
      case 'custom':
        return cgpa * (customFactor || 1);
      default:
        return cgpa * 9.5;
    }
  };

  // Convert Percentage -> CGPA
  const getCgpaFromPercentage = (perc: number): number => {
    switch (formula) {
      case 'cbse':
        return perc / 9.5;
      case 'vtu':
        return perc / 10 + 0.75;
      case 'mumbai':
        return perc >= 60.7 ? (perc - 11) / 7.1 : (perc - 11) / 7.25;
      case 'us4':
        return (perc / 100) * 4;
      case 'custom':
        return customFactor > 0 ? perc / customFactor : 0;
      default:
        return perc / 9.5;
    }
  };

  const result = direction === 'cgpaToPerc' ? getPercentageFromCgpa(val) : getCgpaFromPercentage(val);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Percentage to CGPA Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Convert grades between CGPA and marks percentage using CBSE, VTU, Mumbai University, or US 4.0 scales.
        </p>
      </div>

      {/* Conversion Direction Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => {
              setDirection('cgpaToPerc');
              setInputValue('8.6');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              direction === 'cgpaToPerc'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            CGPA ➔ Percentage (%)
          </button>
          <button
            onClick={() => {
              setDirection('percToCgpa');
              setInputValue('82');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              direction === 'percToCgpa'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Percentage (%) ➔ CGPA
          </button>
        </div>
      </div>

      {/* Main Conversion Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Input Side */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                {direction === 'cgpaToPerc' ? 'Enter CGPA' : 'Enter Percentage (%)'}
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={direction === 'cgpaToPerc' ? 'e.g. 8.6' : 'e.g. 82.5'}
                className="w-full text-2xl font-bold font-mono px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Conversion Standard / Formula
              </label>
              <select
                value={formula}
                onChange={e => setFormula(e.target.value as FormulaType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="cbse">CBSE / AICTE (Percentage = CGPA × 9.5)</option>
                <option value="vtu">VTU University (Percentage = [CGPA - 0.75] × 10)</option>
                <option value="mumbai">Mumbai University (7.1 × CGPA + 11)</option>
                <option value="us4">US 4.0 GPA Proportional Scale</option>
                <option value="custom">Custom Multiplier (CGPA × Factor)</option>
              </select>
            </div>

            {formula === 'custom' && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Custom Multiplier Factor
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={customFactor}
                  onChange={e => setCustomFactor(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Result Output Side */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/30 p-6 rounded-2xl border border-cyan-500/20 text-center flex flex-col items-center justify-center min-h-[180px]">
            <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
              {direction === 'cgpaToPerc' ? 'Equivalent Percentage' : 'Equivalent CGPA'}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-cyan-600 dark:text-cyan-400 my-2 font-mono">
              {result.toFixed(2)}
              {direction === 'cgpaToPerc' && '%'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formula === 'cbse' && 'Standard Indian CBSE / UGC 9.5 multiplier'}
              {formula === 'vtu' && 'Visvesvaraya Technological University official formula'}
              {formula === 'mumbai' && 'University of Mumbai engineering grading standard'}
              {formula === 'us4' && 'Proportional US 4.0 credit GPA mapping'}
              {formula === 'custom' && `Scaled using custom multiplier: ×${customFactor}`}
            </p>
          </div>
        </div>
      </div>

      {/* Reference Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-500" /> Quick Reference (CBSE 9.5 Scale)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          {[
            { cgpa: 10.0, perc: '95.0%' },
            { cgpa: 9.5, perc: '90.25%' },
            { cgpa: 9.0, perc: '85.5%' },
            { cgpa: 8.5, perc: '80.75%' },
            { cgpa: 8.0, perc: '76.0%' },
            { cgpa: 7.5, perc: '71.25%' },
            { cgpa: 7.0, perc: '66.5%' },
            { cgpa: 6.0, perc: '57.0%' }
          ].map((row, i) => (
            <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white font-mono">{row.cgpa} CGPA</div>
              <div className="text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">{row.perc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
