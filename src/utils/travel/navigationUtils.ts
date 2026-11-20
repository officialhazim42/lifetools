/**
 * Geographic, Navigation & GPS Coordinate Utilities
 * Haversine spherical distance, forward bearing, compass headings,
 * Decimal Degrees to DMS bidirectional conversion, and map link generators.
 */

export interface DmsCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface FormattedCoordinates {
  decimalDegrees: { lat: number; lng: number };
  dms: { latDms: string; lngDms: string; combined: string };
  ddm: { latDdm: string; lngDdm: string }; // Degrees Decimal Minutes
  geoUri: string;
}

/**
 * Validates whether latitude and longitude are within standard geographical bounds.
 * Latitude: -90 to +90
 * Longitude: -180 to +180
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  if (isNaN(lat) || isNaN(lng)) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Converts a decimal coordinate to Degrees, Minutes, Seconds (DMS).
 */
export function decimalToDms(decimal: number, isLatitude: boolean): DmsCoordinate {
  const isNegative = decimal < 0;
  const absVal = Math.abs(decimal);

  const degrees = Math.floor(absVal);
  const minutesNotTruncated = (absVal - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.round((minutesNotTruncated - minutes) * 60 * 100) / 100;

  let direction: 'N' | 'S' | 'E' | 'W';
  if (isLatitude) {
    direction = isNegative ? 'S' : 'N';
  } else {
    direction = isNegative ? 'W' : 'E';
  }

  return { degrees, minutes, seconds, direction };
}

/**
 * Converts Degrees, Minutes, Seconds (DMS) to Decimal Degrees.
 */
export function dmsToDecimal(
  degrees: number,
  minutes: number,
  seconds: number,
  direction: 'N' | 'S' | 'E' | 'W'
): number {
  let dd = Math.abs(degrees) + minutes / 60 + seconds / 3600;
  if (direction === 'S' || direction === 'W') {
    dd = -dd;
  }
  return Math.round(dd * 1000000) / 1000000;
}

/**
 * Formats a coordinate pair into standard human-readable strings.
 */
export function formatGpsCoordinates(lat: number, lng: number): FormattedCoordinates | null {
  if (!isValidCoordinate(lat, lng)) return null;

  const latDms = decimalToDms(lat, true);
  const lngDms = decimalToDms(lng, false);

  const latDmsStr = `${latDms.degrees}° ${latDms.minutes}' ${latDms.seconds}" ${latDms.direction}`;
  const lngDmsStr = `${lngDms.degrees}° ${lngDms.minutes}' ${lngDms.seconds}" ${lngDms.direction}`;

  // Degrees Decimal Minutes (DDM) - standard marine/GPS format: 40° 42.768' N
  const latMin = Math.abs((Math.abs(lat) - Math.floor(Math.abs(lat))) * 60);
  const lngMin = Math.abs((Math.abs(lng) - Math.floor(Math.abs(lng))) * 60);
  const latDdmStr = `${Math.floor(Math.abs(lat))}° ${latMin.toFixed(3)}' ${lat >= 0 ? 'N' : 'S'}`;
  const lngDdmStr = `${Math.floor(Math.abs(lng))}° ${lngMin.toFixed(3)}' ${lng >= 0 ? 'E' : 'W'}`;

  return {
    decimalDegrees: {
      lat: Math.round(lat * 1000000) / 1000000,
      lng: Math.round(lng * 1000000) / 1000000
    },
    dms: {
      latDms: latDmsStr,
      lngDms: lngDmsStr,
      combined: `${latDmsStr}, ${lngDmsStr}`
    },
    ddm: {
      latDdm: latDdmStr,
      lngDdm: lngDdmStr
    },
    geoUri: `geo:${lat.toFixed(6)},${lng.toFixed(6)}`
  };
}

/**
 * Calculates Great-Circle Distance between two coordinates using the Haversine Formula.
 * Radius of Earth: 6371 km / 3958.8 miles / 3440 nautical miles.
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): {
  distanceKm: number;
  distanceMiles: number;
  distanceNauticalMiles: number;
  km: number;
  miles: number;
  nauticalMiles: number;
  meters: number;
} | null {
  if (!isValidCoordinate(lat1, lng1) || !isValidCoordinate(lat2, lng2)) return null;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const R_KM = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const km = R_KM * c;
  const miles = km * 0.621371;
  const nm = km / 1.852;

  const roundKm = Math.round(km * 100) / 100;
  const roundMiles = Math.round(miles * 100) / 100;
  const roundNm = Math.round(nm * 100) / 100;
  const roundMeters = Math.round(km * 1000);

  return {
    distanceKm: roundKm,
    distanceMiles: roundMiles,
    distanceNauticalMiles: roundNm,
    km: roundKm,
    miles: roundMiles,
    nauticalMiles: roundNm,
    meters: roundMeters
  };
}

/**
 * Calculates Initial Forward Azimuth (Bearing) from point 1 to point 2.
 * Returns azimuth in degrees [0, 360).
 */
export function calculateInitialBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): {
  bearingDegrees: number;
  compassDirection: string;
  compassDirection16: string;
} | null {
  if (!isValidCoordinate(lat1, lng1) || !isValidCoordinate(lat2, lng2)) return null;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let brng = toDeg(Math.atan2(y, x));
  brng = (brng + 360) % 360;

  const rounded = Math.round(brng * 10) / 10;
  const direction16 = degreesToCompass16(rounded);
  const direction8 = degreesToCompass8(rounded);

  return {
    bearingDegrees: rounded,
    compassDirection: direction8,
    compassDirection16: direction16
  };
}

