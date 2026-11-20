import React, { useState } from 'react';
import { QrDisplayCard } from './QrDisplayCard';

export const LocationQrGenerator: React.FC = () => {
  const [latitude, setLatitude] = useState('37.7749');
  const [longitude, setLongitude] = useState('-122.4194');

  // geo:lat,lng or Google Maps link
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Latitude (-90 to +90)
          </label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="37.7749"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
            Longitude (-180 to +180)
          </label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="-122.4194"
          />
        </div>
      </div>

      <QrDisplayCard qrData={mapsUrl} defaultFilename="location_qr" title="Scan to Open in Maps" />
    </div>
  );
};
