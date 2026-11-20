import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
  QrCode,
  Download,
  AlertTriangle,
  Printer,
  Heart,
  ShieldAlert,
  Send,
  ExternalLink
} from 'lucide-react';
import QRCode from 'qrcode';
import { analyzeSms, sanitizeToGsm7 } from '../../../utils/communication/smsUtils';
import { generateVCard } from '../../../utils/communication/vcardUtils';

// ==========================================
// 1. WhatsApp Message Formatter
// ==========================================
export const WhatsAppMessageFormatter: React.FC = () => {
  const [text, setText] = useState(
    `Hello *Alex*! 👋\n\nYour order _#4891_ has shipped.\nTrack here: ~https://old-link.com~ https://lifetools.app\n\nUse coupon code \`\`\`SAVE20\`\`\` at checkout!`
  );
  const [phone, setPhone] = useState('15551234567');
  const [copied, setCopied] = useState(false);

  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMsg = encodeURIComponent(text);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  // Formatter preview
  const renderFormattedPreview = (raw: string) => {
    let formatted = raw
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~(.*?)~/g, '<del>$1</del>')
      .replace(/```(.*?)```/g, '<code class="bg-emerald-100 dark:bg-emerald-950 px-1 rounded font-mono text-xs">$1</code>')
      .replace(/\n/g, '<br>');

    return formatted;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Recipient Phone Number (with Country Code)
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 15551234567"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div className="flex items-end">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Send className="w-4 h-4" /> Open in WhatsApp Web / App
          </a>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">Message Text with WhatsApp Formatting</label>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>*bold*</span> · <span>_italic_</span> · <span>~strike~</span> · <span>```code```</span>
          </div>
        </div>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WhatsApp Chat Bubble Simulation</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Formatted Text'}
          </button>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl max-w-md ml-auto">
          <div
            className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-sans"
            dangerouslySetInnerHTML={{ __html: renderFormattedPreview(text) }}
          />
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 text-right mt-1.5 font-medium">
            10:42 AM ✓✓
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. WhatsApp Broadcast Text Builder
// ==========================================
export const WhatsAppBroadcastBuilder: React.FC = () => {
  const [template, setTemplate] = useState('Hi {name}, thanks for meeting with {company}! Your invoice {order_id} is ready.');
  const [sampleName, setSampleName] = useState('Jessica');
  const [sampleCompany, setSampleCompany] = useState('Acme Corp');
  const [sampleOrderId, setSampleOrderId] = useState('INV-2026-90');
  const [copied, setCopied] = useState(false);

  const preview = template
    .replace(/{name}/gi, sampleName)
    .replace(/{company}/gi, sampleCompany)
    .replace(/{order_id}/gi, sampleOrderId);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
          Broadcast Message Template (Use variables: {'{name}'}, {'{company}'}, {'{order_id}'})
        </label>
        <textarea
          rows={3}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sample {'{name}'}</label>
          <input
            type="text"
            value={sampleName}
            onChange={(e) => setSampleName(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sample {'{company}'}</label>
          <input
            type="text"
            value={sampleCompany}
            onChange={(e) => setSampleCompany(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sample {'{order_id}'}</label>
          <input
            type="text"
            value={sampleOrderId}
            onChange={(e) => setSampleOrderId(e.target.value)}
            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Merged Preview</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(preview);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Merged Message'}
          </button>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200">
          {preview}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. SMS Character Counter
// ==========================================
export const SmsCharacterCounter: React.FC = () => {
  const [text, setText] = useState('Your verification code is 482910. Valid for 10 minutes.');
  const analysis = analyzeSms(text);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Type SMS Message</label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total Characters</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{analysis.characterCount}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Detected Encoding</span>
          <span className={`text-sm font-bold ${analysis.hasNonGsmCharacters ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {analysis.encoding}
          </span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">SMS Segments</span>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{analysis.segmentCount}</span>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Remaining in Segment</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">{analysis.charsRemainingInSegment}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. SMS Segment Calculator
// ==========================================
export const SmsSegmentCalculator: React.FC = () => {
  const [text, setText] = useState('Great news! Your package 📦 has arrived at your door.');
  const analysis = analyzeSms(text);

  const cleanText = () => {
    setText(sanitizeToGsm7(text));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">SMS Content Analyzer</label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-sans"
        />
      </div>

      {analysis.hasNonGsmCharacters && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl space-y-2 text-xs text-amber-900 dark:text-amber-300">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Unicode Character Alert: SMS capacity reduced from 160 to 70 characters!
          </div>
          <p>
            Offending non-GSM characters: {analysis.nonGsmCharacters.map((c) => `"${c}"`).join(', ')}. Emojis or smart quotes switch the entire SMS message to UCS-2 encoding, requiring more billing segments.
          </p>
          <button
            onClick={cleanText}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
          >
            Sanitize Emojis &amp; Convert to Pure GSM-7
          </button>
        </div>
      )}

      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
        <span className="font-semibold text-slate-800 dark:text-slate-200 block">Billing &amp; Segment Breakdown:</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-slate-500 block">Encoding Standard</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{analysis.encoding}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Segments Charged</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{analysis.segmentCount} segment(s)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Cost Multiplier</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{analysis.estimatedCostMultiplier}x standard rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Message Template Library
// ==========================================
export const MessageTemplateLibrary: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'support' | 'appointment' | 'sales' | 'apology'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const templates = [
    { id: '1', cat: 'support', title: 'Ticket Received', text: 'Hi, we received your request (Ticket #{id}). Our team is investigating and will update you shortly.' },
    { id: '2', cat: 'appointment', title: 'Appointment Reminder', text: 'Reminder: You have an appointment tomorrow at {time}. Reply 1 to confirm or 2 to reschedule.' },
    { id: '3', cat: 'sales', title: 'Limited Time Offer', text: 'Special Offer: Enjoy 25% off all plans this week only! Use code WELCOME25 at checkout.' },
    { id: '4', cat: 'apology', title: 'Service Disruption', text: 'We sincerely apologize for the unexpected service interruption today. All systems have been restored.' },
    { id: '5', cat: 'support', title: 'Order Dispatched', text: 'Your order #{order_id} has shipped via courier! Track your delivery here: {tracking_url}' },
    { id: '6', cat: 'appointment', title: 'Meeting Confirmation', text: 'Thanks for scheduling a demo. Looking forward to speaking on {date} at {time}.' }
  ];

  const filtered = filter === 'all' ? templates : templates.filter((t) => t.cat === filter);

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-100 dark:bg-slate-900 text-xs w-fit">
        {(['all', 'support', 'appointment', 'sales', 'apology'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
              filter === cat ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(item.text);
                  setCopiedId(item.id);
                  setTimeout(() => setCopiedId(null), 2000);
                }}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. Message Case Formatter
// ==========================================
export const MessageCaseFormatter: React.FC = () => {
  const [text, setText] = useState('welcome to lifetools! everything is fast and client-side.');

  const sentenceCase = (str: string) =>
    str.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  const titleCase = (str: string) =>
    str.replace(/\b\w+/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  const alternatingCase = (str: string) =>
    str.split('').map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase())).join('');

  const formats = [
    { name: 'Sentence case', val: sentenceCase(text) },
    { name: 'Title Case', val: titleCase(text) },
    { name: 'UPPERCASE', val: text.toUpperCase() },
    { name: 'lowercase', val: text.toLowerCase() },
    { name: 'aLtErNaTiNg cAsE', val: alternatingCase(text) }
  ];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Input Text</label>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="space-y-3">
        {formats.map((f) => (
          <div
            key={f.name}
            className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs"
          >
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">{f.name}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{f.val}</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(f.val)}
              className="p-1.5 text-slate-500 hover:text-blue-600"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. Click-to-Call Link Generator
// ==========================================
export const ClickToCallGenerator: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('+1-555-234-5678');
  const [linkText, setLinkText] = useState('Call Our Support Team');
  const [copied, setCopied] = useState(false);

  const cleanTel = phoneNumber.replace(/[^0-9+]/g, '');
  const telUri = `tel:${cleanTel}`;
  const htmlTag = `<a href="${telUri}">${linkText}</a>`;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Telephone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Clickable Anchor Label</label>
          <input
            type="text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Call Link</span>
          <a
            href={telUri}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            {linkText}
          </a>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs flex items-center justify-between">
          <span>{htmlTag}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(htmlTag);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-1 text-slate-500 hover:text-blue-600"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. Contact Sharing QR Generator
// ==========================================
export const ContactSharingQrGenerator: React.FC = () => {
  const [name, setName] = useState('Alex Morgan');
  const [phone, setPhone] = useState('+1-555-0199');
  const [email, setEmail] = useState('alex@example.com');
  const [org, setOrg] = useState('Acme Corporation');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const vcard = generateVCard({
    id: 'qr_contact',
    firstName: name.split(' ')[0] || '',
    lastName: name.split(' ').slice(1).join(' ') || '',
    phone,
    email,
    organization: org
  });

  useEffect(() => {
    QRCode.toDataURL(vcard, { width: 280, margin: 2 }, (err, url) => {
      if (!err && url) setQrDataUrl(url);
    });
  }, [vcard]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Organization</label>
          <input
            type="text"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 flex flex-col items-center gap-4">
        {qrDataUrl && (
          <img src={qrDataUrl} alt="Contact QR Code" className="w-56 h-56 rounded-lg border border-slate-200 shadow-sm" />
        )}
        <a
          href={qrDataUrl}
          download="contact_sharing_qr.png"
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Download QR Code PNG
        </a>
      </div>
    </div>
  );
};

// ==========================================
// 9. Emergency Contact Card Generator
// ==========================================
export const EmergencyContactCardGenerator: React.FC = () => {
  const [fullName, setFullName] = useState('Jane Doe');
  const [bloodType, setBloodType] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('Mark Doe (Spouse)');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 555-9111');
  const [allergies, setAllergies] = useState('Penicillin, Peanuts');
  const [medications, setMedications] = useState('Asthma Inhaler');
  const [physician, setPhysician] = useState('Dr. Smith (+1 555-8888)');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Type</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          >
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Contact Person</label>
          <input
            type="text"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Contact Phone</label>
          <input
            type="text"
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Known Allergies</label>
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Physician / Doctor</label>
          <input
            type="text"
            value={physician}
            onChange={(e) => setPhysician(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print Wallet Emergency Card
        </button>
      </div>

      {/* Printable ICE Card View */}
      <div className="flex justify-center p-4 bg-slate-100 dark:bg-slate-950 rounded-xl">
        <div className="w-80 p-5 bg-white border-2 border-rose-600 rounded-xl shadow-md text-slate-900 space-y-3 font-sans">
          <div className="flex items-center justify-between border-b-2 border-rose-600 pb-2">
            <span className="text-xs font-black tracking-wider uppercase text-rose-600 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" /> In Case of Emergency (ICE)
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-xs">
              {bloodType}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Cardholder Name</span>
              <span className="font-bold text-sm text-slate-900">{fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Emergency Contact</span>
              <span className="font-semibold text-slate-900">{emergencyContact}</span>
              <span className="block text-rose-600 font-bold font-mono">{emergencyPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Known Allergies</span>
              <span className="font-medium text-slate-800">{allergies || 'None reported'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Physician</span>
              <span className="font-medium text-slate-800">{physician}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
