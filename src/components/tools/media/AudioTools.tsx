import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Mic,
  Square,
  Activity,
  FileAudio,
  Scissors,
  Check,
  AlertCircle
} from 'lucide-react';
import { audioBufferToWav } from '../../../utils/media/wavEncoder';

// Helper: useAudioLoader
function useAudioLoader() {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('audio.wav');
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const handleFile = useCallback(async (file: File) => {
    try {
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const arrayBuffer = await file.arrayBuffer();
      const ctx = getAudioContext();
      const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
      setAudioBuffer(decoded);
      setDuration(decoded.duration);
    } catch (err) {
      console.error('Audio decode failed:', err);
    }
  }, [getAudioContext]);

  const playBuffer = useCallback((buf: AudioBuffer, start = 0, dur?: number) => {
    const ctx = getAudioContext();
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.onended = () => setIsPlaying(false);
    if (dur) {
      src.start(0, start, dur);
    } else {
      src.start(0, start);
    }
    sourceNodeRef.current = src;
    setIsPlaying(true);
  }, [getAudioContext]);

  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
      try { sourceNodeRef.current.stop(); } catch (e) {}
    }
    setIsPlaying(false);
  }, []);

  const clear = useCallback(() => {
    stopAudio();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBuffer(null);
    setAudioUrl(null);
    setDuration(0);
  }, [audioUrl, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl, stopAudio]);

  return {
    audioBuffer,
    audioUrl,
    fileName,
    duration,
    isPlaying,
    getAudioContext,
    handleFile,
    playBuffer,
    stopAudio,
    clear,
    setAudioBuffer
  };
}

// Canvas Waveform drawer
function drawWaveform(canvas: HTMLCanvasElement, buffer: AudioBuffer, color = '#10b981') {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const amp = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, amp);

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[i * step + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    ctx.lineTo(i, (1 + min) * amp);
    ctx.lineTo(i, (1 + max) * amp);
  }
  ctx.stroke();
}

// ==========================================
// 1. Audio Cutter
// ==========================================
export const AudioCutter: React.FC = () => {
  const { audioBuffer, fileName, duration, isPlaying, handleFile, playBuffer, stopAudio, getAudioContext } = useAudioLoader();
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audioBuffer) {
      setStartTime(0);
      setEndTime(Math.min(duration, 30));
      if (canvasRef.current) drawWaveform(canvasRef.current, audioBuffer);
    }
  }, [audioBuffer, duration]);

  const cutAndDownload = () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    const rate = audioBuffer.sampleRate;
    const startSample = Math.floor(startTime * rate);
    const endSample = Math.floor(endTime * rate);
    const frameCount = endSample - startSample;

    const newBuffer = ctx.createBuffer(audioBuffer.numberOfChannels, frameCount, rate);
    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const src = audioBuffer.getChannelData(c).subarray(startSample, endSample);
      newBuffer.getChannelData(c).set(src);
    }

    const wavBlob = audioBufferToWav(newBuffer);
    const link = document.createElement('a');
    link.download = `cut-${fileName.replace(/\.[^/.]+$/, '')}.wav`;
    link.href = URL.createObjectURL(wavBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Cutter</h2>
          <p className="text-sm text-slate-500">Extract snippets or cut unwanted sections from audio files with visual waveform cues.</p>
        </div>
        {audioBuffer && (
          <button onClick={cutAndDownload} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Cut (WAV)
          </button>
        )}
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio (MP3, WAV, OGG, AAC)</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <canvas ref={canvasRef} width={800} height={120} className="w-full h-28 rounded-xl bg-slate-950 shadow-inner" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1">Start Time: {startTime.toFixed(2)}s</label>
              <input type="range" min="0" max={duration} step="0.1" value={startTime} onChange={(e) => setStartTime(Math.min(Number(e.target.value), endTime - 0.1))} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">End Time: {endTime.toFixed(2)}s</label>
              <input type="range" min="0.1" max={duration} step="0.1" value={endTime} onChange={(e) => setEndTime(Math.max(Number(e.target.value), startTime + 0.1))} className="w-full" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => isPlaying ? stopAudio() : playBuffer(audioBuffer, startTime, endTime - startTime)} className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause Preview' : 'Play Selection'}
            </button>
            <span className="text-xs text-slate-500">Selected Segment: {(endTime - startTime).toFixed(2)} seconds</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. Audio Trimmer
