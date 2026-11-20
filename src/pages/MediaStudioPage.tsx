import React, { useState, useMemo } from 'react';
import { SEO } from '../components/common/SEO';
import { MEDIA_TOOLS_REGISTRY } from '../data/mediaToolsRegistry';
import { inspectMagicBytes, MediaSignature } from '../utils/media/mediaFileUtils';
import {
  Film,
  Image as ImageIcon,
  Music,
  Video,
  Sparkles,
  Search,
  Upload,
  CheckCircle,
  HardDrive,
  ShieldCheck,
  ArrowRight,
  Maximize2,
  FileCheck
} from 'lucide-react';
import { DynamicIcon } from '../components/common/DynamicIcon';

type MediaTab = 'all' | 'image' | 'audio' | 'video' | 'gif' | 'utilities';

export const MediaStudioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MediaTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [droppedFile, setDroppedFile] = useState<{
    file: File;
    signature: MediaSignature;
    url: string;
  } | null>(null);

  const handleDropzoneFile = async (file: File) => {
    const slice = await file.slice(0, 64).arrayBuffer();
    const signature = inspectMagicBytes(slice);
    const url = URL.createObjectURL(file);
    setDroppedFile({ file, signature, url });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleDropzoneFile(e.dataTransfer.files[0]);
    }
  };

  // Filter tools based on active tab and search query
  const filteredTools = useMemo(() => {
    return MEDIA_TOOLS_REGISTRY.filter((tool) => {
      // Tab filter
      if (activeTab === 'image' && !tool.id.startsWith('image') && !tool.id.includes('photo') && !tool.id.includes('post') && !tool.id.includes('thumbnail')) return false;
      if (activeTab === 'audio' && !tool.id.startsWith('audio')) return false;
      if (activeTab === 'video' && !tool.id.startsWith('video') && !tool.id.includes('to-video')) return false;
      if (activeTab === 'gif' && !tool.id.includes('gif')) return false;
      if (activeTab === 'utilities' && !tool.id.includes('calculator') && !tool.id.includes('inspector') && !tool.id.includes('checker') && !tool.id.includes('identifier') && !tool.id.includes('extractor') && !tool.id.includes('estimator')) return false;

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.shortDescription.toLowerCase().includes(q) ||
          tool.keywords.some((k) => k.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      <SEO
        title="Media Studio — 70 Free Browser-Based Image, Audio & Video Tools | LifeTools"
        description="Comprehensive client-side media studio: image editing, audio cutters and recorders, video trimmers, GIF animation creators, and media file format inspectors. 100% private, zero uploads."
      />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 text-white p-8 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5" />
            Media Studio Hub • 70 Tools
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Professional Media Studio in Your Browser
          </h1>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
            Edit photos, manipulate audio buffers, trim and compress videos, build animated GIFs, and inspect binary media headers. 100% client-side execution with zero cloud uploads or data tracking.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-rose-100">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300" /> HTML5 Canvas + Web Audio API
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <HardDrive className="w-4 h-4 text-sky-300" /> Offline Capable PWA
            </span>
          </div>
        </div>
      </div>

      {/* Universal Media Quick-Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="rounded-2xl border-2 border-dashed border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-6 sm:p-8 text-center transition-all hover:border-rose-400"
      >
        {!droppedFile ? (
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <Upload className="w-10 h-10 text-rose-500 mb-3 animate-bounce" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Drop any image, audio, or video file here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              Instantly inspect container formats, detect genuine MIME types, and launch matching media tools directly.
            </p>
            <input
              type="file"
              onChange={(e) => e.target.files?.[0] && handleDropzoneFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {droppedFile.file.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {droppedFile.signature.container} • {(droppedFile.file.size / (1024 * 1024)).toFixed(2)} MB • {droppedFile.signature.mime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDroppedFile(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Clear File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Tools', count: 70 },
            { id: 'image', label: 'Image Studio', count: 20 },
            { id: 'audio', label: 'Audio Tools', count: 15 },
            { id: 'video', label: 'Video Tools', count: 15 },
            { id: 'gif', label: 'GIF & Animation', count: 10 },
            { id: 'utilities', label: 'Media Utilities', count: 10 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MediaTab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search media tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <a
            key={tool.id}
            href={`#/tool/${tool.id}`}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/5 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full uppercase">
                  Media
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tool.shortDescription}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400 mt-4">
              <span>Open Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
