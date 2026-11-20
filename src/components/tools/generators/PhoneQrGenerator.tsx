import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const PhoneQrGenerator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+1 555-0199');

  const telUri = `tel:${phoneNumber.replace(/\s+/g, '')}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
          Phone Number (with Country Code)
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input-base text-base font-medium font-mono"
          placeholder="+1 555-0199"
        />
      </div>

      <QrDisplayCard qrData={telUri} defaultFilename="phone_qr" title="Scan to Dial Directly" />
    </div>
  );
};
