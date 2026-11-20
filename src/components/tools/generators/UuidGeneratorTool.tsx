import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, RefreshCw, Hash, FileJson, FileText, CheckCircle2 } from 'lucide-react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';

export const UuidGeneratorTool: React.FC = () => {
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState<number>(10);
  const [version, setVersion] = useState<'v4' | 'v1-like' | 'nil'>('v4');
  const [casing, setCasing] = useState<'lower' | 'upper'>('lower');
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [braces, setBraces] = useState<boolean>(false);
  const [quotes, setQuotes] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<string>('');

  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const generateUuidV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const generateUuidV1Like = (): string => {
    const now = Date.now();
    const hexTime = now.toString(16).padStart(12, '0');
    const timeLow = hexTime.slice(-8);
    const timeMid = hexTime.slice(-12, -8) || '0000';
    const timeHi = '1' + Math.floor(Math.random() * 0xfff).toString(16).padStart(3, '0');
    const clockSeq = ((crypto.getRandomValues(new Uint8Array(1))[0] & 0x3f) | 0x80).toString(16) +
                     crypto.getRandomValues(new Uint8Array(1))[0].toString(16).padStart(2, '0');
    const node = Array.from(crypto.getRandomValues(new Uint8Array(6)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    return `${timeLow}-${timeMid}-${timeHi}-${clockSeq.slice(0, 4)}-${node}`;
  };

  const generateList = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let u = '';
      if (version === 'nil') {
        u = '00000000-0000-0000-0000-000000000000';
      } else if (version === 'v1-like') {
        u = generateUuidV1Like();
      } else {
        u = generateUuidV4();
      }

      if (!hyphens) {
        u = u.replace(/-/g, '');
      }
      if (casing === 'upper') {
        u = u.toUpperCase();
      }
      if (prefix.trim()) {
        u = prefix.trim() + u;
      }
      if (braces) {
        u = `{${u}}`;
      }
      if (quotes) {
        u = `"${u}"`;
      }
      list.push(u);
    }
    setUuids(list);
  };

  useEffect(() => {
    generateList();
  }, [quantity, version, casing, hyphens, braces, quotes, prefix]);

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(uuids.join('\n'));
    if (ok) {
      setCopied(true);
      showToast(`Copied ${uuids.length} UUIDs to clipboard!`, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    downloadFile(uuids.join('\n'), 'uuids.txt', 'text/plain');
    showToast('Downloaded uuids.txt', 'success');
  };

  const handleDownloadJson = () => {
    downloadFile(JSON.stringify(uuids, null, 2), 'uuids.json', 'application/json');
    showToast('Downloaded uuids.json', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Version</label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            >
              <option value="v4">Version 4 (Cryptographically Random)</option>
              <option value="v1-like">Version 1 (Time-based Simulation)</option>
              <option value="nil">Nil UUID (All Zeros)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Quantity ({quantity})</label>
            <input
              type="range"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full accent-indigo-600 mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Optional Prefix</label>
            <input
              type="text"
              placeholder="e.g. user_ or id_"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded text-indigo-600"
            />
            Include Hyphens (e.g. 4-2-2-2-6)
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={casing === 'upper'}
              onChange={(e) => setCasing(e.target.checked ? 'upper' : 'lower')}
              className="rounded text-indigo-600"
            />
            Uppercase Characters
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={braces}
              onChange={(e) => setBraces(e.target.checked)}
              className="rounded text-indigo-600"
            />
            Wrap in Braces {'{...}'}
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={quotes}
              onChange={(e) => setQuotes(e.target.checked)}
              className="rounded text-indigo-600"
            />
            Wrap in Double Quotes "..."
          </label>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={generateList}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate
          </button>
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-medium text-sm transition-colors"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            Copy All
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <FileText className="w-4 h-4" /> Export .txt
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            <FileJson className="w-4 h-4" /> Export .json
          </button>
        </div>
      </div>

      {/* Output Display */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-900 text-slate-100 shadow-sm">
        <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
          <span>{uuids.length} Generated UUIDs</span>
          <span>Click any line to copy</span>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-800 font-mono text-sm">
          {uuids.map((id, index) => (
            <div
              key={index}
              onClick={() => {
                copyToClipboard(id);
                showToast(`Copied: ${id}`, 'success');
              }}
              className="p-3 hover:bg-slate-800/60 cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-6 text-right">{index + 1}</span>
                <span className="text-indigo-300 group-hover:text-indigo-200">{id}</span>
              </div>
              <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" /> copy
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
