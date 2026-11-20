import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const SmsQrGenerator: React.FC = () => {
  const [phone, setPhone] = useState('+1 555-0199');
  const [message, setMessage] = useState('Hello! Inquiring about your services.');

  const smsUri = `smsto:${phone.replace(/\s+/g, '')}:${message}`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Recipient Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-base text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Pre-Filled SMS Message
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input-base text-sm"
          />
        </div>
      </div>

      <QrDisplayCard qrData={smsUri} defaultFilename="sms_qr" title="Scan to Send SMS Message" />
    </div>
  );
};
