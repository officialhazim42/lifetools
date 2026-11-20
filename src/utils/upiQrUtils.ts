import jsQR from 'jsqr';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export type UpiPaymentMode = 'static' | 'fixed';
export type UpiLayoutPreset = 'minimal' | 'shop' | 'business' | 'poster' | 'card';

export interface BankAccountDetails {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  branchName?: string;
}

export interface UpiPaymentParams {
  payeeName: string;
  upiId: string;
  mode: UpiPaymentMode;
  amount?: string;
  currency: 'INR';
  businessName?: string;
  paymentNote?: string;
  transactionRef?: string;
  merchantCode?: string;
  paymentInstruction?: string;
  bankDetails?: BankAccountDetails;
}

export interface UpiValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export interface UpiVerificationResult {
  isVerified: boolean;
  decodedUri: string | null;
  matchesExpected: boolean;
  preservedParams: {
    hasPayeeName: boolean;
    hasUpiId: boolean;
    hasCurrency: boolean;
    amountMatches: boolean;
    noteMatches: boolean;
  };
  message: string;
}

/**
 * Validates a UPI ID (Virtual Payment Address).
 * Interoperable format: username@bankhandle (e.g. shop@okhdfcbank, user@ybl).
 */
export function validateUpiId(id: string): { valid: boolean; error?: string } {
  const trimmed = id.trim();
  if (!trimmed) {
    return { valid: false, error: 'UPI ID is required (e.g. yourname@okhdfcbank).' };
  }
  if (trimmed.includes(' ')) {
    return { valid: false, error: 'UPI ID cannot contain spaces.' };
  }
  if (!trimmed.includes('@')) {
    return { valid: false, error: 'UPI ID must contain an "@" symbol followed by the bank handle (e.g. @okhdfcbank, @ybl).' };
  }

  // Interoperable standard regex
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  if (!upiRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid UPI ID format. It should follow username@handle (e.g. name@okaxis, store@paytm).' };
  }

  return { valid: true };
}

/**
 * Validates the Payee Name.
 */
export function validatePayeeName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'Payee Name is required for interoperable UPI payments.' };
  }
  if (trimmed.length > 99) {
    return { valid: false, error: 'Payee Name should be 99 characters or fewer.' };
  }
  return { valid: true };
}

/**
 * Validates Payment Amount for Fixed Amount QR mode.
 */
export function validateAmount(amountStr: string, mode: UpiPaymentMode): { valid: boolean; error?: string; warning?: string } {
  if (mode === 'static') {
    return { valid: true };
  }

  const trimmed = amountStr.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a payment amount for Fixed Amount QR mode.' };
  }

  const num = Number(trimmed);
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: 'Amount must be a positive number greater than 0.' };
  }

  // Check decimal places (max 2 decimals for INR paisa)
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return { valid: false, error: 'Amount can have at most 2 decimal places (e.g. 500.00).' };
  }

  if (num > 500000) {
    return { valid: false, error: 'Amount exceeds standard NPCI UPI transaction limit (₹5,00,000).' };
  }

  if (num > 100000) {
    return {
      valid: true,
      warning: 'Note: Standard peer-to-peer (P2P) UPI transactions are typically capped at ₹1,00,000 per day by banks.'
    };
  }

  return { valid: true };
}

/**
 * Validates Merchant Category Code (MCC) if provided.
 */
export function validateMerchantCode(mc?: string): { valid: boolean; error?: string } {
  if (!mc || !mc.trim()) return { valid: true };
  const trimmed = mc.trim();
  if (!/^\d{4}$/.test(trimmed)) {
    return { valid: false, error: 'Merchant Category Code (MCC) must be exactly 4 digits (e.g. 5411 for Grocery, 5812 for Restaurants).' };
  }
  return { valid: true };
}

/**
 * Validates IFSC Code if provided in Bank Details.
 */
export function validateIfscCode(ifsc?: string): { valid: boolean; error?: string } {
  if (!ifsc || !ifsc.trim()) return { valid: true };
  const trimmed = ifsc.trim().toUpperCase();
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(trimmed)) {
    return { valid: false, error: 'IFSC must be 11 characters: 4 letters, a "0", followed by 6 alphanumeric characters (e.g. HDFC0000123).' };
  }
  return { valid: true };
}

