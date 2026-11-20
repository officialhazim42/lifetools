/**
 * Pure Dependency-Free Client-Side ZIP Archive Generator and Reader
 * Conforms to the standard PKWARE .ZIP specification (Store mode).
 * Compatible with Windows Explorer, macOS Archive Utility, Linux unzip, and 7-Zip.
 */

// CRC-32 Table
const crcTable: Uint32Array = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

export function computeCrc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Convert JS Date to DOS time/date format
function dateToDosTime(date: Date): { time: number; date: number } {
  const year = Math.max(1980, date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);

  const dosTime = (hours << 11) | (minutes << 5) | seconds;
  const dosDate = ((year - 1980) << 9) | (month << 5) | day;
  return { time: dosTime, date: dosDate };
}

export interface ZipFileInput {
  name: string;
  content?: string | Uint8Array;
  data?: string | Uint8Array;
}

export interface ZipExtractedFile {
  name: string;
  data: Uint8Array;
  text: () => string;
}

/**
 * Creates a standard uncompressed ZIP binary archive.
 */
export function createZipArchive(files: ZipFileInput[]): Uint8Array {
  const encoder = new TextEncoder();
  const now = new Date();
  const { time: dosTime, date: dosDate } = dateToDosTime(now);

  interface PreparedEntry {
    nameBytes: Uint8Array;
    data: Uint8Array;
    crc: number;
    offset: number;
  }

  const entries: PreparedEntry[] = [];
  let currentOffset = 0;

  // 1. Calculate and build local headers + data
  const localParts: Uint8Array[] = [];

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const rawContent = file.content !== undefined ? file.content : (file.data !== undefined ? file.data : '');
    const data = typeof rawContent === 'string' ? encoder.encode(rawContent) : rawContent;
    const crc = computeCrc32(data);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);

    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true); // Version needed to extract (2.0)
    view.setUint16(6, 0x0800, true); // General purpose bit flag (UTF-8)
    view.setUint16(8, 0, true); // Compression method (0 = store)
    view.setUint16(10, dosTime, true);
    view.setUint16(12, dosDate, true);
    view.setUint32(14, crc, true); // CRC-32
    view.setUint32(18, data.length, true); // Compressed size
    view.setUint32(22, data.length, true); // Uncompressed size
    view.setUint16(26, nameBytes.length, true); // Filename length
    view.setUint16(28, 0, true); // Extra field length

    localHeader.set(nameBytes, 30);

    entries.push({
      nameBytes,
      data,
      crc,
      offset: currentOffset
    });

    localParts.push(localHeader);
    localParts.push(data);
    currentOffset += localHeader.length + data.length;
  }

  // 2. Build Central Directory
  const centralDirOffset = currentOffset;
  const centralParts: Uint8Array[] = [];
  let centralDirSize = 0;

  for (const entry of entries) {
    const centralHeader = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(centralHeader.buffer);

    view.setUint32(0, 0x02014b50, true); // Central file header signature
    view.setUint16(4, 20, true); // Version made by (2.0)
    view.setUint16(6, 20, true); // Version needed to extract (2.0)
    view.setUint16(8, 0x0800, true); // UTF-8
    view.setUint16(10, 0, true); // Store
    view.setUint16(12, dosTime, true);
    view.setUint16(14, dosDate, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.data.length, true);
    view.setUint32(24, entry.data.length, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // File comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal attributes
    view.setUint32(38, 0, true); // External attributes
    view.setUint32(42, entry.offset, true); // Offset of local header

    centralHeader.set(entry.nameBytes, 46);

    centralParts.push(centralHeader);
    centralDirSize += centralHeader.length;
  }

  // 3. End of Central Directory Record
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  eocdView.setUint32(0, 0x06054b50, true); // Signature
  eocdView.setUint16(4, 0, true); // Disk number
  eocdView.setUint16(6, 0, true); // Start disk
  eocdView.setUint16(8, entries.length, true); // Records on this disk
  eocdView.setUint16(10, entries.length, true); // Total records
  eocdView.setUint32(12, centralDirSize, true); // Size of central directory
  eocdView.setUint32(16, centralDirOffset, true); // Offset of central directory
  eocdView.setUint16(20, 0, true); // Comment length

  // Combine all parts into single Uint8Array
  const totalLength = centralDirOffset + centralDirSize + 22;
  const result = new Uint8Array(totalLength);
  let pos = 0;

  for (const p of [...localParts, ...centralParts, eocd]) {
    result.set(p, pos);
    pos += p.length;
  }

  return result;
}

/**
 * Parses and extracts files from an uncompressed ZIP archive.
 */
export function extractZipArchive(zipData: Uint8Array): ZipExtractedFile[] {
  if (zipData.length < 22) {
    throw new Error('Invalid ZIP file: File too small.');
  }

  const view = new DataView(zipData.buffer, zipData.byteOffset, zipData.byteLength);
  const decoder = new TextDecoder();

  // Find End of Central Directory signature (0x06054b50) scanning from end
  let eocdOffset = -1;
  for (let i = zipData.length - 22; i >= Math.max(0, zipData.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) {
    throw new Error('Invalid ZIP format: End of Central Directory record not found.');
  }

  const totalRecords = view.getUint16(eocdOffset + 10, true);
  const centralDirOffset = view.getUint32(eocdOffset + 16, true);

  const files: ZipExtractedFile[] = [];
  let ptr = centralDirOffset;

  for (let i = 0; i < totalRecords; i++) {
    if (ptr + 46 > zipData.length) break;
    const sig = view.getUint32(ptr, true);
    if (sig !== 0x02014b50) break;

    const compression = view.getUint16(ptr + 10, true);
    const uncompressedSize = view.getUint32(ptr + 24, true);
    const nameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localHeaderOffset = view.getUint32(ptr + 42, true);

    const nameBytes = zipData.slice(ptr + 46, ptr + 46 + nameLen);
    const fileName = decoder.decode(nameBytes);

    // Read file data from local header
    if (localHeaderOffset + 30 > zipData.length) {
      throw new Error(`Corrupted ZIP: Invalid local header offset for ${fileName}`);
    }

    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + nameLen + localExtraLen;
    const dataEnd = dataStart + uncompressedSize;

    if (dataEnd > zipData.length) {
      throw new Error(`Corrupted ZIP: File data overflow for ${fileName}`);
    }

    const fileData = zipData.slice(dataStart, dataEnd);

    files.push({
      name: fileName,
      data: fileData,
      text: () => decoder.decode(fileData)
    });

    ptr += 46 + nameLen + extraLen + commentLen;
  }

  return files;
}
