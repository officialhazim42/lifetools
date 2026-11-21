import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Calendar,
  Hash,
  Eye,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

// ==========================================
// 1. Social Media Bio Formatter
// ==========================================
export const SocialMediaBioFormatter: React.FC = () => {
  const [bioText, setBioText] = useState('');
  const [platform, setPlatform] = useState<'instagram' | 'twitter' | 'tiktok' | 'linkedin'>('instagram');
  const [copied, setCopied] = useState(false);

  const limits: Record<string, number> = {
    instagram: 150,
    twitter: 160,
    tiktok: 80,
    linkedin: 220
  };

  const limit = limits[platform];
  const charCount = bioText.length;
  const isOver = charCount > limit;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Target Platform:</label>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-900 text-xs">
          {(['instagram', 'twitter', 'tiktok', 'linkedin'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                platform === p ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Your Bio Content</label>
          <span className={`text-xs font-mono font-medium ${isOver ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
            {charCount} / {limit} characters
          </span>
        </div>
        <textarea
          rows={5}
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          placeholder="Enter your profile bio or headline points..."
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg focus:ring-2 ${
            isOver ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
          }`}
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {platform.toUpperCase()} Profile Bio Simulation
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(bioText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Bio'}
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-sans">
          {bioText}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. Instagram Caption Formatter
// ==========================================
export const InstagramCaptionFormatter: React.FC = () => {
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);

  const hashtagCount = (caption.match(/#[a-zA-Z0-9_]+/g) || []).length;
  const charCount = caption.length;

  const cleanSpacing = () => {
    // Replaces empty lines with clean zero-width or bullet dividers for Instagram
    const lines = caption.split('\n');
    const cleaned = lines.map((l) => (l.trim() === '' ? '⠀' : l)).join('\n');
    setCaption(cleaned);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Instagram Caption</label>
          <div className="flex items-center gap-3 text-xs">
            <span className={hashtagCount > 30 ? 'text-rose-500 font-bold' : 'text-slate-500'}>
              {hashtagCount} / 30 Hashtags
            </span>
            <span className={charCount > 2200 ? 'text-rose-500 font-bold' : 'text-slate-500'}>
              {charCount} / 2,200 Chars
            </span>
          </div>
        </div>
        <textarea
          rows={6}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={cleanSpacing}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
        >
          Fix Clean Line Breaks (Anti-Collapsing)
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Formatted Caption'}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. Hashtag Organizer
// ==========================================
export const HashtagOrganizer: React.FC = () => {
  const [rawInput, setRawInput] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanHashtags = () => {
    const tokens = rawInput.split(/[\s,;|]+/);
    const set = new Set<string>();
    for (let t of tokens) {
      t = t.trim().toLowerCase().replace(/^#+/, '');
      if (t) set.add(`#${t}`);
    }
    return Array.from(set);
  };

  const hashtags = cleanHashtags();
  const outputString = hashtags.join(' ');

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Paste Raw Keywords or Messy Hashtags
        </label>
        <textarea
          rows={3}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Organized Unique Hashtags ({hashtags.length})
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(outputString);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {hashtags.map((h, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 font-mono"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. Social Media Content Calendar
// ==========================================
export const SocialMediaContentCalendar: React.FC = () => {
  const [posts, setPosts] = useState([
    { id: '1', date: '2026-11-20', platform: 'LinkedIn', topic: 'Productivity Tips', status: 'Ready' },
    { id: '2', date: '2026-11-22', platform: 'Twitter/X', topic: 'Architecture Deep Dive', status: 'Draft' },
    { id: '3', date: '2026-11-25', platform: 'Instagram', topic: 'Behind the Scenes Reel', status: 'Idea' }
  ]);
  const [newTopic, setNewTopic] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPlatform, setNewPlatform] = useState('Twitter/X');

  const addPost = () => {
    if (!newTopic.trim()) return;
    setPosts([
      ...posts,
      { id: Date.now().toString(), date: newDate, platform: newPlatform, topic: newTopic.trim(), status: 'Idea' }
    ]);
    setNewTopic('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Platform</label>
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          >
            <option>Twitter/X</option>
            <option>LinkedIn</option>
            <option>Instagram</option>
            <option>YouTube</option>
          </select>
        </div>
        <div className="sm:col-span-2 flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Post Title / Topic</label>
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="e.g. Launch Day announcement..."
              className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
          <button
            onClick={addPost}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shrink-0"
          >
            Add Slot
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Scheduled Content Queue</span>
        {posts.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500">{p.date}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {p.platform}
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.topic}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{p.status}</span>
              <button
                onClick={() => setPosts(posts.filter((item) => item.id !== p.id))}
                className="text-slate-400 hover:text-rose-500 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. Character Limit Checker
// ==========================================
export const CharacterLimitChecker: React.FC = () => {
  const [content, setContent] = useState('');

  const platforms = [
    { name: 'X / Twitter Post', limit: 280 },
    { name: 'Threads Post', limit: 500 },
    { name: 'Instagram Caption', limit: 2200 },
    { name: 'LinkedIn Post', limit: 3000 },
    { name: 'YouTube Video Description', limit: 5000 },
    { name: 'Pinterest Description', limit: 500 },
    { name: 'TikTok Caption', limit: 2200 }
  ];

  const length = content.length;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Type or Paste Text to Check Limits
        </label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type or paste text to check character limits across platforms..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {platforms.map((p) => {
          const isOver = length > p.limit;
          const remaining = p.limit - length;
          const percentage = Math.min(100, Math.round((length / p.limit) * 100));

          return (
            <div
              key={p.name}
              className={`p-3.5 rounded-xl border ${
                isOver
                  ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                <span className={`text-xs font-mono font-medium ${isOver ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-500'}`}>
                  {length} / {p.limit}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full transition-all ${isOver ? 'bg-rose-500' : percentage > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500">
                {isOver ? `Exceeds by ${length - p.limit} characters` : `${remaining} characters remaining`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 6. YouTube Description Formatter
// ==========================================
export const YouTubeDescriptionFormatter: React.FC = () => {
  const [summary, setSummary] = useState('');
  const [timestamps, setTimestamps] = useState('');
  const [links, setLinks] = useState('');
  const [copied, setCopied] = useState(false);

  const output = `${summary}\n\n⏱️ TIMESTAMPS:\n${timestamps}\n\n🔗 LINKS & RESOURCES:\n${links}`;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Video Overview / Summary</label>
        <textarea
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter video overview or summary..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Chapter Timestamps (MM:SS - Title)</label>
          <textarea
            rows={4}
            value={timestamps}
            onChange={(e) => setTimestamps(e.target.value)}
            placeholder={"00:00 - Introduction\n01:30 - Core Architecture\n04:15 - Walkthrough"}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Links & Social Profiles</label>
          <textarea
            rows={4}
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            placeholder="Enter relevant links and resources..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Formatted YouTube Description</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Description'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 7. YouTube Tags Organizer
// ==========================================
export const YouTubeTagsOrganizer: React.FC = () => {
  const [rawTags, setRawTags] = useState('');
  const [copied, setCopied] = useState(false);

  const cleanTags = () => {
    return Array.from(
      new Set(
        rawTags
          .split(/[,;\n]+/)
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      )
    );
  };

  const tags = cleanTags();
  const commaSeparated = tags.join(', ');
  const charLength = commaSeparated.length;

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Paste Raw Tags (Separated by commas or newlines)
        </label>
        <textarea
          rows={3}
          value={rawTags}
          onChange={(e) => setRawTags(e.target.value)}
          placeholder="Enter comma-separated video tags..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Formatted Comma-Separated Tags ({tags.length})
            </span>
            <span className={`text-[11px] font-mono ${charLength > 500 ? 'text-rose-500 font-bold' : 'text-slate-500'}`}>
              {charLength} / 500 characters limit
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(commaSeparated);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Tags'}
          </button>
        </div>
        <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {commaSeparated}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 8. LinkedIn Post Formatter
// ==========================================
export const LinkedInPostFormatter: React.FC = () => {
  const [hook, setHook] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('');
  const [copied, setCopied] = useState(false);

  const fullPost = `${hook}\n\n${body}\n\n${cta}`;
  const hookLength = hook.length;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">The Hook (First 2 Lines Before "See More")</label>
          <span className={`text-xs font-mono ${hookLength > 140 ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
            {hookLength} chars (Recommended &lt; 140 chars)
          </span>
        </div>
        <input
          type="text"
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="Enter hook headline (first 2 lines before 'See More')..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Main Body & Bullet Points</label>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Enter main body text and bullet points..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Call to Action (CTA)</label>
        <input
          type="text"
          value={cta}
          onChange={(e) => setCta(e.target.value)}
          placeholder="Enter call-to-action or concluding question..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">LinkedIn Post Simulation</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(fullPost);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Post'}
          </button>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-sans">
          {fullPost}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. Social Media Username Availability Checklist
// ==========================================
export const SocialUsernameChecker: React.FC = () => {
  const [handle, setHandle] = useState('lifetoolsapp');

  const cleanHandle = handle.replace(/^@/, '').trim();

  const platforms = [
    { name: 'GitHub', url: `https://github.com/${cleanHandle}`, rule: 'Alphanumeric and single hyphens (1-39 chars)' },
    { name: 'X / Twitter', url: `https://x.com/${cleanHandle}`, rule: 'Alphanumeric and underscores (1-15 chars)' },
    { name: 'Instagram', url: `https://instagram.com/${cleanHandle}`, rule: 'Letters, numbers, periods, underscores (1-30 chars)' },
    { name: 'YouTube', url: `https://youtube.com/@${cleanHandle}`, rule: 'Letters, numbers, hyphens, underscores (3-30 chars)' },
    { name: 'LinkedIn', url: `https://linkedin.com/in/${cleanHandle}`, rule: 'Letters, numbers, hyphens (3-100 chars)' },
    { name: 'TikTok', url: `https://tiktok.com/@${cleanHandle}`, rule: 'Letters, numbers, underscores, periods (2-24 chars)' },
    { name: 'Reddit', url: `https://reddit.com/user/${cleanHandle}`, rule: 'Letters, numbers, underscores (3-20 chars)' }
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Username / Handle to Verify</label>
        <div className="relative">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. username"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-8"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-sm">@</span>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <span className="font-semibold text-slate-800 dark:text-slate-200 block">Verification Protocol:</span>
        <p>
          Social networks do not provide unauthenticated universal APIs for instant availability checks. Click any direct link below to check whether the profile page is active or unclaimed on that platform.
        </p>
      </div>

      <div className="space-y-2.5">
        {platforms.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs hover:border-blue-400 transition-colors"
          >
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm block">{p.name}</span>
              <span className="text-slate-500 text-[11px]">{p.rule}</span>
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
            >
              Check on {p.name} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. Social Media Post Preview
// ==========================================
export const SocialMediaPostPreview: React.FC = () => {
  const [authorName, setAuthorName] = useState('');
  const [handle, setHandle] = useState('');
  const [content, setContent] = useState('');
  const [previewPlatform, setPreviewPlatform] = useState<'x' | 'linkedin' | 'instagram'>('x');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Author Name</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter author name"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Handle / Username</label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter username handle"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Post Text</label>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post preview content here..."
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Preview Layout:</label>
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-900 text-xs">
          {(['x', 'linkedin', 'instagram'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPreviewPlatform(p)}
              className={`px-3 py-1 rounded-md font-medium uppercase transition-colors ${
                previewPlatform === p ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {p === 'x' ? 'X / Twitter' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Card */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-slate-50 dark:bg-slate-950 flex justify-center">
        <div className="max-w-md w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              {authorName[0] || 'U'}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">{authorName}</div>
              <div className="text-xs text-slate-500">@{handle} · Just now</div>
            </div>
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>💬 Reply</span>
            <span>🔁 Repost</span>
            <span>❤️ Like</span>
            <span>📤 Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};
