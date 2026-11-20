import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const WifiQrGenerator: React.FC = () => {
  const [ssid, setSsid] = useState('Home_Network');
  const [password, setPassword] = useState('SecretWiFi123');
  const [encryption, setEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [hidden, setHidden] = useState(false);

  // WIFI:S:SSID;T:WPA;P:PASSWORD;H:false;;
  const wifiPayload = `WIFI:T:${encryption};S:${ssid};P:${encryption === 'nopass' ? '' : password};H:${hidden ? 'true' : 'false'};;`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Network Name (SSID)
          </label>
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            className="input-base text-sm font-medium"
            placeholder="WiFi Network Name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Security / Encryption
          </label>
          <select
            value={encryption}
            onChange={(e) => setEncryption(e.target.value as any)}
            className="input-base text-sm"
          >
            <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open Network)</option>
          </select>
        </div>

        {encryption !== 'nopass' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              WiFi Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base text-sm font-mono"
              placeholder="WiFi Password"
            />
          </div>
        )}

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => setHidden(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Hidden SSID Network
          </label>
        </div>
      </div>

      <QrDisplayCard qrData={wifiPayload} defaultFilename="wifi_qr" title="Scan to Connect to Wi-Fi" />
    </div>
  );
};
