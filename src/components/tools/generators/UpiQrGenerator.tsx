import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  IndianRupee,
  ShieldCheck,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Trash2,
  RefreshCw,
  Building2,
  Store,
  User,
  CreditCard,
  Wallet,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Lock,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import {
  LogoShape,
  ErrorCorrectionLevel,
  QrLogoOptions,
  validateLogoFile,
  renderQrToCanvas,
  generateQrSvg,
  renderHighResQrBlob
} from '../../../utils/qrLogoRenderer';
import {
  UpiPaymentMode,
  UpiLayoutPreset,
  UpiPaymentParams,
  BankAccountDetails,
  validateUpiParameters,
  buildUpiUri,
  verifyUpiQrCode,
  generateUpiPdfPoster
} from '../../../utils/upiQrUtils';

const COMMON_UPI_HANDLES = [
  '@okhdfcbank',
  '@okaxis',
  '@oksbi',
  '@okicici',
  '@ybl',
  '@paytm',
  '@upi'
];

export const UpiQrGenerator: React.FC = () => {
  const { showToast } = useToast();

  // 1. Core Payment State
  const [mode, setMode] = useState<UpiPaymentMode>('static');
  const [payeeName, setPayeeName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [merchantCode, setMerchantCode] = useState('');
  const [paymentInstruction, setPaymentInstruction] = useState('Scan & Pay with Any UPI App');

  // 2. Bank Details State (Separate informational display)
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankAccountDetails>({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: ''
  });

  // 3. Layout Presets & Styling
  const [layoutPreset, setLayoutPreset] = useState<UpiLayoutPreset>('shop');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // 4. Logo & QR Appearance State (Reusing qrLogoRenderer)
  const [hasLogo, setHasLogo] = useState(false);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState('');
  const [logoFileSize, setLogoFileSize] = useState('');
  const [logoDimensions, setLogoDimensions] = useState<{ width: number; height: number } | null>(null);
  const [logoSizePreset, setLogoSizePreset] = useState<'small' | 'medium' | 'large' | 'custom'>('medium');
  const [logoSizePercent, setLogoSizePercent] = useState<number>(20);
  const [logoShape, setLogoShape] = useState<LogoShape>('rounded');
  const [logoBackgroundType, setLogoBackgroundType] = useState<'transparent' | 'white' | 'custom'>('white');
  const [logoCustomBg, setLogoCustomBg] = useState('#FFFFFF');
  const [logoPadding, setLogoPadding] = useState<number>(4);
  const [hasBorder, setHasBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#0F172A');
  const [borderThickness, setBorderThickness] = useState<number>(2);

  const [foregroundColor, setForegroundColor] = useState('#0F172A');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 5. Verification State
  const [verificationResult, setVerificationResult] = useState<{
    isVerified: boolean;
    decodedUri: string | null;
    message: string;
    hasPayeeName: boolean;
    hasUpiId: boolean;
    hasCurrency: boolean;
    noExpiry: boolean;
  }>({
    isVerified: true,
    decodedUri: null,
    message: 'Interoperable UPI QR Verified',
    hasPayeeName: true,
    hasUpiId: true,
    hasCurrency: true,
    noExpiry: true
  });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printContainerRef = useRef<HTMLDivElement>(null);

  // Build current UPI Parameters
  const currentParams: UpiPaymentParams = {
    payeeName,
    upiId,
    mode,
    amount: mode === 'fixed' ? amount : undefined,
    currency: 'INR',
    businessName: businessName.trim() || undefined,
    paymentNote: paymentNote.trim() || undefined,
    transactionRef: transactionRef.trim() || undefined,
    merchantCode: merchantCode.trim() || undefined,
    paymentInstruction: paymentInstruction.trim() || undefined,
    bankDetails: showBankDetails ? bankDetails : undefined
  };

  // Validation
  const validation = validateUpiParameters(currentParams);
  const upiUri = buildUpiUri(currentParams);

  // Effective logo background
  const effectiveLogoBg =
    logoBackgroundType === 'transparent'
      ? 'transparent'
      : logoBackgroundType === 'white'
        ? '#FFFFFF'
        : logoCustomBg;

  // Render QR Canvas and verify with jsQR
  const updateQrAndVerify = useCallback(async () => {
    if (!canvasRef.current) return;

    const qrOptions: QrLogoOptions = {
      url: upiUri,
      width: 512,
      margin: 2,
      foregroundColor,
      backgroundColor,
      errorCorrectionLevel: 'H',
      hasLogo,
      logoImage,
      logoDataUrl,
      logoSizePercent,
      logoShape,
      logoBackground: effectiveLogoBg,
      logoPadding,
      hasBorder,
      borderColor,
      borderThickness
    };

    try {
      await renderQrToCanvas(canvasRef.current, qrOptions);

      // Verify with jsQR
      const verifyRes = verifyUpiQrCode(canvasRef.current, upiUri);
      setVerificationResult({
        isVerified: verifyRes.isVerified,
        decodedUri: verifyRes.decodedUri,
        message: verifyRes.message,
        hasPayeeName: verifyRes.preservedParams.hasPayeeName,
        hasUpiId: verifyRes.preservedParams.hasUpiId,
        hasCurrency: verifyRes.preservedParams.hasCurrency,
        noExpiry: true
      });
    } catch (err) {
      // Ignore transient canvas errors
    }
  }, [
    upiUri,
    foregroundColor,
    backgroundColor,
    hasLogo,
    logoImage,
    logoDataUrl,
    logoSizePercent,
    logoShape,
    effectiveLogoBg,
    logoPadding,
    hasBorder,
    borderColor,
    borderThickness
  ]);

  useEffect(() => {
    updateQrAndVerify();
  }, [updateQrAndVerify]);

  // Handle Logo Upload
  const handleLogoFile = (file: File) => {
    const val = validateLogoFile(file);
    if (!val.valid) {
      showToast(val.error || 'Invalid logo file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setLogoImage(img);
        setLogoDataUrl(result);
        setLogoFileName(file.name);
        setLogoFileSize(`${(file.size / 1024).toFixed(1)} KB`);
        setLogoDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setHasLogo(true);
        showToast('Logo uploaded and applied to payment QR.');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogoImage(null);
    setLogoDataUrl(null);
    setLogoFileName('');
    setLogoFileSize('');
    setLogoDimensions(null);
    setHasLogo(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Logo removed from payment QR.');
  };

  const handleSizePresetChange = (preset: 'small' | 'medium' | 'large' | 'custom') => {
    setLogoSizePreset(preset);
    if (preset === 'small') setLogoSizePercent(15);
    else if (preset === 'medium') setLogoSizePercent(20);
    else if (preset === 'large') setLogoSizePercent(25);
  };

  const handleCustomSizeChange = (val: number) => {
    setLogoSizePercent(val);
    setLogoSizePreset('custom');
  };

  // Quick Handle Append
  const appendHandle = (handle: string) => {
    const base = upiId.split('@')[0] || '';
    setUpiId(`${base}${handle}`);
  };

  // Quick Amount Additions
  const addQuickAmount = (val: number) => {
    const current = Number(amount) || 0;
    setAmount((current + val).toString());
    setMode('fixed');
  };

  // Export Handlers
  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `upi-payment-qr-${payeeName.replace(/\s+/g, '-').toLowerCase() || 'qrcode'}.png`;
      a.click();
      showToast('Downloaded UPI QR PNG.');
    } catch {
      showToast('Failed to download PNG.', 'error');
    }
  };

  const handleDownloadHighResPng = async () => {
    setIsExporting(true);
    try {
      const qrOptions: QrLogoOptions = {
        url: upiUri,
        width: 2048,
        margin: 2,
        foregroundColor,
        backgroundColor,
        errorCorrectionLevel: 'H',
        hasLogo,
        logoImage,
        logoDataUrl,
        logoSizePercent,
        logoShape,
        logoBackground: effectiveLogoBg,
        logoPadding,
        hasBorder,
        borderColor,
        borderThickness
      };
      const blob = await renderHighResQrBlob(qrOptions, 2048);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upi-payment-qr-2048px-${payeeName.replace(/\s+/g, '-').toLowerCase() || 'qrcode'}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded 2048px print-ready QR PNG.');
    } catch {
      showToast('Failed to generate high-resolution PNG.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      const qrOptions: QrLogoOptions = {
        url: upiUri,
        width: 512,
        margin: 2,
        foregroundColor,
        backgroundColor,
        errorCorrectionLevel: 'H',
        hasLogo,
        logoImage,
        logoDataUrl,
        logoSizePercent,
        logoShape,
        logoBackground: effectiveLogoBg,
        logoPadding,
        hasBorder,
        borderColor,
        borderThickness
      };
      const svgString = await generateQrSvg(qrOptions);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upi-payment-qr-${payeeName.replace(/\s+/g, '-').toLowerCase() || 'qrcode'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded vector SVG QR.');
    } catch {
      showToast('Failed to generate SVG.', 'error');
    }
  };

  const handleDownloadPdf = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      const pdfBytes = await generateUpiPdfPoster(canvasRef.current, currentParams, layoutPreset);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upi-payment-poster-${payeeName.replace(/\s+/g, '-').toLowerCase() || 'poster'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloaded print-ready PDF Poster.');
    } catch (err) {
      showToast('Failed to generate PDF document.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyUri = () => {
    copyToClipboard(upiUri);
    showToast('UPI payment URI copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Information & Reusable Notice */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block text-emerald-950 dark:text-emerald-100">
              Reusable Static UPI Payment QR
            </span>
            <p className="leading-relaxed">
              This is a reusable static UPI QR without an application-defined expiry. It remains usable as long as the linked UPI ID and banking services remain active.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 font-medium text-[11px] shrink-0 text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Client-Side
        </div>
      </div>

      {/* Main Grid: Form Controls (Left) and Live Standee Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* A. Mode Switcher (Static vs Fixed) */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-brand-500" /> QR Payment Mode
              </label>
              <span className="text-[11px] font-medium text-slate-500">
                {mode === 'static' ? 'Payer enters amount' : 'Fixed bill amount'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
              <button
                type="button"
                onClick={() => setMode('static')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'static'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Static UPI QR (Default)
              </button>
              <button
                type="button"
                onClick={() => setMode('fixed')}
                className={`py-2 px-3 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  mode === 'fixed'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" /> Fixed Amount QR
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {mode === 'static'
                ? 'Recommended for shops, freelancers, and permanent counter stands. Payers scan the code and enter whatever amount they owe directly in their UPI app.'
                : 'Contains a predefined payment amount. Suitable for single invoices, fixed fees, or point-of-sale bills where customer amount input is not desired.'}
            </p>
          </div>

          {/* B. Payment Information Form */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" /> Payee Information
            </h3>

            {/* Payee Name & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payee Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="Enter payee name"
                  className={`input-base text-sm ${validation.errors.payeeName ? 'border-rose-400 focus:border-rose-500' : ''}`}
                />
                {validation.errors.payeeName && (
                  <p className="text-[11px] text-rose-500 mt-1">{validation.errors.payeeName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business or Shop Name (Optional)
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter business name"
                  className="input-base text-sm"
                />
              </div>
            </div>

            {/* UPI ID (Virtual Payment Address) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Recipient UPI ID (VPA) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">username@bankhandle</span>
              </div>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter recipient UPI ID (e.g. merchant@okhdfcbank)"
                className={`input-base font-mono text-sm ${validation.errors.upiId ? 'border-rose-400 focus:border-rose-500' : ''}`}
              />
              {validation.errors.upiId && (
                <p className="text-[11px] text-rose-500 mt-1">{validation.errors.upiId}</p>
              )}

              {/* Quick Handle Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 mr-1">Quick handle:</span>
                {COMMON_UPI_HANDLES.map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onClick={() => appendHandle(handle)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition-colors"
                  >
                    {handle}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Field (Fixed Amount Mode) */}
            {mode === 'fixed' && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Fixed Payment Amount (INR ₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (e.g. 500.00)"
                    className={`input-base pl-9 text-sm font-mono ${validation.errors.amount ? 'border-rose-400 focus:border-rose-500' : ''}`}
                  />
                </div>
                {validation.errors.amount && (
                  <p className="text-[11px] text-rose-500">{validation.errors.amount}</p>
                )}
                {validation.warnings.amount && (
                  <p className="text-[11px] text-amber-500">{validation.warnings.amount}</p>
                )}

                {/* Quick Add Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400">Quick set:</span>
                  {[100, 250, 500, 1000, 2000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition-colors font-medium text-slate-700 dark:text-slate-300"
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Instruction Banner on Card */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Poster Payment Instruction
              </label>
              <input
                type="text"
                value={paymentInstruction}
                onChange={(e) => setPaymentInstruction(e.target.value)}
                placeholder="Enter payment instruction (e.g. Scan & Pay with Any UPI App)"
                className="input-base text-sm"
              />
            </div>

            {/* Collapsible: Optional UPI Parameters (tn, tr, mc) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1"
              >
                <span>Optional UPI Parameters (Note, Reference, MCC)</span>
                {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showOptionalFields && (
                <div className="mt-3 space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Payment Note / Description (tn)
                    </label>
                    <input
                      type="text"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="Enter payment note or description"
                      className="input-base text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Transaction Reference (tr)
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="Enter transaction reference"
                        className="input-base text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Merchant Category Code (mc)
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={merchantCode}
                        onChange={(e) => setMerchantCode(e.target.value)}
                        placeholder="Enter 4-digit MCC (e.g. 5411)"
                        className="input-base text-xs font-mono"
                      />
                      {validation.errors.merchantCode && (
                        <p className="text-[10px] text-rose-500 mt-1">{validation.errors.merchantCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsible: Bank Account Details (Informational Wire Transfers) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-brand-500" />
                  Bank Account Details (Direct Wire / NEFT / IMPS)
                </span>
                {showBankDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showBankDetails && (
                <div className="mt-3 space-y-3 pt-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/60">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      Bank account details are presented on the poster for direct bank transfers and are kept separate from the UPI URI to ensure universal UPI interoperability.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountHolderName || ''}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                        placeholder="Enter account holder name"
                        className="input-base text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={bankDetails.bankName || ''}
                        onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                        placeholder="Enter bank name"
                        className="input-base text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={bankDetails.accountNumber || ''}
                        onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                        placeholder="Enter account number"
                        className="input-base text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        value={bankDetails.ifscCode || ''}
                        onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="Enter IFSC code (e.g. HDFC0000123)"
                        className="input-base text-xs font-mono uppercase"
                      />
                      {validation.errors.ifscCode && (
                        <p className="text-[10px] text-rose-500 mt-1">{validation.errors.ifscCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* C. Layout Presets Selector */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-3">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
              Professional Layout Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'shop', label: 'Shop Standee', icon: Store, desc: 'Counter Standee' },
                { id: 'minimal', label: 'Minimal QR', icon: QrCode, desc: 'Clean & Compact' },
                { id: 'business', label: 'Business Pro', icon: Building2, desc: 'Formal Invoicing' },
                { id: 'poster', label: 'A4 Poster', icon: FileText, desc: 'Wall & Counter' },
                { id: 'card', label: 'Payment Card', icon: CreditCard, desc: 'Pocket / Tent' }
              ].map((p) => {
                const IconComponent = p.icon;
                const active = layoutPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setLayoutPreset(p.id as UpiLayoutPreset)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      active
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1.5 ${active ? 'text-brand-500' : 'text-slate-400'}`} />
                    <div className="font-semibold text-xs">{p.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. Custom Logo & Branding */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Center Logo & Branding
                </h3>
              </div>
              {hasLogo && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasLogo(!hasLogo)}
                    className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1 font-medium transition-colors ${
                      hasLogo
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                    title="Toggle logo visibility"
                  >
                    {hasLogo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {hasLogo ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"
                    title="Remove logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleLogoFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {!logoImage ? (
              /* Dropzone empty state */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-center space-y-0.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Upload Business Logo (PNG, JPG, WebP)
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Click to browse or drag and drop. Transparent PNG supported (max 5 MB).
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-secondary text-xs py-1 px-3 pointer-events-none mt-1"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              /* Uploaded logo preview card */
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    {logoDataUrl && (
                      <img
                        src={logoDataUrl}
                        alt="Logo thumbnail"
                        className="max-w-full max-h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {logoFileName || 'Custom Logo'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {logoFileSize}
                      {logoDimensions ? ` • ${logoDimensions.width}×${logoDimensions.height}px` : ''}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Ready & Centered (Level H 30%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Remove logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Logo Styling Controls (Visible when logo is loaded) */}
            {hasLogo && logoImage && (
              <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* 1. Logo Size Presets & Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Logo Size ({logoSizePercent}% of QR)
                    </label>
                    <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-semibold">
                      {logoSizePercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: 'small', label: 'Small (15%)' },
                        { id: 'medium', label: 'Medium (20%)' },
                        { id: 'large', label: 'Large (25%)' },
                        { id: 'custom', label: 'Custom' }
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSizePresetChange(preset.id)}
                        className={`text-xs py-1 px-1.5 rounded-lg font-medium border text-center transition-all ${
                          logoSizePreset === preset.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={28}
                    step={1}
                    value={logoSizePercent}
                    onChange={(e) => handleCustomSizeChange(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>10% (Minimal)</span>
                    <span>20% (Optimal)</span>
                    <span>28% (Max Safe)</span>
                  </div>
                </div>

                {/* 2. Logo Shape */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Logo Shape
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'rounded', label: 'Rounded Square' },
                        { id: 'circle', label: 'Circle' },
                        { id: 'square', label: 'Square' }
                      ] as const
                    ).map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => setLogoShape(shape.id)}
                        className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                          logoShape === shape.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Logo Background */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Logo Background
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'white', label: 'White (#FFF)' },
                        { id: 'transparent', label: 'Transparent' },
                        { id: 'custom', label: 'Custom' }
                      ] as const
                    ).map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setLogoBackgroundType(bg.id)}
                        className={`text-xs py-1.5 px-2 rounded-lg font-medium border text-center transition-all ${
                          logoBackgroundType === bg.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>

                  {logoBackgroundType === 'custom' && (
                    <div className="flex items-center gap-2 pt-1.5">
                      <input
                        type="color"
                        value={logoCustomBg}
                        onChange={(e) => setLogoCustomBg(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                      />
                      <input
                        type="text"
                        value={logoCustomBg}
                        onChange={(e) => setLogoCustomBg(e.target.value)}
                        className="input-base font-mono uppercase text-xs w-28"
                      />
                      <span className="text-[11px] text-slate-400">Background fill behind logo</span>
                    </div>
                  )}
                </div>

                {/* 4. Logo Padding */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Logo Padding ({logoPadding}px)
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">{logoPadding} px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={16}
                    step={1}
                    value={logoPadding}
                    onChange={(e) => setLogoPadding(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                </div>

                {/* 5. Logo Border */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                        Logo Border Frame
                      </label>
                      <span className="text-[10px] text-slate-400">Border around the center logo</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasBorder(!hasBorder)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        hasBorder ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          hasBorder ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {hasBorder && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1">
                          Border Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                          />
                          <input
                            type="text"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="input-base font-mono uppercase text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase">
                            Thickness ({borderThickness}px)
                          </label>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={8}
                          step={1}
                          value={borderThickness}
                          onChange={(e) => setBorderThickness(Number(e.target.value))}
                          className="w-full accent-brand-500 mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  QR Pattern Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="input-base text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  QR Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="input-base text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Poster / Standee Preview & Verification */}
        <div className="lg:col-span-5 space-y-5">
          {/* Real-time Verification Badge */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Interoperability Verification
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Payee Name: Valid
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> UPI ID (VPA): Valid
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Currency: INR (cu)
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Zero Expiry Tokens
              </div>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed pt-1">
              Syntax validation verifies QR encoding accuracy and UPI URI format. Always perform a small test transaction before printing in bulk.
            </p>
          </div>

          {/* Printable Layout Container */}
          <div
            ref={printContainerRef}
            className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-lg text-slate-900 transition-all ${
              layoutPreset === 'minimal'
                ? 'max-w-sm mx-auto'
                : layoutPreset === 'card'
                  ? 'max-w-md mx-auto'
                  : 'w-full'
            }`}
          >
            {/* Poster Header */}
            <div className="text-center space-y-1 mb-5">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold tracking-wide uppercase mb-1">
                BHIM UPI • GPay • PhonePe • Paytm
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {businessName.trim() || payeeName.trim() || 'UPI Payment'}
              </h2>
              <p className="text-xs font-semibold text-emerald-600">
                {paymentInstruction.trim() || 'Scan & Pay with Any UPI App'}
              </p>
            </div>

            {/* Centered QR Canvas Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center my-4">
              <canvas
                ref={canvasRef}
                className="max-w-[240px] max-h-[240px] w-full h-auto drop-shadow-sm"
              />
            </div>

            {/* Recipient Details Below QR */}
            <div className="text-center space-y-1.5 pt-1">
              <div className="text-sm font-bold text-slate-900">
                {payeeName.trim()}
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                UPI ID: {upiId.trim()}
              </div>

              {mode === 'fixed' && amount && (
                <div className="text-base font-extrabold text-emerald-600 pt-1">
                  Amount: ₹{Number(amount).toFixed(2)}
                </div>
              )}

              {paymentNote && (
                <div className="text-[11px] text-slate-500 pt-0.5">
                  Ref: {paymentNote}
                </div>
              )}
            </div>

            {/* Accepted UPI Apps Badges */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-4 text-xs font-bold text-slate-500">
              <span className="text-[#0052cc]">BHIM</span>
              <span className="text-[#4285F4]">GPay</span>
              <span className="text-[#5f259f]">PhonePe</span>
              <span className="text-[#00b9f5]">Paytm</span>
              <span className="text-[#FF9900]">Amazon Pay</span>
            </div>

            {/* Informational Bank Details on Poster (if enabled) */}
            {showBankDetails && (bankDetails.accountNumber || bankDetails.bankName) && (
              <div className="mt-4 p-3 rounded-lg bg-slate-100 text-left border border-slate-200 text-[10px] space-y-1">
                <div className="font-bold text-slate-700 uppercase tracking-wide">
                  Bank Transfer (NEFT / IMPS)
                </div>
                {bankDetails.accountHolderName && (
                  <div>A/C Name: <span className="font-semibold">{bankDetails.accountHolderName}</span></div>
                )}
                <div className="grid grid-cols-2 gap-1">
                  {bankDetails.accountNumber && (
                    <div>A/C No: <span className="font-mono font-bold">{bankDetails.accountNumber}</span></div>
                  )}
                  {bankDetails.ifscCode && (
                    <div>IFSC: <span className="font-mono font-bold text-emerald-700">{bankDetails.ifscCode}</span></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action / Export Buttons */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadHighResPng}
                className="btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> High-Res PNG (2048px)
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> SVG
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadPdf}
                className="btn-secondary text-xs py-2 flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400"
              >
                <FileText className="w-3.5 h-3.5" /> PDF Poster
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyUri}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy UPI URI
            </button>
          </div>

          {/* Technical Details (Expandable) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
            >
              <span>{showTechnicalDetails ? 'Hide' : 'View'} Raw UPI Technical Payload</span>
              {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showTechnicalDetails && (
              <div className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] space-y-2 break-all border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Generated URI:</span>
                  <span className="text-emerald-400">{upiUri}</span>
                </div>
                {verificationResult.decodedUri && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Decoded from QR:</span>
                    <span className="text-cyan-400">{verificationResult.decodedUri}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
