import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Camera, Upload, Copy, ExternalLink, RefreshCw, StopCircle } from 'lucide-react';

export const QrCodeScanner: React.FC = () => {
  const { showToast } = useToast();
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Scan uploaded image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScannedResult(code.data);
          showToast('QR Code successfully detected and decoded!');
        } else {
          showToast('No QR code found in uploaded image.', 'error');
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsScanningCamera(true);
        scanFrame();
      }
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable on this device.');
      setIsScanningCamera(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    setIsScanningCamera(false);
  };

  // Continuous frame scanning
  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });

        if (code && code.data) {
          setScannedResult(code.data);
          stopCamera();
          showToast('QR code scanned from camera!');
          return;
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleCopy = () => {
    if (!scannedResult) return;
    copyToClipboard(scannedResult);
    showToast('Result copied!');
  };

  const isUrl = scannedResult && /^https?:\/\//i.test(scannedResult);

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {!isScanningCamera ? (
          <button onClick={startCamera} className="btn-primary py-2.5 px-5">
            <Camera className="w-4 h-4" /> Start Camera Scanner
          </button>
        ) : (
          <button onClick={stopCamera} className="btn-secondary text-rose-500 py-2.5 px-5">
            <StopCircle className="w-4 h-4" /> Stop Camera
          </button>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary py-2.5 px-5"
        >
          <Upload className="w-4 h-4" /> Scan from Image File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {cameraError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 text-center">
          {cameraError}
        </div>
      )}

      {/* Video & Canvas View */}
      {isScanningCamera && (
        <div className="relative max-w-md mx-auto aspect-video rounded-2xl overflow-hidden bg-black border-2 border-emerald-500 shadow-elevated">
          <video ref={videoRef} className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 border-2 border-dashed border-emerald-400 m-8 rounded-xl pointer-events-none animate-pulse" />
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[11px] px-3 py-1 rounded-full font-medium">
            Point camera at QR code...
          </span>
        </div>
      )}

      {/* Scanned Result Card */}
      {scannedResult && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Scanned QR Code Content
            </h3>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary text-xs py-1">
                <Copy className="w-3.5 h-3.5" /> Copy Result
              </button>
              {isUrl && (
                <a
                  href={scannedResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs py-1 inline-flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Link
                </a>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 font-mono text-sm break-all text-slate-900 dark:text-white select-all">
            {scannedResult}
          </div>
        </div>
      )}
    </div>
  );
};
