import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../context/ToastContext';
import { UrlQrGenerator } from '../components/tools/generators/UrlQrGenerator';
import {
  validateLogoFile,
  generateQrSvg,
  drawRoundedRectPath,
  validateQrScannability,
  QrLogoOptions
} from '../utils/qrLogoRenderer';

describe('Custom Logo QR Code Generator Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock HTMLCanvasElement for jsdom environment
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
      putImageData: vi.fn(),
      createImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      quadraticCurveTo: vi.fn(),
      clip: vi.fn(),
      strokeRect: vi.fn(),
      rect: vi.fn()
    }) as any;

    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock');
  });

  describe('1. File Type & Size Validation (validateLogoFile)', () => {
    it('accepts valid PNG, JPG, JPEG, and WebP files within 5MB', () => {
      const pngFile = new File(['dummy png data'], 'brand-logo.png', { type: 'image/png' });
      const jpgFile = new File(['dummy jpg data'], 'company.jpg', { type: 'image/jpeg' });
      const jpegFile = new File(['dummy jpeg data'], 'avatar.jpeg', { type: 'image/jpeg' });
      const webpFile = new File(['dummy webp data'], 'icon.webp', { type: 'image/webp' });

      expect(validateLogoFile(pngFile).valid).toBe(true);
      expect(validateLogoFile(jpgFile).valid).toBe(true);
      expect(validateLogoFile(jpegFile).valid).toBe(true);
      expect(validateLogoFile(webpFile).valid).toBe(true);
    });

    it('rejects unsupported file formats like GIF, PDF, SVG, and TXT', () => {
      const gifFile = new File(['dummy gif data'], 'animation.gif', { type: 'image/gif' });
      const pdfFile = new File(['dummy pdf'], 'doc.pdf', { type: 'application/pdf' });
      const txtFile = new File(['text'], 'notes.txt', { type: 'text/plain' });

      const gifResult = validateLogoFile(gifFile);
      expect(gifResult.valid).toBe(false);
      expect(gifResult.error).toContain('Unsupported image format');

      const pdfResult = validateLogoFile(pdfFile);
      expect(pdfResult.valid).toBe(false);

      const txtResult = validateLogoFile(txtFile);
      expect(txtResult.valid).toBe(false);
    });

    it('rejects files exceeding the 5MB maximum size limit', () => {
      // 5MB + 1 byte
      const oversizedBytes = new Uint8Array(5 * 1024 * 1024 + 1);
      const largeFile = new File([oversizedBytes], 'huge-logo.png', { type: 'image/png' });

      const result = validateLogoFile(largeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File is too large');
    });

    it('accepts transparent PNG files with proper extension', () => {
      const transparentPng = new File(['transparent-bytes'], 'transparent-mark.png', { type: 'image/png' });
      const res = validateLogoFile(transparentPng);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });
  });

  describe('2. Vector SVG QR Generation with Embedded Logo (generateQrSvg)', () => {
    const baseOptions: QrLogoOptions = {
      url: 'https://lifetools.app/workspace',
      width: 512,
      margin: 2,
      foregroundColor: '#0F172A',
      backgroundColor: '#FFFFFF',
      errorCorrectionLevel: 'H',
      hasLogo: false,
      logoImage: null,
      logoDataUrl: null,
      logoSizePercent: 20,
      logoShape: 'rounded',
      logoBackground: '#FFFFFF',
      logoPadding: 4,
      hasBorder: false,
      borderColor: '#0F172A',
      borderThickness: 2
    };

    it('generates clean base vector SVG without logo', async () => {
      const svg = await generateQrSvg(baseOptions);
      expect(svg).toContain('<svg');
      expect(svg).toContain('viewBox=');
      expect(svg).toContain('</svg>');
      expect(svg).not.toContain('id="qr-custom-logo"');
    });

    it('embeds center logo group with data URL in SVG when hasLogo is true', async () => {
      const dummyDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const svg = await generateQrSvg({
        ...baseOptions,
        hasLogo: true,
        logoDataUrl: dummyDataUrl,
        logoShape: 'rounded',
        logoBackground: '#FFFFFF'
      });

      expect(svg).toContain('id="qr-custom-logo"');
      expect(svg).toContain('<clipPath');
      expect(svg).toContain('<image href="data:image/png;base64');
      expect(svg).toContain('preserveAspectRatio="xMidYMid meet"');
    });

    it('supports circular logo shapes and border definitions in SVG export', async () => {
      const dummyDataUrl = 'data:image/png;base64,sample';
      const svg = await generateQrSvg({
        ...baseOptions,
        hasLogo: true,
        logoDataUrl: dummyDataUrl,
        logoShape: 'circle',
        hasBorder: true,
        borderColor: '#10B981',
        borderThickness: 4
      });

      expect(svg).toContain('<circle');
      expect(svg).toContain('stroke="#10B981"');
    });

    it('supports square logo shape and transparent background in SVG', async () => {
      const dummyDataUrl = 'data:image/png;base64,sample';
      const svg = await generateQrSvg({
        ...baseOptions,
        hasLogo: true,
        logoDataUrl: dummyDataUrl,
        logoShape: 'square',
        logoBackground: 'transparent'
      });

      expect(svg).toContain('id="qr-custom-logo"');
      expect(svg).not.toContain('fill="transparent"');
    });

    it('handles long URLs in SVG generation without failing', async () => {
      const longUrl = 'https://example.com/search?query=lifetools&category=utilities&subcategory=generators&filter=qr&sort=popular&view=grid&session=abcdef1234567890abcdef1234567890';
      const svg = await generateQrSvg({
        ...baseOptions,
        url: longUrl
      });
      expect(svg).toContain('<svg');
      expect(svg.length).toBeGreaterThan(500);
    });
  });

  describe('3. Canvas Geometry & Math', () => {
    it('draws rounded rect paths without exceptions', () => {
      const mockCtx: any = {
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        closePath: vi.fn()
      };

      expect(() => drawRoundedRectPath(mockCtx, 10, 10, 100, 100, 20)).not.toThrow();
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.quadraticCurveTo).toHaveBeenCalledTimes(4);
      expect(mockCtx.closePath).toHaveBeenCalled();
    });

    it('clamps corner radius safely when radius exceeds half width', () => {
      const mockCtx: any = {
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        closePath: vi.fn()
      };

      // 100x100 box, radius 80 should be clamped to 50
      expect(() => drawRoundedRectPath(mockCtx, 0, 0, 100, 100, 80)).not.toThrow();
      expect(mockCtx.moveTo).toHaveBeenCalledWith(50, 0);
    });
  });

  describe('4. QR Scannability Verification (validateQrScannability)', () => {
    it('returns isScannable: false gracefully when canvas context is unavailable', () => {
      const dummyCanvas = document.createElement('canvas');
      vi.spyOn(dummyCanvas, 'getContext').mockReturnValue(null);

      const result = validateQrScannability(dummyCanvas, 'https://lifetools.app');
      expect(result.isScannable).toBe(false);
      expect(result.decodedData).toBeNull();
    });
  });

  describe('5. React UI Integration (UrlQrGenerator Component)', () => {
    it('renders URL input, preview section, and upload dropzone by default', () => {
      render(
        <ToastProvider>
          <UrlQrGenerator />
        </ToastProvider>
      );

      // Section headings & labels
      expect(screen.getByLabelText(/Target Website URL/i)).toBeInTheDocument();
      expect(screen.getByText('Customize with Your Logo')).toBeInTheDocument();
      expect(screen.getByText('QR Appearance & Colors')).toBeInTheDocument();
      expect(screen.getByText('Live QR Code Preview')).toBeInTheDocument();
      expect(screen.getByText(/Click to upload or drag and drop your logo/i)).toBeInTheDocument();

      // Download buttons
      expect(screen.getByRole('button', { name: /Download Standard PNG/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Download High-Res PNG/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Download Vector SVG/i })).toBeInTheDocument();
    });

    it('allows changing target URL and displays quick protocol triggers', () => {
      render(
        <ToastProvider>
          <UrlQrGenerator />
        </ToastProvider>
      );

      const input = screen.getByLabelText(/Target Website URL/i) as HTMLInputElement;
      expect(input.value).toBe('https://lifetools.app');

      fireEvent.change(input, { target: { value: 'https://github.com/officialhazim42' } });
      expect(input.value).toBe('https://github.com/officialhazim42');

      // Click Clear button
      const clearBtn = screen.getByRole('button', { name: 'Clear' });
      fireEvent.click(clearBtn);
      expect(input.value).toBe('');

      // Click https:// trigger
      const httpsBtn = screen.getByRole('button', { name: 'https://' });
      fireEvent.click(httpsBtn);
      expect(input.value).toBe('https://');
    });

    it('shows tip warning when URL is empty or missing protocol', () => {
      render(
        <ToastProvider>
          <UrlQrGenerator />
        </ToastProvider>
      );

      const input = screen.getByLabelText(/Target Website URL/i);

      fireEvent.change(input, { target: { value: '' } });
      expect(screen.getByText('URL cannot be empty.')).toBeInTheDocument();

      fireEvent.change(input, { target: { value: 'example.com' } });
      expect(screen.getByText(/Tip: URLs starting with https:\/\/ are automatically clickable/i)).toBeInTheDocument();
    });

    it('switches preview sizes when clicking preview dimension buttons', () => {
      render(
        <ToastProvider>
          <UrlQrGenerator />
        </ToastProvider>
      );

      const btn256 = screen.getByRole('button', { name: '256px' });
      fireEvent.click(btn256);
      expect(screen.getByText('256×256px')).toBeInTheDocument();

      const btn512 = screen.getByRole('button', { name: '512px' });
      fireEvent.click(btn512);
      expect(screen.getByText('512×512px')).toBeInTheDocument();
    });

    it('resets all customizations when clicking Reset All Customizations', () => {
      render(
        <ToastProvider>
          <UrlQrGenerator />
        </ToastProvider>
      );

      const input = screen.getByLabelText(/Target Website URL/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'https://mycustomsite.org' } });
      expect(input.value).toBe('https://mycustomsite.org');

      const resetBtn = screen.getByRole('button', { name: /Reset All Customizations/i });
      fireEvent.click(resetBtn);

      expect(input.value).toBe('https://lifetools.app');
    });

    it('renders physical scan verification advisory text', () => {
      render(
        <ToastProvider>
          <UrlQrGenerator />
        </ToastProvider>
      );

      expect(screen.getByText('Physical Scan Verification Advisory')).toBeInTheDocument();
      expect(screen.getByText(/While High Error Correction \(H\) allows recovery of up to 30%/i)).toBeInTheDocument();
    });

    it('handles simulated logo upload, reveals styling controls, and supports removal', async () => {
      // Mock FileReader to immediately invoke onload
      const originalFileReader = window.FileReader;
      class MockFileReader {
        onload: any = null;
        readAsDataURL() {
          setTimeout(() => {
            if (this.onload) {
              this.onload({
                target: {
                  result: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
                }
              });
            }
          }, 0);
        }
      }
      window.FileReader = MockFileReader as any;

      // Mock Image to immediately trigger onload
      const originalImage = window.Image;
      class MockImage {
        naturalWidth = 120;
        naturalHeight = 120;
        onload: any = null;
        src = '';
        constructor() {
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }
      }
      window.Image = MockImage as any;

      try {
        const { container } = render(
          <ToastProvider>
            <UrlQrGenerator />
          </ToastProvider>
        );

        const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput).toBeInTheDocument();

        const testLogo = new File(['fake-png-content'], 'acme-corp.png', { type: 'image/png' });
        fireEvent.change(fileInput, { target: { files: [testLogo] } });

        // Wait for logo controls to appear
        await waitFor(() => {
          expect(screen.getByText('acme-corp.png')).toBeInTheDocument();
        });

        expect(screen.getByText('Logo Styling Controls')).toBeInTheDocument();
        expect(screen.getByText('Ready & Centered')).toBeInTheDocument();
        expect(screen.getByText(/Logo Size/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Small (15%)' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Large (25%)' })).toBeInTheDocument();

        // Switch to Small preset
        fireEvent.click(screen.getByRole('button', { name: 'Small (15%)' }));
        expect(screen.getByText('15%')).toBeInTheDocument();

        // Switch to Circle shape
        const circleBtn = screen.getByRole('button', { name: 'Circle' });
        fireEvent.click(circleBtn);

        // Click Remove logo
        const removeBtn = screen.getByTitle('Remove logo');
        fireEvent.click(removeBtn);

        // Styling controls should disappear, dropzone returns
        await waitFor(() => {
          expect(screen.queryByText('Logo Styling Controls')).not.toBeInTheDocument();
          expect(screen.getByText(/Click to upload or drag and drop your logo/i)).toBeInTheDocument();
        });
      } finally {
        window.FileReader = originalFileReader;
        window.Image = originalImage;
      }
    });
  });
});
