import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../context/ToastContext';
import { UpiQrGenerator } from '../components/tools/generators/UpiQrGenerator';
import { QrCodeGenerator } from '../components/tools/developer/QrCodeGenerator';
import {
  validateUpiId,
  validatePayeeName,
  validateAmount,
  validateMerchantCode,
  validateIfscCode,
  buildUpiUri,
  parseUpiUri,
  verifyUpiQrCode,
  generateUpiPdfPoster,
  UpiPaymentParams
} from '../utils/upiQrUtils';

describe('UPI Payment QR Generator Test Suite', () => {
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

    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  });

  // 1. UPI ID Validation Tests
  describe('1. UPI ID Syntax Validation (validateUpiId)', () => {
    it('accepts compliant UPI IDs across diverse bank handles', () => {
      const validIds = [
        'johndoe@okaxis',
        'shop.retail@okhdfcbank',
        '9876543210@ybl',
        'merchant-services@paytm',
        'user_name@upi',
        'store123@icici',
        'donation@sbi'
      ];
      validIds.forEach(id => {
        const res = validateUpiId(id);
        expect(res.valid).toBe(true);
        expect(res.error).toBeUndefined();
      });
    });

    it('rejects malformed, empty, or spaced UPI IDs with clear diagnostic feedback', () => {
      expect(validateUpiId('').valid).toBe(false);
      expect(validateUpiId('   ').valid).toBe(false);
      expect(validateUpiId('john doe@okaxis').valid).toBe(false);
      expect(validateUpiId('johndoe').valid).toBe(false);
      expect(validateUpiId('@okhdfcbank').valid).toBe(false);
      expect(validateUpiId('user@').valid).toBe(false);
    });
  });

  // 2. Payee Name & Parameter Validation Tests
  describe('2. Payee Name & Parameter Validation', () => {
    it('validates payee name non-empty and length bounds', () => {
      expect(validatePayeeName('Aisha Sharma').valid).toBe(true);
      expect(validatePayeeName('Apex Hardware & General Store').valid).toBe(true);
      expect(validatePayeeName('').valid).toBe(false);
      expect(validatePayeeName('   ').valid).toBe(false);
      expect(validatePayeeName('a'.repeat(100)).valid).toBe(false);
    });

    it('validates Merchant Category Code (MCC) when provided', () => {
      expect(validateMerchantCode('5411').valid).toBe(true);
      expect(validateMerchantCode('5812').valid).toBe(true);
      expect(validateMerchantCode('').valid).toBe(true); // Optional
      expect(validateMerchantCode('123').valid).toBe(false);
      expect(validateMerchantCode('abc').valid).toBe(false);
      expect(validateMerchantCode('12345').valid).toBe(false);
    });

    it('validates IFSC code format when bank details are provided', () => {
      expect(validateIfscCode('HDFC0000123').valid).toBe(true);
      expect(validateIfscCode('SBIN0001234').valid).toBe(true);
      expect(validateIfscCode('').valid).toBe(true); // Optional
      expect(validateIfscCode('HDFC123').valid).toBe(false);
      expect(validateIfscCode('INVALID_IFSC').valid).toBe(false);
    });
  });

  // 3. Amount Validation Tests
  describe('3. Payment Amount Validation (validateAmount)', () => {
    it('bypasses amount requirement in Static UPI QR mode', () => {
      expect(validateAmount('', 'static').valid).toBe(true);
      expect(validateAmount('500', 'static').valid).toBe(true);
    });

    it('enforces valid positive currency values in Fixed Amount mode', () => {
      expect(validateAmount('500', 'fixed').valid).toBe(true);
      expect(validateAmount('500.00', 'fixed').valid).toBe(true);
      expect(validateAmount('1250.50', 'fixed').valid).toBe(true);
      expect(validateAmount('0.50', 'fixed').valid).toBe(true);

      // Invalid
      expect(validateAmount('', 'fixed').valid).toBe(false);
      expect(validateAmount('0', 'fixed').valid).toBe(false);
      expect(validateAmount('-100', 'fixed').valid).toBe(false);
      expect(validateAmount('abc', 'fixed').valid).toBe(false);
      expect(validateAmount('50.123', 'fixed').valid).toBe(false); // More than 2 decimal places
      expect(validateAmount('600000', 'fixed').valid).toBe(false); // Exceeds NPCI limit
    });

    it('provides warning for amounts exceeding typical P2P ₹1,00,000 threshold', () => {
      const res = validateAmount('150000', 'fixed');
      expect(res.valid).toBe(true);
      expect(res.warning).toBeDefined();
    });
  });

  // 4. URI Generation & Compliance Tests
  describe('4. Interoperable UPI URI Generation (buildUpiUri)', () => {
    it('generates standard Reusable Static UPI URI without amount and without expiration tokens', () => {
      const params: UpiPaymentParams = {
        payeeName: 'John Doe',
        upiId: 'johndoe@okaxis',
        mode: 'static',
        currency: 'INR'
      };
      const uri = buildUpiUri(params);

      expect(uri).toBe('upi://pay?pa=johndoe%40okaxis&pn=John%20Doe&cu=INR');
      expect(uri).not.toContain('&am=');
      expect(uri).not.toContain('exp=');
      expect(uri).not.toContain('expiry');
      expect(uri).not.toContain('token');
    });

    it('generates Fixed Amount UPI URI with formatted amount parameter', () => {
      const params: UpiPaymentParams = {
        payeeName: 'Shop Store',
        upiId: 'shop@okhdfcbank',
        mode: 'fixed',
        amount: '450',
        currency: 'INR'
      };
      const uri = buildUpiUri(params);

      expect(uri).toBe('upi://pay?pa=shop%40okhdfcbank&pn=Shop%20Store&am=450.00&cu=INR');
      expect(uri).toContain('am=450.00');
    });

    it('properly URL-encodes special characters in payee name and optional payment notes', () => {
      const params: UpiPaymentParams = {
        payeeName: 'Smith & Sons / Grocery',
        upiId: 'smith@ybl',
        mode: 'static',
        currency: 'INR',
        paymentNote: 'Order #42 & Invoice',
        transactionRef: 'TXN-9981',
        merchantCode: '5411'
      };
      const uri = buildUpiUri(params);

      expect(uri).toContain('pn=Smith%20%26%20Sons%20%2F%20Grocery');
      expect(uri).toContain('tn=Order%20%2342%20%26%20Invoice');
      expect(uri).toContain('tr=TXN-9981');
      expect(uri).toContain('mc=5411');
      expect(uri).not.toContain(' ');
    });

    it('keeps informational bank details separate from the UPI URI to prevent interoperability breakage', () => {
      const params: UpiPaymentParams = {
        payeeName: 'Corporate Services',
        upiId: 'corp@icici',
        mode: 'static',
        currency: 'INR',
        bankDetails: {
          accountHolderName: 'Corporate Services Pvt Ltd',
          bankName: 'ICICI Bank',
          accountNumber: '998877665544',
          ifscCode: 'ICIC0001234',
          branchName: 'Connaught Place'
        }
      };
      const uri = buildUpiUri(params);

      // The UPI URI must remain strictly clean and compliant
      expect(uri).toBe('upi://pay?pa=corp%40icici&pn=Corporate%20Services&cu=INR');
      expect(uri).not.toContain('998877665544');
      expect(uri).not.toContain('ICIC0001234');
    });
  });

  // 5. URI Parsing Tests
  describe('5. UPI URI Parsing (parseUpiUri)', () => {
    it('parses compliant UPI query parameters accurately', () => {
      const uri = 'upi://pay?pa=merchant%40okhdfcbank&pn=Super%20Mart&am=1299.50&cu=INR&tn=Invoice%20101';
      const parsed = parseUpiUri(uri);

      expect(parsed.pa).toBe('merchant@okhdfcbank');
      expect(parsed.pn).toBe('Super Mart');
      expect(parsed.am).toBe('1299.50');
      expect(parsed.cu).toBe('INR');
      expect(parsed.tn).toBe('Invoice 101');
    });
  });

  // 6. PDF Generation Test
  describe('6. PDF Poster Generation (generateUpiPdfPoster)', () => {
    it('successfully generates non-empty PDF document bytes', async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;

      const params: UpiPaymentParams = {
        payeeName: 'Retail Merchant Store',
        upiId: 'merchant@okhdfcbank',
        mode: 'static',
        currency: 'INR',
        businessName: 'Retail Digital Services',
        paymentInstruction: 'Scan & Pay with Any UPI App'
      };

      const pdfBytes = await generateUpiPdfPoster(canvas, params, 'poster');
      expect(pdfBytes).toBeInstanceOf(Uint8Array);
      expect(pdfBytes.length).toBeGreaterThan(1000);
    });
  });

  // 7. React UI Integration Tests (UpiQrGenerator)
  describe('7. React UI Integration (UpiQrGenerator Component)', () => {
    const renderWithContext = (ui: React.ReactElement) => {
      return render(<ToastProvider>{ui}</ToastProvider>);
    };

    it('renders with default Static UPI QR mode and reusable notice', () => {
      renderWithContext(<UpiQrGenerator />);

      expect(screen.getByText(/Reusable Static UPI Payment QR/i)).toBeInTheDocument();
      expect(screen.getByText(/without an application-defined expiry/i)).toBeInTheDocument();
      expect(screen.getByText(/Static UPI QR \(Default\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Fixed Amount QR/i)).toBeInTheDocument();
    });

    it('toggles to Fixed Amount mode and displays amount input', () => {
      renderWithContext(<UpiQrGenerator />);

      const fixedModeBtn = screen.getByText(/Fixed Amount QR/i);
      fireEvent.click(fixedModeBtn);

      expect(screen.getByText(/Fixed Payment Amount \(INR ₹\)/i)).toBeInTheDocument();
    });

    it('supports quick UPI handle append buttons', () => {
      renderWithContext(<UpiQrGenerator />);

      const yblBtn = screen.getByText('@ybl');
      fireEvent.click(yblBtn);

      const upiInput = screen.getByPlaceholderText(/merchant@okhdfcbank/i) as HTMLInputElement;
      expect(upiInput.value).toContain('@ybl');
    });

    it('supports switching layout presets seamlessly', () => {
      renderWithContext(<UpiQrGenerator />);

      expect(screen.getByText('Shop Standee')).toBeInTheDocument();
      expect(screen.getByText('Minimal QR')).toBeInTheDocument();
      expect(screen.getByText('Business Pro')).toBeInTheDocument();
      expect(screen.getByText('A4 Poster')).toBeInTheDocument();
      expect(screen.getByText('Payment Card')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Minimal QR'));
      fireEvent.click(screen.getByText('Payment Card'));
    });

    it('displays Interoperability Verification badge', () => {
      renderWithContext(<UpiQrGenerator />);

      expect(screen.getByText(/Interoperability Verification/i)).toBeInTheDocument();
      expect(screen.getByText(/Zero Expiry Tokens/i)).toBeInTheDocument();
      expect(screen.getByText(/Currency: INR \(cu\)/i)).toBeInTheDocument();
    });

    it('renders download and export buttons', () => {
      renderWithContext(<UpiQrGenerator />);

      expect(screen.getByText(/Download PNG/i)).toBeInTheDocument();
      expect(screen.getByText(/High-Res PNG \(2048px\)/i)).toBeInTheDocument();
      expect(screen.getByText(/SVG/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF Poster/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Print/i })).toBeInTheDocument();
      expect(screen.getByText(/Copy UPI URI/i)).toBeInTheDocument();
    });
  });

  // 8. QrCodeGenerator Integration Test
  describe('8. Mode Switcher inside Developer QrCodeGenerator', () => {
    const renderWithContext = (ui: React.ReactElement) => {
      return render(<ToastProvider>{ui}</ToastProvider>);
    };

    it('renders mode switch tabs and switches into UPI Payment QR mode', () => {
      renderWithContext(<QrCodeGenerator />);

      expect(screen.getByText(/Standard Text \/ URL QR/i)).toBeInTheDocument();
      expect(screen.getByText(/UPI Payment QR/i)).toBeInTheDocument();

      // Click UPI Payment QR mode tab
      fireEvent.click(screen.getByText(/UPI Payment QR/i));

      // Should render UPI interface
      expect(screen.getByText(/Reusable Static UPI Payment QR/i)).toBeInTheDocument();
      expect(screen.getByText(/Recipient UPI ID \(VPA\)/i)).toBeInTheDocument();

      // Switch back to standard mode
      fireEvent.click(screen.getByText(/Standard Text \/ URL QR/i));
      expect(screen.getByText(/Text or URL Content/i)).toBeInTheDocument();
    });
  });
});
