import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const VcardQrGenerator: React.FC = () => {
  const [fullName, setFullName] = useState('Jordan Lee');
  const [org, setOrg] = useState('LifeTools Global');
  const [title, setTitle] = useState('Chief Architect');
  const [phone, setPhone] = useState('+1 555-0144');
  const [email, setEmail] = useState('jordan@lifetools.app');
  const [website, setWebsite] = useState('https://lifetools.app');
  const [street, setStreet] = useState('100 Market St');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('USA');
  const [note, setNote] = useState('Met at Tech Expo 2026');

  const vCardPayload = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
ORG:${org}
TITLE:${title}
TEL;TYPE=WORK,VOICE:${phone}
EMAIL;TYPE=PREF,INTERNET:${email}
URL:${website}
ADR;TYPE=WORK:;;${street};${city};;${country}
NOTE:${note}
END:VCARD`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Organization
          </label>
          <input
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Phone
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
            Email
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
            Website URL
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            City & Country
          </label>
          <input
            type="text"
            value={`${city}, ${country}`}
            onChange={(e) => {
              const parts = e.target.value.split(',');
              setCity(parts[0]?.trim() || '');
              setCountry(parts[1]?.trim() || '');
            }}
            className="input-base text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Notes / Memo
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-base text-sm"
          />
        </div>
      </div>

      <QrDisplayCard qrData={vCardPayload} defaultFilename="vcard_business" title="Scan to Save Complete Business vCard" />
    </div>
  );
};
