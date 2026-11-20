import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, CheckCircle2, AlertCircle } from 'lucide-react';

export const RegexTester: React.FC = () => {
  const { showToast } = useToast();
  const [pattern, setPattern] = useState('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState(
    'Contact our team at support@lifetools.app or reach out to hello@example.com for inquiries.'
  );

  const testRegex = () => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];

      if (flags.includes('g')) {
        let m;
        while ((m = regex.exec(testString)) !== null) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1)
          });
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const m = regex.exec(testString);
        if (m) {
          matches.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1)
          });
        }
      }

      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  };

  const { matches, error } = testRegex();

  const toggleFlag = (flagChar: string) => {
    if (flags.includes(flagChar)) {
      setFlags(flags.replace(flagChar, ''));
    } else {
      setFlags(flags + flagChar);
    }
  };

  const handleCopyMatches = () => {
    const list = matches.map((m) => m.match).join('\n');
    copyToClipboard(list);
    showToast(`Copied ${matches.length} matches!`);
  };

  return (
    <div className="space-y-6">
      {/* Pattern & Flags Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
          Regular Expression Pattern
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono text-slate-400">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="input-base font-mono text-sm"
            placeholder="e.g. [a-z0-9]+"
          />
          <span className="text-xl font-mono text-slate-400">/</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {['g', 'i', 'm', 's', 'u'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                  flags.includes(f)
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Regex Compilation Error: {error}</span>
          </div>
        )}
      </div>

      {/* Test String */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
          Test String
        </label>
        <textarea
          rows={5}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="input-base text-sm font-mono leading-relaxed"
          placeholder="Paste or type text to match against..."
        />
      </div>

      {/* Match Results */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Matched Occurrences
            </h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              {matches.length}
            </span>
          </div>
          {matches.length > 0 && (
            <button onClick={handleCopyMatches} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy Matches
            </button>
          )}
        </div>

        {matches.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4 text-center">
            No matches found for the given pattern and test string.
          </p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1.5 font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">Match #{idx + 1} (Index: {m.index})</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    {m.match}
                  </span>
                </div>
                {m.groups.length > 0 && (
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-wrap gap-2">
                    {m.groups.map((g, gIdx) => (
                      <span key={gIdx} className="bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        Group {gIdx + 1}: <strong className="text-slate-800 dark:text-slate-200">{g}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
