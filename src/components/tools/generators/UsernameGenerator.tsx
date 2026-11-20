import React, { useState, useEffect } from 'react';
import { RefreshCw, Copy, Check, Sparkles, User, Shuffle, Download, CheckCircle2 } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';

const ADJECTIVES = {
  gamer: ['Apex', 'Shadow', 'Ghost', 'Viper', 'Frost', 'Hyper', 'Neon', 'Phantom', 'Storm', 'Thunder', 'Rogue', 'Iron', 'Pixel', 'Savage', 'Cyber', 'Titan'],
  tech: ['Quantum', 'Binary', 'Byte', 'Kernel', 'Vector', 'Matrix', 'Async', 'Synapse', 'Pixel', 'Dev', 'Logic', 'Code', 'Cloud', 'Data', 'Cyber', 'Algo'],
  aesthetic: ['Lunar', 'Velvet', 'Solar', 'Cosmic', 'Aura', 'Mystic', 'Echo', 'Serene', 'Ether', 'Astral', 'Zen', 'Nova', 'Mirage', 'Crystal', 'Opal', 'Ember'],
  quirky: ['Wobbly', 'Fluffy', 'Crispy', 'Sleepy', 'Mighty', 'Bubbly', 'Silly', 'Chilly', 'Funky', 'Zesty', 'Speedy', 'Lucky', 'Goofy', 'Jolly', 'Dizzy'],
  professional: ['Prime', 'Global', 'Elite', 'Omni', 'Direct', 'Vanguard', 'Apex', 'Core', 'Next', 'True', 'Master', 'Focus', 'Summit', 'Vision']
};

const NOUNS = {
  gamer: ['Slayer', 'Ninja', 'Knight', 'Sniper', 'Falcon', 'Reaper', 'Hunter', 'Striker', 'Titan', 'Warrior', 'Wolf', 'Dragon', 'Blaze', 'Ace', 'Legend'],
  tech: ['Stack', 'Coder', 'Hacker', 'Node', 'Pioneer', 'Script', 'Terminal', 'Dev', 'Bit', 'Engine', 'Geek', 'Craft', 'Bot', 'Cipher', 'Flux'],
  aesthetic: ['Dream', 'Breeze', 'Petal', 'Bloom', 'Wave', 'Haven', 'Meadow', 'Horizon', 'Cascade', 'Sky', 'Glow', 'Song', 'Wander', 'Mist', 'Muse'],
  quirky: ['Panda', 'Potato', 'Waffle', 'Penguin', 'Koala', 'Otter', 'Noodle', 'Muffin', 'Duck', 'Pickle', 'Bunny', 'Toast', 'Badger', 'Sloth'],
  professional: ['Consult', 'Studio', 'Systems', 'Lab', 'Ventures', 'Craft', 'Solutions', 'Media', 'Works', 'Group', 'Design', 'Hub', 'Guild']
};

