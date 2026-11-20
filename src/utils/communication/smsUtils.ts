/**
 * SMS Encoding & Segment Calculation Utilities
 * Supports GSM 7-bit default alphabet + extension table, UCS-2 Unicode detection,
 * segment sizing (160 vs 153 for GSM-7; 70 vs 67 for UCS-2), and character replacements.
 */

import { SmsEncodingAnalysis } from '../../types/communication';

// Standard GSM 7-bit default alphabet (basic character set)
const GSM_7_BASIC = new Set([
  '@', '£', '$', '¥', 'è', 'é', 'ù', 'ì', 'ò', 'Ç', '\n', 'Ø', 'ø', '\r', 'Å', 'å',
  'Δ', '_', 'Φ', 'Γ', 'Λ', 'Ω', 'Π', 'Ψ', 'Σ', 'Θ', 'Ξ', '\x1B', 'Æ', 'æ', 'ß', 'É',
  ' ', '!', '"', '#', '¤', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
  '¡', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ñ', 'Ü', '§',
  '¿', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'ö', 'ñ', 'ü', 'à'
]);

// GSM 7-bit extension characters (each counts as 2 characters because of escape prefix 0x1B)
const GSM_7_EXTENSION = new Set(['^', '{', '}', '\\', '[', '~', ']', '|', '€']);

/**
 * Checks whether a character belongs to GSM-7 basic or extension set.
 */
export function isGsm7Character(char: string): boolean {
  return GSM_7_BASIC.has(char) || GSM_7_EXTENSION.has(char);
}

/**
 * Analyzes SMS message encoding and segment split.
 */
export function analyzeSms(text: string): SmsEncodingAnalysis {
  if (!text) {
    return {
      text: '',
      characterCount: 0,
      encoding: 'GSM-7',
      segmentCount: 0,
      maxCharsPerSegment: 160,
      charsRemainingInSegment: 160,
      hasNonGsmCharacters: false,
      nonGsmCharacters: [],
      estimatedCostMultiplier: 0
    };
  }

  const nonGsmCharacters: string[] = [];
  let isUnicode = false;
  let gsmUnits = 0;

  for (const char of text) {
    if (GSM_7_BASIC.has(char)) {
      gsmUnits += 1;
    } else if (GSM_7_EXTENSION.has(char)) {
      gsmUnits += 2; // Extension characters count as 2 GSM-7 units
    } else {
      isUnicode = true;
      if (!nonGsmCharacters.includes(char)) {
        nonGsmCharacters.push(char);
      }
    }
  }

  const characterCount = text.length;

  if (isUnicode) {
    // UCS-2: Single segment = 70 characters. Multi-segment = 67 characters per segment (3 chars used for UDH header)
    const singleLimit = 70;
    const multiLimit = 67;

    let segmentCount = 1;
    let charsRemaining = singleLimit - characterCount;

    if (characterCount > singleLimit) {
      segmentCount = Math.ceil(characterCount / multiLimit);
      charsRemaining = segmentCount * multiLimit - characterCount;
    }

    return {
      text,
      characterCount,
      encoding: 'UCS-2 (Unicode)',
      segmentCount,
      maxCharsPerSegment: segmentCount === 1 ? singleLimit : multiLimit,
      charsRemainingInSegment: Math.max(0, charsRemaining),
      hasNonGsmCharacters: true,
      nonGsmCharacters,
      estimatedCostMultiplier: segmentCount
    };
  } else {
    // GSM-7: Single segment = 160 units. Multi-segment = 153 units per segment (7 units used for UDH header)
    const singleLimit = 160;
    const multiLimit = 153;

    let segmentCount = 1;
    let charsRemaining = singleLimit - gsmUnits;

    if (gsmUnits > singleLimit) {
      segmentCount = Math.ceil(gsmUnits / multiLimit);
      charsRemaining = segmentCount * multiLimit - gsmUnits;
    }

    return {
      text,
      characterCount: gsmUnits,
      encoding: 'GSM-7',
      segmentCount,
      maxCharsPerSegment: segmentCount === 1 ? singleLimit : multiLimit,
      charsRemainingInSegment: Math.max(0, charsRemaining),
      hasNonGsmCharacters: false,
      nonGsmCharacters: [],
      estimatedCostMultiplier: segmentCount
    };
  }
}

/**
 * Replaces fancy unicode characters (smart quotes, em-dashes, accents) with GSM-7 equivalents.
 */
export function sanitizeToGsm7(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/…/g, '...')
    .replace(/[•·]/g, '*')
    .replace(/[Áá]/g, 'a')
    .replace(/[Íí]/g, 'i')
    .replace(/[Óó]/g, 'o')
    .replace(/[Úú]/g, 'u')
    .replace(/[©®™]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Zero-width spaces
}
