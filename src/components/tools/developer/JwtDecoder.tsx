import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export const JwtDecoder: React.FC = () => {
  const { showToast } = useToast();
  // Example dummy JWT
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImFkbWluIjp0cnVlfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );

  const base64UrlDecode = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(escape(atob(base64)));
  };

  const decodeJwt = () => {
    if (!token.trim()) return null;
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format: A valid JWT must consist of three dot-separated parts (Header.Payload.Signature).' };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);

      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      let expDate: Date | null = null;
      let isExpired = false;
      if (payloadObj.exp) {
        expDate = new Date(payloadObj.exp * 1000);
        isExpired = expDate < new Date();
      }

      let iatDate: Date | null = null;
      if (payloadObj.iat) {
        iatDate = new Date(payloadObj.iat * 1000);
      }

      return {
        header: JSON.stringify(headerObj, null, 2),
        payload: JSON.stringify(payloadObj, null, 2),
        signature: parts[2],
        expDate,
        isExpired,
        iatDate,
        error: null
      };
    } catch (err: any) {
      return { error: `Failed to decode JWT base64/JSON: ${err.message}` };
    }
  };

  const res = decodeJwt();

  const handleCopy = (str: string, label: string) => {
    copyToClipboard(str);
    showToast(`${label} copied!`);
  };

  return (
    <div className="space-y-6">
      {/* Important Security Notice */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Signature Verification Notice:</span>
          <span>
            This tool parses and displays client-side claims encoded inside the JSON Web Token. Decoding a JWT does <strong>NOT</strong> verify its cryptographic signature. Never trust unverified tokens for authorization without validating the signature using your backend secret or public key.
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
          Encoded JWT String
        </label>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="input-base text-xs font-mono break-all leading-relaxed"
          placeholder="Paste JWT (eyJhbG...)"
        />
      </div>

      {res?.error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 font-mono">
          {res.error}
        </div>
      )}

      {res && !res.error && (
        <div className="space-y-6">
          {/* Token Lifespan Badge */}
          <div className="flex flex-wrap gap-4 text-xs font-medium p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {res.iatDate && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Issued At: <strong>{res.iatDate.toLocaleString()}</strong></span>
              </div>
            )}
            {res.expDate && (
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    res.isExpired
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}
                >
                  {res.isExpired ? 'Expired' : 'Active / Valid Time'}
                </span>
                <span>Expires: <strong>{res.expDate.toLocaleString()}</strong></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">
                <span>Header (Algorithm & Token Type)</span>
                <button onClick={() => handleCopy(res.header || '', 'Header')} className="text-slate-400 hover:text-white flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
              <textarea
                rows={7}
                readOnly
                value={res.header}
                className="input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-rose-600 dark:text-rose-400"
              />
            </div>

            {/* Payload */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
                <span>Payload (Claims & Data)</span>
                <button onClick={() => handleCopy(res.payload || '', 'Payload')} className="text-slate-400 hover:text-white flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
              <textarea
                rows={7}
                readOnly
                value={res.payload}
                className="input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase">
              Signature
            </span>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-xs break-all text-sky-600 dark:text-sky-400">
              {res.signature}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