/**
 * Validates the complete UPI payment parameter set.
 */
export function validateUpiParameters(params: UpiPaymentParams): UpiValidationResult {
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};

  const upiCheck = validateUpiId(params.upiId);
  if (!upiCheck.valid && upiCheck.error) errors.upiId = upiCheck.error;

  const nameCheck = validatePayeeName(params.payeeName);
  if (!nameCheck.valid && nameCheck.error) errors.payeeName = nameCheck.error;

  const amountCheck = validateAmount(params.amount || '', params.mode);
  if (!amountCheck.valid && amountCheck.error) errors.amount = amountCheck.error;
  if (amountCheck.warning) warnings.amount = amountCheck.warning;

  if (params.merchantCode) {
    const mcCheck = validateMerchantCode(params.merchantCode);
    if (!mcCheck.valid && mcCheck.error) errors.merchantCode = mcCheck.error;
  }

  if (params.bankDetails?.ifscCode) {
    const ifscCheck = validateIfscCode(params.bankDetails.ifscCode);
    if (!ifscCheck.valid && ifscCheck.error) errors.ifscCode = ifscCheck.error;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  };
}

/**
 * Constructs a compliant UPI Payment URI (`upi://pay?...`).
 *
 * Technical Requirements:
 * - Base format: `upi://pay?pa=PAYEE_UPI_ID&pn=PAYEE_NAME&cu=INR`
 * - In Static UPI QR mode: `am` parameter is strictly omitted so customer enters amount.
 * - In Fixed Amount mode: `am` is formatted to 2 decimals.
 * - Optional parameters (`tn`, `tr`, `mc`) included only when valid.
 * - All parameters properly URL encoded.
 * - ZERO artificial expiration or timestamp tokens inserted.
 */
export function buildUpiUri(params: UpiPaymentParams): string {
  const queryParts: string[] = [];

  // 1. Payee Address (pa) - Mandatory
  const safeUpiId = params.upiId.trim();
  queryParts.push(`pa=${encodeURIComponent(safeUpiId)}`);

  // 2. Payee Name (pn) - Mandatory
  const safePayeeName = params.payeeName.trim();
  queryParts.push(`pn=${encodeURIComponent(safePayeeName)}`);

  // 3. Fixed Amount (am) - Only in Fixed Amount mode
  if (params.mode === 'fixed' && params.amount) {
    const num = Number(params.amount.trim());
    if (!isNaN(num) && num > 0) {
      queryParts.push(`am=${num.toFixed(2)}`);
    }
  }

  // 4. Currency (cu) - Mandatory INR
  queryParts.push('cu=INR');

  // 5. Transaction Note / Description (tn) - Optional
  if (params.paymentNote && params.paymentNote.trim()) {
    queryParts.push(`tn=${encodeURIComponent(params.paymentNote.trim())}`);
  }

  // 6. Transaction Reference (tr) - Optional
  if (params.transactionRef && params.transactionRef.trim()) {
    queryParts.push(`tr=${encodeURIComponent(params.transactionRef.trim())}`);
  }

  // 7. Merchant Category Code (mc) - Optional
  if (params.merchantCode && params.merchantCode.trim()) {
    queryParts.push(`mc=${encodeURIComponent(params.merchantCode.trim())}`);
  }

  return `upi://pay?${queryParts.join('&')}`;
}

/**
 * Parses a UPI Payment URI into a structured key-value map.
 */
export function parseUpiUri(uri: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!uri.startsWith('upi://pay?')) return result;

  const queryString = uri.slice('upi://pay?'.length);
  const pairs = queryString.split('&');
  for (const pair of pairs) {
    const [key, val] = pair.split('=');
    if (key && val !== undefined) {
      result[key] = decodeURIComponent(val);
    }
  }
  return result;
}

/**
 * Decodes the rendered QR code on the canvas using jsQR and verifies
 * that all UPI payment parameters match the expected URI.
 */
