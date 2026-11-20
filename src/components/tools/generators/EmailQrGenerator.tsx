import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const EmailQrGenerator: React.FC = () => {
  const [email, setEmail] = useState('support@lifetools.app');
  const [subject, setSubject] = useState('Feedback & Inquiry');
  const [body, setBody] = useState('Hello LifeTools team,\n\nI love your platform!');

  const mailtoUri = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Recipient Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Pre-Filled Message Body
          </label>
          <textarea
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input-base text-sm"
          />
        </div>
      </div>

      <QrDisplayCard qrData={mailtoUri} defaultFilename="email_qr" title="Scan to Send Pre-filled Email" />
    </div>
  );
};
