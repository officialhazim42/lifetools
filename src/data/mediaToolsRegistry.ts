import { lazy } from 'react';
import { ToolItem } from '../types';

// Lazy-loaded component factories for Media Studio
// Section 1: Image Studio
const ImageBgColorChanger = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageBgColorChanger })));
const ImageWatermarkMaker = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageWatermarkMaker })));
const ImageBorderGenerator = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageBorderGenerator })));
const ImageRoundedCorners = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageRoundedCorners })));
const ImageFrameMaker = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageFrameMaker })));
const ImageCollageMaker = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageCollageMaker })));
const ImageComparisonTool = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageComparisonTool })));
const ImageBlurTool = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageBlurTool })));
const ImagePixelator = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImagePixelator })));
const ImageBrightnessAdjuster = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageBrightnessAdjuster })));
const ImageContrastAdjuster = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageContrastAdjuster })));
const ImageSaturationAdjuster = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageSaturationAdjuster })));
const ImageGrayscaleConverter = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageGrayscaleConverter })));
const ImageColorInverter = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageColorInverter })));
const ImageDpiCalculator = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.ImageDpiCalculator })));
const PassportPhotoMaker = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.PassportPhotoMaker })));
const IdPhotoSheetGenerator = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.IdPhotoSheetGenerator })));
const SocialMediaImageResizer = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.SocialMediaImageResizer })));
const YoutubeThumbnailMaker = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.YoutubeThumbnailMaker })));
const InstagramPostMaker = lazy(() => import('../components/tools/media/ImageStudioTools').then(m => ({ default: m.InstagramPostMaker })));

// Section 2: Audio Tools
const AudioCutter = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioCutter })));
const AudioTrimmer = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioTrimmer })));
const AudioMerger = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioMerger })));
const AudioConverter = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioConverter })));
const AudioVolumeChanger = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioVolumeChanger })));
const AudioSpeedChanger = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioSpeedChanger })));
const AudioPitchChanger = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioPitchChanger })));
const AudioReverse = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioReverse })));
const AudioFadeInOut = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioFadeInOut })));
const AudioRecorder = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioRecorder })));
const AudioWaveformViewer = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioWaveformViewer })));
const AudioMetadataViewer = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioMetadataViewer })));
const AudioSilenceDetector = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioSilenceDetector })));
const AudioDurationCalculator = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioDurationCalculator })));
const AudioFileSizeCalculator = lazy(() => import('../components/tools/media/AudioTools').then(m => ({ default: m.AudioFileSizeCalculator })));

// Section 3: Video Tools
const VideoTrimmer = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoTrimmer })));
const VideoCutter = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoCutter })));
const VideoMerger = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoMerger })));
const VideoCompressor = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoCompressor })));
const VideoResizer = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoResizer })));
const VideoRotator = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoRotator })));
const VideoMuter = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoMuter })));
const VideoSpeedController = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoSpeedController })));
const VideoThumbnailExtractor = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoThumbnailExtractor })));
const VideoFrameExtractor = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoFrameExtractor })));
const VideoToGif = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoToGif })));
const GifToVideo = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.GifToVideo })));
const VideoMetadataViewer = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoMetadataViewer })));
const VideoAspectRatioConverter = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoAspectRatioConverter })));
const VideoDurationCalculator = lazy(() => import('../components/tools/media/VideoTools').then(m => ({ default: m.VideoDurationCalculator })));

// Section 4: GIF & Animation Tools
const GifMaker = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifMaker })));
const GifResizer = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifResizer })));
const GifCompressor = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifCompressor })));
const GifCropper = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifCropper })));
const GifSpeedController = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifSpeedController })));
const GifFrameExtractor = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifFrameExtractor })));
const GifReverser = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifReverser })));
const GifOptimizer = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifOptimizer })));
const ImageSequenceToGif = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.ImageSequenceToGif })));
const GifToImageSequence = lazy(() => import('../components/tools/media/GifAnimationTools').then(m => ({ default: m.GifToImageSequence })));

// Section 5: Media File Utilities
const MediaFileInspector = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.MediaFileInspector })));
const AudioFormatIdentifier = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.AudioFormatIdentifier })));
const VideoFormatIdentifier = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.VideoFormatIdentifier })));
const MediaMetadataExtractor = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.MediaMetadataExtractor })));
const MediaDurationChecker = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.MediaDurationChecker })));
const MediaResolutionChecker = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.MediaResolutionChecker })));
const FileBitrateCalculator = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.FileBitrateCalculator })));
const AspectRatioCalculator = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.AspectRatioCalculator })));
const FrameRateCalculator = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.FrameRateCalculator })));
const MediaFileSizeEstimator = lazy(() => import('../components/tools/media/MediaFileUtilities').then(m => ({ default: m.MediaFileSizeEstimator })));