export function verifyUpiQrCode(
  canvas: HTMLCanvasElement,
  expectedUri: string
): UpiVerificationResult {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return {
        isVerified: false,
        decodedUri: null,
        matchesExpected: false,
        preservedParams: {
          hasPayeeName: false,
          hasUpiId: false,
          hasCurrency: false,
          amountMatches: false,
          noteMatches: false
        },
        message: 'Could not acquire canvas 2D rendering context.'
      };
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code || !code.data) {
      return {
        isVerified: false,
        decodedUri: null,
        matchesExpected: false,
        preservedParams: {
          hasPayeeName: false,
          hasUpiId: false,
          hasCurrency: false,
          amountMatches: false,
          noteMatches: false
        },
        message: 'QR code could not be decoded. Reduce center logo size or adjust contrast.'
      };
    }

    const decoded = code.data.trim();
    const expected = expectedUri.trim();
    const matchesExpected = decoded === expected;

    const parsedDecoded = parseUpiUri(decoded);
    const parsedExpected = parseUpiUri(expected);

    const hasPayeeName = Boolean(parsedDecoded.pn && parsedDecoded.pn === parsedExpected.pn);
    const hasUpiId = Boolean(parsedDecoded.pa && parsedDecoded.pa.toLowerCase() === parsedExpected.pa?.toLowerCase());
    const hasCurrency = parsedDecoded.cu === 'INR';
    const amountMatches = parsedExpected.am ? parsedDecoded.am === parsedExpected.am : !parsedDecoded.am;
    const noteMatches = parsedExpected.tn ? parsedDecoded.tn === parsedExpected.tn : true;

    const isVerified = hasPayeeName && hasUpiId && hasCurrency && amountMatches && noteMatches;

    return {
      isVerified,
      decodedUri: decoded,
      matchesExpected,
      preservedParams: {
        hasPayeeName,
        hasUpiId,
        hasCurrency,
        amountMatches,
        noteMatches
      },
      message: isVerified
        ? 'Verified Interoperable UPI QR code. Decoded data matches payment specifications.'
        : 'Verification warning: Decoded URI differs from generated payment specifications.'
    };
  } catch (err) {
    return {
      isVerified: false,
      decodedUri: null,
      matchesExpected: false,
      preservedParams: {
        hasPayeeName: false,
        hasUpiId: false,
        hasCurrency: false,
        amountMatches: false,
        noteMatches: false
      },
      message: 'Failed to verify QR code.'
    };
  }
}

/**
 * Generates an A4 or Card-sized printable PDF document using pdf-lib.
 * Embeds the high-resolution QR canvas, business header, payment instructions,
 * and optional bank details card.
 */
