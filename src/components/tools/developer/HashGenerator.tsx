import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { md5 } from '../../../utils/md5';
import { Copy, Trash2 } from 'lucide-react';

export const HashGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState('LifeTools');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    const computeHashes = async () => {
      if (!inputText) {
        setHashes({});
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);

      const bufferToHex = (buffer: ArrayBuffer): string => {
        return Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      };

      try {
        const [sha1Buf, sha256Buf, sha384Buf, sha512Buf] = await Promise.all([
          crypto.subtle.digest('SHA-1', data),
          crypto.subtle.digest('SHA-256', data),
          crypto.subtle.digest('SHA-384', data),
          crypto.subtle.digest('SHA-512', data),
        ]);

        setHashes({
          'MD5 (128-bit)': md5(inputText),
          'SHA-1 (160-bit)': bufferToHex(sha1Buf),
          'SHA-256 (256-bit)': bufferToHex(sha256Buf),
          'SHA-384 (384-bit)': bufferToHex(sha384Buf),
          'SHA-512 (512-bit)': bufferToHex(sha512Buf),
        });
      } catch {
        // Fallback for environments where crypto.subtle is restricted
        setHashes({
          'MD5 (128-bit)': md5(inputText),
        });
      }
    };

    computeHashes();
  }, [inputText]);

  const handleCopy = (hash: string, label: string) => {
    copyToClipboard(hash);
    showToast(`${label} copied!`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Input Text to Hash
          </label>
          <button
            onClick={() => setInputText('')}
            className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="input-base text-sm font-mono"
          placeholder="Enter text to hash..."
        />
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
          Calculated Cryptographic Hashes
        </h3>
        <div className="space-y-3">
          {Object.entries(hashes).map(([algorithm, hashVal]) => (
            <div
              key={algorithm}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-bold text-slate-800 dark:text-slate-200">{algorithm}</span>
                <button
                  onClick={() => handleCopy(hashVal, algorithm)}
                  className="text-slate-400 hover:text-emerald-500 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-mono text-xs text-emerald-600 dark:text-emerald-400 break-all select-all">
                {hashVal}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
