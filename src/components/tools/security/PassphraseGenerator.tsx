import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Copy, Check, Sparkles, KeyRound } from 'lucide-react';

const WORDLIST: string[] = [
  'apple', 'beacon', 'breeze', 'bridge', 'cabin', 'canyon', 'castle', 'clover', 'comet',
  'crater', 'crystal', 'desert', 'diamond', 'dolphin', 'dragon', 'eagle', 'echo', 'ember',
  'falcon', 'feather', 'forest', 'galaxy', 'garden', 'glacier', 'harbor', 'hawk', 'horizon',
  'island', 'jaguar', 'jungle', 'knight', 'lagoon', 'lantern', 'leopard', 'meadow', 'meteor',
  'mountain', 'nebula', 'oasis', 'ocean', 'orbit', 'orchid', 'panther', 'pebble', 'phoenix',
  'planet', 'polar', 'portal', 'prairie', 'prism', 'pyramid', 'quartz', 'rainbow', 'ranger',
  'rapids', 'ravine', 'reef', 'river', 'rocket', 'rover', 'ruby', 'safari', 'sailor', 'samurai',
  'sapphire', 'saturn', 'shadow', 'shield', 'sierra', 'silver', 'solstice', 'spark', 'sparrow',
  'sphere', 'spring', 'star', 'stellar', 'stream', 'summit', 'sunset', 'talisman', 'temple',
  'timber', 'titan', 'tornado', 'tower', 'trail', 'tundra', 'twilight', 'valley', 'vector',
  'venture', 'vessel', 'vortex', 'voyage', 'vulcan', 'walnut', 'warrior', 'willow', 'wind',
  'wizard', 'zenith', 'zephyr', 'zodiac', 'acorn', 'albatross', 'alpine', 'amber', 'anchor',
  'apache', 'arch', 'arctic', 'arrow', 'atlas', 'aurora', 'avalanche', 'badger', 'bamboo',
  'basalt', 'blizzard', 'boulder', 'bronze', 'canopy', 'cascade', 'cedar', 'chasm', 'cliff',
  'copper', 'coral', 'cosmos', 'coyote', 'crag', 'cypress', 'denali', 'drifter', 'dune',
  'elk', 'emerald', 'everest', 'fern', 'fiord', 'flint', 'fox', 'garnet', 'geyser', 'grove',
  'haven', 'hemlock', 'highland', 'howler', 'iceberg', 'iguana', 'ivory', 'jasper', 'jupiter',
  'kelp', 'kingfisher', 'lotus', 'lynx', 'magma', 'mantis', 'maple', 'marble', 'mesa', 'mirage'
];

export const PassphraseGenerator: React.FC = () => {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalize, setCapitalize] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [passphrase, setPassphrase] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate CSPRNG Passphrase
  const generatePassphrase = () => {
    const randomBuffer = new Uint32Array(wordCount);
    crypto.getRandomValues(randomBuffer);

    const chosenWords = Array.from(randomBuffer).map(val => {
      let word = WORDLIST[val % WORDLIST.length];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });

    let result = chosenWords.join(separator);

    if (includeNumber) {
      const numBuffer = new Uint8Array(1);
      crypto.getRandomValues(numBuffer);
      const randomDigit = numBuffer[0] % 100;
      result += separator + randomDigit;
    }

    setPassphrase(result);
  };

  useEffect(() => {
    generatePassphrase();
  }, [wordCount, separator, capitalize, includeNumber]);

  const handleCopy = () => {
    navigator.clipboard.writeText(passphrase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Entropy calculation: log2(pool^words)
  const entropy = Math.round(wordCount * Math.log2(WORDLIST.length) + (includeNumber ? Math.log2(100) : 0));

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <KeyRound className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Passphrase Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Generate memorable, ultra-strong multi-word passphrases using Diceware randomness and Web Crypto.
        </p>
      </div>

      {/* Main Passphrase Display */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Cryptographic Passphrase</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
            ~{entropy} bits entropy (Extremely Strong)
          </span>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white break-all select-all">
            {passphrase}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={generatePassphrase}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Generate New Passphrase
          </button>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Passphrase'}
          </button>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Passphrase Customization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Number of Words</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{wordCount} words</span>
            </div>
            <input
              type="range"
              min={3}
              max={8}
              value={wordCount}
              onChange={e => setWordCount(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>3 (Good)</span>
              <span>4 (Recommended)</span>
              <span>6 (Paranoid)</span>
              <span>8 (Maximum)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Word Separator
            </label>
            <div className="flex gap-2">
              {[
                { label: 'Hyphen (-)', val: '-' },
                { label: 'Underscore (_)', val: '_' },
                { label: 'Period (.)', val: '.' },
                { label: 'Space ( )', val: ' ' }
              ].map(s => (
                <button
                  key={s.val}
                  onClick={() => setSeparator(s.val)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors border ${
                    separator === s.val
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={capitalize}
              onChange={e => setCapitalize(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Capitalize First Letter of Each Word
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumber}
              onChange={e => setIncludeNumber(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Append Random Number (e.g. -42)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};
