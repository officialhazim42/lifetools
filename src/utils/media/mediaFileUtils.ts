/**
 * Media File Utilities & Binary Format Inspector
 * Identifies true file formats using binary magic numbers,
 * calculates aspect ratios, bitrates, frame rates, and durations.
 */

export interface MediaSignature {
  extension: string;
  mime: string;
  container: string;
  category: 'image' | 'audio' | 'video';
  magicMatch: boolean;
  description: string;
}

export function inspectMagicBytes(buffer: ArrayBuffer): MediaSignature {
  const bytes = new Uint8Array(buffer);
  const len = bytes.length;

  if (len < 4) {
    return {
      extension: 'unknown',
      mime: 'application/octet-stream',
      container: 'Unknown',
      category: 'image',
      magicMatch: false,
      description: 'File too small to inspect binary headers.'
    };
  }

  // 1. JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return {
      extension: 'jpg',
      mime: 'image/jpeg',
      container: 'JPEG / JFIF / EXIF',
      category: 'image',
      magicMatch: true,
      description: 'Standard JPEG Compressed Photographic Image'
    };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return {
      extension: 'png',
      mime: 'image/png',
      container: 'Portable Network Graphics (PNG)',
      category: 'image',
      magicMatch: true,
      description: 'Lossless raster image with alpha transparency'
    };
  }

  // 3. GIF: 47 49 46 38 (GIF87a or GIF89a)
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return {
      extension: 'gif',
      mime: 'image/gif',
      container: 'Graphics Interchange Format (GIF89a)',
      category: 'image',
      magicMatch: true,
      description: 'Indexed color image or animated sequence'
    };
  }

  // 4. WebP: 52 49 46 46 ... 57 45 42 50 (RIFF .... WEBP)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    len >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return {
      extension: 'webp',
      mime: 'image/webp',
      container: 'Google WebP Image (RIFF container)',
      category: 'image',
      magicMatch: true,
      description: 'Modern lossy/lossless WebP image'
    };
  }

  // 5. WAV: 52 49 46 46 ... 57 41 56 45 (RIFF .... WAVE)
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    len >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x41 &&
    bytes[10] === 0x56 &&
    bytes[11] === 0x45
  ) {
    return {
      extension: 'wav',
      mime: 'audio/wav',
      container: 'RIFF WAVE Audio Container',
      category: 'audio',
      magicMatch: true,
      description: 'Uncompressed Linear Pulse Code Modulation (LPCM)'
    };
  }

  // 6. MP3 with ID3v2 tag: 49 44 33 ("ID3")
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    return {
      extension: 'mp3',
      mime: 'audio/mpeg',
      container: 'MPEG-1 Audio Layer III (with ID3v2)',
      category: 'audio',
      magicMatch: true,
      description: 'Standard MP3 compressed audio file'
    };
  }

  // 7. MP3 raw sync word: FF FB or FF F3 or FF F2
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) {
    return {
      extension: 'mp3',
      mime: 'audio/mpeg',
      container: 'MPEG Audio Frame Sync',
      category: 'audio',
      magicMatch: true,
      description: 'Raw MPEG Audio frame stream'
    };
  }

  // 8. OGG container: 4F 67 67 53 ("OggS")
  if (
    bytes[0] === 0x4f &&
    bytes[1] === 0x67 &&
    bytes[2] === 0x67 &&
    bytes[3] === 0x53
  ) {
    return {
      extension: 'ogg',
      mime: 'audio/ogg',
      container: 'Xiph.Org Ogg Multiplex Container',
      category: 'audio',
      magicMatch: true,
      description: 'Ogg Vorbis or Opus compressed stream'
    };
  }

  // 9. FLAC: 66 4C 61 43 ("fLaC")
  if (
    bytes[0] === 0x66 &&
    bytes[1] === 0x4c &&
    bytes[2] === 0x61 &&
    bytes[3] === 0x43
  ) {
    return {
      extension: 'flac',
      mime: 'audio/flac',
      container: 'Free Lossless Audio Codec (FLAC)',
      category: 'audio',
      magicMatch: true,
      description: 'High-fidelity lossless compressed audio'
    };
  }

  // 10. WebM / Matroska: 1A 45 DF A3 (EBML Header)
  if (
    bytes[0] === 0x1a &&
    bytes[1] === 0x45 &&
    bytes[2] === 0xdf &&
    bytes[3] === 0xa3
  ) {
    return {
      extension: 'webm',
      mime: 'video/webm',
      container: 'EBML Matroska / WebM Video Container',
      category: 'video',
      magicMatch: true,
      description: 'Google WebM video container (VP8/VP9/AV1 + Vorbis/Opus)'
    };
  }

  // 11. MP4 / MOV: .... 66 74 79 70 ("ftyp" box at offset 4)
  if (
    len >= 8 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    const majorBrand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
    const isMov = majorBrand.startsWith('qt');
    return {
      extension: isMov ? 'mov' : 'mp4',
      mime: isMov ? 'video/quicktime' : 'video/mp4',
      container: `ISO Base Media File (ftyp: ${majorBrand})`,
      category: 'video',
      magicMatch: true,
      description: 'Standard MPEG-4 Part 14 video container'
    };
  }

  return {
    extension: 'bin',
    mime: 'application/octet-stream',
    container: 'Generic Binary Stream',
    category: 'image',
    magicMatch: false,
    description: 'Unrecognized binary signature'
  };
}

