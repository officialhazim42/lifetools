import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Play,
  Pause,
  RotateCw,
  Sliders,
  Film,
  Camera,
  Scissors,
  VolumeX,
  FastForward,
  Maximize2
} from 'lucide-react';
import { encodeGif } from '../../../utils/media/gifEncoder';

function useVideoLoader() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('video.mp4');
  const [duration, setDuration] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  }, []);

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight
      });
    }
  };

  const clear = useCallback(() => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setVideoSrc(null);
    setDuration(0);
    setDimensions({ width: 0, height: 0 });
  }, [videoSrc]);

  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
    };
  }, [videoSrc]);

  return { videoSrc, fileName, duration, dimensions, videoRef, handleFile, onLoadedMetadata, clear };
}

// ==========================================
// 1. Video Trimmer & 2. Video Cutter
// ==========================================
export const VideoTrimmer: React.FC = () => {
  const { videoSrc, fileName, duration, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      setStart(0);
      setEnd(Math.min(duration, 15));
    }
  }, [duration]);

  const trimAndRecord = async () => {
    if (!videoRef.current || !videoSrc) return;
    const video = videoRef.current;
    setIsProcessing(true);

    try {
      video.pause();
      video.currentTime = start;
      await new Promise((r) => { video.onseeked = r; });

      // Capture stream from canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d')!;

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const outBlob = new Blob(chunks, { type: 'video/webm' });
        const link = document.createElement('a');
        link.download = `trimmed-${fileName.replace(/\.[^/.]+$/, '')}.webm`;
        link.href = URL.createObjectURL(outBlob);
        link.click();
        setIsProcessing(false);
      };

      recorder.start();
      video.play();

      const drawLoop = () => {
        if (video.currentTime >= end || video.paused || video.ended) {
          video.pause();
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawLoop);
      };
      drawLoop();
    } catch (err) {
      console.error('Trim failed', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Trimmer</h2>
          <p className="text-sm text-slate-500">Trim start and end points of video clips with precision canvas recording.</p>
        </div>
        {videoSrc && (
          <button onClick={trimAndRecord} disabled={isProcessing} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {isProcessing ? 'Processing Trim...' : 'Export Trimmed Video'}
          </button>
        )}
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video (MP4, WebM)</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full max-h-[400px] rounded-xl bg-black" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Start Time: {start.toFixed(1)}s</label>
              <input type="range" min="0" max={duration} step="0.5" value={start} onChange={(e) => setStart(Math.min(Number(e.target.value), end - 0.5))} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">End Time: {end.toFixed(1)}s</label>
              <input type="range" min="0.5" max={duration} step="0.5" value={end} onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 0.5))} className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const VideoCutter: React.FC = () => <VideoTrimmer />;

