import React, { useState } from 'react';
import {
  Video,
  Share2,
  Camera,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Copy,
  Clock,
  Code,
  Download,
  Image as ImageIcon
} from 'lucide-react';

export function extractYoutubeId(input: string): string | null {
  const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
  return null;
}

// -------------------------------------------------------------
// 1. YouTube Thumbnail Viewer
// -------------------------------------------------------------
export const YoutubeThumbnailViewer: React.FC = () => {
  const [input, setInput] = useState('');
  const videoId = extractYoutubeId(input) || 'dQw4w9WgXcQ';

  const resolutions = [
    { label: 'HD 1080p (maxresdefault)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
    { label: 'High Quality (hqdefault)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
    { label: 'Medium Quality (mqdefault)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
    { label: 'Standard (default)', url: `https://img.youtube.com/vi/${videoId}/default.jpg` }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">YouTube Video URL or ID</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter YouTube video link or 11-character video ID"
          className="w-full px-4 py-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resolutions.map((res) => (
          <div key={res.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{res.label}</span>
            <img src={res.url} alt={res.label} className="w-full rounded-lg object-cover bg-slate-100" />
            <a
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Full Image
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. YouTube Video Information Extractor
// -------------------------------------------------------------
export const YoutubeInfoExtractor: React.FC = () => {
  const [url, setUrl] = useState('');
  const videoId = extractYoutubeId(url) || '';

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube video URL (e.g. https://www.youtube.com/watch?v=...)"
        className="w-full px-4 py-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400">Extracted Video ID:</span>
          <span className="font-bold text-emerald-500">{videoId || '—'}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400">Canonical Watch URL:</span>
          <span className="text-slate-700 dark:text-slate-300">{videoId ? `https://www.youtube.com/watch?v=${videoId}` : '—'}</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
          <span className="text-slate-400">Short Share URL:</span>
          <span className="text-slate-700 dark:text-slate-300">{videoId ? `https://youtu.be/${videoId}` : '—'}</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. YouTube Timestamp Link Generator
// -------------------------------------------------------------
export const YoutubeTimestampGenerator: React.FC = () => {
  const [videoId, setVideoId] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);

  const totalSec = minutes * 60 + seconds;
  const timestampUrl = videoId ? `https://youtu.be/${videoId}?t=${totalSec}` : '';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Video ID</label>
          <input type="text" value={videoId} onChange={(e) => setVideoId(e.target.value)} placeholder="11-character ID" className="w-full px-3 py-2 text-xs font-mono rounded-xl border" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Minutes</label>
          <input type="number" min={0} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} className="w-full px-3 py-2 text-xs font-mono rounded-xl border" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Seconds</label>
          <input type="number" min={0} max={59} value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="w-full px-3 py-2 text-xs font-mono rounded-xl border" />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center font-mono text-xs">
        <span className="text-slate-500">Timestamped Link:</span>
        <a href={timestampUrl} target="_blank" rel="noreferrer" className="font-bold text-emerald-500 hover:underline">
          {timestampUrl}
        </a>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. YouTube Embed Generator
// -------------------------------------------------------------
export const YoutubeEmbedGenerator: React.FC = () => {
  const [videoId, setVideoId] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [privacy, setPrivacy] = useState(true);

  const effectiveId = videoId.trim() || 'VIDEO_ID';
  const domain = privacy ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const iframeCode = `<iframe width="560" height="315" src="${domain}/embed/${effectiveId}${autoplay ? '?autoplay=1' : ''}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <input type="text" value={videoId} onChange={(e) => setVideoId(e.target.value)} placeholder="Enter Video ID" className="px-3 py-2 text-xs font-mono rounded-xl border" />
        <label className="text-xs font-bold flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />
          <span>Privacy Enhanced (youtube-nocookie)</span>
        </label>
      </div>

      <textarea rows={4} readOnly value={iframeCode} className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
    </div>
  );
};

// -------------------------------------------------------------
// 5. Social Media Link Generator
// -------------------------------------------------------------
export const SocialMediaLinkGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter link URL to share" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter share message / text" className="px-3 py-2 text-xs rounded-xl border" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href={twitter} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs font-bold flex justify-between items-center text-blue-400">
          <span>X / Twitter Share</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a href={linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs font-bold flex justify-between items-center text-blue-600">
          <span>LinkedIn Share</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <a href={whatsapp} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs font-bold flex justify-between items-center text-emerald-500">
          <span>WhatsApp Share</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. Instagram Profile Link Generator
// -------------------------------------------------------------
export const InstagramLinkGenerator: React.FC = () => {
  const [username, setUsername] = useState('');
  const clean = username.replace(/^@/, '').trim();
  const profileUrl = clean ? `https://instagram.com/${clean}` : '';

  return (
    <div className="space-y-4">
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter Instagram username (e.g. username)" className="px-3.5 py-2 text-xs rounded-xl border font-mono" />
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">Profile URL:</span>
        {profileUrl ? (
          <a href={profileUrl} target="_blank" rel="noreferrer" className="font-bold text-pink-600 hover:underline">
            {profileUrl}
          </a>
        ) : (
          <span className="text-slate-400">Enter a username above</span>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. WhatsApp Click-to-Chat Link Generator
// -------------------------------------------------------------
export const WhatsappLinkGenerator: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}${msg ? `?text=${encodeURIComponent(msg)}` : ''}` : '';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone with country code (e.g. 15551234567)" className="px-3 py-2 text-xs rounded-xl border font-mono" />
        <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Enter optional prefilled message" className="px-3 py-2 text-xs rounded-xl border" />
      </div>
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">Click-to-Chat Link:</span>
        {waUrl ? (
          <a href={waUrl} target="_blank" rel="noreferrer" className="font-bold text-emerald-500 hover:underline break-all">
            {waUrl}
          </a>
        ) : (
          <span className="text-slate-400">Enter a phone number above</span>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 8. Email Link Generator (mailto:)
// -------------------------------------------------------------
export const EmailLinkGenerator: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter recipient email address" className="px-3 py-2 text-xs rounded-xl border font-mono" />
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject" className="px-3 py-2 text-xs rounded-xl border" />
      </div>
      <textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter email message body..." className="w-full text-xs p-3 rounded-xl border" />
      <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl font-mono text-xs break-all font-bold text-emerald-500">
        {mailto || 'mailto:name@example.com'}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 9. Telephone Link Generator
// -------------------------------------------------------------
export const TelephoneLinkGenerator: React.FC = () => {
  const [number, setNumber] = useState('');
  const cleanNumber = number.replace(/[^0-9+]/g, '');
  const telUri = cleanNumber ? `tel:${cleanNumber}` : '';

  return (
    <div className="space-y-4">
      <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter phone number (e.g. +1 555-0199)" className="w-full px-3.5 py-2 text-xs rounded-xl border font-mono" />
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">RFC 3966 URI:</span>
        {telUri ? (
          <a href={telUri} className="font-bold text-emerald-500 hover:underline">{telUri}</a>
        ) : (
          <span className="text-slate-400">Enter a phone number above</span>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 10. Google Maps Link Generator
// -------------------------------------------------------------
export const GoogleMapsLinkGenerator: React.FC = () => {
  const [location, setLocation] = useState('');
  const mapsUrl = location.trim() ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : '';

  return (
    <div className="space-y-4">
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter address, city, place, or coordinates" className="w-full px-3.5 py-2 text-xs rounded-xl border" />
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border flex justify-between items-center text-xs font-mono">
        <span className="text-slate-500">Google Maps Search URL:</span>
        {mapsUrl ? (
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="font-bold text-blue-500 hover:underline truncate max-w-sm">
            {mapsUrl}
          </a>
        ) : (
          <span className="text-slate-400">Enter a location above</span>
        )}
      </div>
    </div>
  );
};
