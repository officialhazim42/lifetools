/**
 * Pure TypeScript Client-Side GIF89a Animated GIF Encoder
 * Encodes Canvas ImageData frames into an animated GIF Blob.
 * 
 * Features:
 * - Netscape 2.0 animated loop extension
 * - Graphic Control Extension (delay in 1/100ths of second)
 * - Color quantization (median cut / adaptive sampling up to 256 colors)
 * - Standard LZW variable-length dictionary compression
 * - 100% in-browser client-side execution, zero external dependencies
 */

export interface GifFrameInput {
  imageData: ImageData;
  delayMs: number;
}

export function encodeGifBytes(
  frames: GifFrameInput[],
  width: number,
  height: number,
  loopCount: number = 0 // 0 = infinite loop
): Uint8Array {
  if (frames.length === 0) {
    throw new Error('At least one frame is required to encode a GIF.');
  }

  const chunks: Uint8Array[] = [];

  // 1. Header: GIF89a
  chunks.push(new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]));

  // 2. Logical Screen Descriptor
  const lsd = new Uint8Array(7);
  const lsdView = new DataView(lsd.buffer);
  lsdView.setUint16(0, width, true);
  lsdView.setUint16(2, height, true);
  // Packed: No Global Color Table here, we use Local Color Table per frame for optimal quality
  lsd[4] = 0x70; // 0111 0000: No GCT, 8 bits/pixel color resolution
  lsd[5] = 0;    // Background color index
  lsd[6] = 0;    // Pixel aspect ratio
  chunks.push(lsd);

  // 3. Netscape 2.0 Application Extension (for looping)
  chunks.push(new Uint8Array([
    0x21, 0xff, 0x0b,
    0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30, // "NETSCAPE2.0"
    0x03, 0x01,
    loopCount & 0xff, (loopCount >> 8) & 0xff,
    0x00
  ]));

  // 4. Encode each frame
  for (const frame of frames) {
    const { palette, indexedPixels } = quantize(frame.imageData.data, 256);
    const delayHundredths = Math.max(1, Math.round(frame.delayMs / 10));

    // Graphic Control Extension
    chunks.push(new Uint8Array([
      0x21, 0xf9, 0x04,
      0x04, // Disposal method: 000 001 00 (do not dispose, or restore background)
      delayHundredths & 0xff, (delayHundredths >> 8) & 0xff,
      0x00, // Transparent color index (none)
      0x00  // Block terminator
    ]));

    // Image Descriptor
    const id = new Uint8Array(10);
    const idView = new DataView(id.buffer);
    id[0] = 0x2c; // Image separator ','
    idView.setUint16(1, 0, true);      // Left
    idView.setUint16(3, 0, true);      // Top
    idView.setUint16(5, width, true);  // Width
    idView.setUint16(7, height, true); // Height
    // Packed: 1 (Local Color Table Flag) + 0 (No Interlace) + 0 (Not sorted) + 111 (Size: 2^(7+1) = 256 colors)
    id[9] = 0x87;
    chunks.push(id);

    // Local Color Table (256 * 3 = 768 bytes)
    const lct = new Uint8Array(768);
    for (let i = 0; i < palette.length; i++) {
      lct[i * 3] = palette[i][0];
      lct[i * 3 + 1] = palette[i][1];
      lct[i * 3 + 2] = palette[i][2];
    }
    chunks.push(lct);

    // LZW Encoded Image Data
    const lzwData = lzwEncode(indexedPixels, 8);
    chunks.push(lzwData);
  }

  // 5. Trailer
  chunks.push(new Uint8Array([0x3b])); // ';'

  // Combine into single Uint8Array
  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const c of chunks) {
    result.set(c, offset);
    offset += c.length;
  }
  return result;
}

export function encodeGif(
  frames: GifFrameInput[],
  width: number,
  height: number,
  loopCount: number = 0 // 0 = infinite loop
): Blob {
  const bytes = encodeGifBytes(frames, width, height, loopCount);
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'image/gif' });
}

/**
 * Color Quantizer
 * Simple popular/median cut palette generation reducing 24-bit RGBA to 256 palette indices.
 */