/**
 * Resolves an azimuth degree into 16-point compass directions.
 */
export function degreesToCompass16(degrees: number): string {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const normalized = (degrees % 360 + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

/**
 * Resolves an azimuth degree into 8-point compass directions.
 */
export function degreesToCompass8(degrees: number): string {
  const directions = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];
  const normalized = (degrees % 360 + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  return directions[index];
}

/**
 * Generates external map viewing and routing deep links.
 */
export function generateMapLinks(lat: number, lng: number, placeLabel?: string): {
  googleMaps: string;
  openStreetMap: string;
  appleMaps: string;
  bingMaps: string;
  geoUri: string;
} {
  const encodedLabel = placeLabel ? encodeURIComponent(placeLabel) : '';
  const latStr = lat.toFixed(6);
  const lngStr = lng.toFixed(6);

  return {
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${latStr},${lngStr}`,
    openStreetMap: `https://www.openstreetmap.org/?mlat=${latStr}&mlon=${lngStr}#map=16/${latStr}/${lngStr}`,
    appleMaps: `https://maps.apple.com/?q=${encodedLabel || 'Location'}&ll=${latStr},${lngStr}`,
    bingMaps: `https://www.bing.com/maps?cp=${latStr}~${lngStr}&lvl=16`,
    geoUri: `geo:${latStr},${lngStr}?q=${latStr},${lngStr}${placeLabel ? `(${encodedLabel})` : ''}`
  };
}

/**
 * Generates Google Maps Directions / Route deep link with optional waypoints.
 */
export function generateGoogleMapsRouteLink(params: {
  origin: string; // address or "lat,lng"
  destination: string;
  waypoints?: string[];
  travelMode?: 'driving' | 'walking' | 'bicycling' | 'transit';
}): string {
  const { origin, destination, waypoints, travelMode = 'driving' } = params;
  let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
  if (waypoints && waypoints.length > 0) {
    url += `&waypoints=${encodeURIComponent(waypoints.join('|'))}`;
  }
  return url;
}

export function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return calculateInitialBearing(lat1, lng1, lat2, lng2)?.bearingDegrees || 0;
}

export function bearingToCompassPoint(degrees: number): {
  cardinal16: string;
  cardinal8: string;
  description: string;
} {
  return {
    cardinal16: degreesToCompass16(degrees),
    cardinal8: degreesToCompass8(degrees),
    description: degreesToCompass8(degrees)
  };
}

export function getCompassReciprocal(degrees: number): number {
  return Math.round(((degrees + 180) % 360) * 10) / 10;
}

export function generateGoogleMapsRouteUrl(
  origin: string,
  destination: string,
  waypoints: string[] = [],
  travelMode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): string {
  return generateGoogleMapsRouteLink({ origin, destination, waypoints, travelMode });
}
