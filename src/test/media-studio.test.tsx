import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { audioBufferToWav, audioBufferToWavBytes } from '../utils/media/wavEncoder';
import { encodeGif, encodeGifBytes } from '../utils/media/gifEncoder';
import {
  inspectMagicBytes,
  calculateAspectRatio,
  calculateBitrate,
  calculateMediaSize,
  gcd
} from '../utils/media/mediaFileUtils';
import {
  ImageDpiCalculator,
  PassportPhotoMaker,
  SocialMediaImageResizer
} from '../components/tools/media/ImageStudioTools';
import {
  AudioDurationCalculator,
  AudioFileSizeCalculator
} from '../components/tools/media/AudioTools';
import {
  VideoDurationCalculator
} from '../components/tools/media/VideoTools';
import {
  AspectRatioCalculator,
  FileBitrateCalculator,
  FrameRateCalculator,
  MediaFileSizeEstimator
} from '../components/tools/media/MediaFileUtilities';
import { MediaStudioPage } from '../pages/MediaStudioPage';

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }
  return new Response(blob).arrayBuffer();
}

describe('Media Studio Test Suite', () => {
  describe('1. WAV / PCM Audio Encoder', () => {
    it('creates standard RIFF/WAVE header and correct byte length', () => {
      // Mock simple AudioBuffer
      const sampleRate = 44100;
      const numChannels = 1;
      const length = 1000;
      const channelData = new Float32Array(length);
      for (let i = 0; i < length; i++) {
        channelData[i] = Math.sin((i / sampleRate) * 440 * 2 * Math.PI);
      }

      const mockBuffer: any = {
        sampleRate,
        numberOfChannels: numChannels,
        length,
        duration: length / sampleRate,
        getChannelData: () => channelData
      };

      const bytes = audioBufferToWavBytes(mockBuffer);
      // 44 header bytes + 1000 samples * 2 bytes = 2044 bytes
      expect(bytes.length).toBe(44 + length * 2);

      const riff = String.fromCharCode(...bytes.subarray(0, 4));
      const wave = String.fromCharCode(...bytes.subarray(8, 12));
      expect(riff).toBe('RIFF');
      expect(wave).toBe('WAVE');

      const blob = audioBufferToWav(mockBuffer);
      expect(blob.type).toBe('audio/wav');
    });
  });

  describe('2. Pure TypeScript GIF89a Encoder', () => {
    it('encodes ImageData frames into valid GIF89a bytes', () => {
      const width = 10;
      const height = 10;
      const rgba = new Uint8ClampedArray(width * height * 4);
      // fill red frame
      for (let i = 0; i < rgba.length; i += 4) {
        rgba[i] = 255;
        rgba[i + 1] = 0;
        rgba[i + 2] = 0;
        rgba[i + 3] = 255;
      }

      const mockImageData: any = { data: rgba, width, height };
      const frames = [
        { imageData: mockImageData, delayMs: 100 },
        { imageData: mockImageData, delayMs: 100 }
      ];

      const bytes = encodeGifBytes(frames, width, height);
      expect(bytes.length).toBeGreaterThan(50);

      const header = String.fromCharCode(...bytes.subarray(0, 6));
      expect(header).toBe('GIF89a');

      const blob = encodeGif(frames, width, height);
      expect(blob.type).toBe('image/gif');
    });
  });

  describe('3. Binary Magic Byte Inspector', () => {
    it('identifies JPEG magic numbers (FF D8 FF)', () => {
      const buf = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]).buffer;
      const sig = inspectMagicBytes(buf);
      expect(sig.extension).toBe('jpg');
      expect(sig.mime).toBe('image/jpeg');
      expect(sig.magicMatch).toBe(true);
    });

    it('identifies PNG magic numbers (89 50 4E 47)', () => {
      const buf = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).buffer;
      const sig = inspectMagicBytes(buf);
      expect(sig.extension).toBe('png');
      expect(sig.mime).toBe('image/png');
      expect(sig.magicMatch).toBe(true);
    });

    it('identifies GIF89a magic numbers', () => {
      const buf = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61]).buffer;
      const sig = inspectMagicBytes(buf);
      expect(sig.extension).toBe('gif');
      expect(sig.mime).toBe('image/gif');
      expect(sig.magicMatch).toBe(true);
    });

    it('identifies WebM EBML header (1A 45 DF A3)', () => {
      const buf = new Uint8Array([0x1a, 0x45, 0xdf, 0xa3, 0x9f]).buffer;
      const sig = inspectMagicBytes(buf);
      expect(sig.extension).toBe('webm');
      expect(sig.category).toBe('video');
    });

    it('identifies MP3 ID3 header', () => {
      const buf = new Uint8Array([0x49, 0x44, 0x33, 0x04, 0x00]).buffer;
      const sig = inspectMagicBytes(buf);
      expect(sig.extension).toBe('mp3');
      expect(sig.category).toBe('audio');
    });
  });

  describe('4. Media Math & Dimension Formulas', () => {
    it('computes Greatest Common Divisor correctly', () => {
      expect(gcd(1920, 1080)).toBe(120);
      expect(gcd(800, 600)).toBe(200);
      expect(gcd(1080, 1080)).toBe(1080);
    });

    it('calculates aspect ratio and closest standard format', () => {
      const hd = calculateAspectRatio(1920, 1080);
      expect(hd.ratioText).toBe('16:9');
      expect(hd.closestStandard).toContain('16:9');

      const vert = calculateAspectRatio(1080, 1920);
      expect(vert.ratioText).toBe('9:16');
      expect(vert.closestStandard).toContain('9:16');

      const square = calculateAspectRatio(1080, 1080);
      expect(square.ratioText).toBe('1:1');
      expect(square.closestStandard).toContain('1:1');
    });

    it('calculates bitrate accurately', () => {
      // 15 MB in 60 seconds = (15 * 1024 * 1024 * 8) / 60 ≈ 2,097,152 bps ≈ 2.1 Mbps
      const br = calculateBitrate(15 * 1024 * 1024, 60);
      expect(br.mbps).toBeCloseTo(2.1, 1);
      expect(br.kbps).toBeGreaterThan(2000);
    });

    it('calculates media file size accurately', () => {
      // 5000 kbps for 120 seconds = 5000 * 1000 * 120 / 8 bytes ≈ 75 MB
      const size = calculateMediaSize(5000, 120);
      expect(size.megaBytes).toBeCloseTo(71.5, 0.5);
    });
  });

  describe('5. UI Components & Render Verification', () => {
    it('renders ImageDpiCalculator with default 300 DPI calculations', () => {
      render(<ImageDpiCalculator />);
      expect(screen.getByText(/Image DPI Calculator/i)).toBeInTheDocument();
      // 3000px / 300 DPI = 10"
      expect(screen.getByText(/10" × 6.67"/i)).toBeInTheDocument();
    });

    it('renders AudioDurationCalculator with samples and rate', () => {
      render(<AudioDurationCalculator />);
      expect(screen.getByText(/Audio Duration Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Audio Samples/i)).toBeInTheDocument();
    });

    it('renders AudioFileSizeCalculator with format picker', () => {
      render(<AudioFileSizeCalculator />);
      expect(screen.getByText(/Audio File Size Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Projected File Size/i)).toBeInTheDocument();
    });

    it('renders VideoDurationCalculator with frame rates', () => {
      render(<VideoDurationCalculator />);
      expect(screen.getByText(/Video Duration Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Duration/i)).toBeInTheDocument();
    });

    it('renders AspectRatioCalculator with width and height', () => {
      render(<AspectRatioCalculator />);
      expect(screen.getByText(/Aspect Ratio Calculator/i)).toBeInTheDocument();
      expect(screen.getByText('16:9')).toBeInTheDocument();
    });

    it('renders FileBitrateCalculator with MB and duration inputs', () => {
      render(<FileBitrateCalculator />);
      expect(screen.getByText(/File Bitrate Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Bitrate in Mbps/i)).toBeInTheDocument();
    });

    it('renders FrameRateCalculator with millisecond frame budget', () => {
      render(<FrameRateCalculator />);
      expect(screen.getByText(/Frame Rate Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/16.67 ms/i)).toBeInTheDocument();
    });

    it('renders MediaFileSizeEstimator with bitrate and duration', () => {
      render(<MediaFileSizeEstimator />);
      expect(screen.getByText(/Media File Size Estimator/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated Size in Megabytes/i)).toBeInTheDocument();
    });
  });

  describe('6. Media Studio Hub Page & Filter Navigation', () => {
    it('renders MediaStudioPage and filters tools by category tabs', () => {
      render(<MediaStudioPage />);
      expect(screen.getByText(/Professional Media Studio in Your Browser/i)).toBeInTheDocument();

      // Click Audio Tools tab
      const audioTab = screen.getByRole('button', { name: /Audio Tools/i });
      fireEvent.click(audioTab);

      // Verify audio tools are visible
      expect(screen.getByText(/Audio Cutter/i)).toBeInTheDocument();
      expect(screen.getByText(/Audio Recorder/i)).toBeInTheDocument();
    });

    it('filters tools by search input', () => {
      render(<MediaStudioPage />);
      const searchInput = screen.getByPlaceholderText(/Search media tools.../i);
      fireEvent.change(searchInput, { target: { value: 'watermark' } });

      expect(screen.getByText(/Image Watermark Maker/i)).toBeInTheDocument();
    });
  });
});
