import QRCode from 'qrcode';
import jsQR from 'jsqr';

export type LogoShape = 'square' | 'rounded' | 'circle';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrLogoOptions {
  url: string;
  width: number;
  margin: number;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  // Logo configuration
  hasLogo: boolean;
  logoImage?: CanvasImageSource | null;
  logoDataUrl?: string | null;
  logoSizePercent: number; // 10 to 30
  logoShape: LogoShape;
  logoBackground: string; // 'transparent', '#FFFFFF', or hex
  logoPadding: number; // 0 to 20 px at 512 scale
  hasBorder: boolean;
  borderColor: string;
  borderThickness: number; // 1 to 10 px at 512 scale
}

export interface LogoValidationResult {
  valid: boolean;
  error?: string;
}

export interface ScanValidationResult {
  isScannable: boolean;
  decodedData: string | null;
}

/**
 * Validates an uploaded logo file for supported MIME types and size limit (5MB max).
 */
export function validateLogoFile(file: File): LogoValidationResult {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

  if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: 'Unsupported image format. Please upload a PNG, JPG, JPEG, or WebP file.'
    };
  }

  // 5MB maximum file size
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`
    };
  }

  return { valid: true };
}

/**
 * Draws a rounded rectangle path on a 2D canvas context with boundary safety.
 */
export function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const maxRadius = Math.min(w / 2, h / 2);
  const radius = Math.max(0, Math.min(r, maxRadius));

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders the base QR code and embeds the centered logo, background, and borders on canvas.
 */
export async function renderQrToCanvas(
  canvas: HTMLCanvasElement,
  options: QrLogoOptions
): Promise<void> {
  const safeUrl = options.url.trim() || 'https://lifetools.app';

  // 1. Render base QR code onto canvas
  await QRCode.toCanvas(canvas, safeUrl, {
    width: options.width,
    margin: options.margin,
    color: {
      dark: options.foregroundColor,
      light: options.backgroundColor
    },
    errorCorrectionLevel: options.errorCorrectionLevel
  });

  // 2. Overlay Logo if active and image is available
  if (options.hasLogo && options.logoImage) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrWidth = canvas.width;
    const qrHeight = canvas.height;
    const scale = qrWidth / 512;

    // Constrain logo size to safe boundaries (10% to 28% of QR code width)
    const clampedSizePercent = Math.min(28, Math.max(10, options.logoSizePercent));
    const logoBoxSize = Math.round(qrWidth * (clampedSizePercent / 100));
    const centerX = qrWidth / 2;
    const centerY = qrHeight / 2;
    const boxX = Math.round(centerX - logoBoxSize / 2);
    const boxY = Math.round(centerY - logoBoxSize / 2);

    const paddingPx = Math.round(options.logoPadding * scale);
    const borderThicknessPx = options.hasBorder ? Math.max(1, Math.round(options.borderThickness * scale)) : 0;
    const radius = options.logoShape === 'rounded' ? Math.round(logoBoxSize * 0.2) : 0;

    // A. Draw Background Shape
    if (options.logoBackground !== 'transparent') {
      ctx.save();
      ctx.fillStyle = options.logoBackground;
      if (options.logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoBoxSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (options.logoShape === 'rounded') {
        drawRoundedRectPath(ctx, boxX, boxY, logoBoxSize, logoBoxSize, radius);
        ctx.fill();
      } else {
        ctx.fillRect(boxX, boxY, logoBoxSize, logoBoxSize);
      }
      ctx.restore();
    }

    // B. Draw Border
    if (options.hasBorder && borderThicknessPx > 0) {
      ctx.save();
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = borderThicknessPx;
      const inset = borderThicknessPx / 2;

      if (options.logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (logoBoxSize - borderThicknessPx) / 2, 0, Math.PI * 2);
        ctx.stroke();
      } else if (options.logoShape === 'rounded') {
        drawRoundedRectPath(
          ctx,
          boxX + inset,
          boxY + inset,
          logoBoxSize - borderThicknessPx,
          logoBoxSize - borderThicknessPx,
          Math.max(0, radius - inset)
        );
        ctx.stroke();
      } else {
        ctx.strokeRect(
          boxX + inset,
          boxY + inset,
          logoBoxSize - borderThicknessPx,
          logoBoxSize - borderThicknessPx
        );
      }
      ctx.restore();
    }

    // C. Draw and Clip Image with Aspect Ratio Preservation
    const totalInset = borderThicknessPx + paddingPx;
    const innerBoxSize = Math.max(4, logoBoxSize - totalInset * 2);

    // Calculate aspect ratio
    const imgObj = options.logoImage as any;
    const rawW = imgObj.naturalWidth || imgObj.width || innerBoxSize;
    const rawH = imgObj.naturalHeight || imgObj.height || innerBoxSize;
    const imgRatio = rawW / rawH;

    let drawW = innerBoxSize;
    let drawH = innerBoxSize;
    if (imgRatio >= 1) {
      drawH = innerBoxSize / imgRatio;
    } else {
      drawW = innerBoxSize * imgRatio;
    }

    const drawX = centerX - drawW / 2;
    const drawY = centerY - drawH / 2;

    // Clipping path inside the logo shape
    ctx.save();
    const clipInset = borderThicknessPx;
    const clipSize = Math.max(2, logoBoxSize - clipInset * 2);
    const clipX = centerX - clipSize / 2;
    const clipY = centerY - clipSize / 2;
    const clipRadius = options.logoShape === 'rounded' ? Math.max(0, radius - clipInset) : 0;

    if (options.logoShape === 'circle') {
      ctx.beginPath();
      ctx.arc(centerX, centerY, clipSize / 2, 0, Math.PI * 2);
      ctx.clip();
    } else if (options.logoShape === 'rounded') {
      drawRoundedRectPath(ctx, clipX, clipY, clipSize, clipSize, clipRadius);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(clipX, clipY, clipSize, clipSize);
      ctx.clip();
    }

    ctx.drawImage(options.logoImage, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}

/**
 * Validates that the rendered QR code on a canvas can be successfully scanned by jsQR.
 */
export function validateQrScannability(
  canvas: HTMLCanvasElement,
  expectedData: string
): ScanValidationResult {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return { isScannable: false, decodedData: null };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data.trim() === expectedData.trim()) {
      return { isScannable: true, decodedData: code.data };
    }
    return { isScannable: false, decodedData: code?.data || null };
  } catch (err) {
    return { isScannable: false, decodedData: null };
  }
}

/**
 * Generates a clean, standalone, vector SVG string with the QR code and embedded center logo.
 */
export async function generateQrSvg(options: QrLogoOptions): Promise<string> {
  const safeUrl = options.url.trim() || 'https://lifetools.app';

  const baseSvg = await new Promise<string>((resolve, reject) => {
    QRCode.toString(
      safeUrl,
      {
        type: 'svg',
        margin: options.margin,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor
        },
        errorCorrectionLevel: options.errorCorrectionLevel
      },
      (err, str) => {
        if (err) reject(err);
        else resolve(str);
      }
    );
  });

  // If no logo or no data URL, return base SVG
  if (!options.hasLogo || !options.logoDataUrl) {
    return baseSvg;
  }

  // Parse viewBox="0 0 N N"
  const vbMatch = baseSvg.match(/viewBox=["']0 0 (\d+(\.\d+)?) (\d+(\.\d+)?)["']/);
  if (!vbMatch) return baseSvg;

  const totalModules = parseFloat(vbMatch[1]);
  const clampedSizePercent = Math.min(28, Math.max(10, options.logoSizePercent));
  const logoSize = totalModules * (clampedSizePercent / 100);
  const centerX = totalModules / 2;
  const centerY = totalModules / 2;
  const boxX = centerX - logoSize / 2;
  const boxY = centerY - logoSize / 2;

  const scale = totalModules / 512;
  const paddingSvg = options.logoPadding * scale;
  const borderThicknessSvg = options.hasBorder ? Math.max(0.2, options.borderThickness * scale) : 0;
  const radiusSvg = options.logoShape === 'rounded' ? logoSize * 0.2 : 0;

  const clipId = `qr-logo-clip-${Math.random().toString(36).slice(2, 8)}`;

  // Clip shape inside viewBox
  let clipShape = '';
  if (options.logoShape === 'circle') {
    const r = (logoSize - borderThicknessSvg * 2) / 2;
    clipShape = `<circle cx="${centerX}" cy="${centerY}" r="${r}" />`;
  } else if (options.logoShape === 'rounded') {
    const inset = borderThicknessSvg;
    const s = logoSize - inset * 2;
    clipShape = `<rect x="${boxX + inset}" y="${boxY + inset}" width="${s}" height="${s}" rx="${Math.max(0, radiusSvg - inset)}" ry="${Math.max(0, radiusSvg - inset)}" />`;
  } else {
    const inset = borderThicknessSvg;
    clipShape = `<rect x="${boxX + inset}" y="${boxY + inset}" width="${logoSize - inset * 2}" height="${logoSize - inset * 2}" />`;
  }

  // Background shape
  let bgEl = '';
  if (options.logoBackground !== 'transparent') {
    if (options.logoShape === 'circle') {
      bgEl = `<circle cx="${centerX}" cy="${centerY}" r="${logoSize / 2}" fill="${options.logoBackground}" />`;
    } else if (options.logoShape === 'rounded') {
      bgEl = `<rect x="${boxX}" y="${boxY}" width="${logoSize}" height="${logoSize}" rx="${radiusSvg}" ry="${radiusSvg}" fill="${options.logoBackground}" />`;
    } else {
      bgEl = `<rect x="${boxX}" y="${boxY}" width="${logoSize}" height="${logoSize}" fill="${options.logoBackground}" />`;
    }
  }

  // Border element
  let borderEl = '';
  if (options.hasBorder && borderThicknessSvg > 0) {
    const halfB = borderThicknessSvg / 2;
    if (options.logoShape === 'circle') {
      borderEl = `<circle cx="${centerX}" cy="${centerY}" r="${(logoSize - borderThicknessSvg) / 2}" fill="none" stroke="${options.borderColor}" stroke-width="${borderThicknessSvg}" />`;
    } else if (options.logoShape === 'rounded') {
      borderEl = `<rect x="${boxX + halfB}" y="${boxY + halfB}" width="${logoSize - borderThicknessSvg}" height="${logoSize - borderThicknessSvg}" rx="${Math.max(0, radiusSvg - halfB)}" ry="${Math.max(0, radiusSvg - halfB)}" fill="none" stroke="${options.borderColor}" stroke-width="${borderThicknessSvg}" />`;
    } else {
      borderEl = `<rect x="${boxX + halfB}" y="${boxY + halfB}" width="${logoSize - borderThicknessSvg}" height="${logoSize - borderThicknessSvg}" fill="none" stroke="${options.borderColor}" stroke-width="${borderThicknessSvg}" />`;
    }
  }

  // Inner image coordinates
  const totalInset = borderThicknessSvg + paddingSvg;
  const innerSize = Math.max(1, logoSize - totalInset * 2);
  const innerX = centerX - innerSize / 2;
  const innerY = centerY - innerSize / 2;

  const imageEl = `<image href="${options.logoDataUrl}" x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" preserveAspectRatio="xMidYMid meet" clip-path="url(#${clipId})" />`;

  const logoGroup = `
  <g id="qr-custom-logo">
    <defs>
      <clipPath id="${clipId}">
        ${clipShape}
      </clipPath>
    </defs>
    ${bgEl}
    ${imageEl}
    ${borderEl}
  </g>`;

  return baseSvg.replace('</svg>', `${logoGroup}\n</svg>`);
}

/**
 * Creates an off-screen canvas at high resolution (default 2048x2048), renders the QR code with logo,
 * and exports a high-density PNG Blob for print or billboard production.
 */
export async function renderHighResQrBlob(
  options: QrLogoOptions,
  highResWidth = 2048
): Promise<Blob> {
  const offscreen = document.createElement('canvas');
  offscreen.width = highResWidth;
  offscreen.height = highResWidth;

  await renderQrToCanvas(offscreen, {
    ...options,
    width: highResWidth
  });

  return new Promise<Blob>((resolve, reject) => {
    offscreen.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate high-resolution QR PNG Blob'));
    }, 'image/png');
  });
}
