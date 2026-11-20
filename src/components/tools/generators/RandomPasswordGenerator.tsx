import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Download, ShieldCheck, Key, ListOrdered, Shuffle } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';

const WORD_LIST = [
  'amber', 'anchor', 'apple', 'arctic', 'arrow', 'aspect', 'atlas', 'autumn', 'bamboo', 'beacon',
  'breeze', 'bridge', 'bubble', 'canvas', 'canyon', 'castle', 'cedar', 'cliff', 'cloud', 'clover',
  'cobalt', 'comet', 'coral', 'cosmos', 'crater', 'crystal', 'delta', 'desert', 'diamond', 'dolphin',
  'dragon', 'eagle', 'echo', 'ember', 'falcon', 'feather', 'forest', 'fossil', 'galaxy', 'garden',
  'glacier', 'granite', 'harbor', 'hawk', 'horizon', 'island', 'jasper', 'jungle', 'lagoon', 'lantern',
  'lotus', 'lunar', 'meadow', 'meteor', 'mirage', 'monarch', 'mountain', 'nebula', 'oasis', 'ocean',
  'olive', 'opal', 'orbit', 'orchid', 'peak', 'pearl', 'pebble', 'phoenix', 'pinnacle', 'planet',
  'prism', 'quartz', 'quiver', 'radar', 'rainbow', 'raven', 'reef', 'river', 'rocket', 'sable',
  'safari', 'sahara', 'sapphire', 'shadow', 'silver', 'solar', 'spark', 'summit', 'tiger', 'timber',
  'topaz', 'valley', 'vector', 'velvet', 'vortex', 'voyage', 'walnut', 'willow', 'zenith', 'zephyr'
];

export const RandomPasswordGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');

  // Random mode state
  const [length, setLength] = useState<number>(16);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(true);
  const [count, setCount] = useState<number>(5);

  // Passphrase mode state
  const [wordCount, setWordCount] = useState<number>(4);
  const [separator, setSeparator] = useState<string>('-');
  const [capitalizeWords, setCapitalizeWords] = useState<boolean>(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState<boolean>(true);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const list: string[] = [];

    if (mode === 'random') {
      let chars = '';
      if (useUpper) chars += avoidAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useLower) chars += avoidAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
      if (useNumbers) chars += avoidAmbiguous ? '23456789' : '0123456789';
      if (useSymbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';

      if (!chars) {
        showToast('Please select at least one character set.', 'error');
        return;
      }

      for (let i = 0; i < count; i++) {
        let pass = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        for (let j = 0; j < length; j++) {
          pass += chars[array[j] % chars.length];
        }
        list.push(pass);
      }
    } else {
      // Passphrase
      for (let i = 0; i < count; i++) {
        const words: string[] = [];
        const array = new Uint32Array(wordCount + 1);
        crypto.getRandomValues(array);

        for (let j = 0; j < wordCount; j++) {
          let word = WORD_LIST[array[j] % WORD_LIST.length];
          if (capitalizeWords) {
            word = word.charAt(0).toUpperCase() + word.slice(1);
          }
          words.push(word);
        }

        if (includeNumberInPassphrase) {
          const num = (array[wordCount] % 900) + 100; // 3 digits
          words.push(num.toString());
        }

        list.push(words.join(separator));
      }
    }

    setPasswords(list);
  };

  useEffect(() => {
    generate();
  }, [mode, length, useUpper, useLower, useNumbers, useSymbols, avoidAmbiguous, count, wordCount, separator, capitalizeWords, includeNumberInPassphrase]);

  const handleCopy = async (text: string, index: number) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIndex(index);
      showToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(passwords.join('\n'));
    if (ok) showToast(`Copied all ${passwords.length} passwords!`, 'success');
  };

  const handleDownload = () => {
    downloadFile(passwords.join('\n'), 'passwords.txt', 'text/plain');
    showToast('Downloaded passwords.txt', 'success');
  };

  const primaryPassword = passwords[0] || '';

  return (
    <div className="space-y-6">
      {/* Primary Display */}
      {primaryPassword && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm border border-slate-800">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center justify-between">
            <span>Primary Generated Password</span>
            <span className="flex items-center gap-1 text-emerald-400 text-xs normal-case">
              <ShieldCheck className="w-4 h-4" /> Cryptographically Secure
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono text-xl sm:text-2xl break-all bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-indigo-300 font-bold">{primaryPassword}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleCopy(primaryPassword, 0)}
                className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                title="Copy password"
              >
                {copiedIndex === 0 ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                onClick={generate}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title="Regenerate"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selector */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setMode('random')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            mode === 'random'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Key className="w-4 h-4" /> Random Characters
        </button>
        <button
          onClick={() => setMode('passphrase')}
          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            mode === 'passphrase'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Shuffle className="w-4 h-4" /> Memorable Passphrase
        </button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        {mode === 'random' ? (
          <>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Password Length:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{length}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Quantity to Generate:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{count}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Character Options</span>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Uppercase Letters (A-Z)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Lowercase Letters (a-z)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Special Symbols (!@#$%^&*)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer pt-1 text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={avoidAmbiguous}
                  onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Exclude Ambiguous Characters (l, 1, I, O, 0)
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Number of Words:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{wordCount}</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Word Separator</label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="-">Hyphen (-)</option>
                  <option value="_">Underscore (_)</option>
                  <option value=".">Period (.)</option>
                  <option value=" ">Space ( )</option>
                  <option value="">No Separator</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Passphrase Options</span>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={capitalizeWords}
                  onChange={(e) => setCapitalizeWords(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Capitalize Each Word (TitleCase)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNumberInPassphrase}
                  onChange={(e) => setIncludeNumberInPassphrase(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                Append Random Number (e.g. 742)
              </label>
              <div className="pt-2">
                <div className="flex justify-between text-sm font-medium mb-1">
                  <span>Batch Quantity:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{count}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Batch List */}
      {passwords.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-indigo-600" /> All Generated Passwords ({passwords.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy All
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Download (.txt)
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            {passwords.map((pw, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className="font-mono text-sm select-all">{pw}</span>
                <button
                  onClick={() => handleCopy(pw, idx)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  title="Copy"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