/**
 * Math utilities: Greatest Common Divisor
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function calculateAspectRatio(width: number, height: number): {
  ratioText: string;
  horizontalFactor: number;
  verticalFactor: number;
  decimal: number;
  closestStandard: string;
} {
  if (width <= 0 || height <= 0) {
    return { ratioText: '1:1', horizontalFactor: 1, verticalFactor: 1, decimal: 1, closestStandard: '1:1 Square' };
  }

  const divisor = gcd(width, height);
  const h = width / divisor;
  const v = height / divisor;
  const decimal = width / height;

  const standards = [
    { name: '16:9 Landscape', value: 16 / 9 },
    { name: '9:16 Vertical (Story/Reel)', value: 9 / 16 },
    { name: '4:3 Standard Classic', value: 4 / 3 },
    { name: '3:4 Portrait', value: 3 / 4 },
    { name: '1:1 Square', value: 1.0 },
    { name: '21:9 Ultrawide Cinema', value: 21 / 9 },
    { name: '3:2 Photo 35mm', value: 3 / 2 },
    { name: '2:3 Photo Portrait', value: 2 / 3 }
  ];

  let closest = standards[0];
  let minDiff = Math.abs(decimal - closest.value);
  for (const s of standards) {
    const diff = Math.abs(decimal - s.value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = s;
    }
  }

  return {
    ratioText: `${h}:${v}`,
    horizontalFactor: h,
    verticalFactor: v,
    decimal: Math.round(decimal * 1000) / 1000,
    closestStandard: closest.name
  };
}

export function calculateBitrate(fileSizeBytes: number, durationSeconds: number): {
  bps: number;
  kbps: number;
  mbps: number;
} {
  if (durationSeconds <= 0 || fileSizeBytes <= 0) {
    return { bps: 0, kbps: 0, mbps: 0 };
  }
  const totalBits = fileSizeBytes * 8;
  const bps = Math.round(totalBits / durationSeconds);
  const kbps = Math.round((bps / 1000) * 10) / 10;
  const mbps = Math.round((bps / 1000000) * 100) / 100;
  return { bps, kbps, mbps };
}

export function calculateMediaSize(
  bitrateKbps: number,
  durationSeconds: number
): {
  bytes: number;
  kiloBytes: number;
  megaBytes: number;
  gigaBytes: number;
} {
  const totalBits = bitrateKbps * 1000 * durationSeconds;
  const bytes = Math.round(totalBits / 8);
  const kiloBytes = Math.round((bytes / 1024) * 10) / 10;
  const megaBytes = Math.round((bytes / (1024 * 1024)) * 100) / 100;
  const gigaBytes = Math.round((bytes / (1024 * 1024 * 1024)) * 1000) / 1000;
  return { bytes, kiloBytes, megaBytes, gigaBytes };
}