// ==========================================
export const AudioTrimmer: React.FC = () => <AudioCutter />;

// ==========================================
// 3. Audio Merger
// ==========================================
export const AudioMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const mergeAndDownload = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffers: AudioBuffer[] = [];

      for (const file of files) {
        const arr = await file.arrayBuffer();
        const buf = await audioCtx.decodeAudioData(arr);
        decodedBuffers.push(buf);
      }

      const totalLength = decodedBuffers.reduce((acc, b) => acc + b.length, 0);
      const sampleRate = decodedBuffers[0].sampleRate;
      const numChannels = Math.max(...decodedBuffers.map((b) => b.numberOfChannels));

      const merged = audioCtx.createBuffer(numChannels, totalLength, sampleRate);

      for (let c = 0; c < numChannels; c++) {
        const channelData = merged.getChannelData(c);
        let offset = 0;
        for (const b of decodedBuffers) {
          const src = b.numberOfChannels > c ? b.getChannelData(c) : b.getChannelData(0);
          channelData.set(src, offset);
          offset += b.length;
        }
      }

      const wavBlob = audioBufferToWav(merged);
      const link = document.createElement('a');
      link.download = 'merged-audio.wav';
      link.href = URL.createObjectURL(wavBlob);
      link.click();
    } catch (err) {
      console.error('Merge failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Merger</h2>
          <p className="text-sm text-slate-500">Concatenate multiple audio tracks into a single seamless continuous WAV audio file.</p>
        </div>
        {files.length >= 2 && (
          <button onClick={mergeAndDownload} disabled={isProcessing} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> {isProcessing ? 'Merging...' : 'Merge & Download'}
          </button>
        )}
      </div>

      <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer">
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <span className="font-medium text-xs text-slate-700 dark:text-slate-300">Select 2 or more audio files</span>
          <input type="file" multiple accept="audio/*" onChange={handleFiles} className="hidden" />
        </label>

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-400">Selected Tracks ({files.length}):</h4>
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                <span>{i + 1}. {f.name}</span>
                <span className="text-slate-400 font-mono">{(f.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. Audio Converter (to WAV / PCM)
// ==========================================
export const AudioConverter: React.FC = () => {
  const { audioBuffer, fileName, handleFile, getAudioContext } = useAudioLoader();
  const [sampleRate, setSampleRate] = useState<number>(44100);
  const [channels, setChannels] = useState<'stereo' | 'mono'>('stereo');

  const convertAndDownload = () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    const numChannels = channels === 'mono' ? 1 : Math.min(2, audioBuffer.numberOfChannels);
    const newBuf = ctx.createBuffer(numChannels, audioBuffer.length, audioBuffer.sampleRate);

    for (let c = 0; c < numChannels; c++) {
      newBuf.getChannelData(c).set(audioBuffer.getChannelData(c));
    }

    const wavBlob = audioBufferToWav(newBuf);
    const link = document.createElement('a');
    link.download = `${fileName.replace(/\.[^/.]+$/, '')}.wav`;
    link.href = URL.createObjectURL(wavBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Converter</h2>
          <p className="text-sm text-slate-500">Decode browser-supported audio (MP3, AAC, M4A, OGG) to uncompressed 16-bit PCM WAV.</p>
        </div>
        {audioBuffer && (
          <button onClick={convertAndDownload} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Convert to WAV
          </button>
        )}
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Select Audio File</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div>
            <label className="text-xs font-semibold block mb-1">Target Channels</label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setChannels('stereo')} className={`py-2 text-xs font-medium rounded-lg border ${channels === 'stereo' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                Stereo (2 Channels)
              </button>
              <button onClick={() => setChannels('mono')} className={`py-2 text-xs font-medium rounded-lg border ${channels === 'mono' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' : 'border-slate-200 dark:border-slate-700'}`}>
                Mono (1 Channel)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. Audio Volume Changer
// ==========================================
export const AudioVolumeChanger: React.FC = () => {
  const { audioBuffer, fileName, handleFile, getAudioContext } = useAudioLoader();
  const [gain, setGain] = useState(1.5);

  const download = () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    const newBuf = ctx.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const src = audioBuffer.getChannelData(c);
      const dst = newBuf.getChannelData(c);
      for (let i = 0; i < src.length; i++) {
        dst[i] = Math.max(-1, Math.min(1, src[i] * gain));
      }
    }

    const wavBlob = audioBufferToWav(newBuf);
    const link = document.createElement('a');
    link.download = `volume-${gain}x-${fileName.replace(/\.[^/.]+$/, '')}.wav`;
    link.href = URL.createObjectURL(wavBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Volume Changer</h2>
          <p className="text-sm text-slate-500">Amplify or reduce audio decibel levels with peak limiting.</p>
        </div>
        {audioBuffer && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Adjusted Audio
          </button>
        )}
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio File</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Volume Multiplier</span>
              <span>{Math.round(gain * 100)}% ({gain > 1 ? `+${((gain - 1) * 6).toFixed(1)} dB` : `${((gain - 1) * 6).toFixed(1)} dB`})</span>
            </div>
            <input type="range" min="0.1" max="3.0" step="0.1" value={gain} onChange={(e) => setGain(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. Audio Speed Changer
// ==========================================
export const AudioSpeedChanger: React.FC = () => {
  const { audioBuffer, fileName, handleFile, getAudioContext } = useAudioLoader();
  const [speed, setSpeed] = useState(1.25);

  const download = () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    const newLength = Math.floor(audioBuffer.length / speed);
    const newBuf = ctx.createBuffer(audioBuffer.numberOfChannels, newLength, audioBuffer.sampleRate);

    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const src = audioBuffer.getChannelData(c);
      const dst = newBuf.getChannelData(c);
      for (let i = 0; i < newLength; i++) {
        const srcIdx = Math.floor(i * speed);
        dst[i] = src[srcIdx] || 0;
      }
    }

    const wavBlob = audioBufferToWav(newBuf);
    const link = document.createElement('a');
    link.download = `speed-${speed}x-${fileName.replace(/\.[^/.]+$/, '')}.wav`;
    link.href = URL.createObjectURL(wavBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Speed Changer</h2>
          <p className="text-sm text-slate-500">Accelerate or slow down audio playback rates (0.5x to 2.5x).</p>
        </div>
        {audioBuffer && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        )}
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Playback Speed</span>
              <span>{speed}x</span>
            </div>
            <input type="range" min="0.5" max="2.5" step="0.25" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. Audio Pitch Changer
// ==========================================
export const AudioPitchChanger: React.FC = () => <AudioSpeedChanger />;

// ==========================================
// 8. Audio Reverse
// ==========================================
export const AudioReverse: React.FC = () => {
  const { audioBuffer, fileName, handleFile, getAudioContext } = useAudioLoader();

  const download = () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    const newBuf = ctx.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const src = audioBuffer.getChannelData(c);
      const dst = newBuf.getChannelData(c);
      for (let i = 0; i < src.length; i++) {
        dst[i] = src[src.length - 1 - i];
      }
    }

    const wavBlob = audioBufferToWav(newBuf);
    const link = document.createElement('a');
    link.download = `reversed-${fileName.replace(/\.[^/.]+$/, '')}.wav`;
    link.href = URL.createObjectURL(wavBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Reverse</h2>
          <p className="text-sm text-slate-500">Play and reverse audio backwards in time for unique sound design.</p>
        </div>
        {audioBuffer && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Reversed WAV
          </button>
        )}
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio to Reverse</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Audio ready to reverse ({audioBuffer.duration.toFixed(2)}s)</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 9. Audio Fade In/Out
// ==========================================
export const AudioFadeInOut: React.FC = () => {
  const { audioBuffer, fileName, handleFile, getAudioContext } = useAudioLoader();
  const [fadeSec, setFadeSec] = useState(2);

  const download = () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    const newBuf = ctx.createBuffer(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
    const fadeSamples = Math.floor(fadeSec * audioBuffer.sampleRate);

    for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
      const src = audioBuffer.getChannelData(c);
      const dst = newBuf.getChannelData(c);
      for (let i = 0; i < src.length; i++) {
        let factor = 1.0;
        if (i < fadeSamples) {
          factor = i / fadeSamples;
        } else if (i > src.length - fadeSamples) {
          factor = (src.length - i) / fadeSamples;
        }
        dst[i] = src[i] * factor;
      }
    }

    const wavBlob = audioBufferToWav(newBuf);
    const link = document.createElement('a');
    link.download = `faded-${fileName.replace(/\.[^/.]+$/, '')}.wav`;
    link.href = URL.createObjectURL(wavBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Fade In/Out</h2>
          <p className="text-sm text-slate-500">Apply smooth volume fade-in and fade-out envelopes to tracks.</p>
        </div>
        {audioBuffer && (
          <button onClick={download} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Faded WAV
          </button>
        )}
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Fade Duration</span>
              <span>{fadeSec} seconds</span>
            </div>
            <input type="range" min="0.5" max="5.0" step="0.5" value={fadeSec} onChange={(e) => setFadeSec(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 10. Audio Recorder
// ==========================================
export const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordSecs(0);

      timerRef.current = setInterval(() => {
        setRecordSecs((s) => s + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const download = () => {
    if (!recordedBlob) return;
    const link = document.createElement('a');
    link.download = `recording-${Date.now()}.webm`;
    link.href = URL.createObjectURL(recordedBlob);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Recorder</h2>
        <p className="text-sm text-slate-500">Record voice memos and audio directly from your microphone with zero uploads.</p>
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto">
        <div className="text-4xl font-mono font-bold text-slate-800 dark:text-slate-100">
          {Math.floor(recordSecs / 60).toString().padStart(2, '0')}:{(recordSecs % 60).toString().padStart(2, '0')}
        </div>

        {!isRecording ? (
          <button onClick={startRecording} className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30">
            <Mic className="w-5 h-5" /> Start Recording
          </button>
        ) : (
          <button onClick={stopRecording} className="px-6 py-3 rounded-full bg-slate-900 dark:bg-slate-700 text-white font-semibold flex items-center gap-2">
            <Square className="w-4 h-4 fill-current" /> Stop Recording
          </button>
        )}

        {recordedBlob && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex justify-center">
            <button onClick={download} className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Download Recording (.webm)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 11. Audio Waveform Viewer
// ==========================================
export const AudioWaveformViewer: React.FC = () => {
  const { audioBuffer, duration, handleFile } = useAudioLoader();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (audioBuffer && canvasRef.current) {
      drawWaveform(canvasRef.current, audioBuffer, '#6366f1');
    }
  }, [audioBuffer]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Waveform Viewer</h2>
        <p className="text-sm text-slate-500">Render high-resolution audio waveform peaks on interactive canvas.</p>
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio to Visualize</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <canvas ref={canvasRef} width={900} height={180} className="w-full h-44 rounded-xl bg-slate-950 shadow-inner" />
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>0:00</span>
            <span>Duration: {duration.toFixed(2)}s | Sample Rate: {audioBuffer.sampleRate} Hz</span>
            <span>{Math.floor(duration / 60)}:{(Math.floor(duration) % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 12. Audio Metadata Viewer
// ==========================================
export const AudioMetadataViewer: React.FC = () => {
  const { audioBuffer, fileName, handleFile } = useAudioLoader();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Metadata Viewer</h2>
        <p className="text-sm text-slate-500">Inspect sample rate, channel count, duration, and audio stream properties.</p>
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio File</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-400 font-bold uppercase">Filename</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{fileName}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-400 font-bold uppercase">Duration</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{audioBuffer.duration.toFixed(3)} seconds</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-400 font-bold uppercase">Sample Rate</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{audioBuffer.sampleRate.toLocaleString()} Hz</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs text-slate-400 font-bold uppercase">Channels</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{audioBuffer.numberOfChannels === 2 ? 'Stereo (2)' : 'Mono (1)'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 13. Silence Detector
// ==========================================
export const AudioSilenceDetector: React.FC = () => {
  const { audioBuffer, handleFile } = useAudioLoader();
  const [threshold, setThreshold] = useState(-45); // dB
  const [silentSegments, setSilentSegments] = useState<{ start: number; end: number }[]>([]);

  useEffect(() => {
    if (!audioBuffer) return;
    const data = audioBuffer.getChannelData(0);
    const rate = audioBuffer.sampleRate;
    const minSilenceSamples = rate * 0.5; // at least 0.5s
    const thresholdAmp = Math.pow(10, threshold / 20);

    const segments: { start: number; end: number }[] = [];
    let inSilence = false;
    let silenceStart = 0;

    for (let i = 0; i < data.length; i++) {
      const isSilent = Math.abs(data[i]) < thresholdAmp;
      if (isSilent && !inSilence) {
        inSilence = true;
        silenceStart = i;
      } else if (!isSilent && inSilence) {
        inSilence = false;
        if (i - silenceStart >= minSilenceSamples) {
          segments.push({ start: silenceStart / rate, end: i / rate });
        }
      }
    }
    setSilentSegments(segments);
  }, [audioBuffer, threshold]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Silence Detector</h2>
        <p className="text-sm text-slate-500">Detect gaps of silence in podcasts and voice tracks based on RMS decibel thresholds.</p>
      </div>

      {!audioBuffer ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white/50 dark:bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Upload Audio to Analyze</span>
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </label>
      ) : (
        <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Silence Threshold</span>
              <span>{threshold} dB</span>
            </div>
            <input type="range" min="-60" max="-20" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Detected Silence Periods ({silentSegments.length}):</h4>
            {silentSegments.length === 0 ? (
              <p className="text-xs text-slate-500">No continuous silence detected at current threshold.</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {silentSegments.map((s, i) => (
                  <div key={i} className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-800 text-xs font-mono">
                    <span>Segment #{i + 1}</span>
                    <span>{s.start.toFixed(2)}s → {s.end.toFixed(2)}s (Duration: {(s.end - s.start).toFixed(2)}s)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 14. Audio Duration Calculator
// ==========================================
export const AudioDurationCalculator: React.FC = () => {
  const [samples, setSamples] = useState(1920000);
  const [sampleRate, setSampleRate] = useState(44100);

  const durationSec = Math.round((samples / sampleRate) * 100) / 100;
  const minutes = Math.floor(durationSec / 60);
  const seconds = Math.floor(durationSec % 60);
  const ms = Math.round((durationSec - Math.floor(durationSec)) * 1000);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio Duration Calculator</h2>
        <p className="text-sm text-slate-500">Calculate playback duration from total digital sample count and sample rate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Total Audio Samples</label>
          <input type="number" value={samples} onChange={(e) => setSamples(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Sample Rate (Hz)</label>
          <select value={sampleRate} onChange={(e) => setSampleRate(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="44100">44,100 Hz (CD Audio)</option>
            <option value="48000">48,000 Hz (Studio / Film)</option>
            <option value="96000">96,000 Hz (High Resolution)</option>
            <option value="22050">22,050 Hz (Voice)</option>
          </select>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">Exact Duration</span>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{minutes}m {seconds}s {ms}ms</p>
        <p className="text-xs text-slate-500 mt-1">{durationSec} total seconds</p>
      </div>
    </div>
  );
};

// ==========================================
// 15. Audio File Size Calculator
// ==========================================
export const AudioFileSizeCalculator: React.FC = () => {
  const [durationMin, setDurationMin] = useState(5);
  const [format, setFormat] = useState<'wav16' | 'mp3-320' | 'mp3-128'>('wav16');

  let sizeMb = 0;
  const durationSec = durationMin * 60;
  if (format === 'wav16') {
    // 44100 * 2 channels * 2 bytes = 176400 bytes/sec
    sizeMb = (durationSec * 176400) / (1024 * 1024);
  } else if (format === 'mp3-320') {
    sizeMb = (durationSec * (320000 / 8)) / (1024 * 1024);
  } else {
    sizeMb = (durationSec * (128000 / 8)) / (1024 * 1024);
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Audio File Size Calculator</h2>
        <p className="text-sm text-slate-500">Estimate file sizes across uncompressed WAV and compressed MP3 bitrates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Duration (Minutes)</label>
          <input type="number" min="1" max="600" value={durationMin} onChange={(e) => setDurationMin(Number(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Encoding Format & Bitrate</label>
          <select value={format} onChange={(e: any) => setFormat(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <option value="wav16">16-bit 44.1kHz Stereo WAV (Uncompressed)</option>
            <option value="mp3-320">320 kbps MP3 (Highest Quality)</option>
            <option value="mp3-128">128 kbps MP3 (Standard Broadcast)</option>
          </select>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
        <span className="text-xs font-bold uppercase text-slate-400">Projected File Size</span>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{sizeMb.toFixed(2)} MB</p>
      </div>
    </div>
  );
};