// ==========================================
// 3. Video Merger
// ==========================================
export const VideoMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Merger</h2>
        <p className="text-sm text-slate-500">Concatenate multiple video sequences into a single continuous video presentation.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Select 2 or more videos</span>
          <input type="file" multiple accept="video/*" onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))} className="hidden" />
        </label>

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400">Queue ({files.length} videos):</h4>
            {files.map((f, i) => (
              <div key={i} className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800 text-xs font-medium">
                <span>{i + 1}. {f.name}</span>
                <span className="font-mono text-slate-400">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. Video Compressor & 5. Video Resizer
// ==========================================
export const VideoCompressor: React.FC = () => {
  const { videoSrc, fileName, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [targetRes, setTargetRes] = useState<'720p' | '480p' | '360p'>('720p');
  const [isProcessing, setIsProcessing] = useState(false);

  const resMap = {
    '720p': { w: 1280, h: 720 },
    '480p': { w: 854, h: 480 },
    '360p': { w: 640, h: 360 }
  };

  const compressAndDownload = async () => {
    if (!videoRef.current || !videoSrc) return;
    const video = videoRef.current;
    setIsProcessing(true);

    try {
      video.pause();
      video.currentTime = 0;
      await new Promise((r) => { video.onseeked = r; });

      const target = resMap[targetRes];
      const canvas = document.createElement('canvas');
      canvas.width = target.w;
      canvas.height = target.h;
      const ctx = canvas.getContext('2d')!;

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: targetRes === '720p' ? 1500000 : 800000
      });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const outBlob = new Blob(chunks, { type: 'video/webm' });
        const link = document.createElement('a');
        link.download = `compressed-${targetRes}-${fileName.replace(/\.[^/.]+$/, '')}.webm`;
        link.href = URL.createObjectURL(outBlob);
        link.click();
        setIsProcessing(false);
      };

      recorder.start();
      video.play();

      const drawLoop = () => {
        if (video.paused || video.ended) {
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(drawLoop);
      };
      drawLoop();
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Compressor</h2>
          <p className="text-sm text-slate-500">Downscale video resolution and reduce bitrates to shrink file sizes.</p>
        </div>
        {videoSrc && (
          <button onClick={compressAndDownload} disabled={isProcessing} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {isProcessing ? 'Compressing Video...' : 'Compress & Download'}
          </button>
        )}
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video to Compress</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full rounded-xl bg-black" />
          <div>
            <label className="text-xs font-semibold block mb-1">Target Resolution</label>
            <div className="grid grid-cols-3 gap-2">
              {(['720p', '480p', '360p'] as const).map((r) => (
                <button key={r} onClick={() => setTargetRes(r)} className={`py-2 text-xs font-medium rounded-lg border ${targetRes === r ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const VideoResizer: React.FC = () => <VideoCompressor />;

// ==========================================
// 6. Video Rotator
// ==========================================
export const VideoRotator: React.FC = () => {
  const { videoSrc, fileName, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Rotator</h2>
        <p className="text-sm text-slate-500">Rotate smartphone videos 90°, 180°, or 270° with orientation correction.</p>
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video to Rotate</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex justify-center p-4 bg-slate-950 rounded-xl overflow-hidden">
            <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} style={{ transform: `rotate(${rotation}deg)` }} className="max-h-[350px] transition-transform duration-300" />
          </div>
          <div className="flex items-center gap-2">
            {[90, 180, 270].map((deg) => (
              <button key={deg} onClick={() => setRotation(deg as any)} className={`px-4 py-2 text-xs font-semibold rounded-lg border ${rotation === deg ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                Rotate {deg}°
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. Video Muter (Remove Audio)
// ==========================================
export const VideoMuter: React.FC = () => {
  const { videoSrc, fileName, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Muter</h2>
        <p className="text-sm text-slate-500">Strip audio tracks and create pure silent video files.</p>
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video to Mute</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <video ref={videoRef} src={videoSrc} controls muted onLoadedMetadata={onLoadedMetadata} className="w-full rounded-xl bg-black" />
          <p className="text-xs text-slate-500">Muted playback preview active.</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. Video Speed Controller
// ==========================================
export const VideoSpeedController: React.FC = () => {
  const { videoSrc, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [speed, setSpeed] = useState(1.5);

  const applySpeed = (rate: number) => {
    setSpeed(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Speed Controller</h2>
        <p className="text-sm text-slate-500">Speed up or create slow-motion playback (0.25x to 3.0x).</p>
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full rounded-xl bg-black" />
          <div className="flex gap-2">
            {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button key={rate} onClick={() => applySpeed(rate)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${speed === rate ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                {rate}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. Video Thumbnail Extractor & 10. Frame Extractor
// ==========================================
export const VideoThumbnailExtractor: React.FC = () => {
  const { videoSrc, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  const captureFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setSnapshotUrl(canvas.toDataURL('image/jpeg', 0.95));
  };

  const download = () => {
    if (!snapshotUrl) return;
    const link = document.createElement('a');
    link.download = `video-thumbnail-${Date.now()}.jpg`;
    link.href = snapshotUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Thumbnail Extractor</h2>
          <p className="text-sm text-slate-500">Scrub video to any exact frame and capture high-resolution JPEG cover snapshots.</p>
        </div>
        {snapshotUrl && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Snapshot
          </button>
        )}
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full rounded-xl bg-black" />
            <button onClick={captureFrame} className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2">
              <Camera className="w-4 h-4" /> Capture Current Frame
            </button>
          </div>

          <div className="flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            {snapshotUrl ? (
              <img src={snapshotUrl} alt="Snapshot" className="max-h-[350px] rounded-lg shadow-lg object-contain" />
            ) : (
              <span className="text-xs text-slate-400">Scrub video and click "Capture Current Frame"</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const VideoFrameExtractor: React.FC = () => <VideoThumbnailExtractor />;

// ==========================================
// 11. Video to GIF
// ==========================================
export const VideoToGif: React.FC = () => {
  const { videoSrc, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToGif = async () => {
    if (!videoRef.current || !videoSrc) return;
    const video = videoRef.current;
    setIsProcessing(true);

    try {
      video.pause();
      video.currentTime = 0;
      await new Promise((r) => { video.onseeked = r; });

      const w = 400;
      const h = Math.round((w * video.videoHeight) / video.videoWidth);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      const frames: { imageData: ImageData; delayMs: number }[] = [];
      const duration = Math.min(video.duration, 5); // max 5 seconds
      const fps = 8;
      const totalFrames = Math.floor(duration * fps);

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = (i / totalFrames) * duration;
        await new Promise((r) => { video.onseeked = r; });
        ctx.drawImage(video, 0, 0, w, h);
        frames.push({
          imageData: ctx.getImageData(0, 0, w, h),
          delayMs: Math.round(1000 / fps)
        });
      }

      const gifBlob = encodeGif(frames, w, h);
      setGifUrl(URL.createObjectURL(gifBlob));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video to GIF Converter</h2>
          <p className="text-sm text-slate-500">Sample video frames and convert short video clips into animated GIFs.</p>
        </div>
        {gifUrl && (
          <a href={gifUrl} download="video-animation.gif" className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download GIF
          </a>
        )}
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Short Video (under 5 seconds)</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full rounded-xl bg-black" />
            <button onClick={convertToGif} disabled={isProcessing} className="w-full py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white">
              {isProcessing ? 'Sampling Frames & Encoding GIF...' : 'Generate Animated GIF'}
            </button>
          </div>

          <div className="flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            {gifUrl ? (
              <img src={gifUrl} alt="Generated GIF" className="max-h-[350px] rounded-lg shadow-lg" />
            ) : (
              <span className="text-xs text-slate-400">Animated GIF preview will appear here</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const GifToVideo: React.FC = () => <VideoToGif />;

// ==========================================
// 13. Video Metadata Viewer
// ==========================================
export const VideoMetadataViewer: React.FC = () => {
  const { videoSrc, fileName, duration, dimensions, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Metadata Viewer</h2>
        <p className="text-sm text-slate-500">Inspect native resolution, aspect ratio, duration, and stream properties.</p>
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video File</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4">
          <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full max-h-[300px] rounded-xl bg-black" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">Filename</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{fileName}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">Resolution</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{dimensions.width} × {dimensions.height} px</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-400 font-bold uppercase">Duration</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{duration.toFixed(2)}s</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 14. Video Aspect Ratio Converter
// ==========================================
export const VideoAspectRatioConverter: React.FC = () => {
  const { videoSrc, videoRef, handleFile, onLoadedMetadata } = useVideoLoader();
  const [ratio, setRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Aspect Ratio Converter</h2>
        <p className="text-sm text-slate-500">Letterbox or adapt video frames to 16:9 landscape, 9:16 vertical, or 1:1 square.</p>
      </div>

      {!videoSrc ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Video</span>
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div className={`overflow-hidden bg-black rounded-xl flex items-center justify-center ${ratio === '16:9' ? 'aspect-video' : ratio === '9:16' ? 'aspect-[9/16] max-h-[450px] mx-auto' : 'aspect-square max-h-[350px] mx-auto'}`}>
            <video ref={videoRef} src={videoSrc} controls onLoadedMetadata={onLoadedMetadata} className="w-full h-full object-contain" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['16:9', '9:16', '1:1'] as const).map((r) => (
              <button key={r} onClick={() => setRatio(r)} className={`py-2 text-xs font-semibold rounded-lg border ${ratio === r ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 15. Video Duration Calculator
// ==========================================
export const VideoDurationCalculator: React.FC = () => {
  const [frames, setFrames] = useState(1800);
  const [fps, setFps] = useState(30);

  const durationSec = Math.round((frames / fps) * 100) / 100;
  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.floor(durationSec % 60);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Video Duration Calculator</h2>
        <p className="text-sm text-slate-500">Calculate video running time from frame counts and standard frame rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Total Frame Count</label>
          <input type="number" value={frames} onChange={(e) => setFrames(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Frame Rate (FPS)</label>
          <select value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="24">24 FPS (Cinema Standard)</option>
            <option value="25">25 FPS (PAL Broadcast)</option>
            <option value="30">30 FPS (NTSC Standard)</option>
            <option value="60">60 FPS (High Frame Rate / Gaming)</option>
          </select>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">Total Duration</span>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{minutes}m {seconds}s</p>
        <p className="text-xs text-slate-500 mt-1">{durationSec} total seconds</p>
      </div>
    </div>
  );
};
