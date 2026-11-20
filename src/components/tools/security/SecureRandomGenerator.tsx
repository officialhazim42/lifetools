import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Copy, Check, Binary, Key, Sparkles } from 'lucide-react';

type TokenType = 'hex' | 'base64' | 'alphanumeric' | 'uuid';

export const SecureRandomGenerator: React.FC = () => {
  const [tokenType, setTokenType] = useState<TokenType>('hex');
  const [byteLength, setByteLength] = useState<number>(32);
  const [batchCount, setBatchCount] = useState<number>(5);
  const [tokens, setTokens] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateSingleToken = (type: TokenType, bytes: number): string => {
    if (type === 'uuid') {
      return crypto.randomUUID();
    }

    const buffer = new Uint8Array(bytes);
    crypto.getRandomValues(buffer);

    if (type === 'hex') {
      return Array.from(buffer)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    if (type === 'base64') {
      let binary = '';
      for (let i = 0; i < buffer.length; i++) {
        binary += String.fromCharCode(buffer[i]);
      }
      return btoa(binary);
    }

    if (type === 'alphanumeric') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let str = '';
      for (let i = 0; i < bytes; i++) {
        str += chars[buffer[i] % chars.length];
      }
      return str;
    }

    return '';
  };

  const generateAll = () => {
    const list: string[] = [];
    for (let i = 0; i < batchCount; i++) {
      list.push(generateSingleToken(tokenType, byteLength));
    }
    setTokens(list);
  };

  useEffect(() => {
    generateAll();
  }, [tokenType, byteLength, batchCount]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Secure Random Token & Key Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Generate high-entropy cryptographic salts, API secrets, session tokens, and keys using Web Crypto CSPRNG.
        </p>
      </div>

      {/* Type Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'hex', label: 'Hexadecimal' },
            { id: 'base64', label: 'Base64' },
            { id: 'alphanumeric', label: 'Alphanumeric' },
            { id: 'uuid', label: 'UUIDv4' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTokenType(t.id as TokenType)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tokenType === t.id
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Tokens Display */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Generated Tokens ({tokenType.toUpperCase()})</span>
          <button
            onClick={generateAll}
            className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Regenerate
          </button>
        </div>

        <div className="space-y-3">
          {tokens.map((tok, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 group hover:border-emerald-500/40 transition-colors"
            >
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                {tok}
              </span>
              <button
                onClick={() => handleCopy(tok, idx)}
                className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                title="Copy token"
              >
                {copiedIndex === idx ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          Token Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {tokenType !== 'uuid' && (
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Entropy / Byte Length</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {byteLength} bytes ({byteLength * 8} bits)
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={128}
                step={8}
                value={byteLength}
                onChange={e => setByteLength(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Batch Quantity
            </label>
            <select
              value={batchCount}
              onChange={e => setBatchCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value={1}>1 Token</option>
              <option value={5}>5 Tokens</option>
              <option value={10}>10 Tokens</option>
              <option value={20}>20 Tokens</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
