import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const WhatsappQrGenerator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('15551234567');
  const [prefilledText, setPrefilledText] = useState('Hello! Chatting with you via LifeTools QR.');

  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prefilledText)}`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            WhatsApp Phone Number (with Country Code, no + or dashes)
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="15551234567"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Pre-Filled Greeting Message
          </label>
          <textarea
            rows={3}
            value={prefilledText}
            onChange={(e) => setPrefilledText(e.target.value)}
            className="input-base text-sm"
          />
        </div>
      </div>

      <QrDisplayCard qrData={waUrl} defaultFilename="whatsapp_qr" title="Scan to Open WhatsApp Chat" />
    </div>
  );
};