export async function generateUpiPdfPoster(
  canvas: HTMLCanvasElement,
  params: UpiPaymentParams,
  preset: UpiLayoutPreset
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // A4 dimensions: 595.28 x 841.89 points
  // Card dimensions: 360 x 540 points
  const isPoster = preset === 'poster' || preset === 'shop' || preset === 'business';
  const pageWidth = isPoster ? 595.28 : 380;
  const pageHeight = isPoster ? 841.89 : 560;

  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Convert canvas to PNG bytes
  const dataUrl = canvas.toDataURL('image/png');
  const pngBase64 = dataUrl.split(',')[1];
  const pngBytes = Uint8Array.from(atob(pngBase64), c => c.charCodeAt(0));
  const qrImage = await pdfDoc.embedPng(pngBytes);

  const primaryEmerald = rgb(0.063, 0.725, 0.506); // #10B981
  const darkNavy = rgb(0.059, 0.090, 0.165); // #0F172A
  const slateMuted = rgb(0.4, 0.45, 0.55);
  const white = rgb(1, 1, 1);
  const lightBg = rgb(0.97, 0.98, 0.99);

  // Top header background
  const headerHeight = isPoster ? 130 : 90;
  page.drawRectangle({
    x: 0,
    y: pageHeight - headerHeight,
    width: pageWidth,
    height: headerHeight,
    color: darkNavy
  });

  // Emerald accent strip
  page.drawRectangle({
    x: 0,
    y: pageHeight - headerHeight - 4,
    width: pageWidth,
    height: 4,
    color: primaryEmerald
  });

  // Title / Business Name
  const displayTitle = params.businessName?.trim() || params.payeeName.trim() || 'UPI Payment';
  page.drawText(displayTitle, {
    x: 40,
    y: pageHeight - (isPoster ? 55 : 40),
    size: isPoster ? 24 : 18,
    font: fontBold,
    color: white
  });

  // Subtitle / Instruction
  const subtitle = params.paymentInstruction?.trim() || 'Scan & Pay with Any UPI App (BHIM, Google Pay, PhonePe, Paytm)';
  page.drawText(subtitle, {
    x: 40,
    y: pageHeight - (isPoster ? 85 : 65),
    size: isPoster ? 12 : 10,
    font: fontRegular,
    color: primaryEmerald
  });

  // QR Code positioning
  const qrSize = isPoster ? 260 : 200;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = pageHeight - headerHeight - qrSize - (isPoster ? 40 : 25);

  // Background frame for QR
  page.drawRectangle({
    x: qrX - 15,
    y: qrY - 15,
    width: qrSize + 30,
    height: qrSize + 30,
    color: white,
    borderColor: rgb(0.88, 0.9, 0.94),
    borderWidth: 2
  });

  page.drawImage(qrImage, {
    x: qrX,
    y: qrY,
    width: qrSize,
    height: qrSize
  });

  // Payee Information Below QR
  let currentY = qrY - (isPoster ? 35 : 25);

  // Payee Name
  page.drawText(params.payeeName.trim(), {
    x: 40,
    y: currentY,
    size: isPoster ? 18 : 14,
    font: fontBold,
    color: darkNavy
  });

  // UPI ID (VPA) with highlight
  currentY -= (isPoster ? 25 : 20);
  page.drawText(`UPI ID: ${params.upiId.trim()}`, {
    x: 40,
    y: currentY,
    size: isPoster ? 14 : 11,
    font: fontBold,
    color: primaryEmerald
  });

  // Fixed Amount badge (if applicable)
  if (params.mode === 'fixed' && params.amount) {
    currentY -= (isPoster ? 22 : 18);
    page.drawText(`Amount: INR ${Number(params.amount).toFixed(2)}`, {
      x: 40,
      y: currentY,
      size: isPoster ? 13 : 10,
      font: fontBold,
      color: darkNavy
    });
  }

  // Payment note (if applicable)
  if (params.paymentNote) {
    currentY -= (isPoster ? 20 : 16);
    page.drawText(`Note: ${params.paymentNote.trim()}`, {
      x: 40,
      y: currentY,
      size: isPoster ? 11 : 9,
      font: fontRegular,
      color: slateMuted
    });
  }

  // Optional Bank Details Box for Posters
  if (isPoster && params.bankDetails && (params.bankDetails.accountNumber || params.bankDetails.bankName)) {
    const boxY = 80;
    const boxHeight = 110;
    page.drawRectangle({
      x: 40,
      y: boxY,
      width: pageWidth - 80,
      height: boxHeight,
      color: lightBg,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1
    });

    page.drawText('Direct Bank Transfer (NEFT / RTGS / IMPS)', {
      x: 55,
      y: boxY + boxHeight - 22,
      size: 11,
      font: fontBold,
      color: darkNavy
    });

    const b = params.bankDetails;
    let detailY = boxY + boxHeight - 42;
    if (b.accountHolderName) {
      page.drawText(`A/C Holder: ${b.accountHolderName}`, { x: 55, y: detailY, size: 9, font: fontRegular, color: darkNavy });
    }
    if (b.bankName) {
      page.drawText(`Bank: ${b.bankName}`, { x: 300, y: detailY, size: 9, font: fontRegular, color: darkNavy });
    }
    detailY -= 16;
    if (b.accountNumber) {
      page.drawText(`Account No: ${b.accountNumber}`, { x: 55, y: detailY, size: 9, font: fontBold, color: darkNavy });
    }
    if (b.ifscCode) {
      page.drawText(`IFSC Code: ${b.ifscCode}`, { x: 300, y: detailY, size: 9, font: fontBold, color: primaryEmerald });
    }
    detailY -= 16;
    if (b.branchName) {
      page.drawText(`Branch: ${b.branchName}`, { x: 55, y: detailY, size: 9, font: fontRegular, color: slateMuted });
    }
  }

  // Footer note
  page.drawText('Generated with LifeTools (https://lifetools.app) - 100% Client-Side & Private', {
    x: 40,
    y: 25,
    size: 8,
    font: fontRegular,
    color: slateMuted
  });

  return await pdfDoc.save();
}
