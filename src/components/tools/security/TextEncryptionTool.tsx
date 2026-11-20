import React, { useState } from 'react';
import { Lock, Key, Copy, Check, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const TextEncryptionTool: React.FC = () => {
  const [plainText, setPlainText] = useState('Confidential message: The server deployment key is X99-Secure.');
  const [passphrase, setPassphrase] = useState('');
  const [cipherOutput, setCipherOutput] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Web Crypto AES-GCM 256-bit encryption
  const handleEncrypt = async () => {
    if (!plainText.trim() || !passphrase) {
      setError('Please provide both the text to encrypt and a secret password.');
      return;
    }

    try {
      setError(null);
      setIsEncrypting(true);

      const enc = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Import password key
      const passKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );

      // Derive AES-GCM key with PBKDF2 (100k iterations)
      const aesKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        passKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );

      // Encrypt
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        enc.encode(plainText)
      );

      // Combine salt (16) + iv (12) + ciphertext
      const encryptedBytes = new Uint8Array(encryptedBuffer);
      const combined = new Uint8Array(salt.length + iv.length + encryptedBytes.length);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(encryptedBytes, salt.length + iv.length);

      // Encode as Base64
      let binary = '';
      for (let i = 0; i < combined.length; i++) {
        binary += String.fromCharCode(combined[i]);
      }
      const base64Cipher = btoa(binary);

      setCipherOutput(base64Cipher);
    } catch (err: any) {
      setError(err?.message || 'Encryption failed. Please check your browser Web Crypto support.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCopy = () => {
    if (!cipherOutput) return;
    navigator.clipboard.writeText(cipherOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Text Encryption Tool (AES-GCM 256)
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Encrypt confidential notes and messages client-side using military-grade AES-256-GCM and PBKDF2.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Plain Text to Encrypt
          </label>
          <textarea
            rows={4}
            value={plainText}
            onChange={e => setPlainText(e.target.value)}
            placeholder="Type secret notes, passwords, or sensitive credentials..."
            className="w-full px-4 py-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Secret Encryption Password / Passphrase *
          </label>
          <div className="relative">
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              placeholder="Enter a strong password known only to you and your recipient..."
              className="w-full px-4 py-3 pl-11 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white font-mono"
            />
            <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleEncrypt}
          disabled={isEncrypting}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          {isEncrypting ? 'Encrypting with AES-256...' : 'Encrypt Text Locally'}
        </button>

        {cipherOutput && (
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Encrypted Output (Salt + IV + AES-GCM Ciphertext)</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Ciphertext!' : 'Copy Ciphertext'}
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={cipherOutput}
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-700 dark:text-emerald-300 resize-none select-all"
            />
          </div>
        )}
      </div>

      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <strong>Zero Server Knowledge:</strong> Encryption runs entirely inside your browser's Web Crypto engine using PBKDF2 (100,000 SHA-256 rounds) and 256-bit AES-GCM with a unique 96-bit IV per encryption. No keys or plaintexts ever leave your device.
        </div>
      </div>
    </div>
  );
};
