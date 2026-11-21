import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Compass,
  Navigation,
  MapPin,
  Route,
  ExternalLink,
  Copy,
  ArrowRight,
  RotateCw,
  LocateFixed,
  Download,
  Share2
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import {
  decimalToDms,
  dmsToDecimal,
  formatGpsCoordinates,
  calculateHaversineDistance,
  calculateBearing,
  bearingToCompassPoint,
  getCompassReciprocal,
  generateMapLinks,
  generateGoogleMapsRouteUrl,
  isValidCoordinate
} from '../../../utils/travel/navigationUtils';

// ==========================================
// 1. GPS COORDINATES FORMATTER
// ==========================================
export const GpsCoordinatesFormatter: React.FC = () => {
  const { showToast } = useToast();
  const [lat, setLat] = useState<number>(37.7749); // San Francisco
  const [lng, setLng] = useState<number>(-122.4194);

  const formatted = formatGpsCoordinates(lat, lng);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📍</span> GPS Coordinates Formatter
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Format latitude and longitude into all standard geographical conventions (DD, DMS, DDM, GeoURI).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Latitude (-90 to +90)
          </label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Longitude (-180 to +180)
          </label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {formatted ? (
        <div className="space-y-3">
          {/* Decimal Degrees */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Decimal Degrees (DD)</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatted.decimalDegrees.lat}, {formatted.decimalDegrees.lng}
              </p>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `${formatted.decimalDegrees.lat}, ${formatted.decimalDegrees.lng}`,
                  'Decimal Degrees'
                )
              }
              className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* DMS */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Degrees Minutes Seconds (DMS)</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatted.dms.combined}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(formatted.dms.combined, 'DMS coordinates')}
              className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* DDM */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Degrees Decimal Minutes (DDM - Marine)</span>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatted.ddm.latDdm}, {formatted.ddm.lngDdm}
              </p>
            </div>
            <button
              onClick={() =>
                copyToClipboard(`${formatted.ddm.latDdm}, ${formatted.ddm.lngDdm}`, 'DDM coordinates')
              }
              className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* GeoURI */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">RFC 5870 Geo URI (Mobile Native)</span>
              <p className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {formatted.geoUri}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(formatted.geoUri, 'Geo URI')}
              className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs rounded-xl">
          Invalid coordinates. Latitude must be between -90 and +90, and longitude between -180 and +180.
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. LATITUDE & LONGITUDE CONVERTER
// ==========================================
export const LatitudeLongitudeConverter: React.FC = () => {
  const { showToast } = useToast();
  const [decVal, setDecVal] = useState<number>(48.8566); // Paris lat
  const [isLat, setIsLat] = useState(true);

  const dms = decimalToDms(decVal, isLat);
  const reconverted = dmsToDecimal(dms.degrees, dms.minutes, dms.seconds, dms.direction);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🌐</span> Latitude & Longitude Converter
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bidirectional conversion between signed decimal and directional hemisphere notation.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setIsLat(true)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              isLat ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Latitude (-90° to +90°)
          </button>
          <button
            onClick={() => setIsLat(false)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
              !isLat ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            Longitude (-180° to +180°)
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Decimal Value
          </label>
          <input
            type="number"
            step="any"
            value={decVal}
            onChange={(e) => setDecVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-2">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
            Directional Hemisphere Result
          </span>
          <p className="text-lg font-mono font-bold text-indigo-900 dark:text-indigo-100">
            {dms.degrees}° {dms.minutes}' {dms.seconds}" {dms.direction}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hemisphere: {dms.direction === 'N' ? 'Northern' : dms.direction === 'S' ? 'Southern' : dms.direction === 'E' ? 'Eastern' : 'Western'} | Validated roundtrip: {reconverted}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. DECIMAL DEGREES TO DMS CONVERTER
// ==========================================
export const DecimalDegreesToDmsConverter: React.FC = () => {
  const [dec, setDec] = useState(51.5074); // London

  const abs = Math.abs(dec);
  const deg = Math.floor(abs);
  const minFull = (abs - deg) * 60;
  const min = Math.floor(minFull);
  const sec = Math.round((minFull - min) * 60 * 100) / 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📐</span> Decimal Degrees to DMS Converter
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Transform continuous decimal angles into Degrees (°), Minutes ('), and Seconds ('').
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Decimal Degree Angle
          </label>
          <input
            type="number"
            step="any"
            value={dec}
            onChange={(e) => setDec(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Degrees (D)</span>
            <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{deg}°</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Minutes (M)</span>
            <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{min}'</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Seconds (S)</span>
            <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">{sec}"</p>
          </div>
        </div>

        <div className="p-3 bg-slate-100 dark:bg-slate-700/40 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-mono">
          Formula: {deg}° + ({minFull.toFixed(4)} / 60) = {deg}° {min}' {sec}"
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. DMS TO DECIMAL DEGREES CONVERTER
// ==========================================
export const DmsToDecimalDegreesConverter: React.FC = () => {
  const [degrees, setDegrees] = useState(40);
  const [minutes, setMinutes] = useState(42);
  const [seconds, setSeconds] = useState(46.0);
  const [direction, setDirection] = useState<'N' | 'S' | 'E' | 'W'>('N');

  const decimal = dmsToDecimal(degrees, minutes, seconds, direction);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🔄</span> DMS to Decimal Degrees Converter
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compute floating-point coordinates from navigational Degrees, Minutes, and Seconds.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Degrees (°)</label>
            <input
              type="number"
              min="0"
              max="180"
              value={degrees}
              onChange={(e) => setDegrees(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Minutes (')</label>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Seconds ('')</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="59.99"
              value={seconds}
              onChange={(e) => setSeconds(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Direction</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 font-bold"
            >
              <option value="N">North (N)</option>
              <option value="S">South (S)</option>
              <option value="E">East (E)</option>
              <option value="W">West (W)</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-center">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
            Decimal Degrees Result
          </span>
          <p className="text-3xl font-mono font-bold text-emerald-900 dark:text-emerald-100 my-1">
            {decimal}°
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            DD = {degrees} + ({minutes}/60) + ({seconds}/3600) {direction === 'S' || direction === 'W' ? '× -1' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. COORDINATE DISTANCE CALCULATOR
// ==========================================
export const CoordinateDistanceCalculator: React.FC = () => {
  // NYC -> London
  const [lat1, setLat1] = useState(40.7128);
  const [lng1, setLng1] = useState(-74.006);
  const [lat2, setLat2] = useState(51.5074);
  const [lng2, setLng2] = useState(-0.1278);

  const res = calculateHaversineDistance(lat1, lng1, lat2, lng2) || {
    km: 0,
    miles: 0,
    nauticalMiles: 0,
    meters: 0,
    distanceKm: 0,
    distanceMiles: 0,
    distanceNauticalMiles: 0
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📏</span> Coordinate Distance Calculator
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compute accurate great-circle spherical distance across the Earth's curvature via Haversine formulation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Point 1 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" /> Point A (Origin)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat1}
                onChange={(e) => setLat1(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng1}
                onChange={(e) => setLng1(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Point 2 */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" /> Point B (Destination)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat2}
                onChange={(e) => setLat2(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng2}
                onChange={(e) => setLng2(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Kilometers</span>
          <p className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {res.km.toLocaleString()} km
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Miles</span>
          <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
            {res.miles.toLocaleString()} mi
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Nautical Miles</span>
          <p className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400 mt-1">
            {res.nauticalMiles.toLocaleString()} NM
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Meters</span>
          <p className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100 mt-1">
            {res.meters.toLocaleString()} m
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. BEARING CALCULATOR
// ==========================================
export const BearingCalculator: React.FC = () => {
  const [lat1, setLat1] = useState(34.0522); // LA
  const [lng1, setLng1] = useState(-118.2437);
  const [lat2, setLat2] = useState(36.1699); // Vegas
  const [lng2, setLng2] = useState(-115.1398);

  const initialBearing = calculateBearing(lat1, lng1, lat2, lng2);
  const compass = bearingToCompassPoint(initialBearing);
  const backBearing = getCompassReciprocal(initialBearing);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🧭</span> Bearing Calculator
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Compute the forward spherical azimuth (initial navigation heading) and back bearing between two points.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Start Location (A)</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={lat1}
              onChange={(e) => setLat1(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
            <input
              type="number"
              step="any"
              value={lng1}
              onChange={(e) => setLng1(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Destination (B)</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={lat2}
              onChange={(e) => setLat2(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
            <input
              type="number"
              step="any"
              value={lng2}
              onChange={(e) => setLng2(parseFloat(e.target.value) || 0)}
              className="px-2 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 text-center">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Forward Bearing</span>
          <p className="text-3xl font-mono font-bold text-indigo-900 dark:text-indigo-100 mt-1">
            {initialBearing.toFixed(1)}°
          </p>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 block">
            {compass.cardinal16} ({compass.description})
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Compass Rose Heading</span>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{compass.cardinal8}</p>
          <span className="text-xs text-slate-500 mt-1 block">8-Point Rose Direction</span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Back Bearing (Return)</span>
          <p className="text-3xl font-mono font-bold text-slate-800 dark:text-slate-100 mt-1">
            {backBearing.toFixed(1)}°
          </p>
          <span className="text-xs text-slate-500 mt-1 block">180° Reciprocal Heading</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. COMPASS DIRECTION CALCULATOR
// ==========================================
export const CompassDirectionCalculator: React.FC = () => {
  const [degrees, setDegrees] = useState(135);

  const compass = bearingToCompassPoint(degrees);
  const reciprocal = getCompassReciprocal(degrees);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🧭</span> Compass Direction Calculator
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Translate numerical degrees (0° - 360°) into 16-point cardinal compass rose points.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Angle in Degrees</label>
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{degrees}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={degrees}
            onChange={(e) => setDegrees(parseInt(e.target.value) || 0)}
            className="w-full accent-indigo-600"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">16-Point Cardinal</span>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{compass.cardinal16}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Description</span>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{compass.description}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">8-Point Simple</span>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">{compass.cardinal8}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Reciprocal (Opposite)</span>
            <p className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{reciprocal}°</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. MAP LINK GENERATOR
// ==========================================
export const MapLinkGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [lat, setLat] = useState(41.8902); // Colosseum, Rome
  const [lng, setLng] = useState(12.4922);
  const [placeName, setPlaceName] = useState('Colosseum, Rome');

  const links = generateMapLinks(lat, lng, placeName);

  const copy = (url: string, name: string) => {
    navigator.clipboard.writeText(url);
    showToast(`${name} link copied`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🗺️</span> Map Link Generator
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generate cross-platform deep links to open target coordinates in Google Maps, Apple Maps, OpenStreetMap, or native mobile navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Place Name</label>
          <input
            type="text"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: 'Google Maps', url: links.googleMaps },
          { label: 'Apple Maps', url: links.appleMaps },
          { label: 'OpenStreetMap', url: links.openStreetMap },
          { label: 'Bing Maps', url: links.bingMaps },
          { label: 'Geo URI (Native Apps)', url: links.geoUri }
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div>
              <span className="text-xs font-bold text-slate-400">{item.label}</span>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs sm:max-w-md mt-0.5">
                {item.url}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copy(item.url, item.label)}
                className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 9. GOOGLE MAPS ROUTE BUILDER
// ==========================================
export const GoogleMapsRouteBuilder: React.FC = () => {
  const { showToast } = useToast();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bicycling' | 'transit'>('driving');

  const routeUrl = generateGoogleMapsRouteUrl(origin, destination, waypoints, travelMode);

  const addWaypoint = () => {
    setWaypoints([...waypoints, 'New Stop']);
  };

  const removeWaypoint = (idx: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== idx));
  };

  const updateWaypoint = (idx: number, val: string) => {
    const copy = [...waypoints];
    copy[idx] = val;
    setWaypoints(copy);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(routeUrl);
    showToast('Route link copied', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🛣️</span> Google Maps Route Link Builder
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Construct custom multi-waypoint navigation links with specific travel modes for group sharing.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Travel Mode
          </label>
          <div className="flex gap-2">
            {[
              { key: 'driving', label: '🚗 Driving' },
              { key: 'walking', label: '🚶 Walking' },
              { key: 'bicycling', label: '🚴 Bicycling' },
              { key: 'transit', label: '🚆 Transit' }
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setTravelMode(m.key as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  travelMode === m.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Origin *</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location or city..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Destination *
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination location or landmark..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Waypoints (Intermediate Stops)</span>
            <button
              onClick={addWaypoint}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              + Add Waypoint
            </button>
          </div>
          <div className="space-y-2">
            {waypoints.map((wp, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={wp}
                  onChange={(e) => updateWaypoint(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={() => removeWaypoint(idx)}
                  className="px-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full truncate">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Generated Google Maps URL</span>
            <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 truncate">{routeUrl}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={copyUrl}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              Copy Link
            </button>
            <a
              href={routeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 10. TRAVEL LOCATION QR GENERATOR
// ==========================================
export const TravelLocationQrGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [lat, setLat] = useState(35.6586); // Tokyo Tower
  const [lng, setLng] = useState(139.7454);
  const [locationTitle, setLocationTitle] = useState('Tokyo Tower');
  const [qrFormat, setQrFormat] = useState<'geo' | 'maps'>('maps');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = () => {
    if (qrFormat === 'geo') {
      return `geo:${lat},${lng}?q=${encodeURIComponent(locationTitle)}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  useEffect(() => {
    generateQr();
  }, [lat, lng, locationTitle, qrFormat]);

  const generateQr = async () => {
    try {
      const payload = getPayload();
      const url = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch {
      showToast('Error generating QR', 'error');
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `location-qr-${locationTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
    showToast('QR code downloaded', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📲</span> Location QR Generator
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Generate scannable QR codes with geographic coordinates so other phones can navigate instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Location Name
            </label>
            <input
              type="text"
              value={locationTitle}
              onChange={(e) => setLocationTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              QR Protocol Format
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setQrFormat('maps')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  qrFormat === 'maps'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Google Maps URL (Universal)
              </button>
              <button
                onClick={() => setQrFormat('geo')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  qrFormat === 'geo'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                RFC 5870 Geo URI (Native GPS)
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-xs font-mono text-slate-500 break-all">
            Payload: {getPayload()}
          </div>
        </div>

        {/* QR Display */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
          {qrDataUrl ? (
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <img src={qrDataUrl} alt="Location QR Code" className="w-52 h-52 object-contain" />
            </div>
          ) : (
            <div className="w-52 h-52 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-2xl" />
          )}

          <p className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-4">{locationTitle}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scan with any phone camera to open live navigation
          </p>

          <button
            onClick={downloadQr}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" /> Download QR Code (PNG)
          </button>
        </div>
      </div>
    </div>
  );
};