export const UsernameGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [style, setStyle] = useState<'all' | 'gamer' | 'tech' | 'aesthetic' | 'quirky' | 'professional'>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [casing, setCasing] = useState<'PascalCase' | 'lowercase' | 'UPPERCASE' | 'camelCase'>('PascalCase');
  const [separator, setSeparator] = useState<'' | '_' | '.' | '-'>('');
  const [appendNumber, setAppendNumber] = useState<'none' | '2digits' | '3digits' | 'year'>('2digits');
  const [count, setCount] = useState<number>(18);
  const [usernames, setUsernames] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const formatUsername = (part1: string, part2: string, sep: string, caseStyle: string, numOption: string): string => {
    let base = '';
    if (caseStyle === 'lowercase') {
      base = `${part1.toLowerCase()}${sep}${part2.toLowerCase()}`;
    } else if (caseStyle === 'UPPERCASE') {
      base = `${part1.toUpperCase()}${sep}${part2.toUpperCase()}`;
    } else if (caseStyle === 'camelCase') {
      base = `${part1.toLowerCase()}${sep}${part2.charAt(0).toUpperCase() + part2.slice(1).toLowerCase()}`;
    } else {
      // PascalCase
      base = `${part1.charAt(0).toUpperCase() + part1.slice(1).toLowerCase()}${sep}${part2.charAt(0).toUpperCase() + part2.slice(1).toLowerCase()}`;
    }

    if (numOption === '2digits') {
      base += Math.floor(10 + Math.random() * 90).toString();
    } else if (numOption === '3digits') {
      base += Math.floor(100 + Math.random() * 900).toString();
    } else if (numOption === 'year') {
      base += (2020 + Math.floor(Math.random() * 7)).toString();
    }

    return base;
  };

  const generate = () => {
    const categories: ('gamer' | 'tech' | 'aesthetic' | 'quirky' | 'professional')[] = 
      style === 'all' 
        ? ['gamer', 'tech', 'aesthetic', 'quirky', 'professional']
        : [style];

    const results = new Set<string>();
    let attempts = 0;

    while (results.size < count && attempts < 200) {
      attempts++;
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const adjs = ADJECTIVES[cat];
      const nouns = NOUNS[cat];

      const adj = adjs[Math.floor(Math.random() * adjs.length)];
      const noun = nouns[Math.floor(Math.random() * nouns.length)];

      let part1 = adj;
      let part2 = noun;

      if (keyword.trim()) {
        const cleanKey = keyword.trim().replace(/[^a-zA-Z0-9]/g, '');
        if (Math.random() > 0.5) {
          part1 = cleanKey;
        } else {
          part2 = cleanKey;
        }
      }

      const formatted = formatUsername(part1, part2, separator, casing, appendNumber);
      results.add(formatted);
    }

    setUsernames(Array.from(results));
  };

  useEffect(() => {
    generate();
  }, [style, casing, separator, appendNumber, count]);

  const handleCopy = async (name: string) => {
    const ok = await copyToClipboard(name);
    if (ok) {
      setCopiedName(name);
      showToast(`Copied @${name}!`, 'success');
      setTimeout(() => setCopiedName(null), 1500);
    }
  };

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(usernames.join('\n'));
    if (ok) showToast(`Copied all ${usernames.length} usernames!`, 'success');
  };

  const handleDownload = () => {
    downloadFile(usernames.join('\n'), 'usernames.txt', 'text/plain');
    showToast('Downloaded usernames.txt', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Theme / Persona</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            >
              <option value="all">Mix of All Themes</option>
              <option value="gamer">Gamer / Esports</option>
              <option value="tech">Tech / Developer</option>
              <option value="aesthetic">Aesthetic & Chill</option>
              <option value="quirky">Fun & Quirky</option>
              <option value="professional">Professional / Brand</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Optional Seed Keyword</label>
            <input
              type="text"
              placeholder="e.g. Alex, Swift, Coffee"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Number Suffix</label>
            <select
              value={appendNumber}
              onChange={(e) => setAppendNumber(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
            >
              <option value="none">None (Letters only)</option>
              <option value="2digits">Random 2-digit (e.g. 42)</option>
              <option value="3digits">Random 3-digit (e.g. 709)</option>
              <option value="year">Current/Recent Year (e.g. 2026)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-slate-700/60">
          <div>
            <label className="block text-sm font-medium mb-2">Case Formatting</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['PascalCase', 'camelCase', 'lowercase', 'UPPERCASE'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCasing(c)}
                  className={`p-2 rounded-lg border font-mono transition-colors text-center ${
                    casing === c
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Separator Character</label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { label: 'None', val: '' },
                { label: 'Underscore _', val: '_' },
                { label: 'Period .', val: '.' },
                { label: 'Hyphen -', val: '-' }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSeparator(item.val as any)}
                  className={`p-2 rounded-lg border font-mono transition-colors text-center ${
                    separator === item.val
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={generate}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          <Shuffle className="w-4 h-4" /> Generate New Ideas
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy All
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export .txt
          </button>
        </div>
      </div>

      {/* Grid of Usernames */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {usernames.map((name, idx) => (
          <div
            key={idx}
            onClick={() => handleCopy(name)}
            className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-slate-400 dark:text-slate-600 text-xs font-mono">@{name}</span>
            </div>
            <span className="shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {copiedName === name ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
