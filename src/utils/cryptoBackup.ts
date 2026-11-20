/**
 * Client-Side Cryptographic Engine for LifeTools Universal Backups
 * Uses authenticated AES-256-GCM and PBKDF2 via Web Crypto API.
 * Never stores passwords or transmits plaintexts.
 */

import { UniversalBackupPayload, EncryptedBackupContainer } from '../types/backup';

// Helper: Uint8Array to Base64
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Helper: ArrayBuffer to Hex String
export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

const getSubtle = (): SubtleCrypto => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Crypto API (subtle) is not supported in this runtime environment.');
};

/**
 * Computes SHA-256 checksum of a string content.
 */
export async function computeSHA256(content: string): Promise<string> {
  const subtle = getSubtle();
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

/**
 * Derives an AES-256-GCM CryptoKey from password and salt using PBKDF2.
 */
async function deriveEncryptionKey(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> {
  const subtle = getSubtle();
  const encoder = new TextEncoder();
  const passwordKey = await subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a JSON plaintext string or UniversalBackupPayload with a password using AES-256-GCM.
 */
export async function encryptBackupPayload(
  payloadOrPlaintext: UniversalBackupPayload | string,
  password: string
): Promise<any> {
  if (!password || password.length < 4) {
    throw new Error('Encryption password must be at least 4 characters.');
  }

  const isObject = typeof payloadOrPlaintext === 'object' && payloadOrPlaintext !== null;
  const plaintext = isObject ? JSON.stringify(payloadOrPlaintext) : payloadOrPlaintext;

  const subtle = getSubtle();
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : globalThis.crypto;

  // 16-byte cryptographically secure salt
  const salt = new Uint8Array(16);
  cryptoObj.getRandomValues(salt);

  // 12-byte initialization vector for AES-GCM
  const iv = new Uint8Array(12);
  cryptoObj.getRandomValues(iv);

  const iterations = 100000;
  const key = await deriveEncryptionKey(password, salt, iterations);

  const encoder = new TextEncoder();
  const encodedPlaintext = encoder.encode(plaintext);

  const encryptedBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128
    },
    key,
    encodedPlaintext
  );

  const ciphertext = uint8ArrayToBase64(new Uint8Array(encryptedBuffer));
  const saltBase64 = uint8ArrayToBase64(salt);
  const ivBase64 = uint8ArrayToBase64(iv);

  if (isObject) {
    const payload = payloadOrPlaintext as UniversalBackupPayload;
    const manifest = {
      ...payload.manifest,
      isEncrypted: true,
      encryption: {
        algorithm: 'AES-GCM' as const,
        kdf: 'PBKDF2' as const,
        iterations,
        salt: saltBase64,
        iv: ivBase64
      }
    };
    const container: EncryptedBackupContainer = {
      lifeToolsEncryptedBackup: true,
      manifest,
      ciphertext
    };
    return container;
  }

  return {
    ciphertext,
    salt: saltBase64,
    iv: ivBase64,
    iterations
  };
}

/**
 * Decrypts an AES-256-GCM encrypted backup payload with the user's password.
 */
export async function decryptBackupPayload(
  containerOrCiphertext: EncryptedBackupContainer | string,
  password: string,
  saltBase64?: string,
  ivBase64?: string,
  iterations: number = 100000
): Promise<any> {
  if (!password) {
    throw new Error('Password is required to decrypt backup.');
  }

  let ciphertextStr = '';
  let saltStr = '';
  let ivStr = '';
  let iters = iterations;
  let isContainer = false;

  if (typeof containerOrCiphertext === 'object' && containerOrCiphertext !== null) {
    const container = containerOrCiphertext as EncryptedBackupContainer;
    if (!container.manifest.encryption) {
      throw new Error('Malformed container: missing encryption metadata.');
    }
    ciphertextStr = container.ciphertext;
    saltStr = container.manifest.encryption.salt;
    ivStr = container.manifest.encryption.iv;
    iters = container.manifest.encryption.iterations || 100000;
    isContainer = true;
  } else {
    ciphertextStr = containerOrCiphertext as string;
    saltStr = saltBase64 || '';
    ivStr = ivBase64 || '';
  }

  const subtle = getSubtle();
  const salt = base64ToUint8Array(saltStr);
  const iv = base64ToUint8Array(ivStr);
  const ciphertextBytes = base64ToUint8Array(ciphertextStr);

  const key = await deriveEncryptionKey(password, salt, iters);

  try {
    const decryptedBuffer = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as any,
        tagLength: 128
      },
      key,
      ciphertextBytes as any
    );

    const decoder = new TextDecoder();
    const decodedText = decoder.decode(decryptedBuffer);

    if (isContainer) {
      return JSON.parse(decodedText);
    }
    return decodedText;
  } catch {
    throw new Error('Decryption failed: Incorrect password or corrupted encrypted backup.');
  }
}
