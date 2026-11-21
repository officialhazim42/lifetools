import React, { useState } from 'react';
import { ShieldCheck, Upload, AlertTriangle, Copy, Check, QrCode, Wifi, CreditCard, Phone, Mail, FileText } from 'lucide-react';
import jsQR from 'jsqr';

export const QrCodeContentInspector: React.FC = () => {
  const [payload, setPayload] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  // Analyze payload
  const analyzePayload = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    let type = 'Plain Text';
    let severity: 'safe' | 'warning' | 'danger' = 'safe';
    let details: Record<string, string> = {};
    let advisory = 'Standard plaintext payload. Harmless to view.';

    if (/^https?:\/\//i.test(trimmed)) {
      type = 'Web URL Link';
      advisory = 'Review the destination domain before opening in your browser.';
      try {
        const u = new URL(trimmed);
        details['Protocol'] = u.protocol;
        details['Hostname'] = u.hostname;
        details['Path'] = u.pathname;
        if (u.search) details['Query Params'] = u.search;
        if (u.protocol === 'http:') {
          severity = 'warning';
          advisory = 'Insecure HTTP connection without SSL encryption.';
        }
      } catch {
        // ignore
      }
    } else if (/^upi:\/\/pay\?/i.test(trimmed)) {
      type = 'UPI / Payment Request';
      severity = 'warning';
      advisory = 'CRITICAL: Scanning in payment apps can authorize fund transfers. Inspect payee details carefully.';
      const params = new URLSearchParams(trimmed.replace('upi://pay?', ''));
      details['Payee VPA (pa)'] = params.get('pa') || 'N/A';
      details['Payee Name (pn)'] = params.get('pn') || 'N/A';
      details['Requested Amount (am)'] = params.get('am') ? `₹${params.get('am')}` : 'Variable Amount';
      details['Note / Description'] = params.get('tn') || 'None';
    } else if (/^WIFI:/i.test(trimmed)) {
      type = 'Wi-Fi Network Credentials';
      advisory = 'Contains wireless network configuration and password.';
      const ssid = trimmed.match(/S:([^;]+)/)?.[1] || 'Unknown';
      const typeAuth = trimmed.match(/T:([^;]+)/)?.[1] || 'WPA';
      const pass = trimmed.match(/P:([^;]+)/)?.[1] || 'None';
      details['SSID (Network Name)'] = ssid;
      details['Security Type'] = typeAuth;
      details['Password'] = pass;
    } else if (/^tel:/i.test(trimmed)) {
      type = 'Telephone Dial Request';
      severity = 'warning';
      advisory = 'Triggers phone dialer automatically.';
      details['Phone Number'] = trimmed.replace(/^tel:/i, '');
    } else if (/^smsto:|^sms:/i.test(trimmed)) {
      type = 'SMS / Text Message';
      severity = 'warning';
      advisory = 'Pre-fills an SMS message. Be cautious of premium SMS scam numbers.';
      details['Recipient'] = trimmed.split(':')[1]?.split('?')[0] || '';
    } else if (/^BEGIN:VCARD/i.test(trimmed)) {
      type = 'vCard Contact Card';
      advisory = 'Address book contact card.';
      const fn = trimmed.match(/FN:(.+)/)?.[1] || 'N/A';
      details['Full Name'] = fn;
    } else if (/^(javascript:|data:|file:)/i.test(trimmed)) {
      type = 'Executable / URI Scheme';
      severity = 'danger';
      advisory = 'DANGER: Potentially malicious URI scheme capable of script execution or XSS attacks.';
    }

    return { type, severity, details, advisory };
  };

  const analysis = analyzePayload(payload);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecoding(true);
    const reader = new FileReader();
    reader.onload = evt => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsDecoding(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setPayload(code.data);
        } else {
          alert('No QR code could be detected in this image.');
        }
        setIsDecoding(false);
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <QrCode className="w-3.5 h-3.5" /> Privacy & Security Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          QR Code Content & Security Inspector
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Safely inspect raw decoded QR code contents, payments, Wi-Fi credentials, and links without risking auto-execution.
        </p>
      </div>

      {/* Upload or Paste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drop zone to decode QR image */}
        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors cursor-pointer relative flex flex-col items-center justify-center min-h-[160px]">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-emerald-500 mb-2" />
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {isDecoding ? 'Decoding QR image...' : 'Upload QR Image to Decode'}
          </p>
          <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WEBP screenshot</span>
        </div>

        {/* Preset Samples */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Test Preset Payloads
          </label>
          <div className="grid grid-cols-2 gap-2 my-2">
            {[
              { label: 'Wi-Fi Network', val: 'WIFI:T:WPA;S:Office_Guest;P:Password123;;' },
              { label: 'UPI Pay Request', val: 'upi://pay?pa=store@okaxis&pn=SuperStore&am=499&tn=Order_991' },
              { label: 'Website Link', val: 'https://lifetools.app' },
              { label: 'Phone Dial', val: 'tel:+18005550199' }
            ].map(p => (
              <button
                key={p.label}
                onClick={() => setPayload(p.val)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-300 text-left truncate transition-colors border border-slate-200 dark:border-slate-700"
              >
                {p.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">Decoded in isolated sandboxed memory</span>
        </div>
      </div>

      {/* Raw Payload Input Area */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Decoded QR Code Raw String
          </label>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Raw Text'}
          </button>
        </div>
        <textarea
          rows={3}
          value={payload}
          onChange={e => setPayload(e.target.value)}
          placeholder="Paste QR decoded text or URI..."
          className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Safety Analysis Card */}
      {analysis && (
        <div className="space-y-4">
          <div
            className={`p-6 rounded-2xl border text-center transition-all ${
              analysis.severity === 'safe'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
                : analysis.severity === 'warning'
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1">
              Detected Category: {analysis.type}
            </div>
            <h2 className="text-xl font-bold mt-1">
              {analysis.advisory}
            </h2>
          </div>

          {/* Details Table */}
          {Object.keys(analysis.details).length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Parsed Payload Attributes
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
                {Object.entries(analysis.details).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex items-center justify-between gap-4">
                    <span className="text-slate-500 font-sans">{key}:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-md select-all">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