export const MEDIA_TOOLS_REGISTRY: ToolItem[] = [
  // ==========================================
  // SECTION 1: IMAGE EDITING STUDIO (20)
  // ==========================================
  {
    id: 'image-bg-color-changer',
    name: 'Image Background Color Changer',
    shortDescription: 'Replace transparent backgrounds or add solid studio background colors behind photos.',
    category: 'media',
    iconName: 'Palette',
    keywords: ['image background color', 'change background color', 'transparent to white', 'photo background changer'],
    offlineAvailable: true,
    instructions: ['Upload an image with transparency or photo', 'Pick a background color or preset', 'Download result in PNG or JPEG'],
    relatedTools: ['image-watermark-maker', 'image-border-generator'],
    component: ImageBgColorChanger
  },
  {
    id: 'image-watermark-maker',
    name: 'Image Watermark Maker',
    shortDescription: 'Add text watermarks or repeating tiled copyright patterns with opacity and rotation controls.',
    category: 'media',
    iconName: 'Shield',
    keywords: ['image watermark maker', 'watermark photo', 'copyright watermark', 'add logo to photo'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Type watermark text and set opacity/position', 'Download protected image'],
    relatedTools: ['image-bg-color-changer', 'image-frame-maker'],
    component: ImageWatermarkMaker
  },
  {
    id: 'image-border-generator',
    name: 'Image Border Generator',
    shortDescription: 'Apply solid borders or Polaroid-style bottom margins around photos.',
    category: 'media',
    iconName: 'Crop',
    keywords: ['image border generator', 'add border to photo', 'polaroid border', 'photo frame border'],
    offlineAvailable: true,
    instructions: ['Upload image', 'Adjust border width and color', 'Download bordered photo'],
    relatedTools: ['image-frame-maker', 'image-rounded-corners'],
    component: ImageBorderGenerator
  },
  {
    id: 'image-rounded-corners',
    name: 'Image Rounded Corners',
    shortDescription: 'Smoothly round photo corners or generate circular avatars with true alpha transparency.',
    category: 'media',
    iconName: 'Sparkles',
    keywords: ['rounded corners image', 'round photo corners', 'circular avatar maker', 'round image online'],
    offlineAvailable: true,
    instructions: ['Upload image', 'Adjust corner radius or select circle avatar mode', 'Download transparent PNG'],
    relatedTools: ['image-border-generator', 'image-collage-maker'],
    component: ImageRoundedCorners
  },
  {
    id: 'image-frame-maker',
    name: 'Image Frame Maker',
    shortDescription: 'Decorate photos with classic wood, metallic gold, neon glow, or vintage gallery frames.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['image frame maker', 'photo frame online', 'gold frame', 'art gallery frame'],
    offlineAvailable: true,
    instructions: ['Upload image', 'Select frame style and border thickness', 'Download framed photo'],
    relatedTools: ['image-border-generator', 'image-watermark-maker'],
    component: ImageFrameMaker
  },
  {
    id: 'image-collage-maker',
    name: 'Image Collage Maker',
    shortDescription: 'Combine multiple images into 2-column, 2-row, 3-column, or 4-grid photo collages.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['image collage maker', 'photo collage online', 'grid photos', 'combine multiple pictures'],
    offlineAvailable: true,
    instructions: ['Upload up to 4 images', 'Choose layout grid and gap spacing', 'Download combined collage'],
    relatedTools: ['image-comparison-tool', 'image-frame-maker'],
    component: ImageCollageMaker
  },
  {
    id: 'image-comparison-tool',
    name: 'Image Comparison Tool',
    shortDescription: 'Compare Before and After photographs with an interactive draggable split slider.',
    category: 'media',
    iconName: 'Eye',
    keywords: ['image comparison tool', 'before after slider', 'compare photos', 'diff image visualizer'],
    offlineAvailable: true,
    instructions: ['Upload Image A (Before) and Image B (After)', 'Drag horizontal divider left and right to inspect differences'],
    relatedTools: ['image-collage-maker', 'image-blur-tool'],
    component: ImageComparisonTool
  },
  {
    id: 'image-blur-tool',
    name: 'Image Blur Tool',
    shortDescription: 'Apply adjustable Gaussian blur to soften images or censor sensitive areas.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['image blur tool', 'blur photo', 'gaussian blur online', 'soften image'],
    offlineAvailable: true,
    instructions: ['Upload image', 'Adjust blur radius slider', 'Download blurred image'],
    relatedTools: ['image-pixelator', 'image-contrast-adjuster'],
    component: ImageBlurTool
  },
  {
    id: 'image-pixelator',
    name: 'Image Pixelator',
    shortDescription: 'Transform photos into retro 8-bit pixel art or pixelate sensitive information.',
    category: 'media',
    iconName: 'Sparkles',
    keywords: ['image pixelator', 'pixelate photo', '8-bit photo filter', 'censor photo pixel'],
    offlineAvailable: true,
    instructions: ['Upload image', 'Adjust block size', 'Download pixelated photo'],
    relatedTools: ['image-blur-tool', 'image-grayscale-converter'],
    component: ImagePixelator
  },
  {
    id: 'image-brightness-adjuster',
    name: 'Image Brightness Adjuster',
    shortDescription: 'Brighten dark photos or balance exposures with precision dynamic sliders.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['image brightness adjuster', 'brighten image', 'darken photo', 'exposure adjustment'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Slide brightness slider left/right', 'Download enhanced image'],
    relatedTools: ['image-contrast-adjuster', 'image-saturation-adjuster'],
    component: ImageBrightnessAdjuster
  },
  {
    id: 'image-contrast-adjuster',
    name: 'Image Contrast Adjuster',
    shortDescription: 'Deepen shadows and boost highlights with fine-tuned contrast enhancement.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['image contrast adjuster', 'increase contrast photo', 'dynamic range image'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Adjust contrast intensity', 'Download balanced image'],
    relatedTools: ['image-brightness-adjuster', 'image-saturation-adjuster'],
    component: ImageContrastAdjuster
  },
  {
    id: 'image-saturation-adjuster',
    name: 'Image Saturation Adjuster',
    shortDescription: 'Make colors pop with vibrant saturation or desaturate toward monochrome.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['image saturation adjuster', 'vibrant color filter', 'boost colors photo', 'desaturate image'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Adjust saturation percentage', 'Download vivid image'],
    relatedTools: ['image-brightness-adjuster', 'image-contrast-adjuster'],
    component: ImageSaturationAdjuster
  },
  {
    id: 'image-grayscale-converter',
    name: 'Image Grayscale Converter',
    shortDescription: 'Convert full-color photographs into elegant black and white monochrome images.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['image grayscale converter', 'black and white photo', 'b&w converter', 'monochrome filter'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Adjust grayscale intensity', 'Download B&W image'],
    relatedTools: ['image-color-inverter', 'image-contrast-adjuster'],
    component: ImageGrayscaleConverter
  },
  {
    id: 'image-color-inverter',
    name: 'Image Color Inverter',
    shortDescription: 'Invert RGB color channels to create photographic negative effects.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['image color inverter', 'invert colors online', 'photo negative maker', 'negative image'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Apply negative color inversion', 'Download inverted image'],
    relatedTools: ['image-grayscale-converter', 'image-brightness-adjuster'],
    component: ImageColorInverter
  },
  {
    id: 'image-dpi-calculator',
    name: 'Image DPI Calculator',
    shortDescription: 'Calculate physical print dimensions in inches and centimeters from pixel dimensions and DPI.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['image dpi calculator', 'pixel to print size', 'print resolution calculator', '300 dpi print size'],
    offlineAvailable: true,
    instructions: ['Enter width and height in pixels', 'Choose target print DPI (72, 150, 300, 600)', 'Inspect print size in inches and cm'],
    relatedTools: ['passport-photo-maker', 'id-photo-sheet-generator'],
    component: ImageDpiCalculator
  },
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    shortDescription: 'Format biometric passport and visa photos for US (2x2 in), UK/Europe (35x45mm), and India.',
    category: 'media',
    iconName: 'Camera',
    keywords: ['passport photo maker', 'biometric photo crop', 'us visa photo 2x2', 'schengen photo 35x45'],
    offlineAvailable: true,
    instructions: ['Upload portrait photo', 'Select country passport standard', 'Align face to guide and download at 300 DPI'],
    relatedTools: ['id-photo-sheet-generator', 'image-dpi-calculator'],
    component: PassportPhotoMaker
  },
  {
    id: 'id-photo-sheet-generator',
    name: 'ID Photo Sheet Generator',
    shortDescription: 'Tile multiple passport photos onto printable 4x6 inch photo paper with cutting guidelines.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['id photo sheet generator', 'passport photo 4x6 print sheet', 'tile passport photos', 'print passport pictures'],
    offlineAvailable: true,
    instructions: ['Upload single passport photo', 'Choose 6 or 8 photo layout', 'Download printable 4x6 inch photo sheet'],
    relatedTools: ['passport-photo-maker', 'image-dpi-calculator'],
    component: IdPhotoSheetGenerator
  },
  {
    id: 'social-media-image-resizer',
    name: 'Social Media Image Resizer',
    shortDescription: 'Quickly resize photos to exact dimensions for Instagram, YouTube, and Twitter/X.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['social media image resizer', 'instagram post size', 'youtube thumbnail size', 'twitter header size'],
    offlineAvailable: true,
    instructions: ['Upload photo', 'Select target social platform preset', 'Download perfectly cropped image'],
    relatedTools: ['youtube-thumbnail-maker', 'instagram-post-maker'],
    component: SocialMediaImageResizer
  },
  {
    id: 'youtube-thumbnail-maker',
    name: 'YouTube Thumbnail Maker',
    shortDescription: 'Design high-converting 1280x720 YouTube video thumbnails with badges and bold typography.',
    category: 'media',
    iconName: 'Camera',
    keywords: ['youtube thumbnail maker', 'create youtube cover', '1280x720 thumbnail generator', 'custom thumbnail'],
    offlineAvailable: true,
    instructions: ['Optional backdrop upload', 'Enter main headline and tag badge', 'Download ready-to-upload 1280x720 JPEG'],
    relatedTools: ['social-media-image-resizer', 'instagram-post-maker'],
    component: YoutubeThumbnailMaker
  },
  {
    id: 'instagram-post-maker',
    name: 'Instagram Post Maker',
    shortDescription: 'Create aesthetic square 1080x1080 quote cards and social graphic posts with typography presets.',
    category: 'media',
    iconName: 'Camera',
    keywords: ['instagram post maker', 'square quote generator', '1080x1080 graphic creator', 'aesthetic post maker'],
    offlineAvailable: true,
    instructions: ['Enter quote text and author', 'Optionally upload backdrop image', 'Download 1080x1080 PNG'],
    relatedTools: ['youtube-thumbnail-maker', 'social-media-image-resizer'],
    component: InstagramPostMaker
  },

  // ==========================================
  // SECTION 2: AUDIO TOOLS (15)
  // ==========================================
  {
    id: 'audio-cutter',
    name: 'Audio Cutter',
    shortDescription: 'Extract snippets or cut unwanted sections from audio files with visual waveform cues.',
    category: 'media',
    iconName: 'Scissors',
    keywords: ['audio cutter', 'cut mp3 online', 'extract audio clip', 'audio trimmer'],
    offlineAvailable: true,
    instructions: ['Upload audio file', 'Set start and end markers on waveform', 'Download cut segment in WAV'],
    relatedTools: ['audio-trimmer', 'audio-merger'],
    component: AudioCutter
  },
  {
    id: 'audio-trimmer',
    name: 'Audio Trimmer',
    shortDescription: 'Precision start and end trimming for podcasts, ringtones, and vocal tracks.',
    category: 'media',
    iconName: 'Scissors',
    keywords: ['audio trimmer', 'trim audio file', 'ringtone maker', 'crop audio'],
    offlineAvailable: true,
    instructions: ['Upload audio track', 'Select start/end times', 'Download trimmed WAV audio'],
    relatedTools: ['audio-cutter', 'audio-volume-changer'],
    component: AudioTrimmer
  },
  {
    id: 'audio-merger',
    name: 'Audio Merger',
    shortDescription: 'Concatenate multiple audio tracks into a single continuous WAV audio presentation.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['audio merger', 'join audio files', 'combine songs', 'concatenate mp3'],
    offlineAvailable: true,
    instructions: ['Select 2 or more audio files', 'Review list', 'Click Merge & Download'],
    relatedTools: ['audio-cutter', 'audio-converter'],
    component: AudioMerger
  },
  {
    id: 'audio-converter',
    name: 'Audio Converter',
    shortDescription: 'Decode any browser-supported audio (MP3, AAC, M4A, OGG) to uncompressed 16-bit PCM WAV.',
    category: 'media',
    iconName: 'FileAudio',
    keywords: ['audio converter', 'convert mp3 to wav', 'audio format converter', 'pcm wav converter'],
    offlineAvailable: true,
    instructions: ['Select audio file', 'Choose stereo or mono channel output', 'Download WAV audio'],
    relatedTools: ['audio-volume-changer', 'audio-merger'],
    component: AudioConverter
  },
  {
    id: 'audio-volume-changer',
    name: 'Audio Volume Changer',
    shortDescription: 'Amplify or attenuate decibel levels of audio recordings with peak limiting.',
    category: 'media',
    iconName: 'Volume2',
    keywords: ['audio volume changer', 'boost audio volume', 'increase mp3 loudness', 'gain adjuster'],
    offlineAvailable: true,
    instructions: ['Upload audio file', 'Adjust volume multiplier', 'Download amplified audio'],
    relatedTools: ['audio-speed-changer', 'audio-fade-in-out'],
    component: AudioVolumeChanger
  },
  {
    id: 'audio-speed-changer',
    name: 'Audio Speed Changer',
    shortDescription: 'Speed up or slow down audio playback rates (0.5x to 2.5x) with buffer resampling.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['audio speed changer', 'speed up audio', 'slow down music', 'playback rate audio'],
    offlineAvailable: true,
    instructions: ['Upload audio', 'Choose playback speed multiplier', 'Download resampled WAV'],
    relatedTools: ['audio-pitch-changer', 'audio-volume-changer'],
    component: AudioSpeedChanger
  },
  {
    id: 'audio-pitch-changer',
    name: 'Audio Pitch Changer',
    shortDescription: 'Shift musical audio pitch up or down without altering the source file on disk.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['audio pitch changer', 'shift audio pitch', 'tune vocals', 'transpose audio'],
    offlineAvailable: true,
    instructions: ['Upload audio file', 'Adjust pitch speed slider', 'Download adjusted audio'],
    relatedTools: ['audio-speed-changer', 'audio-reverse'],
    component: AudioPitchChanger
  },
  {
    id: 'audio-reverse',
    name: 'Audio Reverse',
    shortDescription: 'Reverse audio backwards in time for backwards speech and sound effects.',
    category: 'media',
    iconName: 'RotateCcw',
    keywords: ['audio reverse', 'play audio backwards', 'reverse sound effect', 'backwards audio maker'],
    offlineAvailable: true,
    instructions: ['Upload audio file', 'Download reversed WAV'],
    relatedTools: ['audio-speed-changer', 'audio-fade-in-out'],
    component: AudioReverse
  },
  {
    id: 'audio-fade-in-out',
    name: 'Audio Fade In/Out',
    shortDescription: 'Apply smooth volume fade-in and fade-out envelopes to prevent audio clicks.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['audio fade in out', 'fade audio track', 'smooth audio transition', 'fade out mp3'],
    offlineAvailable: true,
    instructions: ['Upload audio', 'Set fade duration in seconds', 'Download faded WAV audio'],
    relatedTools: ['audio-volume-changer', 'audio-cutter'],
    component: AudioFadeInOut
  },
  {
    id: 'audio-recorder',
    name: 'Audio Recorder',
    shortDescription: 'Record voice memos and audio directly from your microphone with zero uploads.',
    category: 'media',
    iconName: 'Mic',
    keywords: ['audio recorder', 'voice recorder online', 'record microphone webm', 'mic recording'],
    offlineAvailable: true,
    instructions: ['Click Start Recording', 'Speak into microphone', 'Stop and download recording'],
    relatedTools: ['audio-cutter', 'audio-waveform-viewer'],
    component: AudioRecorder
  },
  {
    id: 'audio-waveform-viewer',
    name: 'Audio Waveform Viewer',
    shortDescription: 'Render interactive high-resolution audio waveform peaks on canvas.',
    category: 'media',
    iconName: 'Activity',
    keywords: ['audio waveform viewer', 'visualize audio peaks', 'soundwave visualizer', 'audio amplitude graph'],
    offlineAvailable: true,
    instructions: ['Upload audio track', 'Inspect visual peak distribution across duration'],
    relatedTools: ['audio-cutter', 'audio-metadata-viewer'],
    component: AudioWaveformViewer
  },
  {
    id: 'audio-metadata-viewer',
    name: 'Audio Metadata Viewer',
    shortDescription: 'Inspect sample rate, channel count, duration, and audio stream properties.',
    category: 'media',
    iconName: 'FileAudio',
    keywords: ['audio metadata viewer', 'audio properties inspector', 'sample rate checker', 'audio duration inspector'],
    offlineAvailable: true,
    instructions: ['Upload audio file', 'View sample rate, channels, and duration'],
    relatedTools: ['audio-duration-calculator', 'media-file-inspector'],
    component: AudioMetadataViewer
  },
  {
    id: 'audio-silence-detector',
    name: 'Audio Silence Detector',
    shortDescription: 'Detect gaps of silence in podcasts and vocal tracks based on RMS decibel thresholds.',
    category: 'media',
    iconName: 'Activity',
    keywords: ['audio silence detector', 'detect silence in audio', 'podcast silence finder', 'audio threshold analyzer'],
    offlineAvailable: true,
    instructions: ['Upload audio', 'Adjust silence decibel threshold', 'Inspect list of silent timestamps'],
    relatedTools: ['audio-cutter', 'audio-waveform-viewer'],
    component: AudioSilenceDetector
  },
  {
    id: 'audio-duration-calculator',
    name: 'Audio Duration Calculator',
    shortDescription: 'Calculate playback running time from sample counts and digital sample rates.',
    category: 'media',
    iconName: 'Clock',
    keywords: ['audio duration calculator', 'samples to time calculator', 'sample rate duration', 'audio math'],
    offlineAvailable: true,
    instructions: ['Enter total sample count', 'Select sample rate (44.1k, 48k, etc.)', 'View exact duration'],
    relatedTools: ['audio-file-size-calculator', 'video-duration-calculator'],
    component: AudioDurationCalculator
  },
  {
    id: 'audio-file-size-calculator',
    name: 'Audio File Size Calculator',
    shortDescription: 'Estimate file sizes across uncompressed WAV and compressed MP3 bitrates.',
    category: 'media',
    iconName: 'HardDrive',
    keywords: ['audio file size calculator', 'estimate mp3 size', 'wav file size formula', 'audio storage calculator'],
    offlineAvailable: true,
    instructions: ['Enter duration in minutes', 'Select bitrate/encoding format', 'Inspect estimated size in MB'],
    relatedTools: ['audio-duration-calculator', 'file-bitrate-calculator'],
    component: AudioFileSizeCalculator
  },

  // ==========================================
  // SECTION 3: VIDEO TOOLS (15)
  // ==========================================
  {
    id: 'video-trimmer',
    name: 'Video Trimmer',
    shortDescription: 'Trim start and end points of video clips with precision canvas recording.',
    category: 'media',
    iconName: 'Scissors',
    keywords: ['video trimmer', 'trim video online', 'cut video clip', 'trim mp4 webm'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Set start and end sliders', 'Click Export Trimmed Video'],
    relatedTools: ['video-cutter', 'video-compressor'],
    component: VideoTrimmer
  },
  {
    id: 'video-cutter',
    name: 'Video Cutter',
    shortDescription: 'Cut out unwanted clips or extract video highlights directly in browser.',
    category: 'media',
    iconName: 'Scissors',
    keywords: ['video cutter', 'slice video clip', 'video editor online', 'split video'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Select segment to extract', 'Download trimmed video'],
    relatedTools: ['video-trimmer', 'video-compressor'],
    component: VideoCutter
  },
  {
    id: 'video-merger',
    name: 'Video Merger',
    shortDescription: 'Queue and merge multiple video files into a single continuous video.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['video merger', 'combine videos online', 'join video clips', 'concatenate mp4'],
    offlineAvailable: true,
    instructions: ['Select 2 or more videos', 'Review queue', 'Download merged video stream'],
    relatedTools: ['video-trimmer', 'video-compressor'],
    component: VideoMerger
  },
  {
    id: 'video-compressor',
    name: 'Video Compressor',
    shortDescription: 'Downscale video resolution and adjust bitrates to dramatically shrink file size.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['video compressor', 'compress mp4 online', 'reduce video size', 'downscale video 720p'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Select target resolution (720p, 480p, 360p)', 'Download compressed video'],
    relatedTools: ['video-resizer', 'video-trimmer'],
    component: VideoCompressor
  },
  {
    id: 'video-resizer',
    name: 'Video Resizer',
    shortDescription: 'Resize video resolution dimensions to standard 720p, 480p, and 360p profiles.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['video resizer', 'resize video dimensions', 'scale video resolution', 'change video resolution'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Choose target resolution profile', 'Download resized video'],
    relatedTools: ['video-compressor', 'video-aspect-ratio-converter'],
    component: VideoResizer
  },
  {
    id: 'video-rotator',
    name: 'Video Rotator',
    shortDescription: 'Rotate smartphone videos 90°, 180°, or 270° with orientation correction.',
    category: 'media',
    iconName: 'RotateCw',
    keywords: ['video rotator', 'rotate video 90 degrees', 'fix upside down video', 'flip video online'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Select rotation angle (90°, 180°, 270°)', 'Preview and save rotated video'],
    relatedTools: ['video-aspect-ratio-converter', 'video-compressor'],
    component: VideoRotator
  },
  {
    id: 'video-muter',
    name: 'Video Muter',
    shortDescription: 'Strip audio tracks from video files and generate pure silent videos.',
    category: 'media',
    iconName: 'VolumeX',
    keywords: ['video muter', 'remove audio from video', 'mute video online', 'silent video generator'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Mute audio track', 'Preview and export muted video'],
    relatedTools: ['video-trimmer', 'video-compressor'],
    component: VideoMuter
  },
  {
    id: 'video-speed-controller',
    name: 'Video Speed Controller',
    shortDescription: 'Speed up video clips or create smooth slow-motion effects (0.25x to 2x).',
    category: 'media',
    iconName: 'FastForward',
    keywords: ['video speed controller', 'speed up video online', 'slow motion video maker', 'timelapse maker'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Select speed multiplier (0.5x, 1.5x, 2x)', 'Download adjusted video'],
    relatedTools: ['video-trimmer', 'video-compressor'],
    component: VideoSpeedController
  },
  {
    id: 'video-thumbnail-extractor',
    name: 'Video Thumbnail Extractor',
    shortDescription: 'Scrub video to any exact frame and capture high-resolution JPEG cover snapshots.',
    category: 'media',
    iconName: 'Camera',
    keywords: ['video thumbnail extractor', 'capture video frame', 'snapshot from video', 'extract cover image from video'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Scrub video to desired frame', 'Click Capture Current Frame and download image'],
    relatedTools: ['video-frame-extractor', 'youtube-thumbnail-maker'],
    component: VideoThumbnailExtractor
  },
  {
    id: 'video-frame-extractor',
    name: 'Video Frame Extractor',
    shortDescription: 'Capture high-fidelity still image snapshots from any video playback position.',
    category: 'media',
    iconName: 'Camera',
    keywords: ['video frame extractor', 'extract frames from mp4', 'video to image converter', 'save video frame as png'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Scrub to timestamp', 'Capture snapshot in original resolution'],
    relatedTools: ['video-thumbnail-extractor', 'video-to-gif'],
    component: VideoFrameExtractor
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    shortDescription: 'Sample video frames and convert short video clips into animated GIFs.',
    category: 'media',
    iconName: 'Film',
    keywords: ['video to gif', 'convert mp4 to gif', 'video gif maker', 'animated gif from video'],
    offlineAvailable: true,
    instructions: ['Upload short video clip (under 5 seconds)', 'Click Generate Animated GIF', 'Download GIF'],
    relatedTools: ['gif-to-video', 'gif-maker'],
    component: VideoToGif
  },
  {
    id: 'gif-to-video',
    name: 'GIF to Video',
    shortDescription: 'Convert animated GIFs into modern WebM video for smooth social playback.',
    category: 'media',
    iconName: 'Film',
    keywords: ['gif to video', 'convert gif to mp4', 'gif to webm', 'looping video from gif'],
    offlineAvailable: true,
    instructions: ['Upload animated GIF or video', 'Generate smooth video presentation', 'Download video'],
    relatedTools: ['video-to-gif', 'gif-maker'],
    component: GifToVideo
  },
  {
    id: 'video-metadata-viewer',
    name: 'Video Metadata Viewer',
    shortDescription: 'Inspect native resolution, aspect ratio, duration, and stream properties.',
    category: 'media',
    iconName: 'Film',
    keywords: ['video metadata viewer', 'video resolution checker', 'mp4 duration inspector', 'video properties'],
    offlineAvailable: true,
    instructions: ['Upload video file', 'Inspect dimensions, duration, and container attributes'],
    relatedTools: ['media-resolution-checker', 'media-file-inspector'],
    component: VideoMetadataViewer
  },
  {
    id: 'video-aspect-ratio-converter',
    name: 'Video Aspect Ratio Converter',
    shortDescription: 'Letterbox or adapt video frames to 16:9 landscape, 9:16 vertical, or 1:1 square.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['video aspect ratio converter', 'resize video to 9:16', '16:9 to square video', 'tiktok video crop'],
    offlineAvailable: true,
    instructions: ['Upload video', 'Choose target aspect ratio (16:9, 9:16, 1:1)', 'Download formatted video'],
    relatedTools: ['aspect-ratio-calculator', 'video-resizer'],
    component: VideoAspectRatioConverter
  },
  {
    id: 'video-duration-calculator',
    name: 'Video Duration Calculator',
    shortDescription: 'Calculate video running time from frame counts and standard frame rates.',
    category: 'media',
    iconName: 'Clock',
    keywords: ['video duration calculator', 'frames to seconds', 'fps video duration', 'timecode calculator'],
    offlineAvailable: true,
    instructions: ['Enter total frame count', 'Select frame rate (24, 25, 30, 60 fps)', 'View exact duration'],
    relatedTools: ['frame-rate-calculator', 'audio-duration-calculator'],
    component: VideoDurationCalculator
  },

  // ==========================================
  // SECTION 4: GIF & ANIMATION TOOLS (10)
  // ==========================================
  {
    id: 'gif-maker',
    name: 'GIF Maker',
    shortDescription: 'Combine multiple photos into an animated loop GIF with customizable frame rates.',
    category: 'media',
    iconName: 'Film',
    keywords: ['gif maker', 'create animated gif', 'pictures to gif', 'make gif online'],
    offlineAvailable: true,
    instructions: ['Select 2 or more images', 'Set frame delay interval', 'Download animated GIF'],
    relatedTools: ['gif-resizer', 'gif-speed-controller'],
    component: GifMaker
  },
  {
    id: 'gif-resizer',
    name: 'GIF Resizer',
    shortDescription: 'Scale animated GIF dimensions while preserving animation frame timing.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['gif resizer', 'resize animated gif', 'shrink gif dimensions', 'scale gif'],
    offlineAvailable: true,
    instructions: ['Upload animated GIF', 'Set scale percentage', 'Download resized GIF'],
    relatedTools: ['gif-compressor', 'gif-maker'],
    component: GifResizer
  },
  {
    id: 'gif-compressor',
    name: 'GIF Compressor',
    shortDescription: 'Downscale color palettes and resolution to reduce animated GIF file size.',
    category: 'media',
    iconName: 'Sliders',
    keywords: ['gif compressor', 'compress gif online', 'reduce gif file size', 'shrink gif mb'],
    offlineAvailable: true,
    instructions: ['Upload GIF', 'Adjust scale percentage to reduce size', 'Download optimized GIF'],
    relatedTools: ['gif-resizer', 'gif-optimizer'],
    component: GifCompressor
  },
  {
    id: 'gif-cropper',
    name: 'GIF Cropper',
    shortDescription: 'Crop spatial bounding boxes across all animated GIF frames simultaneously.',
    category: 'media',
    iconName: 'Crop',
    keywords: ['gif cropper', 'crop animated gif', 'cut borders gif', 'crop gif online'],
    offlineAvailable: true,
    instructions: ['Upload GIF', 'Adjust crop dimensions', 'Save cropped GIF'],
    relatedTools: ['gif-resizer', 'gif-maker'],
    component: GifCropper
  },
  {
    id: 'gif-speed-controller',
    name: 'GIF Speed Controller',
    shortDescription: 'Speed up or slow down GIF animations by altering frame delay timings.',
    category: 'media',
    iconName: 'FastForward',
    keywords: ['gif speed controller', 'speed up gif', 'slow down gif animation', 'change gif fps'],
    offlineAvailable: true,
    instructions: ['Upload GIF', 'Select speed multiplier (0.5x, 1.5x, 2x)', 'Download adjusted GIF'],
    relatedTools: ['gif-reverser', 'gif-maker'],
    component: GifSpeedController
  },
  {
    id: 'gif-frame-extractor',
    name: 'GIF Frame Extractor',
    shortDescription: 'Deconstruct animated GIFs into individual transparent PNG frame sequences.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['gif frame extractor', 'split gif into frames', 'decompose gif to png', 'extract images from gif'],
    offlineAvailable: true,
    instructions: ['Upload animated GIF', 'View extracted keyframes', 'Download individual PNG frames'],
    relatedTools: ['gif-to-image-sequence', 'gif-maker'],
    component: GifFrameExtractor
  },
  {
    id: 'gif-reverser',
    name: 'GIF Reverser',
    shortDescription: 'Reverse the sequence of GIF frames to play backward or create ping-pong loops.',
    category: 'media',
    iconName: 'RotateCcw',
    keywords: ['gif reverser', 'play gif backwards', 'rewind gif online', 'boomerang gif maker'],
    offlineAvailable: true,
    instructions: ['Upload animated GIF', 'Preview reversed animation', 'Download reversed GIF'],
    relatedTools: ['gif-speed-controller', 'gif-maker'],
    component: GifReverser
  },
  {
    id: 'gif-optimizer',
    name: 'GIF Optimizer',
    shortDescription: 'Optimize color tables and strip redundant frame data to optimize GIF loading.',
    category: 'media',
    iconName: 'Sparkles',
    keywords: ['gif optimizer', 'optimize gif online', 'palette optimizer gif', 'fast loading gif'],
    offlineAvailable: true,
    instructions: ['Upload GIF', 'Inspect and apply optimization', 'Download optimized file'],
    relatedTools: ['gif-compressor', 'gif-resizer'],
    component: GifOptimizer
  },
  {
    id: 'image-sequence-to-gif',
    name: 'Image Sequence to GIF',
    shortDescription: 'Batch convert numbered rendered image sequences into smooth animated GIFs.',
    category: 'media',
    iconName: 'Film',
    keywords: ['image sequence to gif', 'png sequence to gif', 'batch photos to animated gif'],
    offlineAvailable: true,
    instructions: ['Upload sequential photos', 'Set frame delay interval', 'Generate animated GIF'],
    relatedTools: ['gif-maker', 'gif-to-image-sequence'],
    component: ImageSequenceToGif
  },
  {
    id: 'gif-to-image-sequence',
    name: 'GIF to Image Sequence',
    shortDescription: 'Convert any animated GIF into an indexed transparent PNG image sequence.',
    category: 'media',
    iconName: 'Layers',
    keywords: ['gif to image sequence', 'convert gif to png sequence', 'gif frame splitter'],
    offlineAvailable: true,
    instructions: ['Upload animated GIF', 'Inspect decomposed frames', 'Download PNG frames'],
    relatedTools: ['gif-frame-extractor', 'image-sequence-to-gif'],
    component: GifToImageSequence
  },

  // ==========================================
  // SECTION 5: MEDIA FILE UTILITIES (10)
  // ==========================================
  {
    id: 'media-file-inspector',
    name: 'Media File Inspector',
    shortDescription: 'Inspect binary header magic numbers to identify genuine file types and containers.',
    category: 'media',
    iconName: 'FileCheck',
    keywords: ['media file inspector', 'magic bytes checker', 'verify file signature', 'detect file container'],
    offlineAvailable: true,
    instructions: ['Upload any media file', 'Inspect detected format, MIME type, and raw hexadecimal header'],
    relatedTools: ['audio-format-identifier', 'video-format-identifier'],
    component: MediaFileInspector
  },
  {
    id: 'audio-format-identifier',
    name: 'Audio Format Identifier',
    shortDescription: 'Determine true audio encoding format (MP3, WAV, AAC, OGG, FLAC) from magic bytes.',
    category: 'media',
    iconName: 'Music',
    keywords: ['audio format identifier', 'detect audio type', 'verify mp3 header', 'audio container check'],
    offlineAvailable: true,
    instructions: ['Upload audio file', 'Inspect container and encoding format'],
    relatedTools: ['media-file-inspector', 'video-format-identifier'],
    component: AudioFormatIdentifier
  },
  {
    id: 'video-format-identifier',
    name: 'Video Format Identifier',
    shortDescription: 'Verify video container format (MP4, WebM, MOV, MKV) via binary atom inspection.',
    category: 'media',
    iconName: 'Film',
    keywords: ['video format identifier', 'check video container', 'verify mp4 header', 'ebml webm check'],
    offlineAvailable: true,
    instructions: ['Upload video file', 'Inspect genuine container format'],
    relatedTools: ['media-file-inspector', 'audio-format-identifier'],
    component: VideoFormatIdentifier
  },
  {
    id: 'media-metadata-extractor',
    name: 'Media Metadata Extractor',
    shortDescription: 'Extract embedded EXIF data, ID3 tags, and container attributes from media files.',
    category: 'media',
    iconName: 'FileCheck',
    keywords: ['media metadata extractor', 'extract exif', 'read id3 tags', 'inspect media properties'],
    offlineAvailable: true,
    instructions: ['Upload media file', 'View extracted metadata tags and properties'],
    relatedTools: ['media-file-inspector', 'media-duration-checker'],
    component: MediaMetadataExtractor
  },
  {
    id: 'media-duration-checker',
    name: 'Media Duration Checker',
    shortDescription: 'Quickly extract exact playback duration from audio and video files without uploading.',
    category: 'media',
    iconName: 'Clock',
    keywords: ['media duration checker', 'check video duration', 'audio duration checker', 'quick duration check'],
    offlineAvailable: true,
    instructions: ['Select audio or video file', 'View duration in minutes, seconds, and milliseconds'],
    relatedTools: ['media-resolution-checker', 'file-bitrate-calculator'],
    component: MediaDurationChecker
  },
  {
    id: 'media-resolution-checker',
    name: 'Media Resolution Checker',
    shortDescription: 'Inspect exact pixel width, height, and megapixel count for images and videos.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['media resolution checker', 'check image dimensions', 'video resolution checker', 'megapixel counter'],
    offlineAvailable: true,
    instructions: ['Select image or video file', 'Inspect pixel dimensions and megapixels'],
    relatedTools: ['aspect-ratio-calculator', 'media-duration-checker'],
    component: MediaResolutionChecker
  },
  {
    id: 'file-bitrate-calculator',
    name: 'File Bitrate Calculator',
    shortDescription: 'Calculate overall audio/video bitrate from file size and total duration.',
    category: 'media',
    iconName: 'HardDrive',
    keywords: ['file bitrate calculator', 'calculate kbps', 'mbps bitrate formula', 'file size to bitrate'],
    offlineAvailable: true,
    instructions: ['Enter file size in MB', 'Enter duration in seconds', 'View bitrate in Kbps and Mbps'],
    relatedTools: ['media-file-size-estimator', 'aspect-ratio-calculator'],
    component: FileBitrateCalculator
  },
  {
    id: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    shortDescription: 'Calculate simplified aspect ratios and identify nearest standard cinema and social aspect ratios.',
    category: 'media',
    iconName: 'Maximize2',
    keywords: ['aspect ratio calculator', '16:9 ratio calculator', 'simplified aspect ratio', 'gcd ratio calculator'],
    offlineAvailable: true,
    instructions: ['Enter width and height in pixels', 'View simplified ratio (e.g. 16:9) and nearest standard format'],
    relatedTools: ['media-resolution-checker', 'video-aspect-ratio-converter'],
    component: AspectRatioCalculator
  },
  {
    id: 'frame-rate-calculator',
    name: 'Frame Rate Calculator',
    shortDescription: 'Calculate single-frame exposure budget in milliseconds across target frame rates.',
    category: 'media',
    iconName: 'Clock',
    keywords: ['frame rate calculator', 'fps frame time in ms', '60fps frame budget', 'animation frame time'],
    offlineAvailable: true,
    instructions: ['Enter target FPS (e.g. 24, 30, 60)', 'Inspect millisecond frame rendering budget'],
    relatedTools: ['video-duration-calculator', 'file-bitrate-calculator'],
    component: FrameRateCalculator
  },
  {
    id: 'media-file-size-estimator',
    name: 'Media File Size Estimator',
    shortDescription: 'Estimate video or audio file size from duration and bitrate encoding settings.',
    category: 'media',
    iconName: 'HardDrive',
    keywords: ['media file size estimator', 'video storage calculator', 'bitrate file size formula', 'projected media size'],
    offlineAvailable: true,
    instructions: ['Enter duration in minutes', 'Enter bitrate in Kbps', 'View estimated size in MB and GB'],
    relatedTools: ['file-bitrate-calculator', 'audio-file-size-calculator'],
    component: MediaFileSizeEstimator
  }
];
