import React, { useState } from 'react';
import { GraduationCap, Calculator, History, Trash2, Copy, Check, ArrowRight } from 'lucide-react';

interface HistoryItem {
  id: string;
  expr: string;
  result: string;
}

export const MathExpressionEvaluator: React.FC = () => {
  const [expression, setExpression] = useState('2 * (3 + 5) ^ 2 - sqrt(144)');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Safe evaluation supporting standard Math functions
  const evaluateSafe = (input: string) => {
    try {
      setError(null);
      let sanitized = input
        .replace(/pi/gi, String(Math.PI))
        .replace(/\be\b/gi, String(Math.E))
        .replace(/\^/g, '**')
        .replace(/sqrt\(/gi, 'Math.sqrt(')
        .replace(/cbrt\(/gi, 'Math.cbrt(')
        .replace(/sin\(/gi, 'Math.sin(')
        .replace(/cos\(/gi, 'Math.cos(')
        .replace(/tan\(/gi, 'Math.tan(')
        .replace(/log10\(/gi, 'Math.log10(')
        .replace(/log\(/gi, 'Math.log10(')
        .replace(/ln\(/gi, 'Math.log(')
        .replace(/abs\(/gi, 'Math.abs(')
        .replace(/round\(/gi, 'Math.round(')
        .replace(/floor\(/gi, 'Math.floor(')
        .replace(/ceil\(/gi, 'Math.ceil(');

      // Validate against permitted characters only: digits, Math.*, operators, parentheses, commas
      if (!/^[0-9+\-*/().,Mathsincotaqlgbrd eE*]+$/.test(sanitized)) {
        throw new Error('Invalid math expression or unsupported character.');
      }

      // Execute safely via Function constructor restricted to expression calculation
      // eslint-disable-next-line no-new-func
      const calcResult = Function(`"use strict"; return (${sanitized});`)();

      if (typeof calcResult !== 'number' || isNaN(calcResult)) {
        throw new Error('Calculation did not yield a valid number.');
      }

      const formattedResult = Number.isInteger(calcResult)
        ? String(calcResult)
        : Number(calcResult.toFixed(8)).toString();

      setResult(formattedResult);

      setHistory(prev => [
        { id: 'hist_' + Date.now(), expr: input, result: formattedResult },
        ...prev.slice(0, 19)
      ]);
    } catch (err: any) {
      setError(err?.message || 'Syntax error in mathematical expression.');
      setResult(null);
    }
  };

  const handleInsert = (str: string) => {
    setExpression(prev => prev + str);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Math Expression Evaluator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Evaluate complex mathematical expressions, powers, square roots, trigonometric ratios, and logarithms with calculation history.
        </p>
      </div>

      {/* Main Evaluator Box */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Mathematical Expression
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={expression}
              onChange={e => setExpression(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && evaluateSafe(expression)}
              placeholder="e.g. 5 * (4 + 6) ^ 2 - sqrt(81) + sin(pi / 2)"
              className="w-full text-lg font-bold font-mono px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
            />
            <button
              onClick={() => evaluateSafe(expression)}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              Evaluate <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Function Inserts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { label: '√x', insert: 'sqrt(' },
            { label: 'x^y', insert: ' ^ ' },
            { label: 'π', insert: 'pi' },
            { label: 'e', insert: 'e' },
            { label: 'sin()', insert: 'sin(' },
            { label: 'cos()', insert: 'cos(' },
            { label: 'tan()', insert: 'tan(' },
            { label: 'log()', insert: 'log(' },
            { label: 'ln()', insert: 'ln(' },
            { label: 'abs()', insert: 'abs(' },
            { label: '(', insert: '(' },
            { label: ')', insert: ')' }
          ].map(f => (
            <button
              key={f.label}
              onClick={() => handleInsert(f.insert)}
              className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Evaluation Output */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-xl border border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
                Result
              </span>
              <div className="text-3xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                {result}
              </div>
            </div>
            <button
              onClick={() => handleCopy(result, 'curr')}
              className="p-2 text-slate-400 hover:text-cyan-500 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
              title="Copy result"
            >
              {copiedKey === 'curr' ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-500" /> Expression History ({history.length})
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear History
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {history.map(item => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.expr}</span>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white shrink-0">
                  <span>= {item.result}</span>
                  <button
                    onClick={() => handleCopy(item.result, item.id)}
                    className="p-1 text-slate-400 hover:text-cyan-500 rounded transition-colors"
                  >
                    {copiedKey === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