function quantize(rgba: Uint8ClampedArray, maxColors: number): { palette: number[][]; indexedPixels: Uint8Array } {
  const pixelCount = rgba.length / 4;
  const colorMap = new Map<number, number>();

  // Sample colors (sample every nth pixel if large to speed up)
  const step = pixelCount > 50000 ? 4 : 1;
  for (let i = 0; i < rgba.length; i += 4 * step) {
    // Quantize 5 bits per channel (32 levels per channel = 32768 total space)
    const r = rgba[i] & 0xf8;
    const g = rgba[i + 1] & 0xf8;
    const b = rgba[i + 2] & 0xf8;
    const key = (r << 16) | (g << 8) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // Sort by popularity
  const sorted = Array.from(colorMap.entries()).sort((a, b) => b[1] - a[1]);
  const palette: number[][] = [];
  for (let i = 0; i < Math.min(sorted.length, maxColors); i++) {
    const key = sorted[i][0];
    const r = (key >> 16) & 0xff;
    const g = (key >> 8) & 0xff;
    const b = key & 0xff;
    palette.push([r, g, b]);
  }

  // Pad palette to 256 if needed
  while (palette.length < 256) {
    palette.push([0, 0, 0]);
  }

  // Map each pixel to nearest palette color
  const indexedPixels = new Uint8Array(pixelCount);
  const cache = new Map<number, number>();

  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const key = (r << 16) | (g << 8) | b;

    let index = cache.get(key);
    if (index === undefined) {
      let bestDist = Infinity;
      let bestIndex = 0;
      for (let j = 0; j < Math.min(palette.length, maxColors); j++) {
        const pal = palette[j];
        const dr = r - pal[0];
        const dg = g - pal[1];
        const db = b - pal[2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = j;
          if (dist === 0) break;
        }
      }
      index = bestIndex;
      cache.set(key, index);
    }
    indexedPixels[p] = index;
  }

  return { palette, indexedPixels };
}

/**
 * Standard LZW Encoder for GIF
 */
function lzwEncode(pixels: Uint8Array, minCodeSize: number): Uint8Array {
  const clearCode = 1 << minCodeSize;
  const eoiCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let nextCode = eoiCode + 1;
  const maxTableSize = 4096;

  // LZW dictionary: key -> code
  const dict = new Map<string, number>();

  const initDict = () => {
    dict.clear();
    for (let i = 0; i < clearCode; i++) {
      dict.set(String(i), i);
    }
    codeSize = minCodeSize + 1;
    nextCode = eoiCode + 1;
  };

  initDict();

  const outBytes: number[] = [];
  let curAccum = 0;
  let curBits = 0;

  const emitCode = (code: number) => {
    curAccum |= code << curBits;
    curBits += codeSize;
    while (curBits >= 8) {
      outBytes.push(curAccum & 0xff);
      curAccum >>= 8;
      curBits -= 8;
    }
  };

  // Output Clear Code
  emitCode(clearCode);

  let prefix = '';

  for (let i = 0; i < pixels.length; i++) {
    const k = String(pixels[i]);
    const phrase = prefix ? prefix + ',' + k : k;

    if (dict.has(phrase)) {
      prefix = phrase;
    } else {
      emitCode(dict.get(prefix)!);

      if (nextCode < maxTableSize) {
        dict.set(phrase, nextCode++);
        if (nextCode > (1 << codeSize) && codeSize < 12) {
          codeSize++;
        }
      } else {
        // Table full, reset
        emitCode(clearCode);
        initDict();
      }
      prefix = k;
    }
  }

  if (prefix) {
    emitCode(dict.get(prefix)!);
  }

  // End of Information Code
  emitCode(eoiCode);

  // Flush remaining bits
  if (curBits > 0) {
    outBytes.push(curAccum & 0xff);
  }

  // Package into GIF sub-blocks (max 255 bytes each)
  const result: number[] = [minCodeSize];
  let offset = 0;
  while (offset < outBytes.length) {
    const chunkSize = Math.min(255, outBytes.length - offset);
    result.push(chunkSize);
    for (let j = 0; j < chunkSize; j++) {
      result.push(outBytes[offset + j]);
    }
    offset += chunkSize;
  }
  // Block terminator
  result.push(0x00);

  return new Uint8Array(result);
}
